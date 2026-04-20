import { NextRequest, NextResponse } from 'next/server';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { analyzeReviews } from '@/lib/analyzer';
import type { Locale } from '@/lib/translations';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url: string = body?.url?.trim();
    const locale: Locale = body?.locale === 'it' ? 'it' : 'en';

    if (!url) {
      return NextResponse.json({ error: 'A URL is required.' }, { status: 400 });
    }

    const isAmazon =
      url.includes('amazon.com') ||
      url.includes('amazon.it') ||
      url.includes('amazon.co.uk') ||
      url.includes('amazon.ca') ||
      url.includes('amazon.de') ||
      url.includes('amzn.to');

    if (!isAmazon) {
      return NextResponse.json(
        { error: 'Please provide a valid Amazon product URL.' },
        { status: 400 }
      );
    }

    const scraped = await scrapeAmazonProduct(url, locale);
    const analysis = await analyzeReviews(scraped, locale);

    return NextResponse.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
    console.error('[analyze]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
