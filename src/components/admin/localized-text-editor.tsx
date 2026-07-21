'use client';

import {useTranslations} from 'next-intl';
import type {Locale} from '@/lib/types';

type Props = {
  label: string;
  value: Record<Locale, string>;
  onChange: (next: Record<Locale, string>) => void;
  rows?: number;
};

export function LocalizedTextEditor({label, value, onChange, rows = 3}: Props) {
  const t = useTranslations('admin');
  const languages: Array<{key: Locale; label: string}> = [
    {key: 'ar', label: t('arabic')},
    {key: 'fr', label: t('french')},
    {key: 'en', label: t('english')}
  ];

  return (
    <div className="grid gap-3">
      <label className="text-xs font-black uppercase tracking-[0.24em] text-ink/50 dark:text-ivory/50">{label}</label>
      <div className="grid gap-3 md:grid-cols-3">
        {languages.map((language) => (
          <div key={language.key} className="grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-ink/40 dark:text-ivory/40">
              {language.label}
            </span>
            <textarea
              rows={rows}
              value={value[language.key]}
              onChange={(event) => onChange({...value, [language.key]: event.target.value})}
              className="focus-ring w-full rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm leading-7 text-ink shadow-sm outline-none dark:border-white/10 dark:bg-atlas-950 dark:text-ivory"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
