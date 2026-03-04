import { NextIntlClientProvider, useTranslations } from "next-intl";
import React from "react";

// Separate Client Component to use translations
function FormContent({ slug }: { slug: string }) {
  const t = useTranslations("discoveryForm.intro");
  const tCommon = useTranslations("common");

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center justify-center">
      <div className="max-w-xl text-center">
        <span className="text-accent text-sm font-mono tracking-widest uppercase mb-4 block">
          {t("eyebrow")}
        </span>
        <h1 className="text-5xl font-display mb-4">{t("title")}</h1>
        <p className="font-body text-gray-600 dark:text-gray-400 mb-8">
          {t("description")}
        </p>
        <button className="bg-foreground text-background px-8 py-3 rounded-full font-body hover:opacity-90 transition-opacity">
          {t("cta")}
        </button>
      </div>
      <div className="mt-12 text-gray-500 font-mono text-sm">
        {tCommon("poweredBy")}
      </div>
    </div>
  );
}

export default async function PublicFormPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  // TODO: Fetch form language from Supabase using params.slug
  // For now, we'll simulate fetching the language.
  const formLanguage = "es"; // Simulated database response

  // If the form's language differs from the URL locale, override the messages
  let overrideMessages;
  if (formLanguage !== params.locale) {
    overrideMessages = (await import(`@/messages/${formLanguage}.json`))
      .default;
  }

  // Render content with overridden Provider if necessary
  if (overrideMessages) {
    return (
      <NextIntlClientProvider locale={formLanguage} messages={overrideMessages}>
        <FormContent slug={params.slug} />
      </NextIntlClientProvider>
    );
  }

  return <FormContent slug={params.slug} />;
}
