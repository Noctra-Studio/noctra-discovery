import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Bebas_Neue, DM_Sans, DM_Mono } from "next/font/google";
import "../globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
    <html
      lang={locale}
      className={`${bebasNeue.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-body bg-background text-foreground antialiased min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
