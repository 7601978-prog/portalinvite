import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PartyPopper, Heart, Cake, Baby, Home, Briefcase, GlassWater,
  Gift, MapPin, Clock, Users, Sparkles, CalendarHeart, Timer, Type,
  Check, ArrowRight, Share2, Smartphone, Lock, ClipboardList, Star,
} from "lucide-react";

const C = {
  bg: "#faf7f4", ink: "#2a2422", soft: "#7d6c69",
  accent: "#c4736a", accent2: "#e3a89f", line: "#ecdfd9",
  panel: "#ffffff", dark: "#1f1d1c",
};

// Gradient ink for accent words / headings.
const GRAD = "linear-gradient(120deg, #c4736a 0%, #e0902b 100%)";
const gradText = {
  backgroundImage: GRAD, WebkitBackgroundClip: "text",
  backgroundClip: "text", color: "transparent",
};

const EVENT_TILES = [
  { icon: Heart,       label: "Свадьба",         color: "#c4736a" },
  { icon: Cake,        label: "День рождения",    color: "#1f6f86" },
  { icon: PartyPopper, label: "Детский праздник", color: "#e08a2b" },
  { icon: GlassWater,  label: "Юбилей",           color: "#d4af6a" },
  { icon: Baby,        label: "Гендер-пати",      color: "#7a5cc4" },
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

// Reveal-on-scroll: any element with className "reveal" fades up when seen.
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  useReveal();
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <Nav />
      <Hero />
      <LogoStrip />
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
    <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(250,247,244,.8)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: `1px solid ${C.line}`,
      padding: "13px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: C.ink, textDecoration: "none" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, backgroundImage: GRAD, color: "#fff",
          display: "grid", placeItems: "center", boxShadow: `0 6px 16px ${C.accent}40` }}><PartyPopper size={16} /></div>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.01em" }}>Портал приглашений</span>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Link to="/login" style={{ padding: "8px 14px", color: C.ink, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          Войти
        </Link>
        <Link to="/register" className="btn-shine" style={{
          padding: "9px 16px", backgroundImage: GRAD, color: "#fff", textDecoration: "none",
          borderRadius: 10, fontSize: 14, fontWeight: 600, boxShadow: `0 8px 20px ${C.accent}3a`,
        }}>Создать приглашение</Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ position: "relative", padding: "84px 24px 70px", textAlign: "center", overflow: "hidden" }}>
      {/* Animated gradient mesh */}
      <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Blob size={560} top={-200} left={-140} color="#e3a89f" dur="15s" />
        <Blob size={480} top={-120} right={-150} color="#f2c378" dur="19s" reverse />
        <Blob size={420} top={260} left="42%" color="#c4736a" dur="22s" opacity={0.35} />
      </div>

      <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
        <div className="reveal in" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
          background: "rgba(255,255,255,.7)", backdropFilter: "blur(6px)", color: C.accent, borderRadius: 999,
          fontSize: 12, fontWeight: 700, marginBottom: 24, letterSpacing: ".06em", border: `1px solid ${C.line}`,
          boxShadow: "0 4px 14px rgba(40,30,28,.06)" }}>
          <Sparkles size={12} /> ЖИВАЯ СТРАНИЦА-ПРИГЛАШЕНИЕ
        </div>
        <h1 style={{ fontSize: "clamp(36px, 6.4vw, 60px)", margin: "0 0 18px", lineHeight: 1.06, fontWeight: 700,
          letterSpacing: "-.02em", fontFamily: `Georgia, "Times New Roman", serif` }}>
          Соберите красивое приглашение<br/>
          <span style={gradText}>за 10 минут</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2.4vw, 19px)", color: C.soft, margin: "0 0 32px", lineHeight: 1.55,
          maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
          Соберите страницу из блоков, выберите тему, поделитесь ссылкой. Гости подтверждают участие,
          бронируют подарки — а вы видите ответы в одном дашборде.
        </p>
        <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/register" className="btn-shine" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 26px",
            backgroundImage: GRAD, color: "#fff", textDecoration: "none", borderRadius: 13,
            fontWeight: 700, fontSize: 15.5, boxShadow: `0 16px 34px ${C.accent}4d`,
          }}>
            Создать бесплатно <ArrowRight size={16} />
          </Link>
          <button type="button" onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
            className="lift" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "15px 24px",
            background: "rgba(255,255,255,.7)", color: C.ink, textDecoration: "none", borderRadius: 13,
            fontWeight: 600, fontSize: 15.5, border: `1px solid ${C.line}`, cursor: "pointer",
          }}>Посмотреть пример</button>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 26, display: "flex", gap: 10, justifyContent: "center",
          alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex" }}>
            {EVENT_TILES.slice(0, 5).map((t, i) => (
              <span key={t.label} style={{ width: 30, height: 30, borderRadius: "50%", background: t.color,
                color: "#fff", display: "grid", placeItems: "center", marginLeft: i ? -9 : 0,
                border: "2px solid #faf7f4", boxShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
                <t.icon size={14} />
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: C.soft }}>
            <span style={{ display: "inline-flex", gap: 1 }}>
              {[0,1,2,3,4].map((i) => <Star key={i} size={13} fill="#e0902b" color="#e0902b" />)}
            </span>
            Готовые пресеты для&nbsp;7&nbsp;типов событий
          </div>
        </div>
      </div>

      {/* Floating product mockup */}
      <div id="demo" style={{ position: "relative", marginTop: 64, display: "grid", placeItems: "center" }}>
        <div style={{ position: "relative", width: "min(420px, 92vw)" }}>
          <SamplePreview />
          {/* Floating UI chips */}
          <ChipCard className="float-chip" style={{ top: -22, left: -118, animationDelay: "0s" }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#3fb98b22",
              color: "#2a9d6e", display: "grid", placeItems: "center" }}><Check size={14} /></span>
            <div><b style={{ fontSize: 14 }}>12 придут</b><div style={{ fontSize: 11, color: C.soft }}>+ 6 со спутниками</div></div>
          </ChipCard>
          <ChipCard className="float-chip" style={{ bottom: 40, right: -126, animationDelay: "1.2s" }}>
            <span style={{ width: 26, height: 26, borderRadius: 7, background: `${C.accent}1f`,
              color: C.accent, display: "grid", placeItems: "center" }}><Share2 size={13} /></span>
            <div><b style={{ fontSize: 13 }}>Ссылка скопирована</b><div style={{ fontSize: 11, color: C.soft }}>/i/abc123</div></div>
          </ChipCard>
          <ChipCard className="float-chip" style={{ top: 92, right: -96, animationDelay: "2.1s", padding: "8px 12px" }}>
            <span style={{ display: "flex", gap: 4 }}>
              {["#c4736a", "#e3a89f", "#d4af6a"].map((c) => (
                <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
              ))}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>10 тем</span>
          </ChipCard>
        </div>
      </div>
    </section>
  );
}

function Blob({ size, top, left, right, color, dur, reverse, opacity = 0.55 }) {
  return (
    <div data-mesh style={{
      position: "absolute", width: size, height: size, borderRadius: "50%", top, left, right,
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`, opacity,
      filter: "blur(26px)", animation: `meshDrift ${dur} ease-in-out infinite ${reverse ? "reverse" : ""}`,
    }} />
  );
}

function ChipCard({ children, style, className }) {
  return (
    <div className={className} style={{
      position: "absolute", display: "flex", alignItems: "center", gap: 9, padding: "10px 13px",
      background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)", borderRadius: 13,
      border: `1px solid ${C.line}`, boxShadow: "0 16px 36px rgba(40,30,28,.16)", zIndex: 3,
      whiteSpace: "nowrap", ...style,
    }}>{children}</div>
  );
}

function SamplePreview() {
  return (
    <div style={{
      width: "100%",
      background: "#faf3ef",
      borderRadius: 22,
      boxShadow: "0 40px 90px rgba(40,30,28,.22), 0 8px 20px rgba(40,30,28,.08)",
      border: `1px solid ${C.line}`,
      overflow: "hidden",
      transform: "rotate(-1.2deg)",
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

function LogoStrip() {
  const tags = ["Свадьба", "День рождения", "Корпоратив", "Юбилей", "Гендер-пати", "Новоселье"];
  return (
    <div style={{ borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, background: C.panel,
      padding: "16px 24px" }}>
      <div className="reveal" style={{ maxWidth: 1040, margin: "0 auto", display: "flex", gap: 10,
        flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
        <span style={{ fontSize: 12.5, color: C.soft, fontWeight: 600, letterSpacing: ".04em" }}>Подходит для</span>
        {tags.map((t) => (
          <span key={t} style={{ fontSize: 13, fontWeight: 600, color: C.ink, padding: "5px 12px",
            background: C.bg, border: `1px solid ${C.line}`, borderRadius: 999 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function FeaturesStrip() {
  const items = [
    { icon: Sparkles,      title: "10 готовых тем",       desc: "С собственным шрифтом, мотивом и узором фона" },
    { icon: ClipboardList, title: "Трекинг гостей",       desc: "Кто придёт, аллергии, +1, экспорт в CSV" },
    { icon: Gift,          title: "Вишлист с бронью",     desc: "Подарки по именам или групповой сбор" },
    { icon: Share2,        title: "Одна ссылка",          desc: "Slug /i/abc123 — отправили и забыли" },
  ];
  return (
    <section style={{ padding: "72px 24px", background: C.bg }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="ВОЗМОЖНОСТИ" title="Всё для приглашения и ответов — в одном месте" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 36 }}>
          {items.map((f, i) => (
            <div key={f.title} className="reveal lift" style={{ padding: 24, borderRadius: 16,
              border: `1px solid ${C.line}`, background: C.panel, animationDelay: `${i * 70}ms` }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, backgroundImage: GRAD,
                color: "#fff", display: "grid", placeItems: "center", marginBottom: 16,
                boxShadow: `0 8px 18px ${C.accent}33` }}>
                <f.icon size={19} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 16.5, marginBottom: 5 }}>{f.title}</div>
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
    <section style={{ padding: "72px 24px", background: C.panel, borderTop: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="ДЛЯ ЛЮБОГО ПОВОДА" title="7 типов событий с готовыми пресетами" subtitle="Выберите тип — портал подставит подходящий набор блоков и тему" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14, marginTop: 36 }}>
          {EVENT_TILES.map((t, i) => (
            <div key={t.label} className="reveal tile-pop" style={{ padding: "24px 14px", textAlign: "center",
              borderRadius: 16, border: `1px solid ${C.line}`, background: C.bg, cursor: "default",
              animationDelay: `${i * 55}ms` }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, margin: "0 auto 12px",
                display: "grid", placeItems: "center", background: `${t.color}15`, color: t.color }}>
                <t.icon size={24} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.label}</div>
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
    <section style={{ padding: "72px 24px", background: C.bg, borderTop: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="КАК ЭТО РАБОТАЕТ" title="От идеи до разосланного приглашения — четыре шага" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 36 }}>
          {steps.map((s, i) => (
            <div key={s.n} className="reveal lift" style={{ position: "relative", padding: 24, borderRadius: 16,
              border: `1px solid ${C.line}`, background: C.panel, animationDelay: `${i * 70}ms` }}>
              <div style={{ display: "inline-grid", placeItems: "center", width: 40, height: 40, borderRadius: "50%",
                backgroundImage: GRAD, color: "#fff", fontWeight: 700, marginBottom: 16, fontSize: 17,
                fontFamily: "Georgia, serif", boxShadow: `0 8px 18px ${C.accent}33` }}>{s.n}</div>
              <div style={{ fontWeight: 700, fontSize: 16.5, marginBottom: 5 }}>{s.title}</div>
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
    <section style={{ padding: "72px 24px", background: C.panel, borderTop: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <SectionHead eyebrow="ОФОРМЛЕНИЕ" title="10 готовых тем" subtitle="Каждая со своей палитрой, шрифтом, мотивом и узором фона" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginTop: 36 }}>
          {THEME_PREVIEWS.map((t, i) => {
            const dark = ["#10131c", "#161514", "#0f1c18"].includes(t.bg);
            return (
              <div key={t.name} className="reveal tile-pop" style={{ borderRadius: 16, overflow: "hidden",
                border: `1px solid ${C.line}`, background: t.bg, animationDelay: `${i * 45}ms` }}>
                <div style={{ height: 118, position: "relative", background: t.bg,
                  backgroundImage: `radial-gradient(circle at 20% 30%, ${t.accent2}44, transparent 45%), radial-gradient(circle at 80% 70%, ${t.accent2}2a, transparent 50%)` }}>
                  <span style={{ position: "absolute", top: 12, right: 14, fontSize: 22, color: t.accent }}>{t.motif}</span>
                  <div style={{ position: "absolute", bottom: 12, left: 14, fontFamily: t.font,
                    color: dark ? "#fff" : "#1a1a1a", fontSize: 17, fontWeight: 700 }}>Аа</div>
                  <div style={{ position: "absolute", bottom: 12, right: 14, display: "flex", gap: 4 }}>
                    {[t.accent, t.accent2].map((c, j) => (
                      <span key={j} style={{ width: 12, height: 12, borderRadius: "50%", background: c, outline: `1px solid #ffffff55` }} />
                    ))}
                  </div>
                </div>
                <div style={{ padding: "10px 13px", background: C.panel, fontSize: 13, fontWeight: 600, fontFamily: t.font }}>{t.name}</div>
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
    <section style={{ padding: "84px 24px", background: C.dark, color: "#fff", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 18% 20%, ${C.accent}2e, transparent 42%), radial-gradient(circle at 88% 78%, #e0902b22, transparent 46%)` }} />
      <div style={{ position: "relative", maxWidth: 1040, margin: "0 auto", display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 48, alignItems: "center" }}
        className="rsvp-grid">
        <div className="reveal">
          <div style={{ display: "inline-block", padding: "5px 12px", background: `${C.accent}25`,
            color: C.accent2, borderRadius: 999, fontSize: 12, fontWeight: 700,
            marginBottom: 16, letterSpacing: ".06em" }}>RSVP-ДАШБОРД</div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", margin: "0 0 16px", lineHeight: 1.12,
            letterSpacing: "-.01em", fontFamily: "Georgia, serif", color: "#fff" }}>
            Все ответы — в одном месте
          </h2>
          <p style={{ color: "#b6b1a8", fontSize: 16, lineHeight: 1.6, marginBottom: 22 }}>
            Гости заполняют форму со смартфона. Вы видите кто придёт, кто +1, кто аллергик —
            фильтры, поиск, экспорт в CSV для Excel.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              "Буду / Не смогу — одной кнопкой",
              "Сопровождающие по именам (+1, +2…)",
              "Поле для аллергий и пожеланий",
              "Дедлайн ответа и счётчики в реальном времени",
              "Экспорт всех ответов в CSV",
            ].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14.5 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", backgroundImage: GRAD,
                  display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Check size={12} color="#fff" />
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal" style={{ background: "#2a2624", borderRadius: 20, padding: 22,
          border: "1px solid #3a3431", boxShadow: "0 30px 70px rgba(0,0,0,.4)", animationDelay: "120ms" }}>
          <div style={{ fontSize: 12, color: "#8a857f", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 14 }}>Ответы гостей</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {[["12", "придут"], ["18", "гостей всего"], ["3", "не смогут"]].map(([n, l]) => (
              <div key={l} style={{ flex: 1, background: "#1f1d1c", borderRadius: 12, padding: "14px 10px", textAlign: "center", border: "1px solid #3a3431" }}>
                <div style={{ fontSize: 26, fontWeight: 700, ...gradText }}>{n}</div>
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
    <section style={{ padding: "88px 24px", textAlign: "center", position: "relative", overflow: "hidden",
      backgroundImage: `radial-gradient(circle at 50% 0%, ${C.accent2}40, transparent 55%)` }}>
      <div className="reveal" style={{ position: "relative", maxWidth: 620, margin: "0 auto" }}>
        <div style={{ fontSize: 40, marginBottom: 16, fontFamily: "Georgia, serif", ...gradText }}>❦</div>
        <h2 style={{ fontSize: "clamp(28px, 4.4vw, 42px)", margin: "0 0 14px", fontFamily: "Georgia, serif",
          lineHeight: 1.12, letterSpacing: "-.01em" }}>
          Готовы собрать своё приглашение?
        </h2>
        <p style={{ color: C.soft, fontSize: 16.5, marginBottom: 30, lineHeight: 1.55 }}>
          Регистрация бесплатна. Первое приглашение можно опубликовать прямо сейчас.
        </p>
        <Link to="/register" className="btn-shine" style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 30px",
          backgroundImage: GRAD, color: "#fff", textDecoration: "none", borderRadius: 13,
          fontWeight: 700, fontSize: 16, boxShadow: `0 16px 34px ${C.accent}4d`,
        }}>
          Начать бесплатно <ArrowRight size={16} />
        </Link>
        <div style={{ marginTop: 16, fontSize: 13.5, color: C.soft }}>
          Уже есть аккаунт? <Link to="/login" style={{ color: C.accent, fontWeight: 600, textDecoration: "none" }}>Войти</Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "30px 24px", borderTop: `1px solid ${C.line}`, background: C.panel,
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
    <div className="reveal" style={{ textAlign: "center", maxWidth: 660, margin: "0 auto" }}>
      {eyebrow && <div style={{ display: "inline-block", padding: "5px 13px", background: `${C.accent}14`,
        color: C.accent, borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".1em", marginBottom: 14 }}>{eyebrow}</div>}
      <h2 style={{ fontSize: "clamp(27px, 4vw, 36px)", margin: "0 0 10px", lineHeight: 1.18,
        letterSpacing: "-.01em", fontFamily: "Georgia, serif" }}>{title}</h2>
      {subtitle && <p style={{ color: C.soft, margin: 0, fontSize: 16.5, lineHeight: 1.55 }}>{subtitle}</p>}
    </div>
  );
}
