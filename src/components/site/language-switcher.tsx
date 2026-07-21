'use client';

import {Check, Globe2} from 'lucide-react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {startTransition, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {localeLabels, locales} from '@/lib/regions';
import type {Locale} from '@/lib/types';
import {cn} from '@/lib/utils';

type Props = {
  label: string;
};

export function LanguageSwitcher({label}: Props) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      locales.map((item) => ({
        locale: item,
        label: localeLabels[item],
        code: item.toUpperCase()
      })),
    []
  );

  const changeLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) {
        setOpen(false);
        return;
      }

      const direction = nextLocale === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('almaarid-locale', nextLocale);
      document.cookie = `almaarid_locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = nextLocale;
      document.documentElement.dir = direction;

      const nextPath = localizedPath(pathname, nextLocale);
      const hash = window.location.hash;
      setOpen(false);

      startTransition(() => router.replace(`${nextPath}${hash}`));
    },
    [locale, pathname, router]
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || !rootRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[options.findIndex((item) => item.locale === locale)]?.focus();
  }, [locale, open, options]);

  return (
    <div ref={rootRef} className="relative shrink-0" dir="ltr">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          'focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-saffron/24 bg-saffron/10 text-ink shadow-sm transition hover:border-saffron/45 hover:bg-saffron/16 dark:border-saffron/20 dark:bg-saffron/10 dark:text-ivory dark:hover:text-saffron',
          open && 'border-saffron/45 bg-saffron/16 text-clay-700 dark:text-saffron'
        )}
        title={label}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe2 className="h-4 w-4" aria-hidden />
      </button>

      {open ? (
        <div
          className="absolute end-0 top-[calc(100%+0.65rem)] z-50 w-48 overflow-hidden rounded-[1rem] border border-saffron/18 bg-ivory/98 p-1.5 text-ink shadow-[0_24px_60px_rgb(var(--color-ink)/.18)] backdrop-blur-xl dark:border-saffron/16 dark:bg-atlas-950/96 dark:text-ivory"
          role="menu"
          aria-label={label}
        >
          {options.map((option, index) => {
            const active = option.locale === locale;

            return (
              <button
                key={option.locale}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => changeLocale(option.locale)}
                className={cn(
                  'flex w-full items-center justify-between rounded-[0.85rem] px-3 py-2.5 text-sm font-semibold transition',
                  active
                    ? 'bg-saffron/14 text-clay-700 dark:bg-white/10 dark:text-saffron'
                    : 'hover:bg-ink/6 hover:text-clay-700 dark:hover:bg-white/8 dark:hover:text-saffron'
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-ink/42 dark:text-ivory/42">
                    {option.code}
                  </span>
                  <span>{option.label}</span>
                </span>
                {active ? <Check className="h-4 w-4" aria-hidden /> : <span className="h-4 w-4" aria-hidden />}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function localizedPath(pathname: string, locale: Locale) {
  const segments = pathname.split('/');
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = locale;
  } else {
    segments.splice(1, 0, locale);
  }

  return segments.join('/') || `/${locale}`;
}
