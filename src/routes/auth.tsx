import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { PortalAnimation } from "@/components/PortalAnimation";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Portalverse — Sign in" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Fast redirect once a session is detected (catches OAuth return).
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

  async function oauth(provider: "google" | "apple" | "lovable") {
    setErr(null);
    setLoading(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin + "/auth",
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
    setLoading("email");
    try {
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
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/", replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "שגיאה");
      setLoading(null);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <PortalAnimation />

      <div className="absolute top-6 left-8 z-10">
        <h2 className="text-2xl font-black tracking-widest text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
          PORTAL<span className="text-white">VERSE</span>
        </h2>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center md:justify-start">
        <div className="w-full max-w-md px-8 md:px-16 py-20">
          <h1 className="text-5xl md:text-6xl font-black uppercase leading-[0.95] tracking-tight">
            One Click.<br />
            <span className="text-pink-500">Infinite Possibilities.</span>
          </h1>

          <form onSubmit={emailAuth} className="mt-10 space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition"
              />
            )}
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-md px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition"
            />
            <button
              type="submit"
              disabled={!!loading}
              className="w-full bg-pink-500 hover:bg-pink-400 text-white font-bold py-3 rounded-md transition disabled:opacity-50"
            >
              {loading === "email" ? "..." : mode === "signup" ? "Create account" : "Sign in"}
            </button>

            <button
              type="button"
              onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setErr(null); }}
              className="w-full text-xs text-white/50 hover:text-white/80 pt-1"
            >
              {mode === "signup" ? "Have an account? Sign in" : "New here? Create an account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/40 uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="space-y-2">
            <button
              onClick={() => oauth("google")}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-md hover:bg-white/90 transition disabled:opacity-50"
            >
              <GoogleIcon />
              {loading === "google" ? "Connecting..." : "Continue with Google"}
            </button>
            <button
              onClick={() => oauth("apple")}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 bg-black border border-white/20 text-white font-semibold py-3 rounded-md hover:bg-white/5 transition disabled:opacity-50"
            >
              <AppleIcon />
              {loading === "apple" ? "Connecting..." : "Continue with Apple"}
            </button>
            <button
              onClick={() => oauth("lovable")}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold py-3 rounded-md hover:opacity-90 transition disabled:opacity-50"
            >
              <LovableIcon />
              {loading === "lovable" ? "Connecting..." : "Continue with Lovable"}
            </button>
          </div>

          {err && <div className="mt-4 text-red-400 text-sm">{err}</div>}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 8 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 8 3l5.7-5.7C34 6.5 29.3 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.2 0 9.9-2 13.5-5.2l-6.2-5.3c-2 1.4-4.5 2.3-7.3 2.3-5.2 0-9.6-3.3-11.3-8L6 32.4C9.3 38.6 16.1 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4-4 5.4l6.2 5.3C41.9 35.2 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
  );
}
function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M16.365 1.43c0 1.14-.49 2.27-1.21 3.04-.78.85-2.06 1.51-3.06 1.43-.12-1.11.42-2.26 1.15-3.02.81-.86 2.18-1.5 3.12-1.45zM20.5 17.04c-.55 1.27-.82 1.84-1.53 2.97-.99 1.58-2.39 3.55-4.12 3.57-1.54.01-1.93-1.01-4.02-1-2.09.01-2.52 1.01-4.06 1-1.73-.02-3.06-1.79-4.05-3.37C.06 16.99-.23 11.96 1.76 9.29c1.41-1.88 3.63-2.98 5.72-2.98 2.13 0 3.47 1.16 5.23 1.16 1.71 0 2.75-1.17 5.21-1.17 1.86 0 3.83 1.02 5.23 2.77-4.6 2.52-3.85 9.1.35 10.97z"/></svg>
  );
}
function LovableIcon() {
  // Lovable heart wordmark glyph
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-7.5-4.6-9.6-9.1C1 8.6 3 5 6.4 5c1.9 0 3.6 1 4.6 2.5l1 1.5 1-1.5C14 6 15.7 5 17.6 5 21 5 23 8.6 21.6 11.9 19.5 16.4 12 21 12 21z"/>
    </svg>
  );
}
