'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SiteFooter() {
  const { locale, t } = useLanguage();

  const links = [
    { href: '/about',      label: locale === 'it' ? 'Chi siamo'     : 'About'      },
    { href: '/privacy',    label: 'Privacy'                                         },
    { href: '/disclaimer', label: 'Disclaimer'                                      },
  ];

  return (
    <footer className="bg-[#232f3e] text-[#ddd] text-xs text-center py-4 px-4 space-y-2">
      <p>{t.resultsFooter}</p>
      <div className="flex justify-center gap-5">
        {links.map(l => (
          <Link key={l.href} href={l.href} className="hover:text-white transition-colors underline underline-offset-2">
            {l.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
