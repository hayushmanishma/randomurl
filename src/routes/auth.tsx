import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { PortalAnimation } from "@/components/PortalAnimation";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Portalverse — Sign in" }] }),
  component: AuthPage,
});

type AuthMode = "signin" | "signup" | "forgot";
type OAuthProvider = "google" | "apple" | "lovable";

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION")) {
        navigate({ to: "/", replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function oauth(provider: OAuthProvider) {
    setErr(null);
    setMsg(null);
    setLoading(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin + "/auth",
        extraParams: provider === "google" ? { prompt: "select_account" } : undefined,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      navigate({ to: "/", replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Sign-in failed");
      setLoading(null);
    }
  }

  async function emailAuth(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading("email");
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/reset-password",
        });
        if (error) throw error;
        setMsg("שלחנו קישור לאיפוס סיסמה למייל שלך.");
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth",
            data: { full_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        setMsg("נוצר משתמש. אם נדרש אישור מייל — אשר ואז התחבר.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/", replace: true });
      }
    } catch (e: any) {
      setErr(e?.message ?? "שגיאה");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white" dir="rtl">
      <PortalAnimation />

      <div className="absolute left-8 top-6 z-10" dir="ltr">
        <h2 className="text-2xl font-black tracking-widest text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.3)]">
          PORTAL<span className="bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05] bg-clip-text text-transparent">VERSE</span>
        </h2>
      </div>

      <div className="relative z-10 grid min-h-screen place-items-center px-5 py-20 lg:grid-cols-[1fr_520px] lg:px-14">
        <section className="hidden w-full max-w-2xl justify-self-start text-left lg:block" dir="ltr">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/55 backdrop-blur-xl">
            safe random web portals
          </div>
          <h1 className="mt-7 text-7xl font-semibold leading-[0.9] tracking-tight">
            One click.
            <span className="block bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853] bg-clip-text text-transparent">
              Infinite possibilities.
            </span>
          </h1>
        </section>

        <section className="w-full max-w-[460px] rounded-[2rem] border border-white/15 bg-white/[0.075] p-5 shadow-[0_35px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-7">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white text-2xl text-black shadow-[0_0_40px_rgba(255,255,255,0.25)]">✦</div>
            <h1 className="text-3xl font-semibold tracking-tight">One click, infinite possibilities</h1>
            <p className="mt-2 text-sm text-white/50">
              {mode === "forgot" ? "נשלח לך קישור מהיר לאיפוס הסיסמה" : "בחר דרך כניסה ותיכנס ישר למאגר"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2" dir="ltr">
            <OAuthButton label="Google" loading={loading === "google"} disabled={!!loading} onClick={() => oauth("google")}>
              <GoogleIcon />
            </OAuthButton>
            <OAuthButton label="Apple" loading={loading === "apple"} disabled={!!loading} onClick={() => oauth("apple")} dark>
              <AppleIcon />
            </OAuthButton>
            <OAuthButton label="Lovable" loading={loading === "lovable"} disabled={!!loading} onClick={() => oauth("lovable")} lovable>
              <LovableIcon />
            </OAuthButton>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wider text-white/35">or email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={emailAuth} className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="שם תצוגה"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/40"
              />
            )}
            <input
              type="email"
              required
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/40"
            />
            {mode !== "forgot" && (
              <input
                type="password"
                required
                minLength={6}
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-white/40"
              />
            )}
            <button
              type="submit"
              disabled={!!loading}
              className="w-full rounded-2xl bg-white py-3 font-bold text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {loading === "email" ? "..." : mode === "forgot" ? "שלח קישור איפוס" : mode === "signup" ? "יצירת משתמש" : "כניסה עם אימייל"}
            </button>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-white/50">
              <button type="button" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setErr(null); setMsg(null); }} className="rounded-xl py-2 hover:bg-white/5 hover:text-white/85">
                {mode === "signup" ? "כבר יש משתמש?" : "משתמש חדש?"}
              </button>
              <button type="button" onClick={() => { setMode(mode === "forgot" ? "signin" : "forgot"); setErr(null); setMsg(null); }} className="rounded-xl py-2 hover:bg-white/5 hover:text-white/85">
                {mode === "forgot" ? "חזרה להתחברות" : "שכחתי סיסמה"}
              </button>
            </div>
          </form>

          {msg && <div className="mt-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{msg}</div>}
          {err && <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">{err}</div>}
        </section>
      </div>
    </div>
  );
}

function OAuthButton({ children, label, loading, disabled, onClick, dark, lovable }: {
  children: ReactNode;
  label: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  dark?: boolean;
  lovable?: boolean;
}) {
  const base = lovable
    ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white"
    : dark
      ? "bg-black/60 text-white border-white/15"
      : "bg-white text-black border-white";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-20 flex-col items-center justify-center gap-2 rounded-2xl border text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 ${base}`}
    >
      {children}
      <span>{loading ? "..." : label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.3c-2 1.4-4.5 2.3-7.3 2.3-5.2 0-9.6-3.3-11.3-8L6 32.4C9.3 38.6 16.1 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6.2 5.3C41.9 35.2 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M16.365 1.43c0 1.14-.49 2.27-1.21 3.04-.78.85-2.06 1.51-3.06 1.43-.12-1.11.42-2.26 1.15-3.02.81-.86 2.18-1.5 3.12-1.45zM20.5 17.04c-.55 1.27-.82 1.84-1.53 2.97-.99 1.58-2.39 3.55-4.12 3.57-1.54.01-1.93-1.01-4.02-1-2.09.01-2.52 1.01-4.06 1-1.73-.02-3.06-1.79-4.05-3.37C.06 16.99-.23 11.96 1.76 9.29c1.41-1.88 3.63-2.98 5.72-2.98 2.13 0 3.47 1.16 5.23 1.16 1.71 0 2.75-1.17 5.21-1.17 1.86 0 3.83 1.02 5.23 2.77-4.6 2.52-3.85 9.1.35 10.97z"/></svg>
  );
}

function LovableIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7.5-4.6-9.6-9.1C1 8.6 3 5 6.4 5c1.9 0 3.6 1 4.6 2.5l1 1.5 1-1.5C14 6 15.7 5 17.6 5 21 5 23 8.6 21.6 11.9 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}