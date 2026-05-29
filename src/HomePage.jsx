import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2, Eye, Pencil, PartyPopper, Share2, Check, Shield, LogOut, Settings as SettingsIcon } from "lucide-react";
import { listInvitations, deleteInvitation } from "./storage.js";
import { inviteUrl } from "./links.js";
import { useAuth } from "./AuthContext.jsx";

const GRAD = "linear-gradient(120deg, #c4736a 0%, #e0902b 100%)";
const gradText = {
  background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text",
  color: "transparent", WebkitTextFillColor: "transparent",
};

const EVENT_LABEL = {
  wedding: "Свадьба", birthday: "День рождения", kids: "Детский праздник",
  jubilee: "Юбилей", baby: "Гендер-пати", housewarm: "Новоселье", corporate: "Корпоратив",
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

  const totalRsvp = items.reduce((s, inv) => s + rsvpCount(inv), 0);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#faf7f4", color: "#2a2422",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>

      {/* Animated gradient mesh background */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div data-mesh style={{ position: "absolute", top: "-12%", left: "-8%", width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, #e0902b55, transparent 60%)", filter: "blur(60px)",
          animation: "meshDrift 18s ease-in-out infinite" }} />
        <div data-mesh style={{ position: "absolute", top: "20%", right: "-10%", width: 560, height: 560, borderRadius: "50%",
          background: "radial-gradient(circle at 60% 40%, #c4736a4d, transparent 62%)", filter: "blur(70px)",
          animation: "meshDrift 22s ease-in-out infinite reverse" }} />
        <div data-mesh style={{ position: "absolute", bottom: "-14%", left: "30%", width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle at 50% 50%, #7a5cc433, transparent 60%)", filter: "blur(70px)",
          animation: "meshDrift 26s ease-in-out infinite" }} />
      </div>

      {/* Glassy sticky header */}
      <header style={{ position: "sticky", top: 0, zIndex: 40,
        background: "rgba(255,255,255,.72)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(236,223,217,.8)", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: GRAD, color: "#fff",
            display: "grid", placeItems: "center", boxShadow: "0 6px 16px rgba(196,115,106,.35)" }}>
            <PartyPopper size={19} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Портал приглашений</div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenuOpen((o) => !o)} style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.6)",
            border: "1px solid #ecdfd9", borderRadius: 999, padding: "6px 12px 6px 6px", cursor: "pointer",
            fontFamily: "inherit", color: "#2a2422", fontSize: 13,
          }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", background: GRAD, color: "#fff",
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
              padding: 6, minWidth: 220, boxShadow: "0 16px 40px rgba(40,30,28,.16)" }}>
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

      <div style={{ position: "relative", zIndex: 1, maxWidth: 940, margin: "0 auto", padding: "40px 20px 90px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 26 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Мои <span style={gradText}>приглашения</span>
            </h1>
            <div style={{ fontSize: 14, color: "#8a7e7a", marginTop: 8 }}>
              Привет, {user.name || user.email.split("@")[0]} {isAdmin && <span style={{ color: "#c4736a", fontWeight: 600 }}>· администратор</span>}
            </div>
          </div>
          <Link to="/new" className="btn-shine" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRAD, color: "#fff",
            padding: "13px 22px", borderRadius: 14, textDecoration: "none", fontWeight: 700, fontSize: 14,
            boxShadow: "0 12px 26px rgba(196,115,106,.32)" }}>
            <Plus size={17} /> Создать приглашение
          </Link>
        </div>

        {/* Stat chips */}
        {items.length > 0 && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 26 }}>
            <StatChip label="Приглашений" value={items.length} />
            <StatChip label="Ответов гостей" value={totalRsvp} accent />
          </div>
        )}

        {items.length === 0 ? (
          <div className="lift" style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            border: "1px dashed #e0b9af", borderRadius: 22, padding: "64px 24px", textAlign: "center", color: "#8a7e7a" }}>
            <div style={{ fontSize: 46, marginBottom: 12 }}>❦</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#2a2422", marginBottom: 6 }}>Здесь пока пусто</div>
            <div style={{ fontSize: 14, marginBottom: 22, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
              Нажмите «Создать приглашение», чтобы собрать первую красивую страницу за пару минут.
            </div>
            <Link to="/new" className="btn-shine" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GRAD, color: "#fff",
              padding: "12px 22px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 14,
              boxShadow: "0 12px 26px rgba(196,115,106,.32)" }}>
              <Plus size={16} /> Создать
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))", gap: 18 }}>
            {items.map((inv) => {
              const accent = THEME_COLOR[inv.themeKey] || "#c4736a";
              const photo = inv.blocks?.find((b) => b.type === "hero")?.photo;
              return (
                <div key={inv.slug} className="lift" style={{ background: "#fff", border: "1px solid #ecdfd9", borderRadius: 20, overflow: "hidden",
                  display: "flex", flexDirection: "column", boxShadow: "0 6px 20px rgba(40,30,28,.06)" }}>
                  <div style={{ height: photo ? 130 : 78,
                    background: photo ? `linear-gradient(180deg, transparent 25%, rgba(0,0,0,.45) 100%), url(${photo}) center/cover`
                      : `linear-gradient(135deg, ${accent}, ${accent}aa)`,
                    position: "relative" }}>
                    <span style={{ position: "absolute", top: 12, left: 14, fontSize: 11, letterSpacing: ".08em",
                      textTransform: "uppercase", color: "#fff", fontWeight: 600,
                      background: "rgba(0,0,0,.22)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
                      padding: "4px 9px", borderRadius: 999 }}>{EVENT_LABEL[inv.eventType] || "Событие"}</span>
                  </div>
                  <div style={{ padding: 18, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 5, letterSpacing: "-0.01em" }}>{heroTitle(inv)}</div>
                    <div style={{ fontSize: 13, color: "#8a7e7a", marginBottom: 14 }}>
                      {heroDate(inv) || "Дата не указана"}
                    </div>
                    <div style={{ fontSize: 12, color: "#8a7e7a", marginBottom: 16 }}>
                      Ответов: <strong style={{ color: accent, fontSize: 14 }}>{rsvpCount(inv)}</strong>
                    </div>
                    <div style={{ display: "flex", gap: 7, marginTop: "auto", flexWrap: "wrap" }}>
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

function StatChip({ label, value, accent }) {
  return (
    <div style={{ background: "rgba(255,255,255,.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
      border: "1px solid #ecdfd9", borderRadius: 14, padding: "12px 18px", minWidth: 140,
      boxShadow: "0 4px 14px rgba(40,30,28,.05)" }}>
      <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1, ...(accent ? gradText : { color: "#2a2422" }) }}>{value}</div>
      <div style={{ fontSize: 12, color: "#8a7e7a", marginTop: 5 }}>{label}</div>
    </div>
  );
}

const iconLink = (color) => ({
  display: "inline-grid", placeItems: "center", width: 34, height: 34, borderRadius: 9,
  border: `1px solid ${color}33`, color, textDecoration: "none", background: "transparent",
  transition: "background .18s, color .18s",
});
const iconBtn = (color) => ({
  display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 9,
  border: `1px solid ${color}33`, background: "transparent", color, cursor: "pointer",
  transition: "background .18s, color .18s",
});
const menuItem = {
  display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left",
  padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent",
  color: "#2a2422", fontSize: 14, fontFamily: "inherit", cursor: "pointer",
};
