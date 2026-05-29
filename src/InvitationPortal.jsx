import React, { useState, useEffect } from "react";
import {
  Gift, MapPin, CalendarHeart, Plus, Trash2, Type, Clock, X, Eye, Pencil,
  PartyPopper, Heart, Users, ChevronUp, ChevronDown, Sparkles, Link as LinkIcon,
  Check, Timer, Image as ImageIcon, Cake, Baby, Home, Briefcase, GlassWater,
  LayoutGrid, ClipboardList, Share2, ArrowLeft, Settings as SettingsIcon, Shield, LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveInvitation } from "./storage.js";
import { inviteUrl } from "./links.js";
import { useAuth } from "./AuthContext.jsx";

// ─── Event types (как поводы у SUPA, но для живой страницы) ────────
const EVENT_TYPES = {
  wedding:   { label: "Свадьба",         icon: Heart,        theme: "blush",
    blocks: ["hero", "text", "location", "schedule", "wishlist", "rsvp"],
    hero: { title: "Анна & Дмитрий", subtitle: "приглашают вас на свадьбу" } },
  birthday:  { label: "День рождения",    icon: Cake,         theme: "marine",
    blocks: ["hero", "countdown", "location", "wishlist", "rsvp"],
    hero: { title: "Мне 30!", subtitle: "приглашаю отпраздновать" } },
  kids:      { label: "Детский праздник", icon: PartyPopper,  theme: "sunny",
    blocks: ["hero", "text", "location", "schedule", "rsvp"],
    hero: { title: "Тёме 5 лет!", subtitle: "ждём тебя на праздник" } },
  jubilee:   { label: "Юбилей",           icon: GlassWater,   theme: "midnight",
    blocks: ["hero", "countdown", "text", "location", "rsvp"],
    hero: { title: "50 лет", subtitle: "приглашаем разделить торжество" } },
  baby:      { label: "Гендер-пати",      icon: Baby,         theme: "lavender",
    blocks: ["hero", "text", "location", "wishlist", "rsvp"],
    hero: { title: "Мальчик или девочка?", subtitle: "приглашаем на гендер-пати" } },
  housewarm: { label: "Новоселье",        icon: Home,         theme: "sage",
    blocks: ["hero", "location", "schedule", "rsvp"],
    hero: { title: "Новоселье!", subtitle: "приходите в гости" } },
  corporate: { label: "Корпоратив",       icon: Briefcase,    theme: "midnight",
    blocks: ["hero", "countdown", "location", "schedule", "rsvp"],
    hero: { title: "Новогодний вечер", subtitle: "приглашаем команду" } },
};

// ─── Theme presets (полноценные визуальные шаблоны) ───────────────
// Каждая тема: цвета + декоративный фон (pattern) + display-шрифт + мотив hero
const THEMES = {
  blush: {
    name: "Романтика", bg: "#faf3ef", panel: "#fffaf7", ink: "#3a2b28", soft: "#8a6f68",
    accent: "#c4736a", accent2: "#e3a89f", line: "#ecdcd5",
    display: `Georgia, "Times New Roman", serif`, motif: "❦",
    pattern: (c) => `radial-gradient(circle at 15% 20%, ${c.accent2}22, transparent 40%), radial-gradient(circle at 85% 80%, ${c.accent2}1c, transparent 45%)`,
  },
  midnight: {
    name: "Полночь", bg: "#10131c", panel: "#1a1f2e", ink: "#eef1f8", soft: "#9aa3bd",
    accent: "#d4af6a", accent2: "#8b6f3e", line: "#2a3146",
    display: `"Didot", Georgia, serif`, motif: "✦",
    pattern: (c) => `radial-gradient(circle at 50% 0%, ${c.accent}14, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 38px, ${c.line}55 38px, ${c.line}55 39px)`,
  },
  sage: {
    name: "Ботаника", bg: "#f1f4ee", panel: "#fbfcf9", ink: "#2b3327", soft: "#6f7d66",
    accent: "#5c7a4f", accent2: "#9ab089", line: "#dde5d6",
    display: `"Cormorant Garamond", Georgia, serif`, motif: "❧",
    pattern: (c) => `radial-gradient(ellipse at 0% 100%, ${c.accent2}26, transparent 35%), radial-gradient(ellipse at 100% 0%, ${c.accent2}22, transparent 35%)`,
  },
  marine: {
    name: "Морская", bg: "#eef4f6", panel: "#ffffff", ink: "#142730", soft: "#5d7a85",
    accent: "#1f6f86", accent2: "#67a6b8", line: "#d6e4e8",
    display: `"Helvetica Neue", Arial, sans-serif`, motif: "≈",
    pattern: (c) => `repeating-linear-gradient(135deg, transparent, transparent 22px, ${c.accent2}12 22px, ${c.accent2}12 23px)`,
  },
  sunny: {
    name: "Праздник", bg: "#fff8ec", panel: "#fffdf8", ink: "#42301a", soft: "#9a7b4f",
    accent: "#e08a2b", accent2: "#f2c378", line: "#f3e3c6",
    display: `"Trebuchet MS", sans-serif`, motif: "✺",
    pattern: (c) => `radial-gradient(circle at 20% 30%, ${c.accent}1f 0 8px, transparent 9px), radial-gradient(circle at 70% 60%, ${c.accent2}33 0 6px, transparent 7px), radial-gradient(circle at 90% 20%, ${c.accent}1a 0 10px, transparent 11px)`,
  },
  noir: {
    name: "Нуар", bg: "#161514", panel: "#201e1c", ink: "#f3efe8", soft: "#9d958a",
    accent: "#c9a24b", accent2: "#6e5a2c", line: "#332f2a",
    display: `"Times New Roman", serif`, motif: "◆",
    pattern: (c) => `linear-gradient(${c.panel}, ${c.bg}), repeating-linear-gradient(90deg, transparent, transparent 60px, ${c.line}66 60px, ${c.line}66 61px)`,
  },
  lavender: {
    name: "Лаванда", bg: "#f4f0fa", panel: "#fdfbff", ink: "#2f2640", soft: "#7c7090",
    accent: "#7a5cc4", accent2: "#b8a6e8", line: "#e4dcf2",
    display: `"Cormorant Garamond", Georgia, serif`, motif: "✿",
    pattern: (c) => `radial-gradient(circle at 80% 10%, ${c.accent2}33, transparent 40%), radial-gradient(circle at 10% 90%, ${c.accent2}28, transparent 45%)`,
  },
  emerald: {
    name: "Изумруд", bg: "#0f1c18", panel: "#16271f", ink: "#eaf3ee", soft: "#8fae9d",
    accent: "#3fb98b", accent2: "#2a7d5e", line: "#23362c",
    display: `"Didot", Georgia, serif`, motif: "✣",
    pattern: (c) => `radial-gradient(circle at 50% -10%, ${c.accent}22, transparent 55%), radial-gradient(circle at 0% 100%, ${c.accent2}1c, transparent 40%)`,
  },
  coral: {
    name: "Коралл", bg: "#fff1ee", panel: "#fffaf9", ink: "#3d211d", soft: "#a76f63",
    accent: "#e85c4a", accent2: "#f7a896", line: "#f6ddd6",
    display: `"Trebuchet MS", sans-serif`, motif: "❀",
    pattern: (c) => `repeating-radial-gradient(circle at 50% 50%, transparent 0 28px, ${c.accent2}14 28px 29px)`,
  },
  mono: {
    name: "Минимал", bg: "#f6f6f4", panel: "#ffffff", ink: "#1a1a1a", soft: "#777570",
    accent: "#1a1a1a", accent2: "#c9c7c2", line: "#e4e3df",
    display: `"Helvetica Neue", Arial, sans-serif`, motif: "—",
    pattern: () => "none",
  },
};

const BLOCK_LIBRARY = [
  { type: "hero",     label: "Заголовок",   icon: CalendarHeart, desc: "Имена, событие, дата" },
  { type: "countdown",label: "Отсчёт",      icon: Timer,         desc: "Таймер до события" },
  { type: "text",     label: "Текст",       icon: Type,          desc: "Произвольный абзац" },
  { type: "location", label: "Локация",     icon: MapPin,        desc: "Место и карта" },
  { type: "schedule", label: "Программа",   icon: Clock,         desc: "Расписание дня" },
  { type: "wishlist", label: "Вишлист",     icon: Gift,          desc: "Список подарков" },
  { type: "rsvp",     label: "Форма ответа",icon: Users,         desc: "RSVP приглашённых" },
];

let _id = 100;
const uid = () => `b${++_id}`;

function defaultBlock(type, ev) {
  switch (type) {
    case "hero":
      return { id: uid(), type, title: ev?.hero?.title || "Событие",
        subtitle: ev?.hero?.subtitle || "приглашаем вас", date: "2026-08-15", time: "17:00" };
    case "countdown":
      return { id: uid(), type, label: "До события осталось", target: "2026-08-15T17:00" };
    case "text":
      return { id: uid(), type, heading: "Дорогие гости",
        body: "Будем счастливы видеть вас. Ваше присутствие — лучший подарок." };
    case "location":
      return { id: uid(), type, name: "Площадка «Сад»", address: "ул. Садовая 12, Астана",
        note: "Парковка со стороны главного входа." };
    case "schedule":
      return { id: uid(), type, items: [
        { id: uid(), time: "17:00", title: "Сбор гостей" },
        { id: uid(), time: "18:00", title: "Торжественная часть" },
        { id: uid(), time: "19:30", title: "Банкет" },
      ]};
    case "wishlist":
      return { id: uid(), type, intro: "Если захотите порадовать нас подарком:", items: [
        { id: uid(), name: "Сертификат в путешествие", url: "", price: 50000, photo: "",
          group: false, raised: 0, takenBy: "" },
        { id: uid(), name: "Набор для дома", url: "", price: 15000, photo: "",
          group: false, raised: 0, takenBy: "" },
      ]};
    case "rsvp":
      return { id: uid(), type, prompt: "Подтвердите, пожалуйста, ваше присутствие",
        deadline: "2026-08-01", responses: [] };
    default: return { id: uid(), type };
  }
}

export default function InvitationPortal({ slug, initial, guestMode = false }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(initial ? "build" : "type"); // type | build
  const [eventType, setEventType] = useState(initial?.eventType || null);
  const [themeKey, setThemeKey] = useState(initial?.themeKey || "blush");
  const [font, setFont] = useState(initial?.font || "theme");
  const [view, setView] = useState(guestMode ? "preview" : "edit"); // edit | preview | dashboard
  const [blocks, setBlocks] = useState(initial?.blocks || []);
  const [showAdd, setShowAdd] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [shared, setShared] = useState(false);

  // Persist every change when we have a slug
  useEffect(() => {
    if (!slug || step !== "build") return;
    saveInvitation(slug, { eventType, themeKey, font, blocks }, auth?.user?.email);
  }, [slug, step, eventType, themeKey, font, blocks, auth?.user?.email]);

  const shareLink = slug ? inviteUrl(slug, { eventType, themeKey, font, blocks }) : "";
  const copyShare = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      window.prompt("Скопируйте ссылку:", shareLink);
    }
  };

  const t = THEMES[themeKey];
  const fontStack = font === "theme" ? t.display
    : font === "serif" ? `Georgia, "Times New Roman", serif`
    : font === "mono" ? `"Courier New", monospace` : `"Helvetica Neue", Arial, sans-serif`;

  const startEvent = (key) => {
    const ev = EVENT_TYPES[key];
    setEventType(key);
    setThemeKey(ev.theme);
    setBlocks(ev.blocks.map((b) => defaultBlock(b, ev)));
    setStep("build");
  };

  const addBlock = (type) => { setBlocks((b) => [...b, defaultBlock(type, EVENT_TYPES[eventType])]); setShowAdd(false); };
  const removeBlock = (id) => setBlocks((b) => b.filter((x) => x.id !== id));
  const updateBlock = (id, patch) => setBlocks((b) => b.map((x) => x.id === id ? { ...x, ...patch } : x));
  const moveBlock = (id, dir) => setBlocks((b) => {
    const i = b.findIndex((x) => x.id === id), j = i + dir;
    if (j < 0 || j >= b.length) return b;
    const c = [...b]; [c[i], c[j]] = [c[j], c[i]]; return c;
  });

  const rsvpBlock = blocks.find((b) => b.type === "rsvp");

  // ── Step 1: choose event type ──
  if (step === "type") {
    return (
      <div style={{ minHeight: "100vh", background: t.bg, color: t.ink, fontFamily: fontStack,
        backgroundImage: t.pattern(t), display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 620, width: "100%", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: t.accent, margin: "0 auto 18px",
            display: "grid", placeItems: "center", color: "#fff" }}><PartyPopper size={24} /></div>
          <h1 style={{ fontSize: 32, margin: "0 0 6px", fontWeight: 700 }}>Создать приглашение</h1>
          <p style={{ color: t.soft, margin: "0 0 28px" }}>Выберите тип мероприятия — мы соберём страницу за вас</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
            {Object.entries(EVENT_TYPES).map(([k, v]) => {
              const Icon = v.icon;
              return (
                <button key={k} onClick={() => startEvent(k)}
                  style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 16, padding: "22px 14px",
                    cursor: "pointer", color: t.ink, fontFamily: "inherit", transition: "transform .12s, box-shadow .12s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,.10)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                  <Icon size={26} color={THEMES[v.theme].accent} />
                  <div style={{ fontWeight: 600, marginTop: 10, fontSize: 15 }}>{v.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: builder ──
  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.ink, fontFamily: fontStack, transition: "background .4s",
      backgroundImage: t.pattern(t), backgroundAttachment: "fixed" }}>
      {!guestMode && (
        <header style={{ position: "sticky", top: 0, zIndex: 40, background: t.panel, borderBottom: `1px solid ${t.line}`,
          padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => navigate("/")} style={iconBtn(t)} title="К моим приглашениям"><ArrowLeft size={18} /></button>
            <button onClick={() => setStep("type")} style={iconBtn(t)} title="Сменить тип"><LayoutGrid size={18} /></button>
            <div>
              <div style={{ fontWeight: 700 }}>{EVENT_TYPES[eventType].label}</div>
              <div style={{ fontSize: 11, color: t.soft }}>{slug ? `/i/${slug}` : "Черновик"}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setShowThemes((s) => !s)} style={{ ...btn(t, false), padding: "7px 12px" }}>
              <Sparkles size={14} /> {t.name}
            </button>
            <select value={font} onChange={(e) => setFont(e.target.value)}
              style={{ background: t.bg, color: t.ink, border: `1px solid ${t.line}`, borderRadius: 8, padding: "6px 8px", fontSize: 13, fontFamily: "inherit" }}>
              <option value="theme">Шрифт темы</option>
              <option value="serif">Serif</option><option value="sans">Sans</option><option value="mono">Mono</option>
            </select>
            <div style={{ display: "flex", background: t.bg, borderRadius: 9, padding: 3, gap: 2, border: `1px solid ${t.line}` }}>
              {[["edit", Pencil, "Редактор"], ["preview", Eye, "Просмотр"], ["dashboard", ClipboardList, "Ответы"]].map(([m, Ic, lbl]) => (
                <button key={m} onClick={() => setView(m)} style={{ display: "inline-flex", alignItems: "center", gap: 5,
                  border: "none", borderRadius: 7, padding: "6px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                  background: view === m ? t.accent : "transparent", color: view === m ? "#fff" : t.soft }}>
                  <Ic size={14} /> {lbl}
                </button>
              ))}
            </div>
            {slug && (
              <button onClick={copyShare} style={{ ...btn(t, true), padding: "7px 12px" }} title={shareLink}>
                {shared ? <><Check size={14} /> Скопировано</> : <><Share2 size={14} /> Поделиться</>}
              </button>
            )}
            {auth?.user && (
              <div style={{ position: "relative" }}>
                <button onClick={() => setMenuOpen((o) => !o)} style={{
                  display: "inline-flex", alignItems: "center", gap: 8, background: "transparent",
                  border: `1px solid ${t.line}`, borderRadius: 10, padding: "6px 10px", cursor: "pointer",
                  fontFamily: "inherit", color: t.ink, fontSize: 13,
                }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", background: t.accent, color: "#fff",
                    display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12 }}>
                    {(auth.user.name || auth.user.email)[0].toUpperCase()}
                  </span>
                  <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{auth.user.name || auth.user.email}</span>
                </button>
                {menuOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50,
                    background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12,
                    padding: 6, minWidth: 200, boxShadow: "0 12px 30px rgba(0,0,0,.12)" }}>
                    <div style={{ padding: "8px 10px", fontSize: 12, color: t.soft, borderBottom: `1px solid ${t.line}`, marginBottom: 4 }}>
                      {auth.user.email}
                    </div>
                    <button onClick={() => { setMenuOpen(false); navigate("/settings"); }} style={menuItemStyle(t)}>
                      <SettingsIcon size={14} style={{ marginRight: 8, verticalAlign: "-2px" }} /> Настройки
                    </button>
                    {auth.isAdmin && (
                      <button onClick={() => { setMenuOpen(false); navigate("/admin"); }} style={menuItemStyle(t)}>
                        <Shield size={14} style={{ marginRight: 8, verticalAlign: "-2px" }} /> Админка
                      </button>
                    )}
                    <button onClick={() => { setMenuOpen(false); auth.logout(); navigate("/login"); }} style={menuItemStyle(t)}>
                      <LogOut size={14} style={{ marginRight: 8, verticalAlign: "-2px" }} /> Выйти
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Theme picker panel */}
      {showThemes && (
        <div style={{ background: t.panel, borderBottom: `1px solid ${t.line}`, padding: "16px 20px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ fontSize: 13, color: t.soft, marginBottom: 10, letterSpacing: ".08em", textTransform: "uppercase" }}>Выберите визуальный шаблон</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(116px,1fr))", gap: 10 }}>
              {Object.entries(THEMES).map(([k, v]) => (
                <button key={k} onClick={() => { setThemeKey(k); setFont("theme"); }}
                  style={{ cursor: "pointer", border: `2px solid ${themeKey === k ? v.accent : t.line}`,
                    borderRadius: 12, overflow: "hidden", background: v.panel, padding: 0, fontFamily: "inherit", textAlign: "left" }}>
                  <div style={{ height: 46, background: v.bg, position: "relative",
                    backgroundImage: v.pattern(v) }}>
                    <span style={{ position: "absolute", top: 6, right: 8, color: v.accent, fontSize: 16 }}>{v.motif}</span>
                    <div style={{ position: "absolute", bottom: 6, left: 8, display: "flex", gap: 4 }}>
                      {[v.accent, v.accent2, v.ink].map((c, i) => (
                        <span key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, outline: `1px solid ${v.line}` }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ padding: "7px 9px", fontSize: 13, fontWeight: 600, color: v.ink, background: v.panel,
                    fontFamily: v.display }}>{v.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 18px 80px" }}>
        {view === "dashboard" ? (
          <Dashboard t={t} rsvp={rsvpBlock} />
        ) : (
          <>
            <div style={{ background: t.panel, borderRadius: 20, overflow: "hidden",
              boxShadow: "0 18px 50px rgba(0,0,0,.10)", border: `1px solid ${t.line}` }}>
              {blocks.map((blk, i) => (
                <BlockWrap key={blk.id} t={t} mode={view} first={i === 0} last={i === blocks.length - 1}
                  onUp={() => moveBlock(blk.id, -1)} onDown={() => moveBlock(blk.id, 1)} onRemove={() => removeBlock(blk.id)}>
                  <BlockRenderer t={t} mode={view} blk={blk} update={(p) => updateBlock(blk.id, p)} />
                </BlockWrap>
              ))}
              {blocks.length === 0 && (
                <div style={{ padding: 60, textAlign: "center", color: t.soft }}>
                  <Sparkles size={28} style={{ marginBottom: 8 }} /><div>Добавьте первый блок ниже.</div>
                </div>
              )}
            </div>

            {view === "edit" && (
              <div style={{ marginTop: 18 }}>
                {!showAdd ? (
                  <button onClick={() => setShowAdd(true)} style={{ ...btn(t, false), width: "100%", justifyContent: "center", padding: 14, borderStyle: "dashed" }}>
                    <Plus size={17} /> Добавить блок
                  </button>
                ) : (
                  <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 16, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <strong style={{ fontSize: 14 }}>Выберите блок</strong>
                      <button onClick={() => setShowAdd(false)} style={iconBtn(t)}><X size={16} /></button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 10 }}>
                      {BLOCK_LIBRARY.map((b) => {
                        const Icon = b.icon;
                        return (
                          <button key={b.type} onClick={() => addBlock(b.type)}
                            style={{ textAlign: "left", background: t.bg, border: `1px solid ${t.line}`, borderRadius: 12, padding: 12,
                              cursor: "pointer", color: t.ink, fontFamily: "inherit", transition: "transform .12s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}>
                            <Icon size={20} color={t.accent} />
                            <div style={{ fontWeight: 600, marginTop: 6, fontSize: 14 }}>{b.label}</div>
                            <div style={{ fontSize: 11, color: t.soft, marginTop: 2 }}>{b.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {view === "preview" && (
              <div style={{ marginTop: 18, textAlign: "center", color: t.soft, fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <LinkIcon size={14} /> Так приглашение увидят ваши гости
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────
function Dashboard({ t, rsvp }) {
  const [filter, setFilter] = useState("all"); // all | yes | no
  const [q, setQ] = useState("");
  const responses = rsvp?.responses || [];
  const going = responses.filter((r) => r.attending === "yes");
  const notGoing = responses.filter((r) => r.attending === "no");
  const guestCount = going.reduce((s, r) => s + Number(r.guests || 1), 0);

  const filtered = responses.filter((r) => {
    if (filter !== "all" && r.attending !== filter) return false;
    if (q.trim()) {
      const hay = (r.name + " " + (r.companions || []).join(" ")).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const exportCsv = () => {
    const head = ["Имя", "Статус", "Гостей", "Сопровождающие", "Ограничения по еде", "Пожелания"];
    const rows = responses.map((r) => [
      r.name, r.attending === "yes" ? "Придёт" : "Не сможет", r.guests || 1,
      (r.companions || []).join("; "), r.diet || "", r.note || "",
    ]);
    const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + [head, ...rows].map((row) => row.map(esc).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "rsvp.csv"; a.click();
    URL.revokeObjectURL(a.href);
  };

  const Stat = ({ n, l }) => (
    <div style={{ flex: 1, background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: t.accent }}>{n}</div>
      <div style={{ fontSize: 12, color: t.soft, marginTop: 2 }}>{l}</div>
    </div>
  );
  const FilterBtn = ({ id, label }) => (
    <button onClick={() => setFilter(id)} style={{ border: `1px solid ${filter === id ? t.accent : t.line}`,
      background: filter === id ? t.accent : "transparent", color: filter === id ? "#fff" : t.soft,
      borderRadius: 9, padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{label}</button>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Ответы гостей</h2>
        {responses.length > 0 && (
          <button onClick={exportCsv} style={{ ...btn(t, false), padding: "8px 14px" }}><ClipboardList size={15} /> Экспорт CSV</button>
        )}
      </div>
      {!rsvp && <p style={{ color: t.soft }}>Добавьте блок «Форма ответа», чтобы собирать RSVP.</p>}
      {rsvp && (
        <>
          <div style={{ display: "flex", gap: 10, margin: "16px 0 18px" }}>
            <Stat n={going.length} l="придут" />
            <Stat n={guestCount} l="гостей всего" />
            <Stat n={notGoing.length} l="не смогут" />
          </div>

          {/* filters + search */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
            <FilterBtn id="all" label={`Все (${responses.length})`} />
            <FilterBtn id="yes" label={`Придут (${going.length})`} />
            <FilterBtn id="no" label={`Не смогут (${notGoing.length})`} />
            <input placeholder="Поиск по имени…" value={q} onChange={(e) => setQ(e.target.value)}
              style={{ ...field(t), flex: 1, minWidth: 140, padding: "7px 12px", fontSize: 13 }} />
          </div>

          {filtered.length === 0 ? (
            <div style={{ background: t.panel, border: `1px dashed ${t.line}`, borderRadius: 14, padding: 28, textAlign: "center", color: t.soft }}>
              {responses.length === 0
                ? "Пока нет ответов. Откройте «Просмотр» и заполните форму."
                : "Нет ответов под выбранный фильтр."}
            </div>
          ) : (
            <div style={{ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, overflow: "hidden" }}>
              {filtered.map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px",
                  borderTop: i ? `1px solid ${t.line}` : "none" }}>
                  <div style={{ width: 34, height: 34, flexShrink: 0, borderRadius: "50%", display: "grid", placeItems: "center",
                    background: r.attending === "yes" ? `${t.accent}22` : `${t.line}`, color: r.attending === "yes" ? t.accent : t.soft }}>
                    {r.attending === "yes" ? <Check size={16} /> : <X size={16} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    {r.companions && r.companions.length > 0 && (
                      <div style={{ fontSize: 12, color: t.soft, marginTop: 2 }}>
                        +{r.companions.length}: {r.companions.join(", ")}
                      </div>
                    )}
                    {r.diet && <div style={{ fontSize: 12, color: t.accent, marginTop: 2 }}>🍽 {r.diet}</div>}
                    {r.note && <div style={{ fontSize: 12, color: t.soft, marginTop: 2 }}>{r.note}</div>}
                  </div>
                  {r.attending === "yes" && <span style={{ fontSize: 13, color: t.soft, whiteSpace: "nowrap" }}>{r.guests} 👤</span>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function BlockWrap({ t, mode, children, first, last, onUp, onDown, onRemove }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ position: "relative", borderBottom: `1px solid ${t.line}` }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {mode === "edit" && hover && (
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 5, display: "flex", gap: 4,
          background: t.panel, border: `1px solid ${t.line}`, borderRadius: 10, padding: 3, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
          <button onClick={onUp} disabled={first} style={iconBtn(t, first)}><ChevronUp size={15} /></button>
          <button onClick={onDown} disabled={last} style={iconBtn(t, last)}><ChevronDown size={15} /></button>
          <button onClick={onRemove} style={iconBtn(t)}><Trash2 size={15} color={t.accent} /></button>
        </div>
      )}
      {children}
    </div>
  );
}

function BlockRenderer({ t, mode, blk, update }) {
  switch (blk.type) {
    case "hero":      return <HeroBlock {...{ t, mode, blk, update }} />;
    case "countdown": return <CountdownBlock {...{ t, mode, blk, update }} />;
    case "text":      return <TextBlock {...{ t, mode, blk, update }} />;
    case "location":  return <LocationBlock {...{ t, mode, blk, update }} />;
    case "schedule":  return <ScheduleBlock {...{ t, mode, blk, update }} />;
    case "wishlist":  return <WishlistBlock {...{ t, mode, blk, update }} />;
    case "rsvp":      return <RsvpBlock {...{ t, mode, blk, update }} />;
    default:          return null;
  }
}

function Editable({ t, mode, value, onChange, multiline, style, placeholder }) {
  if (mode === "preview") return <span style={style}>{value || ""}</span>;
  const common = { value: value || "", placeholder, onChange: (e) => onChange(e.target.value),
    style: { ...style, width: "100%", background: "transparent", border: `1px dashed ${t.line}`,
      borderRadius: 6, padding: "4px 6px", color: "inherit", fontFamily: "inherit", resize: "vertical" } };
  return multiline ? <textarea rows={3} {...common} /> : <input {...common} />;
}

function HeroBlock({ t, mode, blk, update }) {
  const dateStr = blk.date ? new Date(blk.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "";
  const fileRef = React.useRef(null);
  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) { alert("Фото слишком большое — до 3 МБ."); return; }
    const r = new FileReader();
    r.onload = () => update({ photo: r.result });
    r.readAsDataURL(f);
  };
  const hasPhoto = !!blk.photo;
  return (
    <div style={{ position: "relative", overflow: "hidden",
      background: hasPhoto ? `linear-gradient(180deg, ${t.bg}00 0%, ${t.panel}cc 70%, ${t.panel} 100%), url(${blk.photo}) center/cover`
        : `linear-gradient(160deg, ${t.accent2}22, transparent)`,
      minHeight: hasPhoto ? 380 : "auto",
      display: "flex", flexDirection: "column", justifyContent: hasPhoto ? "flex-end" : "center" }}>
      <div style={{ padding: "56px 32px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 30, color: t.accent, marginBottom: 12, lineHeight: 1 }}>{t.motif}</div>
        <Editable t={t} mode={mode} value={blk.subtitle} onChange={(v) => update({ subtitle: v })}
          style={{ display: "block", color: t.soft, letterSpacing: ".18em", textTransform: "uppercase", fontSize: 12, marginBottom: 14 }} />
        <Editable t={t} mode={mode} value={blk.title} onChange={(v) => update({ title: v })}
          style={{ display: "block", fontSize: 42, fontWeight: 700, lineHeight: 1.1, marginBottom: 18, fontFamily: t.display }} />
        <div style={{ display: "inline-flex", gap: 18, alignItems: "center", borderTop: `1px solid ${t.line}`, borderBottom: `1px solid ${t.line}`, padding: "10px 0" }}>
          {mode === "edit" ? (
            <>
              <input type="date" value={blk.date} onChange={(e) => update({ date: e.target.value })}
                style={{ background: "transparent", border: `1px dashed ${t.line}`, borderRadius: 6, color: "inherit", padding: 4, fontFamily: "inherit" }} />
              <input type="time" value={blk.time} onChange={(e) => update({ time: e.target.value })}
                style={{ background: "transparent", border: `1px dashed ${t.line}`, borderRadius: 6, color: "inherit", padding: 4, fontFamily: "inherit" }} />
            </>
          ) : <span style={{ fontSize: 16, letterSpacing: ".04em" }}>{dateStr} · {blk.time}</span>}
        </div>
        {mode === "edit" && (
          <div style={{ marginTop: 18, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={onPick} style={{ display: "none" }} />
            <button onClick={() => fileRef.current?.click()} style={{ ...btn(t, false), padding: "6px 12px", fontSize: 13 }}>
              <ImageIcon size={13} /> {hasPhoto ? "Заменить обложку" : "Добавить обложку"}
            </button>
            {hasPhoto && (
              <button onClick={() => update({ photo: "" })} style={{ ...btn(t, false), padding: "6px 12px", fontSize: 13 }}>
                <X size={13} /> Убрать
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CountdownBlock({ t, mode, blk, update }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, new Date(blk.target).getTime() - now);
  const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  const Cell = ({ n, l }) => (
    <div style={{ textAlign: "center", minWidth: 64 }}>
      <div style={{ fontSize: 34, fontWeight: 700, color: t.accent, fontVariantNumeric: "tabular-nums" }}>{String(n).padStart(2, "0")}</div>
      <div style={{ fontSize: 11, color: t.soft, textTransform: "uppercase", letterSpacing: ".1em" }}>{l}</div>
    </div>
  );
  return (
    <div style={{ padding: "36px 32px", textAlign: "center" }}>
      <Editable t={t} mode={mode} value={blk.label} onChange={(v) => update({ label: v })}
        style={{ display: "block", color: t.soft, fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }} />
      <div style={{ display: "inline-flex", gap: 16, alignItems: "center" }}>
        <Cell n={d} l="дней" /><Cell n={h} l="часов" /><Cell n={m} l="минут" /><Cell n={s} l="секунд" />
      </div>
      {mode === "edit" && (
        <div style={{ marginTop: 16 }}>
          <input type="datetime-local" value={blk.target} onChange={(e) => update({ target: e.target.value })}
            style={{ background: "transparent", border: `1px dashed ${t.line}`, borderRadius: 6, color: "inherit", padding: 6, fontFamily: "inherit" }} />
        </div>
      )}
    </div>
  );
}

function TextBlock({ t, mode, blk, update }) {
  return (
    <div style={{ padding: "36px 32px" }}>
      <Editable t={t} mode={mode} value={blk.heading} onChange={(v) => update({ heading: v })}
        style={{ display: "block", fontSize: 22, fontWeight: 600, marginBottom: 10, color: t.accent }} />
      <Editable t={t} mode={mode} multiline value={blk.body} onChange={(v) => update({ body: v })}
        style={{ display: "block", fontSize: 16, lineHeight: 1.65 }} />
    </div>
  );
}

function LocationBlock({ t, mode, blk, update }) {
  const [coords, setCoords] = React.useState(null);
  const [geoState, setGeoState] = React.useState("idle"); // idle | loading | ok | fail
  const mapLink = `https://www.openstreetmap.org/search?query=${encodeURIComponent(blk.address || "")}`;

  React.useEffect(() => {
    if (!blk.address) { setCoords(null); setGeoState("idle"); return; }
    let cancelled = false;
    setGeoState("loading");
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(blk.address)}`;
    const t0 = setTimeout(() => {
      fetch(url, { headers: { "Accept-Language": "ru" } })
        .then((r) => r.json())
        .then((arr) => {
          if (cancelled) return;
          if (arr && arr[0]) {
            const { lat, lon } = arr[0];
            setCoords({ lat: Number(lat), lon: Number(lon) });
            setGeoState("ok");
          } else { setGeoState("fail"); }
        })
        .catch(() => !cancelled && setGeoState("fail"));
    }, 400);
    return () => { cancelled = true; clearTimeout(t0); };
  }, [blk.address]);

  const bbox = coords ? `${coords.lon - 0.01},${coords.lat - 0.008},${coords.lon + 0.01},${coords.lat + 0.008}` : null;
  const embedSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lon}`
    : null;

  return (
    <div style={{ padding: "36px 32px" }}>
      <SectionLabel t={t} icon={MapPin} text="Локация" />
      <Editable t={t} mode={mode} value={blk.name} onChange={(v) => update({ name: v })}
        style={{ display: "block", fontSize: 22, fontWeight: 600, marginBottom: 6 }} />
      <Editable t={t} mode={mode} value={blk.address} onChange={(v) => update({ address: v })}
        style={{ display: "block", fontSize: 15, color: t.soft, marginBottom: 10 }} />
      <Editable t={t} mode={mode} multiline value={blk.note} onChange={(v) => update({ note: v })}
        style={{ display: "block", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }} />
      <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${t.line}`, height: 240, position: "relative",
        background: t.bg }}>
        {embedSrc ? (
          <iframe title="Карта" src={embedSrc} loading="lazy"
            style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
        ) : (
          <div style={{ display: "grid", placeItems: "center", height: "100%",
            background: `repeating-linear-gradient(45deg, ${t.bg}, ${t.bg} 12px, ${t.line}44 12px, ${t.line}44 24px)` }}>
            <div style={{ textAlign: "center", color: t.soft, fontSize: 13 }}>
              {geoState === "loading" ? "Ищем место на карте…"
                : geoState === "fail" ? "Не удалось найти адрес"
                : "Укажите адрес — появится карта"}
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 10, textAlign: "center" }}>
        <a href={mapLink} target="_blank" rel="noreferrer" style={{ ...btn(t, true), textDecoration: "none" }}>
          <MapPin size={15} /> Открыть на карте
        </a>
      </div>
    </div>
  );
}

function ScheduleBlock({ t, mode, blk, update }) {
  const setItem = (id, p) => update({ items: blk.items.map((it) => it.id === id ? { ...it, ...p } : it) });
  const add = () => update({ items: [...blk.items, { id: uid(), time: "", title: "" }] });
  const remove = (id) => update({ items: blk.items.filter((it) => it.id !== id) });
  return (
    <div style={{ padding: "36px 32px" }}>
      <SectionLabel t={t} icon={Clock} text="Программа" />
      {blk.items.map((it, i) => (
        <div key={it.id} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "12px 0",
          borderBottom: i < blk.items.length - 1 ? `1px solid ${t.line}` : "none" }}>
          <div style={{ minWidth: 64 }}>
            <Editable t={t} mode={mode} value={it.time} onChange={(v) => setItem(it.id, { time: v })}
              placeholder="00:00" style={{ fontWeight: 700, color: t.accent, fontSize: 15 }} />
          </div>
          <div style={{ flex: 1 }}>
            <Editable t={t} mode={mode} value={it.title} onChange={(v) => setItem(it.id, { title: v })}
              placeholder="Событие" style={{ fontSize: 15 }} />
          </div>
          {mode === "edit" && <button onClick={() => remove(it.id)} style={iconBtn(t)}><X size={14} /></button>}
        </div>
      ))}
      {mode === "edit" && <button onClick={add} style={{ ...btn(t, false), marginTop: 12 }}><Plus size={14} /> Пункт</button>}
    </div>
  );
}

function WishlistBlock({ t, mode, blk, update }) {
  const setItem = (id, p) => update({ items: blk.items.map((it) => it.id === id ? { ...it, ...p } : it) });
  const add = () => update({ items: [...blk.items, { id: uid(), name: "", url: "", price: 0, photo: "",
    group: false, raised: 0, takenBy: "" }] });
  const remove = (id) => update({ items: blk.items.filter((it) => it.id !== id) });
  const money = (n) => Number(n || 0).toLocaleString("ru-RU") + " ₸";
  return (
    <div style={{ padding: "36px 32px" }}>
      <SectionLabel t={t} icon={Gift} text="Вишлист" />
      <Editable t={t} mode={mode} value={blk.intro} onChange={(v) => update({ intro: v })}
        style={{ display: "block", fontSize: 14, color: t.soft, marginBottom: 14 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {blk.items.map((it) => {
          const taken = !!it.takenBy;
          const pct = it.price > 0 ? Math.min(100, Math.round((it.raised / it.price) * 100)) : 0;
          return (
            <div key={it.id} style={{ background: taken && !it.group ? `${t.line}44` : t.bg,
              border: `1px solid ${t.line}`, borderRadius: 14, padding: 14, display: "flex", gap: 12 }}>
              {/* photo */}
              {it.photo ? (
                <img src={it.photo} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0, background: `${t.accent}18`,
                  display: "grid", placeItems: "center", color: t.accent }}><Gift size={22} /></div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Editable t={t} mode={mode} value={it.name} onChange={(v) => setItem(it.id, { name: v })}
                    placeholder="Название подарка" style={{ flex: 1, fontSize: 15, fontWeight: 600,
                      textDecoration: taken && !it.group ? "line-through" : "none", color: taken && !it.group ? t.soft : t.ink }} />
                  {mode === "edit" && <button onClick={() => remove(it.id)} style={iconBtn(t)}><X size={14} /></button>}
                </div>

                {/* price + link */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                  {mode === "edit" ? (
                    <>
                      <input type="number" value={it.price} onChange={(e) => setItem(it.id, { price: Number(e.target.value) })}
                        placeholder="Цена" style={{ ...field(t), width: 110, padding: "5px 8px", fontSize: 13 }} />
                      <input value={it.url} onChange={(e) => setItem(it.id, { url: e.target.value })}
                        placeholder="Ссылка на товар" style={{ ...field(t), flex: 1, minWidth: 120, padding: "5px 8px", fontSize: 13 }} />
                      <input value={it.photo} onChange={(e) => setItem(it.id, { photo: e.target.value })}
                        placeholder="URL фото" style={{ ...field(t), flex: 1, minWidth: 120, padding: "5px 8px", fontSize: 13 }} />
                    </>
                  ) : (
                    <>
                      {it.price > 0 && <span style={{ fontSize: 14, fontWeight: 600, color: t.accent }}>{money(it.price)}</span>}
                      {it.url && <a href={it.url} target="_blank" rel="noreferrer"
                        style={{ fontSize: 13, color: t.soft, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <LinkIcon size={12} /> где купить</a>}
                    </>
                  )}
                </div>

                {/* group toggle in edit */}
                {mode === "edit" && (
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 13, color: t.soft, cursor: "pointer" }}>
                    <input type="checkbox" checked={it.group} onChange={(e) => setItem(it.id, { group: e.target.checked })} />
                    Групповой подарок (гости скидываются)
                  </label>
                )}

                {/* GROUP gift progress (preview) */}
                {mode === "preview" && it.group && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ height: 8, borderRadius: 5, background: t.line, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: t.accent, transition: "width .3s" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: t.soft, marginTop: 4 }}>
                      <span>Собрано {money(it.raised)} из {money(it.price)}</span><span>{pct}%</span>
                    </div>
                    <GroupContribute t={t} onAdd={(sum) => setItem(it.id, { raised: it.raised + sum })} money={money} />
                  </div>
                )}

                {/* SINGLE gift reserve (preview) */}
                {mode === "preview" && !it.group && (
                  taken ? (
                    <div style={{ marginTop: 6, fontSize: 13, color: t.soft, display: "flex", alignItems: "center", gap: 6 }}>
                      <Check size={14} color={t.accent} /> Забронировал(а): <strong style={{ color: t.ink }}>{it.takenBy}</strong>
                      <button onClick={() => setItem(it.id, { takenBy: "" })}
                        style={{ ...iconBtn(t), width: "auto", padding: "0 6px", fontSize: 12 }}>отменить</button>
                    </div>
                  ) : <ReserveGift t={t} onReserve={(nm) => setItem(it.id, { takenBy: nm })} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {mode === "edit" && <button onClick={add} style={{ ...btn(t, false), marginTop: 12 }}><Plus size={14} /> Подарок</button>}
    </div>
  );
}

function ReserveGift({ t, onReserve }) {
  const [open, setOpen] = useState(false); const [nm, setNm] = useState("");
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ ...btn(t, false), marginTop: 8, padding: "6px 12px", fontSize: 13 }}>
      Забронировать
    </button>
  );
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input autoFocus placeholder="Ваше имя" value={nm} onChange={(e) => setNm(e.target.value)} style={{ ...field(t), padding: "6px 10px", fontSize: 13 }} />
      <button onClick={() => nm.trim() && onReserve(nm.trim())} style={{ ...btn(t, true), padding: "6px 12px", fontSize: 13 }}>OK</button>
    </div>
  );
}

function GroupContribute({ t, onAdd, money }) {
  const [sum, setSum] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input type="number" placeholder="Моя сумма" value={sum} onChange={(e) => setSum(e.target.value)}
        style={{ ...field(t), padding: "6px 10px", fontSize: 13 }} />
      <button onClick={() => { const n = Number(sum); if (n > 0) { onAdd(n); setSum(""); } }}
        style={{ ...btn(t, true), padding: "6px 12px", fontSize: 13, whiteSpace: "nowrap" }}>Внести</button>
    </div>
  );
}

function RsvpBlock({ t, mode, blk, update }) {
  const [name, setName] = useState(""); const [attending, setAttending] = useState("yes");
  const [companions, setCompanions] = useState([]); const [diet, setDiet] = useState("");
  const [note, setNote] = useState(""); const [sent, setSent] = useState(false);
  const submit = () => {
    if (!name.trim()) return;
    const clean = companions.map((c) => c.trim()).filter(Boolean);
    update({ responses: [...blk.responses, { id: uid(), name: name.trim(), attending,
      companions: clean, guests: 1 + clean.length, diet: diet.trim(), note: note.trim() }] });
    setSent(true); setName(""); setCompanions([]); setDiet(""); setNote(""); setAttending("yes");
    setTimeout(() => setSent(false), 3500);
  };
  const deadlineStr = blk.deadline ? new Date(blk.deadline).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) : "";
  const goingCount = blk.responses.filter((r) => r.attending === "yes").reduce((s, r) => s + Number(r.guests || 1), 0);
  return (
    <div style={{ padding: "36px 32px", background: `linear-gradient(200deg, ${t.accent2}18, transparent)` }}>
      <SectionLabel t={t} icon={Users} text="Ответ на приглашение" />
      <Editable t={t} mode={mode} value={blk.prompt} onChange={(v) => update({ prompt: v })}
        style={{ display: "block", fontSize: 17, fontWeight: 600, marginBottom: 6 }} />
      <div style={{ fontSize: 13, color: t.soft, marginBottom: 18, display: "flex", gap: 6, alignItems: "center" }}>
        <Clock size={13} /> Ответьте до{" "}
        {mode === "edit" ? (
          <input type="date" value={blk.deadline} onChange={(e) => update({ deadline: e.target.value })}
            style={{ background: "transparent", border: `1px dashed ${t.line}`, borderRadius: 6, color: "inherit", padding: 2, fontFamily: "inherit" }} />
        ) : deadlineStr}
      </div>
      {mode === "preview" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sent && (
            <div style={{ background: t.accent, color: "#fff", borderRadius: 12, padding: "12px 16px", display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
              <Check size={16} /> Спасибо! Ваш ответ отправлен.
            </div>
          )}
          <input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} style={field(t)} />
          <div style={{ display: "flex", gap: 10 }}>
            {["yes", "no"].map((v) => (
              <button key={v} onClick={() => setAttending(v)}
                style={{ flex: 1, padding: 11, borderRadius: 12, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                  border: `1px solid ${attending === v ? t.accent : t.line}`, background: attending === v ? t.accent : "transparent",
                  color: attending === v ? "#fff" : t.ink }}>
                {v === "yes" ? "Буду 🎉" : "Не смогу"}
              </button>
            ))}
          </div>
          {attending === "yes" && (
            <>
              {/* companions */}
              <div>
                <div style={{ fontSize: 14, color: t.soft, marginBottom: 6 }}>Со мной придут:</div>
                {companions.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <input placeholder={`Имя гостя ${i + 1}`} value={c}
                      onChange={(e) => setCompanions(companions.map((x, j) => j === i ? e.target.value : x))} style={field(t)} />
                    <button onClick={() => setCompanions(companions.filter((_, j) => j !== i))} style={iconBtn(t)}><X size={15} /></button>
                  </div>
                ))}
                <button onClick={() => setCompanions([...companions, ""])} style={{ ...btn(t, false), padding: "6px 12px", fontSize: 13 }}>
                  <Plus size={13} /> Добавить гостя
                </button>
              </div>
              <input placeholder="Ограничения по еде (аллергии, вегетарианство…)" value={diet} onChange={(e) => setDiet(e.target.value)} style={field(t)} />
            </>
          )}
          <textarea placeholder="Пожелания (необязательно)" rows={2} value={note} onChange={(e) => setNote(e.target.value)} style={{ ...field(t), resize: "vertical" }} />
          <button onClick={submit} style={{ ...btn(t, true), justifyContent: "center", padding: 13 }}><Check size={16} /> Отправить ответ</button>
          {blk.responses.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 13, color: t.soft, textAlign: "center" }}>
              Уже подтвердили: <strong style={{ color: t.accent }}>{goingCount}</strong> гостей
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: t.bg, border: `1px dashed ${t.line}`, borderRadius: 12, padding: 16, fontSize: 13, color: t.soft }}>
          Превью формы. Гости указывают имя, «Буду / Не смогу», сопровождающих по именам и ограничения по еде.
          Ответы и фильтры — во вкладке «Ответы». Получено: {blk.responses.length}.
        </div>
      )}
    </div>
  );
}

function SectionLabel({ t, icon: Icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <Icon size={16} color={t.accent} />
      <span style={{ fontSize: 12, letterSpacing: ".16em", textTransform: "uppercase", color: t.soft }}>{text}</span>
    </div>
  );
}

const btn = (t, filled) => ({ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer",
  border: `1px solid ${t.accent}`, borderRadius: 10, padding: "8px 14px", background: filled ? t.accent : "transparent",
  color: filled ? "#fff" : t.accent, fontSize: 14, fontWeight: 600, fontFamily: "inherit" });
const iconBtn = (t, disabled) => ({ display: "grid", placeItems: "center", width: 28, height: 28, borderRadius: 7,
  border: "none", background: "transparent", cursor: disabled ? "default" : "pointer", color: t.soft, opacity: disabled ? 0.35 : 1 });
const field = (t) => ({ background: t.panel, border: `1px solid ${t.line}`, borderRadius: 12, padding: "11px 14px",
  fontSize: 15, color: t.ink, fontFamily: "inherit", width: "100%" });
const gistCheck = (t, on) => ({ width: 22, height: 22, borderRadius: 7, border: `1px solid ${on ? t.accent : t.line}`,
  background: on ? t.accent : "transparent", cursor: "pointer", display: "grid", placeItems: "center" });
const menuItemStyle = (t) => ({
  display: "block", width: "100%", textAlign: "left", padding: "9px 10px", borderRadius: 8,
  border: "none", background: "transparent", color: t.ink, fontSize: 14, fontFamily: "inherit",
  cursor: "pointer",
});
