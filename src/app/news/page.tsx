'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Newspaper,
  Search,
  ExternalLink,
  AlertCircle,
  Calendar,
  User,
  Globe,
  RefreshCw,
  Filter,
  Clock,
  TrendingUp,
  Star,
} from 'lucide-react';
import { NewsArticle } from '@/lib/types';

const SORT_OPTIONS = [
  { value: 'publishedAt', label: 'Latest', icon: Clock },
  { value: 'relevancy', label: 'Relevant', icon: Star },
  { value: 'popularity', label: 'Popular', icon: TrendingUp },
] as const;

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ar', label: 'Arabic' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
];

function ArticleSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="h-48 bg-gradient-to-r from-gray-100 to-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-5 bg-gray-200 rounded w-full" />
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-8 bg-gray-100 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

function ArticleCard({ article, index }: { article: NewsArticle; index: number }) {
  const pubDate = new Date(article.publishedAt);
  const formattedDate = pubDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden flex-shrink-0">
        {article.urlToImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Newspaper className="w-12 h-12 text-blue-200" />
          </div>
        )}
        {/* Source badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full border border-white shadow-sm">
            {article.source.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
          {article.author && (
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{article.author}</span>
            </span>
          )}
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {article.title}
        </h3>

        {article.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {article.description}
          </p>
        )}

        <div className="mt-auto">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Read Article
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export default function NewsPage() {
  const [query, setQuery] = useState('India');
  const [language, setLanguage] = useState('en');
  const [sortBy, setSortBy] = useState<'relevancy' | 'popularity' | 'publishedAt'>('publishedAt');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const fetchNews = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setSearched(true);

    const params = new URLSearchParams({ q: query, language, sortBy });
    if (from) params.set('from', from);
    if (to) params.set('to', to);

    try {
      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      setArticles(data.articles ?? []);
      setIsDemo(data.is_demo ?? false);
      setApiError(data.api_error ?? null);
    } catch {
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, language, sortBy, from, to]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero / Search Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
              <Globe className="w-4 h-4" />
              Powered by NewsAPI — 75,000+ Sources
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
              News Feed
            </h1>
            <p className="text-blue-100 text-lg max-w-xl mx-auto">
              Search real news articles to cross-reference and enrich your social media research.
            </p>
          </motion.div>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search news articles…"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base shadow-lg"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-60 flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>

            {/* Filter toggle */}
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-1.5 text-blue-100 text-sm hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <div>
                    <label className="block text-xs text-blue-200 mb-1">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value} className="text-gray-900">
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-blue-200 mb-1">From Date</label>
                    <input
                      type="date"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-200 mb-1">To Date</label>
                    <input
                      type="date"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-blue-200 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as 'relevancy' | 'popularity' | 'publishedAt')
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/10 text-white text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-sm"
                    >
                      {SORT_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} className="text-gray-900">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Sort tabs (top bar) */}
        {searched && !isLoading && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-6 flex-wrap gap-3"
          >
            <p className="text-gray-600 text-sm">
              <span className="font-semibold text-gray-900">{articles.length}</span> articles found for{' '}
              <span className="font-semibold text-blue-700">&quot;{query}&quot;</span>
            </p>
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value as typeof sortBy)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sortBy === value
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Demo banner */}
        <AnimatePresence>
          {isDemo && searched && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm"
            >
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Demo Mode — Showing sample articles</p>
                {apiError && (
                  <p className="text-amber-700 mt-0.5">NewsAPI error: {apiError}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {!isLoading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <ArticleCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && searched && articles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-gray-400"
          >
            <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold text-gray-500 mb-1">No articles found</p>
            <p className="text-sm">Try a different query or adjust your filters</p>
          </motion.div>
        )}

        {/* Initial state */}
        {!isLoading && !searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Newspaper className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Search the News</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter a keyword above to pull real news articles from 75,000+ global sources and
              cross-reference them with your social media research.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['India elections', 'Climate policy', 'AI regulation', 'Budget 2025'].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                  }}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
