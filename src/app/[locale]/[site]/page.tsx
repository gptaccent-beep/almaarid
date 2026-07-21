import {notFound, redirect} from 'next/navigation';
import {adminSitePath, publicSitePath} from '@/lib/routes';
import type {Locale} from '@/lib/types';

type Props = {
  params: Promise<{locale: string; site: string}>;
};

export default async function LegacySitePage({params}: Props) {
  const {locale, site} = await params;
  if (site === 'ALMAARID') {
    redirect(publicSitePath(locale as Locale));
  }
  if (site === 'ALMAARID0') {
    redirect(adminSitePath(locale as Locale));
  }

  notFound();
}
