/**
 * White-label / per-deployment branding.
 * Defaults keep Noctra Studio; set NEXT_PUBLIC_* in Vercel for each client clone.
 */

export function getBrandName(): string {
  return process.env.NEXT_PUBLIC_BRAND_NAME?.trim() || "Noctra Studio";
}

export function getBrandShort(): string {
  return process.env.NEXT_PUBLIC_BRAND_SHORT?.trim() || "Noctra";
}

/** Public site / contact link (not necessarily the same as the deployed app URL). */
export function getBrandUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BRAND_URL?.trim() || "https://noctra.studio";
  return raw.replace(/\/+$/, "");
}

/** Small footer label, e.g. "noctra.studio" — derived from getBrandUrl(). */
export function getBrandHostLabel(): string {
  try {
    const host = new URL(getBrandUrl()).hostname.replace(/^www\./, "");
    return host || "noctra.studio";
  } catch {
    return "noctra.studio";
  }
}

/** Path under /public for admin + auth logo (white mark). */
export function getAdminLogoPath(): string {
  return process.env.NEXT_PUBLIC_ADMIN_LOGO_PATH?.trim() || "/noctra-logo-white.png";
}

export function getPoweredByFooterText(): string {
  return `Powered by ${getBrandName()}`;
}

/**
 * Canonical base for marketing pages (sitemap, OG URLs).
 * Prefer NEXT_PUBLIC_SITE_URL, then app URL, then brand URL.
 */
export function getMarketingBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    getBrandUrl();
  return raw.replace(/\/+$/, "");
}

/**
 * Deep-clone strings in CMS-like content so "Noctra Studio" / "Noctra" / noctra.studio
 * become the configured brand (used for marketing copy).
 */
export function applyBrandToStrings<T>(value: T): T {
  if (typeof value === "string") {
    return applyBrandToString(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => applyBrandToStrings(v)) as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = applyBrandToStrings(v);
    }
    return out as T;
  }
  return value;
}

function applyBrandToString(s: string): string {
  const name = getBrandName();
  const short = getBrandShort();
  const host = getBrandHostLabel();
  return s
    .replace(/Noctra Studio/g, name)
    .replace(/\bNoctra\b/g, short)
    .replace(/noctra\.studio/gi, host);
}
