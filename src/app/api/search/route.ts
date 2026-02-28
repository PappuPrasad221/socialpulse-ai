import { NextRequest, NextResponse } from 'next/server';
import { searchTweets } from '@/lib/twitter';
import { generateDemoTweets } from '@/lib/demoData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('max_results') || '20', 10);
    const lang = searchParams.get('lang') || undefined;
    const startDate = searchParams.get('start_date') || undefined;
    const endDate = searchParams.get('end_date') || undefined;
    const verifiedOnly = searchParams.get('verified_only') === 'true';
    const mode = searchParams.get('mode') || 'students';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // Mode-aware query enrichment (no is:verified — forbidden on free tier)
    let enrichedQuery = query;
    switch (mode) {
      case 'students':
        enrichedQuery = `${query} -is:retweet lang:en`;
        break;
      case 'research':
        enrichedQuery = `${query} -is:retweet has:links`;
        break;
      case 'journalist':
        enrichedQuery = `${query} -is:retweet`;
        break;
      default:
        enrichedQuery = `${query} -is:retweet`;
    }

    console.log(`[API/search] mode=${mode} query="${enrichedQuery}"`);

    let tweets;
    let isDemo = false;
    let apiError = null;

    // Try real Twitter API first
    try {
      tweets = await searchTweets({
        query: enrichedQuery,
        max_results: Math.min(Math.max(maxResults, 10), 100),
        lang,
        start_date: startDate,
        end_date: endDate,
        verified_only: verifiedOnly,
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('[API/search] Real API failed, switching to demo:', errMsg);
      apiError = errMsg;
      isDemo = true;

      // Fallback to demo data
      tweets = generateDemoTweets(query, mode);
    }

    return NextResponse.json({
      count: tweets.length,
      mode,
      query: enrichedQuery,
      is_demo: isDemo,
      api_error: apiError,
      tweets,
    });
  } catch (error) {
    console.error('[API/search] Unhandled error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch tweets',
        details: error instanceof Error ? error.stack : String(error),
      },
      { status: 500 }
    );
  }
}
