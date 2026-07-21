'use client';

import {Plus, Save, Trash2, Shield} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import {MediaPicker} from '@/components/admin/media-picker';
import {LocalizedTextEditor} from '@/components/admin/localized-text-editor';
import {MediaImage} from '@/components/shared/media-image';
import {
  adminJsonRequest,
  useCreateCooperative,
  useDeleteCooperative,
  useRegions,
  useSaveCooperative,
  useSaveRegion,
  useSaveSiteSettings,
  useSiteSettings
} from '@/lib/client/api';
import {uploadAdminImage} from '@/lib/client/upload';
import {defaultIdentityImage, defaultLogo, textFor} from '@/lib/regions';
import type {Cooperative, Locale, Region, SiteContent, SiteSettings} from '@/lib/types';
import {fetchJson} from '@/lib/utils';

export function AdminDashboard() {
  const t = useTranslations('admin');
  const navT = useTranslations('nav');
  const regionT = useTranslations('region');
  const locale = useLocale() as Locale;
  const {data: regions = []} = useRegions();
  const {data: siteSettings} = useSiteSettings();
  const [auth, setAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [siteDraft, setSiteDraft] = useState<SiteSettings | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [regionDraft, setRegionDraft] = useState<Region | null>(null);
  const [selectedCooperative, setSelectedCooperative] = useState<Cooperative | null>(null);
  const [regionCooperatives, setRegionCooperatives] = useState<Cooperative[]>([]);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const saveRegion = useSaveRegion();
  const saveCooperative = useSaveCooperative(selectedRegionId);
  const createCooperative = useCreateCooperative(selectedRegionId);
  const deleteCooperative = useDeleteCooperative(selectedRegionId);
  const saveSiteSettings = useSaveSiteSettings();

  function updateSiteContent(updater: (content: SiteContent) => SiteContent) {
    setSiteDraft((current) => (current ? {...current, content: updater(current.content)} : current));
  }

  function updateHomeSliderImage(index: number, image: string) {
    updateSiteContent((current) => ({
      ...current,
      home: {
        ...current.home,
        sliderImages: current.home.sliderImages.map((item, itemIndex) => (itemIndex === index ? image : item))
      }
    }));
  }

  function removeHomeSliderImage(index: number) {
    updateSiteContent((current) => ({
      ...current,
      home: {
        ...current.home,
        sliderImages: current.home.sliderImages.filter((_, itemIndex) => itemIndex !== index)
      }
    }));
  }

  function addHomeSliderImage() {
    updateSiteContent((current) => ({
      ...current,
      home: {...current.home, sliderImages: [...current.home.sliderImages, '']}
    }));
  }

  useEffect(() => {
    let active = true;
    fetch('/api/admin/session', {credentials: 'include'})
      .then((response) => response.json() as Promise<{authenticated: boolean}>)
      .then((data) => {
        if (active) setAuth(Boolean(data.authenticated));
      })
      .catch(() => {
        if (active) setAuth(false);
      })
      .finally(() => {
        if (active) setCheckingAuth(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (siteSettings && !siteDraft) setSiteDraft(siteSettings);
  }, [siteDraft, siteSettings]);

  useEffect(() => {
    if (selectedRegionId || !regions.length) return;
    const nextRegion = regions.find((region) => region.id === selectedRegionId) || regions[0];
    setSelectedRegionId(nextRegion.id);
    setRegionDraft(nextRegion);
  }, [regions, selectedRegionId]);

  useEffect(() => {
    if (!selectedRegionId || !auth) return;

    let active = true;
    fetchJson<{cooperatives: Cooperative[]}>(`/api/cooperatives?regionId=${selectedRegionId}&userKey=admin`, {
      credentials: 'include'
    })
      .then((data) => {
        if (active) setRegionCooperatives(data.cooperatives);
      })
      .catch(() => {
        if (active) setRegionCooperatives([]);
      });

    const nextRegion = regions.find((region) => region.id === selectedRegionId) || null;
    if (nextRegion) setRegionDraft(nextRegion);
    setSelectedCooperative(null);

    return () => {
      active = false;
    };
  }, [auth, regions, selectedRegionId]);

  async function login() {
    setNotice('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: adminJsonRequest,
        credentials: 'include',
        body: JSON.stringify({identity, password})
      });

      if (response.ok) {
        setAuth(true);
        setIdentity('');
        setPassword('');
        setNotice(t('loginSuccess'));
        return;
      }

      setNotice(t('loginError'));
    } catch {
      setNotice(t('loginError'));
    }
  }

  async function logout() {
    try {
      await fetch('/api/admin/logout', {method: 'POST', credentials: 'include'});
    } finally {
      setAuth(false);
      setIdentity('');
      setPassword('');
      setNotice('');
    }
  }

  async function reloadCooperatives(regionId = selectedRegionId) {
    if (!regionId) return;
    try {
      const data = await fetchJson<{cooperatives: Cooperative[]}>(`/api/cooperatives?regionId=${regionId}&userKey=admin`, {
        credentials: 'include'
      });
      setRegionCooperatives(data.cooperatives);
    } catch {
      setRegionCooperatives([]);
    }
  }

  async function handleSaveSiteSettings() {
    if (!siteDraft) return;
    setSaving(true);
    setNotice('');
    try {
      const saved = await saveSiteSettings.mutateAsync(siteDraft);
      setSiteDraft(saved);
      setNotice(t('saved'));
    } catch {
      setNotice(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveRegion() {
    if (!regionDraft) return;
    setSaving(true);
    setNotice('');
    try {
      await saveRegion.mutateAsync(regionDraft);
      setNotice(t('saved'));
    } catch {
      setNotice(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveCooperative() {
    if (!selectedCooperative) return;
    setSaving(true);
    setNotice('');
    try {
      await saveCooperative.mutateAsync(selectedCooperative);
      await reloadCooperatives();
      setNotice(t('saved'));
    } catch {
      setNotice(t('saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSlot() {
    try {
      const created = await createCooperative.mutateAsync();
      setSelectedCooperative(created);
      await reloadCooperatives();
    } catch {
      setNotice(t('saveFailed'));
    }
  }

  async function handleDeleteSlot(id: string) {
    try {
      await deleteCooperative.mutateAsync(id);
      setSelectedCooperative(null);
      await reloadCooperatives();
    } catch {
      setNotice(t('saveFailed'));
    }
  }

  async function uploadProductImages(files: FileList | null) {
    if (!selectedCooperative || !files?.length) return;
    const urls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        urls.push(await uploadAdminImage(file));
      }
      if (urls.length) {
        setSelectedCooperative({
          ...selectedCooperative,
          productImages: [...selectedCooperative.productImages, ...urls]
        });
      }
    } catch {
      setNotice(t('uploadFailed'));
    }
  }

  if (!auth) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center px-5 pt-28">
        <div className="glass-panel w-full rounded-[2rem] p-6 shadow-lift">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-saffron/20 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-saffron">
            <Shield className="h-3.5 w-3.5" aria-hidden />
            {t('title')}
          </div>
          <h1 className="font-display text-4xl font-semibold">{t('title')}</h1>
          <p className="mt-3 text-sm leading-7 text-ink/60 dark:text-ivory/60">{t('demoNotice')}</p>
          <div className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              {t('identity')}
              <input
                type="password"
                value={identity}
                onChange={(event) => setIdentity(event.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              {t('password')}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck={false}
                className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
              />
            </label>
            <button
              type="button"
              onClick={login}
              disabled={checkingAuth}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-saffron px-5 py-3 font-semibold text-ink shadow-glow"
            >
              {checkingAuth ? t('loading') : t('login')}
            </button>
            {notice ? <p className="text-sm text-clay-700 dark:text-saffron">{notice}</p> : null}
          </div>
        </div>
      </main>
    );
  }

  const selectedRegion = regionDraft || regions[0];

  return (
    <main className="min-h-screen px-5 pb-16 pt-24 sm:px-8 lg:px-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-clay-700 dark:text-saffron">
              {t('title')}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{t('subtitle')}</h1>
          </div>
          <div className="flex items-center gap-3">
            {notice ? (
              <span className="rounded-full bg-saffron/18 px-4 py-2 text-sm font-semibold text-clay-700 dark:text-saffron">
                {notice}
              </span>
            ) : null}
            <button
              type="button"
              onClick={logout}
              className="focus-ring rounded-full border border-saffron/30 bg-saffron/12 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
            >
              {t('logout')}
            </button>
          </div>
        </div>

        <section className="mb-6 rounded-[1.8rem] border border-ink/10 bg-ivory p-6 shadow-lift dark:bg-atlas-950">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                {t('siteSettings')}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{t('siteIdentity')}</h2>
            </div>
            <button
              type="button"
              onClick={handleSaveSiteSettings}
              disabled={!siteDraft || saving}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-saffron px-4 py-2 font-semibold text-ink"
            >
              <Save className="h-4 w-4" aria-hidden />
              {t('save')}
            </button>
          </div>
          {siteDraft ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
              <LocalizedTextEditor
                label={t('siteName')}
                value={siteDraft.name}
                onChange={(next) => setSiteDraft({...siteDraft, name: next})}
                rows={2}
              />
              <MediaPicker
                label={t('siteLogo')}
                value={siteDraft.logo}
                onChange={(next) => setSiteDraft({...siteDraft, logo: next})}
              />
            </div>
          ) : (
            <div className="text-sm text-ink/60 dark:text-ivory/60">{t('loading')}</div>
          )}
        </section>

        <section className="mb-6 rounded-[1.8rem] border border-ink/10 bg-ivory p-6 shadow-lift dark:bg-atlas-950">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                {t('siteContent')}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">{t('contentStudio')}</h2>
            </div>
            <button
              type="button"
              onClick={handleSaveSiteSettings}
              disabled={!siteDraft || saving}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-saffron px-4 py-2 font-semibold text-ink"
            >
              <Save className="h-4 w-4" aria-hidden />
              {t('save')}
            </button>
          </div>

          {siteDraft ? (
            <div className="grid gap-6">
              <div className="rounded-[1.4rem] border border-ink/10 bg-ink/5 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="mb-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                    {t('navigationContent')}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <LocalizedTextEditor
                    label={t('home')}
                    value={siteDraft.content.nav.home}
                    onChange={(next) => updateSiteContent((current) => ({...current, nav: {...current.nav, home: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('regions')}
                    value={siteDraft.content.nav.regions}
                    onChange={(next) => updateSiteContent((current) => ({...current, nav: {...current.nav, regions: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('replayIntro')}
                    value={siteDraft.content.nav.replayIntro}
                    onChange={(next) => updateSiteContent((current) => ({...current, nav: {...current.nav, replayIntro: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('theme')}
                    value={siteDraft.content.nav.theme}
                    onChange={(next) => updateSiteContent((current) => ({...current, nav: {...current.nav, theme: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('language')}
                    value={siteDraft.content.nav.language}
                    onChange={(next) => updateSiteContent((current) => ({...current, nav: {...current.nav, language: next}}))}
                    rows={2}
                  />
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-ink/10 bg-ink/5 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="mb-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                    {t('homeContent')}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <LocalizedTextEditor
                    label={t('eyebrow')}
                    value={siteDraft.content.home.eyebrow}
                    onChange={(next) => updateSiteContent((current) => ({...current, home: {...current.home, eyebrow: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('fieldSubtitle')}
                    value={siteDraft.content.home.subtitle}
                    onChange={(next) => updateSiteContent((current) => ({...current, home: {...current.home, subtitle: next}}))}
                  />
                  <LocalizedTextEditor
                    label={t('chooseRegion')}
                    value={siteDraft.content.home.chooseRegion}
                    onChange={(next) => updateSiteContent((current) => ({...current, home: {...current.home, chooseRegion: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('sliderHint')}
                    value={siteDraft.content.home.sliderHint}
                    onChange={(next) => updateSiteContent((current) => ({...current, home: {...current.home, sliderHint: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('scrollTitle')}
                    value={siteDraft.content.home.scrollTitle}
                    onChange={(next) => updateSiteContent((current) => ({...current, home: {...current.home, scrollTitle: next}}))}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('scrollSubtitle')}
                    value={siteDraft.content.home.scrollSubtitle}
                    onChange={(next) => updateSiteContent((current) => ({...current, home: {...current.home, scrollSubtitle: next}}))}
                  />
                </div>
                <div className="mt-5 rounded-[1.2rem] border border-ink/10 bg-ivory p-4 dark:border-white/10 dark:bg-atlas-950">
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                    {t('visitorsOnline')}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      {t('visitorsMin')}
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={siteDraft.content.home.visitorsOnline.min}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            home: {
                              ...current.home,
                              visitorsOnline: {
                                ...current.home.visitorsOnline,
                                min: Number(event.target.value || 0)
                              }
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      {t('visitorsMax')}
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={siteDraft.content.home.visitorsOnline.max}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            home: {
                              ...current.home,
                              visitorsOnline: {
                                ...current.home.visitorsOnline,
                                max: Number(event.target.value || 0)
                              }
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                  </div>
                </div>
                <div className="mt-5 rounded-[1.2rem] border border-ink/10 bg-ivory p-4 dark:border-white/10 dark:bg-atlas-950">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                      {t('sliderImages')}
                    </p>
                    <button
                      type="button"
                      onClick={addHomeSliderImage}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                      {t('addSlide')}
                    </button>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {siteDraft.content.home.sliderImages.map((image, index) => (
                      <div key={`${image}-${index}`} className="rounded-[1rem] border border-ink/10 p-3 dark:border-white/10">
                        <MediaPicker
                          label={t('slideLabel', {number: index + 1})}
                          value={image}
                          onChange={(next) => updateHomeSliderImage(index, next)}
                        />
                        <button
                          type="button"
                          onClick={() => removeHomeSliderImage(index)}
                          className="focus-ring mt-3 inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                          {t('removeSlide')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-ink/10 bg-ink/5 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="mb-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                    {t('introContent')}
                  </p>
                </div>
                <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
                  <div className="grid gap-4">
                    <LocalizedTextEditor
                      label={t('eyebrow')}
                      value={siteDraft.content.intro.eyebrow}
                      onChange={(next) => updateSiteContent((current) => ({...current, intro: {...current.intro, eyebrow: next}}))}
                      rows={2}
                    />
                    <LocalizedTextEditor
                      label={t('fieldSubtitle')}
                      value={siteDraft.content.intro.subtitle}
                      onChange={(next) => updateSiteContent((current) => ({...current, intro: {...current.intro, subtitle: next}}))}
                    />
                    <LocalizedTextEditor
                      label={t('skipIntro')}
                      value={siteDraft.content.intro.skipIntro}
                      onChange={(next) => updateSiteContent((current) => ({...current, intro: {...current.intro, skipIntro: next}}))}
                      rows={2}
                    />
                    <LocalizedTextEditor
                      label={t('enter')}
                      value={siteDraft.content.intro.enter}
                      onChange={(next) => updateSiteContent((current) => ({...current, intro: {...current.intro, enter: next}}))}
                      rows={2}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-sm font-medium">
                        {t('autoCloseMs')}
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={siteDraft.content.intro.autoCloseMs}
                          onChange={(event) =>
                            updateSiteContent((current) => ({
                              ...current,
                              intro: {...current.intro, autoCloseMs: Number(event.target.value || 0)}
                            }))
                          }
                          className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                        />
                      </label>
                      <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-atlas-950">
                        <input
                          type="checkbox"
                          checked={siteDraft.content.intro.showSkipButton}
                          onChange={(event) =>
                            updateSiteContent((current) => ({
                              ...current,
                              intro: {...current.intro, showSkipButton: event.target.checked}
                            }))
                          }
                        />
                        {t('showSkipButton')}
                      </label>
                    </div>
                  </div>
                  <MediaPicker
                    label={t('backgroundImage')}
                    value={siteDraft.content.intro.backgroundImage}
                    onChange={(next) => updateSiteContent((current) => ({...current, intro: {...current.intro, backgroundImage: next}}))}
                  />
                </div>
              </div>

              <div className="rounded-[1.4rem] border border-ink/10 bg-ink/5 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="mb-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-clay-700 dark:text-saffron">
                    {t('footerContent')}
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <LocalizedTextEditor
                      label={t('eyebrow')}
                      value={siteDraft.content.footer.eyebrow}
                      onChange={(next) => updateSiteContent((current) => ({...current, footer: {...current.footer, eyebrow: next}}))}
                      rows={2}
                    />
                    <LocalizedTextEditor
                      label={t('description')}
                      value={siteDraft.content.footer.description}
                      onChange={(next) => updateSiteContent((current) => ({...current, footer: {...current.footer, description: next}}))}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <LocalizedTextEditor
                      label={t('home')}
                      value={siteDraft.content.footer.links.home}
                      onChange={(next) => updateSiteContent((current) => ({...current, footer: {...current.footer, links: {...current.footer.links, home: next}}}))}
                      rows={2}
                    />
                    <LocalizedTextEditor
                      label={t('regions')}
                      value={siteDraft.content.footer.links.regions}
                      onChange={(next) => updateSiteContent((current) => ({...current, footer: {...current.footer, links: {...current.footer.links, regions: next}}}))}
                      rows={2}
                    />
                    <LocalizedTextEditor
                      label={t('contactLabel')}
                      value={siteDraft.content.footer.links.contact}
                      onChange={(next) => updateSiteContent((current) => ({...current, footer: {...current.footer, links: {...current.footer.links, contact: next}}}))}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <LocalizedTextEditor
                      label={t('contactTitle')}
                      value={siteDraft.content.footer.contact.title}
                      onChange={(next) => updateSiteContent((current) => ({...current, footer: {...current.footer, contact: {...current.footer.contact, title: next}}}))}
                      rows={2}
                    />
                    <LocalizedTextEditor
                      label={t('socialTitle')}
                      value={siteDraft.content.footer.socials.title}
                      onChange={(next) => updateSiteContent((current) => ({...current, footer: {...current.footer, socials: {...current.footer.socials, title: next}}}))}
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      {t('phone')}
                      <input
                        value={siteDraft.content.footer.contact.phone}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              contact: {...current.footer.contact, phone: event.target.value}
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      {t('email')}
                      <input
                        value={siteDraft.content.footer.contact.email}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              contact: {...current.footer.contact, email: event.target.value}
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      {t('website')}
                      <input
                        value={siteDraft.content.footer.contact.website}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              contact: {...current.footer.contact, website: event.target.value}
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                    <LocalizedTextEditor
                      label={t('address')}
                      value={siteDraft.content.footer.contact.address}
                      onChange={(next) =>
                        updateSiteContent((current) => ({
                          ...current,
                          footer: {
                            ...current.footer,
                            contact: {...current.footer.contact, address: next}
                          }
                        }))
                      }
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2 text-sm font-medium">
                      {navT('instagram')}
                      <input
                        value={siteDraft.content.footer.socials.instagram}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              socials: {...current.footer.socials, instagram: event.target.value}
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      {navT('facebook')}
                      <input
                        value={siteDraft.content.footer.socials.facebook}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              socials: {...current.footer.socials, facebook: event.target.value}
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      {navT('youtube')}
                      <input
                        value={siteDraft.content.footer.socials.youtube}
                        onChange={(event) =>
                          updateSiteContent((current) => ({
                            ...current,
                            footer: {
                              ...current.footer,
                              socials: {...current.footer.socials, youtube: event.target.value}
                            }
                          }))
                        }
                        className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-ink/60 dark:text-ivory/60">{t('loading')}</div>
          )}
        </section>

        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="glass-panel rounded-[1.8rem] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-semibold">{t('regions')}</h2>
              <span className="rounded-full bg-ink px-3 py-1 text-xs font-black text-ivory dark:bg-ivory dark:text-ink">
                12
              </span>
            </div>
            <div className="grid gap-2">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => {
                    setSelectedRegionId(region.id);
                    setRegionDraft(region);
                  }}
                  className={`focus-ring rounded-2xl border px-4 py-3 text-start transition ${
                    selectedRegionId === region.id
                      ? 'border-saffron bg-saffron/10 text-clay-700 dark:text-saffron'
                      : 'border-saffron/18 bg-saffron/6 hover:border-saffron hover:bg-saffron/12 dark:border-saffron/12 dark:bg-saffron/6 dark:hover:bg-saffron/10'
                  }`}
                  >
                  <div className="text-sm font-semibold">{textFor(region.names, locale)}</div>
                  <div className="mt-1 text-xs text-ink/50 dark:text-ivory/50">{region.slug}</div>
                </button>
              ))}
            </div>
          </aside>

          <div className="grid gap-6">
            <section className="rounded-[1.8rem] border border-ink/10 bg-ivory p-6 shadow-lift dark:bg-atlas-950">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold">{t('regionDetails')}</h2>
                <button
                  type="button"
                  onClick={handleSaveRegion}
                  disabled={saving}
                  className="focus-ring inline-flex items-center gap-2 rounded-full bg-saffron px-4 py-2 font-semibold text-ink"
                >
                  <Save className="h-4 w-4" aria-hidden />
                  {t('save')}
                </button>
              </div>
              {selectedRegion && regionDraft ? (
                <div className="grid gap-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium">
                      {t('slug')}
                      <input
                        value={regionDraft.slug}
                        onChange={(event) => setRegionDraft({...regionDraft, slug: event.target.value})}
                        className="focus-ring rounded-2xl border border-ink/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-ink"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium">
                      {t('image')}
                      <MediaPicker
                        label={t('upload')}
                        value={regionDraft.image}
                        onChange={(next) => setRegionDraft({...regionDraft, image: next})}
                      />
                    </label>
                  </div>
                  <LocalizedTextEditor
                    label={t('name')}
                    value={regionDraft.names}
                    onChange={(next) => setRegionDraft({...regionDraft, names: next})}
                    rows={2}
                  />
                  <LocalizedTextEditor
                    label={t('tagline')}
                    value={regionDraft.meta.tagline}
                    onChange={(next) =>
                      setRegionDraft({
                        ...regionDraft,
                        meta: {...regionDraft.meta, tagline: next}
                      })
                    }
                  />
                  <LocalizedTextEditor
                    label={t('description')}
                    value={regionDraft.meta.description}
                    onChange={(next) =>
                      setRegionDraft({
                        ...regionDraft,
                        meta: {...regionDraft.meta, description: next}
                      })
                    }
                  />
                </div>
              ) : (
                <div className="text-sm text-ink/60 dark:text-ivory/60">{t('selectSlot')}</div>
              )}
            </section>

            <section className="rounded-[1.8rem] border border-ink/10 bg-ivory p-6 shadow-lift dark:bg-atlas-950">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold">{t('cooperativeSlots')}</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddSlot}
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-4 py-2 font-semibold text-ink transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                    {t('addSlot')}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCooperative}
                    disabled={!selectedCooperative || saving}
                    className="focus-ring inline-flex items-center gap-2 rounded-full bg-saffron px-4 py-2 font-semibold text-ink"
                  >
                    <Save className="h-4 w-4" aria-hidden />
                    {t('save')}
                  </button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {regionCooperatives.map((coop) => (
                  <button
                    key={coop.id}
                    type="button"
                    onClick={() => setSelectedCooperative(coop)}
                    className={`focus-ring overflow-hidden rounded-[1.4rem] border text-start transition ${
                      selectedCooperative?.id === coop.id
                        ? 'border-saffron bg-saffron/10'
                        : 'border-saffron/18 bg-saffron/6 hover:border-saffron hover:bg-saffron/12 dark:border-saffron/12 dark:bg-saffron/6 dark:hover:bg-saffron/10'
                    }`}
                  >
                    <div className="flex items-center gap-4 p-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-ink/5 dark:bg-white/5">
                        <MediaImage
                          src={coop.logo || defaultLogo}
                          fallbackSrc={defaultLogo}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{textFor(coop.name, locale)}</p>
                        <p className="mt-1 text-xs text-ink/50 dark:text-ivory/50">{coop.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-ink/10 px-4 py-3 text-xs dark:border-white/10">
                      <span>{coop.likesCount} {regionT('likes')}</span>
                      <span>{coop.viewsCount} {regionT('views')}</span>
                    </div>
                  </button>
                ))}
              </div>

              {selectedCooperative ? (
                <div className="mt-6 rounded-[1.5rem] border border-ink/10 bg-ink/5 p-5 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold">{textFor(selectedCooperative.name, locale)}</h3>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlot(selectedCooperative.id)}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-saffron/30 bg-saffron/12 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-saffron dark:border-saffron/22 dark:bg-saffron/10 dark:text-ivory dark:hover:bg-saffron dark:hover:text-ink"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      {t('deleteSlot')}
                    </button>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="grid gap-5">
                      <MediaPicker
                        label={t('logo')}
                        value={selectedCooperative.logo || defaultLogo}
                        onChange={(next) => setSelectedCooperative({...selectedCooperative, logo: next})}
                      />
                      <MediaPicker
                        label={t('identityImage')}
                        value={selectedCooperative.identityImage || defaultIdentityImage}
                        onChange={(next) => setSelectedCooperative({...selectedCooperative, identityImage: next})}
                      />
                      <div className="grid gap-3">
                        <label className="text-xs font-black uppercase tracking-[0.24em] text-ink/50 dark:text-ivory/50">
                          {t('products')}
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 text-sm dark:border-white/10 dark:bg-atlas-950"
                          onChange={(event) => uploadProductImages(event.target.files)}
                        />
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {selectedCooperative.productImages.map((src, index) => (
                            <div key={`${src}-${index}`} className="relative aspect-square overflow-hidden rounded-2xl">
                              <MediaImage
                                src={src}
                                fallbackSrc={defaultIdentityImage}
                                alt=""
                                fill
                                sizes="140px"
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-5">
                      <LocalizedTextEditor
                        label={t('name')}
                        value={selectedCooperative.name}
                        onChange={(next) => setSelectedCooperative({...selectedCooperative, name: next})}
                        rows={2}
                      />
                      <LocalizedTextEditor
                        label={t('story')}
                        value={selectedCooperative.story}
                        onChange={(next) => setSelectedCooperative({...selectedCooperative, story: next})}
                      />
                      <LocalizedTextEditor
                        label={t('description')}
                        value={selectedCooperative.description}
                        onChange={(next) => setSelectedCooperative({...selectedCooperative, description: next})}
                      />
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="grid gap-2 text-sm font-medium">
                          {t('contactName')}
                          <input
                            value={selectedCooperative.contact.name}
                            onChange={(event) =>
                              setSelectedCooperative({
                                ...selectedCooperative,
                                contact: {...selectedCooperative.contact, name: event.target.value}
                              })
                            }
                            className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                          {t('phone')}
                          <input
                            value={selectedCooperative.contact.phone}
                            onChange={(event) =>
                              setSelectedCooperative({
                                ...selectedCooperative,
                                contact: {...selectedCooperative.contact, phone: event.target.value}
                              })
                            }
                            className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                          {t('website')}
                          <input
                            value={selectedCooperative.contact.website}
                            onChange={(event) =>
                              setSelectedCooperative({
                                ...selectedCooperative,
                                contact: {...selectedCooperative.contact, website: event.target.value}
                              })
                            }
                            className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-medium">
                          {t('email')}
                          <input
                            value={selectedCooperative.contact.email || ''}
                            onChange={(event) =>
                              setSelectedCooperative({
                                ...selectedCooperative,
                                contact: {...selectedCooperative.contact, email: event.target.value}
                              })
                            }
                            className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-medium md:col-span-2">
                          {t('address')}
                          <input
                            value={selectedCooperative.contact.address || ''}
                            onChange={(event) =>
                              setSelectedCooperative({
                                ...selectedCooperative,
                                contact: {...selectedCooperative.contact, address: event.target.value}
                              })
                            }
                            className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                          />
                        </label>
                        <label className="grid gap-2 text-sm font-medium md:col-span-2">
                          {t('others')}
                          <textarea
                            rows={3}
                            value={selectedCooperative.contact.others || ''}
                            onChange={(event) =>
                              setSelectedCooperative({
                                ...selectedCooperative,
                                contact: {...selectedCooperative.contact, others: event.target.value}
                              })
                            }
                            className="focus-ring rounded-2xl border border-ink/10 bg-ivory px-4 py-3 dark:border-white/10 dark:bg-atlas-950"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-ink/10 p-8 text-sm text-ink/60 dark:border-white/10 dark:text-ivory/60">
                  {t('selectSlot')}
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
