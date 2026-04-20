'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import SiteFooter from '@/components/SiteFooter';

const content = {
  en: {
    title: 'About ReviewSnap',
    tagline: 'The unbiased AI verdict on any Amazon product.',
    whatTitle: 'What is ReviewSnap?',
    what: 'ReviewSnap is a free AI-powered tool that reads hundreds of Amazon customer reviews and distills them into a clear, instant verdict. No sponsored content. No affiliate bias in the analysis. Just honest, AI-generated insights to help you make smarter buying decisions.',
    howTitle: 'How it works',
    steps: [
      { n: '1', head: 'Paste any Amazon link', body: 'Copy the URL of any Amazon product — any country, any format.' },
      { n: '2', head: 'AI reads the reviews', body: 'Claude AI analyzes hundreds of real customer reviews, identifying patterns in praise and complaints.' },
      { n: '3', head: 'Get your instant verdict', body: 'You receive a clear Recommended / Not Recommended / Consider Carefully verdict, with pros, cons, top problems, and who the product suits.' },
    ],
    whyTitle: 'Why trust ReviewSnap?',
    why: [
      { head: 'No paid placements', body: 'No brand pays to appear on ReviewSnap. Every verdict is generated purely from customer reviews.' },
      { head: 'Powered by Claude AI', body: "We use Anthropic's Claude, one of the most accurate and safety-focused AI models available." },
      { head: 'Transparent methodology', body: 'Our scoring is based on star ratings, number of pros vs. cons, and reported problem frequency — all clearly displayed.' },
      { head: 'Affiliate disclosure', body: 'We participate in the Amazon Associates program. Product links may earn a small commission. This never influences our AI analysis.' },
    ],
    cta: 'Try it now',
  },
  it: {
    title: 'Chi siamo',
    tagline: 'Il verdetto AI imparziale su qualsiasi prodotto Amazon.',
    whatTitle: "Cos'è ReviewSnap?",
    what: "ReviewSnap è uno strumento gratuito basato su intelligenza artificiale che legge centinaia di recensioni Amazon e le distilla in un verdetto chiaro e immediato. Nessun contenuto sponsorizzato. Nessun bias nelle analisi. Solo informazioni generate dall'IA per aiutarti a fare acquisti più consapevoli.",
    howTitle: 'Come funziona',
    steps: [
      { n: '1', head: 'Incolla il link Amazon', body: 'Copia l\'URL di qualsiasi prodotto Amazon — qualsiasi paese, qualsiasi formato.' },
      { n: '2', head: "L'IA legge le recensioni", body: "Claude AI analizza centinaia di recensioni reali, identificando i pattern nei commenti positivi e negativi." },
      { n: '3', head: 'Ottieni il tuo verdetto', body: 'Ricevi un chiaro Consigliato / Non consigliato / Valuta bene, con pro, contro, problemi principali e a chi si adatta il prodotto.' },
    ],
    whyTitle: 'Perché fidarsi di ReviewSnap?',
    why: [
      { head: 'Nessun contenuto pagato', body: 'Nessun brand paga per apparire su ReviewSnap. Ogni verdetto è generato esclusivamente dalle recensioni dei clienti.' },
      { head: 'Powered by Claude AI', body: "Usiamo Claude di Anthropic, uno dei modelli di intelligenza artificiale più precisi e sicuri disponibili." },
      { head: 'Metodologia trasparente', body: 'Il punteggio si basa sulle stelle, sul numero di pro vs. contro e sulla frequenza dei problemi segnalati — tutto chiaramente visualizzato.' },
      { head: 'Trasparenza sugli affiliati', body: 'Partecipiamo al programma Amazon Associates. I link ai prodotti possono farci guadagnare una piccola commissione. Questo non influenza mai la nostra analisi AI.' },
    ],
    cta: 'Provalo ora',
  },
};

export default function AboutPage() {
  const { locale } = useLanguage();
  const c = content[locale] ?? content.en;

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
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
        </div>
      </header>
      <div className="h-[3px] bg-[#FF9900]" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-10">
        {/* Hero */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#0f1111]">{c.title}</h1>
          <p className="text-[#565959] text-lg">{c.tagline}</p>
        </div>

        {/* What */}
        <div className="card p-6 space-y-3">
          <h2 className="text-lg font-bold text-[#0f1111]">{c.whatTitle}</h2>
          <p className="text-sm text-[#333] leading-relaxed">{c.what}</p>
        </div>

        {/* How it works */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0f1111]">{c.howTitle}</h2>
          <div className="space-y-3">
            {c.steps.map(s => (
              <div key={s.n} className="card p-5 flex gap-4 items-start">
                <div className="shrink-0 w-9 h-9 rounded-full bg-[#FF9900] text-[#131921] font-bold text-base flex items-center justify-center">
                  {s.n}
                </div>
                <div>
                  <p className="font-semibold text-[#0f1111] text-sm">{s.head}</p>
                  <p className="text-xs text-[#565959] mt-0.5 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why trust */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#0f1111]">{c.whyTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.why.map(w => (
              <div key={w.head} className="card p-5 space-y-1">
                <p className="font-semibold text-[#0f1111] text-sm">{w.head}</p>
                <p className="text-xs text-[#565959] leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded font-bold text-sm bg-gradient-to-b from-[#FFD814] to-[#FF9900] border border-[#c8a216] text-[#111] hover:from-[#f7ca00] hover:to-[#e47911] transition-all shadow"
          >
            {c.cta} →
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
