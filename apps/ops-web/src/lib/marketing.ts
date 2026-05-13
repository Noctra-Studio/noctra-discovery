import type { Metadata } from "next";
import { getMarketingContent } from "@/content/marketing";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.noctra.studio";

export function resolveLocale(locale: string) {
  return locale === "en" ? "en" : "es";
}

export function buildMetadata(
  locale: string,
  path: string,
  meta?: { title: string; description: string },
): Metadata {
  const safeLocale = resolveLocale(locale);
  const content = getMarketingContent(safeLocale);
  const pageMeta = meta ?? content.siteMeta;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}/${safeLocale}${canonicalPath === "/" ? "" : canonicalPath}`;

  return {
    title: pageMeta.title,
    description: pageMeta.description,
    alternates: {
      canonical: url,
      languages: {
        es: `${BASE_URL}/es${canonicalPath === "/" ? "" : canonicalPath}`,
        en: `${BASE_URL}/en${canonicalPath === "/" ? "" : canonicalPath}`,
      },
    },
    openGraph: {
      title: pageMeta.title,
      description: pageMeta.description,
      url,
      siteName: "Noctra Studio",
      locale: safeLocale === "es" ? "es_MX" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageMeta.title,
      description: pageMeta.description,
    },
  };
}
