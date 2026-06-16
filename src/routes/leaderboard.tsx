import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { NavBar } from "@/components/NavBar";
import { BackgroundAnimation } from "@/components/BackgroundAnimation";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard.functions";
import { Trophy, Medal, Award } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({ meta: [{ title: "לוח תוצאות — Portalverse" }] }),
  component: LeaderboardPage,
});

function rankIcon(i: number) {
  if (i === 0) return <Trophy className="text-yellow-300" size={22} />;
  if (i === 1) return <Medal className="text-gray-300" size={22} />;
  if (i === 2) return <Award className="text-amber-600" size={22} />;
  return <span className="text-white/50 font-mono text-sm w-5 text-center">{i + 1}</span>;
}

function LeaderboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchLb = useServerFn(getLeaderboard);
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchLb().then(setRows).catch((e) => setErr(e?.message ?? "שגיאה"));
  }, [user, fetchLb]);

  if (loading || !user) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">טוען...</div>;
  }

  return (
    <div className="min-h-screen relative md:pr-64" dir="rtl">
      <BackgroundAnimation speed={1500} />
      <NavBar />

      <div className="relative z-10 px-6 py-10 max-w-4xl mx-auto text-white">
        <div className="text-center mb-8">
          <Trophy className="mx-auto text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.6)]" size={48} />
          <h1 className="text-5xl font-black mt-3 tracking-tight">לוח תוצאות</h1>
          <p className="text-white/60 mt-2">המשתמשים שהשיגו את האתרים הנדירים ביותר</p>
        </div>

        {err && <div className="bg-red-500/20 border border-red-400 text-red-200 rounded-2xl p-4 mb-4">{err}</div>}

        {!rows ? (
          <div className="text-center text-white/60 py-12">טוען...</div>
        ) : rows.length === 0 ? (
          <div className="text-center text-white/60 py-12">עוד אין הגרלות. תהיה הראשון!</div>
        ) : (
          <div className="rounded-3xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="grid grid-cols-[60px_1fr_120px_100px] md:grid-cols-[60px_1fr_1fr_140px_100px] gap-2 px-5 py-3 text-xs uppercase tracking-wider text-white/40 border-b border-white/10 bg-white/[0.02]">
              <div>דירוג</div>
              <div>משתמש</div>
              <div className="hidden md:block">אתר הכי נדיר</div>
              <div className="text-center">נדירות</div>
              <div className="text-center">הגרלות</div>
            </div>
            {rows.map((r, i) => (
              <div
                key={r.user_id}
                className={`grid grid-cols-[60px_1fr_120px_100px] md:grid-cols-[60px_1fr_1fr_140px_100px] gap-2 px-5 py-4 items-center border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.03] ${
                  i === 0 ? "bg-gradient-to-l from-yellow-500/10 to-transparent" : ""
                } ${user.id === r.user_id ? "bg-pink-500/5" : ""}`}
              >
                <div className="flex justify-center">{rankIcon(i)}</div>
                <div className="font-bold truncate">
                  {r.display_name}
                  {user.id === r.user_id && (
                    <span className="ml-2 text-[10px] bg-pink-500/30 text-pink-200 px-2 py-0.5 rounded-full">אתה</span>
                  )}
                </div>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:block truncate text-sm text-white/70 hover:text-white"
                  title={r.site_name}
                >
                  {r.site_name}
                </a>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-pink-300">{r.rarity}</div>
                  <div className="font-mono font-bold text-sm">1/{r.best_rarity.toLocaleString()}</div>
                </div>
                <div className="text-center text-white/70 font-mono text-sm">{r.total_rolls}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
