import {NextResponse} from 'next/server';
import {repository} from '@/lib/server/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{id: string}>;
};

export async function POST(request: Request, {params}: Params) {
  const {id} = await params;
  const body = await request.json();
  const userKey = body.userKey || request.headers.get('x-user-key');

  if (!userKey) {
    return NextResponse.json({error: 'userKey is required'}, {status: 400});
  }

  const result = await repository().toggleLike(id, userKey);
  return NextResponse.json(result);
}
