import type { Problem } from '@/lib/analyzer';

type Verdict = 'up' | 'down' | 'neutral';

export function getVerdict(pros: string[], cons: string[], problems: Problem[], rating: number): Verdict {
  const topFreq = problems?.[0]?.percentage ?? 0;
  if (rating >= 4.0 || (rating >= 3.5 && pros.length >= cons.length)) return 'up';
  if (rating < 3.0 || (rating < 3.5 && topFreq > 60)) return 'down';
  return 'neutral';
}

const LABELS: Record<Verdict, { en: string; it: string }> = {
  up:      { en: 'Recommended',        it: 'Consigliato'     },
  down:    { en: 'Not recommended',    it: 'Non consigliato' },
  neutral: { en: 'Consider carefully', it: 'Valuta bene'     },
};

const EMOJI: Record<Verdict, string> = {
  up:      '👍',
  down:    '👎',
  neutral: '👌',
};

const COLORS: Record<Verdict, string> = {
  up:      'bg-[#e6f3e6] border-[#82c982] text-[#007600]',
  down:    'bg-[#fdecea] border-[#f5b7b1] text-[#c40000]',
  neutral: 'bg-[#fff8e7] border-[#f5c842] text-[#a35c00]',
};

interface Props {
  pros: string[];
  cons: string[];
  problems: Problem[];
  rating: number;
  locale?: string;
  size?: 'sm' | 'md';
}

export default function VerdictBadge({ pros, cons, problems, rating, locale = 'en', size = 'md' }: Props) {
  const v = getVerdict(pros, cons, problems, rating);
  const lang = locale === 'it' ? 'it' : 'en';

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold shadow-sm ${COLORS[v]}`}>
        <span>{EMOJI[v]}</span>
        <span>{LABELS[v][lang]}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm font-bold shadow-md ${COLORS[v]}`}>
      <span className="text-base leading-none">{EMOJI[v]}</span>
      <span>{LABELS[v][lang]}</span>
    </span>
  );
}
