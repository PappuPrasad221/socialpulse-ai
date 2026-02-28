import { NextResponse } from 'next/server';

export async function GET() {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    const openaiKey = process.env.OPENAI_API_KEY;

    const results: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        env: {
            TWITTER_BEARER_TOKEN: bearerToken
                ? `SET (length: ${bearerToken.length}, starts: ${bearerToken.substring(0, 12)}...)`
                : 'NOT SET ❌',
            OPENAI_API_KEY: openaiKey
                ? `SET (length: ${openaiKey.length}, starts: ${openaiKey.substring(0, 8)}...)`
                : 'NOT SET ❌',
        },
    };

    // Test Twitter API
    if (bearerToken) {
        try {
            const { TwitterApi } = await import('twitter-api-v2');
            const client = new TwitterApi(bearerToken).readOnly;
            const resp = await client.v2.search('hello -is:retweet lang:en', {
                max_results: 10,
                'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
                expansions: ['author_id'],
                'user.fields': ['name', 'username', 'verified'],
            });

            const tweetsArr = Array.isArray(resp.data) ? resp.data : resp.data ? [resp.data] : [];
            const users = resp.includes?.users || [];

            results.twitter = {
                status: '✅ SUCCESS',
                tweets_fetched: tweetsArr.length,
                users_in_includes: users.length,
                first_tweet: tweetsArr[0]
                    ? {
                        id: tweetsArr[0].id,
                        text: tweetsArr[0].text?.substring(0, 100) + '...',
                        author_id: tweetsArr[0].author_id,
                    }
                    : null,
                raw_data_type: typeof resp.data,
                is_array: Array.isArray(resp.data),
            };
        } catch (err) {
            results.twitter = {
                status: '❌ FAILED',
                error: err instanceof Error ? err.message : String(err),
                error_code: (err as { code?: number })?.code,
            };
        }
    } else {
        results.twitter = { status: '❌ SKIPPED — no token' };
    }

    // Test OpenAI
    if (openaiKey) {
        try {
            const OpenAI = (await import('openai')).default;
            const openai = new OpenAI({ apiKey: openaiKey });
            const resp = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: 'Reply with only the word: OK' }],
                max_tokens: 5,
            });
            results.openai = {
                status: '✅ SUCCESS',
                response: resp.choices[0]?.message?.content,
            };
        } catch (err) {
            results.openai = {
                status: '❌ FAILED',
                error: err instanceof Error ? err.message : String(err),
            };
        }
    } else {
        results.openai = { status: '❌ SKIPPED — no key' };
    }

    return NextResponse.json(results, { status: 200 });
}
