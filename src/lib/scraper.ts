import * as cheerio from 'cheerio';
import type { Locale } from './translations';

export interface ScrapedData {
  productName: string;
  rating: number;
  reviewCount: number;
  reviews: string[];
  asin: string;
  imageUrl: string;
  price: string;
}

const SCRAPERAPI_KEY = process.env.SCRAPERAPI_KEY;

const LOCALE_CONFIG: Record<Locale, { domain: string; countryCode: string; acceptLanguage: string }> = {
  en: { domain: 'amazon.com', countryCode: 'us', acceptLanguage: 'en-US,en;q=0.9' },
  it: { domain: 'amazon.it',  countryCode: 'it', acceptLanguage: 'it-IT,it;q=0.9' },
};

function proxyUrl(target: string, countryCode: string): string {
  if (!SCRAPERAPI_KEY) return target;
  return (
    `https://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}` +
    `&url=${encodeURIComponent(target)}&country_code=${countryCode}`
  );
}

function directHeaders(acceptLanguage: string): Record<string, string> {
  return {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': acceptLanguage,
    'Cache-Control': 'no-cache',
    'Upgrade-Insecure-Requests': '1',
  };
}

export function extractAsin(rawUrl: string): string | null {
  // Build a set of candidate strings to search: raw URL, decoded URL,
  // and any nested URL found in the `url=` query parameter (sspa/sponsored clicks).
  const candidates: string[] = [rawUrl];
  try { candidates.push(decodeURIComponent(rawUrl)); } catch {}
  try {
    const parsed = new URL(rawUrl);
    const urlParam = parsed.searchParams.get('url');
    if (urlParam) {
      candidates.push(urlParam);
      try { candidates.push(decodeURIComponent(urlParam)); } catch {}
    }
  } catch {}

  const patterns = [
    /\/dp\/([A-Z0-9]{10})(?:[\/\?#]|$)/i,
    /\/gp\/product\/([A-Z0-9]{10})(?:[\/\?#]|$)/i,
    /\/gp\/aw\/d\/([A-Z0-9]{10})(?:[\/\?#]|$)/i,
    /\/ASIN\/([A-Z0-9]{10})(?:[\/\?#]|$)/i,
    /\/product\/([A-Z0-9]{10})(?:[\/\?#]|$)/i,
    /([A-Z0-9]{10})(?:[\/\?#]|$)/,
  ];

  for (const candidate of candidates) {
    for (const re of patterns) {
      const m = candidate.match(re);
      if (m) return m[1].toUpperCase();
    }
  }
  return null;
}

async function fetchPage(targetUrl: string, locale: Locale): Promise<string> {
  const { countryCode, acceptLanguage } = LOCALE_CONFIG[locale];
  const fetchUrl = proxyUrl(targetUrl, countryCode);
  const headers  = SCRAPERAPI_KEY ? {} : directHeaders(acceptLanguage);

  console.log(`[scraper] fetching url=${targetUrl} locale=${locale} country=${countryCode} via_proxy=${!!SCRAPERAPI_KEY}`);

  const res = await fetch(fetchUrl, { headers, redirect: 'follow' });

  console.log(`[scraper] response status=${res.status} ok=${res.ok} final_url=${res.url}`);

  if (!res.ok) throw new Error(`HTTP ${res.status} from ${targetUrl}`);

  const html = await res.text();

  console.log(`[scraper] html_length=${html.length} html_preview=${html.slice(0, 500).replace(/\s+/g, ' ')}`);

  return html;
}

function parseRating(text: string): number {
  // Handles "4.5 out of 5" (EN) and "4,5 su 5" (IT)
  const m = text.match(/(\d+[.,]?\d*)\s+(?:out\s+of|su)\s+5/i);
  return m ? parseFloat(m[1].replace(',', '.')) : 0;
}

function parseReviewCount(text: string): number {
  return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

export async function scrapeAmazonProduct(url: string, locale: Locale = 'en'): Promise<ScrapedData> {
  if (!SCRAPERAPI_KEY) {
    throw new Error(
      'Scraping requires a ScraperAPI key. ' +
        'Get a free key (1,000 req/month) at scraperapi.com, ' +
        'then add SCRAPERAPI_KEY=your_key to .env.local and restart the server.'
    );
  }

  // Resolve amzn.to / amzn.eu short links to their final URL
  if (/amzn\.(to|eu)\//i.test(url)) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (res.url) url = res.url;
    } catch {}
  }

  const asin = extractAsin(url);
  if (!asin) {
    throw new Error('Invalid Amazon URL — could not extract a product ID (ASIN).');
  }

  const MAX_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 2000;

  // The /product-reviews/ URL is blocked by Amazon for scrapers.
  // The product page (/dp/ASIN) is accessible and includes the top reviews inline.
  const { domain } = LOCALE_CONFIG[locale];
  const productUrl = `https://www.${domain}/dp/${asin}`;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) {
      console.log(`[scraper] retry attempt=${attempt} asin=${asin} delay=${RETRY_DELAY_MS}ms`);
      await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
    }

    try {
      const result = await attemptScrape(productUrl, asin, locale);
      if (attempt > 1) console.log(`[scraper] retry succeeded attempt=${attempt} asin=${asin}`);
      return result;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.log(`[scraper] attempt=${attempt} failed asin=${asin} error=${lastError.message}`);
    }
  }

  throw lastError!;
}

async function attemptScrape(productUrl: string, asin: string, locale: Locale): Promise<ScrapedData> {
  const html = await fetchPage(productUrl, locale);
  const $ = cheerio.load(html);

  // Detect bot wall / CAPTCHA
  const title = $('title').text().toLowerCase();
  console.log(`[scraper] page_title="${$('title').text().trim()}"`);

  if (
    html.includes('Type the characters you see in this image') ||
    html.includes('Enter the characters you see below') ||
    title.includes('robot') ||
    title.includes('page not found')
  ) {
    throw new Error(
      'Amazon returned a bot-detection page. ' +
        'ScraperAPI was unable to bypass it — please try again in a moment.'
    );
  }

  // Product name
  const productName =
    $('#productTitle').text().trim() ||
    $('h1.product-title-word-break').text().trim() ||
    'Unknown Product';

  // Rating (from the star widget)
  const ratingRaw =
    $('[data-hook="average-star-rating"] .a-offscreen').first().text() ||
    $('[data-hook="rating-out-of-text"]').first().text() ||
    $('#acrPopover .a-offscreen').first().text() ||
    $('span.a-icon-alt').first().text();
  const rating = parseRating(ratingRaw);

  // Total review count
  const countRaw =
    $('[data-hook="total-review-count"]').first().text() ||
    $('#acrCustomerReviewText').first().text();
  const reviewCount = parseReviewCount(countRaw);

  // Reviews — the product page embeds the top reviews inline (typically 8)
  const reviews: string[] = [];

  function extractReviewText(reviewEl: ReturnType<typeof $>[0]): string {
    const $rev = $(reviewEl);
    // .review-text-content holds the text on both amazon.com and amazon.it
    const $rtc = $rev.find('.review-text-content');
    if ($rtc.length) {
      // Local reviews: unclassed <span> child
      const plain = $rtc.find('span').not('[class]').first().text().trim();
      if (plain.length > 0) return plain;
      // Global/translated reviews: cr-original-review-content span
      const orig = $rtc.find('.cr-original-review-content').text().trim();
      if (orig.length > 0) return orig;
      // Last resort within rtc: strip UI chrome and return raw text
      const clone = $rtc.clone();
      clone.find('.a-expander-prompt, .a-expander-header, script').remove();
      const raw = clone.text().trim();
      if (raw.length > 0) return raw;
    }
    // amazon.com fallback: unclassed span directly inside review-body
    return $rev.find('[data-hook="review-body"]').find('span').not('[class]').first().text().trim();
  }

  // ① Local-language reviews (amazon.it: #cm-cr-dp-review-list; amazon.com: same list)
  const sel1count = $('#cm-cr-dp-review-list [data-hook="review"]').length;
  console.log(`[scraper] selector① #cm-cr-dp-review-list [data-hook="review"] count=${sel1count}`);
  $('#cm-cr-dp-review-list [data-hook="review"]').each((_, el) => {
    const body = extractReviewText(el);
    if (body.length > 40) reviews.push(body);
  });
  console.log(`[scraper] selector① extracted=${reviews.length}`);

  // ② Fall back to every review on the page (covers amazon.com layout and edge cases)
  if (reviews.length === 0) {
    const sel2count = $('[data-hook="review"]').length;
    console.log(`[scraper] selector② [data-hook="review"] count=${sel2count}`);
    $('[data-hook="review"]').each((_, el) => {
      const body = extractReviewText(el);
      if (body.length > 40) reviews.push(body);
    });
    console.log(`[scraper] selector② extracted=${reviews.length}`);
  }

  // ③ Last resort: walk review-body elements directly
  if (reviews.length === 0) {
    const sel3count = $('[data-hook="review-body"]').length;
    console.log(`[scraper] selector③ [data-hook="review-body"] count=${sel3count}`);
    $('[data-hook="review-body"]').each((_, el) => {
      const body = extractReviewText(el);
      if (body.length > 40) reviews.push(body);
    });
    console.log(`[scraper] selector③ extracted=${reviews.length}`);
  }

  if (reviews.length === 0) {
    throw new Error(
      `No reviews found for this product (ASIN: ${asin}). ` +
        'The product may have no reviews, or Amazon returned an unexpected page layout.'
    );
  }

  // Product image — parse the highest-resolution URL from data-a-dynamic-image JSON
  let imageUrl = '';
  const dynamicImageData = $('#landingImage').attr('data-a-dynamic-image');
  if (dynamicImageData) {
    try {
      const imageMap: Record<string, [number, number]> = JSON.parse(dynamicImageData);
      imageUrl =
        Object.entries(imageMap).sort(([, [wa]], [, [wb]]) => wb - wa)[0]?.[0] ?? '';
    } catch {}
  }
  if (!imageUrl) {
    imageUrl =
      $('#landingImage').attr('src') ||
      $('#imgTagWrapperId img').first().attr('src') ||
      $('#main-image-container img').first().attr('src') ||
      '';
  }

  // Price — try newest selector first, fall back to legacy ones
  const price =
    $('.priceToPay .a-offscreen').first().text().trim() ||
    $('#corePriceDisplay_desktop_feature_div .a-price .a-offscreen').first().text().trim() ||
    $('#priceblock_ourprice').text().trim() ||
    $('#priceblock_dealprice').text().trim() ||
    $('.a-price .a-offscreen').first().text().trim() ||
    '';

  return { productName, rating, reviewCount, reviews, asin, imageUrl, price };
}
