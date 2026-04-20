'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import VerdictBadge from '@/components/VerdictBadge';
import type { StoredProduct } from '@/lib/store';

function ProductCard({ p }: { p: StoredProduct }) {
  const { locale } = useLanguage();
  const verdict = p.verdict?.replace(/\s+/g, ' ').trim().slice(0, 100);
  const excerpt = verdict && verdict.length === 100 ? verdict + '…' : verdict;
  const label = locale === 'it' ? 'Leggi l\'analisi' : 'Read analysis';

  return (
    <Link
      href={`/products/${p.asin}`}
      className="card relative overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
    >
      <div className="absolute top-2 right-2 z-10">
        <VerdictBadge pros={p.pros} cons={p.cons} problems={p.problems} rating={p.rating} locale={p.locale} size="sm" />
      </div>

      <div className="w-full h-40 bg-white border-b border-[#e3e6ea] flex items-center justify-center overflow-hidden">
        {p.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.imageUrl} alt={p.productName} className="w-full h-full object-contain p-3" />
        ) : (
          <svg className="w-12 h-12 text-[#ccc]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <h2 className="text-sm font-semibold text-[#0f1111] line-clamp-2 leading-snug group-hover:text-[#c45500]">
          {p.productName}
        </h2>

        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map(i => {
              const full = i <= Math.floor(p.rating);
              const half = !full && i === Math.ceil(p.rating) && p.rating % 1 >= 0.5;
              return (
                <svg key={i} className={`w-3.5 h-3.5 ${full || half ? 'text-[#FF9900]' : 'text-[#ddd]'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
          </div>
          {p.rating > 0 && (
            <span className="text-xs font-semibold text-[#FF9900]">{p.rating.toFixed(1)}</span>
          )}
        </div>

        {p.price && <span className="text-base font-bold text-[#B12704]">{p.price}</span>}

        {excerpt && <p className="text-xs text-[#565959] leading-relaxed flex-1">{excerpt}</p>}

        <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#007185] group-hover:text-[#c45500] transition-colors">
          {label}
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

interface Props {
  products: StoredProduct[];
}

export default function ProductsGrid({ products }: Props) {
  const { locale } = useLanguage();

  const filtered = products.filter(p =>
    !p.verdict.startsWith('[seed failed') && p.locale === locale
  );

  const heading    = locale === 'it' ? 'Prodotti analizzati' : 'Analyzed Products';
  const subheading = locale === 'it'
    ? `${filtered.length} prodott${filtered.length !== 1 ? 'i' : 'o'} analizzat${filtered.length !== 1 ? 'i' : 'o'}`
    : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} analyzed`;
  const emptyTitle = locale === 'it' ? 'Nessun prodotto ancora' : 'No products analyzed yet';
  const emptyBody  = locale === 'it'
    ? 'Incolla un link Amazon nella pagina principale per iniziare.'
    : 'Paste an Amazon link on the home page to get started.';
  const analyzeBtn = locale === 'it' ? 'Analizza un prodotto' : 'Analyze a product';
  const newSearch  = locale === 'it' ? '← Nuova analisi' : '← New analysis';

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1111]">{heading}</h1>
          <p className="text-[#565959] text-sm mt-1">{subheading}</p>
        </div>
        <Link href="/" className="text-sm text-[#565959] hover:text-[#0f1111] transition-colors">
          {newSearch}
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-[#0f1111] font-semibold mb-1">{emptyTitle}</p>
          <p className="text-sm text-[#565959] mb-4">{emptyBody}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-sm font-semibold bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] text-[#111] hover:from-[#f5d78e] hover:to-[#eeb933] transition-all shadow-sm"
          >
            {analyzeBtn}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.asin} p={p} />)}
        </div>
      )}
    </main>
  );
}
