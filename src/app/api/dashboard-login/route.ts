import { NextResponse } from 'next/server';
import { hashPassword, expectedToken, COOKIE_NAME, COOKIE_MAX_AGE } from '@/lib/dashboard-auth';

export async function POST(req: Request) {
  const body = await req.json();
  const password: string = (body.password ?? '').trim();

  const envPassword = process.env.DASHBOARD_PASSWORD;

  console.log('[dashboard-login] DASHBOARD_PASSWORD set:', !!envPassword);
  console.log('[dashboard-login] password length received:', password.length);

  if (!envPassword) {
    return NextResponse.json({ error: 'Server misconfigured: DASHBOARD_PASSWORD not set' }, { status: 500 });
  }

  const inputHash = hashPassword(password);
  const correctHash = expectedToken()!;

  console.log('[dashboard-login] hashes match:', inputHash === correctHash);

  if (inputHash !== correctHash) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, correctHash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}
