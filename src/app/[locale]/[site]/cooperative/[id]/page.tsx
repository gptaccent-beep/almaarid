import {redirect} from 'next/navigation';
import {publicSitePath} from '@/lib/routes';
import type {Locale} from '@/lib/types';

type Props = {
  params: Promise<{locale: string; site: string; id: string}>;
};

export default async function LegacyCooperativePage({params}: Props) {
  const {locale, id} = await params;
  redirect(publicSitePath(locale as Locale, `/cooperative/${id}`));
}
