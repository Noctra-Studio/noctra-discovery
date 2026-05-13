import Link from "next/link";
import { ReactNode } from "react";
import { getMarketingContent } from "@/content/marketing";
import { resolveLocale } from "@/lib/marketing";

function NavLink({
  href,
  children,
  subtle = false,
}: {
  href: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors",
        subtle
          ? "border border-white/10 bg-white/5 text-[#D8D8D1] hover:border-white/20 hover:text-white"
          : "text-[#D8D8D1] hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      {eyebrow ? (
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7EF3C5]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-black leading-tight text-[#F5F5F0] md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-8 text-[#B6B6AF] md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export function MarketingShell({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const safeLocale = resolveLocale(locale);
  const content = getMarketingContent(safeLocale);
  const alternateLocale = safeLocale === "es" ? "en" : "es";

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#F5F5F0]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(126,243,197,0.18),_transparent_26%),radial-gradient(circle_at_80%_12%,_rgba(245,213,139,0.14),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent_28%)]" />
      <div className="relative">
        <header className="sticky top-0 z-40 border-b border-white/6 bg-[#080808]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10">
            <div className="flex items-center gap-3">
              <Link href={`/${safeLocale}`} className="group flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#1D1D1B] bg-[#0E0E0D] shadow-[0_0_30px_rgba(0,0,0,0.25)]">
                  <span className="text-sm font-black tracking-[0.22em] text-[#7EF3C5]">
                    N
                  </span>
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-[#F5F5F0]">
                    {content.brand}
                  </p>
                  <p className="text-xs text-[#8D8D86]">
                    {safeLocale === "es"
                      ? "Branding, web, SEO/GEO y automatización"
                      : "Branding, web, SEO/GEO and automation"}
                  </p>
                </div>
              </Link>
            </div>

            <nav className="hidden items-center gap-1 lg:flex">
              {content.nav.links.map((link) => (
                <NavLink key={link.href} href={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <NavLink href={`/${alternateLocale}`} subtle>
                {alternateLocale.toUpperCase()}
              </NavLink>
              <NavLink href={content.nav.secondary.href} subtle>
                {content.nav.secondary.label}
              </NavLink>
              <Link
                href={content.nav.primary.href}
                className="inline-flex items-center rounded-full bg-[#F5F5F0] px-5 py-3 text-sm font-bold text-[#080808] transition-transform hover:-translate-y-0.5"
              >
                {content.nav.primary.label}
              </Link>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t border-white/8 bg-[#090909]">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.6fr_repeat(2,1fr)] md:px-10">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7EF3C5]">
                {content.brand}
              </p>
              <p className="max-w-xl text-base leading-8 text-[#B6B6AF]">
                {content.footer.tagline}
              </p>
            </div>

            {content.footer.columns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.24em] text-[#F5F5F0]">
                  {column.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {column.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-[#B6B6AF] transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
