import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, Users as UsersIcon, FileText, MessageSquare, ArrowLeft, Trash2,
  UserCheck, UserX, ShieldCheck, ShieldOff, ExternalLink, Search, LogOut,
  Activity,
} from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { listUsers, setUserActive, setUserRole, deleteUser, listAudit } from "./auth.js";
import { listAllInvitations, deleteInvitation } from "./storage.js";
import { inviteUrl } from "./links.js";

const EVENT_LABEL = {
  wedding: "Свадьба", birthday: "День рождения", kids: "Детский праздник",
  jubilee: "Юбилей", baby: "Baby Shower", housewarm: "Новоселье", corporate: "Корпоратив",
};

export default function AdminPage() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("overview"); // overview | users | invites | audit
  const [users, setUsers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [audit, setAudit] = useState([]);
  const [q, setQ] = useState("");

  const refresh = () => { setUsers(listUsers()); setInvites(listAllInvitations()); setAudit(listAudit()); };
  useEffect(refresh, []);

  const stats = useMemo(() => {
    const totalRsvp = invites.reduce((s, inv) => {
      const r = inv.blocks?.find((b) => b.type === "rsvp");
      return s + (r?.responses?.length || 0);
    }, 0);
    return {
      users: users.length,
      activeUsers: users.filter((u) => u.active).length,
      invitations: invites.length,
      rsvps: totalRsvp,
      published: invites.filter((i) => (i.blocks?.length || 0) > 0).length,
    };
  }, [users, invites]);

  const usersFiltered = users.filter((u) => {
    if (!q.trim()) return true;
    const h = (u.email + " " + (u.name || "")).toLowerCase();
    return h.includes(q.toLowerCase());
  });
  const invitesFiltered = invites.filter((i) => {
    if (!q.trim()) return true;
    const hero = i.blocks?.find((b) => b.type === "hero");
    const h = (i.slug + " " + (i.hostEmail || "") + " " + (hero?.title || "")).toLowerCase();
    return h.includes(q.toLowerCase());
  });

  const onToggleActive = (email) => {
    const u = users.find((x) => x.email === email);
    if (!u) return;
    if (email === user.email && u.active) {
      alert("Нельзя отключить собственную учётную запись.");
      return;
    }
    setUserActive(email, !u.active); refresh();
  };
  const onToggleAdmin = (email) => {
    const u = users.find((x) => x.email === email);
    if (!u) return;
    if (email === user.email && u.role === "admin") {
      if (!confirm("Снять с себя права администратора? Доступ к админке будет потерян.")) return;
    }
    setUserRole(email, u.role === "admin" ? "user" : "admin"); refresh();
  };
  const onDeleteUser = (email) => {
    if (email === user.email) { alert("Нельзя удалить собственную учётную запись."); return; }
    if (!confirm(`Удалить пользователя ${email}? Его приглашения сохранятся (отвязаны от хоста).`)) return;
    deleteUser(email); refresh();
  };
  const onDeleteInvite = (slug) => {
    if (!confirm(`Удалить приглашение /i/${slug}? Это действие необратимо.`)) return;
    deleteInvitation(slug); refresh();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4f2", color: "#1f1d1c",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <header style={{ background: "#1a1a1a", color: "#fff", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/" style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 8,
            background: "#2c2c2c", color: "#fff", textDecoration: "none" }} title="К приглашениям">
            <ArrowLeft size={16} />
          </Link>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#c4736a",
            display: "grid", placeItems: "center" }}><Shield size={16} /></div>
          <div>
            <div style={{ fontWeight: 700 }}>Админка</div>
            <div style={{ fontSize: 11, color: "#9a9a9a" }}>Управление порталом</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, color: "#9a9a9a" }}>{user.email}</span>
          <button onClick={() => { logout(); nav("/login"); }} style={{
            display: "inline-flex", alignItems: "center", gap: 6, background: "transparent",
            border: "1px solid #3a3a3a", color: "#fff", borderRadius: 8, padding: "6px 12px",
            cursor: "pointer", fontSize: 13, fontFamily: "inherit",
          }}>
            <LogOut size={13} /> Выйти
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 80px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22, borderBottom: "1px solid #e0dcd6" }}>
          {[
            ["overview", "Обзор"],
            ["users", `Пользователи (${stats.users})`],
            ["invites", `Приглашения (${stats.invitations})`],
            ["audit", "Журнал"],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 14, fontFamily: "inherit", fontWeight: 600,
              color: tab === k ? "#c4736a" : "#5a5550",
              borderBottom: `2px solid ${tab === k ? "#c4736a" : "transparent"}`,
              marginBottom: -1,
            }}>{l}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
              <StatCard icon={UsersIcon} label="Пользователей" value={stats.users}
                hint={`${stats.activeUsers} активных`} />
              <StatCard icon={FileText} label="Приглашений" value={stats.invitations}
                hint={`${stats.published} опубликовано`} />
              <StatCard icon={MessageSquare} label="Ответов гостей" value={stats.rsvps} />
              <StatCard icon={Shield} label="Администраторов" value={users.filter((u) => u.role === "admin").length} />
            </div>

            <div style={{ marginTop: 28 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Последние пользователи</h3>
              <div style={{ background: "#fff", border: "1px solid #e0dcd6", borderRadius: 14, overflow: "hidden" }}>
                {users.slice(0, 5).map((u, i) => (
                  <div key={u.email} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
                    borderTop: i ? "1px solid #efebe5" : "none" }}>
                    <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#c4736a", color: "#fff",
                      display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>
                      {(u.name || u.email)[0].toUpperCase()}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name || u.email.split("@")[0]}</div>
                      <div style={{ fontSize: 12, color: "#8a857f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                    </div>
                    {u.role === "admin" && <RoleBadge role="admin" />}
                    {!u.active && <RoleBadge role="banned" />}
                  </div>
                ))}
                {users.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#8a857f", fontSize: 13 }}>Пока нет зарегистрированных пользователей</div>}
              </div>
            </div>
          </div>
        )}

        {(tab === "users" || tab === "invites") && (
          <div style={{ position: "relative", marginBottom: 16 }}>
            <Search size={16} color="#8a857f" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск…" style={{
              width: "100%", padding: "11px 14px 11px 40px", borderRadius: 12,
              border: "1px solid #e0dcd6", background: "#fff", fontSize: 14,
              fontFamily: "inherit", outline: "none",
            }} />
          </div>
        )}

        {tab === "users" && (
          <div style={{ background: "#fff", border: "1px solid #e0dcd6", borderRadius: 14, overflow: "hidden" }}>
            {usersFiltered.map((u, i) => {
              const isMe = u.email === user.email;
              return (
                <div key={u.email} className="admin-row" style={{ padding: "14px 16px",
                  borderTop: i ? "1px solid #efebe5" : "none" }}>
                  <div className="admin-cell" style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name || u.email.split("@")[0]} {isMe && <span style={{ color: "#c4736a", fontSize: 11 }}>· вы</span>}</div>
                    <div style={{ fontSize: 12, color: "#8a857f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                  </div>
                  <div className="admin-meta">
                    <span style={{ fontSize: 13, color: "#5a5550" }}>{new Date(u.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <RoleBadge role={u.role} />
                    <RoleBadge role={u.active ? "active" : "banned"} />
                  </div>
                  <div className="admin-actions">
                    <button onClick={() => onToggleAdmin(u.email)} style={iconBtn} title={u.role === "admin" ? "Снять админа" : "Сделать админом"}>
                      {u.role === "admin" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    </button>
                    <button onClick={() => onToggleActive(u.email)} style={iconBtn} title={u.active ? "Отключить" : "Включить"} disabled={isMe && u.active}>
                      {u.active ? <UserX size={14} /> : <UserCheck size={14} />}
                    </button>
                    <button onClick={() => onDeleteUser(u.email)} style={{ ...iconBtn, color: "#c0392b" }} title="Удалить" disabled={isMe}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {usersFiltered.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#8a857f", fontSize: 13 }}>Никого не найдено</div>}
          </div>
        )}

        {tab === "audit" && (
          <div style={{ background: "#fff", border: "1px solid #e0dcd6", borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#8a857f",
              letterSpacing: ".08em", textTransform: "uppercase", borderBottom: "1px solid #e0dcd6", background: "#fafaf8" }}>
              <Activity size={13} /> Последние действия ({audit.length})
            </div>
            {audit.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "#8a857f", fontSize: 13 }}>Журнал пуст</div>
            ) : audit.map((e, i) => (
              <div key={i} style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                borderTop: i ? "1px solid #efebe5" : "none", fontSize: 13 }}>
                <span style={{ fontFamily: "ui-monospace, Menlo, monospace", color: "#8a857f", fontSize: 12, whiteSpace: "nowrap" }}>
                  {new Date(e.at).toLocaleString("ru-RU")}
                </span>
                <AuditBadge action={e.action} />
                {e.actor && <span style={{ color: "#5a5550" }}>{e.actor}</span>}
                {e.target && <span style={{ color: "#8a857f" }}>→ {e.target}</span>}
                {e.slug && <span style={{ color: "#8a857f", fontFamily: "ui-monospace, Menlo, monospace" }}>/i/{e.slug}</span>}
                {e.role && <span style={{ color: "#c4736a", fontWeight: 600 }}>{e.role}</span>}
                {e.eventType && <span style={{ color: "#8a857f" }}>· {EVENT_LABEL[e.eventType] || e.eventType}</span>}
              </div>
            ))}
          </div>
        )}

        {tab === "invites" && (
          <div style={{ background: "#fff", border: "1px solid #e0dcd6", borderRadius: 14, overflow: "hidden" }}>
            {invitesFiltered.map((inv, i) => {
              const hero = inv.blocks?.find((b) => b.type === "hero");
              const rsvp = inv.blocks?.find((b) => b.type === "rsvp");
              return (
                <div key={inv.slug} className="admin-row" style={{ padding: "14px 16px",
                  borderTop: i ? "1px solid #efebe5" : "none" }}>
                  <div className="admin-cell" style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{hero?.title || "Без названия"}</div>
                    <div style={{ fontSize: 12, color: "#8a857f" }}>/i/{inv.slug} · {new Date(inv.updatedAt).toLocaleDateString("ru-RU")}</div>
                  </div>
                  <div className="admin-meta">
                    <span style={{ fontSize: 13, color: "#5a5550", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{inv.hostEmail || <span style={{ color: "#bbb" }}>—</span>}</span>
                    <span style={{ fontSize: 13, color: "#5a5550" }}>{EVENT_LABEL[inv.eventType] || inv.eventType || "—"}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#c4736a", whiteSpace: "nowrap" }}>{rsvp?.responses?.length || 0} 👤</span>
                  </div>
                  <div className="admin-actions">
                    <a href={inviteUrl(inv.slug)} target="_blank" rel="noreferrer" style={iconBtnLink} title="Открыть">
                      <ExternalLink size={14} />
                    </a>
                    <button onClick={() => onDeleteInvite(inv.slug)} style={{ ...iconBtn, color: "#c0392b" }} title="Удалить">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {invitesFiltered.length === 0 && <div style={{ padding: 24, textAlign: "center", color: "#8a857f", fontSize: 13 }}>Приглашений нет</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e0dcd6", borderRadius: 14, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#8a857f", fontSize: 12, marginBottom: 8 }}>
        <Icon size={14} /> {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: "#8a857f", marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

function AuditBadge({ action }) {
  const map = {
    register: { c: "#3fb98b", l: "регистрация" },
    login: { c: "#1f6f86", l: "вход" },
    logout: { c: "#8a857f", l: "выход" },
    "invite.create": { c: "#c4736a", l: "создал приглашение" },
    "invite.delete": { c: "#c0392b", l: "удалил приглашение" },
    "user.disable": { c: "#c0392b", l: "отключил пользователя" },
    "user.enable": { c: "#3fb98b", l: "включил пользователя" },
    "user.delete": { c: "#c0392b", l: "удалил пользователя" },
    "user.role": { c: "#7a5cc4", l: "сменил роль" },
  };
  const s = map[action] || { c: "#5a5550", l: action };
  return <span style={{ background: `${s.c}1a`, color: s.c, fontSize: 11, fontWeight: 600,
    padding: "3px 8px", borderRadius: 999 }}>{s.l}</span>;
}

function RoleBadge({ role }) {
  const styles = {
    admin: { bg: "#c4736a22", color: "#c4736a", label: "Админ" },
    user: { bg: "#f0ece5", color: "#5a5550", label: "Хост" },
    active: { bg: "#3fb98b22", color: "#2a7d5e", label: "Активен" },
    banned: { bg: "#c0392b22", color: "#c0392b", label: "Отключён" },
  };
  const s = styles[role] || styles.user;
  return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600,
    padding: "3px 9px", borderRadius: 999, letterSpacing: ".04em" }}>{s.label}</span>;
}

const iconBtn = {
  display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: 8,
  border: "1px solid #e0dcd6", background: "#fff", color: "#5a5550", cursor: "pointer",
};
const iconBtnLink = { ...iconBtn, textDecoration: "none" };
