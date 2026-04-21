import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('key') !== 'reviewsnap-dashboard-2025') {
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

  return NextResponse.json({
    total: products.length,
    itCount,
    enCount,
    recent,
  });
}
