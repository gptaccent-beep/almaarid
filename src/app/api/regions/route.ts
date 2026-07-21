import {NextResponse} from 'next/server';
import {repository} from '@/lib/server/repository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const regions = await repository().listRegions();
  return NextResponse.json({regions});
}
