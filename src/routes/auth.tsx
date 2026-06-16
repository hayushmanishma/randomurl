import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { PortalAnimation } from "@/components/PortalAnimation";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Portal — Sign in" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  async function oauth(provider: "google" | "apple" | "microsoft") {
    setErr(null);
    setLoading(provider);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      navigate({ to: "/", replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Sign-in failed");
      setLoading(null);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <PortalAnimation />

      {/* Brand */}
      <div className="absolute top-6 left-8 z-10">
        <h2 className="text-2xl font-black tracking-widest text-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
          PORTAL<span className="text-white">VERSE</span>
        </h2>
      </div>

      {/* Hero copy + buttons */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-xl px-8 md:px-16 py-20">
          <h1 className="text-6xl md:text-7xl font-black uppercase leading-[0.95] tracking-tight">
            A Universe<br />
            Of Websites.<br />
            <span className="text-pink-500">One Click.</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-md">
            Thousands of curated sites — rare gems, deep cuts, wild experiments.
            One button teleports you somewhere new.
          </p>

          <div className="mt-10 space-y-3 max-w-sm">
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
              onClick={() => oauth("microsoft")}
              disabled={!!loading}
              className="w-full flex items-center justify-center gap-3 bg-black border border-white/20 text-white font-semibold py-3 rounded-md hover:bg-white/5 transition disabled:opacity-50"
            >
              <MicrosoftIcon />
              {loading === "microsoft" ? "Connecting..." : "Continue with Microsoft"}
            </button>

            {err && <div className="text-red-400 text-sm">{err}</div>}
            <p className="text-xs text-white/40 pt-2">
              Sign in is required. We support Google, Apple and Microsoft accounts.
            </p>
          </div>
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
function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg>
  );
}
