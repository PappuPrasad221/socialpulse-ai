import { NewsArticle, NewsSearchParams } from './types';

const API_BASE = 'https://newsapi.org/v2/everything';

// Demo articles used as fallback when the real API fails
export function generateDemoArticles(query: string): NewsArticle[] {
  const topics = [
    {
      title: `Breaking: Major developments in ${query} — What experts are saying`,
      description: `A comprehensive look at the latest developments surrounding ${query}, with analysis from leading researchers and policy experts.`,
      source: 'Reuters',
      author: 'Jane Doe',
    },
    {
      title: `${query}: Government announces new policy measures`,
      description: `Officials unveil a new framework aimed at addressing concerns related to ${query}, signalling a shift in national strategy.`,
      source: 'The Hindu',
      author: 'Ramesh Iyer',
    },
    {
      title: `Opinion: Is ${query} being handled differently across states?`,
      description: `An opinion piece examining how different regional governments are responding to the ongoing discourse around ${query}.`,
      source: 'Indian Express',
      author: 'Priya Sharma',
    },
    {
      title: `${query} — Timeline of key events in the past 30 days`,
      description: `A chronological breakdown of the most important milestones in the ongoing discussion about ${query}.`,
      source: 'NDTV',
      author: 'Arjun Kapoor',
    },
    {
      title: `International reaction to ${query}: A global perspective`,
      description: `How international media and foreign governments are responding to developments surrounding ${query}.`,
      source: 'BBC News',
      author: 'Sarah Thompson',
    },
    {
      title: `Fact-check: Top claims about ${query} verified`,
      description: `Our fact-checking team examines the most widely circulated claims about ${query} and separates myth from reality.`,
      source: 'Alt News',
      author: 'Mohammed Zubair',
    },
  ];

  const now = new Date();
  return topics.map((t, i) => ({
    id: `demo-${i}-${Date.now()}`,
    title: t.title,
    description: t.description,
    content: t.description,
    url: `https://example.com/news/${encodeURIComponent(query)}-${i}`,
    urlToImage: null,
    publishedAt: new Date(now.getTime() - i * 3_600_000).toISOString(),
    source: { id: null, name: t.source },
    author: t.author,
  }));
}

export async function searchNews(params: NewsSearchParams): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_API_KEY;
  if (!apiKey) throw new Error('NEWSAPI_API_KEY is not set in .env.local');

  const {
    query,
    max_results = 20,
    language = 'en',
    from,
    to,
    sortBy = 'publishedAt',
  } = params;

  const url = new URL(API_BASE);
  url.searchParams.set('q', query);
  url.searchParams.set('pageSize', String(Math.min(max_results, 100)));
  url.searchParams.set('language', language);
  url.searchParams.set('sortBy', sortBy);
  if (from) url.searchParams.set('from', from);
  if (to) url.searchParams.set('to', to);

  console.log('[NewsAPI] Searching:', url.toString().replace(apiKey, '***'));

  const res = await fetch(url.toString(), {
    headers: { 'X-Api-Key': apiKey },
    next: { revalidate: 300 }, // cache for 5 minutes in Next.js
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NewsAPI responded with ${res.status}: ${body}`);
  }

  const data = await res.json();

  if (data.status !== 'ok') {
    throw new Error(`NewsAPI error: ${data.message || data.status}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.articles as any[]).map((a) => ({
    id: Buffer.from(a.url ?? String(Math.random())).toString('base64').slice(0, 16),
    title: a.title ?? 'Untitled',
    description: a.description ?? null,
    content: a.content ?? null,
    url: a.url ?? '#',
    urlToImage: a.urlToImage ?? null,
    publishedAt: a.publishedAt ?? new Date().toISOString(),
    source: { id: a.source?.id ?? null, name: a.source?.name ?? 'Unknown' },
    author: a.author ?? null,
  }));
}
