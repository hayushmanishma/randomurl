import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AdminUser = {
  id: string;
  display_name: string;
  banned: boolean;
  ban_reason: string | null;
  warning: string | null;
  created_at: string;
  total_rolls: number;
};

export type AdminSuggestion = {
  id: string;
  user_id: string;
  display_name: string | null;
  current_name: string | null;
  suggested_name: string;
  reason: string | null;
  status: string;
  created_at: string;
};

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any).rpc("claim_admin");
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context.supabase as any).rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (error) throw new Error(error.message);
    return { isAdmin: !!data };
  });

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    const { data, error } = await (context.supabase as any).rpc("admin_list_users");
    if (error) throw new Error(error.message);
    return (data ?? []) as AdminUser[];
  });

export const adminUpdateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; displayName?: string | null; banned?: boolean | null; banReason?: string | null; warning?: string | null }) => input)
  .handler(async ({ context, data }) => {
    const { error } = await (context.supabase as any).rpc("admin_update_user", {
      _user_id: data.userId,
      _display_name: data.displayName ?? null,
      _banned: data.banned ?? null,
      _ban_reason: data.banReason ?? null,
      _warning: data.warning ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListSuggestions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminSuggestion[]> => {
    const { data, error } = await (context.supabase as any).rpc("admin_list_suggestions");
    if (error) throw new Error(error.message);
    return (data ?? []) as AdminSuggestion[];
  });

export const adminResolveSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; approve: boolean }) => input)
  .handler(async ({ context, data }) => {
    const { error } = await (context.supabase as any).rpc("admin_resolve_suggestion", { _id: data.id, _approve: data.approve });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const submitNameSuggestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { suggestedName: string; reason?: string }) => {
    const name = input.suggestedName?.trim() ?? "";
    if (name.length < 2 || name.length > 40) throw new Error("שם חייב להיות 2–40 תווים");
    return { suggestedName: name, reason: input.reason?.slice(0, 240) ?? null };
  })
  .handler(async ({ context, data }) => {
    const { data: prof } = await (context.supabase as any).from("profiles").select("display_name").eq("id", context.userId).maybeSingle();
    const { error } = await (context.supabase as any).from("name_suggestions").insert({
      user_id: context.userId,
      current_name: prof?.display_name ?? null,
      suggested_name: data.suggestedName,
      reason: data.reason,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
