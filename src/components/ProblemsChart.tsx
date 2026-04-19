'use client';

import { useEffect, useRef, useState } from 'react';

interface Problem { name: string; percentage: number; }

export default function ProblemsChart({ problems }: { problems: Problem[] }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...problems.map(p => p.percentage), 1);

  return (
    <div ref={ref} className="space-y-4">
      {problems.map((p, i) => (
        <div key={i}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm font-medium text-[#0f1111]">{p.name}</span>
            <span className="text-sm font-semibold text-[#565959]">{p.percentage}%</span>
          </div>
          <div className="h-3 rounded-full bg-[#e8e8e8] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: visible ? `${(p.percentage / max) * 100}%` : '0%',
                transitionDelay: `${i * 100}ms`,
                background: 'linear-gradient(to right, #FF9900, #e47911)',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
