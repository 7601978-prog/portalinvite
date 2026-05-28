import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { currentUser, login as doLogin, logout as doLogout, register as doRegister } from "./auth.js";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => currentUser());

  const refresh = useCallback(() => setUser(currentUser()), []);

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "invite.session.v1" || e.key === "invite.users.v1") refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const value = {
    user,
    isAdmin: user?.role === "admin",
    async login(email, password) { await doLogin({ email, password }); refresh(); },
    async register(email, password, name) { await doRegister({ email, password, name }); refresh(); },
    logout() { doLogout(); refresh(); },
    refresh,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}
