/* ------------------------------------------------------------------ */
/*  Minimal client-side router for the single-file build.               */
/*  Routes: "/" (home) and "/thank-you".                                */
/*  Uses the History API; falls back to "#/thank-you" when pushState    */
/*  is unavailable, so the confirmation page works on any host.         */
/* ------------------------------------------------------------------ */

export type AppRoute = "home" | "thank-you";

export interface ThankYouState {
  name?: string;
  property?: string;
  reference?: string;
  via?: "endpoint" | "email";
  source?: string;
}

const NAV_EVENT = "stay:navigate";

/** Base path the app is served from (supports sub-folder hosting and index.html). */
export function getBasePath(): string {
  let p = window.location.pathname.replace(/\/thank-you\/?$/, "/").replace(/\/index\.html$/, "/");
  if (!p.endsWith("/")) p = p.slice(0, p.lastIndexOf("/") + 1);
  return p || "/";
}

export function getRoute(): AppRoute {
  if (/\/thank-you\/?$/.test(window.location.pathname)) return "thank-you";
  if (window.location.hash.replace(/\/+$/, "") === "#/thank-you") return "thank-you";
  return "home";
}

/** Details passed from the form to the thank-you page (kept in history state). */
export function getThankYouState(): ThankYouState {
  const s = window.history.state;
  return s && typeof s === "object" ? (s as ThankYouState) : {};
}

/** Navigate programmatically. Returns false only if every mechanism failed. */
export function navigate(path: "/" | "/thank-you", state?: ThankYouState): boolean {
  const base = getBasePath();
  const target = path === "/" ? base : `${base.replace(/\/$/, "")}/thank-you`;
  try {
    window.history.pushState({ ...(state ?? {}), route: path }, "", target);
  } catch {
    try {
      window.location.hash = path === "/" ? "" : "#/thank-you";
    } catch {
      return false;
    }
  }
  window.dispatchEvent(new CustomEvent(NAV_EVENT));
  return true;
}

/** Subscribe to route changes (back/forward, hash edits, programmatic navigation). */
export function onRouteChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener("popstate", handler);
  window.addEventListener("hashchange", handler);
  window.addEventListener(NAV_EVENT, handler);
  return () => {
    window.removeEventListener("popstate", handler);
    window.removeEventListener("hashchange", handler);
    window.removeEventListener(NAV_EVENT, handler);
  };
}
