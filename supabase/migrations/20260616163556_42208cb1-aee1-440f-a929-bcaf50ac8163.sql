
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_self_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1),
      'משתמש'
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.profiles (id, display_name)
SELECT u.id, COALESCE(
  u.raw_user_meta_data->>'full_name',
  u.raw_user_meta_data->>'name',
  split_part(u.email, '@', 1),
  'משתמש'
)
FROM auth.users u
ON CONFLICT (id) DO NOTHING;

-- Leaderboard view: each user's best roll
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  p.id AS user_id,
  p.display_name,
  best.rarity_value AS best_rarity,
  best.rarity,
  best.site_name,
  best.url,
  best.created_at,
  total.total_rolls
FROM public.profiles p
JOIN LATERAL (
  SELECT rarity_value, rarity, site_name, url, created_at
  FROM public.roll_history rh
  WHERE rh.user_id = p.id
  ORDER BY rh.rarity_value DESC, rh.created_at ASC
  LIMIT 1
) best ON true
JOIN LATERAL (
  SELECT COUNT(*)::int AS total_rolls
  FROM public.roll_history rh2
  WHERE rh2.user_id = p.id
) total ON true;

GRANT SELECT ON public.leaderboard TO anon, authenticated;
