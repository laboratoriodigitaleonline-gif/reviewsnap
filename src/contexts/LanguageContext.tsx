'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '@/lib/translations';
import type { Locale, T } from '@/lib/translations';

interface LanguageContextType {
  locale: Locale;
  t: T;
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  t: translations.en,
  setLocale: () => {},
});

function detectLocale(): Locale {
  const saved = localStorage.getItem('reviewsnap_locale') as Locale | null;
  if (saved === 'en' || saved === 'it') return saved;
  const lang = navigator.language || navigator.languages?.[0] || '';
  return lang.toLowerCase().startsWith('it') ? 'it' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const detected = detectLocale();
    setLocaleState(detected);
    document.documentElement.lang = detected;
  }, []);

  const setLocale = (l: Locale) => {
    localStorage.setItem('reviewsnap_locale', l);
    setLocaleState(l);
    document.documentElement.lang = l;
  };

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
