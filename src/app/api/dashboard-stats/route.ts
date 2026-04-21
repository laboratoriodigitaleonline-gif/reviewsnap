import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllProducts } from '@/lib/store';
import { COOKIE_NAME, expectedToken } from '@/lib/dashboard-auth';

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get(COOKIE_NAME);
  const token = expectedToken();

  console.log('[dashboard-stats] cookie present:', !!session);
  console.log('[dashboard-stats] DASHBOARD_PASSWORD set:', !!token);

  if (!token || !session || session.value !== token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await getAllProducts();
  const itCount = products.filter(p => p.locale === 'it').length;
  const enCount = products.filter(p => p.locale === 'en').length;
  const recent = products.slice(0, 5).map(p => ({
    asin: p.asin,
    title: p.productName ?? p.asin,
    locale: p.locale,
    savedAt: p.savedAt,
  }));

  return NextResponse.json({ total: products.length, itCount, enCount, recent });
}
