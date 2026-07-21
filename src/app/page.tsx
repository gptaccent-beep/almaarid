import {redirect} from 'next/navigation';
import {cookies} from 'next/headers';
import {defaultLocale, isLocale} from '@/lib/regions';
import {publicSitePath} from '@/lib/routes';

export default async function RootPage() {
  const preferredLocale = (await cookies()).get('almaarid_locale')?.value;
  const locale = preferredLocale && isLocale(preferredLocale) ? preferredLocale : defaultLocale;
  redirect(publicSitePath(locale));
}
