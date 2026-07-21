import {hasSupabase, supabaseRepository} from '@/lib/server/supabase';
import {sqliteRepository} from '@/lib/server/sqlite';

export function repository() {
  return hasSupabase() ? supabaseRepository : sqliteRepository;
}
