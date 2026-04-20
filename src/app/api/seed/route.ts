import { NextRequest, NextResponse } from 'next/server';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { analyzeReviews } from '@/lib/analyzer';
import { saveProduct, getProduct } from '@/lib/store';

export const maxDuration = 300;

const PRODUCTS = [
  { name: 'Apple AirPods Pro 2nd Gen',          asin: 'B0CHWRXH8B', category: 'Electronics' },
  { name: 'Sony WH-1000XM5 Headphones',         asin: 'B09XS7JWHH', category: 'Electronics' },
  { name: 'Echo Dot 5th Gen',                   asin: 'B09B8V1LZ3', category: 'Electronics' },
  { name: 'Apple iPad 10th Gen 64GB WiFi',      asin: 'B0BJLF2BRM', category: 'Electronics' },
  { name: 'Apple MacBook Air M2',               asin: 'B0B3C2R8MP', category: 'Electronics' },
  { name: 'Fire TV Stick 4K Max',               asin: 'B0BP9SNVH9', category: 'Electronics' },
  { name: 'Anker 27000mAh Power Bank',          asin: 'B07S829LBX', category: 'Electronics' },
  { name: 'Instant Pot Duo 7-in-1 6qt',         asin: 'B00FLYWNYQ', category: 'Home'        },
  { name: 'iRobot Roomba i4+ Robot Vacuum',     asin: 'B08C4HN7MF', category: 'Home'        },
  { name: 'Philips Hue White & Color Starter',  asin: 'B014H2P42K', category: 'Home'        },
  { name: 'Ninja AF101 Air Fryer 4qt',          asin: 'B07FDJMC9Q', category: 'Kitchen'     },
  { name: 'KitchenAid Artisan Stand Mixer 5qt', asin: 'B00005UP2P', category: 'Kitchen'     },
  { name: 'Cuisinart 14-Cup Food Processor',    asin: 'B01AXM4WV2', category: 'Kitchen'     },
  { name: 'Breville Barista Express Espresso',  asin: 'B00CH9QWOU', category: 'Kitchen'     },
  { name: 'Theragun Prime Massage Gun',         asin: 'B08CS5JSTH', category: 'Sports'      },
  { name: 'Atomic Habits (Paperback)',          asin: 'B01N5AX61W', category: 'Books'       },
  { name: 'Le Creuset 5.5qt Dutch Oven',        asin: 'B00B39UXZM', category: 'Kitchen'     },
  { name: 'Vitamix E310 Explorian Blender',     asin: 'B00IVKMGEW', category: 'Kitchen'     },
  { name: 'Nespresso Vertuo Next',              asin: 'B07WHWZR8B', category: 'Home'        },
  { name: 'Dyson V15 Detect Vacuum',            asin: 'B09MLKZD9R', category: 'Home'        },
];

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(_req: NextRequest) {
  const results: { asin: string; name: string; status: 'ok' | 'skipped' | 'failed'; detail?: string }[] = [];
  let ok = 0, skipped = 0, failed = 0;

  for (let i = 0; i < PRODUCTS.length; i++) {
    const { asin, name } = PRODUCTS[i];

    const existing = await getProduct(asin);
    if (existing) {
      results.push({ asin, name, status: 'skipped' });
      skipped++;
      continue;
    }

    try {
      const scraped = await scrapeAmazonProduct(`https://www.amazon.com/dp/${asin}`, 'en');
      const analysis = await analyzeReviews(scraped, 'en');
      await saveProduct(analysis, 'en');
      results.push({ asin, name, status: 'ok', detail: analysis.verdict.slice(0, 100) });
      ok++;
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      results.push({ asin, name, status: 'failed', detail });
      failed++;
    }

    if (i < PRODUCTS.length - 1) await sleep(8000);
  }

  return NextResponse.json({ ok, skipped, failed, total: PRODUCTS.length, results });
}
