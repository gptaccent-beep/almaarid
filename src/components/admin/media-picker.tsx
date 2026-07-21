'use client';

import {Image as ImageIcon, Upload} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {MediaImage} from '@/components/shared/media-image';
import {uploadAdminImage} from '@/lib/client/upload';
import {defaultIdentityImage} from '@/lib/regions';

type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
};

export function MediaPicker({label, value, onChange}: Props) {
  const t = useTranslations('admin');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function handleUpload(file: File | null) {
    if (!file) return;
    setBusy(true);
    setMessage('');
    try {
      onChange(await uploadAdminImage(file));
    } catch {
      setMessage(t('uploadFailed'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <label className="text-xs font-black uppercase tracking-[0.24em] text-ink/50 dark:text-ivory/50">{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-ink/10 bg-ink/5 dark:border-white/10 dark:bg-white/5 sm:max-w-44">
          {value ? (
            <MediaImage src={value} fallbackSrc={defaultIdentityImage} alt="" fill sizes="180px" className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-ink/40 dark:text-ivory/40">
              <ImageIcon className="h-8 w-8" aria-hidden />
            </div>
          )}
        </div>
        <label className="focus-ring inline-flex cursor-pointer items-center gap-2 rounded-full border border-saffron bg-saffron px-4 py-2 text-sm font-semibold text-ink shadow-glow">
          <Upload className="h-4 w-4" aria-hidden />
          {busy ? t('uploading') : t('upload')}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleUpload(event.target.files?.[0] || null)}
          />
        </label>
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('uploadPlaceholder')}
        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm dark:border-white/10 dark:bg-atlas-950"
      />
      {message ? <p className="text-xs font-medium text-rose-600 dark:text-rose-300">{message}</p> : null}
    </div>
  );
}
