import type { AnalysisResult } from './analyzer';

export interface StoredProduct extends AnalysisResult {
  savedAt: string;
  locale: string;
}

// KV key layout:
//   product:{ASIN}  → StoredProduct (string/JSON)
//   products:index  → sorted set: score=savedAt(ms), member=ASIN

const useRedis = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// ── Upstash Redis backend ────────────────────────────────────────────────────

function redisClient() {
  const { Redis } = require('@upstash/redis');
  return new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

async function redisSave(product: StoredProduct): Promise<void> {
  const redis = redisClient();
  const score = new Date(product.savedAt).getTime();
  await Promise.all([
    redis.set(`product:${product.asin}`, JSON.stringify(product)),
    redis.zadd('products:index', { score, member: product.asin }),
  ]);
}

async function redisGet(asin: string): Promise<StoredProduct | null> {
  const redis = redisClient();
  const raw = await redis.get(`product:${asin}`);
  if (!raw) return null;
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

async function redisGetAll(): Promise<StoredProduct[]> {
  const redis = redisClient();
  const asins: string[] = await redis.zrange('products:index', 0, -1, { rev: true });
  if (!asins.length) return [];
  const raws = await Promise.all(asins.map(a => redis.get(`product:${a}`)));
  return raws
    .map(r => (r ? (typeof r === 'string' ? JSON.parse(r) : r) : null))
    .filter((p): p is StoredProduct => p !== null);
}

// ── File backend (local dev) ─────────────────────────────────────────────────

import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

async function fileRead(): Promise<Record<string, StoredProduct>> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

async function fileWrite(data: Record<string, StoredProduct>): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function fileSave(product: StoredProduct): Promise<void> {
  const store = await fileRead();
  store[product.asin] = product;
  await fileWrite(store);
}

async function fileGet(asin: string): Promise<StoredProduct | null> {
  return (await fileRead())[asin] ?? null;
}

async function fileGetAll(): Promise<StoredProduct[]> {
  return Object.values(await fileRead()).sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function saveProduct(result: AnalysisResult, locale: string): Promise<void> {
  const product: StoredProduct = { ...result, savedAt: new Date().toISOString(), locale };
  return useRedis ? redisSave(product) : fileSave(product);
}

export async function getProduct(asin: string): Promise<StoredProduct | null> {
  const key = asin.toUpperCase();
  return useRedis ? redisGet(key) : fileGet(key);
}

export async function getAllProducts(): Promise<StoredProduct[]> {
  return useRedis ? redisGetAll() : fileGetAll();
}
