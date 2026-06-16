
ALTER VIEW public.leaderboard SET (security_invoker = true);

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
