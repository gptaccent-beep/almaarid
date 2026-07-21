'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useMemo, useState} from 'react';
import type {Locale} from '@/lib/types';

type Props = {
  children: React.ReactNode;
  locale: Locale;
};

export function AppProviders({children, locale}: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 20_000,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
    localStorage.setItem('almaarid-locale', locale);
    document.cookie = `almaarid_locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;

    const storedTheme = localStorage.getItem('almaarid-theme');
    const theme = storedTheme || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
    document.cookie = `almaarid_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  }, [direction, locale]);

  const value = useMemo(() => queryClient, [queryClient]);

  return <QueryClientProvider client={value}>{children}</QueryClientProvider>;
}
