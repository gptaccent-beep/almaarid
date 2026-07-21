'use client';

import {MapPin, Moon, Sun} from 'lucide-react';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {memo, useCallback, useEffect} from 'react';
import {MediaImage} from '@/components/shared/media-image';
import {LanguageSwitcher} from '@/components/site/language-switcher';
import {useSiteSettings} from '@/lib/client/api';
import {defaultLogo, textFor} from '@/lib/regions';
import {publicSitePath, SITE_WORDMARK} from '@/lib/routes';
import {defaultSiteSettings} from '@/lib/site-settings';
import type {Locale, SiteSettings} from '@/lib/types';
import {cn} from '@/lib/utils';

type Props = {
  initialSettings: SiteSettings;
};

export function Header({initialSettings}: Props) {
  const t = useTranslations('nav');
  const homeT = useTranslations('home');
  const locale = useLocale() as Locale;
  const {data: settings = initialSettings} = useSiteSettings(initialSettings);
  const safeSettings = settings ?? initialSettings ?? defaultSiteSettings;
  const siteName = textFor(safeSettings.name, locale);
  const navCopy = safeSettings.content?.nav ?? defaultSiteSettings.content.nav;
  const homeLabel = textFor(navCopy.home, locale) || t('home');
  const regionsLabel = textFor(navCopy.regions, locale) || t('regions');
  const themeLabel = textFor(navCopy.theme, locale) || t('theme');
  const languageLabel = textFor(navCopy.language, locale) || t('language');
  const pageDescription = useTranslations('meta')('description');
  const homePath = publicSitePath(locale);
  const regionsPath = `${homePath}#regions`;

  useEffect(() => {
    document.title = `${SITE_WORDMARK} | ${pageDescription}`;
  }, [pageDescription]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 py-3 sm:px-5">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-full border border-saffron/20 bg-ivory/95 px-3 py-2 text-ink shadow-lift backdrop-blur-2xl dark:border-saffron/18 dark:bg-atlas-950/90 dark:text-ivory sm:gap-4 sm:px-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Link
          href={homePath}
          className="focus-ring flex min-w-0 flex-1 items-center gap-2 rounded-full px-2 py-1 text-start sm:flex-none"
        >
          <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-ink shadow-glow dark:bg-ivory">
            <MediaImage
              src={safeSettings.logo || defaultLogo}
              alt=""
              width={36}
              height={36}
              className="h-full w-full object-contain p-1.5"
            />
          </span>
          <span className="min-w-0 leading-none">
            <span className="hidden truncate font-display text-base font-semibold tracking-normal sm:block sm:text-lg">{siteName}</span>
            <span className="block truncate text-xs tracking-[0.14em] text-saffron dark:text-saffron">
              {SITE_WORDMARK}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-2 rounded-full border border-saffron/14 bg-ivory/70 px-1.5 py-1 text-sm font-semibold text-ink shadow-sm backdrop-blur dark:border-saffron/14 dark:bg-white/8 dark:text-ivory md:flex lg:gap-3">
          <Link className="focus-ring rounded-full px-4 py-2 text-ink hover:bg-saffron/16 hover:text-ink dark:text-ivory dark:hover:bg-saffron/18 dark:hover:text-ivory" href={homePath}>
            {homeLabel}
          </Link>
          <Link className="focus-ring rounded-full px-4 py-2 text-ink hover:bg-saffron/16 hover:text-ink dark:text-ivory dark:hover:bg-saffron/18 dark:hover:text-ivory" href={regionsPath}>
            {regionsLabel}
          </Link>
        </nav>

        <div className="flex min-w-0 shrink-0 flex-nowrap items-center justify-end gap-2 rounded-full border border-saffron/14 bg-ivory/78 p-1.5 text-ink shadow-sm backdrop-blur dark:border-saffron/14 dark:bg-white/8 dark:text-ivory sm:gap-3">
          <LanguageSwitcher label={languageLabel} />
          <ThemeToggle label={themeLabel} />
          <Link
            href={regionsPath}
            className="focus-ring inline-flex h-10 flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-full bg-saffron px-3 text-sm font-black text-ink shadow-glow transition-transform hover:scale-105 hover:bg-saffron/90 sm:px-4"
            aria-label={homeT('discoverRegions')}
          >
            <MapPin className="h-4 w-4" aria-hidden />
            <span className="hidden xl:inline">{homeT('discoverRegions')}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

const ThemeToggle = memo(function ThemeToggle({label}: {label: string}) {
  const toggleTheme = useCallback(() => {
    const next = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    localStorage.setItem('almaarid-theme', next ? 'dark' : 'light');
    document.cookie = `almaarid_theme=${next ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  return (
    <button
      type="button"
      className="focus-ring relative h-10 w-[4.5rem] rounded-full border border-saffron/24 bg-saffron/14 p-1 text-ink transition-colors hover:bg-saffron/20 dark:border-saffron/20 dark:bg-saffron/12 dark:text-ivory dark:hover:bg-saffron/18"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
    >
      <span className="absolute inset-y-1 start-1 grid h-8 w-8 place-items-center text-ink/70 dark:text-ivory/70">
        <Moon className="h-4 w-4" aria-hidden />
      </span>
      <span className="absolute inset-y-1 end-1 grid h-8 w-8 place-items-center text-ink/70 dark:text-ivory/70">
        <Sun className="h-4 w-4" aria-hidden />
      </span>
      <span
        className={cn(
          'absolute top-1 left-1 h-8 w-8 rounded-full bg-saffron text-ink shadow transition-transform duration-200 dark:translate-x-7'
        )}
      />
    </button>
  );
});
