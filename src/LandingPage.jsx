import React from "react";
import { Link } from "react-router-dom";
import {
  PartyPopper, Heart, Cake, Baby, Home, Briefcase, GlassWater,
  Gift, MapPin, Clock, Users, Sparkles, CalendarHeart, Timer, Type,
  Check, ArrowRight, Share2, Smartphone, Lock, ClipboardList,
} from "lucide-react";

const C = {
  bg: "#faf7f4", ink: "#2a2422", soft: "#7d6c69",
  accent: "#c4736a", accent2: "#e3a89f", line: "#ecdfd9",
  panel: "#ffffff", dark: "#1f1d1c",
};

const EVENT_TILES = [
  { icon: Heart,       label: "Свадьба",         color: "#c4736a" },
  { icon: Cake,        label: "День рождения",    color: "#1f6f86" },
  { icon: PartyPopper, label: "Детский праздник", color: "#e08a2b" },
  { icon: GlassWater,  label: "Юбилей",           color: "#d4af6a" },
  { icon: Baby,        label: "Baby Shower",      color: "#5c7a4f" },
  { icon: Home,        label: "Новоселье",        color: "#3fb98b" },
  { icon: Briefcase,   label: "Корпоратив",       color: "#7a5cc4" },
];

const THEME_PREVIEWS = [
  { name: "Романтика", bg: "#faf3ef", accent: "#c4736a", accent2: "#e3a89f", motif: "❦", font: `Georgia, serif` },
  { name: "Полночь",   bg: "#10131c", accent: "#d4af6a", accent2: "#8b6f3e", motif: "✦", font: `"Didot", Georgia, serif` },
  { name: "Ботаника",  bg: "#f1f4ee", accent: "#5c7a4f", accent2: "#9ab089", motif: "❧", font: `"Cormorant Garamond", serif` },
  { name: "Морская",   bg: "#eef4f6", accent: "#1f6f86", accent2: "#67a6b8", motif: "≈", font: `"Helvetica Neue", sans-serif` },
  { name: "Праздник",  bg: "#fff8ec", accent: "#e08a2b", accent2: "#f2c378", motif: "✺", font: `"Trebuchet MS", sans-serif` },
  { name: "Нуар",      bg: "#161514", accent: "#c9a24b", accent2: "#6e5a2c", motif: "◆", font: `"Times New Roman", serif` },
  { name: "Лаванда",   bg: "#f4f0fa", accent: "#7a5cc4", accent2: "#b8a6e8", motif: "✿", font: `"Cormorant Garamond", serif` },
  { name: "Изумруд",   bg: "#0f1c18", accent: "#3fb98b", accent2: "#2a7d5e", motif: "✣", font: `"Didot", Georgia, serif` },
  { name: "Коралл",    bg: "#fff1ee", accent: "#e85c4a", accent2: "#f7a896", motif: "❀", font: `"Trebuchet MS", sans-serif` },
  { name: "Минимал",   bg: "#f6f6f4", accent: "#1a1a1a", accent2: "#c9c7c2", motif: "—", font: `"Helvetica Neue", sans-serif` },
];

const BLOCKS = [
  { icon: CalendarHeart, label: "Заголовок", desc: "Имена, дата, обложка" },
  { icon: Timer,         label: "Отсчёт",    desc: "Живой таймер до события" },
  { icon: Type,          label: "Текст",     desc: "Произвольное обращение" },
  { icon: MapPin,        label: "Локация",   desc: "Адрес и встроенная карта" },
  { icon: Clock,         label: "Программа", desc: "Расписание дня по пунктам" },
  { icon: Gift,          label: "Вишлист",   desc: "Подарки с бронированием" },
  { icon: Users,         label: "RSVP",      desc: "Сбор подтверждений" },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Nav />
      <Hero />
      <FeaturesStrip />
      <EventTypes />
      <HowItWorks />
      <ThemeGallery />
      <RsvpShowcase />
      <FinalCta />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(250,247,244,.85)",
      backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.line}`, padding: "14px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: C.ink, textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: C.accent, color: "#fff",
          display: "grid", placeItems: "center" }}><PartyPopper size={16} /></div>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Портал приглашений</span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link to="/login" style={{ padding: "8px 14px", color: C.ink, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          Войти
        </Link>
        <Link to="/register" style={{
          padding: "9px 16px", background: C.accent, color: "#fff", textDecoration: "none",
          borderRadius: 10, fontSize: 14, fontWeight: 600,
        }}>Создать приглашение</Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ position: "relative", padding: "80px 24px 60px", textAlign: "center", overflow: "hidden",
      backgroundImage: `radial-gradient(circle at 15% 20%, ${C.accent2}33, transparent 45%), radial-gradient(circle at 85% 80%, ${C.accent2}22, transparent 50%)` }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px",
          background: `${C.accent}15`, color: C.accent, borderRadius: 999, fontSize: 12, fontWeight: 600,
          marginBottom: 22, letterSpacing: ".06em" }}>
          <Sparkles size={12} /> ЖИВАЯ СТРАНИЦА-ПРИГЛАШЕНИЕ
        </div>
        <h1 style={{ fontSize: "clamp(34px, 6vw, 54px)", margin: "0 0 18px", lineHeight: 1.1, fontWeight: 700,
          fontFamily: `Georgia, "Times New Roman", serif` }}>
          Соберите красивое приглашение<br/>
          <span style={{ color: C.accent }}>за 10 минут</span>
        </h1>
        <p style={{ fontSize: 18, color: C.soft, margin: "0 0 32px", lineHeight: 1.55, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          Соберите страницу из блоков, выберите тему, поделитесь ссылкой. Гости подтверждают участие,
          бронируют подарки — а вы видите ответы в одном дашборде.
        </p>
        <div style={{ display: "inline-flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/register" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px",
            background: C.accent, color: "#fff", textDecoration: "none", borderRadius: 12,
            fontWeight: 600, fontSize: 15, boxShadow: `0 12px 28px ${C.accent}44`,
          }}>
            Создать бесплатно <ArrowRight size={16} />
          </Link>
          <button type="button" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 22px",
            background: "transparent", color: C.ink, textDecoration: "none", borderRadius: 12,
            fontWeight: 600, fontSize: 15, border: `1px solid ${C.line}`, cursor: "pointer",
          }}>Посмотреть пример</button>
        </div>
        <div style={{ marginTop: 22, fontSize: 13, color: C.soft, display: "flex",
          gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Check size={13} color={C.accent} /> Без рекламы</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Check size={13} color={C.accent} /> Мобайл-фёрст</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Check size={13} color={C.accent} /> Ответы только вам</span>
        </div>
      </div>

      {/* Floating sample card */}
      <div id="demo" style={{ marginTop: 64, display: "grid", placeItems: "center" }}>
        <SamplePreview />
      </div>
    </section>
  );
}

function SamplePreview() {
  return (
    <div style={{
      width: "min(420px, 92vw)",
      background: "#faf3ef",
      borderRadius: 20,
      boxShadow: "0 30px 70px rgba(0,0,0,.18), 0 6px 16px rgba(0,0,0,.06)",
      border: `1px solid ${C.line}`,
      overflow: "hidden",
      transform: "rotate(-1deg)",
      fontFamily: `Georgia, serif`,
      color: "#3a2b28",
      backgroundImage: `radial-gradient(circle at 15% 20%, #e3a89f22, transparent 40%), radial-gradient(circle at 85% 80%, #e3a89f1c, transparent 45%)`,
    }}>
      <div style={{ padding: "44px 28px 28px", textAlign: "center",
        background: `linear-gradient(160deg, #e3a89f22, transparent)` }}>
        <div style={{ fontSize: 28, color: "#c4736a", marginBottom: 10, lineHeight: 1 }}>❦</div>
        <div style={{ color: "#8a6f68", letterSpacing: ".18em", textTransform: "uppercase", fontSize: 11, marginBottom: 10 }}>
          приглашают вас на свадьбу
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1, marginBottom: 14 }}>Анна &amp; Дмитрий</div>
        <div style={{ display: "inline-block", borderTop: `1px solid #ecdcd5`, borderBottom: `1px solid #ecdcd5`,
          padding: "8px 16px", fontSize: 14, letterSpacing: ".04em" }}>
          15 августа 2026 · 17:00
        </div>
      </div>
      <div style={{ padding: "18px 28px 24px", borderTop: `1px solid #ecdcd5`, fontSize: 13, color: "#8a6f68", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><MapPin size={13} color="#c4736a" /> Площадка «Сад»</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Users size={13} color="#c4736a" /> RSVP</span>
      </div>
    </div>
  );
}

function FeaturesStrip() {
  const items = [
    { icon: Sparkles,      title: "10 готовых тем",       desc: "С собственным шрифтом, мотивом и узором фона" },
    { icon: ClipboardList, title: "Трекинг гостей",       desc: "Кто придёт, аллергии, +1, экспорт в CSV" },
    { icon: Gift,          title: "Вишлист с бронью",     desc: "Подарки по именам или групповой сбор" },
    { icon: Share2,        title: "Одна ссылка",          desc: "Слаг /i/abc123 — отправили и забыли" },
  ];
  return (
    <section style={{ padding: "60px 24px", borderTop: `1px solid ${C.line}`, background: C.panel }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="ВОЗМОЖНОСТИ" title="Всё для приглашения и ответов — в одном месте" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 32 }}>
          {items.map((f) => (
            <div key={f.title} style={{ padding: 22, borderRadius: 14, border: `1px solid ${C.line}`, background: C.bg }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${C.accent}15`,
                color: C.accent, display: "grid", placeItems: "center", marginBottom: 14 }}>
                <f.icon size={18} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{f.title}</div>
              <div style={{ color: C.soft, fontSize: 13.5, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventTypes() {
  return (
    <section style={{ padding: "70px 24px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="ДЛЯ ЛЮБОГО ПОВОДА" title="7 типов событий с готовыми пресетами" subtitle="Выберите тип — портал подставит подходящий набор блоков и тему" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginTop: 32 }}>
          {EVENT_TILES.map((t) => (
            <div key={t.label} style={{ padding: "20px 14px", textAlign: "center", borderRadius: 14,
              border: `1px solid ${C.line}`, background: C.panel }}>
              <t.icon size={26} color={t.color} />
              <div style={{ fontWeight: 600, marginTop: 10, fontSize: 14 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "1", title: "Выберите тип", desc: "Свадьба, день рождения, корпоратив — портал соберёт черновик" },
    { n: "2", title: "Соберите страницу", desc: "Заголовок, локация, программа, вишлист, RSVP — блок за блоком" },
    { n: "3", title: "Выберите тему", desc: "10 визуальных шаблонов с собственным шрифтом и мотивом" },
    { n: "4", title: "Поделитесь ссылкой", desc: "Уникальный slug /i/abc123, гости отвечают за 30 секунд" },
  ];
  return (
    <section style={{ padding: "70px 24px", background: C.panel, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="КАК ЭТО РАБОТАЕТ" title="От идеи до разосланного приглашения — четыре шага" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 32 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ padding: 22, borderRadius: 14, border: `1px solid ${C.line}`, background: C.bg }}>
              <div style={{ display: "inline-grid", placeItems: "center", width: 36, height: 36, borderRadius: "50%",
                background: C.accent, color: "#fff", fontWeight: 700, marginBottom: 14, fontFamily: "Georgia, serif" }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.title}</div>
              <div style={{ color: C.soft, fontSize: 13.5, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThemeGallery() {
  return (
    <section style={{ padding: "70px 24px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="ОФОРМЛЕНИЕ" title="10 готовых тем" subtitle="Каждая со своей палитрой, шрифтом, мотивом и узором фона" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginTop: 32 }}>
          {THEME_PREVIEWS.map((t) => {
            const dark = ["#10131c", "#161514", "#0f1c18"].includes(t.bg);
            return (
              <div key={t.name} style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, background: t.bg }}>
                <div style={{ height: 110, position: "relative", background: t.bg,
                  backgroundImage: `radial-gradient(circle at 20% 30%, ${t.accent2}33, transparent 45%), radial-gradient(circle at 80% 70%, ${t.accent2}22, transparent 50%)` }}>
                  <span style={{ position: "absolute", top: 12, right: 14, fontSize: 22, color: t.accent }}>{t.motif}</span>
                  <div style={{ position: "absolute", bottom: 12, left: 14, fontFamily: t.font,
                    color: dark ? "#fff" : "#1a1a1a", fontSize: 16, fontWeight: 700 }}>Аа</div>
                  <div style={{ position: "absolute", bottom: 12, right: 14, display: "flex", gap: 4 }}>
                    {[t.accent, t.accent2].map((c, i) => (
                      <span key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c, outline: `1px solid #ffffff55` }} />
                    ))}
                  </div>
                </div>
                <div style={{ padding: "9px 12px", background: C.panel, fontSize: 13, fontWeight: 600, fontFamily: t.font }}>{t.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RsvpShowcase() {
  return (
    <section style={{ padding: "70px 24px", background: C.dark, color: "#fff" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 48, alignItems: "center" }}
        className="rsvp-grid">
        <div>
          <div style={{ display: "inline-block", padding: "5px 12px", background: `${C.accent}25`,
            color: C.accent2, borderRadius: 999, fontSize: 12, fontWeight: 600,
            marginBottom: 16, letterSpacing: ".06em" }}>RSVP-ДАШБОРД</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", margin: "0 0 16px", lineHeight: 1.15,
            fontFamily: "Georgia, serif", color: "#fff" }}>
            Все ответы — в одном месте
          </h2>
          <p style={{ color: "#b6b1a8", fontSize: 16, lineHeight: 1.6, marginBottom: 22 }}>
            Гости заполняют форму со смартфона. Вы видите кто придёт, кто +1, кто аллергик —
            фильтры, поиск, экспорт в CSV для Excel.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Буду / Не смогу — одной кнопкой"],
              ["Сопровождающие по именам (+1, +2…)"],
              ["Поле для аллергий и пожеланий"],
              ["Дедлайн ответа и счётчики в реальном времени"],
              ["Экспорт всех ответов в CSV"],
            ].map(([t]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.accent,
                  display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Check size={12} color="#fff" />
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#2a2624", borderRadius: 18, padding: 22, border: "1px solid #3a3431" }}>
          <div style={{ fontSize: 12, color: "#8a857f", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Ответы гостей</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {[["12", "придут"], ["18", "гостей всего"], ["3", "не смогут"]].map(([n, l]) => (
              <div key={l} style={{ flex: 1, background: "#1f1d1c", borderRadius: 12, padding: "14px 10px", textAlign: "center", border: "1px solid #3a3431" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.accent2 }}>{n}</div>
                <div style={{ fontSize: 11, color: "#8a857f", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "#1f1d1c", borderRadius: 12, overflow: "hidden", border: "1px solid #3a3431" }}>
            {[
              { name: "Михаил Петров", diet: "Без глютена", g: 2, ok: true },
              { name: "Елена Соколова", g: 1, ok: true },
              { name: "Игорь Кузнецов", g: 0, ok: false },
            ].map((r, i) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px",
                borderTop: i ? "1px solid #3a3431" : "none", fontSize: 13.5 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%",
                  background: r.ok ? `${C.accent}33` : "#3a3431", color: r.ok ? C.accent2 : "#8a857f",
                  display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {r.ok ? <Check size={12} /> : "✕"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontWeight: 600 }}>{r.name}</div>
                  {r.diet && <div style={{ fontSize: 11.5, color: C.accent2 }}>🍽 {r.diet}</div>}
                </div>
                {r.ok && <span style={{ color: "#8a857f", fontSize: 12 }}>{r.g} 👤</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section style={{ padding: "80px 24px", textAlign: "center",
      backgroundImage: `radial-gradient(circle at 50% 0%, ${C.accent2}33, transparent 55%)` }}>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ fontSize: 36, color: C.accent, marginBottom: 16, fontFamily: "Georgia, serif" }}>❦</div>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 38px)", margin: "0 0 14px", fontFamily: "Georgia, serif", lineHeight: 1.15 }}>
          Готовы собрать своё приглашение?
        </h2>
        <p style={{ color: C.soft, fontSize: 16, marginBottom: 28, lineHeight: 1.55 }}>
          Регистрация бесплатна. Первое приглашение можно опубликовать прямо сейчас.
        </p>
        <Link to="/register" style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 26px",
          background: C.accent, color: "#fff", textDecoration: "none", borderRadius: 12,
          fontWeight: 600, fontSize: 15, boxShadow: `0 12px 28px ${C.accent}44`,
        }}>
          Начать бесплатно <ArrowRight size={16} />
        </Link>
        <div style={{ marginTop: 14, fontSize: 13, color: C.soft }}>
          Уже есть аккаунт? <Link to="/login" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Войти</Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "28px 24px", borderTop: `1px solid ${C.line}`, background: C.panel,
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      fontSize: 13, color: C.soft }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <PartyPopper size={14} color={C.accent} /> Портал приглашений · {new Date().getFullYear()}
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Smartphone size={13} /> Мобайл-фёрст</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Lock size={13} /> Ответы только хосту</span>
      </div>
    </footer>
  );
}

function SectionHead({ eyebrow, title, subtitle }) {
  return (
    <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      {eyebrow && <div style={{ display: "inline-block", padding: "4px 12px", background: `${C.accent}15`,
        color: C.accent, borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", marginBottom: 12 }}>{eyebrow}</div>}
      <h2 style={{ fontSize: "clamp(26px, 4vw, 34px)", margin: "0 0 10px", lineHeight: 1.2,
        fontFamily: "Georgia, serif" }}>{title}</h2>
      {subtitle && <p style={{ color: C.soft, margin: 0, fontSize: 16, lineHeight: 1.55 }}>{subtitle}</p>}
    </div>
  );
}
