export interface Tweet {
  id: string;
  text: string;
  author: Speaker;
  metrics: TweetMetrics;
  created_at: string;
  conversation_id?: string;
  in_reply_to_user_id?: string;
  referenced_tweets?: ReferencedTweet[];
  entities?: TweetEntities;
  context_annotations?: ContextAnnotation[];
}

export interface Speaker {
  id: string;
  name: string;
  username: string;
  verified: boolean;
  verified_type?: string;
  description?: string;
  followers_count: number;
  following_count: number;
  tweet_count: number;
  profile_image_url?: string;
  role?: 'Minister' | 'Leader' | 'Citizen' | 'Media' | 'Organization' | 'Unknown';
}

export interface TweetMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  impression_count?: number;
}

export interface ReferencedTweet {
  type: 'retweeted' | 'replied_to' | 'quoted';
  id: string;
}

export interface TweetEntities {
  hashtags: { tag: string; start: number; end: number }[];
  mentions: { username: string; start: number; end: number }[];
  urls: { url: string; expanded_url: string; start: number; end: number }[];
  annotations?: { text: string; probability: number; type: string }[];
}

export interface ContextAnnotation {
  domain: { id: string; name: string };
  entity: { id: string; name: string };
}

export interface TweetAnalysis {
  stance: 'Support' | 'Oppose' | 'Neutral';
  stance_confidence: number;
  credibility_score: number;
  credibility_reasons: string[];
  is_bot: boolean;
  is_bot_confidence: number;
  is_rumor: boolean;
  is_rumor_confidence: number;
  rumor_explanation?: string;
  simple_english: string;
  hindi_summary: string;
  key_claims: string[];
  argument_type?: string;
  sentiment: 'positive' | 'negative' | 'neutral' | 'analytical';
}

export interface SearchParams {
  query: string;
  max_results?: number;
  lang?: string;
  start_date?: string;
  end_date?: string;
  verified_only?: boolean;
}

export interface TimelineData {
  date: string;
  count: number;
  support: number;
  oppose: number;
  neutral: number;
}

export interface ExportData {
  tweets: Tweet[];
  analyses: Record<string, TweetAnalysis>;
  exported_at: string;
  query: string;
}

export interface ResearchItem {
  id: string;
  tweet: Tweet;
  tags: string[];
  aiNote: string;
  manualNote: string;
  noteMode: 'ai' | 'manual';
  savedAt: Date;
}
