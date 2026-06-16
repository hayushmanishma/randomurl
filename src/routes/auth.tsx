import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [{ title: "התחברות - אתר רנדומלי" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/", replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-4" dir="rtl">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl animate-[scale-in_0.3s_ease-out]">
        <h1 className="text-4xl font-bold text-white text-center mb-2">🎲 אתר רנדומלי</h1>
        <p className="text-white/60 text-center mb-8">
          {mode === "signin" ? "התחבר כדי להמשיך" : "צור משתמש חדש"}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="סיסמה (לפחות 6 תווים)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-pink-400"
          />
          {err && <div className="text-red-400 text-sm text-center">{err}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "התחבר" : "הרשם"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-6 text-white/70 hover:text-white text-sm"
        >
          {mode === "signin" ? "אין לך משתמש? הרשם" : "כבר רשום? התחבר"}
        </button>
      </div>
    </div>
  );
}
