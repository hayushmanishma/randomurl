import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { NavBar } from "@/components/NavBar";
import { searchSites, SITES, TOTAL_WEIGHT, getRarityMeta } from "@/lib/sites";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "חיפוש אתרים" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  const results = useMemo(() => searchSites(q, 200), [q]);

  if (loading || !user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-screen relative" dir="rtl">
      <BackgroundAnimation speed={1500} />
      <NavBar />
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto text-white">
        <h1 className="text-4xl font-black mb-2">🔍 חיפוש במאגר</h1>
        <p className="text-white/60 mb-4">{SITES.length.toLocaleString()} אתרים בסך הכל</p>
        <input
          autoFocus
          placeholder="חפש לפי שם או כתובת..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full px-5 py-4 rounded-2xl bg-white/5 backdrop-blur border border-white/20 text-white text-lg placeholder-white/40 focus:outline-none focus:border-pink-400 mb-6"
        />
        <div className="space-y-2">
          {results.map((s, i) => {
            const meta = getRarityMeta(s.weight);
            const rarityValue = Math.max(1, Math.round(TOTAL_WEIGHT / s.weight));
            return (
              <a
                key={`${s.url}-${i}`}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-gradient-to-r ${meta.color} rounded-2xl p-4 hover:scale-[1.02] transition-transform shadow-lg border border-white/10`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-2xl">{meta.emoji}</div>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{s.name}</div>
                      <div className="text-xs opacity-75 truncate">{s.url}</div>
                    </div>
                  </div>
                  <div className="text-left flex-shrink-0 text-xs">
                    <div className="uppercase opacity-80">{meta.tier}</div>
                    <div className="font-black">1 / {rarityValue.toLocaleString()}</div>
                  </div>
                </div>
              </a>
            );
          })}
          {results.length === 0 && (
            <div className="text-white/60 text-center py-12">לא נמצאו תוצאות</div>
          )}
        </div>
      </div>
    </div>
  );
}
