import { NextRequest, NextResponse } from 'next/server';
import { getUserTweets } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const maxResults = searchParams.get('max_results');

    if (!username) {
      return NextResponse.json(
        { error: 'Query parameter "username" is required' },
        { status: 400 }
      );
    }

    const tweets = await getUserTweets(username, maxResults ? parseInt(maxResults) : 20);

    return NextResponse.json({ count: tweets.length, tweets });
  } catch (error) {
    console.error('User API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user tweets' },
      { status: 500 }
    );
  }
}
