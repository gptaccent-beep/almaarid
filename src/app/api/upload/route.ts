import {put} from '@vercel/blob';
import {NextResponse} from 'next/server';
import {assertAdmin} from '@/lib/server/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const unauthorized = assertAdmin(request);
  if (unauthorized) return unauthorized;

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({error: 'file is required'}, {status: 400});
  }

  try {
    // Vercel deployments cannot persist files written to public/uploads, so admin media must go to Blob storage.
    const blob = await put(file.name, file, {access: 'public'});
    return NextResponse.json({url: blob.url});
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({error: message}, {status: 500});
  }
}
