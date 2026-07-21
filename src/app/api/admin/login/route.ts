import {NextResponse} from 'next/server';
import {validateAdminCredentials, withAdminSession} from '@/lib/server/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {identity?: string; password?: string};

  if (!validateAdminCredentials(body.identity || '', body.password || '')) {
    return NextResponse.json({error: 'Invalid credentials'}, {status: 401});
  }

  return withAdminSession(NextResponse.json({ok: true}));
}
