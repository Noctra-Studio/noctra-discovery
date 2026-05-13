/**
 * Canonical public origin for this deployment (per-client clone on Vercel + custom domain).
 * Prefer NEXT_PUBLIC_APP_URL; NEXT_PUBLIC_SITE_URL is a fallback used elsewhere in the app.
 * No trailing slash.
 */
export function getPublicSiteOrigin(): string {
  const raw =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_APP_URL?.trim() ||
        process.env.NEXT_PUBLIC_SITE_URL?.trim())) ||
    "";
  const trimmed = raw.replace(/\/+$/, "");
  if (trimmed) return trimmed;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
}

/**
 * Absolute URL for a client-facing discovery form. Matches App Router: /[locale]/f/[slug].
 */
export function getDiscoveryFormAbsoluteUrl(
  slug: string,
  formLocale: "es" | "en",
): string {
  return `${getPublicSiteOrigin()}/${formLocale}/f/${slug}`;
}
