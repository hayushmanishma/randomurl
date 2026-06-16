import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuroraBackground } from "@/components/AuroraBackground";
import { NavBar } from "@/components/NavBar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "הגדרות" }] }),
  component: SettingsPage,
});

interface Settings {
  bgAnimation: boolean;
  openInNewTab: boolean;
  bgSpeed: number;
}

const DEFAULTS: Settings = { bgAnimation: true, openInNewTab: true, bgSpeed: 900 };
const KEY = "random-site-settings";

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

function SettingsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [s, setS] = useState<Settings>(DEFAULTS);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    setS(loadSettings());
  }, []);

  function update<K extends keyof Settings>(k: K, v: Settings[K]) {
    const next = { ...s, [k]: v };
    setS(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  async function deleteAccount() {
    if (!user) return;
    if (!confirm("בטוח? פעולה זו תמחק את ההיסטוריה שלך ותנתק אותך.")) return;
    await supabase.from("roll_history").delete().eq("user_id", user.id);
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading || !user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-screen relative md:pr-72" dir="rtl">
      <AuroraBackground />
      <NavBar />
      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto text-white">
        <h1 className="text-4xl font-black mb-6">⚙️ הגדרות</h1>

        <div className="bg-black/40 backdrop-blur rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="text-sm text-white/60">משתמש מחובר</div>
          <div className="font-mono text-sm bg-white/5 px-3 py-2 rounded">{user.email}</div>
        </div>

        <div className="bg-black/40 backdrop-blur rounded-2xl p-6 border border-white/10 mt-4 space-y-5">
          <Toggle label="🎬 אנימציית רקע" value={s.bgAnimation} onChange={(v) => update("bgAnimation", v)} />
          <Toggle label="🪟 פתח בלשונית חדשה" value={s.openInNewTab} onChange={(v) => update("openInNewTab", v)} />
          <div>
            <label className="block text-sm mb-2">מהירות רקע: {s.bgSpeed}ms</label>
            <input
              type="range"
              min={200}
              max={3000}
              step={100}
              value={s.bgSpeed}
              onChange={(e) => update("bgSpeed", Number(e.target.value))}
              className="w-full accent-pink-500"
            />
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mt-4 space-y-3">
          <h2 className="font-bold text-red-300">⚠️ אזור סכנה</h2>
          <button
            onClick={deleteAccount}
            className="px-4 py-2 rounded-full bg-red-500/30 hover:bg-red-500/50 text-red-100 font-bold transition"
          >
            מחק היסטוריה והתנתק
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between"
    >
      <span className="font-medium">{label}</span>
      <span className={`w-12 h-7 rounded-full transition-colors relative ${value ? "bg-pink-500" : "bg-white/20"}`}>
        <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${value ? "right-0.5" : "right-[26px]"}`} />
      </span>
    </button>
  );
}
