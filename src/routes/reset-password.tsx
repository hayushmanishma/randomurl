import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PortalAnimation } from "@/components/PortalAnimation";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "איפוס סיסמה — Portalverse" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMessage("אפשר לבחור סיסמה חדשה עכשיו.");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 6) {
      setError("הסיסמה חייבת להיות לפחות 6 תווים");
      return;
    }
    if (password !== confirm) {
      setError("הסיסמאות לא תואמות");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("הסיסמה עודכנה. מעביר אותך פנימה...");
      setTimeout(() => navigate({ to: "/", replace: true }), 900);
    } catch (e: any) {
      setError(e?.message ?? "איפוס הסיסמה נכשל");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white" dir="rtl">
      <PortalAnimation />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <form onSubmit={updatePassword} className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-2xl">
          <div className="mb-7">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">Portalverse</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">איפוס סיסמה</h1>
            <p className="mt-2 text-sm text-white/55">בחר סיסמה חדשה ותוכל להמשיך ישר לחשבון שלך.</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              required
              minLength={6}
              placeholder="סיסמה חדשה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/35 outline-none transition focus:border-white/40"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="אישור סיסמה"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/35 outline-none transition focus:border-white/40"
            />
          </div>
          <button disabled={loading} className="mt-5 w-full rounded-2xl bg-white py-3 font-bold text-black transition hover:bg-white/90 disabled:opacity-50">
            {loading ? "מעדכן..." : "עדכן סיסמה"}
          </button>
          {message && <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{message}</div>}
          {error && <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}
        </form>
      </main>
    </div>
  );
}