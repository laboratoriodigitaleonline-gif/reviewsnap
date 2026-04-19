import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ReviewSnap – AI-Powered Amazon Review Analysis',
  description:
    'Make smarter purchase decisions. ReviewSnap uses AI to analyze Amazon product reviews and give you an instant verdict.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f7f8fa] text-[#0f1111] antialiased">
        {children}
      </body>
    </html>
  );
}
