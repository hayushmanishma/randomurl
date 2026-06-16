import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Rocket, History, Search, Trophy, Settings, LogOut, Menu, X } from "lucide-react";

const items = [
  { to: "/", label: "הגרלה", icon: Rocket },
  { to: "/leaderboard", label: "לוח תוצאות", icon: Trophy },
  { to: "/history", label: "היסטוריה", icon: History },
  { to: "/search", label: "חיפוש", icon: Search },
  { to: "/settings", label: "הגדרות", icon: Settings },
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
        className="md:hidden fixed top-4 right-4 z-50 w-11 h-11 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center shadow-2xl"
        aria-label="תפריט"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop on mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      <aside
        dir="rtl"
        className={`fixed top-0 right-0 h-screen w-64 z-50 flex flex-col bg-gradient-to-b from-zinc-950/95 via-purple-950/40 to-black/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_60px_rgba(236,72,153,0.15)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <h2 className="text-xl font-black tracking-widest text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
            PORTAL<span className="text-white">VERSE</span>
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
            One Click. Infinite.
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((it) => {
            const active = path === it.to;
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${
                  active
                    ? "bg-gradient-to-l from-pink-500/20 to-purple-500/10 text-white shadow-inner border border-pink-500/30"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {active && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-pink-500 rounded-l-full shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                )}
                <Icon size={18} className={active ? "text-pink-400" : ""} />
                <span>{it.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            יציאה
          </button>
        </div>
      </aside>
    </>
  );
}

// Pages should add `md:pr-64` to their root container so content doesn't sit under the sidebar.
