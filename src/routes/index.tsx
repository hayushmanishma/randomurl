import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { AuroraBackground } from "@/components/AuroraBackground";
import { NavBar } from "@/components/NavBar";
import { rollRandomSite } from "@/lib/random.functions";
import { SITES, CATEGORIES, countByCategory, type Category } from "@/lib/sites";
import { Sparkles, ExternalLink, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portalverse — One click, infinite possibilities" },
      { name: "description", content: "Launch into a random corner of the web. Discover sites by rarity and category." },
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
  category: string;
}

function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const roll = useServerFn(rollRandomSite);
  const [result, setResult] = useState<Result | null>(null);
  const [rolling, setRolling] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [boost, setBoost] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const lastClickRef = useRef(0);
  const counts = countByCategory();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  async function handleRoll(e: React.MouseEvent) {
    if (!e.isTrusted) { setErr("🚫 פעולה אוטומטית זוהתה"); return; }
    const now = Date.now();
    if (now - lastClickRef.current < 400) return;
    lastClickRef.current = now;

    setErr(null); setRolling(true); setBoost(true);
    try {
      const data = await roll({ data: { category } });
      setResult(data);
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      setErr(e?.message ?? "שגיאה");
    } finally {
      setRolling(false);
      setTimeout(() => setBoost(false), 1500);
    }
  }

  if (loading || !user) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60 text-sm">טוען...</div>;
  }

  const activeCat = category ? CATEGORIES.find(c => c.id === category) : null;
  const accentGrad = activeCat?.accent ?? "from-[#4285F4] via-[#EA4335] to-[#FBBC05]";
  const poolSize = category ? counts[category] : SITES.length;

  return (
    <div className="min-h-screen relative md:pr-72 text-white" dir="rtl">
      <AuroraBackground boost={boost} />
      <NavBar />

      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl text-xs uppercase tracking-[0.25em] text-white/60">
            <Sparkles size={12} className="text-[#FBBC05]" />
            {poolSize.toLocaleString()} portals {category ? `· ${activeCat?.label}` : "ready"}
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.95]">
            <span className="block text-white">One click.</span>
            <span className={`block bg-gradient-to-r ${accentGrad} bg-clip-text text-transparent`}>
              Infinite possibilities.
            </span>
          </h1>

          {/* Category picker */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <button
              onClick={() => setCategory(null)}
              className={`px-3.5 py-1.5 text-xs rounded-full border transition ${
                category === null ? "bg-white text-black border-white" : "bg-white/5 text-white/70 border-white/15 hover:bg-white/10"
              }`}
            >
              ✨ הכל
            </button>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3.5 py-1.5 text-xs rounded-full border transition ${
                  category === c.id
                    ? `bg-gradient-to-r ${c.accent} text-white border-transparent shadow-lg`
                    : "bg-white/5 text-white/70 border-white/15 hover:bg-white/10"
                }`}
              >
                {c.emoji} {c.label}
                <span className="ml-1 opacity-50">({counts[c.id]})</span>
              </button>
            ))}
          </div>

          {/* Launch button */}
          <div className="relative flex items-center justify-center py-4">
            <div
              className={`absolute w-72 h-72 rounded-full blur-3xl opacity-60 transition-opacity duration-500 ${rolling ? "opacity-90 animate-pulse" : ""}`}
              style={{ background: "conic-gradient(from 0deg, #4285F4, #EA4335, #FBBC05, #34A853, #4285F4)" }}
            />
            <button
              onClick={handleRoll}
              disabled={rolling}
              className={`relative group w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_30px_60px_-20px_rgba(0,0,0,0.8)] transition-all duration-300 ${rolling ? "scale-95" : "hover:scale-105 active:scale-95"}`}
            >
              <span className="absolute inset-1 rounded-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" aria-hidden />
              <span className="relative flex flex-col items-center justify-center gap-2">
                <Zap size={42} className={`text-white transition-transform ${rolling ? "animate-spin" : "group-hover:scale-110"}`} strokeWidth={2.2} />
                <span className="text-base font-semibold tracking-wide">{rolling ? "Launching" : "Launch"}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">tap to portal</span>
              </span>
            </button>
          </div>

          {err && (
            <div className="rounded-2xl px-5 py-3 bg-red-500/10 border border-red-400/30 text-red-200 text-sm backdrop-blur-xl">{err}</div>
          )}

          {result && (
            <div className="mt-2 rounded-3xl p-6 bg-white/[0.05] border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] animate-[fade-in_0.4s_ease-out] text-right">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">Rarity</div>
                  <div className={`mt-1 text-xl font-semibold bg-gradient-to-r ${result.color} bg-clip-text text-transparent uppercase`}>
                    {result.emoji} {result.rarity}
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">Odds</div>
                  <div className="text-2xl font-bold font-mono">
                    1<span className="text-white/40">/</span>{result.rarityValue.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="truncate">
                  <div className="text-sm text-white/50">אתר · {result.category}</div>
                  <div className="text-base font-medium truncate">{result.name}</div>
                </div>
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition">
                  <ExternalLink size={13} />פתח
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
