import * as cheerio from 'cheerio';

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

function proxyUrl(target: string): string {
  if (!SCRAPERAPI_KEY) return target;
  return (
    `https://api.scraperapi.com?api_key=${SCRAPERAPI_KEY}` +
    `&url=${encodeURIComponent(target)}&country_code=us`
  );
}

// Headers used only when ScraperAPI is not configured (direct fetch fallback)
const DIRECT_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Upgrade-Insecure-Requests': '1',
};

export function extractAsin(url: string): string | null {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/i,
    /\/gp\/product\/([A-Z0-9]{10})/i,
    /\/ASIN\/([A-Z0-9]{10})/i,
    /\/product\/([A-Z0-9]{10})/i,
    /([A-Z0-9]{10})(?:[/?]|$)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1].toUpperCase();
  }
  return null;
}

async function fetchPage(targetUrl: string): Promise<string> {
  const fetchUrl = proxyUrl(targetUrl);
  const headers  = SCRAPERAPI_KEY ? {} : DIRECT_HEADERS;
  const res      = await fetch(fetchUrl, { headers, redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${targetUrl}`);
  return res.text();
}

function parseRating(text: string): number {
  const m = text.match(/(\d+\.?\d*)\s+out\s+of\s+5/i);
  return m ? parseFloat(m[1]) : 0;
}

function parseReviewCount(text: string): number {
  return parseInt(text.replace(/[^0-9]/g, ''), 10) || 0;
}

export async function scrapeAmazonProduct(url: string): Promise<ScrapedData> {
  if (!SCRAPERAPI_KEY) {
    throw new Error(
      'Scraping requires a ScraperAPI key. ' +
        'Get a free key (1,000 req/month) at scraperapi.com, ' +
        'then add SCRAPERAPI_KEY=your_key to .env.local and restart the server.'
    );
  }

  const asin = extractAsin(url);
  if (!asin) {
    throw new Error('Invalid Amazon URL — could not extract a product ID (ASIN).');
  }

  // The /product-reviews/ URL is blocked by Amazon for scrapers.
  // The product page (/dp/ASIN) is accessible and includes the top reviews inline.
  const productUrl = `https://www.amazon.com/dp/${asin}`;
  const html = await fetchPage(productUrl);
  const $ = cheerio.load(html);

  // Detect bot wall / CAPTCHA
  const title = $('title').text().toLowerCase();
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

  $('[data-hook="review"]').each((_, reviewEl) => {
    const body = $(reviewEl).find('[data-hook="review-body"]').find('span').not('[class]').first().text().trim();
    if (body.length > 40) reviews.push(body);
  });

  // Fallback: grab any review-body spans if the above found nothing
  if (reviews.length === 0) {
    $('[data-hook="review-body"]').each((_, el) => {
      const text = $(el).find('span').first().text().trim();
      if (text.length > 40) reviews.push(text);
    });
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
