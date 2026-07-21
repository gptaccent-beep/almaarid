import {NextResponse} from 'next/server';
import {hasSupabase} from '@/lib/server/supabase';

export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({
    ok: true,
    backend: hasSupabase() ? 'supabase' : 'sqlite'
  });
}
