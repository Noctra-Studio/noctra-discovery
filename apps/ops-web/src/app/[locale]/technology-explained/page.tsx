import type { Metadata } from "next";
import { TechnologyPage } from "@/components/marketing/MarketingPages";
import { getMarketingContent } from "@/content/marketing";
import { buildMetadata } from "@/lib/marketing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getMarketingContent(locale);
  return buildMetadata(locale, "/technology-explained", content.technology.meta);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <TechnologyPage locale={locale} />;
}
