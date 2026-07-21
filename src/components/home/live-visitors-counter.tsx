'use client';

import {Eye} from 'lucide-react';
import {motion, useReducedMotion} from 'framer-motion';
import {useLocale, useTranslations} from 'next-intl';
import {useEffect, useMemo, useState} from 'react';
import type {Locale} from '@/lib/types';
import {cn} from '@/lib/utils';

type Props = {
  min: number;
  max: number;
  className?: string;
};

const DEFAULT_TICK_MS = 3600;
const REDUCED_TICK_MS = 9000;

function clampCount(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getInitialCount(min: number, max: number) {
  return clampCount(Math.round(min + (max - min) * 0.58), min, max);
}

function getNextCount(current: number, min: number, max: number) {
  if (min >= max) return min;

  const span = Math.max(max - min, 1);
  const stepLimit = Math.max(1, Math.min(4, Math.round(span / 18)));
  const step = 1 + Math.floor(Math.random() * stepLimit);
  const center = min + span * 0.54;
  const drift = current < center - span * 0.1 ? 1 : current > center + span * 0.1 ? -1 : Math.random() > 0.5 ? 1 : -1;
  const next = clampCount(current + drift * step, min, max);

  if (next !== current) return next;
  return clampCount(current + (current >= max ? -1 : 1), min, max);
}

export function LiveVisitorsCounter({min, max, className}: Props) {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(() => getInitialCount(min, max));

  useEffect(() => {
    setCount((current) => clampCount(current, min, max));
  }, [min, max]);

  useEffect(() => {
    if (min >= max) return;

    const interval = window.setInterval(() => {
      setCount((current) => getNextCount(current, min, max));
    }, reduceMotion ? REDUCED_TICK_MS : DEFAULT_TICK_MS);

    return () => window.clearInterval(interval);
  }, [min, max, reduceMotion]);

  const formattedCount = useMemo(() => new Intl.NumberFormat(locale).format(count), [count, locale]);

  return (
    <div
      className={cn(
        'inline-flex min-w-[14.5rem] items-center gap-3 rounded-full border border-saffron/24 bg-ivory/76 px-5 py-3 text-base font-bold text-atlas-800 shadow-sm backdrop-blur dark:border-saffron/20 dark:bg-atlas-950/70 dark:text-ivory sm:text-[1.02rem]',
        className
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-saffron/18 text-atlas-800 shadow-[0_0_0_8px_rgb(var(--color-saffron)/0.08)] dark:text-saffron" aria-hidden>
        <Eye className="h-5 w-5" />
      </span>
      <span className="inline-flex items-center gap-2 whitespace-nowrap leading-none">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-atlas-500 shadow-[0_0_0_6px_rgb(var(--color-atlas-500)/0.14)]" aria-hidden />
        <motion.span
          key={formattedCount}
          initial={{opacity: 0, y: 6}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.3, ease: 'easeOut'}}
          className="tabular-nums text-lg sm:text-xl"
        >
          {formattedCount}
        </motion.span>
        {t('onlineNow')}
      </span>
    </div>
  );
}
