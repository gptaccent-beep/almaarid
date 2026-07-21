import {DatabaseSync} from 'node:sqlite';
import {nanoid} from 'nanoid';
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const databasePath = path.join(dataDir, 'almaarid.sqlite');

const regions = [
  ['tanger-tetouan-al-hoceima', {ar: 'طنجة تطوان الحسيمة', fr: 'Tanger-Tétouan-Al Hoceïma', en: 'Tanger-Tetouan-Al Hoceima'}],
  ['oriental', {ar: 'الشرق', fr: "L'Oriental", en: 'Oriental'}],
  ['fes-meknes', {ar: 'فاس مكناس', fr: 'Fès-Meknès', en: 'Fes-Meknes'}],
  ['rabat-sale-kenitra', {ar: 'الرباط سلا القنيطرة', fr: 'Rabat-Salé-Kénitra', en: 'Rabat-Sale-Kenitra'}],
  ['beni-mellal-khenifra', {ar: 'بني ملال خنيفرة', fr: 'Béni Mellal-Khénifra', en: 'Beni Mellal-Khenifra'}],
  ['casablanca-settat', {ar: 'الدار البيضاء سطات', fr: 'Casablanca-Settat', en: 'Casablanca-Settat'}],
  ['marrakech-safi', {ar: 'مراكش آسفي', fr: 'Marrakech-Safi', en: 'Marrakech-Safi'}],
  ['draa-tafilalet', {ar: 'درعة تافيلالت', fr: 'Drâa-Tafilalet', en: 'Draa-Tafilalet'}],
  ['souss-massa', {ar: 'سوس ماسة', fr: 'Souss-Massa', en: 'Souss-Massa'}],
  ['guelmim-oued-noun', {ar: 'كلميم واد نون', fr: 'Guelmim-Oued Noun', en: 'Guelmim-Oued Noun'}],
  ['laayoune-sakia-el-hamra', {ar: 'العيون الساقية الحمراء', fr: 'Laâyoune-Sakia El Hamra', en: 'Laayoune-Sakia El Hamra'}],
  ['dakhla-oued-ed-dahab', {ar: 'الداخلة وادي الذهب', fr: 'Dakhla-Oued Ed-Dahab', en: 'Dakhla-Oued Ed-Dahab'}]
];

const categories = {
  ar: ['الأركان', 'الخزف', 'العسل', 'النسيج', 'الجلد', 'الأعشاب', 'التمور', 'الكسكس'],
  fr: ['argan', 'céramique', 'miel', 'tissage', 'cuir', 'herbes', 'dattes', 'couscous'],
  en: ['argan', 'ceramics', 'honey', 'weaving', 'leather', 'herbs', 'dates', 'couscous']
};

function json(value) {
  return JSON.stringify(value);
}

fs.mkdirSync(dataDir, {recursive: true});
const db = new DatabaseSync(databasePath);

db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS regions (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    names_json TEXT NOT NULL,
    image TEXT NOT NULL,
    order_not_fixed INTEGER NOT NULL DEFAULT 1,
    meta_json TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cooperatives (
    id TEXT PRIMARY KEY,
    region_id TEXT NOT NULL,
    name_json TEXT NOT NULL,
    logo TEXT NOT NULL,
    identity_image TEXT NOT NULL,
    product_images_json TEXT NOT NULL,
    story_json TEXT NOT NULL,
    description_json TEXT NOT NULL,
    contact_json TEXT NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    cooperative_id TEXT NOT NULL,
    user_key TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(cooperative_id, user_key)
  );

  CREATE TABLE IF NOT EXISTS views (
    id TEXT PRIMARY KEY,
    cooperative_id TEXT NOT NULL,
    visitor_key TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY,
    name_json TEXT NOT NULL,
    logo TEXT NOT NULL,
    content_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

db.prepare(
  `INSERT INTO site_settings (id, name_json, logo, content_json, updated_at)
   VALUES (?, ?, ?, ?, ?)
   ON CONFLICT(id) DO NOTHING`
).run(
  'main',
  json({ar: 'المعرض', fr: 'Almaarid', en: 'Almaarid'}),
  '/icons/store-placeholder.svg',
  json({
    nav: {
      home: {ar: 'الرئيسية', fr: 'Accueil', en: 'Home'},
      regions: {ar: 'الجهات', fr: 'Régions', en: 'Regions'},
      replayIntro: {ar: 'إعادة المقدمة', fr: "Rejouer l'intro", en: 'Replay intro'},
      theme: {ar: 'المظهر', fr: 'Thème', en: 'Theme'},
      language: {ar: 'اللغة', fr: 'Langue', en: 'Language'}
    },
    home: {
      eyebrow: {ar: 'منصة رقمية للتعاونيات المغربية', fr: 'Plateforme numérique pour les coopératives marocaines', en: 'Digital platform for Moroccan cooperatives'},
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
      sliderImages: ['/sliders/1.png', '/sliders/2.png', '/sliders/3.png'],
      visitorsOnline: {min: 100, max: 150},
      scrollTitle: {ar: 'استكشف الجهات', fr: 'Explorer les régions', en: 'Explore regions'},
      scrollSubtitle: {ar: 'يتغير ترتيب الجهات في كل زيارة ليبقى العرض عادلاً للجميع.', fr: 'L’ordre change à chaque visite pour offrir une visibilité équitable.', en: 'The order changes on every visit to keep regional visibility fair.'},
      skipIntro: {ar: 'تخطي المقدمة', fr: "Passer l'intro", en: 'Skip intro'},
      enter: {ar: 'ادخل المعرض', fr: 'Entrer', en: 'Enter showroom'}
    },
    intro: {
      eyebrow: {ar: 'المعرض', fr: 'Almaarid', en: 'Almaarid'},
      subtitle: {
        ar: 'من جبال الأطلس إلى الساحل والصحراء، تعبر التجربة ملامح المغرب بحركة سينمائية هادئة.',
        fr: 'Des montagnes de l’Atlas à la côte et au désert, l’expérience traverse le Maroc avec un mouvement cinématique fluide.',
        en: 'From the Atlas mountains to the coast and the desert, the experience moves through Morocco with quiet cinematic motion.'
      },
      skipIntro: {ar: 'تخطي', fr: 'Passer', en: 'Skip'},
      enter: {ar: 'ابدأ', fr: 'Commencer', en: 'Start'},
      backgroundImage: '/images/morocco-cinematic-hero.png'
    },
    footer: {
      eyebrow: {ar: 'المعرض', fr: 'Almaarid', en: 'Almaarid'},
      description: {
        ar: 'دليل بصري للتعاونيات المغربية يربط الجهة بالمنتج وبقصة الناس الذين يصنعون القيمة.',
        fr: 'Un guide visuel des coopératives marocaines reliant région, produit et récit humain.',
        en: 'A visual guide to Moroccan cooperatives linking region, product, and the people who make value.'
      },
      copyright: {ar: '© المعرض', fr: '© Almaarid', en: '© Almaarid'}
    }
  }),
  new Date().toISOString()
);

const count = db.prepare('SELECT COUNT(*) as count FROM regions').get();
if (count.count > 0) {
  console.log('Database already seeded.');
  process.exit(0);
}

const insertRegion = db.prepare(`
  INSERT INTO regions (id, slug, names_json, image, order_not_fixed, meta_json)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertCoop = db.prepare(`
  INSERT INTO cooperatives (
    id, region_id, name_json, logo, identity_image, product_images_json,
    story_json, description_json, contact_json, likes_count, views_count, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
`);

db.exec('BEGIN');
try {
  for (const [slug, names] of regions) {
    insertRegion.run(
      slug,
      slug,
      json(names),
      '/images/morocco-cinematic-hero.png',
      1,
      json({
        tagline: names,
        description: names,
        accent: '#dca64f',
        map: {x: 50, y: 50}
      })
    );
  }

  regions.forEach(([slug, names], regionIndex) => {
    for (let index = 0; index < 20; index += 1) {
      const categoryIndex = index % categories.ar.length;
      const number = String(index + 1).padStart(2, '0');
      const id = `${slug}-slot-${number}`;
      const now = new Date(Date.UTC(2026, 6, 16, 12, regionIndex, index)).toISOString();
      insertCoop.run(
        id,
        slug,
        json({
          ar: `تعاونية ${categories.ar[categoryIndex]} ${names.ar} ${number}`,
          fr: `Coopérative ${categories.fr[categoryIndex]} ${names.fr} ${number}`,
          en: `${names.en} ${categories.en[categoryIndex]} Cooperative ${number}`
        }),
        '/icons/store-placeholder.svg',
        '/images/morocco-cinematic-hero.png',
        json(['/images/morocco-cinematic-hero.png']),
        json({
          ar: `قصة تجريبية للتعاونية ${names.ar} تعرض هوية محلية جاهزة للتعديل.`,
          fr: `Histoire de démonstration pour la coopérative ${names.fr}.`,
          en: `Demo story for the ${names.en} cooperative.`
        }),
        json({
          ar: `وصف جاهز للتعديل داخل ${names.ar}.`,
          fr: `Description prête à être modifiée dans ${names.fr}.`,
          en: `Editable description for ${names.en}.`
        }),
        json({
          name: 'Admin Almaarid',
          phone: '+212 600 000 000',
          website: 'https://almaarid.local',
          email: 'contact@almaarid.local',
          address: names.fr,
          others: 'Demo slot'
        }),
        now,
        now
      );
    }
  });

  db.exec('COMMIT');
  console.log('Seed complete.');
} catch (error) {
  db.exec('ROLLBACK');
  throw error;
}
