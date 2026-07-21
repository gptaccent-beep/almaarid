import {NextResponse} from 'next/server';
import {repository} from '@/lib/server/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{id: string}>;
};

export async function POST(request: Request, {params}: Params) {
  const {id} = await params;
  const body = await request.json().catch(() => ({}));
  const visitorKey = body.visitorKey || request.headers.get('x-visitor-key') || undefined;
  const result = await repository().incrementView(id, visitorKey);
  return NextResponse.json(result);
}
