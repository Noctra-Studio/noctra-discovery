# Noctra Discovery

> Brand discovery platform for Noctra Studio clients. Generate custom discovery forms, collect brand responses, and automatically produce a branded PDF delivered to your inbox.

![Status](https://img.shields.io/badge/status-in%20development-yellow?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-database%20%2B%20auth-3ECF8E?style=flat-square&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-deployed-black?style=flat-square&logo=vercel)

---

## What it does

Noctra Discovery lets you spin up a personalized brand discovery form for each client in under a minute. The client fills it out once — their answers are saved to the database, a PDF is auto-generated and sent to your inbox, and the link is permanently locked to prevent duplicate submissions.

**Admin flow**

1. Log in at `discovery.noctra.studio/admin`
2. Create a new form — add client name, logo, who it's directed to, and language
3. A unique URL is generated: `discovery.noctra.studio/f/{slug}`
4. Share the link with your client

**Client flow**

1. Client opens the link — sees their logo, name, and a personalized greeting
2. Fills out 5 sections covering brand essence, positioning, visual identity, voice, and vision
3. Submits — triggers PDF generation and email delivery
4. Link is permanently marked as completed, preventing resubmission

---

## Stack

| Layer     | Technology                           |
| --------- | ------------------------------------ |
| Framework | Next.js 14 (App Router)              |
| Language  | TypeScript (strict)                  |
| Styling   | TailwindCSS                          |
| Database  | Supabase (PostgreSQL + RLS)          |
| Auth      | Supabase Auth                        |
| Storage   | Supabase Storage                     |
| Email     | Resend                               |
| PDF       | Puppeteer Core + @sparticuz/chromium |
| i18n      | next-intl                            |
| Hosting   | Vercel                               |

---

## Project structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── admin/
│   │   │   ├── login/          # Admin login page
│   │   │   ├── page.tsx        # Dashboard
│   │   │   └── forms/
│   │   │       ├── new/        # Create form
│   │   │       └── [id]/       # Form detail + submission view
│   │   └── f/
│   │       └── [slug]/         # Public client-facing form
│   └── api/
│       ├── submit/             # Handle submission, generate PDF, send email
│       └── check/              # Check if slug is pending/completed/expired
├── components/
│   ├── admin/                  # Dashboard, form builder components
│   ├── form/                   # Client form components
│   └── ui/                     # Shared design system
├── lib/
│   ├── supabase/               # Client, server, middleware helpers
│   ├── resend.ts               # Email helper
│   └── pdf-template.ts         # HTML template for PDF generation
├── messages/
│   ├── es.json                 # Spanish strings
│   └── en.json                 # English strings
└── types/
    └── index.ts                # Shared TypeScript types
```

---

## Database schema

```sql
-- Extends Supabase Auth
profiles
  id uuid (FK auth.users)
  email text
  full_name text
  avatar_url text

-- One per client engagement
discovery_forms
  id uuid
  created_by uuid (FK profiles)
  slug text UNIQUE
  client_name text
  client_logo_url text
  directed_to text
  language text          -- 'es' | 'en'
  status text            -- 'pending' | 'completed'
  form_url text          -- generated: discovery.noctra.studio/f/{slug}
  expires_at timestamptz

-- One per form (enforced UNIQUE on form_id)
discovery_submissions
  id uuid
  form_id uuid (FK discovery_forms) UNIQUE
  language text
  q_what / q_why / q_adjectives ...
  q_perception_rank jsonb
  q_visual_refs jsonb
  q_accent_color text
  q_visual_style jsonb
  q_voice_attrs jsonb
  pdf_url text
  email_sent_at timestamptz
```

Row-level security is enabled on all tables. Clients submit without authentication. Admins read all data belonging to their user ID only.

---

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account with your domain verified
- A [Vercel](https://vercel.com) account

### Local setup

```bash
# Clone the repo
git clone https://github.com/noctra-studio/noctra-discovery.git
cd noctra-discovery

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in the values (see Environment variables section below)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://discovery.noctra.studio
ADMIN_EMAIL=hello@noctra.studio
```

> `SUPABASE_SERVICE_ROLE_KEY` is only used server-side (PDF upload, submission insert). Never expose it to the client.

### Run database migrations

Copy the SQL from `supabase/schema.sql` and run it in your Supabase project's SQL Editor. This creates all tables, RLS policies, and the trigger that auto-creates a profile on signup.

---

## Deployment

The project is deployed on Vercel at `discovery.noctra.studio`.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

The `/api/submit` function requires extended timeout for Puppeteer. This is configured in `vercel.json`:

```json
{
  "functions": {
    "app/api/submit/route.ts": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### DNS setup (Google Domains / Squarespace)

| Type  | Host        | Value                  |
| ----- | ----------- | ---------------------- |
| CNAME | `discovery` | `cname.vercel-dns.com` |

---

## Supported languages

| Code | Language   | Form | PDF |
| ---- | ---------- | ---- | --- |
| `es` | Spanish 🇲🇽 | ✓    | ✓   |
| `en` | English 🇺🇸 | ✓    | ✓   |

The language is set when creating the form in the admin. Both the client-facing form and the generated PDF are rendered in that language, regardless of the client's browser locale.

---

## PDF output

The generated PDF is 4 pages, A4 format, rendered by Puppeteer with full print CSS:

| Page | Content                                                        |
| ---- | -------------------------------------------------------------- |
| 1    | Cover — client name, black background, Noctra Studio watermark |
| 2    | Brand essence + market positioning                             |
| 3    | Visual identity + voice & tone                                 |
| 4    | Vision + closing note                                          |

The PDF is attached to the notification email and stored privately in Supabase Storage. It can be re-downloaded from the admin panel at any time.

---

## Adding a new client

1. Log in to `/admin`
2. Click **+ New Form**
3. Fill in client name, upload their logo, set who it's directed to, choose language
4. Copy the generated URL
5. Send it to the client — done

Each form generates a unique slug from the client name (e.g. `4all` → `discovery.noctra.studio/f/4all`). Slugs are checked for uniqueness before saving.

---

## Built by

**Noctra Studio** — Web development for businesses that care about craft.

[noctra.studio](https://noctra.studio) · [hello@noctra.studio](mailto:hello@noctra.studio)
