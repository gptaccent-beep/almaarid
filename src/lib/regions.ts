import type {Locale, LocalizedText, Region} from '@/lib/types';

export const locales: Locale[] = ['ar', 'fr', 'en'];
export const defaultLocale: Locale = 'ar';

export const localeLabels: Record<Locale, string> = {
  ar: 'العربية',
  fr: 'Français',
  en: 'English'
};

const heroImage = '/images/morocco-cinematic-hero.png';

export const defaultLogo = '/icons/store-placeholder.svg';
export const defaultIdentityImage = heroImage;

export const regionsSeed: Region[] = [
  {
    id: 'tanger-tetouan-al-hoceima',
    slug: 'tanger-tetouan-al-hoceima',
    names: {
      ar: 'طنجة تطوان الحسيمة',
      fr: 'Tanger-Tétouan-Al Hoceïma',
      en: 'Tanger-Tetouan-Al Hoceima'
    },
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'بوابة الشمال وحرف البحر الأبيض المتوسط',
        fr: 'La porte du nord et des savoir-faire méditerranéens',
        en: 'The northern gateway of Mediterranean craft'
      },
      description: {
        ar: 'مسارات ساحلية وجبلية تجمع بين النسيج، الخشب، الجبن البلدي، والمنتجات المحلية ذات الهوية الشمالية.',
        fr: 'Un territoire côtier et montagneux où textile, bois, fromages et produits du terroir portent une identité forte.',
        en: 'A coastal and mountain region where textiles, woodwork, cheeses, and local products carry a northern identity.'
      },
      accent: '#3f7f87',
      map: {x: 58, y: 8}
    }
  },
  {
    id: 'oriental',
    slug: 'oriental',
    names: {ar: 'الشرق', fr: "L'Oriental", en: 'Oriental'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'واحات وحدود مفتوحة على نكهات نادرة',
        fr: 'Oasis et frontières ouvertes sur des goûts rares',
        en: 'Oases and borderland flavors with rare character'
      },
      description: {
        ar: 'تعاونيات العسل، التمور، الأعشاب العطرية، والحرف الصحراوية تمنح الشرق شخصية دافئة وهادئة.',
        fr: 'Miel, dattes, herbes aromatiques et artisanat saharien donnent à l’Oriental une personnalité chaleureuse.',
        en: 'Honey, dates, aromatic herbs, and Saharan craft give Oriental a warm, quiet character.'
      },
      accent: '#be6d38',
      map: {x: 76, y: 22}
    }
  },
  {
    id: 'fes-meknes',
    slug: 'fes-meknes',
    names: {ar: 'فاس مكناس', fr: 'Fès-Meknès', en: 'Fes-Meknes'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'أصالة المدن العتيقة وكرم السهول',
        fr: 'L’âme des médinas et la générosité des plaines',
        en: 'Medina heritage and the generosity of fertile plains'
      },
      description: {
        ar: 'من الجلد والنحاس إلى الزيتون والورد، تظهر المنطقة كخزان غني للمهارات المغربية العريقة.',
        fr: 'Du cuir au cuivre, de l’olive à la rose, la région révèle un réservoir de savoir-faire marocains.',
        en: 'From leather and copper to olives and roses, this region holds a deep Moroccan craft memory.'
      },
      accent: '#8f5d35',
      map: {x: 62, y: 26}
    }
  },
  {
    id: 'rabat-sale-kenitra',
    slug: 'rabat-sale-kenitra',
    names: {ar: 'الرباط سلا القنيطرة', fr: 'Rabat-Salé-Kénitra', en: 'Rabat-Sale-Kenitra'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'أناقة العاصمة وخصوبة الغرب',
        fr: 'L’élégance capitale et la fertilité du Gharb',
        en: 'Capital elegance and the abundance of Gharb'
      },
      description: {
        ar: 'منتجات غذائية، نسيج معاصر، وحرف حضرية تنطلق من محور حيوي بين الساحل والسهول.',
        fr: 'Produits alimentaires, textile contemporain et métiers urbains naissent entre littoral et plaines.',
        en: 'Food products, contemporary textiles, and urban craft grow between coast and plains.'
      },
      accent: '#2f6d5f',
      map: {x: 48, y: 30}
    }
  },
  {
    id: 'beni-mellal-khenifra',
    slug: 'beni-mellal-khenifra',
    names: {ar: 'بني ملال خنيفرة', fr: 'Béni Mellal-Khénifra', en: 'Beni Mellal-Khenifra'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'قلب الأطلس ومنبع المنتجات الجبلية',
        fr: 'Le cœur de l’Atlas et des produits de montagne',
        en: 'The Atlas heartland of mountain-made goods'
      },
      description: {
        ar: 'تعاونيات الزعفران، العسل، النسيج الأمازيغي، والزيوت النباتية تترجم غنى الأطلس المتوسط.',
        fr: 'Safran, miel, tissage amazigh et huiles végétales racontent la richesse du Moyen Atlas.',
        en: 'Saffron, honey, Amazigh weaving, and botanical oils express the Middle Atlas.'
      },
      accent: '#6d7945',
      map: {x: 51, y: 43}
    }
  },
  {
    id: 'casablanca-settat',
    slug: 'casablanca-settat',
    names: {ar: 'الدار البيضاء سطات', fr: 'Casablanca-Settat', en: 'Casablanca-Settat'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'قلب تجاري نابض بأفكار جديدة',
        fr: 'Un cœur commercial porté par de nouvelles idées',
        en: 'A commercial heart powered by new ideas'
      },
      description: {
        ar: 'من التصميم الغذائي إلى الحرف الحضرية، تجمع الجهة بين السوق الكبير وحيوية المبادرات الصغيرة.',
        fr: 'Du design alimentaire aux métiers urbains, la région lie grand marché et petites initiatives.',
        en: 'From food design to urban craft, the region connects a large market with small initiatives.'
      },
      accent: '#395a64',
      map: {x: 42, y: 40}
    }
  },
  {
    id: 'marrakech-safi',
    slug: 'marrakech-safi',
    names: {ar: 'مراكش آسفي', fr: 'Marrakech-Safi', en: 'Marrakech-Safi'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'حرف الخزف، الجلد، والتوابل في مشهد عالمي',
        fr: 'Céramique, cuir et épices dans une scène mondiale',
        en: 'Ceramics, leather, and spices on a world stage'
      },
      description: {
        ar: 'جهة تجمع دفء المدينة الحمراء مع خبرة آسفي في الخزف وسخاء القرى المحيطة.',
        fr: 'Une région qui mêle la chaleur de Marrakech, la céramique de Safi et la générosité des villages.',
        en: 'A region blending Marrakech warmth, Safi ceramics, and generous surrounding villages.'
      },
      accent: '#b75d34',
      map: {x: 42, y: 53}
    }
  },
  {
    id: 'draa-tafilalet',
    slug: 'draa-tafilalet',
    names: {ar: 'درعة تافيلالت', fr: 'Drâa-Tafilalet', en: 'Draa-Tafilalet'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'واحات التمور والزعفران وحكايات الصحراء',
        fr: 'Oasis de dattes, de safran et récits du désert',
        en: 'Date oases, saffron, and desert stories'
      },
      description: {
        ar: 'مساحات واسعة تمنح التمور، الحناء، الزعفران، والنسيج الصحراوي مكانة خاصة في الذاكرة المغربية.',
        fr: 'Dattes, henné, safran et tissages sahariens occupent une place rare dans la mémoire marocaine.',
        en: 'Dates, henna, saffron, and Saharan weaving hold a rare place in Moroccan memory.'
      },
      accent: '#c8823d',
      map: {x: 61, y: 56}
    }
  },
  {
    id: 'souss-massa',
    slug: 'souss-massa',
    names: {ar: 'سوس ماسة', fr: 'Souss-Massa', en: 'Souss-Massa'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'أركان، زعفران، وأصالة أمازيغية',
        fr: 'Argan, safran et authenticité amazighe',
        en: 'Argan, saffron, and Amazigh authenticity'
      },
      description: {
        ar: 'تشتهر سوس ماسة بزيوت الأركان، الأعشاب، العسل، والمنتجات الزراعية ذات الجودة العالية.',
        fr: 'Souss-Massa rayonne par l’argan, les herbes, le miel et les produits agricoles de qualité.',
        en: 'Souss-Massa shines through argan oil, herbs, honey, and high-quality agricultural goods.'
      },
      accent: '#8b8b45',
      map: {x: 34, y: 66}
    }
  },
  {
    id: 'guelmim-oued-noun',
    slug: 'guelmim-oued-noun',
    names: {ar: 'كلميم واد نون', fr: 'Guelmim-Oued Noun', en: 'Guelmim-Oued Noun'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'بوابة الصحراء وحرف الرحل',
        fr: 'La porte du Sahara et des métiers nomades',
        en: 'The Saharan gateway of nomadic craft'
      },
      description: {
        ar: 'الجلد، الصوف، الأعشاب الصحراوية، ومنتجات الواحات تمنح الجهة حضورا قويا ومميزا.',
        fr: 'Cuir, laine, herbes sahariennes et produits d’oasis donnent à la région une voix singulière.',
        en: 'Leather, wool, Saharan herbs, and oasis goods give the region a distinct voice.'
      },
      accent: '#b8874d',
      map: {x: 30, y: 77}
    }
  },
  {
    id: 'laayoune-sakia-el-hamra',
    slug: 'laayoune-sakia-el-hamra',
    names: {ar: 'العيون الساقية الحمراء', fr: 'Laâyoune-Sakia El Hamra', en: 'Laayoune-Sakia El Hamra'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'امتداد صحراوي بروح بحرية',
        fr: 'Une étendue saharienne à l’âme atlantique',
        en: 'A Saharan expanse with an Atlantic spirit'
      },
      description: {
        ar: 'تعاونيات السمك المجفف، الصوف، الخياطة التقليدية، والمنتجات الصحراوية تقرب الزائر من الجنوب.',
        fr: 'Poisson séché, laine, couture traditionnelle et produits sahariens rapprochent le visiteur du sud.',
        en: 'Dried fish, wool, traditional tailoring, and Saharan products bring visitors closer to the south.'
      },
      accent: '#a25f3a',
      map: {x: 25, y: 88}
    }
  },
  {
    id: 'dakhla-oued-ed-dahab',
    slug: 'dakhla-oued-ed-dahab',
    names: {ar: 'الداخلة وادي الذهب', fr: 'Dakhla-Oued Ed-Dahab', en: 'Dakhla-Oued Ed-Dahab'},
    image: heroImage,
    orderNotFixed: true,
    meta: {
      tagline: {
        ar: 'أفق الأطلسي والمنتجات البحرية',
        fr: 'L’horizon atlantique et les produits de la mer',
        en: 'Atlantic horizons and sea-made products'
      },
      description: {
        ar: 'تجمع الداخلة بين البحر، الصحراء، وتعاونيات ناشئة في المنتجات البحرية والحرف المحلية.',
        fr: 'Dakhla mêle mer, désert et coopératives émergentes autour des produits marins et métiers locaux.',
        en: 'Dakhla blends sea, desert, and emerging cooperatives around marine goods and local craft.'
      },
      accent: '#2f7380',
      map: {x: 18, y: 97}
    }
  }
];

export function textFor(value: LocalizedText | undefined, locale: Locale) {
  if (!value) return '';
  return value[locale] || value.ar || value.fr || value.en || '';
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
