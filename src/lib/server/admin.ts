import {NextResponse} from 'next/server';
import {createHash, timingSafeEqual} from 'node:crypto';

export const ADMIN_IDENTITY = process.env.ADMIN_IDENTITY || 'Admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123';
export const ADMIN_SESSION_COOKIE = 'almaarid_admin';

const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || `${ADMIN_IDENTITY}:${ADMIN_PASSWORD}:almaarid-demo-session`;
}

function adminSessionToken() {
  return createHash('sha256').update(sessionSecret()).digest('hex');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function cookieValue(request: Request, name: string) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : '';
}

export function validateAdminCredentials(identity: string, password: string) {
  return safeEqual(identity, ADMIN_IDENTITY) && safeEqual(password, ADMIN_PASSWORD);
}

export function isAdminRequest(request: Request) {
  return safeEqual(cookieValue(request, ADMIN_SESSION_COOKIE), adminSessionToken());
}

// Demo credential gate for the brief. Replace with real auth before a public launch.
export function assertAdmin(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({error: 'Unauthorized admin request'}, {status: 401});
  }

  return null;
}

export function withAdminSession(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: adminSessionToken(),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE
  });
  return response;
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
  return response;
}
