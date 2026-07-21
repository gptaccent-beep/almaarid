import {defaultIdentityImage, defaultLogo, regionsSeed} from '@/lib/regions';
import type {Cooperative, Locale, LocalizedText, Region} from '@/lib/types';

const categories: Record<Locale, string[]> = {
  ar: ['الأركان', 'الخزف', 'العسل', 'النسيج', 'الجلد', 'الأعشاب', 'التمور', 'الكسكس'],
  fr: ['argan', 'céramique', 'miel', 'tissage', 'cuir', 'herbes', 'dattes', 'couscous'],
  en: ['argan', 'ceramics', 'honey', 'weaving', 'leather', 'herbs', 'dates', 'couscous']
};

function localizedName(region: Region, index: number): LocalizedText {
  const categoryIndex = index % categories.ar.length;
  const number = String(index + 1).padStart(2, '0');

  return {
    ar: `تعاونية ${categories.ar[categoryIndex]} ${region.names.ar} ${number}`,
    fr: `Coopérative ${categories.fr[categoryIndex]} ${region.names.fr} ${number}`,
    en: `${region.names.en} ${categories.en[categoryIndex]} Cooperative ${number}`
  };
}

function localizedStory(region: Region, index: number): LocalizedText {
  const craftAr = categories.ar[index % categories.ar.length];
  const craftFr = categories.fr[index % categories.fr.length];
  const craftEn = categories.en[index % categories.en.length];

  return {
    ar: `تأسست هذه التعاونية كنموذج تجريبي داخل جهة ${region.names.ar} لعرض منتجات ${craftAr} وقصص النساء والشباب الذين يصنعونها بعناية. يمكن للمدير استبدال هذا النص والصور من لوحة التحكم في أي وقت.`,
    fr: `Cette coopérative de démonstration représente la région ${region.names.fr} et met en scène des produits de ${craftFr}. L’administrateur peut remplacer ce texte et les images depuis le tableau de bord.`,
    en: `This demo cooperative represents ${region.names.en} and showcases ${craftEn} products made with care. The administrator can replace this story and all images from the dashboard.`
  };
}

function localizedDescription(region: Region, index: number): LocalizedText {
  const craftAr = categories.ar[index % categories.ar.length];
  const craftFr = categories.fr[index % categories.fr.length];
  const craftEn = categories.en[index % categories.en.length];

  return {
    ar: `منتجات ${craftAr} مختارة بروح محلية، تغليف أنيق، وقابلية للتواصل المباشر مع الفريق. هذه بطاقة جاهزة للتعديل دون لمس الكود.`,
    fr: `Produits de ${craftFr} présentés avec une identité locale, un packaging soigné et un contact direct avec l’équipe. Cette fiche est prête à être modifiée sans code.`,
    en: `${craftEn} products presented with local identity, polished packaging, and direct contact details. This profile is ready to edit without code.`
  };
}

export function createDemoCooperatives(region: Region, count = 20): Cooperative[] {
  return Array.from({length: count}, (_, index) => {
    const id = `${region.id}-slot-${String(index + 1).padStart(2, '0')}`;
    const now = new Date(Date.UTC(2026, 6, 16, 12, index)).toISOString();

    return {
      id,
      regionId: region.id,
      name: localizedName(region, index),
      logo: defaultLogo,
      identityImage: defaultIdentityImage,
      productImages: [defaultIdentityImage],
      story: localizedStory(region, index),
      description: localizedDescription(region, index),
      contact: {
        name: 'Admin Almaarid',
        phone: '+212 600 000 000',
        website: 'https://almaarid.local',
        email: 'contact@almaarid.local',
        address: region.names.fr,
        others: 'Demo slot. Replace contact details from the admin dashboard.'
      },
      likesCount: 0,
      viewsCount: 0,
      createdAt: now,
      updatedAt: now
    };
  });
}

export function createAllDemoCooperatives() {
  return regionsSeed.flatMap((region) => createDemoCooperatives(region));
}
