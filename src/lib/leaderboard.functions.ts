import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LeaderboardEntry = {
  user_id: string;
  display_name: string;
  best_rarity: number;
  rarity: string;
  site_name: string;
  url: string;
  category: string;
  created_at: string;
  total_rolls: number;
};

export const getLeaderboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { category?: string | null } | undefined) => ({ category: input?.category ?? null }))
  .handler(async ({ context, data }): Promise<LeaderboardEntry[]> => {
    const { data: rows, error } = await (context.supabase as any).rpc("get_leaderboard", { _category: data.category });
    if (error) throw new Error(error.message);
    return (rows ?? []) as LeaderboardEntry[];
  });
