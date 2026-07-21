import {redirect} from 'next/navigation';
import {publicSitePath} from '@/lib/routes';
import type {Locale} from '@/lib/types';

type Props = {
  params: Promise<{locale: string; site: string; slug: string}>;
};

export default async function LegacyRegionPage({params}: Props) {
  const {locale, slug} = await params;
  redirect(publicSitePath(locale as Locale, `/region/${slug}`));
}
