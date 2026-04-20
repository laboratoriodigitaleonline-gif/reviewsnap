import type { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/store';

const BASE = 'https://reviewsnap.net';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const productEntries: MetadataRoute.Sitemap = products
    .filter(p => !p.verdict.startsWith('[seed failed'))
    .map(p => ({
      url: `${BASE}/products/${p.asin}`,
      lastModified: new Date(p.savedAt),
      changeFrequency: 'daily',
      priority: 0.7,
    }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...productEntries,
  ];
}
