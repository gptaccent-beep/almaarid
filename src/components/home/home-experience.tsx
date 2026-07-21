'use client';

import {ArrowDown, MapPin} from 'lucide-react';
import {motion, useReducedMotion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {useMemo, useState} from 'react';
import {CooperativeCard} from '@/components/cooperatives/cooperative-card';
import {HeroSlider} from '@/components/home/hero-slider';
import {LiveVisitorsCounter} from '@/components/home/live-visitors-counter';
import {useCooperatives, useSiteSettings} from '@/lib/client/api';
import {textFor} from '@/lib/regions';
import {publicSitePath} from '@/lib/routes';
import {defaultSiteSettings} from '@/lib/site-settings';
import type {Cooperative, Locale, Region, SiteSettings} from '@/lib/types';
import {cn} from '@/lib/utils';

const INITIAL_MORE_COUNT = 6;
const MORE_COUNT_STEP = 6;

type Props = {
  initialRegions: Region[];
  initialCooperatives: Cooperative[];
  initialSettings: SiteSettings;
};

export function HomeExperience({initialRegions, initialCooperatives, initialSettings}: Props) {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;
  const reduceMotion = useReducedMotion();
  const [visibleMoreCount, setVisibleMoreCount] = useState(INITIAL_MORE_COUNT);
  const {data: settings = initialSettings} = useSiteSettings(initialSettings);
  const {data: cooperativeData = initialCooperatives} = useCooperatives(undefined, initialCooperatives);
  const safeSettings = settings ?? initialSettings ?? defaultSiteSettings;
  const siteName = textFor(safeSettings.name, locale) || t('title');
  const homeCopy = safeSettings.content?.home ?? defaultSiteSettings.content.home;
  const regionCards = initialRegions;

  const orderedCooperativeIds = useMemo(() => initialCooperatives.map((cooperative) => cooperative.id), [initialCooperatives]);
  const initialCooperativesById = useMemo(
    () => new Map(initialCooperatives.map((cooperative) => [cooperative.id, cooperative])),
    [initialCooperatives]
  );
  const refreshedCooperativesById = useMemo(
    () => new Map(cooperativeData.map((cooperative) => [cooperative.id, cooperative])),
    [cooperativeData]
  );
  const orderedCooperatives = useMemo(
    () =>
      orderedCooperativeIds
        .map((id) => refreshedCooperativesById.get(id) || initialCooperativesById.get(id))
        .filter((cooperative): cooperative is Cooperative => Boolean(cooperative)),
    [initialCooperativesById, orderedCooperativeIds, refreshedCooperativesById]
  );
  const featuredCooperatives = useMemo(() => orderedCooperatives.slice(0, 3), [orderedCooperatives]);
  const featuredIds = useMemo(() => new Set(featuredCooperatives.map((cooperative) => cooperative.id)), [featuredCooperatives]);
  const moreCooperatives = useMemo(() => orderedCooperatives.filter((cooperative) => !featuredIds.has(cooperative.id)), [featuredIds, orderedCooperatives]);
  const visibleMoreCooperatives = moreCooperatives.slice(0, visibleMoreCount);
  const hasMoreCooperatives = visibleMoreCount < moreCooperatives.length;
  const visitorsRange = homeCopy.visitorsOnline ?? defaultSiteSettings.content.home.visitorsOnline;

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative isolate overflow-hidden px-5 pb-16 pt-24 sm:px-8 lg:px-12 lg:pb-20">
        <Image
          src={safeSettings.content?.intro?.backgroundImage || '/assets/morocco-cinematic-hero.png'}
          alt=""
          fill
          sizes="100vw"
          priority
          className="ambient-hero-picture -z-30 object-cover opacity-[0.24] mix-blend-multiply dark:opacity-[0.2] dark:mix-blend-screen"
        />
        <div className="absolute inset-0 -z-20 bg-zellige opacity-[0.08] zellige-surface" />
        <div className="hero-theme-overlay absolute inset-0 -z-20" />

        <div className="mx-auto max-w-7xl">
          <div className={cn('flex flex-col gap-12 lg:items-center lg:gap-14', locale === 'ar' ? 'lg:flex-row-reverse' : 'lg:flex-row')}>
            <motion.div
              initial={reduceMotion ? {opacity: 0} : {opacity: 0, y: 28}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.72, ease: 'easeOut'}}
              className="hero-copy-scrim w-full lg:max-w-xl"
            >
              <p className="max-w-lg text-xs font-black uppercase tracking-[0.3em] text-clay-700/80 dark:text-saffron/80">
                {textFor(homeCopy.eyebrow, locale) || t('title')}
              </p>
              <p className="mt-4 inline-flex rounded-full border border-clay-500/18 bg-clay-50/88 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-clay-700 shadow-sm backdrop-blur dark:border-saffron/20 dark:bg-white/10 dark:text-saffron">
                {t('welcome')}
              </p>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.92] text-ink sm:text-7xl lg:text-[5.4rem] dark:text-ivory">
                {siteName}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-ink/74 sm:text-lg dark:text-ivory/76">
                {textFor(homeCopy.subtitle, locale) || t('subtitle')}
              </p>

              <div className="mt-6">
                <LiveVisitorsCounter min={visitorsRange.min} max={visitorsRange.max} />
              </div>

              <div className="mt-8 h-px max-w-lg bg-gradient-to-r from-clay-700/35 via-clay-700/10 to-transparent dark:from-saffron/40 dark:via-saffron/14" />

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#regions"
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-3 text-sm font-black text-ink shadow-glow transition-transform duration-300 hover:scale-105 hover:bg-saffron/90"
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                  {t('discoverRegions')}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? {opacity: 0} : {opacity: 0, x: locale === 'ar' ? -28 : 28, y: 18, scale: 0.98}}
              animate={{opacity: 1, x: 0, y: 0, scale: 1}}
              transition={{duration: 0.8, ease: 'easeOut'}}
              className="w-full lg:max-w-[46rem]"
            >
              <div className="hero-slider-shell">
                <HeroSlider
                  images={homeCopy.sliderImages}
                  className="rounded-[1.6rem] shadow-[0_34px_96px_rgba(91,42,28,.25)] dark:shadow-[0_34px_96px_rgba(0,0,0,.55)]"
                />
              </div>
            </motion.div>
          </div>

          {featuredCooperatives.length ? (
            <section className="mt-14">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {featuredCooperatives.map((cooperative, index) => (
                  <CooperativeCard key={cooperative.id} cooperative={cooperative} index={index} />
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href="#cooperatives"
                  className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-6 py-3 text-sm font-black text-ink shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden />
                  {t('moreCooperatives')}
                </a>
              </div>
            </section>
          ) : null}
        </div>
      </section>

      {moreCooperatives.length ? (
        <section id="cooperatives" className="solid-section-gradient relative px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-80px'}}
              transition={{duration: 0.65}}
              className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
            >
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-clay-700 dark:text-saffron">
                  {t('moreCooperatives')}
                </p>
                <h2 className="font-display text-4xl font-semibold sm:text-6xl">{t('cooperativesTitle')}</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-ink/64 dark:text-ivory/64">{t('cooperativesSubtitle')}</p>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visibleMoreCooperatives.map((cooperative, index) => (
                <CooperativeCard key={cooperative.id} cooperative={cooperative} index={index + 3} />
              ))}
            </div>

            {hasMoreCooperatives ? (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleMoreCount((count) => count + MORE_COUNT_STEP)}
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-saffron px-7 py-3 text-sm font-black text-ink shadow-glow transition-transform duration-300 hover:scale-105 hover:bg-saffron/90"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden />
                  {t('loadMore')}
                </button>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section id="regions" className="relative px-5 py-20 sm:px-8 lg:px-12">
        <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-saffron/14 to-transparent dark:from-ink" />
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-80px'}}
            transition={{duration: 0.65}}
            className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
          >
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-clay-700 dark:text-saffron">
                {textFor(homeCopy.chooseRegion, locale) || t('chooseRegion')}
              </p>
              <h2 className="font-display text-4xl font-semibold sm:text-6xl">
                {textFor(homeCopy.scrollTitle, locale) || t('scrollTitle')}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ink/60 dark:text-ivory/60">
              {textFor(homeCopy.scrollSubtitle, locale) || t('scrollSubtitle')}
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {regionCards.map((region, index) => (
              <motion.div
                key={region.id}
                initial={{opacity: 0, y: 28}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true, margin: '-60px'}}
                transition={{duration: 0.55, delay: Math.min(index * 0.04, 0.28)}}
              >
                <Link
                  href={publicSitePath(locale, `/region/${region.slug}`)}
                  className="group relative block min-h-[240px] overflow-hidden rounded-[1.75rem] border border-ink/10 bg-ink text-ivory shadow-lift"
                >
                  <Image
                    src={region.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 opacity-90 mix-blend-multiply"
                    style={{background: `linear-gradient(120deg, rgba(17,20,19,.88), ${region.meta.accent} 72%, rgba(17,20,19,.92))`}}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
                  <div className="relative z-10 flex min-h-[240px] flex-col justify-between p-6">
                    <span className="w-fit rounded-full border border-white/15 bg-ink/55 px-3 py-1 text-xs font-bold text-ivory backdrop-blur">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="max-w-[28rem] rounded-[1.2rem] border border-white/15 bg-ink/64 p-4 text-ivory shadow-[0_18px_50px_rgba(0,0,0,.24)] backdrop-blur-sm transition group-hover:bg-ink/72">
                      <h3 className="font-display text-3xl font-semibold sm:text-4xl">{textFor(region.names, locale)}</h3>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-ivory/88">{textFor(region.meta.tagline, locale)}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
