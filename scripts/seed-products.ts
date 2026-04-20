// Seed script: analyzes top Amazon products and saves them to the database.
// Run with: npm run seed
//
// NOTE: ASINs below are verified against amazon.com as of mid-2025.
// If a product page has changed, the scraper will log the failure and continue.

// Env vars are loaded via --env-file=.env.local in the npm script, which
// runs before any module code — no runtime loadEnvConfig call needed.
import { scrapeAmazonProduct } from '../src/lib/scraper';
import { analyzeReviews } from '../src/lib/analyzer';
import { saveProduct, getProduct } from '../src/lib/store';

interface Product {
  name: string;
  asin: string;
  category: string;
}

const PRODUCTS: Product[] = [
  // ── Electronics ────────────────────────────────────────────────────────────
  { name: 'Apple iPhone 15 128GB',              asin: 'B0CHX1W1XY', category: 'Electronics' },
  { name: 'Samsung Galaxy S24 128GB',           asin: 'B0CMDWC436',  category: 'Electronics' },
  { name: 'Apple AirPods Pro 2nd Gen',          asin: 'B0CHWRXH8B', category: 'Electronics' },
  { name: 'Sony WH-1000XM5 Headphones',         asin: 'B09XS7JWHH', category: 'Electronics' },
  { name: 'Kindle Paperwhite 16GB',             asin: 'B09TMF6742',  category: 'Electronics' },
  { name: 'Echo Dot 5th Gen',                   asin: 'B09B8V1LZ3',  category: 'Electronics' },
  { name: 'Apple iPad 10th Gen 64GB WiFi',      asin: 'B0BJLF2BRM',  category: 'Electronics' },
  { name: 'Apple MacBook Air M2',               asin: 'B0B3C2R8MP',  category: 'Electronics' },
  { name: 'Apple Watch Series 9 41mm',          asin: 'B0CHX8CSHY',  category: 'Electronics' },
  { name: 'Fire TV Stick 4K Max',               asin: 'B0BP9SNVH9',  category: 'Electronics' },
  { name: 'Anker 27000mAh Power Bank',          asin: 'B07S829LBX',  category: 'Electronics' },

  // ── Home ───────────────────────────────────────────────────────────────────
  { name: 'Instant Pot Duo 7-in-1 6qt',         asin: 'B00FLYWNYQ',  category: 'Home' },
  { name: 'iRobot Roomba i4+ Robot Vacuum',     asin: 'B08C4HN7MF',  category: 'Home' },
  { name: 'Nespresso Vertuo Next',              asin: 'B07WHWZR8B',  category: 'Home' },
  { name: 'Philips Hue White & Color Starter',  asin: 'B014H2P42K',  category: 'Home' },
  { name: 'Dyson V15 Detect Vacuum',            asin: 'B09MLKZD9R',  category: 'Home' },

  // ── Health & Beauty ────────────────────────────────────────────────────────
  { name: 'Oral-B iO Series 9 Electric Toothbrush', asin: 'B09ZBQX3HX', category: 'Health & Beauty' },
  { name: 'Dyson Airwrap Complete Long',         asin: 'B09BKPFM49',  category: 'Health & Beauty' },
  { name: 'NutriBullet Pro 900W Blender',        asin: 'B00755YFDY',  category: 'Health & Beauty' },

  // ── Sports ─────────────────────────────────────────────────────────────────
  { name: 'Fitbit Charge 6',                    asin: 'B0CGTWJ5LB',  category: 'Sports' },
  { name: 'Garmin Forerunner 255',              asin: 'B09ZBTBH6R',  category: 'Sports' },
  { name: 'Theragun Prime Massage Gun',         asin: 'B08CS5JSTH',  category: 'Sports' },

  // ── Kitchen ────────────────────────────────────────────────────────────────
  { name: 'Ninja AF101 Air Fryer 4qt',          asin: 'B07FDJMC9Q',  category: 'Kitchen' },
  { name: 'KitchenAid Artisan Stand Mixer 5qt', asin: 'B00005UP2P',  category: 'Kitchen' },
  { name: 'Vitamix E310 Explorian Blender',     asin: 'B00IVKMGEW',  category: 'Kitchen' },
  { name: 'Cuisinart 14-Cup Food Processor',    asin: 'B01AXM4WV2',  category: 'Kitchen' },
  { name: 'Le Creuset 5.5qt Dutch Oven',        asin: 'B00B39UXZM',  category: 'Kitchen' },
  { name: 'Breville Barista Express Espresso',  asin: 'B00CH9QWOU',  category: 'Kitchen' },

  // ── Extra Popular ──────────────────────────────────────────────────────────
  { name: 'Atomic Habits (Paperback)',          asin: 'B01N5AX61W',  category: 'Books' },
  { name: 'Yeti Rambler 30oz Tumbler',          asin: 'B073WG6QZT',  category: 'Home' },
];

const DELAY_MS = 8000; // 8 s between requests — respects ScraperAPI + Claude rate limits

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pad(n: number, total: number) {
  return `[${String(n).padStart(String(total).length, ' ')}/${total}]`;
}

async function seedProduct(product: Product, index: number, total: number): Promise<boolean> {
  const prefix = pad(index, total);

  // Skip if already in DB
  const existing = await getProduct(product.asin);
  if (existing) {
    console.log(`${prefix} SKIP  ${product.name} (${product.asin}) — already saved`);
    return true;
  }

  console.log(`${prefix} START ${product.name} (${product.asin})`);

  try {
    const scraped = await scrapeAmazonProduct(`https://www.amazon.com/dp/${product.asin}`, 'en');
    const analysis = await analyzeReviews(scraped, 'en');
    await saveProduct(analysis, 'en');
    console.log(`${prefix} OK    ${product.name} — "${analysis.verdict.slice(0, 80)}..."`);
    return true;
  } catch (err) {
    console.error(`${prefix} FAIL  ${product.name} — ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log(`ReviewSnap seed — ${PRODUCTS.length} products`);
  console.log('='.repeat(60));

  if (!process.env.SCRAPERAPI_KEY) {
    console.error('ERROR: SCRAPERAPI_KEY is not set. Add it to .env.local.');
    process.exit(1);
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY is not set. Add it to .env.local.');
    process.exit(1);
  }

  const kvConfigured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
  console.log(`Storage: ${kvConfigured ? 'Upstash Redis (KV)' : 'local file (data/products.json)'}`);
  console.log(`Delay between requests: ${DELAY_MS / 1000}s`);
  console.log('');

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const product = PRODUCTS[i];
    const isLast = i === PRODUCTS.length - 1;

    const existing = await getProduct(product.asin);
    if (existing) {
      console.log(`${pad(i + 1, PRODUCTS.length)} SKIP  ${product.name} (${product.asin}) — already saved`);
      skipped++;
      continue;
    }

    console.log(`${pad(i + 1, PRODUCTS.length)} START [${product.category}] ${product.name} (${product.asin})`);
    try {
      const scraped = await scrapeAmazonProduct(`https://www.amazon.com/dp/${product.asin}`, 'en');
      const analysis = await analyzeReviews(scraped, 'en');
      await saveProduct(analysis, 'en');
      console.log(`      OK    verdict: "${analysis.verdict.slice(0, 80)}..."`);
      ok++;
    } catch (err) {
      console.error(`      FAIL  ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }

    if (!isLast) {
      process.stdout.write(`      waiting ${DELAY_MS / 1000}s...\n`);
      await sleep(DELAY_MS);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(`Done. OK: ${ok}  Skipped: ${skipped}  Failed: ${failed}`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
