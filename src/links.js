// Build absolute, shareable URLs that respect the deploy base path and the
// HashRouter (#) used on GitHub Pages. import.meta.env.BASE_URL is "/" in dev
// and "/portalinvite/" in the production build.
export function inviteUrl(slug) {
  return `${window.location.origin}${import.meta.env.BASE_URL}#/i/${slug}`;
}
