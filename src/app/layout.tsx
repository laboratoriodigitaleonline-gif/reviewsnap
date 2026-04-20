import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'ReviewSnap – AI-Powered Amazon Review Analysis',
  description:
    'Make smarter purchase decisions. ReviewSnap uses AI to analyze Amazon product reviews and give you an instant verdict.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#f7f8fa] text-[#0f1111] antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
