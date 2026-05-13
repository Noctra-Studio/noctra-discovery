import type { Metadata } from "next";
import { PricingPage } from "@/components/marketing/MarketingPages";
import { getMarketingContent } from "@/content/marketing";
import { buildMetadata } from "@/lib/marketing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getMarketingContent(locale);
  return buildMetadata(locale, "/custom-pricing", content.pricing.meta);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <PricingPage locale={locale} />;
}
