# Clonar Noctra Ops para un cliente

Checklist rápido cuando dupliques el repo y despliegues una instancia con **dominio y Supabase del cliente**.

## 1. Supabase (proyecto nuevo del cliente)

1. Crear proyecto y ejecutar las migraciones / SQL que usáis internamente (tablas `discovery_*`, `workspace_*`, `proposals`, `contracts`, RLS, Storage bucket `discovery`, etc.).
2. **Authentication → URL configuration**
   - **Site URL**: `https://dominio-del-cliente.com`
   - **Redirect URLs**: el mismo dominio, más `https://*.vercel.app/**` si usáis previews.
3. Crear usuario admin y fila en `workspace_members` si aplica vuestro modelo.

## 2. Vercel

1. Nuevo proyecto → conectar el repo del clon (o el mismo repo con branch dedicado).
2. **Settings → Environment Variables**: copiar desde `.env.example` y rellenar todas las obligatorias.
3. **Domains**: dominio del cliente y certificado TLS.

## 3. Variables imprescindibles

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_APP_URL` | Enlaces públicos de discovery (`/{locale}/f/...`), callbacks de auth. |
| `NEXT_PUBLIC_BRAND_NAME` / `NEXT_PUBLIC_BRAND_SHORT` / `NEXT_PUBLIC_BRAND_URL` | Copy de marketing (sustitución automática), pie de página, emails. |
| `NEXT_PUBLIC_ADMIN_LOGO_PATH` | Logo del panel (archivo en `/public`, ej. `/cliente-logo-white.png`). |
| `NEXT_PUBLIC_SUPABASE_*` + `SUPABASE_SERVICE_ROLE_KEY` | Proyecto del cliente. |
| `FROM_EMAIL` / `TO_EMAIL` | Resend: dominio del cliente verificado en Resend. |
| `ADMIN_EMAIL` | Email permitido en el login admin (vuestro gate actual). |
| `UPSTASH_*` | Rate limit del endpoint de submit. |

## 4. Resend

Verificar dominio de envío del cliente y usar direcciones `FROM_EMAIL` / `TO_EMAIL` reales.

## 5. Post-deploy

1. Crear un formulario de prueba y abrir el link público.
2. Enviar discovery de prueba y confirmar PDF + email.
3. Login admin y flujo propuesta/contrato si los usáis en ese clon.

Los textos de marketing en `src/content/marketing.ts` siguen siendo la plantilla en español/inglés; en build/runtime las cadenas **“Noctra Studio”**, **“Noctra”** y **noctra.studio** se reemplazan por los valores de `NEXT_PUBLIC_BRAND_*` y `NEXT_PUBLIC_BRAND_URL`.
