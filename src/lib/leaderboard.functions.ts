import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LeaderboardEntry = {
  user_id: string;
  display_name: string;
  best_rarity: number;
  rarity: string;
  site_name: string;
  url: string;
  created_at: string;
  total_rolls: number;
};

export const getLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LeaderboardEntry[]> => {
    const { data, error } = await context.supabase
      .from("leaderboard" as any)
      .select("*")
      .order("best_rarity", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data ?? []) as unknown as LeaderboardEntry[];
  });
