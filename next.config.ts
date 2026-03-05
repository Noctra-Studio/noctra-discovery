import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const securityHeaders = [
  // Evita que la página sea embebida en un iframe (anti-clickjacking)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Evita que el browser "adivine" el tipo de contenido
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Controla qué información de referrer se comparte
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Política de permisos del browser (desactiva lo que no usas)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Fuerza HTTPS por 1 año
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Content Security Policy — controla de dónde puede cargar recursos
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // unsafe-inline y unsafe-eval son necesarios para Next.js en dev
      // En producción puedes usar nonces para mayor seguridad
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co https://api.resend.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure Chromium binary is not bundled but traced correctly
  serverExternalPackages: ["@sparticuz/chromium"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
