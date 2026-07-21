'use client';

import {Heart} from 'lucide-react';
import {motion, useReducedMotion} from 'framer-motion';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {useToggleLike} from '@/lib/client/api';
import type {Cooperative} from '@/lib/types';
import {cn} from '@/lib/utils';

type Props = {
  cooperative: Cooperative;
  regionId?: string;
};

export function LikeButton({cooperative, regionId}: Props) {
  const t = useTranslations('region');
  const [ready, setReady] = useState(false);
  const [displayLiked, setDisplayLiked] = useState(Boolean(cooperative.liked));
  const [displayCount, setDisplayCount] = useState(cooperative.likesCount);
  const [likeKnown, setLikeKnown] = useState(typeof cooperative.liked === 'boolean');
  const reduceMotion = useReducedMotion();
  const mutation = useToggleLike(cooperative.id, regionId);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    setDisplayLiked(Boolean(cooperative.liked));
    setDisplayCount(cooperative.likesCount);
    setLikeKnown(typeof cooperative.liked === 'boolean');
  }, [cooperative.liked, cooperative.likesCount]);

  const disabled = !ready || !likeKnown || mutation.isPending;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        const previous = {liked: displayLiked, count: displayCount};
        const nextLiked = !displayLiked;
        setDisplayLiked(nextLiked);
        setDisplayCount(Math.max(displayCount + (nextLiked ? 1 : -1), 0));

        mutation.mutate(undefined, {
          onSuccess: (result) => {
            setDisplayLiked(result.liked);
            setDisplayCount(result.likesCount);
            setLikeKnown(true);
          },
          onError: () => {
            setDisplayLiked(previous.liked);
            setDisplayCount(previous.count);
          }
        });
      }}
      whileTap={reduceMotion || disabled ? undefined : {scale: 0.94}}
      className={cn(
        'focus-ring relative z-20 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition will-change-transform',
        disabled && 'cursor-wait opacity-70',
        displayLiked
          ? 'border-saffron bg-saffron text-ink shadow-glow'
          : 'border-saffron/28 bg-saffron/10 text-ink hover:border-saffron hover:bg-saffron/16 hover:text-ink dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron/16'
      )}
      aria-label={`${displayCount} ${t('likes')}`}
    >
      <motion.span
        animate={reduceMotion || !mutation.isPending ? {scale: 1} : {scale: [1, 0.9, 1.08, 1]}}
        transition={{duration: 0.36, repeat: mutation.isPending && !reduceMotion ? Infinity : 0}}
        className="grid place-items-center"
      >
        <Heart className={cn('h-4 w-4', displayLiked && 'fill-current')} aria-hidden />
      </motion.span>
      <span>{displayCount}</span>
      <span className="text-xs uppercase tracking-[0.18em]">{t('likes')}</span>
    </motion.button>
  );
}
