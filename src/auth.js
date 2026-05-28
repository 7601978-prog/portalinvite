const USERS_KEY = "invite.users.v1";
const SESSION_KEY = "invite.session.v1";

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); }
  catch { return {}; }
}
function writeUsers(map) { localStorage.setItem(USERS_KEY, JSON.stringify(map)); }

function normEmail(email) { return String(email || "").trim().toLowerCase(); }

const enc = new TextEncoder();
function bytesToHex(buf) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function randomSaltHex(len = 16) {
  const a = new Uint8Array(len); crypto.getRandomValues(a); return bytesToHex(a);
}

async function hashPassword(password, saltHex) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(saltHex), iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  return bytesToHex(bits);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normEmail(email));
}

export function validatePassword(pw) {
  return typeof pw === "string" && pw.length >= 6;
}

export async function register({ email, password, name }) {
  email = normEmail(email);
  if (!validateEmail(email)) throw new Error("Некорректный email");
  if (!validatePassword(password)) throw new Error("Пароль — минимум 6 символов");
  const users = readUsers();
  if (users[email]) throw new Error("Пользователь с таким email уже есть");

  const salt = randomSaltHex();
  const hash = await hashPassword(password, salt);
  const isFirst = Object.keys(users).length === 0;
  users[email] = {
    email,
    name: (name || "").trim() || email.split("@")[0],
    salt, hash,
    role: isFirst ? "admin" : "user",
    active: true,
    createdAt: Date.now(),
  };
  writeUsers(users);
  setSession(email);
  logAudit("register", { actor: email, role: users[email].role });
  return users[email];
}

export async function login({ email, password }) {
  email = normEmail(email);
  const users = readUsers();
  const u = users[email];
  if (!u) throw new Error("Пользователь не найден");
  if (!u.active) throw new Error("Учётная запись отключена администратором");
  const hash = await hashPassword(password, u.salt);
  if (hash !== u.hash) throw new Error("Неверный пароль");
  setSession(email);
  logAudit("login", { actor: email });
  return u;
}

export function logout() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (s?.email) logAudit("logout", { actor: s.email });
  } catch { /* ignore */ }
  localStorage.removeItem(SESSION_KEY);
}

function setSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email, at: Date.now() }));
}

export function currentUser() {
  try {
    const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    if (!s?.email) return null;
    const u = readUsers()[s.email];
    return u && u.active ? u : null;
  } catch { return null; }
}

// ── Admin operations ──
export function listUsers() {
  return Object.values(readUsers()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export function setUserActive(email, active) {
  const users = readUsers(); if (!users[email]) return;
  users[email].active = !!active; writeUsers(users);
  logAudit(active ? "user.enable" : "user.disable", { target: email });
}

export function setUserRole(email, role) {
  const users = readUsers(); if (!users[email]) return;
  users[email].role = role; writeUsers(users);
  logAudit("user.role", { target: email, role });
}

export function deleteUser(email) {
  const users = readUsers(); delete users[email]; writeUsers(users);
  logAudit("user.delete", { target: email });
}

// ── Self-service ──
export function updateProfile(email, patch) {
  email = normEmail(email);
  const users = readUsers();
  const u = users[email]; if (!u) throw new Error("Пользователь не найден");
  if (patch.name !== undefined) u.name = String(patch.name).trim() || u.email.split("@")[0];
  writeUsers(users);
  return u;
}

export async function changePassword(email, currentPassword, newPassword) {
  email = normEmail(email);
  if (!validatePassword(newPassword)) throw new Error("Новый пароль — минимум 6 символов");
  const users = readUsers();
  const u = users[email]; if (!u) throw new Error("Пользователь не найден");
  const cur = await hashPassword(currentPassword, u.salt);
  if (cur !== u.hash) throw new Error("Текущий пароль неверный");
  const salt = randomSaltHex();
  const hash = await hashPassword(newPassword, salt);
  u.salt = salt; u.hash = hash;
  writeUsers(users);
  return u;
}

export async function deleteSelf(email, password) {
  email = normEmail(email);
  const users = readUsers();
  const u = users[email]; if (!u) throw new Error("Пользователь не найден");
  const hash = await hashPassword(password, u.salt);
  if (hash !== u.hash) throw new Error("Неверный пароль");
  delete users[email]; writeUsers(users);
  localStorage.removeItem(SESSION_KEY);
}

// ── Audit log ──
const AUDIT_KEY = "invite.audit.v1";
const AUDIT_MAX = 200;
export function logAudit(action, meta = {}) {
  try {
    const arr = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
    const sess = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    arr.unshift({ at: Date.now(), action, actor: sess?.email || meta.actor || null, ...meta });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(arr.slice(0, AUDIT_MAX)));
  } catch { /* ignore */ }
}
export function listAudit() {
  try { return JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]"); }
  catch { return []; }
}
