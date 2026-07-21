'use client';

import {Eye, MapPin} from 'lucide-react';
import {motion, useReducedMotion} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {LikeButton} from '@/components/cooperatives/like-button';
import {WhatsAppButton} from '@/components/cooperatives/whatsapp-button';
import {textFor} from '@/lib/regions';
import {publicSitePath} from '@/lib/routes';
import type {Cooperative, Locale} from '@/lib/types';

type Props = {
  cooperative: Cooperative;
  index?: number;
};

export function CooperativeCard({cooperative, index = 0}: Props) {
  const t = useTranslations('region');
  const detailT = useTranslations('detail');
  const locale = useLocale() as Locale;
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={{opacity: 0, y: 24}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, margin: '-40px'}}
      transition={{duration: 0.6, delay: index * 0.045}}
      className="group relative"
    >
      <motion.div
        whileHover={reduceMotion ? undefined : {y: -10, scale: 1.025}}
        transition={{duration: 0.35, ease: 'easeInOut'}}
        className="will-change-transform"
      >
        <motion.div
          animate={reduceMotion ? undefined : {y: [0, -6, 0], scale: [1, 1.006, 1]}}
          transition={{
            duration: 5 + (index % 3) * 0.45,
            delay: (index % 6) * 0.18,
            repeat: reduceMotion ? 0 : Infinity,
            ease: 'easeInOut'
          }}
          className="will-change-transform"
        >
          <div className="isometric-card">
            <div className="relative overflow-hidden rounded-[1.6rem] border border-ink/10 bg-ivory shadow-lift transition-shadow duration-500 group-hover:shadow-[0_30px_90px_rgba(17,20,19,.24)] dark:bg-atlas-950 dark:group-hover:shadow-[0_30px_90px_rgba(0,0,0,.42)]">
              <Link href={publicSitePath(locale, `/cooperative/${cooperative.id}`)} className="relative block aspect-[4/5]">
                <Image
                  src={cooperative.identityImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/28 to-transparent" />
                <div className="card-image-sheen absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-center text-ivory sm:p-5">
                  <div className="mx-auto max-w-[19ch] rounded-[1.1rem] border border-white/14 bg-ink/72 px-4 py-4 shadow-[0_18px_60px_rgba(0,0,0,.26)] backdrop-blur-md transition group-hover:border-white/18 group-hover:bg-ink/82">
                    <h3 className="mx-auto text-balance font-display text-2xl font-semibold leading-tight sm:text-[1.7rem]">
                      {textFor(cooperative.name, locale)}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-ivory/22 bg-ivory/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-ivory shadow-sm">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {t('open')}
                    </div>
                  </div>
                </div>
              </Link>

              <div className="relative z-20 flex items-center justify-between gap-3 border-t border-ink/10 px-4 py-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink/5 p-1 dark:bg-white/5">
                    <Image src={cooperative.logo} alt="" width={42} height={42} className="h-10 w-10 object-contain" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-ink/50 dark:text-ivory/50">{t('views')}</p>
                    <div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-ink/70 dark:text-ivory/70">
                      <Eye className="h-4 w-4" aria-hidden />
                      {cooperative.viewsCount}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <LikeButton cooperative={cooperative} regionId={cooperative.regionId} />
                  <WhatsAppButton phone={cooperative.contact.phone} label={detailT('whatsapp')} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
