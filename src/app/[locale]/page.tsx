import { redirect } from "next/navigation";

export default async function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log("RootPage executed for locale:", locale);
  redirect(`/${locale}/admin`);
}
