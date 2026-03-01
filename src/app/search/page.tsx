'use client';

import { useState, Suspense } from 'react';
import TweetCard from '@/components/TweetCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Tweet, TweetAnalysis } from '@/lib/types';
import {
  Search, GraduationCap, Microscope, Newspaper,
  AlertCircle, Download, TrendingUp, Filter, X
} from 'lucide-react';
import Link from 'next/link';

type SearchMode = 'students' | 'research' | 'journalist';

interface ModeConfig {
  key: SearchMode;
  label: string;
  icon: React.ReactNode;
  description: string;
  placeholder: string;
  color: string;
  activeColor: string;
  focusBg: string;
}

const MODES: ModeConfig[] = [
  {
    key: 'students',
    label: 'Students',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Simple explanations, Hindi summaries, and easy-to-understand breakdowns for learners.',
    placeholder: 'Search any topic... e.g. climate change, AI, elections',
    color: 'text-blue-600 border-blue-300',
    activeColor: 'bg-blue-600 text-white border-blue-600',
    focusBg: 'from-blue-50 to-indigo-50',
  },
  {
    key: 'research',
    label: 'Research',
    icon: <Microscope className="w-5 h-5" />,
    description: 'Deep analysis with credibility scores, key claims, stance detection, and sourced tweets.',
    placeholder: 'Search credible sources... e.g. vaccine policy, budget 2025',
    color: 'text-emerald-600 border-emerald-300',
    activeColor: 'bg-emerald-600 text-white border-emerald-600',
    focusBg: 'from-emerald-50 to-teal-50',
  },
  {
    key: 'journalist',
    label: 'Journalist',
    icon: <Newspaper className="w-5 h-5" />,
    description: 'Speaker identity, influence metrics, public figure statements, and breaking news.',
    placeholder: 'Search news topics... e.g. parliament session, Modi, budget',
    color: 'text-orange-600 border-orange-300',
    activeColor: 'bg-orange-600 text-white border-orange-600',
    focusBg: 'from-orange-50 to-amber-50',
  },
];

function SearchPageContent() {
  const [mode, setMode] = useState<SearchMode>('students');
  const [query, setQuery] = useState('');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, TweetAnalysis>>({});
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxResults, setMaxResults] = useState(20);

  const currentMode = MODES.find((m) => m.key === mode)!;

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    setTweets([]);
    setAnalyses({});
    setError(null);
    setIsDemo(false);

    try {
      const params = new URLSearchParams({
        q: q.trim(),
        mode,
        max_results: String(maxResults),
        ...(verifiedOnly ? { verified_only: 'true' } : {}),
      });

      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to fetch tweets');
        return;
      }

      const fetchedTweets: Tweet[] = data.tweets || [];
      setTweets(fetchedTweets);
      if (data.is_demo) setIsDemo(true);

      // Batch AI analysis
      if (fetchedTweets.length > 0) {
        const batchPayload = fetchedTweets.map((t) => ({
          id: t.id,
          text: t.text,
          speaker: t.author,
          metrics: t.metrics,
          created_at: t.created_at,
        }));

        const analysisRes = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tweet_text: fetchedTweets[0].text,
            speaker_info: fetchedTweets[0].author,
            topic: q.trim(),
            batch: batchPayload,
          }),
        });

        const analysisData = await analysisRes.json();
        if (analysisRes.ok) {
          setAnalyses(analysisData);
          // Persist to localStorage for export page
          try {
            localStorage.setItem(
              'socialpulse_last_search',
              JSON.stringify({
                tweets: fetchedTweets,
                analyses: analysisData,
                query: q.trim(),
                mode,
                saved_at: new Date().toISOString(),
              })
            );
          } catch {
            // localStorage may be full — not critical
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error — is the dev server running?');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Banner */}
      <div className={`bg-gradient-to-r ${currentMode.focusBg} border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tweet Search & Analysis</h1>
          <p className="text-gray-500 text-sm">Real public tweets · X Developer API v2 · AI-powered insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Mode Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setTweets([]); setSearched(false); setError(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold border-2 transition-all text-sm shadow-sm
                ${mode === m.key ? m.activeColor : `bg-white ${m.color} hover:bg-gray-50`}`}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>

        {/* Mode Description */}
        <div className={`bg-gradient-to-r ${currentMode.focusBg} border rounded-xl px-4 py-3 mb-6`}>
          <p className="text-sm text-gray-600">{currentMode.description}</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={currentMode.placeholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-gray-50"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 text-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => handleSearch()}
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 flex-wrap items-center">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded"
                />
                Verified accounts only
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                Results:
                <select
                  value={maxResults}
                  onChange={(e) => setMaxResults(Number(e.target.value))}
                  className="border border-gray-200 rounded px-2 py-1 text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-700 text-sm">Failed to fetch tweets</p>
              <p className="text-red-600 text-xs mt-1">{error}</p>
              <a
                href="/api/debug"
                target="_blank"
                className="text-red-500 underline text-xs mt-2 inline-block"
              >
                Run API diagnostics →
              </a>
            </div>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <LoadingSpinner />
            <p className="text-gray-500 text-sm">Fetching real tweets from X API + running AI analysis…</p>
          </div>
        )}

        {/* No results */}
        {!loading && searched && tweets.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-500">No tweets found</p>
            <p className="text-sm mt-1">Try a broader search term or remove filters</p>
          </div>
        )}

        {/* Demo Mode Banner */}
        {isDemo && tweets.length > 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
            <span className="text-amber-500 text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800 text-sm">Demo Mode — Showing Sample Data</p>
              <p className="text-amber-700 text-xs mt-0.5">
                Twitter API requires a paid plan ($100/mo) for search. Upgrade at{' '}
                <a href="https://developer.twitter.com/en/portal/products" target="_blank" className="underline font-medium">developer.twitter.com</a>
                {' '}to see real live tweets. Analysis below uses AI-simulated results.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && tweets.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{tweets.length} tweets found</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Mode: {currentMode.label} · {isDemo ? '🟡 Demo data (upgrade Twitter API for live)' : '🟢 Live data via X API v2'}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/analysis?q=${encodeURIComponent(query)}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
                >
                  <TrendingUp className="w-4 h-4" />
                  Analysis
                </Link>
                <Link
                  href={`/export`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              {tweets.map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  tweet={tweet}
                  analysis={analyses[tweet.id]}
                  displayMode={mode}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
