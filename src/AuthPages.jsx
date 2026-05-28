import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User as UserIcon, PartyPopper, ArrowRight } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";

const PALETTE = {
  bg: "#faf3ef", panel: "#fffaf7", ink: "#3a2b28", soft: "#8a6f68",
  accent: "#c4736a", line: "#ecdcd5",
};

function Shell({ title, subtitle, children }) {
  return (
    <div style={{ minHeight: "100vh", background: PALETTE.bg, color: PALETTE.ink, display: "grid", placeItems: "center",
      padding: 20, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundImage: `radial-gradient(circle at 15% 20%, #e3a89f33, transparent 40%), radial-gradient(circle at 85% 80%, #e3a89f22, transparent 45%)` }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: PALETTE.accent, margin: "0 auto 14px",
            display: "grid", placeItems: "center", color: "#fff" }}>
            <PartyPopper size={28} />
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 26, fontFamily: "Georgia, serif" }}>{title}</h1>
          <p style={{ color: PALETTE.soft, margin: 0, fontSize: 14 }}>{subtitle}</p>
        </div>
        <div style={{ background: PALETTE.panel, border: `1px solid ${PALETTE.line}`, borderRadius: 18,
          padding: 24, boxShadow: "0 18px 50px rgba(0,0,0,.08)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const fieldStyle = {
  width: "100%", padding: "12px 14px 12px 40px", borderRadius: 12,
  border: `1px solid ${PALETTE.line}`, background: "#fff", fontSize: 15,
  color: PALETTE.ink, fontFamily: "inherit", outline: "none",
};

function Field({ icon: Icon, ...props }) {
  return (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <Icon size={16} color={PALETTE.soft} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
      <input {...props} style={fieldStyle} />
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  };

  return (
    <Shell title="Вход в портал" subtitle="Личный кабинет хоста">
      <form onSubmit={submit}>
        <Field icon={Mail} type="email" placeholder="Email" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field icon={Lock} type="password" placeholder="Пароль" autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{
          width: "100%", padding: 13, borderRadius: 12, border: "none", cursor: "pointer",
          background: PALETTE.accent, color: "#fff", fontWeight: 600, fontSize: 15,
          fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: busy ? 0.6 : 1,
        }}>
          {busy ? "Входим…" : <>Войти <ArrowRight size={16} /></>}
        </button>
      </form>
      <div style={{ marginTop: 18, textAlign: "center", fontSize: 14, color: PALETTE.soft }}>
        Нет аккаунта? <Link to="/register" style={{ color: PALETTE.accent, fontWeight: 600, textDecoration: "none" }}>Регистрация</Link>
      </div>
    </Shell>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      await register(email, password, name);
      nav("/", { replace: true });
    } catch (x) { setErr(x.message); }
    finally { setBusy(false); }
  };

  return (
    <Shell title="Создать аккаунт" subtitle="Чтобы хранить приглашения и собирать ответы">
      <form onSubmit={submit}>
        <Field icon={UserIcon} type="text" placeholder="Как к вам обращаться"
          value={name} onChange={(e) => setName(e.target.value)} />
        <Field icon={Mail} type="email" placeholder="Email" autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field icon={Lock} type="password" placeholder="Пароль (от 6 символов)" autoComplete="new-password"
          value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        {err && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{
          width: "100%", padding: 13, borderRadius: 12, border: "none", cursor: "pointer",
          background: PALETTE.accent, color: "#fff", fontWeight: 600, fontSize: 15,
          fontFamily: "inherit", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
          opacity: busy ? 0.6 : 1,
        }}>
          {busy ? "Создаём…" : <>Зарегистрироваться <ArrowRight size={16} /></>}
        </button>
      </form>
      <div style={{ marginTop: 18, textAlign: "center", fontSize: 14, color: PALETTE.soft }}>
        Уже есть аккаунт? <Link to="/login" style={{ color: PALETTE.accent, fontWeight: 600, textDecoration: "none" }}>Войти</Link>
      </div>
      <div style={{ marginTop: 14, fontSize: 12, color: PALETTE.soft, textAlign: "center", lineHeight: 1.5 }}>
        Первый зарегистрированный пользователь автоматически становится администратором портала.
      </div>
    </Shell>
  );
}
