import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ToastProvider } from "@/components/ui/Toast";
import { Cursor } from "@/components/ui/Cursor";
import "../globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link
          rel="icon"
          href="/favicon-dark.svg"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-light.svg"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className="bg-[#080808] text-[#F5F5F0] antialiased min-h-screen overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Cursor />
          <ToastProvider>{children}</ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
