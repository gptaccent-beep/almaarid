'use client';

import {AnimatePresence, motion} from 'framer-motion';
import Image from 'next/image';
import {useLocale} from 'next-intl';
import {useEffect, useState} from 'react';
import {defaultLogo, textFor} from '@/lib/regions';
import {defaultSiteSettings} from '@/lib/site-settings';
import type {Locale, SiteSettings} from '@/lib/types';

const introStorageKey = 'almaarid-intro-seen';

type Props = {
  initialSettings: SiteSettings;
};

export function IntroSequence({initialSettings}: Props) {
  const locale = useLocale() as Locale;
  const [visible, setVisible] = useState(false);
  const siteName = textFor(initialSettings.name, locale) || textFor(defaultSiteSettings.name, locale);

  useEffect(() => {
    const seen = sessionStorage.getItem(introStorageKey);
    if (!seen) setVisible(true);

    function replay() {
      setVisible(true);
    }

    window.addEventListener('almaarid:replay-intro', replay);
    return () => window.removeEventListener('almaarid:replay-intro', replay);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timer = window.setTimeout(() => {
      sessionStorage.setItem(introStorageKey, 'true');
      setVisible(false);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-ink/92 px-6 text-center text-ivory backdrop-blur-sm"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0, transition: {duration: 0.25, ease: 'easeOut'}}}
        >
          <motion.div
            initial={{opacity: 0, y: 12, scale: 0.98}}
            animate={{opacity: 1, y: 0, scale: 1}}
            transition={{duration: 0.45, ease: 'easeOut'}}
            className="grid place-items-center gap-4 will-change-transform"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ivory p-2 shadow-glow">
              <Image
                src={initialSettings.logo || defaultLogo}
                alt=""
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 object-contain"
              />
            </span>
            <h1 className="font-display text-4xl font-semibold tracking-normal">{siteName}</h1>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
