import { logAudit } from "./auth.js";
const KEY = "invite.portal.v1";

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}
function writeAll(map) { localStorage.setItem(KEY, JSON.stringify(map)); }

export function listInvitations(hostEmail) {
  const map = readAll();
  return Object.entries(map)
    .map(([slug, data]) => ({ slug, ...data }))
    .filter((inv) => !hostEmail || inv.hostEmail === hostEmail)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function listAllInvitations() {
  return listInvitations(null);
}

export function loadInvitation(slug) {
  const map = readAll();
  return map[slug] || null;
}

export function saveInvitation(slug, data, hostEmail) {
  const map = readAll();
  const existing = map[slug] || {};
  const isNew = !existing.createdAt;
  map[slug] = {
    ...existing,
    ...data,
    hostEmail: existing.hostEmail || hostEmail || null,
    updatedAt: Date.now(),
    createdAt: existing.createdAt || Date.now(),
  };
  writeAll(map);
  if (isNew) logAudit("invite.create", { slug, eventType: data.eventType });
}

export function deleteInvitation(slug) {
  const map = readAll();
  delete map[slug];
  writeAll(map);
  logAudit("invite.delete", { slug });
}

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789";
export function genSlug(len = 6) {
  let s = "";
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  for (const n of arr) s += ALPHABET[n % ALPHABET.length];
  return s;
}
