create table if not exists regions (
  id text primary key,
  slug text not null unique,
  names jsonb not null,
  image text not null,
  order_not_fixed boolean not null default true,
  meta jsonb not null
);

create table if not exists cooperatives (
  id text primary key,
  region_id text not null references regions(id) on delete cascade,
  name jsonb not null,
  logo text not null,
  identity_image text not null,
  product_images jsonb not null default '[]'::jsonb,
  story jsonb not null,
  description jsonb not null,
  contact jsonb not null,
  likes_count integer not null default 0,
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists likes (
  id text primary key,
  cooperative_id text not null references cooperatives(id) on delete cascade,
  user_key text not null,
  created_at timestamptz not null default now(),
  unique (cooperative_id, user_key)
);

create table if not exists views (
  id text primary key,
  cooperative_id text not null references cooperatives(id) on delete cascade,
  visitor_key text,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  id text primary key default 'main',
  name jsonb not null,
  logo text not null,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

insert into site_settings (id, name, logo, content)
values (
  'main',
  '{"ar":"المعارض","fr":"ALMAARID","en":"ALMAARID"}'::jsonb,
  '/icons/store-placeholder.svg',
  '{
    "nav":{"home":{"ar":"الرئيسية","fr":"Accueil","en":"Home"},"regions":{"ar":"الجهات","fr":"Régions","en":"Regions"},"replayIntro":{"ar":"إعادة المقدمة","fr":"Rejouer l''intro","en":"Replay intro"},"theme":{"ar":"المظهر","fr":"Thème","en":"Theme"},"language":{"ar":"اللغة","fr":"Langue","en":"Language"}},
    "home":{"eyebrow":{"ar":"منصة رقمية للتعاونيات المغربية","fr":"Plateforme numérique pour les coopératives marocaines","en":"Digital platform for Moroccan cooperatives"},"subtitle":{"ar":"واجهة بصرية فاخرة تضع قصص الحرف والمنتجات المحلية في مقدمة التجربة عبر جهات المغرب الاثنتي عشرة.","fr":"Un showroom visuel premium pour explorer les histoires, savoir-faire et produits locaux des douze régions du Maroc.","en":"A premium visual showroom for exploring the stories, craft, and local products of Morocco’s twelve regions."},"chooseRegion":{"ar":"اختر جهة","fr":"Choisir une région","en":"Choose a region"},"sliderHint":{"ar":"صور متحركة تعرض روح المغرب. اختر الجهة من البطاقات أسفلها.","fr":"Un carrousel visuel met en scène l’esprit du Maroc. Choisissez une région dans les cartes ci-dessous.","en":"A visual carousel presents the spirit of Morocco. Choose a region from the cards below."},"sliderImages":["/sliders/1.png","/sliders/2.png","/sliders/3.png"],"visitorsOnline":{"min":100,"max":150},"scrollTitle":{"ar":"استكشف الجهات","fr":"Explorer les régions","en":"Explore regions"},"scrollSubtitle":{"ar":"يتغير ترتيب الجهات في كل زيارة ليبقى العرض عادلاً للجميع.","fr":"L’ordre change à chaque visite pour offrir une visibilité équitable.","en":"The order changes on every visit to keep regional visibility fair."},"skipIntro":{"ar":"تخطي المقدمة","fr":"Passer l''intro","en":"Skip intro"},"enter":{"ar":"ادخل المعرض","fr":"Entrer","en":"Enter showroom"}},
    "intro":{"eyebrow":{"ar":"المعارض","fr":"ALMAARID","en":"ALMAARID"},"subtitle":{"ar":"من جبال الأطلس إلى الساحل والصحراء، تعبر التجربة ملامح المغرب بحركة سينمائية هادئة.","fr":"Des montagnes de l’Atlas à la côte et au désert, l’expérience traverse le Maroc avec un mouvement cinématique fluide.","en":"From the Atlas mountains to the coast and the desert, the experience moves through Morocco with quiet cinematic motion."},"skipIntro":{"ar":"تخطي","fr":"Passer","en":"Skip"},"enter":{"ar":"ابدأ","fr":"Commencer","en":"Start"},"backgroundImage":"/images/morocco-cinematic-hero.png"},
    "footer":{"eyebrow":{"ar":"المعارض","fr":"ALMAARID","en":"ALMAARID"},"description":{"ar":"دليل بصري للتعاونيات المغربية يربط الجهة بالمنتج وبقصة الناس الذين يصنعون القيمة.","fr":"Un guide visuel des coopératives marocaines reliant région, produit et récit humain.","en":"A visual guide to Moroccan cooperatives linking region, product, and the people who make value."},"copyright":{"ar":"© المعارض","fr":"© ALMAARID","en":"© ALMAARID"}}
  }'::jsonb
)
on conflict (id) do nothing;
