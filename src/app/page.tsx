'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import SiteFooter from '@/components/SiteFooter';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t, locale } = useLanguage();

  const STEPS = [t.stepFetching, t.stepExtracting, t.stepAnalyzing];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError('');
    setStep(0);

    const interval = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 4000);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.somethingWrong);
      sessionStorage.setItem('reviewsnap_result', JSON.stringify(data));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.somethingWrong);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      {/* Top bar */}
      <header className="bg-[#131921] py-3 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#131921]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">ReviewSnap</span>
            <Link
              href="/products"
              className="hidden sm:inline text-sm text-[#ccc] hover:text-white transition-colors ml-2"
            >
              Products
            </Link>
          </div>
        </div>
      </header>

      {/* Orange accent bar */}
      <div className="h-[3px] bg-[#FF9900]" />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0f1111] mb-3 leading-tight">
              {t.heroHeading}<br />
              <span className="text-[#FF9900]">{t.heroHighlight}</span>
            </h1>
            <p className="text-[#565959] text-base">{t.heroSub}</p>
          </div>

          {/* Search card */}
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-sm font-semibold text-[#0f1111]">
                {t.urlLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder={t.urlPlaceholder}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded border border-[#a6a6a6] bg-white text-[#0f1111] placeholder-[#adb1b8] text-sm focus:outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#e77600]/20 disabled:opacity-60 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="shrink-0 px-5 py-2.5 rounded text-sm font-semibold bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] text-[#111] hover:from-[#f5d78e] hover:to-[#eeb933] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:shadow-inner"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      {t.analyzingBtn}
                    </span>
                  ) : (
                    t.analyzeBtn
                  )}
                </button>
              </div>

              {/* Loading steps */}
              {loading && (
                <div className="flex items-center gap-2 pt-1">
                  <svg className="animate-spin w-3.5 h-3.5 text-[#FF9900] shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-sm text-[#565959]">{STEPS[step]}</span>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '⚡', label: t.feat1Label, desc: t.feat1Desc },
              { icon: '✓',  label: t.feat2Label, desc: t.feat2Desc },
              { icon: '⚠',  label: t.feat3Label, desc: t.feat3Desc },
              { icon: '🎯', label: t.feat4Label, desc: t.feat4Desc },
            ].map(f => (
              <div key={f.label} className="card p-3 text-center">
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="text-xs font-semibold text-[#0f1111]">{f.label}</div>
                <div className="text-xs text-[#565959] mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
