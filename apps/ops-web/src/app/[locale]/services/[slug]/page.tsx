import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/marketing/MarketingPages";
import {
  getMarketingContent,
  MarketingServiceSlug,
  serviceSlugs,
} from "@/content/marketing";
import { buildMetadata } from "@/lib/marketing";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!serviceSlugs.includes(slug as MarketingServiceSlug)) {
    return {};
  }

  const content = getMarketingContent(locale);
  return buildMetadata(
    locale,
    `/services/${slug}`,
    content.serviceDetails[slug as MarketingServiceSlug].meta,
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!serviceSlugs.includes(slug as MarketingServiceSlug)) {
    notFound();
  }

  return <ServiceDetailPage locale={locale} slug={slug as MarketingServiceSlug} />;
}
