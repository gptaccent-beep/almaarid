import {NextResponse} from 'next/server';
import {assertAdmin} from '@/lib/server/admin';
import {repository} from '@/lib/server/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const regionId = url.searchParams.get('regionId') || undefined;
  const userKey = url.searchParams.get('userKey') || undefined;
  const cooperatives = await repository().listCooperatives(regionId, userKey);
  return NextResponse.json({cooperatives});
}

export async function POST(request: Request) {
  const unauthorized = assertAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json();
  if (!body.regionId) {
    return NextResponse.json({error: 'regionId is required'}, {status: 400});
  }

  const cooperative = await repository().createCooperative(body.regionId);
  return NextResponse.json({cooperative}, {status: 201});
}
