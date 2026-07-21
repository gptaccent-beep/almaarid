import arMessages from '../../messages/ar.json';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';
import type {Locale} from '@/lib/types';

type ErrorCopy = {
  title: string;
  message: string;
  retry: string;
  home: string;
};

const errorCopies: Record<Locale, ErrorCopy> = {
  ar: arMessages.errors,
  fr: frMessages.errors,
  en: enMessages.errors
};

export function getBrowserLocale(fallback: Locale = 'ar'): Locale {
  if (typeof window === 'undefined') return fallback;
  const pathnameLocale = window.location.pathname.split('/')[1];
  if (pathnameLocale === 'ar' || pathnameLocale === 'fr' || pathnameLocale === 'en') return pathnameLocale;

  const documentLocale = document.documentElement.lang;
  if (documentLocale === 'ar' || documentLocale === 'fr' || documentLocale === 'en') return documentLocale;

  return fallback;
}

export function getErrorCopy(locale: Locale) {
  return errorCopies[locale] || errorCopies.ar;
}
