export type Locale = 'ar' | 'fr' | 'en';

export type LocalizedText = Record<Locale, string>;

export type SiteContent = {
  nav: {
    home: LocalizedText;
    regions: LocalizedText;
    replayIntro: LocalizedText;
    theme: LocalizedText;
    language: LocalizedText;
  };
  home: {
    eyebrow: LocalizedText;
    subtitle: LocalizedText;
    chooseRegion: LocalizedText;
    sliderHint: LocalizedText;
    sliderImages: string[];
    visitorsOnline: {
      min: number;
      max: number;
    };
    scrollTitle: LocalizedText;
    scrollSubtitle: LocalizedText;
    skipIntro: LocalizedText;
    enter: LocalizedText;
  };
  intro: {
    eyebrow: LocalizedText;
    subtitle: LocalizedText;
    skipIntro: LocalizedText;
    enter: LocalizedText;
    backgroundImage: string;
    autoCloseMs: number;
    showSkipButton: boolean;
  };
  footer: {
    eyebrow: LocalizedText;
    description: LocalizedText;
    links: {
      home: LocalizedText;
      regions: LocalizedText;
      contact: LocalizedText;
    };
    contact: {
      title: LocalizedText;
      phone: string;
      website: string;
      email: string;
      address: LocalizedText;
    };
    socials: {
      title: LocalizedText;
      instagram: string;
      facebook: string;
      youtube: string;
    };
    copyright: LocalizedText;
  };
};

export type RegionMeta = {
  tagline: LocalizedText;
  description: LocalizedText;
  accent: string;
  map: {
    x: number;
    y: number;
  };
};

export type Region = {
  id: string;
  slug: string;
  names: LocalizedText;
  image: string;
  orderNotFixed: boolean;
  meta: RegionMeta;
};

export type ContactInfo = {
  name: string;
  phone: string;
  website: string;
  email?: string;
  address?: string;
  others?: string;
};

export type Cooperative = {
  id: string;
  regionId: string;
  name: LocalizedText;
  logo: string;
  identityImage: string;
  productImages: string[];
  story: LocalizedText;
  description: LocalizedText;
  contact: ContactInfo;
  likesCount: number;
  viewsCount: number;
  liked?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type SiteSettings = {
  id: 'main';
  name: LocalizedText;
  logo: string;
  content: SiteContent;
  updatedAt?: string;
};

export type CooperativeInput = Omit<
  Cooperative,
  'likesCount' | 'viewsCount' | 'liked' | 'createdAt' | 'updatedAt'
> & {
  likesCount?: number;
  viewsCount?: number;
};
