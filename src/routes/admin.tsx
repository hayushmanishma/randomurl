import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { NavBar } from "@/components/NavBar";
import { AuroraBackground } from "@/components/AuroraBackground";
import {
  claimAdmin, checkIsAdmin,
  adminListUsers, adminUpdateUser,
  adminListSuggestions, adminResolveSuggestion,
  type AdminUser, type AdminSuggestion,
} from "@/lib/admin.functions";
import { ShieldCheck, Ban, AlertTriangle, Check, X, Users, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "פאנל אדמין — Portalverse" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const claim = useServerFn(claimAdmin);
  const check = useServerFn(checkIsAdmin);
  const listUsers = useServerFn(adminListUsers);
  const updateUser = useServerFn(adminUpdateUser);
  const listSugs = useServerFn(adminListSuggestions);
  const resolveSug = useServerFn(adminResolveSuggestion);

  const [status, setStatus] = useState<"checking" | "denied" | "ok">("checking");
  const [tab, setTab] = useState<"users" | "suggestions">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [sugs, setSugs] = useState<AdminSuggestion[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", replace: true }); }, [user, loading, navigate]);

  // First-to-visit claims admin
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const r = await claim();
        if (!r.isAdmin) {
          const c = await check();
          setStatus(c.isAdmin ? "ok" : "denied");
        } else setStatus("ok");
      } catch { setStatus("denied"); }
    })();
  }, [user, claim, check]);

  async function refresh() {
    try {
      const [u, s] = await Promise.all([listUsers(), listSugs()]);
      setUsers(u); setSugs(s);
    } catch (e: any) { setErr(e?.message ?? "שגיאה"); }
  }
  useEffect(() => { if (status === "ok") refresh(); }, [status]);

  async function saveUser(u: AdminUser, patch: Partial<AdminUser>) {
    setBusy(u.id); setErr(null);
    try {
      await updateUser({ data: {
        userId: u.id,
        displayName: patch.display_name ?? null,
        banned: patch.banned ?? null,
        banReason: patch.ban_reason ?? null,
        warning: patch.warning ?? null,
      } });
      await refresh();
    } catch (e: any) { setErr(e?.message ?? "שגיאה"); }
    finally { setBusy(null); }
  }

  async function resolve(id: string, approve: boolean) {
    setBusy(id);
    try { await resolveSug({ data: { id, approve } }); await refresh(); }
    catch (e: any) { setErr(e?.message ?? "שגיאה"); }
    finally { setBusy(null); }
  }

  if (loading || status === "checking") {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">בודק הרשאות...</div>;
  }

  if (status === "denied") {
    return (
      <div className="min-h-screen relative md:pr-72 text-white" dir="rtl">
        <AuroraBackground />
        <NavBar />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="max-w-md text-center bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-10">
            <ShieldCheck className="mx-auto text-red-400" size={48} />
            <h1 className="text-2xl font-bold mt-3">אין גישה</h1>
            <p className="text-white/60 mt-2">פאנל הניהול כבר נתפס על ידי משתמש אחר. רק האדמין הראשון יכול לראות את הדף הזה.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative md:pr-72 text-white" dir="rtl">
      <AuroraBackground />
      <NavBar />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">פאנל אדמין</h1>
            <p className="text-white/50 text-sm">ניהול משתמשים והצעות שם</p>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-2xl text-sm flex items-center gap-2 border ${tab==="users"?"bg-white text-black border-white":"bg-white/5 border-white/10 text-white/70"}`}>
            <Users size={14} /> משתמשים ({users.length})
          </button>
          <button onClick={() => setTab("suggestions")} className={`px-4 py-2 rounded-2xl text-sm flex items-center gap-2 border ${tab==="suggestions"?"bg-white text-black border-white":"bg-white/5 border-white/10 text-white/70"}`}>
            <Inbox size={14} /> הצעות שם ({sugs.filter(s=>s.status==="pending").length})
          </button>
        </div>

        {err && <div className="bg-red-500/20 border border-red-400 text-red-200 rounded-2xl p-3 mb-3 text-sm">{err}</div>}

        {tab === "users" && (
          <div className="space-y-2">
            {users.map(u => <UserRow key={u.id} u={u} busy={busy===u.id} onSave={(p) => saveUser(u,p)} />)}
            {users.length === 0 && <div className="text-center text-white/50 py-10">אין משתמשים.</div>}
          </div>
        )}

        {tab === "suggestions" && (
          <div className="space-y-2">
            {sugs.map(s => (
              <div key={s.id} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs text-white/40">{new Date(s.created_at).toLocaleString()}</div>
                  <div className="text-sm"><span className="text-white/60">{s.display_name ?? s.current_name ?? "?"}</span> → <span className="font-bold">{s.suggested_name}</span></div>
                  {s.reason && <div className="text-xs text-white/50 mt-1">"{s.reason}"</div>}
                  <div className="text-[10px] uppercase tracking-wider mt-1 text-white/40">{s.status}</div>
                </div>
                {s.status === "pending" && (
                  <div className="flex gap-2">
                    <button disabled={busy===s.id} onClick={() => resolve(s.id, true)} className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs flex items-center gap-1 disabled:opacity-50"><Check size={12}/>אשר</button>
                    <button disabled={busy===s.id} onClick={() => resolve(s.id, false)} className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-xs flex items-center gap-1 disabled:opacity-50"><X size={12}/>דחה</button>
                  </div>
                )}
              </div>
            ))}
            {sugs.length === 0 && <div className="text-center text-white/50 py-10">אין הצעות.</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({ u, busy, onSave }: { u: AdminUser; busy: boolean; onSave: (p: Partial<AdminUser>) => void }) {
  const [name, setName] = useState(u.display_name);
  const [warning, setWarning] = useState(u.warning ?? "");
  const [banReason, setBanReason] = useState(u.ban_reason ?? "");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl bg-white/5 border ${u.banned?"border-red-400/30":"border-white/10"} backdrop-blur-xl p-4`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">{u.display_name?.[0]?.toUpperCase() ?? "?"}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate flex items-center gap-2">
            {u.display_name}
            {u.banned && <span className="text-[10px] bg-red-500/30 text-red-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Ban size={10}/>BAN</span>}
            {u.warning && !u.banned && <span className="text-[10px] bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle size={10}/>אזהרה</span>}
          </div>
          <div className="text-xs text-white/40">{u.total_rolls} הגרלות · נרשם {new Date(u.created_at).toLocaleDateString()}</div>
        </div>
        <button onClick={() => setExpanded(v=>!v)} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">{expanded?"סגור":"ערוך"}</button>
      </div>

      {expanded && (
        <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
          <label className="space-y-1">
            <span className="text-xs text-white/60">שם תצוגה</span>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white" />
          </label>
          <label className="space-y-1">
            <span className="text-xs text-white/60">אזהרה (ריק = הסר)</span>
            <input value={warning} onChange={e=>setWarning(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white" placeholder="טקסט אזהרה" />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs text-white/60">סיבת באן</span>
            <input value={banReason} onChange={e=>setBanReason(e.target.value)} className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-white" placeholder="הסיבה לבאן (אם בנת)" />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">
            <button disabled={busy} onClick={() => onSave({ display_name: name, warning, ban_reason: banReason })} className="px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold disabled:opacity-50">שמור</button>
            <button disabled={busy} onClick={() => onSave({ warning })} className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs flex items-center gap-1 disabled:opacity-50"><AlertTriangle size={12}/>שלח אזהרה</button>
            {u.banned ? (
              <button disabled={busy} onClick={() => onSave({ banned: false, ban_reason: "" })} className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs disabled:opacity-50">בטל באן</button>
            ) : (
              <button disabled={busy} onClick={() => onSave({ banned: true, ban_reason: banReason })} className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-400/30 text-red-200 text-xs flex items-center gap-1 disabled:opacity-50"><Ban size={12}/>באן</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
