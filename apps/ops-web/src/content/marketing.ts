export type MarketingLocale = "es" | "en";

export type MarketingMeta = {
  title: string;
  description: string;
};

export type MarketingCTA = {
  label: string;
  href: string;
};

export type MarketingServiceSlug =
  | "professional-websites"
  | "landing-page"
  | "optimization"
  | "ecommerce"
  | "custom-systems";

type FeatureItem = {
  title: string;
  description: string;
};

type ServiceCard = FeatureItem & {
  slug: MarketingServiceSlug;
  outcome: string;
};

type WorkCard = {
  name: string;
  sector: string;
  challenge: string;
  work: string[];
  outcome: string;
};

type BlogCard = {
  title: string;
  summary: string;
  category: string;
};

type PriceTier = {
  name: string;
  range: string;
  fit: string;
  includes: string[];
};

type ServiceDetail = {
  meta: MarketingMeta;
  eyebrow: string;
  title: string;
  intro: string;
  fit: string[];
  includes: string[];
  outcomes: string[];
  cta: MarketingCTA;
};

type LocaleContent = {
  brand: string;
  siteMeta: MarketingMeta;
  nav: {
    links: MarketingCTA[];
    primary: MarketingCTA;
    secondary: MarketingCTA;
  };
  footer: {
    tagline: string;
    columns: Array<{ title: string; links: MarketingCTA[] }>;
  };
  home: {
    meta: MarketingMeta;
    hero: {
      eyebrow: string;
      title: string;
      subtitle: string;
      primary: MarketingCTA;
      secondary: MarketingCTA;
      trust: string[];
    };
    pillars: FeatureItem[];
    stages: Array<{
      title: string;
      description: string;
      support: string;
    }>;
    servicesIntro: {
      eyebrow: string;
      title: string;
      description: string;
      cards: ServiceCard[];
    };
    process: FeatureItem[];
    proof: FeatureItem[];
    finalCta: {
      title: string;
      description: string;
      primary: MarketingCTA;
      secondary: MarketingCTA;
    };
  };
  about: {
    meta: MarketingMeta;
    intro: string;
    principles: FeatureItem[];
    beliefs: string[];
    differentiators: FeatureItem[];
  };
  services: {
    meta: MarketingMeta;
    intro: string;
    cards: ServiceCard[];
    continuity: {
      title: string;
      description: string;
      items: string[];
    };
  };
  serviceDetails: Record<MarketingServiceSlug, ServiceDetail>;
  work: {
    meta: MarketingMeta;
    intro: string;
    cases: WorkCard[];
    note: string;
  };
  contact: {
    meta: MarketingMeta;
    intro: string;
    checklist: string[];
    form: {
      name: string;
      email: string;
      company: string;
      stage: string;
      challenge: string;
      submit: string;
      successTitle: string;
      successBody: string;
      errorTitle: string;
      errorBody: string;
    };
  };
  blog: {
    meta: MarketingMeta;
    intro: string;
    posts: BlogCard[];
  };
  guarantee: {
    meta: MarketingMeta;
    intro: string;
    principles: FeatureItem[];
    conditions: string[];
  };
  technology: {
    meta: MarketingMeta;
    intro: string;
    comparisons: FeatureItem[];
    faqs: Array<{ question: string; answer: string }>;
  };
  pricing: {
    meta: MarketingMeta;
    intro: string;
    tiers: PriceTier[];
    note: string;
  };
  firstClients: {
    meta: MarketingMeta;
    intro: string;
    benefits: string[];
    conditions: string[];
    cta: MarketingCTA;
  };
  careers: {
    meta: MarketingMeta;
    intro: string;
    roles: FeatureItem[];
  };
};

export const serviceSlugs: MarketingServiceSlug[] = [
  "professional-websites",
  "landing-page",
  "optimization",
  "ecommerce",
  "custom-systems",
];

const es: LocaleContent = {
  brand: "Noctra Studio",
  siteMeta: {
    title: "Noctra Studio | Branding, web, SEO/GEO y automatización para crecer con estructura",
    description:
      "Ayudamos a negocios a construir una presencia digital clara, confiable y lista para crecer con branding, websites, SEO/GEO y automatización.",
  },
  nav: {
    links: [
      { label: "Estudio", href: "/es/about" },
      { label: "Servicios", href: "/es/services" },
      { label: "Resultados", href: "/es/work" },
      { label: "Insights", href: "/es/blog" },
    ],
    primary: { label: "Agendar diagnóstico", href: "/es/contact" },
    secondary: { label: "Solicitar propuesta", href: "/es/custom-pricing" },
  },
  footer: {
    tagline:
      "Branding, websites, SEO/GEO y automatización para negocios que necesitan verse más serios y crecer sin improvisar.",
    columns: [
      {
        title: "Explorar",
        links: [
          { label: "Inicio", href: "/es" },
          { label: "Servicios", href: "/es/services" },
          { label: "Resultados", href: "/es/work" },
          { label: "Contacto", href: "/es/contact" },
        ],
      },
      {
        title: "Confianza",
        links: [
          { label: "Estudio", href: "/es/about" },
          { label: "Garantía", href: "/es/guarantee" },
          { label: "Tecnología", href: "/es/technology-explained" },
          { label: "Precios", href: "/es/custom-pricing" },
        ],
      },
    ],
  },
  home: {
    meta: {
      title:
        "Noctra Studio | Haz que tu negocio se vea serio, aparezca mejor y convierta más",
      description:
        "Construimos la base digital que hace que tu negocio se entienda rápido, inspire confianza y crezca con branding, web, SEO/GEO y automatización.",
    },
    hero: {
      eyebrow: "Branding + web + SEO/GEO + automatización",
      title:
        "Haz que tu negocio se vea serio, aparezca donde lo buscan y convierta con menos fricción.",
      subtitle:
        "Noctra diseña la base digital que una empresa necesita para comunicar mejor, captar mejor y crecer con más estructura. Empezando o escalando, la lógica es la misma: claridad, autoridad y continuidad.",
      primary: { label: "Agendar diagnóstico", href: "/es/contact" },
      secondary: { label: "Ver servicios", href: "/es/services" },
      trust: [
        "Mensaje claro para que te entiendan más rápido",
        "SEO/GEO y autoridad digital para visibilidad sostenible",
        "Sistemas y automatización para crecer sin caos operativo",
      ],
    },
    pillars: [
      {
        title: "Claridad de marca",
        description:
          "Definimos el mensaje, la jerarquía y la presencia visual que hace que tu negocio se sienta confiable desde el primer contacto.",
      },
      {
        title: "Web que convierte",
        description:
          "Diseñamos sitios y landings que explican mejor tu oferta, filtran mejor el interés y facilitan el siguiente paso.",
      },
      {
        title: "SEO + GEO + autoridad digital",
        description:
          "Preparamos tu presencia para buscadores, mapas y experiencias asistidas por IA, no solo para una auditoría técnica.",
      },
      {
        title: "Automatización útil",
        description:
          "Ordenamos captación, seguimiento y operación para que el crecimiento no dependa de perseguir cada pendiente manualmente.",
      },
    ],
    stages: [
      {
        title: "Si vas empezando",
        description:
          "Te ayudamos a construir una base profesional: identidad, sitio y narrativa para lanzar con más confianza.",
        support: "Ideal para consultores, estudios pequeños, negocios locales y nuevas marcas.",
      },
      {
        title: "Si ya vendes, pero te ves desalineado",
        description:
          "Reordenamos tu mensaje, tu sitio y tu visibilidad para que tu presencia deje de verse como una etapa anterior.",
        support: "Ideal para PyMEs, firmas de servicios y equipos que crecieron más rápido que su presencia digital.",
      },
      {
        title: "Si ya creciste y necesitas estructura",
        description:
          "Conectamos branding, captación, SEO/GEO y sistemas para que escalar no implique reconstruir todo cada pocos meses.",
        support: "Ideal para startups, equipos internos y negocios con varias líneas de servicio.",
      },
    ],
    servicesIntro: {
      eyebrow: "Qué implementamos",
      title: "No vendemos piezas sueltas. Diseñamos la base digital completa.",
      description:
        "Cada frente se piensa como parte de un mismo sistema: qué debe entender la gente, por qué debe confiar y cómo debe avanzar.",
      cards: [
        {
          slug: "professional-websites",
          title: "Sitios web profesionales",
          description:
            "Presencia premium para negocios que necesitan explicar mejor su valor y verse a la altura de lo que ya hacen bien.",
          outcome: "Más claridad, más confianza y mejores conversaciones comerciales.",
        },
        {
          slug: "landing-page",
          title: "Landing pages de alta intención",
          description:
            "Páginas para campañas, lanzamientos y validación de ofertas sin cargar desde el día uno con un sitio completo.",
          outcome: "Captación más enfocada y aprendizaje más rápido del mensaje.",
        },
        {
          slug: "optimization",
          title: "SEO/GEO y optimización",
          description:
            "Visibilidad técnica, local y semántica para que tu marca aparezca mejor y gane autoridad con continuidad.",
          outcome: "Más visibilidad útil y una presencia mejor entendida por buscadores y asistentes.",
        },
        {
          slug: "ecommerce",
          title: "E-commerce",
          description:
            "Tiendas pensadas para vender, no solo para mostrar catálogo. Menos fricción, más claridad y mejor estructura comercial.",
          outcome: "Experiencias de compra más simples y una operación más fácil de escalar.",
        },
        {
          slug: "custom-systems",
          title: "Sistemas a la medida",
          description:
            "Herramientas internas, flujos comerciales y automatizaciones cuando el verdadero cuello de botella está en la operación.",
          outcome: "Menos tiempo perdido y una base más ordenada para crecer.",
        },
      ],
    },
    process: [
      {
        title: "Diagnóstico",
        description:
          "Empezamos entendiendo etapa, oferta, fricciones y oportunidades reales. Sin eso, cualquier diseño o SEO se vuelve maquillaje.",
      },
      {
        title: "Definición de base",
        description:
          "Alineamos mensaje, propuesta, estructura y prioridades para que el sistema digital tenga lógica antes de construirlo.",
      },
      {
        title: "Implementación",
        description:
          "Ejecutamos branding, website, SEO/GEO y automatización con una narrativa conectada, no con entregables aislados.",
      },
      {
        title: "Continuidad",
        description:
          "Medimos, ajustamos y fortalecemos la presencia para que el crecimiento no se quede congelado al momento del lanzamiento.",
      },
    ],
    proof: [
      {
        title: "Promesas aterrizadas",
        description:
          "Hablamos de claridad, visibilidad y conversión porque son cosas que un negocio sí puede sentir en ventas, percepción y operación.",
      },
      {
        title: "Sin dependencia innecesaria",
        description:
          "Diseñamos sistemas que tu negocio pueda sostener y evolucionar, no una presencia que te amarra a decisiones frágiles.",
      },
      {
        title: "Criterio antes que volumen",
        description:
          "Trabajamos con pocos proyectos a la vez para sostener criterio, velocidad de respuesta y ejecución cuidada.",
      },
    ],
    finalCta: {
      title: "Si tu negocio ya no quiere improvisar su presencia digital, aquí empieza el siguiente paso.",
      description:
        "La conversación inicial nos ayuda a ver si el problema principal es marca, sitio, visibilidad, captación o estructura. A veces es una mezcla, y justo ahí es donde Noctra funciona mejor.",
      primary: { label: "Agendar diagnóstico", href: "/es/contact" },
      secondary: { label: "Ver resultados", href: "/es/work" },
    },
  },
  about: {
    meta: {
      title: "Estudio | Noctra Studio",
      description:
        "Conoce cómo Noctra Studio combina estrategia, diseño e implementación para crear sistemas digitales claros y confiables.",
    },
    intro:
      "Noctra existe para negocios que saben trabajar bien, pero cuya presencia digital todavía no transmite ese mismo nivel de rigor. Nos gusta la claridad, la estructura y las decisiones que sí mejoran cómo una empresa se percibe, se encuentra y crece.",
    principles: [
      {
        title: "La forma importa cuando mejora comprensión",
        description:
          "No diseñamos por decoración. Diseñamos para que tu oferta se entienda mejor, inspire más confianza y reduzca fricción comercial.",
      },
      {
        title: "La tecnología importa cuando libera al negocio",
        description:
          "Elegimos herramientas y arquitectura para que tu sitio sea rápido, portable y fácil de evolucionar sin rehacerlo todo.",
      },
      {
        title: "La estrategia importa cuando aterriza",
        description:
          "No vendemos conceptos vagos. Traducimos decisiones de marca, SEO/GEO y automatización a sistemas que sí puedes usar.",
      },
    ],
    beliefs: [
      "Un branding sin claridad comercial se siente bonito, pero no sostiene crecimiento.",
      "Un sitio rápido sin mensaje claro sigue perdiendo oportunidades.",
      "Un SEO técnico sin autoridad temática ni contenido útil se queda corto.",
      "Una automatización sin criterio solo acelera el desorden.",
    ],
    differentiators: [
      {
        title: "Mirada de sistema",
        description:
          "Conectamos marca, visibilidad, conversión y operación en lugar de optimizar cada pieza como si viviera sola.",
      },
      {
        title: "Lenguaje de negocio",
        description:
          "Explicamos decisiones técnicas y estratégicas en términos de confianza, captación, continuidad y escalabilidad.",
      },
      {
        title: "Ejecución cuidada",
        description:
          "Menos volumen y más criterio. Preferimos un sistema sobrio, claro y durable a una promesa aparente que envejece rápido.",
      },
    ],
  },
  services: {
    meta: {
      title: "Servicios | Noctra Studio",
      description:
        "Branding, websites, SEO/GEO, e-commerce y sistemas a la medida para negocios que necesitan una base digital más sólida.",
    },
    intro:
      "Nuestros servicios están pensados como decisiones estratégicas, no como paquetes desconectados. El objetivo no es entregarte piezas: es construir la base digital que tu negocio necesita hoy y pueda sostener mañana.",
    cards: [
      {
        slug: "professional-websites",
        title: "Sitios web profesionales",
        description:
          "Para negocios que necesitan verse serios, explicar bien lo que hacen y convertir visitas en conversaciones mejor calificadas.",
        outcome: "Más autoridad y un sitio que sí trabaja como activo comercial.",
      },
      {
        slug: "landing-page",
        title: "Landing pages",
        description:
          "Para campañas, validación de oferta, anuncios o lanzamientos donde importa una acción clara por encima de un sitio completo.",
        outcome: "Captación enfocada, aprendizaje rápido y menos ruido.",
      },
      {
        slug: "optimization",
        title: "SEO/GEO y optimización",
        description:
          "Para marcas que ya tienen presencia, pero no están apareciendo ni construyendo autoridad al ritmo que su negocio necesita.",
        outcome: "Mejor visibilidad, más contexto para buscadores y presencia más entendible.",
      },
      {
        slug: "ecommerce",
        title: "E-commerce",
        description:
          "Para negocios que venden productos y necesitan una experiencia clara desde el catálogo hasta el checkout.",
        outcome: "Menos fricción de compra y mejor estructura para escalar catálogo y operación.",
      },
      {
        slug: "custom-systems",
        title: "Sistemas a la medida",
        description:
          "Para equipos cuyo cuello de botella ya no es la presencia, sino la forma en que captan, dan seguimiento o operan internamente.",
        outcome: "Más tiempo recuperado y procesos menos frágiles.",
      },
    ],
    continuity: {
      title: "Gestión digital continua",
      description:
        "Después del lanzamiento, podemos seguir como partner de crecimiento para sostener mejoras, SEO/GEO, contenido y evolución del sistema.",
      items: [
        "Mantenimiento y mejoras continuas",
        "SEO/GEO y contenidos de autoridad",
        "Iteraciones de UX y conversión",
        "Ajustes de integraciones y automatización",
      ],
    },
  },
  serviceDetails: {
    "professional-websites": {
      meta: {
        title: "Sitios Web Profesionales | Noctra Studio",
        description:
          "Sitios diseñados para que tu negocio se vea sólido, se entienda rápido y convierta mejor sin depender de plantillas frágiles.",
      },
      eyebrow: "Presencia que sí trabaja",
      title: "Un sitio profesional no solo se ve bien. Hace que te entiendan más rápido y confíen más.",
      intro:
        "Esta opción es para negocios que ya tienen algo que vender, pero cuya presencia todavía no refleja con claridad ese valor. Construimos sitios sobrios, rápidos y bien estructurados para comunicar mejor y convertir mejor.",
      fit: [
        "Despachos, consultores, clínicas, estudios y firmas especializadas",
        "PyMEs que crecieron, pero siguen con una web de etapa temprana",
        "Marcas que necesitan verse premium sin parecer inaccesibles",
      ],
      includes: [
        "Arquitectura de contenido",
        "Copy estructural y jerarquía del mensaje",
        "Diseño visual alineado con la marca",
        "SEO técnico base y performance",
        "Formularios y flujos de captación",
      ],
      outcomes: [
        "Más claridad en la propuesta y servicios",
        "Mayor percepción de confianza y criterio",
        "Un mejor puente entre interés y conversación comercial",
      ],
      cta: { label: "Solicitar propuesta", href: "/es/custom-pricing" },
    },
    "landing-page": {
      meta: {
        title: "Landing Pages | Noctra Studio",
        description:
          "Landing pages de alta intención para validar, lanzar o captar con foco total en una acción clara.",
      },
      eyebrow: "Captación enfocada",
      title: "Cuando no necesitas un sitio completo, una landing bien pensada puede mover mucho más.",
      intro:
        "Ideal para campañas, anuncios, lanzamientos y pruebas de mensaje donde lo importante es generar acción rápida y aprender qué resuena.",
      fit: [
        "Lanzamientos de servicios o productos",
        "Campañas de pauta y generación de leads",
        "Validación de una nueva oferta",
      ],
      includes: [
        "Narrativa de una sola acción",
        "Diseño orientado a conversión",
        "Tracking y estructura medible",
        "SEO/GEO básico cuando aplica",
        "Conexión con formularios o herramientas de seguimiento",
      ],
      outcomes: [
        "Captación más limpia",
        "Mejor lectura de mensaje y oferta",
        "Una puerta de entrada rápida para proyectos más grandes",
      ],
      cta: { label: "Hablar del proyecto", href: "/es/contact" },
    },
    optimization: {
      meta: {
        title: "SEO + GEO + Autoridad Digital | Noctra Studio",
        description:
          "Visibilidad técnica, local y semántica para que tu negocio aparezca mejor en buscadores, mapas y experiencias asistidas por IA.",
      },
      eyebrow: "Visibilidad útil",
      title: "No basta con estar indexado. Tu negocio necesita ser fácil de encontrar y fácil de entender.",
      intro:
        "Trabajamos SEO técnico, SEO local, arquitectura de contenidos y preparación para entornos asistidos por IA para construir autoridad sostenible, no solo checklists.",
      fit: [
        "Negocios locales o regionales que dependen de búsquedas con intención",
        "Firmas especializadas que necesitan construir autoridad temática",
        "Marcas que quieren preparar su presencia para AI discovery y GEO",
      ],
      includes: [
        "Auditoría técnica y de rendimiento",
        "SEO local y estructura para mapas",
        "Arquitectura de contenidos y autoridad temática",
        "Optimización semántica para rich results y AI discovery",
        "Prioridades claras de mejora continua",
      ],
      outcomes: [
        "Más claridad para buscadores y asistentes",
        "Mayor presencia en búsquedas con intención real",
        "Una base de autoridad digital más sostenible",
      ],
      cta: { label: "Evaluar visibilidad", href: "/es/contact" },
    },
    ecommerce: {
      meta: {
        title: "E-commerce | Noctra Studio",
        description:
          "Tiendas en línea diseñadas para vender mejor, facilitar la compra y sostener crecimiento sin fricción innecesaria.",
      },
      eyebrow: "Venta online con criterio",
      title: "Una tienda debe hacer fácil confiar, comprar y volver.",
      intro:
        "Diseñamos e-commerce para que el catálogo sea claro, el checkout sea directo y la operación tenga una base lista para crecer.",
      fit: [
        "Tiendas que necesitan mejorar experiencia de compra",
        "Marcas que quieren lanzar o reestructurar catálogo",
        "Negocios con operación digital que ya superó soluciones improvisadas",
      ],
      includes: [
        "Arquitectura de catálogo y producto",
        "Diseño de flujo de compra",
        "Integraciones base de pago y operación",
        "SEO para categorías y productos",
        "Recuperación y seguimiento donde aplique",
      ],
      outcomes: [
        "Menos fricción para comprar",
        "Mejor legibilidad comercial del catálogo",
        "Una tienda más fácil de evolucionar",
      ],
      cta: { label: "Cotizar e-commerce", href: "/es/custom-pricing" },
    },
    "custom-systems": {
      meta: {
        title: "Sistemas a la Medida | Noctra Studio",
        description:
          "Herramientas internas, automatización y flujos comerciales para negocios cuyo cuello de botella ya está en la operación.",
      },
      eyebrow: "Operación más ordenada",
      title: "Cuando el problema ya no es la presencia, sino el caos operativo, construimos el sistema que falta.",
      intro:
        "Creamos herramientas internas, paneles y automatizaciones para captación, seguimiento y gestión cuando las operaciones ya no caben bien en hojas sueltas o procesos manuales.",
      fit: [
        "Equipos comerciales con seguimiento inconsistente",
        "Negocios de servicios con procesos repetitivos",
        "Operaciones que perdieron visibilidad entre canales y herramientas",
      ],
      includes: [
        "Mapeo de proceso actual",
        "Diseño de flujo y sistema",
        "Automatizaciones puntuales",
        "Interfaces internas o paneles",
        "Entrega documentada y portable",
      ],
      outcomes: [
        "Menos trabajo manual",
        "Mejor seguimiento comercial y operativo",
        "Más capacidad para crecer sin desordenar todo",
      ],
      cta: { label: "Explorar solución", href: "/es/contact" },
    },
  },
  work: {
    meta: {
      title: "Resultados | Noctra Studio",
      description:
        "Selección de proyectos y snapshots de trabajo donde la claridad, la estructura y la conversión fueron la prioridad.",
    },
    intro:
      "No publicamos resultados inflados. Preferimos mostrar el tipo de problemas que resolvemos, cómo los abordamos y qué cambió en la experiencia del negocio después de ordenar la base digital.",
    cases: [
      {
        name: "Firma legal especializada",
        sector: "Servicios profesionales",
        challenge:
          "Su web se sentía genérica, el mensaje era ambiguo y las consultas llegaban mal calificadas.",
        work: [
          "Redefinición de narrativa y jerarquía de servicios",
          "Sitio orientado a confianza y decisión rápida",
          "SEO local y estructura para áreas de práctica",
        ],
        outcome:
          "La firma logró una presencia más sólida, consultas mejor contextualizadas y una experiencia comercial más ordenada.",
      },
      {
        name: "Clínica privada en expansión",
        sector: "Salud",
        challenge:
          "Había desorden entre información, especialidades y seguimiento a pacientes interesados.",
        work: [
          "Arquitectura web enfocada en especialidades y confianza",
          "Optimización local y flujos de contacto",
          "Automatización ligera para seguimiento inicial",
        ],
        outcome:
          "La clínica ganó claridad para pacientes nuevos y una operación más estable alrededor de la captación.",
      },
      {
        name: "Marca de producto premium",
        sector: "Retail / e-commerce",
        challenge:
          "El catálogo se veía atractivo, pero la experiencia de compra seguía dejando dudas antes del checkout.",
        work: [
          "Reestructuración de fichas y flujo de compra",
          "Claridad de propuesta y narrativa visual",
          "Base SEO para categorías clave",
        ],
        outcome:
          "La tienda quedó mejor preparada para escalar catálogo, campañas y una experiencia de compra más simple.",
      },
    ],
    note:
      "Si tu proyecto requiere referencias más cercanas a tu industria, lo vemos en la llamada inicial y te mostramos material relevante según el contexto.",
  },
  contact: {
    meta: {
      title: "Contacto | Noctra Studio",
      description:
        "Cuéntanos qué necesitas desbloquear: marca, web, SEO/GEO, automatización o una mezcla de todo lo anterior.",
    },
    intro:
      "La primera conversación sirve para entender qué está frenando el crecimiento: mensaje, sitio, visibilidad, captación o estructura interna. Si vemos fit, proponemos una ruta clara.",
    checklist: [
      "Respondemos con criterio, no con una cotización genérica.",
      "Te diremos si el problema principal es marca, web, SEO/GEO u operación.",
      "Si no es fit, te lo diremos con honestidad.",
    ],
    form: {
      name: "Nombre",
      email: "Correo",
      company: "Negocio o proyecto",
      stage: "Etapa actual",
      challenge: "¿Qué necesitas desbloquear?",
      submit: "Enviar solicitud",
      successTitle: "Solicitud recibida",
      successBody:
        "Gracias. Revisaremos el contexto y te responderemos lo antes posible.",
      errorTitle: "No pudimos enviar tu solicitud",
      errorBody:
        "Intenta de nuevo en unos minutos o escríbenos directamente si el problema continúa.",
    },
  },
  blog: {
    meta: {
      title: "Insights | Noctra Studio",
      description:
        "Contenido práctico sobre branding, websites, SEO/GEO y crecimiento digital con criterio.",
    },
    intro:
      "Usamos el blog para explicar decisiones que ayudan a un negocio a verse más sólido, captar mejor y crecer sin improvisación digital.",
    posts: [
      {
        category: "Branding",
        title: "Qué hace que una marca se vea confiable online",
        summary:
          "Más allá del logo: jerarquía, lenguaje, coherencia y señales que ayudan a que una empresa se sienta seria desde el primer vistazo.",
      },
      {
        category: "SEO / GEO",
        title: "Cómo prepararte para búsquedas asistidas por IA sin perseguir hype",
        summary:
          "Qué sí importa para que buscadores y asistentes entiendan mejor tu marca: estructura, autoridad y contexto.",
      },
      {
        category: "Web",
        title: "La diferencia entre un sitio bonito y uno que realmente ayuda a vender",
        summary:
          "Diseño, claridad y fricción comercial: por qué muchos sitios fallan aunque se vean bien.",
      },
    ],
  },
  guarantee: {
    meta: {
      title: "Garantía | Noctra Studio",
      description:
        "Trabajamos con objetivos definidos y riesgo compartido cuando el proyecto lo amerita y los KPIs son medibles.",
    },
    intro:
      "No ofrecemos una garantía vacía. Cuando el proyecto y los indicadores lo permiten, definimos objetivos claros por escrito y una lógica de responsabilidad compartida.",
    principles: [
      {
        title: "Objetivos definidos antes de construir",
        description:
          "La garantía solo tiene sentido cuando acordamos qué se busca mejorar y qué factores están dentro del alcance del proyecto.",
      },
      {
        title: "Medición contextual, no arbitraria",
        description:
          "No prometemos milagros universales. Evaluamos mejoras según la etapa del negocio, la calidad de la oferta y el tipo de proyecto.",
      },
      {
        title: "Riesgo compartido cuando es razonable",
        description:
          "Si el alcance y los KPIs acordados no se cumplen por causas atribuibles a nuestra ejecución, activamos trabajo correctivo o compensación proporcional.",
      },
    ],
    conditions: [
      "Los KPIs se definen antes del inicio y quedan documentados.",
      "La garantía aplica solo cuando el cliente implementa insumos, accesos y aprobaciones en tiempo razonable.",
      "Tráfico, pauta o variables externas no se prometen como si fueran control total del proyecto.",
      "Cuando la garantía aplica, su forma exacta se detalla en la propuesta y contrato.",
    ],
  },
  technology: {
    meta: {
      title: "Tecnología | Noctra Studio",
      description:
        "Explicamos la tecnología en términos de negocio: rendimiento, claridad operativa, portabilidad y menos dependencia frágil.",
    },
    intro:
      "La tecnología no debería sentirse como un acto de fe. Elegimos stack moderno cuando eso significa mejor rendimiento, menos fragilidad y más capacidad de evolución para tu negocio.",
    comparisons: [
      {
        title: "Menos dependencia de plugins",
        description:
          "Una base más limpia reduce fragilidad, mantenimiento innecesario y problemas que aparecen cuando cada mejora depende de capas externas.",
      },
      {
        title: "Mejor rendimiento desde el inicio",
        description:
          "La velocidad importa porque afecta experiencia, confianza, SEO/GEO y la disposición del usuario a seguir avanzando.",
      },
      {
        title: "Portabilidad real",
        description:
          "Trabajamos para que tu negocio pueda evolucionar con libertad, no para encerrarte en una configuración difícil de migrar.",
      },
    ],
    faqs: [
      {
        question: "¿Necesito entender el stack para contratar a Noctra?",
        answer:
          "No. Nuestro trabajo es traducir decisiones técnicas a impacto de negocio: más claridad, mejor experiencia y una base menos frágil.",
      },
      {
        question: "¿Qué pasa si después quiero trabajar con otro equipo?",
        answer:
          "Diseñamos proyectos portables y documentados. La idea es que tu negocio conserve libertad de evolución.",
      },
      {
        question: "¿Usan tecnología moderna por moda?",
        answer:
          "No. La usamos cuando mejora rendimiento, mantenimiento y capacidad de crecimiento. Si algo más simple conviene, también te lo diremos.",
      },
    ],
  },
  pricing: {
    meta: {
      title: "Precios Personalizados | Noctra Studio",
      description:
        "Rangos orientativos y cotización personalizada según el punto de partida, complejidad y sistema que tu negocio necesita.",
    },
    intro:
      "No usamos una tarifa única porque no todos los negocios necesitan lo mismo. Sí damos anclas para que puedas entender qué tipo de inversión corresponde a cada etapa.",
    tiers: [
      {
        name: "Base clara",
        range: "Desde proyecto de entrada",
        fit: "Para marcas que necesitan mensaje, presencia y estructura profesional básica.",
        includes: [
          "Revisión de posicionamiento",
          "Sitio o landing inicial",
          "SEO/GEO base",
        ],
      },
      {
        name: "Crecimiento ordenado",
        range: "Proyecto medio",
        fit: "Para negocios que ya venden, pero necesitan verse más sólidos y captar mejor.",
        includes: [
          "Reestructura de mensaje",
          "Website completo",
          "SEO/GEO más estratégico",
          "Flujos de captación",
        ],
      },
      {
        name: "Sistema completo",
        range: "Proyecto a medida",
        fit: "Para equipos que necesitan marca, web, visibilidad y operación integradas.",
        includes: [
          "Arquitectura integral",
          "Automatización o sistema interno",
          "Continuidad y evolución",
        ],
      },
    ],
    note:
      "En la llamada inicial aterrizamos el punto real del negocio para proponer solo lo que hace falta en esta etapa, no el paquete más grande por default.",
  },
  firstClients: {
    meta: {
      title: "Oferta Primeros Clientes | Noctra Studio",
      description:
        "Programa limitado para marcas que quieren construir su base digital con Noctra en una etapa fundacional.",
    },
    intro:
      "Abrimos espacios limitados para proyectos fundacionales cuando queremos probar una nueva oferta, proceso o vertical con máxima cercanía. No es descuento por urgencia; es colaboración estratégica en etapa temprana.",
    benefits: [
      "Más cercanía con el equipo fundador",
      "Mayor profundidad de diagnóstico",
      "Condiciones preferentes para clientes con alto fit estratégico",
    ],
    conditions: [
      "Disponibilidad limitada por trimestre",
      "Aplica solo a proyectos con alto potencial de colaboración",
      "Se evalúa según fit, etapa y claridad del reto",
    ],
    cta: { label: "Aplicar al programa", href: "/es/contact" },
  },
  careers: {
    meta: {
      title: "Talento | Noctra Studio",
      description:
        "Red curada de colaboradores para proyectos de branding, web, SEO/GEO y sistemas digitales.",
    },
    intro:
      "Trabajamos con una red pequeña de especialistas cuando un proyecto necesita profundidad puntual. Buscamos criterio, claridad y confiabilidad.",
    roles: [
      {
        title: "Brand designers",
        description:
          "Diseño de identidad y sistemas visuales para marcas que necesitan claridad premium, no ruido visual.",
      },
      {
        title: "Copy y contenido",
        description:
          "Especialistas capaces de convertir complejidad en mensajes claros que sí ayuden a vender y posicionar.",
      },
      {
        title: "SEO / contenido estructural",
        description:
          "Perfiles con criterio para SEO local, arquitectura editorial y autoridad temática sostenida.",
      },
    ],
  },
};

const en: LocaleContent = {
  brand: "Noctra Studio",
  siteMeta: {
    title: "Noctra Studio | Branding, websites, SEO/GEO and automation for structured growth",
    description:
      "We help businesses build a digital presence that feels clear, credible and ready to scale through branding, websites, SEO/GEO and automation.",
  },
  nav: {
    links: [
      { label: "Studio", href: "/en/about" },
      { label: "Services", href: "/en/services" },
      { label: "Work", href: "/en/work" },
      { label: "Insights", href: "/en/blog" },
    ],
    primary: { label: "Book a diagnosis", href: "/en/contact" },
    secondary: { label: "Request a proposal", href: "/en/custom-pricing" },
  },
  footer: {
    tagline:
      "Branding, websites, SEO/GEO and automation for businesses that need to look stronger and grow without improvising their digital presence.",
    columns: [
      {
        title: "Explore",
        links: [
          { label: "Home", href: "/en" },
          { label: "Services", href: "/en/services" },
          { label: "Work", href: "/en/work" },
          { label: "Contact", href: "/en/contact" },
        ],
      },
      {
        title: "Trust",
        links: [
          { label: "Studio", href: "/en/about" },
          { label: "Guarantee", href: "/en/guarantee" },
          { label: "Technology", href: "/en/technology-explained" },
          { label: "Pricing", href: "/en/custom-pricing" },
        ],
      },
    ],
  },
  home: {
    meta: {
      title: "Noctra Studio | Look stronger, rank better and convert with less friction",
      description:
        "We build the digital foundation that helps your business feel credible, get found more easily and scale with more structure.",
    },
    hero: {
      eyebrow: "Branding + websites + SEO/GEO + automation",
      title:
        "Make your business look serious, get found where buyers search and convert with less friction.",
      subtitle:
        "Noctra builds the digital foundation businesses need to communicate clearly, earn trust and grow with more structure.",
      primary: { label: "Book a diagnosis", href: "/en/contact" },
      secondary: { label: "See services", href: "/en/services" },
      trust: [
        "Clearer messaging and stronger perception",
        "SEO/GEO and digital authority for sustainable visibility",
        "Systems and automation for calmer growth",
      ],
    },
    pillars: [
      {
        title: "Brand clarity",
        description:
          "We shape the message and visual logic that helps people understand your business quickly and trust it sooner.",
      },
      {
        title: "Websites that convert",
        description:
          "We design websites and landing pages that explain better, filter interest better and guide users toward the right next step.",
      },
      {
        title: "SEO/GEO and digital authority",
        description:
          "We prepare your presence for search engines, maps and AI-assisted discovery, not just technical audits.",
      },
      {
        title: "Useful automation",
        description:
          "We reduce repetitive friction around lead capture, follow-up and operations so growth does not depend on constant manual effort.",
      },
    ],
    stages: [
      {
        title: "If you are just starting",
        description:
          "We help you launch with a professional base: identity, website and narrative built to create trust early.",
        support: "Ideal for consultants, local businesses and new brands.",
      },
      {
        title: "If you already sell but look misaligned",
        description:
          "We realign message, website and visibility so your presence stops feeling like an earlier version of the business.",
        support: "Ideal for service firms, growing SMEs and teams with outdated digital foundations.",
      },
      {
        title: "If you already grew and need structure",
        description:
          "We connect brand, demand, SEO/GEO and systems so scaling does not mean rebuilding everything every few months.",
        support: "Ideal for startups, internal teams and multi-service businesses.",
      },
    ],
    servicesIntro: {
      eyebrow: "What we build",
      title: "We do not sell disconnected deliverables. We design the full digital base.",
      description:
        "Every decision supports a single goal: help the market understand faster, trust faster and move with less friction.",
      cards: [
        {
          slug: "professional-websites",
          title: "Professional websites",
          description:
            "Premium web presence for businesses that need to look aligned with the level of work they already deliver.",
          outcome: "More clarity, more trust and stronger commercial conversations.",
        },
        {
          slug: "landing-page",
          title: "Landing pages",
          description:
            "Focused pages for campaigns, launches and offer validation when one action matters most.",
          outcome: "Cleaner lead capture and faster message learning.",
        },
        {
          slug: "optimization",
          title: "SEO/GEO and optimization",
          description:
            "Technical, local and semantic visibility that helps your brand get found and understood more consistently.",
          outcome: "More useful visibility and stronger digital authority.",
        },
        {
          slug: "ecommerce",
          title: "E-commerce",
          description:
            "Online stores designed to sell, simplify purchase decisions and support growth without unnecessary friction.",
          outcome: "A cleaner buying journey and stronger sales structure.",
        },
        {
          slug: "custom-systems",
          title: "Custom systems",
          description:
            "Internal tools and automations for teams whose bottleneck is no longer the website but the way work flows.",
          outcome: "More time recovered and calmer operations.",
        },
      ],
    },
    process: [
      {
        title: "Diagnosis",
        description:
          "We start by understanding stage, offer, friction and opportunity. Without that, branding and SEO become decoration.",
      },
      {
        title: "Foundation",
        description:
          "We align message, priorities and structure before building so the digital system makes business sense.",
      },
      {
        title: "Implementation",
        description:
          "We execute branding, website, SEO/GEO and automation as one connected system instead of isolated tasks.",
      },
      {
        title: "Continuity",
        description:
          "We refine, measure and strengthen the system so growth does not stop the day the site launches.",
      },
    ],
    proof: [
      {
        title: "Grounded promises",
        description:
          "We talk about clarity, visibility and conversion because businesses can actually feel those changes in demand and operations.",
      },
      {
        title: "No fragile dependency",
        description:
          "We build systems your business can sustain and evolve instead of presence that traps you in brittle decisions.",
      },
      {
        title: "Care over volume",
        description:
          "We keep a limited project load so thinking, execution and response quality stay sharp.",
      },
    ],
    finalCta: {
      title: "If your business is done improvising its digital presence, this is the next step.",
      description:
        "The first conversation helps us identify whether the real problem is brand, website, visibility, lead capture or internal structure.",
      primary: { label: "Book a diagnosis", href: "/en/contact" },
      secondary: { label: "See work", href: "/en/work" },
    },
  },
  about: {
    meta: {
      title: "Studio | Noctra Studio",
      description:
        "Learn how Noctra combines strategy, design and implementation to build digital systems that feel clear, credible and ready to evolve.",
    },
    intro:
      "Noctra exists for businesses that already do strong work but whose digital presence still fails to communicate that level of rigor. We care about clarity, structure and decisions that improve how a company is perceived, found and scaled.",
    principles: [
      {
        title: "Design should improve understanding",
        description:
          "We do not design for decoration. We design so your offer becomes easier to understand, trust and act on.",
      },
      {
        title: "Technology should reduce friction",
        description:
          "We choose architecture that supports speed, portability and sustainable growth instead of fragile convenience.",
      },
      {
        title: "Strategy should land in reality",
        description:
          "We translate brand, SEO/GEO and automation decisions into systems the business can actually use.",
      },
    ],
    beliefs: [
      "Branding without commercial clarity does not sustain growth.",
      "A fast website without the right message still loses opportunities.",
      "Technical SEO without authority and content depth stays shallow.",
      "Automation without judgment only accelerates mess.",
    ],
    differentiators: [
      {
        title: "System thinking",
        description:
          "We connect brand, visibility, conversion and operations instead of optimizing each one in isolation.",
      },
      {
        title: "Business language",
        description:
          "We explain technical and strategic choices in terms of trust, demand, continuity and scale.",
      },
      {
        title: "Deliberate execution",
        description:
          "We would rather build a sharper, calmer and more durable system than a louder promise that ages badly.",
      },
    ],
  },
  services: {
    meta: {
      title: "Services | Noctra Studio",
      description:
        "Branding, websites, SEO/GEO, e-commerce and custom systems for businesses that need a stronger digital base.",
    },
    intro:
      "Our services are strategic decisions, not disconnected packages. The goal is not to hand you pieces. It is to build the digital base your business needs now and can sustain later.",
    cards: es.services.cards,
    continuity: {
      title: "Ongoing digital management",
      description:
        "After launch, we can stay involved as a growth partner for SEO/GEO, website improvements, content authority and system evolution.",
      items: [
        "Maintenance and iterative improvements",
        "SEO/GEO and authority-building content",
        "Conversion and UX refinements",
        "Integration and automation updates",
      ],
    },
  },
  serviceDetails: es.serviceDetails,
  work: {
    meta: {
      title: "Work | Noctra Studio",
      description:
        "A selection of projects and snapshots where clarity, authority and conversion mattered more than visual noise.",
    },
    intro:
      "We do not publish inflated claims. We prefer showing the kinds of business problems we solve, how we approach them and what changed once the digital base became clearer and more structured.",
    cases: es.work.cases,
    note:
      "If your industry needs more specific references, we can share relevant material during the first conversation.",
  },
  contact: {
    meta: {
      title: "Contact | Noctra Studio",
      description:
        "Tell us what needs to be unlocked: brand clarity, website, SEO/GEO, automation or a combination of all of them.",
    },
    intro:
      "The first conversation is about finding the real bottleneck: message, website, visibility, lead flow or internal structure. If there is fit, we propose a clear path.",
    checklist: [
      "We reply with judgment, not a generic quote.",
      "We will tell you if the main issue is brand, website, SEO/GEO or operations.",
      "If there is no fit, we will say so honestly.",
    ],
    form: {
      name: "Name",
      email: "Email",
      company: "Business or project",
      stage: "Current stage",
      challenge: "What do you need to unlock?",
      submit: "Send request",
      successTitle: "Request received",
      successBody: "Thanks. We will review the context and reply as soon as possible.",
      errorTitle: "We could not send your request",
      errorBody:
        "Please try again in a few minutes. If the issue continues, contact us directly.",
    },
  },
  blog: {
    meta: {
      title: "Insights | Noctra Studio",
      description:
        "Practical thinking on branding, websites, SEO/GEO and digital growth for businesses that want structure, not noise.",
    },
    intro:
      "We use the blog to explain decisions that help businesses look more credible, capture better opportunities and grow without digital improvisation.",
    posts: [
      {
        category: "Branding",
        title: "What makes a brand feel credible online",
        summary:
          "Beyond the logo: hierarchy, language and coherence that help a business feel serious at first glance.",
      },
      {
        category: "SEO / GEO",
        title: "How to prepare for AI-assisted discovery without chasing hype",
        summary:
          "What actually matters when you want search engines and assistants to understand your business better.",
      },
      {
        category: "Web",
        title: "The difference between a nice website and one that actually helps sell",
        summary:
          "Why aesthetics alone do not reduce friction or move serious buyers forward.",
      },
    ],
  },
  guarantee: {
    meta: {
      title: "Guarantee | Noctra Studio",
      description:
        "We work with defined goals and shared-risk frameworks when the project scope and KPIs make them meaningful.",
    },
    intro:
      "We do not offer a vague guarantee. When the project and the metrics allow it, we define goals in writing and establish a shared-responsibility model around them.",
    principles: [
      {
        title: "Goals are defined before delivery",
        description:
          "A guarantee only matters if success is described clearly before the work starts.",
      },
      {
        title: "Measurement is contextual",
        description:
          "We do not promise universal miracles. We evaluate improvement based on stage, offer quality and the nature of the project.",
      },
      {
        title: "Shared risk when it is reasonable",
        description:
          "If agreed KPIs are not met for reasons attributable to our execution, we activate corrective work or proportional compensation.",
      },
    ],
    conditions: [
      "KPIs are defined before kickoff and documented in the proposal.",
      "The client must provide approvals, inputs and access in a reasonable timeframe.",
      "External demand variables are not presented as if they were fully under our control.",
      "If a guarantee applies, the exact mechanism is detailed in the contract.",
    ],
  },
  technology: {
    meta: {
      title: "Technology | Noctra Studio",
      description:
        "We explain technology in business terms: performance, portability, operational clarity and less fragile dependency.",
    },
    intro:
      "Technology should not feel like an act of faith. We choose modern foundations when they create better speed, less fragility and more room for the business to evolve.",
    comparisons: [
      {
        title: "Less plugin dependency",
        description:
          "A cleaner foundation means fewer fragile layers and less maintenance overhead.",
      },
      {
        title: "Better performance from the start",
        description:
          "Speed matters because it affects trust, SEO/GEO and a user's willingness to keep moving.",
      },
      {
        title: "Real portability",
        description:
          "We build for long-term flexibility so your business can evolve without being trapped by brittle setup choices.",
      },
    ],
    faqs: [
      {
        question: "Do I need to understand the stack to hire Noctra?",
        answer:
          "No. Our job is to translate technical choices into business impact: more trust, better experience and a more durable foundation.",
      },
      {
        question: "What if I work with another team later?",
        answer:
          "We aim for portable, documented projects so your business retains room to evolve.",
      },
      {
        question: "Do you choose modern tech just because it sounds advanced?",
        answer:
          "No. We use it when it improves performance, maintenance and growth capacity. If something simpler is more appropriate, we will say so.",
      },
    ],
  },
  pricing: {
    meta: {
      title: "Custom Pricing | Noctra Studio",
      description:
        "Reference ranges and custom pricing based on your current stage, complexity and the digital system your business actually needs.",
    },
    intro:
      "We do not use one flat price because not every business needs the same system. We do provide anchors so you can understand the level of investment behind each stage.",
    tiers: [
      {
        name: "Clear base",
        range: "Entry-level project",
        fit: "For businesses that need stronger messaging, presence and a professional digital foundation.",
        includes: ["Positioning review", "Initial site or landing", "Base SEO/GEO"],
      },
      {
        name: "Structured growth",
        range: "Mid-range project",
        fit: "For businesses already selling that need stronger presence and clearer demand capture.",
        includes: [
          "Message restructuring",
          "Full website",
          "Strategic SEO/GEO",
          "Lead flow improvements",
        ],
      },
      {
        name: "Full system",
        range: "Tailored engagement",
        fit: "For teams that need brand, website, visibility and operations connected together.",
        includes: [
          "Integrated architecture",
          "Automation or internal systems",
          "Ongoing evolution",
        ],
      },
    ],
    note:
      "During the first call, we identify the real stage of the business so we only propose what the moment requires.",
  },
  firstClients: {
    meta: {
      title: "Founding Clients | Noctra Studio",
      description:
        "Limited-space program for brands that want to build their digital foundation with Noctra in an early, high-touch collaboration.",
    },
    intro:
      "We occasionally open founding-client spaces when we want to test a sharper offer, process or vertical with maximum closeness. It is not discounting for urgency. It is a strategic early collaboration.",
    benefits: [
      "Closer founder involvement",
      "Deeper diagnosis and tighter collaboration",
      "Preferential conditions for high-fit projects",
    ],
    conditions: [
      "Limited availability each quarter",
      "Reserved for strong strategic fit",
      "Evaluated based on stage, need and clarity of the challenge",
    ],
    cta: { label: "Apply", href: "/en/contact" },
  },
  careers: {
    meta: {
      title: "Careers | Noctra Studio",
      description:
        "Curated collaborator network for branding, web, SEO/GEO and digital systems projects.",
    },
    intro:
      "We work with a small network of specialists when projects need focused depth. We value judgment, clarity and reliability.",
    roles: es.careers.roles,
  },
};

const marketingContent: Record<MarketingLocale, LocaleContent> = {
  es,
  en,
};

export function getMarketingContent(locale: string): LocaleContent {
  return marketingContent[(locale === "en" ? "en" : "es") as MarketingLocale];
}
