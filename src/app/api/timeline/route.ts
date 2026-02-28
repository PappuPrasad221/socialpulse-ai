import { NextRequest, NextResponse } from 'next/server';
import { searchTweets } from '@/lib/twitter';
import { TimelineData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const days = searchParams.get('days') || '7';

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const daysNum = parseInt(days);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const tweets = await searchTweets({
      query,
      max_results: 100,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

    const timelineMap = new Map<string, TimelineData>();

    tweets.forEach((tweet) => {
      const date = new Date(tweet.created_at).toISOString().split('T')[0];
      if (!timelineMap.has(date)) {
        timelineMap.set(date, { date, count: 0, support: 0, oppose: 0, neutral: 0 });
      }
      const entry = timelineMap.get(date)!;
      entry.count++;
    });

    const timeline = Array.from(timelineMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return NextResponse.json({ timeline, total: tweets.length });
  } catch (error) {
    console.error('Timeline API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch timeline' },
      { status: 500 }
    );
  }
}
