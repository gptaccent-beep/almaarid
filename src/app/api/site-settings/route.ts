import {NextResponse} from 'next/server';
import {assertAdmin} from '@/lib/server/admin';
import {repository} from '@/lib/server/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await repository().getSiteSettings();
  return NextResponse.json({settings});
}

export async function PUT(request: Request) {
  const unauthorized = assertAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json();
  const settings = await repository().updateSiteSettings(body);
  return NextResponse.json({settings});
}
