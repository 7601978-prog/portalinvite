import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, useParams, Navigate, useLocation, Link } from "react-router-dom";
import InvitationPortal from "./InvitationPortal.jsx";
import HomePage from "./HomePage.jsx";
import AdminPage from "./AdminPage.jsx";
import SettingsPage from "./SettingsPage.jsx";
import LandingPage from "./LandingPage.jsx";
import { LoginPage, RegisterPage } from "./AuthPages.jsx";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { loadInvitation, genSlug } from "./storage.js";

function NewInvitation() {
  const [slug] = useState(() => genSlug());
  return <Navigate to={`/edit/${slug}`} replace />;
}

function EditInvitation() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [initial, setInitial] = useState(undefined);
  useEffect(() => { setInitial(loadInvitation(slug)); }, [slug]);
  if (initial === undefined) return null;
  if (initial && initial.hostEmail && initial.hostEmail !== user.email && user.role !== "admin") {
    return <Forbidden />;
  }
  return <InvitationPortal slug={slug} initial={initial || undefined} />;
}

function GuestInvitation() {
  const { slug } = useParams();
  const [initial, setInitial] = useState(undefined);
  useEffect(() => { setInitial(loadInvitation(slug)); }, [slug]);
  if (initial === undefined) return null;
  if (!initial) return <NotFound slug={slug} />;
  return <InvitationPortal slug={slug} initial={initial} guestMode />;
}

function Forbidden() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#faf3ef", color: "#3a2b28", fontFamily: "Georgia, serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✦</div>
        <h1 style={{ margin: "0 0 6px" }}>Нет доступа</h1>
        <p style={{ color: "#8a6f68" }}>Это приглашение принадлежит другому пользователю.</p>
        <Link to="/" style={{ color: "#c4736a", fontWeight: 600 }}>На главную</Link>
      </div>
    </div>
  );
}

function NotFound({ slug }) {
  return (
    <div style={{ minHeight: "100vh", background: "#faf3ef", display: "grid", placeItems: "center", padding: 24, fontFamily: "Georgia, serif" }}>
      <div style={{ textAlign: "center", color: "#3a2b28" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>❦</div>
        <h1 style={{ margin: "0 0 6px" }}>Приглашение не найдено</h1>
        <p style={{ color: "#8a6f68" }}>Ссылка <code>/i/{slug}</code> недействительна или приглашение удалено.</p>
        <Link to="/" style={{ color: "#c4736a", fontWeight: 600 }}>На главную</Link>
      </div>
    </div>
  );
}

function RootEntry() {
  const { user } = useAuth();
  return user ? <HomePage /> : <LandingPage />;
}

function RequireAuth({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
          <Route path="/" element={<RootEntry />} />
          <Route path="/new" element={<RequireAuth><NewInvitation /></RequireAuth>} />
          <Route path="/edit/:slug" element={<RequireAuth><EditInvitation /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth adminOnly><AdminPage /></RequireAuth>} />
          <Route path="/i/:slug" element={<GuestInvitation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
