import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/MarketingPages";
import { buildMetadata } from "@/lib/marketing";
import { getMarketingContent } from "@/content/marketing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = getMarketingContent(locale);

  return buildMetadata(locale, "/", content.home.meta);
}

export default async function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
