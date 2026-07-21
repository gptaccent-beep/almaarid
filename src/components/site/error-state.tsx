'use client';

import {AlertTriangle, Home, RotateCcw} from 'lucide-react';
import Link from 'next/link';

type Props = {
  title: string;
  message: string;
  retryLabel: string;
  homeLabel: string;
  homeHref: string;
  onRetry: () => void;
};

export function ErrorState({title, message, retryLabel, homeLabel, homeHref, onRetry}: Props) {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-24">
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-8 text-center shadow-lift">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300">
          <AlertTriangle className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="font-display text-4xl font-semibold">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-ink/65 dark:text-ivory/65">{message}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="focus-ring inline-flex items-center gap-2 rounded-full bg-saffron px-5 py-3 font-semibold text-ink shadow-glow"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            {retryLabel}
          </button>
          <Link
            href={homeHref}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-5 py-3 font-semibold text-ink transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
          >
            <Home className="h-4 w-4" aria-hidden />
            {homeLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
