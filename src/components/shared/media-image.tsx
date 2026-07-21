'use client';
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import {cn} from '@/lib/utils';

const STATIC_PREFIXES = ['/assets/', '/icons/', '/images/', '/sliders/'];

function isStaticAsset(src: string) {
  return STATIC_PREFIXES.some((prefix) => src.startsWith(prefix));
}

type Props = {
  src?: string | null;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
};

export function MediaImage({
  src,
  fallbackSrc,
  alt = '',
  className,
  fill = false,
  sizes,
  width,
  height,
  priority = false,
  loading
}: Props) {
  const resolvedSrc = (src && src.trim()) || fallbackSrc || '';
  if (!resolvedSrc) return null;

  if (isStaticAsset(resolvedSrc)) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill={fill}
        sizes={sizes}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        className={className}
      />
    );
  }

  const imgClassName = fill ? cn('absolute inset-0 h-full w-full object-cover', className) : className;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading={priority ? 'eager' : loading || 'lazy'}
      decoding="async"
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={imgClassName}
    />
  );
}
