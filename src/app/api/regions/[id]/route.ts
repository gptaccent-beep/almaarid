import {NextResponse} from 'next/server';
import {assertAdmin} from '@/lib/server/admin';
import {repository} from '@/lib/server/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{id: string}>;
};

export async function GET(_request: Request, {params}: Params) {
  const {id} = await params;
  const region = await repository().getRegion(id);
  if (!region) return NextResponse.json({error: 'Region not found'}, {status: 404});
  return NextResponse.json({region});
}

export async function PUT(request: Request, {params}: Params) {
  const unauthorized = assertAdmin(request);
  if (unauthorized) return unauthorized;

  const {id} = await params;
  const body = await request.json();
  const region = await repository().updateRegion(id, body);
  if (!region) return NextResponse.json({error: 'Region not found'}, {status: 404});
  return NextResponse.json({region});
}
