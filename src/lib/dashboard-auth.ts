import { createHash } from 'crypto';

export const COOKIE_NAME = 'dashboard_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function cookieOptions(value: string, maxAge = COOKIE_MAX_AGE) {
  return [
    `${COOKIE_NAME}=${value}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ]
    .filter(Boolean)
    .join('; ');
}

export function isValidSession(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return false;
  const expected = hashPassword(password);
  const match = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  return match.slice(COOKIE_NAME.length + 1) === expected;
}
