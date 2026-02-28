import { TwitterApi } from 'twitter-api-v2';
import { Tweet, Speaker, SearchParams } from './types';

const bearerToken = process.env.TWITTER_BEARER_TOKEN;

if (!bearerToken) {
  console.error('[Twitter] TWITTER_BEARER_TOKEN is not set in .env.local');
} else {
  console.log('[Twitter] Bearer token loaded, length:', bearerToken.length);
}

const twitterClient = bearerToken ? new TwitterApi(bearerToken).readOnly : null;

function determineRole(user: {
  description?: string;
  verified?: boolean;
  verified_type?: string;
}): Speaker['role'] {
  if (!user.verified) return 'Citizen';
  const vt = user.verified_type?.toLowerCase() || '';
  if (vt.includes('government') || vt.includes('politic')) return 'Minister';
  if (vt.includes('business') || vt.includes('brand')) return 'Organization';
  if (vt.includes('media') || vt.includes('news')) return 'Media';
  return 'Leader';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformSpeaker(user: any): Speaker {
  const pm = user?.public_metrics || {};
  return {
    id: String(user?.id || ''),
    name: String(user?.name || 'Unknown'),
    username: String(user?.username || 'unknown'),
    verified: Boolean(user?.verified),
    verified_type: user?.verified_type,
    description: user?.description,
    followers_count: Number(pm.followers_count ?? 0),
    following_count: Number(pm.following_count ?? 0),
    tweet_count: Number(pm.tweet_count ?? 0),
    profile_image_url: user?.profile_image_url,
    role: determineRole(user || {}),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformTweet(tweet: any, usersMap: Record<string, any>): Tweet {
  const author = usersMap[tweet.author_id] || {};
  const pm = tweet.public_metrics || {};

  return {
    id: String(tweet.id),
    text: String(tweet.text || ''),
    author: transformSpeaker(author),
    metrics: {
      retweet_count: Number(pm.retweet_count ?? 0),
      reply_count: Number(pm.reply_count ?? 0),
      like_count: Number(pm.like_count ?? 0),
      quote_count: Number(pm.quote_count ?? 0),
      impression_count: Number(pm.impression_count ?? 0),
    },
    created_at: String(tweet.created_at || new Date().toISOString()),
    conversation_id: tweet.conversation_id,
    in_reply_to_user_id: tweet.in_reply_to_user_id,
    referenced_tweets: tweet.referenced_tweets?.map(
      (ref: { type: string; id: string }) => ({
        type: ref.type as 'retweeted' | 'replied_to' | 'quoted',
        id: String(ref.id),
      })
    ),
    entities: tweet.entities,
    context_annotations: tweet.context_annotations,
  };
}

export async function searchTweets(params: SearchParams): Promise<Tweet[]> {
  if (!twitterClient) {
    throw new Error(
      'Twitter API client not initialized. Check TWITTER_BEARER_TOKEN in .env.local'
    );
  }

  const { query, max_results = 20, start_date, end_date, verified_only } = params;

  // NOTE: is:verified is NOT available on free API tier — causes 403.
  // We handle verified filtering client-side after fetch.
  const safeQuery = `${query} -is:retweet lang:en`;
  const safeMaxResults = Math.min(Math.max(max_results, 10), 100);

  console.log('[Twitter] Searching:', safeQuery, '| max_results:', safeMaxResults);

  try {
    const response = await twitterClient.v2.search(safeQuery, {
      'tweet.fields': [
        'created_at',
        'public_metrics',
        'entities',
        'context_annotations',
        'conversation_id',
        'in_reply_to_user_id',
        'referenced_tweets',
        'author_id',
      ],
      expansions: ['author_id'],
      'user.fields': [
        'id',
        'name',
        'username',
        'verified',
        'verified_type',
        'description',
        'public_metrics',
        'profile_image_url',
      ],
      max_results: safeMaxResults,
      ...(start_date ? { start_time: start_date } : {}),
      ...(end_date ? { end_time: end_date } : {}),
    });

    // Build a map of userId → user for O(1) lookup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersMap: Record<string, any> = {};
    const users = response.includes?.users || [];
    for (const u of users) {
      usersMap[u.id] = u;
    }

    // FIX: response.data is an array of tweet objects — iterate directly
    const tweetsArray = Array.isArray(response.data)
      ? response.data
      : response.data
      ? [response.data]
      : [];

    console.log('[Twitter] Raw tweets received:', tweetsArray.length);
    console.log('[Twitter] Users in includes:', users.length);

    const tweets = tweetsArray.map((t) => transformTweet(t, usersMap));

    // Apply verified filter client-side (safe, no API operator needed)
    const filtered = verified_only ? tweets.filter((t) => t.author.verified) : tweets;

    console.log('[Twitter] After filtering:', filtered.length, 'tweets');
    return filtered;
  } catch (error) {
    // Log the full error for debugging
    console.error('[Twitter] API Error:', JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      throw new Error(`Twitter API failed: ${error.message}`);
    }
    throw new Error('Twitter API failed with unknown error');
  }
}

export async function getUserTweets(username: string, max_results = 20): Promise<Tweet[]> {
  if (!twitterClient) {
    throw new Error('Twitter API client not initialized');
  }

  try {
    console.log('[Twitter] Fetching user:', username);

    const userResp = await twitterClient.v2.userByUsername(username, {
      'user.fields': [
        'id',
        'name',
        'username',
        'verified',
        'verified_type',
        'description',
        'public_metrics',
        'profile_image_url',
      ],
    });

    if (!userResp.data) {
      throw new Error(`User @${username} not found`);
    }

    const response = await twitterClient.v2.userTimeline(userResp.data.id, {
      'tweet.fields': [
        'created_at',
        'public_metrics',
        'entities',
        'context_annotations',
        'conversation_id',
        'in_reply_to_user_id',
        'referenced_tweets',
        'author_id',
      ],
      expansions: ['author_id'],
      'user.fields': [
        'id',
        'name',
        'username',
        'verified',
        'verified_type',
        'description',
        'public_metrics',
        'profile_image_url',
      ],
      max_results: Math.min(max_results, 100),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const usersMap: Record<string, any> = {};
    const users = response.includes?.users || [];
    for (const u of users) usersMap[u.id] = u;
    // Also add the primary user
    usersMap[userResp.data.id] = userResp.data;

    const tweetsArray = Array.isArray(response.data)
      ? response.data
      : response.data
      ? [response.data]
      : [];

    console.log('[Twitter] User timeline tweets:', tweetsArray.length);
    return tweetsArray.map((t) => transformTweet(t, usersMap));
  } catch (error) {
    console.error('[Twitter] getUserTweets error:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to fetch tweets for @${username}`);
  }
}

export async function getTimelineTweets(params: SearchParams): Promise<Tweet[]> {
  return searchTweets(params);
}
