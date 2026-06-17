
-- Categories on rolls
ALTER TABLE public.roll_history ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'all';
CREATE INDEX IF NOT EXISTS roll_history_user_cat_rarity_idx ON public.roll_history(user_id, category, rarity_value DESC);

-- Profile moderation fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned boolean NOT NULL DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ban_reason text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS warning text;

-- Roles
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_roles_self_read ON public.user_roles;
CREATE POLICY user_roles_self_read ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- First caller wins admin
CREATE OR REPLACE FUNCTION public.claim_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE has_any boolean;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE role='admin') INTO has_any;
  IF has_any THEN
    RETURN EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=auth.uid() AND role='admin');
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(),'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END; $$;

-- Updated leaderboard with optional category filter
DROP FUNCTION IF EXISTS public.get_leaderboard();
DROP FUNCTION IF EXISTS public.get_leaderboard(text);
CREATE OR REPLACE FUNCTION public.get_leaderboard(_category text DEFAULT NULL)
RETURNS TABLE(user_id uuid, display_name text, best_rarity integer, rarity text, site_name text, url text, category text, created_at timestamptz, total_rolls integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.display_name, best.rarity_value, best.rarity, best.site_name, best.url, best.category, best.created_at, total.total_rolls
  FROM public.profiles p
  JOIN LATERAL (
    SELECT rarity_value, rarity, site_name, url, category, created_at
    FROM public.roll_history rh
    WHERE rh.user_id = p.id AND (_category IS NULL OR rh.category = _category)
    ORDER BY rh.rarity_value DESC, rh.created_at ASC LIMIT 1
  ) best ON true
  JOIN LATERAL (
    SELECT COUNT(*)::int AS total_rolls FROM public.roll_history rh2
    WHERE rh2.user_id = p.id AND (_category IS NULL OR rh2.category = _category)
  ) total ON true
  ORDER BY best.rarity_value DESC LIMIT 100;
$$;

-- Name change suggestions to admin
CREATE TABLE IF NOT EXISTS public.name_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_name text,
  suggested_name text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.name_suggestions TO authenticated;
GRANT ALL ON public.name_suggestions TO service_role;
ALTER TABLE public.name_suggestions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ns_self_insert ON public.name_suggestions;
CREATE POLICY ns_self_insert ON public.name_suggestions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS ns_read ON public.name_suggestions;
CREATE POLICY ns_read ON public.name_suggestions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- Admin RPCs
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE(id uuid, display_name text, banned boolean, ban_reason text, warning text, created_at timestamptz, total_rolls int)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY SELECT p.id, p.display_name, p.banned, p.ban_reason, p.warning, p.created_at,
    (SELECT COUNT(*)::int FROM public.roll_history rh WHERE rh.user_id = p.id)
    FROM public.profiles p ORDER BY p.created_at DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_update_user(_user_id uuid, _display_name text DEFAULT NULL, _banned boolean DEFAULT NULL, _ban_reason text DEFAULT NULL, _warning text DEFAULT NULL)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.profiles SET
    display_name = COALESCE(_display_name, display_name),
    banned = COALESCE(_banned, banned),
    ban_reason = CASE WHEN _ban_reason IS NULL THEN ban_reason ELSE NULLIF(_ban_reason,'') END,
    warning = CASE WHEN _warning IS NULL THEN warning ELSE NULLIF(_warning,'') END
  WHERE id = _user_id;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_list_suggestions()
RETURNS TABLE(id uuid, user_id uuid, display_name text, current_name text, suggested_name text, reason text, status text, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  RETURN QUERY SELECT s.id, s.user_id, p.display_name, s.current_name, s.suggested_name, s.reason, s.status, s.created_at
    FROM public.name_suggestions s LEFT JOIN public.profiles p ON p.id = s.user_id
    ORDER BY s.created_at DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_resolve_suggestion(_id uuid, _approve boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s_user uuid; s_name text;
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT user_id, suggested_name INTO s_user, s_name FROM public.name_suggestions WHERE id = _id;
  IF s_user IS NULL THEN RETURN; END IF;
  IF _approve THEN
    UPDATE public.profiles SET display_name = s_name WHERE id = s_user;
    UPDATE public.name_suggestions SET status='approved' WHERE id = _id;
  ELSE
    UPDATE public.name_suggestions SET status='rejected' WHERE id = _id;
  END IF;
END; $$;

-- Block banned users from inserting rolls
DROP POLICY IF EXISTS users_insert_own_history ON public.roll_history;
CREATE POLICY users_insert_own_history ON public.roll_history FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND NOT EXISTS(SELECT 1 FROM public.profiles WHERE id = auth.uid() AND banned = true));
