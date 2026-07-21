import {defaultLogo} from '@/lib/regions';
import type {LocalizedText, SiteContent, SiteSettings} from '@/lib/types';

const defaultSliderImages = ['/sliders/1.png', '/sliders/2.png', '/sliders/3.png'];
const defaultHeroBackground = '/assets/morocco-cinematic-hero.png';

function mergeLocalizedText(value: Partial<LocalizedText> | undefined, fallback: LocalizedText): LocalizedText {
  const sanitize = (input: string | undefined, fallbackValue: string) => {
    if (!input) return fallbackValue;
    if (input.includes('\uFFFD')) return fallbackValue;
    if (input === 'ALMAARID') return 'Almaarid';
    if (input === '© ALMAARID') return '© Almaarid';
    if (input === 'المعارض') return 'المعرض';
    if (input === '© المعارض') return '© المعرض';
    return input;
  };

  return {
    ar: sanitize(value?.ar, fallback.ar),
    fr: sanitize(value?.fr, fallback.fr),
    en: sanitize(value?.en, fallback.en)
  };
}

function normalizeSliderHint(value: LocalizedText): LocalizedText {
  const legacyHints = new Set([
    'اضغط على الدوائر المتوهجة فوق الخريطة',
    'Cliquez sur les repères lumineux de la carte',
    'Click the glowing markers on the map'
  ]);

  if (legacyHints.has(value.ar) || legacyHints.has(value.fr) || legacyHints.has(value.en)) {
    return defaultSiteSettings.content.home.sliderHint;
  }

  return value;
}

function normalizeSliderImages(value: unknown): string[] {
  if (!Array.isArray(value)) return defaultSliderImages;
  const images = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  return images.length ? images : defaultSliderImages;
}

function normalizeIntroBackground(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return defaultHeroBackground;
  if (value === '/images/morocco-cinematic-hero.png') return defaultHeroBackground;
  return value;
}

function normalizeVisitorsOnline(value: unknown, fallback: {min: number; max: number}): {min: number; max: number} {
  const source = value && typeof value === 'object' ? (value as Partial<{min: number; max: number}>) : {};
  const min = Number.isFinite(source.min) ? Math.max(0, Math.floor(source.min as number)) : fallback.min;
  const maxCandidate = Number.isFinite(source.max) ? Math.floor(source.max as number) : fallback.max;
  return {min, max: Math.max(min, maxCandidate)};
}

export function normalizeSiteContent(value: Partial<SiteContent> | null | undefined): SiteContent {
  const fallback = defaultSiteSettings.content;
  const source = value || {};
  const legacyHome = source.home as Partial<SiteContent['home']> & {mapHint?: Partial<LocalizedText>} | undefined;
  return {
    nav: {
      home: mergeLocalizedText(source.nav?.home, fallback.nav.home),
      regions: mergeLocalizedText(source.nav?.regions, fallback.nav.regions),
      replayIntro: mergeLocalizedText(source.nav?.replayIntro, fallback.nav.replayIntro),
      theme: mergeLocalizedText(source.nav?.theme, fallback.nav.theme),
      language: mergeLocalizedText(source.nav?.language, fallback.nav.language)
    },
    home: {
      eyebrow: mergeLocalizedText(source.home?.eyebrow, fallback.home.eyebrow),
      subtitle: mergeLocalizedText(source.home?.subtitle, fallback.home.subtitle),
      chooseRegion: mergeLocalizedText(source.home?.chooseRegion, fallback.home.chooseRegion),
      sliderHint: normalizeSliderHint(mergeLocalizedText(source.home?.sliderHint || legacyHome?.mapHint, fallback.home.sliderHint)),
      sliderImages: normalizeSliderImages(source.home?.sliderImages),
      visitorsOnline: normalizeVisitorsOnline(source.home?.visitorsOnline, fallback.home.visitorsOnline),
      scrollTitle: mergeLocalizedText(source.home?.scrollTitle, fallback.home.scrollTitle),
      scrollSubtitle: mergeLocalizedText(source.home?.scrollSubtitle, fallback.home.scrollSubtitle),
      skipIntro: mergeLocalizedText(source.home?.skipIntro, fallback.home.skipIntro),
      enter: mergeLocalizedText(source.home?.enter, fallback.home.enter)
    },
    intro: {
      eyebrow: mergeLocalizedText(source.intro?.eyebrow, fallback.intro.eyebrow),
      subtitle: mergeLocalizedText(source.intro?.subtitle, fallback.intro.subtitle),
      skipIntro: mergeLocalizedText(source.intro?.skipIntro, fallback.intro.skipIntro),
      enter: mergeLocalizedText(source.intro?.enter, fallback.intro.enter),
      backgroundImage: normalizeIntroBackground(source.intro?.backgroundImage || fallback.intro.backgroundImage),
      autoCloseMs: typeof source.intro?.autoCloseMs === 'number' ? source.intro.autoCloseMs : fallback.intro.autoCloseMs,
      showSkipButton:
        typeof source.intro?.showSkipButton === 'boolean' ? source.intro.showSkipButton : fallback.intro.showSkipButton
    },
    footer: {
      eyebrow: mergeLocalizedText(source.footer?.eyebrow, fallback.footer.eyebrow),
      description: mergeLocalizedText(source.footer?.description, fallback.footer.description),
      links: {
        home: mergeLocalizedText(source.footer?.links?.home, fallback.footer.links.home),
        regions: mergeLocalizedText(source.footer?.links?.regions, fallback.footer.links.regions),
        contact: mergeLocalizedText(source.footer?.links?.contact, fallback.footer.links.contact)
      },
      contact: {
        title: mergeLocalizedText(source.footer?.contact?.title, fallback.footer.contact.title),
        phone: source.footer?.contact?.phone || fallback.footer.contact.phone,
        website: source.footer?.contact?.website || fallback.footer.contact.website,
        email: source.footer?.contact?.email || fallback.footer.contact.email,
        address: mergeLocalizedText(source.footer?.contact?.address, fallback.footer.contact.address)
      },
      socials: {
        title: mergeLocalizedText(source.footer?.socials?.title, fallback.footer.socials.title),
        instagram: source.footer?.socials?.instagram || fallback.footer.socials.instagram,
        facebook: source.footer?.socials?.facebook || fallback.footer.socials.facebook,
        youtube: source.footer?.socials?.youtube || fallback.footer.socials.youtube
      },
      copyright: mergeLocalizedText(source.footer?.copyright, fallback.footer.copyright)
    }
  };
}

export function normalizeSiteSettings(value: Partial<SiteSettings> | null | undefined): SiteSettings {
  const source = value || {};
  const updatedAt = source.updatedAt || (source as {updated_at?: string}).updated_at;
  const normalizedName = normalizeBrandName(mergeLocalizedText(source.name, defaultSiteSettings.name));
  return {
    id: source.id || defaultSiteSettings.id,
    name: normalizedName,
    logo: source.logo || defaultSiteSettings.logo,
    content: normalizeSiteContent(source.content),
    ...(updatedAt ? {updatedAt} : {})
  };
}

function normalizeBrandName(value: LocalizedText): LocalizedText {
  const normalizeLatin = (input: string) => (input.toUpperCase() === 'ALMAARID' ? 'Almaarid' : input);

  return {
    ar: value.ar === 'المعارض' ? 'المعرض' : value.ar,
    fr: normalizeLatin(value.fr),
    en: normalizeLatin(value.en)
  };
}

export const defaultSiteSettings: SiteSettings = {
  id: 'main',
  name: {
    ar: 'المعرض',
    fr: 'Almaarid',
    en: 'Almaarid'
  },
  logo: defaultLogo,
  content: {
    nav: {
      home: {ar: 'الرئيسية', fr: 'Accueil', en: 'Home'},
      regions: {ar: 'الجهات', fr: 'Régions', en: 'Regions'},
      replayIntro: {ar: 'إعادة المقدمة', fr: "Rejouer l'intro", en: 'Replay intro'},
      theme: {ar: 'المظهر', fr: 'Thème', en: 'Theme'},
      language: {ar: 'اللغة', fr: 'Langue', en: 'Language'}
    },
    home: {
      eyebrow: {
        ar: 'منصة رقمية للتعاونيات المغربية',
        fr: 'Plateforme numérique pour les coopératives marocaines',
        en: 'Digital platform for Moroccan cooperatives'
      },
      subtitle: {
        ar: 'واجهة بصرية فاخرة تضع قصص الحرف والمنتجات المحلية في مقدمة التجربة عبر جهات المغرب الاثنتي عشرة.',
        fr: 'Un showroom visuel premium pour explorer les histoires, savoir-faire et produits locaux des douze régions du Maroc.',
        en: 'A premium visual showroom for exploring the stories, craft, and local products of Morocco’s twelve regions.'
      },
      chooseRegion: {ar: 'اختر جهة', fr: 'Choisir une région', en: 'Choose a region'},
      sliderHint: {
        ar: 'صور متحركة تعرض روح المغرب. اختر الجهة من البطاقات أسفلها.',
        fr: 'Un carrousel visuel met en scène l’esprit du Maroc. Choisissez une région dans les cartes ci-dessous.',
        en: 'A visual carousel presents the spirit of Morocco. Choose a region from the cards below.'
      },
      sliderImages: defaultSliderImages,
      visitorsOnline: {
        min: 100,
        max: 150
      },
      scrollTitle: {ar: 'استكشف الجهات', fr: 'Explorer les régions', en: 'Explore regions'},
      scrollSubtitle: {
        ar: 'يتغير ترتيب الجهات في كل زيارة ليبقى العرض عادلاً للجميع.',
        fr: 'L’ordre change à chaque visite pour offrir une visibilité équitable.',
        en: 'The order changes on every visit to keep regional visibility fair.'
      },
      skipIntro: {ar: 'تخطي المقدمة', fr: "Passer l’intro", en: 'Skip intro'},
      enter: {ar: 'ادخل المعرض', fr: 'Entrer', en: 'Enter showroom'}
    },
    intro: {
      eyebrow: {
        ar: 'المعرض',
        fr: 'Almaarid',
        en: 'Almaarid'
      },
      subtitle: {
        ar: 'من جبال الأطلس إلى الساحل والصحراء، تعبر التجربة ملامح المغرب بحركة سينمائية هادئة.',
        fr: 'Des montagnes de l’Atlas à la côte et au désert, l’expérience traverse le Maroc avec un mouvement cinématique fluide.',
        en: 'From the Atlas mountains to the coast and the desert, the experience moves through Morocco with quiet cinematic motion.'
      },
      skipIntro: {ar: 'تخطي', fr: 'Passer', en: 'Skip'},
      enter: {ar: 'ابدأ', fr: 'Commencer', en: 'Start'},
      backgroundImage: defaultHeroBackground,
      autoCloseMs: 950,
      showSkipButton: true
    },
    footer: {
      eyebrow: {ar: 'المعرض', fr: 'Almaarid', en: 'Almaarid'},
      description: {
        ar: 'دليل بصري للتعاونيات المغربية يربط الجهة بالمنتج وبقصة الناس الذين يصنعون القيمة.',
        fr: 'Un guide visuel des coopératives marocaines reliant région, produit et récit humain.',
        en: 'A visual guide to Moroccan cooperatives linking region, product, and the people who make value.'
      },
      links: {
        home: {ar: 'الرئيسية', fr: 'Accueil', en: 'Home'},
        regions: {ar: 'الجهات', fr: 'Régions', en: 'Regions'},
        contact: {ar: 'تواصل', fr: 'Contact', en: 'Contact'}
      },
      contact: {
        title: {ar: 'بيانات التواصل', fr: 'Contact', en: 'Contact'},
        phone: '+212 600 000 000',
        website: 'https://almaarid.local',
        email: 'contact@almaarid.local',
        address: {ar: 'الرباط، المغرب', fr: 'Rabat, Maroc', en: 'Rabat, Morocco'}
      },
      socials: {
        title: {ar: 'الشبكات الاجتماعية', fr: 'Réseaux sociaux', en: 'Social links'},
        instagram: 'https://instagram.com/almaarid',
        facebook: 'https://facebook.com/almaarid',
        youtube: 'https://youtube.com/@almaarid'
      },
      copyright: {
        ar: '© المعرض',
        fr: '© Almaarid',
        en: '© Almaarid'
      }
    }
  }
};
