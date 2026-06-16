import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { NavBar } from "@/components/NavBar";
import { rollRandomSite } from "@/lib/random.functions";
import { SITES, TOTAL_WEIGHT } from "@/lib/sites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "אתר רנדומלי - שגר אותי!" },
      { name: "description", content: "לחץ וקבל אתר רנדומלי עם רמות נדירות" },
    ],
  }),
  component: HomePage,
});

interface Result {
  url: string;
  name: string;
  rarity: string;
  rarityValue: number;
  color: string;
  emoji: string;
}

function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const roll = useServerFn(rollRandomSite);
  const [result, setResult] = useState<Result | null>(null);
  const [rolling, setRolling] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [animBoost, setAnimBoost] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastClickRef = useRef(0);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  async function handleRoll(e: React.MouseEvent) {
    // Anti-cheat: require a real, trusted (user-initiated) event.
    if (!e.isTrusted) {
      setErr("🚫 זוהתה פעולה אוטומטית");
      return;
    }
    // Anti-cheat: client-side cooldown (server enforces real limit).
    const now = Date.now();
    if (now - lastClickRef.current < 400) return;
    lastClickRef.current = now;

    setErr(null);
    setRolling(true);
    setAnimBoost(true);
    try {
      const data = await roll();
      setResult(data);
      // Open in a new tab using the trusted click (must be sync-ish).
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      setErr(e?.message ?? "שגיאה");
    } finally {
      setRolling(false);
      setTimeout(() => setAnimBoost(false), 1500);
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">טוען...</div>;
  }

  return (
    <div className="min-h-screen relative" dir="rtl">
      <BackgroundAnimation speed={animBoost ? 100 : 900} />
      <NavBar />

      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-2xl w-full text-center space-y-8 animate-[fade-in_0.5s_ease-out]">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight drop-shadow-2xl">
            🎲 שגר אותי!
          </h1>
          <p className="text-lg text-white/80">
            {SITES.length.toLocaleString()} אתרים בטוחים. נדירות וגניקה רנדומלית מוחלטת.
          </p>

          <button
            ref={buttonRef}
            onClick={handleRoll}
            disabled={rolling}
            className={`group relative px-14 py-7 text-3xl font-black rounded-full bg-white text-purple-900 shadow-2xl transition-all duration-200 ${
              rolling ? "scale-95 animate-pulse" : "hover:scale-110 active:scale-95 hover:shadow-pink-500/50"
            }`}
          >
            {rolling ? "🌀 משגר..." : "🚀 שגר אותי לאתר רנדומלי!"}
          </button>

          {err && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 rounded-2xl p-4 animate-[fade-in_0.3s]">
              {err}
            </div>
          )}

          {result && (
            <div
              className={`mt-8 rounded-3xl p-6 bg-gradient-to-br ${result.color} shadow-2xl animate-[scale-in_0.4s_ease-out] border-2 border-white/30`}
            >
              <div className="text-6xl mb-2">{result.emoji}</div>
              <div className="text-2xl font-black uppercase tracking-widest opacity-90">
                {result.rarity}
              </div>
              <div className="text-4xl font-black mt-1">
                1 מתוך {result.rarityValue.toLocaleString()}
              </div>
              <div className="text-xl font-bold mt-4">{result.name}</div>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm bg-black/30 px-4 py-2 rounded-full hover:bg-black/50"
              >
                פתח שוב ↗
              </a>
            </div>
          )}

          <div className="text-xs text-white/40">
            סך כל המשקל במאגר: {Math.round(TOTAL_WEIGHT).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
