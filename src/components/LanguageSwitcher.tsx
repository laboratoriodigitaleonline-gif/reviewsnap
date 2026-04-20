'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 bg-[#0f1923] rounded-md p-0.5">
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
          locale === 'en'
            ? 'bg-[#FF9900] text-[#131921]'
            : 'text-[#aaa] hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('it')}
        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
          locale === 'it'
            ? 'bg-[#FF9900] text-[#131921]'
            : 'text-[#aaa] hover:text-white'
        }`}
      >
        IT
      </button>
    </div>
  );
}
