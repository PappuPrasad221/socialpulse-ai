import { NextRequest, NextResponse } from 'next/server';
import { analyzeTweet } from '@/lib/openai';
import { generateDemoAnalysis } from '@/lib/demoData';
import { Speaker, TweetAnalysis, TweetMetrics } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tweet_text, speaker_info, topic, batch } = body;

    if (!tweet_text || !speaker_info) {
      return NextResponse.json(
        { error: 'tweet_text and speaker_info are required' },
        { status: 400 }
      );
    }

    // Handle batch mode
    if (batch && Array.isArray(batch)) {
      const results: Record<string, TweetAnalysis> = {};

      for (const item of batch as { id: string; text: string; speaker: Speaker; metrics?: TweetMetrics; created_at?: string }[]) {
        try {
          results[item.id] = await analyzeTweet(item.text, item.speaker, topic);
        } catch (err) {
          console.warn('[analyze] OpenAI failed for tweet', item.id, '— using demo analysis');
          // Fallback: generate demo analysis with REAL metrics from the tweet
          results[item.id] = generateDemoAnalysis(
            {
              id: item.id,
              text: item.text,
              author: item.speaker,
              metrics: item.metrics || { retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0 },
              created_at: item.created_at || new Date().toISOString(),
            },
            topic || ''
          );
        }
      }

      return NextResponse.json(results);
    }

    // Single tweet analysis
    let analysis: TweetAnalysis;
    try {
      analysis = await analyzeTweet(tweet_text, speaker_info as Speaker, topic);
    } catch (err) {
      console.warn('[analyze] OpenAI failed — using demo analysis. Error:', err);
      analysis = generateDemoAnalysis(
        { id: 'single', text: tweet_text, author: speaker_info as Speaker, metrics: { retweet_count: 0, reply_count: 0, like_count: 0, quote_count: 0 }, created_at: new Date().toISOString() },
        topic || ''
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('[analyze] Unhandled error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze tweet' },
      { status: 500 }
    );
  }
}
