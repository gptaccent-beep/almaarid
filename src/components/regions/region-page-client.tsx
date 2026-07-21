'use client';

import {ArrowRight, Sparkles} from 'lucide-react';
import {motion} from 'framer-motion';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {useMemo} from 'react';
import {CooperativeCard} from '@/components/cooperatives/cooperative-card';
import {MediaImage} from '@/components/shared/media-image';
import {useCooperatives, useRegions} from '@/lib/client/api';
import {textFor} from '@/lib/regions';
import {publicSitePath} from '@/lib/routes';
import type {Cooperative, Locale, Region} from '@/lib/types';

type Props = {
  slug: string;
  initialRegion: Region;
  initialCooperatives: Cooperative[];
};

export function RegionPageClient({slug, initialRegion, initialCooperatives}: Props) {
  const t = useTranslations('region');
  const locale = useLocale() as Locale;
  const {data: regions = []} = useRegions([initialRegion]);
  const region = useMemo(() => regions.find((item) => item.slug === slug) || initialRegion, [regions, slug, initialRegion]);
  const {data: cooperatives = [], isLoading: cooperativesLoading} = useCooperatives(region?.id, initialCooperatives);

  return (
    <main className="min-h-screen px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <motion.div
          initial={{opacity: 0, y: 24}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.7}}
          className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-ink text-ivory shadow-lift"
        >
          <MediaImage src={region.image} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/68 to-ink/18" />
          <div className="relative z-10 grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
            <div>
              <Link
                href={publicSitePath(locale)}
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/35 bg-saffron/16 px-4 py-2 text-sm font-semibold text-ivory backdrop-blur transition hover:bg-saffron hover:text-ink"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
                {t('back')}
              </Link>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-saffron">
                {textFor(region.meta.tagline, locale)}
              </p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[0.92] sm:text-7xl">
                {textFor(region.names, locale)}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-ivory/80 sm:text-xl">
                {textFor(region.meta.description, locale)}
              </p>
            </div>
            <div className="grid gap-4 self-end md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-ivory/20 bg-ivory/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-ivory/60">{t('cooperatives')}</p>
                <p className="mt-3 text-4xl font-semibold">{cooperatives.length}</p>
              </div>
              <div className="rounded-[1.5rem] border border-ivory/20 bg-ivory/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-ivory/60">{t('views')}</p>
                <p className="mt-3 text-4xl font-semibold">
                  {cooperatives.reduce((sum, item) => sum + item.viewsCount, 0)}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-ivory/20 bg-ivory/10 p-5 backdrop-blur md:col-span-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-saffron text-ink">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{textFor(region.meta.tagline, locale)}</p>
                    <p className="mt-1 text-xs text-ivory/60">{t('open')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mt-12">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-clay-700 dark:text-saffron">
                {textFor(region.names, locale)}
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold sm:text-5xl">{t('cooperatives')}</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ink/60 dark:text-ivory/60">
              {cooperativesLoading ? t('loading') : t('open')}
            </p>
          </div>

          {cooperatives.length ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {cooperatives.map((cooperative, index) => (
                <CooperativeCard key={cooperative.id} cooperative={cooperative} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-ink/10 bg-ivory p-8 text-center text-ink/60 dark:bg-atlas-950 dark:text-ivory/60">
              {t('empty')}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
