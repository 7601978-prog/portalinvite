import LZString from "lz-string";

// Build absolute, shareable URLs that respect the deploy base path and the
// HashRouter (#) used on GitHub Pages. import.meta.env.BASE_URL is "/" in dev
// and "/portalinvite/" in the production build.
//
// Because the portal has no backend (data lives in the creator's
// localStorage), a bare /i/:slug link only works in the browser that made it.
// To make links openable on ANY device, we pack the invitation itself into the
// URL hash as a compressed payload (?c=...). The guest view reconstructs the
// invitation from this payload, falling back to localStorage when absent.
export function inviteUrl(slug, data) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}#/i/${slug}`;
  if (!data) return base;
  const payload = {
    eventType: data.eventType,
    themeKey: data.themeKey,
    font: data.font,
    // Guests always start from a clean RSVP list.
    blocks: (data.blocks || []).map((b) =>
      b.type === "rsvp" ? { ...b, responses: [] } : b
    ),
  };
  const c = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
  return `${base}?c=${c}`;
}

// Decode an invitation payload from a location.search string ("?c=..."), or
// return null when there is no payload / it is malformed.
export function decodeInvite(search) {
  try {
    // Read the raw "c" value WITHOUT URLSearchParams: lz-string's URI-safe
    // alphabet includes "+", and URLSearchParams would decode "+" as a space,
    // corrupting the payload.
    const m = /[?&]c=([^&]+)/.exec(search || "");
    if (!m) return null;
    const json = LZString.decompressFromEncodedURIComponent(m[1]);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}
