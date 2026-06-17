import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { checkIsAdmin } from "@/lib/admin.functions";
import { Rocket, History, Search, Trophy, Settings, LogOut, Menu, ShieldCheck } from "lucide-react";

const baseItems = [
  { to: "/", label: "הגרלה", icon: Rocket, accent: "#4285F4" },
  { to: "/leaderboard", label: "לוח תוצאות", icon: Trophy, accent: "#FBBC05" },
  { to: "/history", label: "היסטוריה", icon: History, accent: "#34A853" },
  { to: "/search", label: "חיפוש", icon: Search, accent: "#EA4335" },
  { to: "/settings", label: "הגדרות", icon: Settings, accent: "#A78BFA" },
] as const;

export function NavBar() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed top-4 right-4 z-50 w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 text-white flex items-center justify-center shadow-2xl"
        aria-label="תפריט"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <aside
        dir="rtl"
        className={`fixed top-4 bottom-4 right-4 w-60 z-50 flex flex-col rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 shadow-[0_8px_60px_-15px_rgba(0,0,0,0.6)] transition-transform duration-300 overflow-hidden ${
          open ? "translate-x-0" : "translate-x-[110%] md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4] via-[#EA4335] to-[#FBBC05]" />
              <div className="absolute inset-[2px] rounded-[10px] bg-[#0a0a0f] flex items-center justify-center text-sm">✨</div>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">Portalverse</h2>
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">infinite web</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {items.map((it) => {
            const active = path === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all relative overflow-hidden ${
                  active
                    ? "text-white bg-white/10 border border-white/15 shadow-inner"
                    : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {active && (
                  <span
                    className="absolute inset-0 opacity-30 blur-xl"
                    style={{ background: it.accent }}
                  />
                )}
                <span
                  className="relative flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{
                    background: active ? it.accent : "rgba(255,255,255,0.05)",
                    boxShadow: active ? `0 0 16px ${it.accent}80` : undefined,
                  }}
                >
                  <Icon size={15} className="text-white" />
                </span>
                <span className="relative">{it.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium text-white/50 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5">
              <LogOut size={15} />
            </span>
            יציאה
          </button>
        </div>
      </aside>
    </>
  );
}
