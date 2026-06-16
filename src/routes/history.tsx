import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { NavBar } from "@/components/NavBar";


export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "היסטוריה - אתר רנדומלי" }] }),
  component: HistoryPage,
});

interface Row {
  id: string;
  url: string;
  site_name: string;
  rarity: string;
  rarity_value: number;
  created_at: string;
}

function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("roll_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => {
        setRows((data as Row[]) ?? []);
        setFetching(false);
      });
  }, [user]);

  async function clearAll() {
    if (!user) return;
    if (!confirm("למחוק את כל ההיסטוריה?")) return;
    await supabase.from("roll_history").delete().eq("user_id", user.id);
    setRows([]);
  }

  if (loading || !user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-screen relative md:pr-64" dir="rtl">
      <BackgroundAnimation speed={1500} />
      <NavBar />
      <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-black">📜 ההיסטוריה שלך</h1>
          {rows.length > 0 && (
            <button onClick={clearAll} className="text-sm bg-red-500/20 hover:bg-red-500/40 text-red-200 px-4 py-2 rounded-full">
              נקה הכל
            </button>
          )}
        </div>

        {fetching ? (
          <div>טוען...</div>
        ) : rows.length === 0 ? (
          <div className="text-white/60 text-center py-20">עדיין לא שיגרת אף אתר. חזור לדף הראשי!</div>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => {
              const tierMeta = metaFor(r.rarity);
              return (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block bg-gradient-to-r ${tierMeta.color} rounded-2xl p-4 hover:scale-[1.02] transition-transform shadow-lg border border-white/10`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="text-3xl">{tierMeta.emoji}</div>
                      <div className="min-w-0">
                        <div className="font-bold truncate">{r.site_name}</div>
                        <div className="text-xs opacity-75 truncate">{r.url}</div>
                      </div>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <div className="text-xs uppercase opacity-80">{r.rarity}</div>
                      <div className="font-black">1 / {r.rarity_value.toLocaleString()}</div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function metaFor(rarity: string): { color: string; emoji: string } {
  switch (rarity) {
    case "mythic": return { color: "from-fuchsia-500 to-rose-500", emoji: "🌌" };
    case "legendary": return { color: "from-amber-400 to-orange-500", emoji: "👑" };
    case "epic": return { color: "from-purple-500 to-indigo-500", emoji: "💎" };
    case "rare": return { color: "from-blue-500 to-cyan-500", emoji: "🔷" };
    case "uncommon": return { color: "from-emerald-500 to-green-600", emoji: "🟢" };
    default: return { color: "from-slate-600 to-slate-700", emoji: "⚪" };
  }
}
