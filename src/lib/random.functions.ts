// Server function with auth + rate limiting (anti-cheat).
// Rolls a random site for the authenticated user and records it in history.
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { pickRandom } from "./sites";

const MAX_ROLLS_PER_MINUTE = 30;

export const rollRandomSite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    // Rate limit: count rolls in the last 60s for this user.
    const sinceIso = new Date(Date.now() - 60_000).toISOString();
    const { count, error: countError } = await supabase
      .from("roll_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", sinceIso);

    if (countError) {
      throw new Error("Failed to check rate limit");
    }
    if ((count ?? 0) >= MAX_ROLLS_PER_MINUTE) {
      throw new Error(`לאט יותר! נסה שוב בעוד דקה (מקס ${MAX_ROLLS_PER_MINUTE} בדקה).`);
    }

    const pick = pickRandom();
    const { error: insertError } = await supabase.from("roll_history").insert({
      user_id: userId,
      url: pick.site.url,
      site_name: pick.site.name,
      rarity: pick.rarity,
      rarity_value: pick.rarityValue,
    });
    if (insertError) {
      throw new Error("Failed to record history");
    }

    return {
      url: pick.site.url,
      name: pick.site.name,
      rarity: pick.rarity,
      rarityValue: pick.rarityValue,
      color: pick.color,
      emoji: pick.emoji,
    };
  });
