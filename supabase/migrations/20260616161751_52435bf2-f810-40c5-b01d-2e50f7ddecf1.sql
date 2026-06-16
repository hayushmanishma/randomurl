
CREATE TABLE public.roll_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  rarity TEXT NOT NULL,
  rarity_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roll_history TO authenticated;
GRANT ALL ON public.roll_history TO service_role;

ALTER TABLE public.roll_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own_history" ON public.roll_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_history" ON public.roll_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_delete_own_history" ON public.roll_history
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_roll_history_user_created ON public.roll_history(user_id, created_at DESC);
