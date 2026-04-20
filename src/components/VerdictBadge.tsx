import type { Problem } from '@/lib/analyzer';

type Verdict = 'up' | 'down' | 'neutral';

export function getVerdict(pros: string[], cons: string[], problems: Problem[]): Verdict {
  const topFreq = problems?.[0]?.percentage ?? 0;
  if (pros.length > cons.length && topFreq < 30) return 'up';
  if (cons.length > pros.length || topFreq > 50) return 'down';
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
  locale?: string;
  size?: 'sm' | 'lg';
}

export default function VerdictBadge({ pros, cons, problems, locale = 'en', size = 'lg' }: Props) {
  const v = getVerdict(pros, cons, problems);
  const lang = locale === 'it' ? 'it' : 'en';

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${COLORS[v]}`}>
        <span>{EMOJI[v]}</span>
        <span>{LABELS[v][lang]}</span>
      </span>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-1.5 px-5 py-4 rounded-xl border-2 ${COLORS[v]} min-w-[110px]`}>
      <span className="text-4xl leading-none">{EMOJI[v]}</span>
      <span className="text-xs font-bold uppercase tracking-wide text-center leading-tight">{LABELS[v][lang]}</span>
    </div>
  );
}
