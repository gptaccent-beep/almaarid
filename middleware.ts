import createMiddleware from 'next-intl/middleware';
import {NextResponse, type NextRequest} from 'next/server';
import {routing} from '@/i18n/routing';
import {
  ADMIN_SITE_SEGMENT,
  LEGACY_ADMIN_SITE_SEGMENT,
  LEGACY_PUBLIC_SITE_SEGMENT,
  PUBLIC_SITE_SEGMENT
} from '@/lib/routes';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  const normalizedPathname = pathname
    .replace(new RegExp(`/${LEGACY_ADMIN_SITE_SEGMENT}(?=/|$)`, 'g'), `/${ADMIN_SITE_SEGMENT}`)
    .replace(new RegExp(`/${LEGACY_PUBLIC_SITE_SEGMENT}(?=/|$)`, 'g'), `/${PUBLIC_SITE_SEGMENT}`);

  if (normalizedPathname !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = normalizedPathname;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
