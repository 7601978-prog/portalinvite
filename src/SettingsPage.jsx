import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User as UserIcon, Lock, Trash2, Check } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { updateProfile, changePassword, deleteSelf } from "./auth.js";

export default function SettingsPage() {
  const { user, refresh, logout } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState(user.name || "");
  const [savedName, setSavedName] = useState(false);

  const [cur, setCur] = useState("");
  const [nxt, setNxt] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [pwOk, setPwOk] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  const [delPw, setDelPw] = useState("");
  const [delErr, setDelErr] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);

  const saveName = (e) => {
    e.preventDefault();
    updateProfile(user.email, { name });
    refresh();
    setSavedName(true);
    setTimeout(() => setSavedName(false), 1800);
  };

  const submitPw = async (e) => {
    e.preventDefault();
    setPwErr(""); setPwOk(false); setPwBusy(true);
    try {
      await changePassword(user.email, cur, nxt);
      setPwOk(true); setCur(""); setNxt("");
      setTimeout(() => setPwOk(false), 1800);
    } catch (x) { setPwErr(x.message); }
    finally { setPwBusy(false); }
  };

  const doDelete = async (e) => {
    e.preventDefault();
    setDelErr(""); setDelBusy(true);
    try {
      await deleteSelf(user.email, delPw);
      logout();
      nav("/register", { replace: true });
    } catch (x) { setDelErr(x.message); }
    finally { setDelBusy(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#faf7f4", color: "#2a2422",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #ecdfd9", padding: "14px 24px",
        display: "flex", alignItems: "center", gap: 12 }}>
        <Link to="/" style={{ display: "grid", placeItems: "center", width: 32, height: 32, borderRadius: 8,
          background: "#f0e8e4", color: "#5a4540", textDecoration: "none" }}><ArrowLeft size={16} /></Link>
        <div>
          <div style={{ fontWeight: 700 }}>Настройки</div>
          <div style={{ fontSize: 12, color: "#8a7e7a" }}>{user.email}</div>
        </div>
      </header>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Profile */}
        <Card title="Профиль" icon={UserIcon}>
          <form onSubmit={saveName}>
            <Label>Email</Label>
            <input value={user.email} disabled style={{ ...field, color: "#8a7e7a", background: "#f6f2ef" }} />
            <Label>Имя</Label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={field} />
            <button type="submit" style={primaryBtn}>
              {savedName ? <><Check size={15} /> Сохранено</> : "Сохранить имя"}
            </button>
          </form>
        </Card>

        {/* Password */}
        <Card title="Пароль" icon={Lock}>
          <form onSubmit={submitPw}>
            <Label>Текущий пароль</Label>
            <input type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} style={field} required />
            <Label>Новый пароль (от 6 символов)</Label>
            <input type="password" autoComplete="new-password" value={nxt} onChange={(e) => setNxt(e.target.value)} style={field} required minLength={6} />
            {pwErr && <div style={errMsg}>{pwErr}</div>}
            <button type="submit" disabled={pwBusy} style={{ ...primaryBtn, opacity: pwBusy ? 0.6 : 1 }}>
              {pwOk ? <><Check size={15} /> Пароль изменён</> : pwBusy ? "Меняем…" : "Сменить пароль"}
            </button>
          </form>
        </Card>

        {/* Danger */}
        <Card title="Опасная зона" icon={Trash2} danger>
          {!delConfirm ? (
            <>
              <p style={{ fontSize: 14, color: "#7d6c69", marginTop: 0 }}>
                Удаление учётной записи необратимо. Все ваши приглашения и ответы гостей будут отвязаны и недоступны.
              </p>
              <button onClick={() => setDelConfirm(true)} style={dangerBtn}>
                <Trash2 size={15} /> Удалить аккаунт
              </button>
            </>
          ) : (
            <form onSubmit={doDelete}>
              <Label>Введите пароль, чтобы подтвердить</Label>
              <input type="password" autoComplete="current-password" value={delPw} onChange={(e) => setDelPw(e.target.value)} style={field} required />
              {delErr && <div style={errMsg}>{delErr}</div>}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <button type="button" onClick={() => { setDelConfirm(false); setDelPw(""); setDelErr(""); }}
                  style={{ ...primaryBtn, background: "transparent", color: "#5a4540", border: "1px solid #ecdfd9", flex: 1 }}>
                  Отмена
                </button>
                <button type="submit" disabled={delBusy} style={{ ...dangerBtn, flex: 1, opacity: delBusy ? 0.6 : 1 }}>
                  {delBusy ? "Удаляем…" : "Подтвердить удаление"}
                </button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, danger, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${danger ? "#f3d6d2" : "#ecdfd9"}`, borderRadius: 16,
      padding: 22, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, color: danger ? "#c0392b" : "#1a1a1a" }}>
        <Icon size={18} />
        <h2 style={{ margin: 0, fontSize: 16 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

const Label = ({ children }) => <div style={{ fontSize: 12, color: "#8a7e7a", marginTop: 10, marginBottom: 6,
  textTransform: "uppercase", letterSpacing: ".06em" }}>{children}</div>;

const field = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #ecdfd9",
  background: "#fff", fontSize: 15, color: "#2a2422", fontFamily: "inherit", outline: "none",
};
const primaryBtn = {
  marginTop: 14, padding: "11px 18px", borderRadius: 10, border: "none", cursor: "pointer",
  background: "#c4736a", color: "#fff", fontWeight: 600, fontSize: 14, fontFamily: "inherit",
  display: "inline-flex", alignItems: "center", gap: 8,
};
const dangerBtn = {
  padding: "11px 18px", borderRadius: 10, border: "none", cursor: "pointer",
  background: "#c0392b", color: "#fff", fontWeight: 600, fontSize: 14, fontFamily: "inherit",
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
};
const errMsg = { color: "#c0392b", fontSize: 13, marginTop: 8 };
