import { createHash } from 'crypto';

export const COOKIE_NAME = 'dashboard_session';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function hashPassword(password: string): string {
  return createHash('sha256').update(password.trim()).digest('hex');
}

export function expectedToken(): string | null {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return null;
  return hashPassword(password);
}
