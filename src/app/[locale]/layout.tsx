import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { DM_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/Toast";
import { Cursor } from "@/components/ui/Cursor";
import "../globals.css";

const satoshi = localFont({
  src: "../../../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
});

const dmMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

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
    <html lang={locale} className={`${satoshi.variable} ${dmMono.variable}`}>
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
      <body className="font-body bg-[#080808] text-[#F5F5F0] antialiased min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Cursor />
          <ToastProvider>{children}</ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
