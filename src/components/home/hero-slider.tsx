'use client';

import {ChevronLeft, ChevronRight} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MediaImage} from '@/components/shared/media-image';
import {cn} from '@/lib/utils';

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD_PX = 48;

type Props = {
  images: string[];
  className?: string;
};

export function HeroSlider({images, className}: Props) {
  const t = useTranslations('home');
  const slides = useMemo(() => images.filter(Boolean), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStart = useRef<number | null>(null);
  const canMove = slides.length > 1;

  const goTo = useCallback(
    (index: number) => {
      if (!slides.length) return;
      setActiveIndex((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotionPreference = () => setReducedMotion(media.matches);
    syncMotionPreference();
    media.addEventListener('change', syncMotionPreference);
    return () => media.removeEventListener('change', syncMotionPreference);
  }, []);

  useEffect(() => {
    if (!canMove || paused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [canMove, paused, reducedMotion, slides.length]);

  useEffect(() => {
    if (activeIndex < slides.length) return;
    setActiveIndex(0);
  }, [activeIndex, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className={cn('relative overflow-hidden rounded-[1.6rem] border border-ivory/18 bg-ink shadow-lift', className)}
      aria-label={t('sliderAriaLabel')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={(event) => {
        if (event.pointerType === 'mouse') return;
        touchStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (touchStart.current === null) return;
        const delta = event.clientX - touchStart.current;
        touchStart.current = null;
        if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
        if (delta > 0) previous();
        else next();
      }}
      onPointerCancel={() => {
        touchStart.current = null;
      }}
    >
      <div className="relative aspect-[16/11] min-h-[360px] overflow-hidden rounded-[1.6rem] sm:aspect-[16/10] lg:min-h-[560px]">
        {slides.map((src, index) => (
          <MediaImage
            key={`${src}-${index}`}
            src={src}
            fallbackSrc="/images/morocco-cinematic-hero.png"
            alt=""
            fill
            priority={index === 0}
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="(min-width: 1280px) 72rem, 100vw"
            className={cn(
              'select-none object-cover will-change-transform',
              reducedMotion ? '' : 'transition duration-700 ease-out',
              index === activeIndex ? 'z-10 opacity-100 scale-100' : 'z-0 opacity-0 scale-[1.03]'
            )}
          />
        ))}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-ink/64 via-ink/14 to-transparent" />
        <div className="slider-theme-glow absolute inset-0 z-20" />
        <div className="absolute inset-0 z-20 rounded-[1.6rem] ring-1 ring-white/8" />
      </div>

      {canMove ? (
        <>
          <div className="absolute inset-x-4 top-1/2 z-30 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={previous}
              className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/18 bg-ink/82 text-ivory shadow-[0_18px_44px_rgba(17,20,19,.34)] backdrop-blur transition hover:scale-105 hover:bg-saffron hover:text-ink dark:bg-atlas-950/78"
              aria-label={t('previousSlide')}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={next}
              className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/18 bg-ink/82 text-ivory shadow-[0_18px_44px_rgba(17,20,19,.34)] backdrop-blur transition hover:scale-105 hover:bg-saffron hover:text-ink dark:bg-atlas-950/78"
              aria-label={t('nextSlide')}
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-5 z-30 flex justify-center gap-2">
            {slides.map((src, index) => (
              <button
                key={`dot-${src}-${index}`}
                type="button"
                onClick={() => goTo(index)}
                className={cn(
                  'focus-ring h-3 rounded-full border border-white/70 shadow-[0_0_0_1px_rgba(17,20,19,.08)] transition-all',
                  index === activeIndex ? 'w-10 bg-saffron' : 'w-3 bg-white/50 hover:bg-white'
                )}
                aria-label={t('goToSlide', {number: index + 1})}
                aria-current={index === activeIndex}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
