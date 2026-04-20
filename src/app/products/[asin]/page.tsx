import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/store';
import { translations } from '@/lib/translations';
import type { Locale } from '@/lib/translations';
import StarRating from '@/components/StarRating';
import ProblemsChart from '@/components/ProblemsChart';
import VerdictBadge from '@/components/VerdictBadge';

export const dynamic = 'force-dynamic';

interface Props {
  params: { asin: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.asin);
  if (!product) return { title: 'Product Not Found | ReviewSnap' };

  const description = product.verdict
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 155);

  return {
    title: `${product.productName} – ReviewSnap Analysis`,
    description,
    openGraph: {
      title: `${product.productName} – Should you buy it?`,
      description,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.productName} – Should you buy it?`,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
    alternates: {
      canonical: `https://reviewsnap.net/products/${product.asin}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.asin);
  if (!product) notFound();

  const locale = (product.locale as Locale) ?? 'en';
  const t = translations[locale] ?? translations.en;

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      {/* Header */}
      <header className="bg-[#131921] py-3 px-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#FF9900] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#131921]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">ReviewSnap</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-[#ccc] hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            All products
          </Link>
        </div>
      </header>
      <div className="h-[3px] bg-[#FF9900]" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-4">

        {/* ── Product Hero Card ── */}
        <div className="card relative">
          {/* Sticker badge — top-right on all screen sizes */}
          <div className="absolute top-3 right-3 z-10">
            <VerdictBadge pros={product.pros} cons={product.cons} problems={product.problems} locale={product.locale} />
          </div>

          <div className="flex gap-5 p-5">
            <div className="shrink-0 w-32 h-32 sm:w-44 sm:h-44 rounded-lg border border-[#e3e6ea] bg-white flex items-center justify-center overflow-hidden">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <svg className="w-12 h-12 text-[#ccc]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              )}
            </div>

            <div className="flex-1 min-w-0 py-1 flex flex-col gap-2 pr-24">
              <h1 className="text-base sm:text-lg font-semibold text-[#0f1111] leading-snug line-clamp-4">
                {product.productName}
              </h1>

              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                ratingsLabel={t.ratings}
              />

              {product.price && (
                <span className="text-2xl font-bold text-[#B12704] tracking-tight">
                  {product.price}
                </span>
              )}

              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-auto px-5 py-2 rounded text-sm font-semibold bg-gradient-to-b from-[#FFD814] to-[#FF9900] border border-[#c8a216] text-[#111] hover:from-[#f7ca00] hover:to-[#e47911] transition-all shadow-sm w-fit"
              >
                <AmazonIcon />
                {t.buyBtn}
              </a>
            </div>
          </div>
        </div>

        {/* ── AI Verdict ── */}
        <div className="card overflow-hidden">
          <div className="flex items-stretch">
            <div className="w-1 bg-[#FF9900] shrink-0" />
            <div className="p-5 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-[#FF9900]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                </svg>
                <span className="text-xs font-bold uppercase tracking-widest text-[#FF9900]">
                  {t.aiVerdict}
                </span>
              </div>
              <p className="text-[#0f1111] leading-relaxed text-sm">{product.verdict}</p>
            </div>
          </div>
        </div>

        {/* ── Pros & Cons ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card overflow-hidden">
            <div className="flex items-stretch">
              <div className="w-1 bg-[#007600] shrink-0" />
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#007600]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#007600]">{t.pros}</span>
                </div>
                <ul className="space-y-2.5">
                  {product.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-[#e6f3e6] border border-[#b7dfb7] flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-[#007600]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-sm text-[#0f1111] leading-snug">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-stretch">
              <div className="w-1 bg-[#c40000] shrink-0" />
              <div className="p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-[#c40000]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c40000]">{t.cons}</span>
                </div>
                <ul className="space-y-2.5">
                  {product.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="shrink-0 mt-0.5 w-4 h-4 rounded-full bg-[#fdecea] border border-[#f5b7b1] flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-[#c40000]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-sm text-[#0f1111] leading-snug">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top Reported Problems ── */}
        {product.problems?.length > 0 && (
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-[#FF9900]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest text-[#565959]">
                {t.topProblems}
              </span>
            </div>
            <ProblemsChart problems={product.problems} />
          </div>
        )}

        {/* ── Good For / Not Good For ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">👍</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#007600]">{t.goodFor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.goodFor.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-[#e6f3e6] border border-[#b7dfb7] text-[#007600]">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">👎</span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#c40000]">{t.notGoodFor}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.notGoodFor.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-[#fdecea] border border-[#f5b7b1] text-[#c40000]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Buy CTA ── */}
        <div className="card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-[#FF9900]/40">
          <div>
            <p className="font-bold text-[#0f1111]">{t.readyToPurchase}</p>
            <p className="text-sm text-[#565959] mt-0.5">{t.buyDesc}</p>
          </div>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2.5 px-7 py-3 rounded font-bold text-sm bg-gradient-to-b from-[#FFD814] to-[#FF9900] border border-[#c8a216] text-[#111] hover:from-[#f7ca00] hover:to-[#e47911] transition-all shadow"
          >
            <AmazonIcon />
            {t.buyBtn}
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        <p className="text-center text-[#adb1b8] text-xs pb-2">
          {t.affiliateNote}
        </p>
      </main>

      <footer className="bg-[#232f3e] text-[#ddd] text-xs text-center py-3 px-4">
        {t.resultsFooter}
      </footer>
    </div>
  );
}

function AmazonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.076-1.047-.872-1.234-1.276-1.814-2.106-1.734 1.767-2.962 2.297-5.209 2.297-2.66 0-4.731-1.641-4.731-4.925 0-2.565 1.391-4.309 3.37-5.164 1.715-.754 4.11-.891 5.942-1.095v-.41c0-.753.06-1.642-.384-2.294-.385-.579-1.124-.82-1.776-.82-1.207 0-2.284.619-2.548 1.903-.054.285-.261.567-.549.582l-3.061-.333c-.259-.056-.548-.266-.472-.66C5.97 2.249 9.065 1.11 11.834 1.11c1.413 0 3.259.376 4.374 1.446 1.413 1.318 1.278 3.076 1.278 4.991v4.524c0 1.36.565 1.958 1.096 2.693.187.261.228.574-.009.769l-1.429 1.262zm4.42 1.445c-2.902 2.139-7.111 3.28-10.729 3.28-5.076 0-9.641-1.878-13.096-5.006-.271-.245-.029-.579.298-.39 3.728 2.169 8.333 3.471 13.091 3.471 3.211 0 6.741-.666 9.988-2.046.491-.209.902.321.448.691z" />
    </svg>
  );
}
