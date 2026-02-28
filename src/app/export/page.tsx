'use client';

import { useState, useEffect } from 'react';
import {
  Download, FileJson, FileText, Database, RefreshCw,
  CheckCircle, User, Calendar, Heart, Repeat2, MessageCircle,
  ExternalLink, AlertCircle, ArrowLeft,
} from 'lucide-react';
import { Tweet, TweetAnalysis } from '@/lib/types';
import Link from 'next/link';

interface SavedSearch {
  tweets: Tweet[];
  analyses: Record<string, TweetAnalysis>;
  query: string;
  mode: string;
  saved_at: string;
}

type ExportFormat = 'json' | 'csv';

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function escapeCsv(val: string | number | boolean | undefined | null): string {
  const s = String(val ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export default function ExportPage() {
  const [saved, setSaved] = useState<SavedSearch | null>(null);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('socialpulse_last_search');
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const tweets = saved?.tweets ?? [];
  const analyses = saved?.analyses ?? {};

  // ─── Generate CSV ──────────────────────────────────────────────────────────
  const generateCsv = (): string => {
    const headers = [
      'Tweet ID', 'Date & Time', 'Author Name', 'Twitter Handle',
      'Role', 'Verified', 'Followers', 'Tweet Text',
      'Stance', 'Credibility Score (0-100)', 'Sentiment',
      'Is Bot', 'Is Rumor', 'Key Claims',
      'Simple English', 'Hindi Summary (हिंदी सारांश)',
      'Likes', 'Retweets', 'Replies', 'Quote Tweets',
      'Tweet URL',
    ];

    const rows = tweets.map((t) => {
      const a = analyses[t.id];
      return [
        escapeCsv(t.id),
        escapeCsv(formatDate(t.created_at)),
        escapeCsv(t.author.name),
        escapeCsv(`@${t.author.username}`),
        escapeCsv(t.author.role ?? 'Citizen'),
        escapeCsv(t.author.verified ? 'Yes' : 'No'),
        escapeCsv(t.author.followers_count),
        escapeCsv(t.text),
        escapeCsv(a?.stance ?? ''),
        escapeCsv(a?.credibility_score ?? ''),
        escapeCsv(a?.sentiment ?? ''),
        escapeCsv(a?.is_bot ? 'Yes' : 'No'),
        escapeCsv(a?.is_rumor ? 'Yes' : 'No'),
        escapeCsv((a?.key_claims ?? []).join(' | ')),
        escapeCsv(a?.simple_english ?? ''),
        escapeCsv(a?.hindi_summary ?? ''),
        escapeCsv(t.metrics.like_count),
        escapeCsv(t.metrics.retweet_count),
        escapeCsv(t.metrics.reply_count),
        escapeCsv(t.metrics.quote_count),
        escapeCsv(`https://twitter.com/${t.author.username}/status/${t.id}`),
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  // ─── Generate JSON ─────────────────────────────────────────────────────────
  const generateJson = (): string => {
    const data = {
      platform: 'SocialPulse AI',
      exported_at: new Date().toISOString(),
      query: saved?.query ?? '',
      mode: saved?.mode ?? '',
      tweet_count: tweets.length,
      compliance: {
        source: 'X (Twitter) Developer API v2 — Public Data Only',
        policy: 'X Developer Policy Compliant',
        access: 'Read-Only / No Private Data',
      },
      tweets: tweets.map((t) => ({
        id: t.id,
        text: t.text,
        url: `https://twitter.com/${t.author.username}/status/${t.id}`,
        created_at: t.created_at,
        author: {
          name: t.author.name,
          username: `@${t.author.username}`,
          verified: t.author.verified,
          role: t.author.role,
          followers_count: t.author.followers_count,
        },
        metrics: t.metrics,
        ai_analysis: analyses[t.id] ?? null,
      })),
    };
    return JSON.stringify(data, null, 2);
  };

  // ─── Trigger download ──────────────────────────────────────────────────────
  const handleDownload = () => {
    if (tweets.length === 0) return;
    setDownloading(true);
    setTimeout(() => {
      const content = format === 'csv' ? generateCsv() : generateJson();
      const mime = format === 'csv' ? 'text/csv;charset=utf-8;' : 'application/json';
      const filename = `socialpulse-${saved?.query?.replace(/\s+/g, '-') ?? 'export'}-${Date.now()}.${format}`;

      const blob = new Blob(['\uFEFF' + content], { type: mime }); // BOM for Excel CSV
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 400);
  };

  // ─── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/search" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Dataset Export</h1>
          </div>
          <p className="text-sm text-gray-500 ml-8">
            Download tweets + AI analysis as CSV or JSON for research use
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* No data state */}
        {tweets.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Database className="w-14 h-14 mx-auto mb-4 text-gray-200" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No tweets to export</h2>
            <p className="text-gray-400 text-sm mb-6">
              Go to the Search page, search for a topic, and come back here to download.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Go to Search
            </Link>
          </div>
        )}

        {/* Main export UI */}
        {tweets.length > 0 && (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Tweets', value: tweets.length, icon: <Database className="w-5 h-5 text-blue-500" /> },
                { label: 'Verified Authors', value: tweets.filter(t => t.author.verified).length, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
                { label: 'With AI Analysis', value: Object.keys(analyses).length, icon: <FileJson className="w-5 h-5 text-purple-500" /> },
                { label: 'Total Likes', value: formatNumber(tweets.reduce((s, t) => s + t.metrics.like_count, 0)), icon: <Heart className="w-5 h-5 text-red-500" /> },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                  {stat.icon}
                  <div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Format selector + download */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Export Format</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* CSV option */}
                <button
                  onClick={() => setFormat('csv')}
                  className={`p-5 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${format === 'csv'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <FileText className={`w-10 h-10 ${format === 'csv' ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div className="text-center">
                    <div className={`font-bold text-lg ${format === 'csv' ? 'text-blue-700' : 'text-gray-700'}`}>CSV</div>
                    <div className="text-xs text-gray-500 mt-1">Opens in Excel / Google Sheets</div>
                    <div className="text-xs text-gray-400 mt-1">21 columns · UTF-8 with BOM</div>
                  </div>
                  {format === 'csv' && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">Selected</span>
                  )}
                </button>

                {/* JSON option */}
                <button
                  onClick={() => setFormat('json')}
                  className={`p-5 border-2 rounded-xl flex flex-col items-center gap-3 transition-all ${format === 'json'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <FileJson className={`w-10 h-10 ${format === 'json' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="text-center">
                    <div className={`font-bold text-lg ${format === 'json' ? 'text-purple-700' : 'text-gray-700'}`}>JSON</div>
                    <div className="text-xs text-gray-500 mt-1">For Python / NLP pipelines</div>
                    <div className="text-xs text-gray-400 mt-1">Full nested data + compliance info</div>
                  </div>
                  {format === 'json' && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium">Selected</span>
                  )}
                </button>
              </div>

              {/* Query info */}
              {saved && (
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    Last search: <span className="font-semibold text-gray-800">"{saved.query}"</span>
                    {' · '}<span className="capitalize">{saved.mode}</span> mode
                    {' · '}Saved {formatDate(saved.saved_at)}
                  </div>
                </div>
              )}

              {/* Download button */}
              <button
                onClick={handleDownload}
                disabled={downloading || tweets.length === 0}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-sm ${downloaded
                    ? 'bg-green-600 text-white'
                    : format === 'csv'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {downloading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Preparing file...</>
                ) : downloaded ? (
                  <><CheckCircle className="w-6 h-6" /> Downloaded!</>
                ) : (
                  <><Download className="w-6 h-6" /> Download {tweets.length} Tweets as .{format.toUpperCase()}</>
                )}
              </button>
            </div>

            {/* Preview table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Preview ({tweets.length} tweets)</h2>
                <p className="text-xs text-gray-400 mt-0.5">All columns shown below will be included in the export</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3 text-left">Author</th>
                      <th className="px-4 py-3 text-left">Tweet</th>
                      <th className="px-4 py-3 text-left">Stance</th>
                      <th className="px-4 py-3 text-left">Credibility</th>
                      <th className="px-4 py-3 text-left">Engagement</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {tweets.map((tweet) => {
                      const a = analyses[tweet.id];
                      return (
                        <tr key={tweet.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-300 flex-shrink-0" />
                              <div>
                                <div className="font-medium text-gray-900 flex items-center gap-1">
                                  {tweet.author.name}
                                  {tweet.author.verified && <CheckCircle className="w-3 h-3 text-blue-500 fill-blue-500" />}
                                </div>
                                <div className="text-gray-400 text-xs">@{tweet.author.username}</div>
                                <span className="inline-block mt-0.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">
                                  {tweet.author.role ?? 'Citizen'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="text-gray-700 line-clamp-2 text-xs leading-relaxed">{tweet.text}</p>
                          </td>
                          <td className="px-4 py-3">
                            {a?.stance ? (
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.stance === 'Support' ? 'bg-green-100 text-green-700' :
                                  a.stance === 'Oppose' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-600'
                                }`}>{a.stance}</span>
                            ) : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            {a?.credibility_score != null ? (
                              <div className="flex items-center gap-1.5">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${a.credibility_score >= 70 ? 'bg-green-500' :
                                        a.credibility_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                    style={{ width: `${a.credibility_score}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-gray-700">{a.credibility_score}</span>
                              </div>
                            ) : <span className="text-gray-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                              <Heart className="w-3 h-3" />{formatNumber(tweet.metrics.like_count)}
                              <Repeat2 className="w-3 h-3 ml-1" />{formatNumber(tweet.metrics.retweet_count)}
                              <MessageCircle className="w-3 h-3 ml-1" />{formatNumber(tweet.metrics.reply_count)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {formatDate(tweet.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={`https://twitter.com/${tweet.author.username}/status/${tweet.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compliance footer */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-sm text-blue-700">
              🛡️ <strong>Legal & Attribution:</strong> All exported data is publicly available via X Developer API v2.
              Each record includes full speaker attribution (name, handle, verified status).
              For research use only. Not for redistribution or resale.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
