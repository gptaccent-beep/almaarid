import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {isLocale, locales} from '@/lib/regions';
import {AppProviders} from '@/components/providers/app-providers';
import {SITE_WORDMARK} from '@/lib/routes';
import {repository} from '@/lib/server/repository';

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const resolvedLocale = isLocale(locale) ? locale : 'ar';
  const [t, siteSettings] = await Promise.all([
    getTranslations({locale: resolvedLocale, namespace: 'meta'}),
    repository().getSiteSettings()
  ]);

  return {
    title: `${SITE_WORDMARK} | ${t('description')}`,
    description: t('description'),
    icons: {
      icon: siteSettings.logo || '/icons/store-placeholder.svg'
    }
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders locale={locale}>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
