import type {Locale} from '@/lib/types';

export const PUBLIC_SITE_SEGMENT = 'Almaarid';
export const ADMIN_SITE_SEGMENT = 'Almaarid0';
export const LEGACY_PUBLIC_SITE_SEGMENT = 'ALMAARID';
export const LEGACY_ADMIN_SITE_SEGMENT = 'ALMAARID0';
export const SITE_WORDMARK = 'Almaarid';

export function publicSitePath(locale: Locale, suffix = '') {
  return `/${locale}/${PUBLIC_SITE_SEGMENT}${suffix}`;
}

export function adminSitePath(locale: Locale, suffix = '') {
  return `/${locale}/${ADMIN_SITE_SEGMENT}${suffix}`;
}
