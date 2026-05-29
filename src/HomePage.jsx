import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Eye, Pencil, PartyPopper, Share2, Check, Shield, LogOut, Settings as SettingsIcon } from "lucide-react";
import { listInvitations, deleteInvitation } from "./storage.js";
import { inviteUrl } from "./links.js";
import { useAuth } from "./AuthContext.jsx";

const EVENT_LABEL = {
  wedding: "Свадьба", birthday: "День рождения", kids: "Детский праздник",
  jubilee: "Юбилей", baby: "Baby Shower", housewarm: "Новоселье", corporate: "Корпоратив",
};

const THEME_COLOR = {
  blush: "#c4736a", midnight: "#d4af6a", sage: "#5c7a4f", marine: "#1f6f86",
  sunny: "#e08a2b", noir: "#c9a24b", lavender: "#7a5cc4", emerald: "#3fb98b",
  coral: "#e85c4a", mono: "#1a1a1a",
};

export default function HomePage() {
  const { user, isAdmin, logout } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [copied, setCopied] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const refresh = () => setItems(listInvitations(user.email));
  useEffect(refresh, [user.email]);

  const remove = (slug) => {
    if (!confirm("Удалить приглашение? Ответы гостей тоже пропадут.")) return;
    deleteInvitation(slug);
    refresh();
  };

  const copyLink = async (inv) => {
    const slug = inv.slug;
    const url = inviteUrl(slug, inv);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(slug);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      window.prompt("Скопируйте ссылку:", url);
    }
  };

  const heroTitle = (inv) => inv.blocks?.find((b) => b.type === "hero")?.title || "Без названия";
  const heroDate = (inv) => {
    const hero = inv.blocks?.find((b) => b.type === "hero");
    if (!hero?.date) return "";
    return new Date(hero.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  };
  const rsvpCount = (inv) => inv.blocks?.find((b) => b.type === "rsvp")?.responses?.length || 0;

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f4", color: "#2a2422",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #ecdfd9", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#c4736a", color: "#fff", display: "grid", placeItems: "center" }}>
            <PartyPopper size={18} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Портал приглашений</div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen((o) => !o)} style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "transparent",
            border: "1px solid #ecdfd9", borderRadius: 10, padding: "6px 12px", cursor: "pointer",
            fontFamily: "inherit", color: "#2a2422", fontSize: 13,
          }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#c4736a", color: "#fff",
              display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>
              {(user.name || user.email)[0].toUpperCase()}
            </span>
            <span style={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name || user.email}
            </span>
          </button>
          {menuOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
              background: "#fff", border: "1px solid #ecdfd9", borderRadius: 12,
              padding: 6, minWidth: 220, boxShadow: "0 12px 30px rgba(0,0,0,.12)" }}>
              <div style={{ padding: "8px 10px", fontSize: 12, color: "#8a7e7a", borderBottom: "1px solid #ecdfd9", marginBottom: 4 }}>
                {user.email}
              </div>
              <button onClick={() => { setMenuOpen(false); nav("/settings"); }} style={menuItem}>
                <SettingsIcon size={14} /> Настройки
              </button>
              {isAdmin && (
                <button onClick={() => { setMenuOpen(false); nav("/admin"); }} style={menuItem}>
                  <Shield size={14} /> Админка
                </button>
              )}
              <button onClick={() => { setMenuOpen(false); logout(); nav("/login"); }} style={menuItem}>
                <LogOut size={14} /> Выйти
              </button>
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24 }}>Мои приглашения</h1>
            <div style={{ fontSize: 13, color: "#8a7e7a", marginTop: 4 }}>
              Привет, {user.name || user.email.split("@")[0]} {isAdmin && <span style={{ color: "#c4736a", fontWeight: 600 }}>· администратор</span>}
            </div>
          </div>
          <Link to="/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#c4736a", color: "#fff",
            padding: "11px 18px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
            <Plus size={16} /> Создать приглашение
          </Link>
        </div>

        {items.length === 0 ? (
          <div style={{ background: "#fff", border: "1px dashed #e6d9d3", borderRadius: 18, padding: "56px 24px", textAlign: "center", color: "#8a7e7a" }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>❦</div>
            <div style={{ fontWeight: 600, color: "#2a2422", marginBottom: 4 }}>Здесь пока пусто</div>
            <div style={{ fontSize: 14, marginBottom: 18 }}>Нажмите «Создать приглашение», чтобы собрать первую страницу.</div>
            <Link to="/new" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#c4736a", color: "#fff",
              padding: "10px 18px", borderRadius: 10, textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
              <Plus size={16} /> Создать
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {items.map((inv) => {
              const accent = THEME_COLOR[inv.themeKey] || "#c4736a";
              const photo = inv.blocks?.find((b) => b.type === "hero")?.photo;
              return (
                <div key={inv.slug} style={{ background: "#fff", border: "1px solid #ecdfd9", borderRadius: 16, overflow: "hidden",
                  display: "flex", flexDirection: "column" }}>
                  <div style={{ height: photo ? 120 : 70,
                    background: photo ? `linear-gradient(180deg, transparent 30%, rgba(0,0,0,.4) 100%), url(${photo}) center/cover`
                      : `linear-gradient(135deg, ${accent}, ${accent}99)`,
                    position: "relative" }}>
                    <span style={{ position: "absolute", top: 10, left: 14, fontSize: 11, letterSpacing: ".1em",
                      textTransform: "uppercase", color: "#fff", opacity: 0.92,
                      textShadow: photo ? "0 1px 4px rgba(0,0,0,.5)" : "none" }}>{EVENT_LABEL[inv.eventType] || "Событие"}</span>
                  </div>
                  <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{heroTitle(inv)}</div>
                    <div style={{ fontSize: 13, color: "#8a7e7a", marginBottom: 12 }}>
                      {heroDate(inv) || "Дата не указана"}
                    </div>
                    <div style={{ fontSize: 12, color: "#8a7e7a", marginBottom: 14 }}>
                      Ответов: <strong style={{ color: accent }}>{rsvpCount(inv)}</strong>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: "auto", flexWrap: "wrap" }}>
                      <Link to={`/edit/${inv.slug}`} style={iconLink(accent)} title="Редактировать"><Pencil size={14} /></Link>
                      <Link to={`/i/${inv.slug}`} target="_blank" style={iconLink(accent)} title="Открыть как гость"><Eye size={14} /></Link>
                      <button onClick={() => copyLink(inv)} style={{ ...iconBtn(accent), background: copied === inv.slug ? accent : "transparent",
                        color: copied === inv.slug ? "#fff" : accent }} title="Скопировать ссылку">
                        {copied === inv.slug ? <Check size={14} /> : <Share2 size={14} />}
                      </button>
                      <button onClick={() => remove(inv.slug)} style={iconBtn("#9b6b65")} title="Удалить"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const iconLink = (color) => ({
  display: "inline-grid", placeItems: "center", width: 32, height: 32, borderRadius: 8,
  border: `1px solid ${color}33`, color, textDecoration: "none", background: "transparent",
});
const iconBtn = (color) => ({
  display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 8,
  border: `1px solid ${color}33`, background: "transparent", color, cursor: "pointer",
});
const menuItem = {
  display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left",
  padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent",
  color: "#2a2422", fontSize: 14, fontFamily: "inherit", cursor: "pointer",
};
