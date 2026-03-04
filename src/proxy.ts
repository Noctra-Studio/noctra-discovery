import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { Database } from '@/types';

const intlMiddleware = createMiddleware({
  locales: ['es', 'en'],
  defaultLocale: 'es'
});

export async function proxy(request: NextRequest) {
  // 1. Internationalization first
  const response = intlMiddleware(request);

  // 2. Update Supabase session on the intl response
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Admin Auth Guard
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.match(/^\/(es|en)\/admin/);
  const isLoginPage = pathname.match(/^\/(es|en)\/admin\/login/);

  // Not logged in + accessing admin (not login page) → redirect to login
  if (isAdminPath && !isLoginPage && !user) {
    const locale = pathname.match(/^\/(es|en)/)?.[1] || 'es';
    const loginUrl = new URL(`/${locale}/admin/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in + on login page → redirect to admin dashboard
  if (isLoginPage && user) {
    const locale = pathname.match(/^\/(es|en)/)?.[1] || 'es';
    const adminUrl = new URL(`/${locale}/admin`, request.url);
    return NextResponse.redirect(adminUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
