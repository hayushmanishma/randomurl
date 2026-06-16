import { Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

export function NavBar() {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const linkCls = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-bold transition-all ${
      active
        ? "bg-white text-purple-900 shadow-lg"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-black/40 backdrop-blur-xl rounded-full p-1.5 border border-white/10 shadow-2xl" dir="rtl">
      <Link to="/" className={linkCls(path === "/")}>🎲 הגרלה</Link>
      <Link to="/history" className={linkCls(path === "/history")}>📜 היסטוריה</Link>
      <Link to="/search" className={linkCls(path === "/search")}>🔍 חיפוש</Link>
      <Link to="/settings" className={linkCls(path === "/settings")}>⚙️ הגדרות</Link>
      <button onClick={signOut} className="px-4 py-2 rounded-full text-sm font-bold text-white/60 hover:text-white hover:bg-red-500/20 transition-all">
        יציאה
      </button>
    </nav>
  );
}
