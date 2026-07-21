'use client';

import {useEffect} from 'react';
import {ErrorState} from '@/components/site/error-state';
import {getBrowserLocale, getErrorCopy} from '@/lib/error-copy';
import {publicSitePath} from '@/lib/routes';

export default function RootError({error, reset}: {error: Error & {digest?: string}; reset: () => void}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const locale = getBrowserLocale();
  const errorCopy = getErrorCopy(locale);

  return (
    <ErrorState
      title={errorCopy.title}
      message={errorCopy.message}
      retryLabel={errorCopy.retry}
      homeLabel={errorCopy.home}
      homeHref={publicSitePath(locale)}
      onRetry={reset}
    />
  );
}
