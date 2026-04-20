import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllProducts } from '@/lib/store';
import ProductsGrid from '@/components/ProductsGrid';
import SiteFooter from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Analyzed Products – ReviewSnap',
  description:
    'Browse all products analyzed by ReviewSnap. Find AI-powered verdicts, pros, cons, and buyer guides for hundreds of Amazon products.',
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      <header className="bg-[#131921] py-3 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#131921]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ReviewSnap</span>
          </Link>
        </div>
      </header>
      <div className="h-[3px] bg-[#FF9900]" />

      <ProductsGrid products={products} />

      <SiteFooter />
    </div>
  );
}
