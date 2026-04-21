'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  itCount: number;
  enCount: number;
  recent: { asin: string; title: string; locale: string; savedAt: string }[];
}

const QUICK_LINKS = [
  {
    label: 'Vercel Dashboard',
    href: 'https://vercel.com/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2L2 19.5h20L12 2z" />
      </svg>
    ),
    color: '#fff',
    bg: '#000',
  },
  {
    label: 'Upstash Database',
    href: 'https://upstash.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    color: '#fff',
    bg: '#00e9a3',
  },
  {
    label: 'Anthropic API',
    href: 'https://console.anthropic.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.5 2h-3L2 22h4l1.5-4h9l1.5 4h4L13.5 2zm-4.8 12L12 6l3.3 8H8.7z" />
      </svg>
    ),
    color: '#fff',
    bg: '#d4570c',
  },
  {
    label: 'ScraperAPI',
    href: 'https://www.scraperapi.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 14.5v-9l7 4.5-7 4.5z" />
      </svg>
    ),
    color: '#fff',
    bg: '#2563eb',
  },
  {
    label: 'Porkbun Domain',
    href: 'https://porkbun.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
    color: '#fff',
    bg: '#ec4899',
  },
  {
    label: 'Amazon Associates IT',
    href: 'https://programma-affiliazione.amazon.it/home',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
    color: '#111',
    bg: '#FF9900',
  },
  {
    label: 'Amazon Associates EN',
    href: 'https://affiliate-program.amazon.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
      </svg>
    ),
    color: '#111',
    bg: '#f0c14b',
  },
  {
    label: 'Google Search Console',
    href: 'https://search.google.com/search-console',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
      </svg>
    ),
    color: '#fff',
    bg: '#4285F4',
  },
];

// ── Login form ────────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dashboard-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Login failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FF9900] flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#0d1117]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold">ReviewSnap Admin</h1>
          <p className="text-[#8b949e] text-sm mt-1">Enter your password to continue</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161b22] border border-[#21262d] rounded-2xl p-6 space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] text-white placeholder-[#484f58] text-sm focus:outline-none focus:border-[#388bfd] focus:ring-1 focus:ring-[#388bfd] disabled:opacity-50 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2 text-red-400 text-sm">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsError, setStatsError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then(r => r.json())
      .then(data => {
        if (data.error) setStatsError(data.error);
        else setStats(data);
      })
      .catch(() => setStatsError('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/dashboard-logout', { method: 'POST' });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="border-b border-[#21262d] bg-[#161b22] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0d1117]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg">ReviewSnap</span>
              <span className="ml-2 text-xs bg-[#FF9900]/20 text-[#FF9900] px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#8b949e] text-xs hidden sm:block">
              {new Date().toLocaleDateString('en-GB', { dateStyle: 'full' })}
            </span>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] transition-colors disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h6a1 1 0 100-2H4V5h5a1 1 0 100-2H3zm11.293 4.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L15.586 11H9a1 1 0 110-2h6.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">

        {/* Stats Section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8b949e] mb-4">Stats</h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : statsError ? (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm">{statsError}</div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <StatCard label="Total Products" value={stats.total} icon="📦" accent="#FF9900" />
                <StatCard label="Italian Products" value={stats.itCount} icon="🇮🇹" accent="#009246" />
                <StatCard label="English Products" value={stats.enCount} icon="🇬🇧" accent="#012169" />
              </div>

              <div className="bg-[#161b22] border border-[#21262d] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#21262d]">
                  <h3 className="text-sm font-semibold text-[#e6edf3]">Recently Analyzed</h3>
                </div>
                {stats.recent.length === 0 ? (
                  <p className="px-5 py-4 text-[#8b949e] text-sm">No products yet.</p>
                ) : (
                  <ul className="divide-y divide-[#21262d]">
                    {stats.recent.map(p => (
                      <li key={p.asin} className="px-5 py-3 flex items-center gap-3 hover:bg-[#1c2128] transition-colors">
                        <span className="text-base">{p.locale === 'it' ? '🇮🇹' : '🇬🇧'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#e6edf3] truncate">{p.title}</p>
                          <p className="text-xs text-[#8b949e]">ASIN: {p.asin}</p>
                        </div>
                        <span className="text-xs text-[#8b949e] shrink-0">
                          {new Date(p.savedAt).toLocaleDateString('en-GB')}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          ) : null}
        </section>

        {/* Quick Links Section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8b949e] mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {QUICK_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#161b22] border border-[#21262d] rounded-xl p-4 flex flex-col items-start gap-3 hover:border-[#388bfd] hover:bg-[#1c2128] transition-all duration-150"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: link.bg, color: link.color }}
                >
                  {link.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#e6edf3] group-hover:text-[#58a6ff] transition-colors leading-snug">
                    {link.label}
                  </p>
                  <p className="text-xs text-[#8b949e] mt-0.5 truncate">
                    {new URL(link.href).hostname.replace('www.', '')}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Analytics Section */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#8b949e] mb-4">Analytics</h2>
          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 2L2 19.5h20L12 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[#e6edf3] font-semibold">Vercel Analytics</h3>
              <p className="text-[#8b949e] text-sm mt-0.5">
                View traffic, page views, visitors, and performance metrics for reviewsnap.net.
              </p>
            </div>
            <a
              href="https://vercel.com/laboratoriodigitaleonlines-projects/reviewsnap/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Open Analytics →
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }: {
  label: string;
  value: number;
  icon: string;
  accent: string;
}) {
  return (
    <div
      className="bg-[#161b22] border border-[#21262d] rounded-xl p-5"
      style={{ borderLeftColor: accent, borderLeftWidth: 3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#8b949e] font-medium">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-[#e6edf3]">{value.toLocaleString()}</p>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [authState, setAuthState] = useState<'loading' | 'login' | 'authenticated'>('loading');

  useEffect(() => {
    // Check if the session cookie is valid by probing the stats endpoint
    fetch('/api/dashboard-stats').then(r => {
      setAuthState(r.status === 401 ? 'login' : 'authenticated');
    }).catch(() => setAuthState('login'));
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-[#8b949e] text-sm">Loading…</div>
      </div>
    );
  }

  if (authState === 'login') {
    return <LoginForm onSuccess={() => setAuthState('authenticated')} />;
  }

  return <Dashboard onLogout={() => setAuthState('login')} />;
}
