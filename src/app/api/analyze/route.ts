import { NextRequest, NextResponse } from 'next/server';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { analyzeReviews } from '@/lib/analyzer';
import { saveProduct } from '@/lib/store';
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

    // Await the save — fire-and-forget is unsafe on Vercel serverless because
    // the function exits immediately after the response is returned, killing
    // any pending promises before they resolve.
    try {
      console.log('[store] saving product asin=%s kv_configured=%s', analysis.asin, !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN));
      await saveProduct(analysis, locale);
      console.log('[store] saved ok asin=%s', analysis.asin);
    } catch (err) {
      console.error('[store] save failed asin=%s error=%s', analysis.asin, err instanceof Error ? err.message : String(err));
    }

    return NextResponse.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
    console.error('[analyze]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
