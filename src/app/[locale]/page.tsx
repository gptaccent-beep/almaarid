import {redirect} from 'next/navigation';
import {publicSitePath} from '@/lib/routes';
import type {Locale} from '@/lib/types';

type Props = {
  params: Promise<{locale: string}>;
};

export default async function LocaleIndex({params}: Props) {
  const {locale} = await params;
  redirect(publicSitePath(locale as Locale));
}
