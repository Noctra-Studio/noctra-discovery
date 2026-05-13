import Link from "next/link";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/marketing/ContactForm";
import { MarketingServiceSlug, getMarketingContent } from "@/content/marketing";
import {
  MarketingShell,
  SectionIntro,
} from "@/components/marketing/MarketingShell";
import { getBrandShort } from "@/lib/site-config";

function Card({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
}) {
  return (
    <article className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 md:p-8">
      {eyebrow ? (
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#7EF3C5]">
          {eyebrow}
        </p>
      ) : null}
      <h3 className="text-2xl font-black text-[#F5F5F0]">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#B6B6AF] md:text-base">
        {description}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}
    </article>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-7 text-[#D8D8D1] md:text-base">
          <span className="mt-2 h-2 w-2 rounded-full bg-[#7EF3C5]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:border-white/20">
      {label}
    </Link>
  );
}

export function HomePage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.home;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7EF3C5]">
              {page.hero.eyebrow}
            </p>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-black leading-[0.94] text-[#F5F5F0] md:text-7xl">
                {page.hero.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[#C5C5BE] md:text-xl">
                {page.hero.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={page.hero.primary.href}
                className="inline-flex items-center rounded-full bg-[#F5F5F0] px-6 py-3 text-sm font-bold text-[#080808] transition-transform hover:-translate-y-0.5">
                {page.hero.primary.label}
              </Link>
              <SectionLink
                href={page.hero.secondary.href}
                label={page.hero.secondary.label}
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F5D58B]">
              Lo que cambia
            </p>
            <div className="mt-6 space-y-5">
              {page.hero.trust.map((item, index) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/8 bg-[#0D0D0C] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7EF3C5]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-base leading-7 text-[#ECECE6]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionIntro
          eyebrow="Base digital"
          title="La presencia que tu negocio necesita no depende de una sola pieza."
          description="Marca, sitio, visibilidad y operación se refuerzan mutuamente. Cuando una parte está mal resuelta, el resto compensa de forma cara e inestable."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {page.pillars.map((pillar) => (
            <Card
              key={pillar.title}
              title={pillar.title}
              description={pillar.description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionIntro
          eyebrow="Etapa del negocio"
          title="Trabajamos con negocios de distintos tamaños, pero no desde un mensaje genérico."
          description="La necesidad cambia según la etapa. La lógica, no: comunicar mejor, ganar autoridad y crecer con una base más ordenada."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.stages.map((stage) => (
            <Card
              key={stage.title}
              title={stage.title}
              description={stage.description}>
              <p className="border-t border-white/10 pt-5 text-sm leading-7 text-[#8F8F88]">
                {stage.support}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionIntro
          eyebrow={page.servicesIntro.eyebrow}
          title={page.servicesIntro.title}
          description={page.servicesIntro.description}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {page.servicesIntro.cards.map((service) => (
            <Card
              key={service.slug}
              title={service.title}
              description={service.description}
              eyebrow={service.outcome}>
              <SectionLink
                href={`/${locale}/services/${service.slug}`}
                label="Ver detalle"
              />
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionIntro
          eyebrow="Proceso"
          title="Así aterrizamos una presencia que sí ayuda al negocio."
          description="Cada proyecto necesita su matiz, pero el recorrido tiene una lógica estable para reducir improvisación y hacer visibles las prioridades."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {page.process.map((item, index) => (
            <Card
              key={item.title}
              title={item.title}
              description={item.description}
              eyebrow={`Paso ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <SectionIntro
          eyebrow="Qué cuidamos"
          title="El sitio puede verse premium. Lo importante es que también sostenga crecimiento."
          description="Por eso la conversación mezcla marca, percepción, SEO/GEO, fricción comercial y continuidad operativa."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.proof.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10 md:px-10 md:pb-32">
        <div className="rounded-[36px] border border-white/8 bg-[linear-gradient(135deg,rgba(126,243,197,0.08),rgba(245,213,139,0.08))] p-8 md:p-12">
          <SectionIntro
            eyebrow="Siguiente paso"
            title={page.finalCta.title}
            description={page.finalCta.description}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={page.finalCta.primary.href}
              className="inline-flex items-center rounded-full bg-[#F5F5F0] px-6 py-3 text-sm font-bold text-[#080808]">
              {page.finalCta.primary.label}
            </Link>
            <SectionLink
              href={page.finalCta.secondary.href}
              label={page.finalCta.secondary.label}
            />
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

export function AboutPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.about;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Estudio"
          title={`${getBrandShort()} existe para negocios que ya no quieren improvisar su presencia digital.`}
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.principles.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card
            title="Lo que no creemos"
            description="Nuestro trabajo también es evitar decisiones que se ven sofisticadas, pero no sostienen crecimiento.">
            <BulletList items={page.beliefs} />
          </Card>
          <Card
            title="Cómo se nota la diferencia"
            description={`${getBrandShort()} mezcla criterio de marca, estructura web, visibilidad y operación para que el sistema completo sea más sólido.`}>
            <div className="space-y-5">
              {page.differentiators.map((item) => (
                <div
                  key={item.title}
                  className="border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
                  <h3 className="text-lg font-black text-[#F5F5F0]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#B6B6AF]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </MarketingShell>
  );
}

export function ServicesPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.services;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Servicios"
          title="Diseñamos la base digital que una empresa necesita en su etapa real."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {page.cards.map((service) => (
            <Card
              key={service.slug}
              title={service.title}
              description={service.description}
              eyebrow={service.outcome}>
              <SectionLink
                href={`/${locale}/services/${service.slug}`}
                label="Ver detalle"
              />
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
        <Card
          title={page.continuity.title}
          description={page.continuity.description}>
          <BulletList items={page.continuity.items} />
        </Card>
      </section>
    </MarketingShell>
  );
}

export function ServiceDetailPage({
  locale,
  slug,
}: {
  locale: string;
  slug: MarketingServiceSlug;
}) {
  const content = getMarketingContent(locale);
  const page = content.serviceDetails[slug];

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow={page.eyebrow}
          title={page.title}
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card
            title="Para quién aplica"
            description="Si te ves en varios de estos escenarios, esta ruta probablemente tiene sentido.">
            <BulletList items={page.fit} />
          </Card>
          <Card
            title="Qué incluimos"
            description="El alcance final depende del proyecto, pero esta es la lógica base de implementación.">
            <BulletList items={page.includes} />
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
        <Card
          title="Qué debería cambiar después"
          description="Lo importante no es entregar piezas. Es notar una mejora en comprensión, confianza, visibilidad o flujo operativo.">
          <BulletList items={page.outcomes} />
          <div className="mt-8">
            <SectionLink href={page.cta.href} label={page.cta.label} />
          </div>
        </Card>
      </section>
    </MarketingShell>
  );
}

export function WorkPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.work;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Resultados"
          title="Preferimos mostrar problemas resueltos, no promesas vacías."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.cases.map((item) => (
            <Card
              key={item.name}
              title={item.name}
              description={item.challenge}
              eyebrow={item.sector}>
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#F5D58B]">
                    Qué hicimos
                  </p>
                  <div className="mt-3">
                    <BulletList items={item.work} />
                  </div>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7EF3C5]">
                    Qué cambió
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#D8D8D1]">
                    {item.outcome}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-[#8F8F88]">
          {page.note}
        </p>
      </section>
    </MarketingShell>
  );
}

export function ContactPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.contact;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <SectionIntro
              eyebrow="Contacto"
              title="Cuéntanos qué necesitas desbloquear."
              description={page.intro}
            />
            <Card
              title="Qué puedes esperar"
              description="La idea no es mandarte un formulario más. Es entender si la mezcla correcta es marca, sitio, SEO/GEO, automatización o una secuencia de varias cosas.">
              <BulletList items={page.checklist} />
            </Card>
          </div>

          <ContactForm labels={page.form} locale={locale} />
        </div>
      </section>
    </MarketingShell>
  );
}

export function BlogPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.blog;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Insights"
          title="Contenido para negocios que quieren criterio, no ruido digital."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.posts.map((post) => (
            <Card
              key={post.title}
              title={post.title}
              description={post.summary}
              eyebrow={post.category}
            />
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

export function GuaranteePage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.guarantee;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Garantía"
          title="La confianza se construye mejor cuando el riesgo está aterrizado."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.principles.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
        <Card
          title="Condiciones de aplicación"
          description="La garantía no se presenta como truco comercial; se detalla según el proyecto y la responsabilidad compartida.">
          <BulletList items={page.conditions} />
        </Card>
      </section>
    </MarketingShell>
  );
}

export function TechnologyPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.technology;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Tecnología"
          title="Explicamos la tecnología en términos de negocio."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.comparisons.map((item) => (
            <Card
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-6 lg:grid-cols-3">
          {page.faqs.map((faq) => (
            <Card
              key={faq.question}
              title={faq.question}
              description={faq.answer}
            />
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

export function PricingPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.pricing;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Precios"
          title="Cotizamos según la etapa del negocio, no desde una tabla ciega."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.tiers.map((tier) => (
            <Card
              key={tier.name}
              title={tier.name}
              description={tier.fit}
              eyebrow={tier.range}>
              <BulletList items={tier.includes} />
            </Card>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-7 text-[#8F8F88]">
          {page.note}
        </p>
      </section>
    </MarketingShell>
  );
}

export function FirstClientsPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.firstClients;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Programa fundacional"
          title="Una colaboración temprana, estratégica y limitada."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card
            title="Qué obtienes"
            description="Cuando abrimos estos espacios, el nivel de cercanía y acompañamiento es mayor que en un proyecto estándar.">
            <BulletList items={page.benefits} />
          </Card>
          <Card
            title="Cómo evaluamos fit"
            description="No es una promoción abierta para cualquiera. Seleccionamos por claridad del reto y valor estratégico mutuo.">
            <BulletList items={page.conditions} />
            <div className="mt-8">
              <SectionLink href={page.cta.href} label={page.cta.label} />
            </div>
          </Card>
        </div>
      </section>
    </MarketingShell>
  );
}

export function CareersPage({ locale }: { locale: string }) {
  const content = getMarketingContent(locale);
  const page = content.careers;

  return (
    <MarketingShell locale={locale}>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <SectionIntro
          eyebrow="Talento"
          title="Trabajamos con una red pequeña de especialistas con criterio."
          description={page.intro}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {page.roles.map((role) => (
            <Card
              key={role.title}
              title={role.title}
              description={role.description}
            />
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
