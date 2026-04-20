import { NextRequest, NextResponse } from 'next/server';
import { scrapeAmazonProduct } from '@/lib/scraper';
import { analyzeReviews } from '@/lib/analyzer';
import { saveProduct, getProduct } from '@/lib/store';

export const maxDuration = 60;

const PRODUCTS = [
  { name: 'Apple AirPods Pro 2nd Gen',          asin: 'B0CHWRXH8B', category: 'Electronics' },
  { name: 'Sony WH-1000XM5 Headphones',         asin: 'B09XS7JWHH', category: 'Electronics' },
  { name: 'Echo Dot 5th Gen',                   asin: 'B09B8V1LZ3', category: 'Electronics' },
  { name: 'Apple iPad 10th Gen 64GB WiFi',       asin: 'B0BJLF2BRM', category: 'Electronics' },
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

// Processes one product per call — stays within Vercel's 60s limit.
// Call repeatedly until remaining === 0.
export async function POST(_req: NextRequest) {
  const next = await (async () => {
    for (const p of PRODUCTS) {
      if (!(await getProduct(p.asin))) return p;
    }
    return null;
  })();

  if (!next) {
    return NextResponse.json({ done: true, remaining: 0, total: PRODUCTS.length });
  }

  const remaining = await (async () => {
    let count = 0;
    for (const p of PRODUCTS) {
      if (!(await getProduct(p.asin))) count++;
    }
    return count;
  })();

  const { asin, name } = next;
  try {
    const scraped = await scrapeAmazonProduct(`https://www.amazon.com/dp/${asin}`, 'en');
    const analysis = await analyzeReviews(scraped, 'en');
    await saveProduct(analysis, 'en');
    return NextResponse.json({
      done: false,
      status: 'ok',
      asin,
      name,
      verdict: analysis.verdict.slice(0, 100),
      remaining: remaining - 1,
      total: PRODUCTS.length,
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      done: false,
      status: 'failed',
      asin,
      name,
      detail,
      remaining: remaining - 1,
      total: PRODUCTS.length,
    });
  }
}
