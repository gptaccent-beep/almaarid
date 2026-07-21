'use client';

import {ArrowRight, Globe, Heart, Mail, Phone, Eye} from 'lucide-react';
import {motion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {useEffect, useMemo, useRef} from 'react';
import {LikeButton} from '@/components/cooperatives/like-button';
import {WhatsAppButton} from '@/components/cooperatives/whatsapp-button';
import {useCooperative, useIncrementView, useRegions} from '@/lib/client/api';
import {textFor} from '@/lib/regions';
import {publicSitePath} from '@/lib/routes';
import type {Cooperative, Locale, Region} from '@/lib/types';

type Props = {
  id: string;
  initialCooperative: Cooperative;
  initialRegions: Region[];
};

export function CooperativeDetailClient({id, initialCooperative, initialRegions}: Props) {
  const t = useTranslations('detail');
  const regionT = useTranslations('region');
  const locale = useLocale() as Locale;
  const {data: cooperative} = useCooperative(id, initialCooperative);
  const {data: regions = []} = useRegions(initialRegions);
  const region = useMemo(
    () => (cooperative ? regions.find((item) => item.id === cooperative.regionId) : undefined),
    [cooperative, regions]
  );
  const incrementView = useIncrementView(id);
  const viewed = useRef(false);

  useEffect(() => {
    if (cooperative && !viewed.current) {
      viewed.current = true;
      incrementView.mutate();
    }
  }, [cooperative, incrementView]);

  if (!cooperative) {
    return <main className="min-h-screen px-6 pt-28" />;
  }

  return (
    <main className="min-h-screen px-5 pb-20 pt-28 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <Link
          href={region ? publicSitePath(locale, `/region/${region.slug}`) : publicSitePath(locale)}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
          {t('back')}
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{opacity: 0, y: 24}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7}}
            className="overflow-hidden rounded-[2rem] border border-ink/10 bg-ink shadow-lift"
          >
            <div className="relative aspect-[4/3]">
              <Image src={cooperative.identityImage} alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-0 grid place-items-center p-8 text-center text-ivory">
                <div>
                  <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-ivory p-2 shadow-glow">
                    <Image src={cooperative.logo} alt="" width={56} height={56} className="h-14 w-14 object-contain" />
                  </div>
                  <h1 className="font-display text-4xl font-semibold sm:text-6xl">{textFor(cooperative.name, locale)}</h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-ivory/75 sm:text-lg">
                    {textFor(cooperative.story, locale)}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <LikeButton cooperative={cooperative} regionId={cooperative.regionId} />
                    <WhatsAppButton phone={cooperative.contact.phone} label={t('whatsapp')} showText />
                    <span className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-ivory/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                      <Eye className="h-4 w-4" aria-hidden />
                      {cooperative.viewsCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6">
            <motion.section
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.65, delay: 0.12}}
              className="rounded-[1.75rem] border border-ink/10 bg-ivory p-6 shadow-lift dark:bg-atlas-950"
            >
              <h2 className="font-display text-2xl font-semibold">{t('description')}</h2>
              <p className="mt-4 text-sm leading-8 text-ink/70 dark:text-ivory/70">
                {textFor(cooperative.description, locale)}
              </p>
            </motion.section>

            <motion.section
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.65, delay: 0.18}}
              className="rounded-[1.75rem] border border-ink/10 bg-ivory p-6 shadow-lift dark:bg-atlas-950"
            >
              <h2 className="font-display text-2xl font-semibold">{t('contact')}</h2>
              <WhatsAppButton phone={cooperative.contact.phone} label={t('whatsapp')} showText className="mt-4" />
              <dl className="mt-5 grid gap-4 text-sm">
                <Item label={t('phone')} value={cooperative.contact.phone} icon={<Phone className="h-4 w-4" />} />
                <Item
                  label={t('website')}
                  value={cooperative.contact.website}
                  icon={<Globe className="h-4 w-4" />}
                  href={cooperative.contact.website}
                />
                {cooperative.contact.email ? (
                  <Item label={t('email')} value={cooperative.contact.email} icon={<Mail className="h-4 w-4" />} />
                ) : null}
                {cooperative.contact.address ? <Item label={t('address')} value={cooperative.contact.address} /> : null}
              </dl>
            </motion.section>
          </div>
        </div>

        <motion.section
          initial={{opacity: 0, y: 22}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.65, delay: 0.25}}
          className="mt-6 rounded-[1.75rem] border border-ink/10 bg-ivory p-6 shadow-lift dark:bg-atlas-950"
        >
          <h2 className="font-display text-2xl font-semibold">{t('gallery')}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cooperative.productImages.length ? (
              cooperative.productImages.map((src, index) => (
                <div key={`${src}-${index}`} className="relative aspect-square overflow-hidden rounded-[1.2rem]">
                  <Image src={src} alt="" fill sizes="(min-width: 1280px) 25vw, 50vw" className="object-cover" />
                </div>
              ))
            ) : (
              <div className="rounded-[1.2rem] border border-dashed border-ink/10 p-6 text-sm text-ink/60 dark:border-white/10 dark:text-ivory/60">
                {t('gallery')}
              </div>
            )}
          </div>
        </motion.section>

        {region ? (
          <div className="mt-6">
            <Link
              href={publicSitePath(locale, `/region/${region.slug}`)}
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
            >
              <ArrowRight className="h-4 w-4" aria-hidden />
              {regionT('back')}
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function Item({
  label,
  value,
  icon,
  href
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-ink/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-ink/40 dark:text-ivory/40">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium text-ink/75 dark:text-ivory/75">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="underline decoration-saffron/70 underline-offset-4">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
