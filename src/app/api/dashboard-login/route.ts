import { NextResponse } from 'next/server';
import { hashPassword, cookieOptions } from '@/lib/dashboard-auth';

export async function POST(req: Request) {
  const { password } = await req.json();

  const envPassword = process.env.DASHBOARD_PASSWORD;
  if (!envPassword) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (password !== envPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = hashPassword(envPassword);
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', cookieOptions(token));
  return res;
}
