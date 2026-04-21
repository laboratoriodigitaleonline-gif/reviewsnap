import { NextResponse } from 'next/server';
import { cookieOptions } from '@/lib/dashboard-auth';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', cookieOptions('', 0));
  return res;
}
