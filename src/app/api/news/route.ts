import { NextRequest, NextResponse } from 'next/server';
import { searchNews, generateDemoArticles } from '@/lib/newsapi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('max_results') || '20', 10);
    const language = searchParams.get('language') || 'en';
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;
    const sortBy = (searchParams.get('sortBy') || 'publishedAt') as
      | 'relevancy'
      | 'popularity'
      | 'publishedAt';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    console.log(`[API/news] query="${query}" max_results=${maxResults} sortBy=${sortBy}`);

    let articles;
    let isDemo = false;
    let apiError = null;

    // Try real NewsAPI first
    try {
      articles = await searchNews({ query, max_results: maxResults, language, from, to, sortBy });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('[API/news] Real NewsAPI failed, switching to demo:', errMsg);
      apiError = errMsg;
      isDemo = true;
      articles = generateDemoArticles(query);
    }

    return NextResponse.json({
      count: articles.length,
      query,
      is_demo: isDemo,
      api_error: apiError,
      articles,
    });
  } catch (error) {
    console.error('[API/news] Unhandled error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch news',
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
