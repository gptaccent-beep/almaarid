import {NextResponse} from 'next/server';
import {isAdminRequest} from '@/lib/server/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return NextResponse.json({authenticated: isAdminRequest(request)});
}
