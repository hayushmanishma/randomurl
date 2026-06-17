import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { pickRandom, type Category } from "./sites";

const MAX_ROLLS_PER_MINUTE = 30;
const ALLOWED: Category[] = ["knowledge","gaming","dev","art","music","science","tools","fun","video","news","sports","food"];

export const rollRandomSite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { category?: string | null } | undefined) => ({
    category: input?.category && ALLOWED.includes(input.category as Category) ? (input.category as Category) : null,
  }))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    // banned check
    const { data: prof } = await supabase.from("profiles").select("banned, ban_reason").eq("id", userId).maybeSingle();
    if (prof && (prof as any).banned) {
      throw new Error(`חשבונך הושעה${(prof as any).ban_reason ? `: ${(prof as any).ban_reason}` : ""}`);
    }

    const sinceIso = new Date(Date.now() - 60_000).toISOString();
    const { count, error: countError } = await supabase
      .from("roll_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", sinceIso);
    if (countError) throw new Error("Failed to check rate limit");
    if ((count ?? 0) >= MAX_ROLLS_PER_MINUTE) {
      throw new Error(`לאט יותר! נסה שוב בעוד דקה (מקס ${MAX_ROLLS_PER_MINUTE} בדקה).`);
    }

    const pick = pickRandom(data.category);
    const { error: insertError } = await (supabase as any).from("roll_history").insert({
      user_id: userId,
      url: pick.site.url,
      site_name: pick.site.name,
      rarity: pick.rarity,
      rarity_value: pick.rarityValue,
      category: data.category ?? "all",
    });
    if (insertError) throw new Error("Failed to record history");

    return {
      url: pick.site.url,
      name: pick.site.name,
      rarity: pick.rarity,
      rarityValue: pick.rarityValue,
      color: pick.color,
      emoji: pick.emoji,
      category: pick.category,
    };
  });
