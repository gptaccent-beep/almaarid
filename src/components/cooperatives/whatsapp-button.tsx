'use client';

import Image from 'next/image';
import {whatsappHref} from '@/lib/whatsapp';
import {cn} from '@/lib/utils';

type Props = {
  phone?: string | null;
  label: string;
  className?: string;
  showText?: boolean;
};

export function WhatsAppButton({phone, label, className, showText = false}: Props) {
  const href = whatsappHref(phone);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-[#128c7e]/50 bg-[#075e54] text-sm font-bold text-white shadow-[0_12px_28px_rgba(7,94,84,.3)] transition will-change-transform hover:-translate-y-0.5 hover:bg-[#064c44] active:translate-y-0',
        showText ? 'px-4 py-2' : 'h-11 w-11',
        className
      )}
    >
      <Image src="/icons/whatsapp-icon.svg" alt="" width={22} height={22} className="h-5 w-5" />
      {showText ? <span>{label}</span> : null}
    </a>
  );
}
