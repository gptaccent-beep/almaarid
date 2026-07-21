import {DatabaseSync} from 'node:sqlite';
import {nanoid} from 'nanoid';
import fs from 'node:fs';
import path from 'node:path';
import {createAllDemoCooperatives} from '@/lib/demo-content';
import {defaultIdentityImage, defaultLogo, regionsSeed} from '@/lib/regions';
import {defaultSiteSettings, normalizeSiteContent, normalizeSiteSettings} from '@/lib/site-settings';
import type {Cooperative, CooperativeInput, ContactInfo, LocalizedText, Region, RegionMeta, SiteSettings} from '@/lib/types';
import {safeJsonParse} from '@/lib/utils';

type RegionRow = {
  id: string;
  slug: string;
  names_json: string;
  image: string;
  order_not_fixed: number;
  meta_json: string;
};

type CooperativeRow = {
  id: string;
  region_id: string;
  name_json: string;
  logo: string;
  identity_image: string;
  product_images_json: string;
  story_json: string;
  description_json: string;
  contact_json: string;
  likes_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
  liked?: number;
};

type SiteSettingsRow = {
  id: string;
  name_json: string;
  logo: string;
  content_json?: string | null;
  updated_at: string;
};

const dataDir = path.join(process.cwd(), 'data');
const databasePath = path.join(dataDir, 'almaarid.sqlite');

let db: DatabaseSync | null = null;

function json(value: unknown) {
  return JSON.stringify(value);
}

function ensureDir() {
  fs.mkdirSync(dataDir, {recursive: true});
}

function withTransaction<T>(database: DatabaseSync, fn: () => T): T {
  database.exec('BEGIN');
  try {
    const result = fn();
    database.exec('COMMIT');
    return result;
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}

function createTables(database: DatabaseSync) {
  database.exec(`
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
      updated_at TEXT NOT NULL,
      FOREIGN KEY(region_id) REFERENCES regions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      cooperative_id TEXT NOT NULL,
      user_key TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(cooperative_id, user_key),
      FOREIGN KEY(cooperative_id) REFERENCES cooperatives(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS views (
      id TEXT PRIMARY KEY,
      cooperative_id TEXT NOT NULL,
      visitor_key TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY(cooperative_id) REFERENCES cooperatives(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id TEXT PRIMARY KEY,
      name_json TEXT NOT NULL,
      logo TEXT NOT NULL,
      content_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

function ensureSiteSettingsMigration(database: DatabaseSync) {
  const columns = database.prepare('PRAGMA table_info(site_settings)').all() as Array<{name: string}>;
  if (!columns.some((column) => column.name === 'content_json')) {
    database.exec('ALTER TABLE site_settings ADD COLUMN content_json TEXT');
  }
  database
    .prepare('UPDATE site_settings SET content_json = COALESCE(content_json, @content_json)')
    .run({content_json: json(defaultSiteSettings.content)});
}

function seedSiteSettings(database: DatabaseSync) {
  const existing = database.prepare('SELECT id FROM site_settings WHERE id = @id').get({id: defaultSiteSettings.id});
  if (existing) return;

  database
    .prepare(
      'INSERT INTO site_settings (id, name_json, logo, content_json, updated_at) VALUES (@id, @name_json, @logo, @content_json, @updated_at)'
    )
    .run({
      id: defaultSiteSettings.id,
      name_json: json(defaultSiteSettings.name),
      logo: defaultSiteSettings.logo,
      content_json: json(defaultSiteSettings.content),
      updated_at: new Date().toISOString()
    });
}

function seedIfNeeded(database: DatabaseSync) {
  const count = database.prepare('SELECT COUNT(*) as count FROM regions').get() as {count: number};
  if (count.count > 0) return;

  const insertRegion = database.prepare(`
    INSERT INTO regions (id, slug, names_json, image, order_not_fixed, meta_json)
    VALUES (@id, @slug, @names_json, @image, @order_not_fixed, @meta_json)
  `);
  const insertCooperative = database.prepare(`
    INSERT INTO cooperatives (
      id, region_id, name_json, logo, identity_image, product_images_json,
      story_json, description_json, contact_json, likes_count, views_count, created_at, updated_at
    )
    VALUES (
      @id, @region_id, @name_json, @logo, @identity_image, @product_images_json,
      @story_json, @description_json, @contact_json, @likes_count, @views_count, @created_at, @updated_at
    )
  `);

  withTransaction(database, () => {
    for (const region of regionsSeed) {
      insertRegion.run({
        id: region.id,
        slug: region.slug,
        names_json: json(region.names),
        image: region.image,
        order_not_fixed: region.orderNotFixed ? 1 : 0,
        meta_json: json(region.meta)
      });
    }

    for (const cooperative of createAllDemoCooperatives()) {
      insertCooperative.run({
        id: cooperative.id,
        region_id: cooperative.regionId,
        name_json: json(cooperative.name),
        logo: cooperative.logo,
        identity_image: cooperative.identityImage,
        product_images_json: json(cooperative.productImages),
        story_json: json(cooperative.story),
        description_json: json(cooperative.description),
        contact_json: json(cooperative.contact),
        likes_count: cooperative.likesCount,
        views_count: cooperative.viewsCount,
        created_at: cooperative.createdAt,
        updated_at: cooperative.updatedAt || cooperative.createdAt
      });
    }
  });
}

export function getSqliteDb() {
  if (db) return db;
  ensureDir();
  db = new DatabaseSync(databasePath);
  createTables(db);
  ensureSiteSettingsMigration(db);
  seedIfNeeded(db);
  seedSiteSettings(db);
  return db;
}

function regionFromRow(row: RegionRow): Region {
  return {
    id: row.id,
    slug: row.slug,
    names: safeJsonParse<LocalizedText>(row.names_json, {ar: row.slug, fr: row.slug, en: row.slug}),
    image: row.image,
    orderNotFixed: Boolean(row.order_not_fixed),
    meta: safeJsonParse<RegionMeta>(row.meta_json, {
      tagline: {ar: '', fr: '', en: ''},
      description: {ar: '', fr: '', en: ''},
      accent: '#cea037',
      map: {x: 50, y: 50}
    })
  };
}

function cooperativeFromRow(row: CooperativeRow): Cooperative {
  return {
    id: row.id,
    regionId: row.region_id,
    name: safeJsonParse<LocalizedText>(row.name_json, {ar: row.id, fr: row.id, en: row.id}),
    logo: row.logo,
    identityImage: row.identity_image,
    productImages: safeJsonParse<string[]>(row.product_images_json, []),
    story: safeJsonParse<LocalizedText>(row.story_json, {ar: '', fr: '', en: ''}),
    description: safeJsonParse<LocalizedText>(row.description_json, {ar: '', fr: '', en: ''}),
    contact: safeJsonParse<ContactInfo>(row.contact_json, {name: '', phone: '', website: ''}),
    likesCount: row.likes_count,
    viewsCount: row.views_count,
    liked: row.liked === undefined ? undefined : Boolean(row.liked),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function siteSettingsFromRow(row: SiteSettingsRow | undefined): SiteSettings {
  if (!row) return defaultSiteSettings;
  return normalizeSiteSettings({
    id: 'main',
    name: safeJsonParse<LocalizedText>(row.name_json, defaultSiteSettings.name),
    logo: row.logo || defaultSiteSettings.logo,
    content: normalizeSiteContent(safeJsonParse(row.content_json || '', defaultSiteSettings.content)),
    updatedAt: row.updated_at
  });
}

export const sqliteRepository = {
  getSiteSettings(): SiteSettings {
    const database = getSqliteDb();
    const row = database
      .prepare('SELECT * FROM site_settings WHERE id = @id')
      .get({id: defaultSiteSettings.id}) as SiteSettingsRow | undefined;
    return siteSettingsFromRow(row);
  },

  updateSiteSettings(input: Partial<SiteSettings>): SiteSettings {
    const database = getSqliteDb();
    const existing = this.getSiteSettings();
    const updatedAt = new Date().toISOString();
    const next = normalizeSiteSettings({
      ...existing,
      ...input,
      id: 'main',
      name: input.name || existing.name,
      logo: input.logo || existing.logo,
      content: normalizeSiteContent(input.content || existing.content),
      updatedAt
    });

    database
      .prepare(
        `INSERT INTO site_settings (id, name_json, logo, content_json, updated_at)
         VALUES (@id, @name_json, @logo, @content_json, @updated_at)
         ON CONFLICT(id) DO UPDATE SET
           name_json = excluded.name_json,
           logo = excluded.logo,
           content_json = excluded.content_json,
           updated_at = excluded.updated_at`
      )
      .run({
        id: next.id,
        name_json: json(next.name),
        logo: next.logo,
        content_json: json(next.content),
        updated_at: updatedAt
      });

    return this.getSiteSettings();
  },

  listRegions(): Region[] {
    const database = getSqliteDb();
    return (database.prepare('SELECT * FROM regions ORDER BY slug ASC').all() as RegionRow[]).map(regionFromRow);
  },

  getRegion(idOrSlug: string): Region | null {
    const database = getSqliteDb();
    const row = database
      .prepare('SELECT * FROM regions WHERE id = @id OR slug = @slug')
      .get({id: idOrSlug, slug: idOrSlug}) as RegionRow | undefined;
    return row ? regionFromRow(row) : null;
  },

  updateRegion(id: string, input: Partial<Region>): Region | null {
    const database = getSqliteDb();
    const existing = this.getRegion(id);
    if (!existing) return null;

    const next: Region = {
      ...existing,
      ...input,
      names: input.names || existing.names,
      meta: input.meta || existing.meta
    };

    database
      .prepare(
        `UPDATE regions
         SET slug = @slug, names_json = @names_json, image = @image, order_not_fixed = @order_not_fixed, meta_json = @meta_json
         WHERE id = @id`
      )
      .run({
        id: existing.id,
        slug: next.slug,
        names_json: json(next.names),
        image: next.image,
        order_not_fixed: next.orderNotFixed ? 1 : 0,
        meta_json: json(next.meta)
      });

    return this.getRegion(id);
  },

  listCooperatives(regionId?: string, userKey?: string): Cooperative[] {
    const database = getSqliteDb();
    const likedSelect = userKey
      ? `EXISTS(SELECT 1 FROM likes WHERE likes.cooperative_id = cooperatives.id AND likes.user_key = @userKey) as liked`
      : `NULL as liked`;
    const where = regionId ? 'WHERE region_id = @regionId' : '';
    const params: Record<string, string> = {};
    if (regionId) params.regionId = regionId;
    if (userKey) params.userKey = userKey;
    const rows = database
      .prepare(`SELECT cooperatives.*, ${likedSelect} FROM cooperatives ${where} ORDER BY created_at ASC`)
      .all(params) as CooperativeRow[];
    return rows.map(cooperativeFromRow);
  },

  getCooperative(id: string, userKey?: string): Cooperative | null {
    const database = getSqliteDb();
    const likedSelect = userKey
      ? `EXISTS(SELECT 1 FROM likes WHERE likes.cooperative_id = cooperatives.id AND likes.user_key = @userKey) as liked`
      : `NULL as liked`;
    const params: Record<string, string> = {id};
    if (userKey) params.userKey = userKey;
    const row = database
      .prepare(`SELECT cooperatives.*, ${likedSelect} FROM cooperatives WHERE id = @id`)
      .get(params) as CooperativeRow | undefined;
    return row ? cooperativeFromRow(row) : null;
  },

  createCooperative(regionId: string): Cooperative {
    const database = getSqliteDb();
    const id = `coop-${nanoid(10)}`;
    const now = new Date().toISOString();
    const blank: CooperativeInput = {
      id,
      regionId,
      name: {ar: 'تعاونية جديدة', fr: 'Nouvelle coopérative', en: 'New cooperative'},
      logo: defaultLogo,
      identityImage: defaultIdentityImage,
      productImages: [defaultIdentityImage],
      story: {ar: '', fr: '', en: ''},
      description: {ar: '', fr: '', en: ''},
      contact: {name: '', phone: '', website: '', email: '', address: '', others: ''}
    };

    database
      .prepare(
        `INSERT INTO cooperatives (
          id, region_id, name_json, logo, identity_image, product_images_json,
          story_json, description_json, contact_json, likes_count, views_count, created_at, updated_at
        )
        VALUES (
          @id, @region_id, @name_json, @logo, @identity_image, @product_images_json,
          @story_json, @description_json, @contact_json, 0, 0, @created_at, @updated_at
        )`
      )
      .run({
        id: blank.id,
        region_id: blank.regionId,
        name_json: json(blank.name),
        logo: blank.logo,
        identity_image: blank.identityImage,
        product_images_json: json(blank.productImages),
        story_json: json(blank.story),
        description_json: json(blank.description),
        contact_json: json(blank.contact),
        created_at: now,
        updated_at: now
      });

    return this.getCooperative(id) as Cooperative;
  },

  updateCooperative(id: string, input: Partial<CooperativeInput>): Cooperative | null {
    const database = getSqliteDb();
    const existing = this.getCooperative(id);
    if (!existing) return null;

    const next = {
      ...existing,
      ...input,
      id: existing.id,
      regionId: input.regionId || existing.regionId,
      name: input.name || existing.name,
      story: input.story || existing.story,
      description: input.description || existing.description,
      contact: input.contact || existing.contact,
      productImages: input.productImages || existing.productImages,
      updatedAt: new Date().toISOString()
    };

    database
      .prepare(
        `UPDATE cooperatives
         SET region_id = @region_id, name_json = @name_json, logo = @logo, identity_image = @identity_image,
             product_images_json = @product_images_json, story_json = @story_json, description_json = @description_json,
             contact_json = @contact_json, updated_at = @updated_at
         WHERE id = @id`
      )
      .run({
        id,
        region_id: next.regionId,
        name_json: json(next.name),
        logo: next.logo,
        identity_image: next.identityImage,
        product_images_json: json(next.productImages),
        story_json: json(next.story),
        description_json: json(next.description),
        contact_json: json(next.contact),
        updated_at: next.updatedAt
      });

    return this.getCooperative(id);
  },

  deleteCooperative(id: string) {
    const database = getSqliteDb();
    database.prepare('DELETE FROM cooperatives WHERE id = @id').run({id});
    return {ok: true};
  },

  toggleLike(id: string, userKey: string) {
    const database = getSqliteDb();
    const now = new Date().toISOString();

    return withTransaction(database, () => {
      const existing = database
        .prepare('SELECT id FROM likes WHERE cooperative_id = @id AND user_key = @userKey')
        .get({id, userKey}) as {id: string} | undefined;

      if (existing) {
        database.prepare('DELETE FROM likes WHERE id = @id').run({id: existing.id});
        database
          .prepare('UPDATE cooperatives SET likes_count = MAX(likes_count - 1, 0), updated_at = @updatedAt WHERE id = @id')
          .run({id, updatedAt: now});
        const row = database.prepare('SELECT likes_count FROM cooperatives WHERE id = @id').get({id}) as {
          likes_count: number;
        };
        return {liked: false, likesCount: row.likes_count};
      }

      database
        .prepare('INSERT INTO likes (id, cooperative_id, user_key, created_at) VALUES (@id, @cooperativeId, @userKey, @createdAt)')
        .run({
          id: `like-${nanoid(12)}`,
          cooperativeId: id,
          userKey,
          createdAt: now
        });
      database
        .prepare('UPDATE cooperatives SET likes_count = likes_count + 1, updated_at = @updatedAt WHERE id = @id')
        .run({id, updatedAt: now});
      const row = database.prepare('SELECT likes_count FROM cooperatives WHERE id = @id').get({id}) as {
        likes_count: number;
      };
      return {liked: true, likesCount: row.likes_count};
    });
  },

  incrementView(id: string, visitorKey?: string) {
    const database = getSqliteDb();
    const now = new Date().toISOString();

    return withTransaction(database, () => {
      database
        .prepare('INSERT INTO views (id, cooperative_id, visitor_key, created_at) VALUES (@id, @cooperativeId, @visitorKey, @createdAt)')
        .run({
          id: `view-${nanoid(12)}`,
          cooperativeId: id,
          visitorKey: visitorKey ?? null,
          createdAt: now
        });
      database
        .prepare('UPDATE cooperatives SET views_count = views_count + 1, updated_at = @updatedAt WHERE id = @id')
        .run({id, updatedAt: now});
      const row = database.prepare('SELECT views_count FROM cooperatives WHERE id = @id').get({id}) as {
        views_count: number;
      };
      return {viewsCount: row.views_count};
    });
  }
};
