import {NextResponse} from 'next/server';
import {assertAdmin} from '@/lib/server/admin';
import {repository} from '@/lib/server/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{id: string}>;
};

export async function GET(request: Request, {params}: Params) {
  const {id} = await params;
  const url = new URL(request.url);
  const userKey = url.searchParams.get('userKey') || undefined;
  const cooperative = await repository().getCooperative(id, userKey);
  if (!cooperative) return NextResponse.json({error: 'Cooperative not found'}, {status: 404});
  return NextResponse.json({cooperative});
}

export async function PUT(request: Request, {params}: Params) {
  const unauthorized = assertAdmin(request);
  if (unauthorized) return unauthorized;

  const {id} = await params;
  const body = await request.json();
  const cooperative = await repository().updateCooperative(id, body);
  if (!cooperative) return NextResponse.json({error: 'Cooperative not found'}, {status: 404});
  return NextResponse.json({cooperative});
}

export async function DELETE(request: Request, {params}: Params) {
  const unauthorized = assertAdmin(request);
  if (unauthorized) return unauthorized;

  const {id} = await params;
  const result = await repository().deleteCooperative(id);
  return NextResponse.json(result);
}
