'use client';

import {Facebook, Globe2, Instagram, Mail, MapPin, Phone, Youtube} from 'lucide-react';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {MediaImage} from '@/components/shared/media-image';
import {textFor} from '@/lib/regions';
import {publicSitePath} from '@/lib/routes';
import {defaultSiteSettings} from '@/lib/site-settings';
import type {Locale, SiteSettings} from '@/lib/types';

type Props = {
  settings: SiteSettings;
};

export function Footer({settings}: Props) {
  const t = useTranslations('nav');
  const locale = useLocale() as Locale;
  const footerCopy = settings.content?.footer ?? defaultSiteSettings.content.footer;
  const siteName = textFor(settings.name, locale) || textFor(defaultSiteSettings.name, locale);
  const siteEyebrow = textFor(footerCopy.eyebrow, locale) || siteName;

  return (
    <footer
      id="contact"
      className="mt-16 border-t border-ink/10 bg-ivory/70 px-5 py-10 text-ink dark:border-white/10 dark:bg-atlas-950/60 dark:text-ivory sm:px-8 lg:px-12"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.3fr_0.85fr_0.85fr]">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-ink text-ivory dark:bg-ivory">
              <MediaImage src={settings.logo} alt="" width={40} height={40} className="h-10 w-10 object-contain p-1" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-clay-700 dark:text-saffron">
                {siteEyebrow}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold">{siteName}</h2>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7 text-ink/65 dark:text-ivory/65">
            {textFor(footerCopy.description, locale)}
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
            {textFor(footerCopy.links.home, locale) || t('home')}
          </p>
          <div className="grid gap-2">
            <Link className="focus-ring w-fit rounded-full px-3 py-1 hover:bg-ink/8 dark:hover:bg-white/10" href={publicSitePath(locale)}>
              {textFor(footerCopy.links.home, locale) || t('home')}
            </Link>
            <a className="focus-ring w-fit rounded-full px-3 py-1 hover:bg-ink/8 dark:hover:bg-white/10" href={`${publicSitePath(locale)}#regions`}>
              {textFor(footerCopy.links.regions, locale) || t('regions')}
            </a>
            <a className="focus-ring w-fit rounded-full px-3 py-1 hover:bg-ink/8 dark:hover:bg-white/10" href="#contact">
              {textFor(footerCopy.links.contact, locale)}
            </a>
          </div>

        </div>

        <div className="grid gap-4 text-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
            {textFor(footerCopy.contact.title, locale)}
          </p>
          <div className="grid gap-3 text-ink/70 dark:text-ivory/70">
            {footerCopy.contact.phone ? (
              <a className="inline-flex items-center gap-2 hover:text-ink dark:hover:text-ivory" href={`tel:${footerCopy.contact.phone}`}>
                <Phone className="h-4 w-4" aria-hidden />
                {footerCopy.contact.phone}
              </a>
            ) : null}
            {footerCopy.contact.email ? (
              <a className="inline-flex items-center gap-2 hover:text-ink dark:hover:text-ivory" href={`mailto:${footerCopy.contact.email}`}>
                <Mail className="h-4 w-4" aria-hidden />
                {footerCopy.contact.email}
              </a>
            ) : null}
            {footerCopy.contact.website ? (
              <a className="inline-flex items-center gap-2 hover:text-ink dark:hover:text-ivory" href={footerCopy.contact.website} target="_blank" rel="noreferrer">
                <Globe2 className="h-4 w-4" aria-hidden />
                {footerCopy.contact.website}
              </a>
            ) : null}
            <p className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{textFor(footerCopy.contact.address, locale)}</span>
            </p>
          </div>
        </div>

        <div className="grid gap-4 text-sm">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
            {textFor(footerCopy.socials.title, locale)}
          </p>
          <div className="grid gap-2 text-ink/70 dark:text-ivory/70">
            {footerCopy.socials.instagram ? (
              <a className="inline-flex items-center gap-2 hover:text-ink dark:hover:text-ivory" href={footerCopy.socials.instagram} target="_blank" rel="noreferrer">
                <Instagram className="h-4 w-4" aria-hidden />
                {t('instagram')}
              </a>
            ) : null}
            {footerCopy.socials.facebook ? (
              <a className="inline-flex items-center gap-2 hover:text-ink dark:hover:text-ivory" href={footerCopy.socials.facebook} target="_blank" rel="noreferrer">
                <Facebook className="h-4 w-4" aria-hidden />
                {t('facebook')}
              </a>
            ) : null}
            {footerCopy.socials.youtube ? (
              <a className="inline-flex items-center gap-2 hover:text-ink dark:hover:text-ivory" href={footerCopy.socials.youtube} target="_blank" rel="noreferrer">
                <Youtube className="h-4 w-4" aria-hidden />
                {t('youtube')}
              </a>
            ) : null}
            <p className="pt-2 text-ink/60 dark:text-ivory/60">{textFor(footerCopy.copyright, locale)}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
