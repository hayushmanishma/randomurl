DROP VIEW IF EXISTS public.leaderboard;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  best_rarity int,
  rarity text,
  site_name text,
  url text,
  created_at timestamptz,
  total_rolls int
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
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
  ) total ON true
  ORDER BY best.rarity_value DESC
  LIMIT 100;
$$;

REVOKE EXECUTE ON FUNCTION public.get_leaderboard() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO authenticated;