import OpenAI from 'openai';
import { TweetAnalysis, Speaker } from './types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_SYSTEM_PROMPT = `You are a professional political and social media analyst specializing in Indian political discourse. Analyze tweets for:

1. **Stance Detection**: Classify as Support, Oppose, or Neutral based on the tweet's position toward the main topic/issue
2. **Credibility Scoring**: Assess the credibility of the claim/source (0-100)
3. **Bot Detection**: Identify if the account shows bot-like behavior patterns
4. **Rumor Detection**: Identify if the content contains unverified claims or potential misinformation
5. **Simplification**: Rewrite in simple, clear Indian English
6. **Translation**: Provide a Hindi translation (हिंदी सारांश)

Return a structured JSON response.`;

function createAnalysisPrompt(tweetText: string, speaker: Speaker, topic?: string): string {
  return `Analyze this tweet:
Tweet: "${tweetText}"
Speaker: ${speaker.name} (@${speaker.username})
Verified: ${speaker.verified}
Role: ${speaker.role || 'Unknown'}
Followers: ${speaker.followers_count}
${topic ? `Topic: ${topic}` : ''}

Provide analysis in this JSON format:
{
  "stance": "Support" | "Oppose" | "Neutral",
  "stance_confidence": 0-100,
  "credibility_score": 0-100,
  "credibility_reasons": ["reason1", "reason2"],
  "is_bot": boolean,
  "is_bot_confidence": 0-100,
  "is_rumor": boolean,
  "is_rumor_confidence": 0-100,
  "rumor_explanation": "explanation if rumor detected",
  "simple_english": "rewritten in simple terms",
  "hindi_summary": "हिंदी में सारांश",
  "key_claims": ["claim1", "claim2"],
  "sentiment": "positive" | "negative" | "neutral"
}`;
}

export async function analyzeTweet(
  tweetText: string,
  speaker: Speaker,
  topic?: string
): Promise<TweetAnalysis> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: createAnalysisPrompt(tweetText, speaker, topic) },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  const parsed = JSON.parse(content);

  return {
    stance: parsed.stance || 'Neutral',
    stance_confidence: parsed.stance_confidence || 50,
    credibility_score: parsed.credibility_score || 50,
    credibility_reasons: parsed.credibility_reasons || [],
    is_bot: parsed.is_bot || false,
    is_bot_confidence: parsed.is_bot_confidence || 0,
    is_rumor: parsed.is_rumor || false,
    is_rumor_confidence: parsed.is_rumor_confidence || 0,
    rumor_explanation: parsed.rumor_explanation,
    simple_english: parsed.simple_english || tweetText,
    hindi_summary: parsed.hindi_summary || '',
    key_claims: parsed.key_claims || [],
    sentiment: parsed.sentiment || 'neutral',
  };
}


export async function batchAnalyzeTweets(
  tweets: { text: string; speaker: Speaker; id: string }[],
  topic?: string
): Promise<Record<string, TweetAnalysis>> {
  const results: Record<string, TweetAnalysis> = {};

  for (const tweet of tweets) {
    results[tweet.id] = await analyzeTweet(tweet.text, tweet.speaker, topic);
  }

  return results;
}
