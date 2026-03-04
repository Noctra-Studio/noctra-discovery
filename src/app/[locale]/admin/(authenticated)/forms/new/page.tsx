import { getTranslations } from "next-intl/server";
import ClientFormNew from "./ClientFormNew";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewFormPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("admin.newForm");

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="px-4 lg:px-10 py-6 border-b border-[#222] flex items-center gap-4">
        <Link
          href={`/${locale}/admin`}
          className="p-2 rounded-full border border-[#222] bg-[#0E0E0E] text-gray-400 hover:text-white hover:border-[#444] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl lg:text-3xl text-white font-black uppercase tracking-tight">
          {t("title")}
        </h1>
      </header>

      <main className="mx-auto max-w-full">
        <ClientFormNew locale={locale} />
      </main>
    </div>
  );
}
