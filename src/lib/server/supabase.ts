import {createClient} from '@supabase/supabase-js';
import {defaultSiteSettings, normalizeSiteContent, normalizeSiteSettings} from '@/lib/site-settings';
import type {Cooperative, CooperativeInput, Region, SiteSettings} from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabase() {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

function client() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase is not configured');
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {persistSession: false}
  });
}

function regionFromSupabase(row: any): Region {
  return {
    id: row.id,
    slug: row.slug,
    names: row.names,
    image: row.image,
    orderNotFixed: row.order_not_fixed,
    meta: row.meta
  };
}

function cooperativeFromSupabase(row: any): Cooperative {
  return {
    id: row.id,
    regionId: row.region_id,
    name: row.name,
    logo: row.logo,
    identityImage: row.identity_image,
    productImages: row.product_images || [],
    story: row.story,
    description: row.description,
    contact: row.contact,
    likesCount: row.likes_count || 0,
    viewsCount: row.views_count || 0,
    liked: row.liked,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function siteSettingsFromSupabase(row: any): SiteSettings {
  return normalizeSiteSettings({
    id: 'main',
    name: row.name || defaultSiteSettings.name,
    logo: row.logo || defaultSiteSettings.logo,
    content: normalizeSiteContent(row.content || defaultSiteSettings.content),
    updatedAt: row.updated_at
  });
}

export const supabaseRepository = {
  async getSiteSettings(): Promise<SiteSettings> {
    const {data, error} = await client().from('site_settings').select('*').eq('id', 'main').maybeSingle();
    if (error) throw error;
    return data ? siteSettingsFromSupabase(data) : defaultSiteSettings;
  },

  async updateSiteSettings(input: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const payload = {
      id: 'main',
      name: input.name || current.name,
      logo: input.logo || current.logo,
      content: normalizeSiteContent(input.content || current.content),
      updated_at: new Date().toISOString()
    };
    const {data, error} = await client()
      .from('site_settings')
      .upsert(payload, {onConflict: 'id'})
      .select('*')
      .single();
    if (error) throw error;
    return siteSettingsFromSupabase(data);
  },

  async listRegions(): Promise<Region[]> {
    const {data, error} = await client().from('regions').select('*').order('slug');
    if (error) throw error;
    return (data || []).map(regionFromSupabase);
  },

  async getRegion(idOrSlug: string): Promise<Region | null> {
    const {data, error} = await client()
      .from('regions')
      .select('*')
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .maybeSingle();
    if (error) throw error;
    return data ? regionFromSupabase(data) : null;
  },

  async updateRegion(id: string, input: Partial<Region>): Promise<Region | null> {
    const payload = {
      slug: input.slug,
      names: input.names,
      image: input.image,
      order_not_fixed: input.orderNotFixed,
      meta: input.meta
    };
    const {data, error} = await client().from('regions').update(payload).eq('id', id).select('*').maybeSingle();
    if (error) throw error;
    return data ? regionFromSupabase(data) : null;
  },

  async listCooperatives(regionId?: string, userKey?: string): Promise<Cooperative[]> {
    let query = client().from('cooperatives').select('*').order('created_at');
    if (regionId) query = query.eq('region_id', regionId);
    const {data, error} = await query;
    if (error) throw error;

    const cooperatives = (data || []).map(cooperativeFromSupabase);
    if (!userKey || cooperatives.length === 0) return cooperatives;

    const {data: likes} = await client()
      .from('likes')
      .select('cooperative_id')
      .eq('user_key', userKey)
      .in(
        'cooperative_id',
        cooperatives.map((item) => item.id)
      );
    const liked = new Set((likes || []).map((item) => item.cooperative_id));
    return cooperatives.map((item) => ({...item, liked: liked.has(item.id)}));
  },

  async getCooperative(id: string, userKey?: string): Promise<Cooperative | null> {
    const {data, error} = await client().from('cooperatives').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const cooperative = cooperativeFromSupabase(data);

    if (userKey) {
      const {data: like} = await client()
        .from('likes')
        .select('id')
        .eq('cooperative_id', id)
        .eq('user_key', userKey)
        .maybeSingle();
      cooperative.liked = Boolean(like);
    }

    return cooperative;
  },

  async createCooperative(regionId: string): Promise<Cooperative> {
    const now = new Date().toISOString();
    const {nanoid} = await import('nanoid');
    const payload = {
      id: `coop-${nanoid(10)}`,
      region_id: regionId,
      name: {ar: 'تعاونية جديدة', fr: 'Nouvelle coopérative', en: 'New cooperative'},
      logo: '/icons/store-placeholder.svg',
      identity_image: '/images/morocco-cinematic-hero.png',
      product_images: ['/images/morocco-cinematic-hero.png'],
      story: {ar: '', fr: '', en: ''},
      description: {ar: '', fr: '', en: ''},
      contact: {name: '', phone: '', website: '', email: '', address: '', others: ''},
      likes_count: 0,
      views_count: 0,
      created_at: now,
      updated_at: now
    };
    const {data, error} = await client().from('cooperatives').insert(payload).select('*').single();
    if (error) throw error;
    return cooperativeFromSupabase(data);
  },

  async updateCooperative(id: string, input: Partial<CooperativeInput>): Promise<Cooperative | null> {
    const payload = {
      region_id: input.regionId,
      name: input.name,
      logo: input.logo,
      identity_image: input.identityImage,
      product_images: input.productImages,
      story: input.story,
      description: input.description,
      contact: input.contact,
      updated_at: new Date().toISOString()
    };
    const {data, error} = await client().from('cooperatives').update(payload).eq('id', id).select('*').maybeSingle();
    if (error) throw error;
    return data ? cooperativeFromSupabase(data) : null;
  },

  async deleteCooperative(id: string) {
    const {error} = await client().from('cooperatives').delete().eq('id', id);
    if (error) throw error;
    return {ok: true};
  },

  async toggleLike(id: string, userKey: string) {
    const supabase = client();
    const existing = await supabase
      .from('likes')
      .select('id')
      .eq('cooperative_id', id)
      .eq('user_key', userKey)
      .maybeSingle();

    if (existing.data) {
      await supabase.from('likes').delete().eq('id', existing.data.id);
      const current = await this.getCooperative(id);
      const likesCount = Math.max((current?.likesCount || 1) - 1, 0);
      await supabase.from('cooperatives').update({likes_count: likesCount}).eq('id', id);
      return {liked: false, likesCount};
    }

    const {nanoid} = await import('nanoid');
    await supabase.from('likes').insert({
      id: `like-${nanoid(12)}`,
      cooperative_id: id,
      user_key: userKey,
      created_at: new Date().toISOString()
    });
    const current = await this.getCooperative(id);
    const likesCount = (current?.likesCount || 0) + 1;
    await supabase.from('cooperatives').update({likes_count: likesCount}).eq('id', id);
    return {liked: true, likesCount};
  },

  async incrementView(id: string, visitorKey?: string) {
    const supabase = client();
    const {nanoid} = await import('nanoid');
    await supabase.from('views').insert({
      id: `view-${nanoid(12)}`,
      cooperative_id: id,
      visitor_key: visitorKey,
      created_at: new Date().toISOString()
    });
    const current = await this.getCooperative(id);
    const viewsCount = (current?.viewsCount || 0) + 1;
    await supabase.from('cooperatives').update({views_count: viewsCount}).eq('id', id);
    return {viewsCount};
  }
};
