import { Tweet, TweetAnalysis } from './types';

// Realistic demo tweets for fallback when API is unavailable
// These simulate real public tweets on various topics

export function generateDemoTweets(query: string, mode: string): Tweet[] {
    const q = query.toLowerCase();
    const now = new Date();

    const demoData: Record<string, Tweet[]> = {
        default: [
            {
                id: 'demo_001',
                text: `📢 Important update on ${query}: The latest developments show significant changes in policy and public opinion. We urge all stakeholders to take note of these evolving trends. #${query.replace(/\s+/g, '')} #PublicPolicy`,
                author: {
                    id: 'u_001',
                    name: 'Rajnath Singh',
                    username: 'rajnathsingh',
                    verified: true,
                    verified_type: 'Government',
                    description: 'Union Defence Minister of India | Member of Parliament',
                    followers_count: 4800000,
                    following_count: 312,
                    tweet_count: 12400,
                    profile_image_url: 'https://pbs.twimg.com/profile_images/1234567890/photo_normal.jpg',
                    role: 'Minister',
                },
                metrics: { retweet_count: 3420, reply_count: 892, like_count: 18500, quote_count: 421, impression_count: 280000 },
                created_at: new Date(now.getTime() - 1 * 3600000).toISOString(),
            },
            {
                id: 'demo_002',
                text: `The situation regarding ${query} must be addressed immediately. Citizens deserve transparency and honest answers from those in power. We will not stay silent! #IndiaFirst #Accountability`,
                author: {
                    id: 'u_002',
                    name: 'Rahul Gandhi',
                    username: 'RahulGandhi',
                    verified: true,
                    verified_type: 'Politics',
                    description: 'Member of Parliament | Indian National Congress',
                    followers_count: 22000000,
                    following_count: 5100,
                    tweet_count: 34200,
                    profile_image_url: '',
                    role: 'Leader',
                },
                metrics: { retweet_count: 8200, reply_count: 4100, like_count: 42000, quote_count: 1200, impression_count: 620000 },
                created_at: new Date(now.getTime() - 2 * 3600000).toISOString(),
            },
            {
                id: 'demo_003',
                text: `Breaking: Multiple sources confirm that discussions around ${query} have reached a critical juncture. Officials are expected to make a formal statement by evening. Follow live updates. 🔴 #Breaking #India`,
                author: {
                    id: 'u_003',
                    name: 'NDTV',
                    username: 'ndtv',
                    verified: true,
                    verified_type: 'Media',
                    description: "India's leading news channel | @NDTVIndia",
                    followers_count: 9100000,
                    following_count: 980,
                    tweet_count: 520000,
                    profile_image_url: '',
                    role: 'Media',
                },
                metrics: { retweet_count: 5600, reply_count: 1200, like_count: 28000, quote_count: 890, impression_count: 450000 },
                created_at: new Date(now.getTime() - 3 * 3600000).toISOString(),
            },
            {
                id: 'demo_004',
                text: `As a researcher studying ${query}, I find the data alarming. Government needs to present evidence-based solutions. Papers and reports clearly indicate systemic issues that need addressing urgently.`,
                author: {
                    id: 'u_004',
                    name: 'Dr. Priya Sharma',
                    username: 'DrPriyaSharmaInd',
                    verified: false,
                    description: 'Senior Research Fellow | Public Policy Analyst | IIM Ahmedabad',
                    followers_count: 47000,
                    following_count: 890,
                    tweet_count: 8400,
                    profile_image_url: '',
                    role: 'Citizen',
                },
                metrics: { retweet_count: 1200, reply_count: 340, like_count: 5600, quote_count: 180, impression_count: 82000 },
                created_at: new Date(now.getTime() - 4 * 3600000).toISOString(),
            },
            {
                id: 'demo_005',
                text: `Government's new initiative on ${query} is exactly what India needed. Proactive steps like these will ensure growth and stability for millions. Thank you PM @narendramodi for this bold decision! 🇮🇳`,
                author: {
                    id: 'u_005',
                    name: 'Smriti Irani',
                    username: 'smritiirani',
                    verified: true,
                    verified_type: 'Government',
                    description: 'Union Cabinet Minister | Member of Parliament, Amethi',
                    followers_count: 8200000,
                    following_count: 624,
                    tweet_count: 19800,
                    profile_image_url: '',
                    role: 'Minister',
                },
                metrics: { retweet_count: 4100, reply_count: 980, like_count: 22000, quote_count: 560, impression_count: 320000 },
                created_at: new Date(now.getTime() - 5 * 3600000).toISOString(),
            },
            {
                id: 'demo_006',
                text: `Just attended a panel discussion on ${query}. The diversity of opinions was striking — from complete opposition to cautious optimism. India's democratic discourse is alive and well. My full report thread ↓`,
                author: {
                    id: 'u_006',
                    name: 'Barkha Dutt',
                    username: 'BDUTT',
                    verified: true,
                    verified_type: 'Media',
                    description: 'Journalist | Founder @mojoStoryIndia | Author',
                    followers_count: 5700000,
                    following_count: 3200,
                    tweet_count: 98000,
                    profile_image_url: '',
                    role: 'Media',
                },
                metrics: { retweet_count: 2800, reply_count: 1400, like_count: 14000, quote_count: 420, impression_count: 210000 },
                created_at: new Date(now.getTime() - 6 * 3600000).toISOString(),
            },
            {
                id: 'demo_007',
                text: `Why is nobody talking about the real impact of ${query} on rural India? I live in a small village in Bihar and every day I see how these policies affect ordinary people. Please share. 🙏 #RuralIndia #GrassrootsVoice`,
                author: {
                    id: 'u_007',
                    name: 'Amit Kumar',
                    username: 'amitk_speaks',
                    verified: false,
                    description: 'Farmer | Social Activist | Bihar | Voice of the common people',
                    followers_count: 12300,
                    following_count: 450,
                    tweet_count: 3200,
                    profile_image_url: '',
                    role: 'Citizen',
                },
                metrics: { retweet_count: 6800, reply_count: 2100, like_count: 31000, quote_count: 940, impression_count: 420000 },
                created_at: new Date(now.getTime() - 8 * 3600000).toISOString(),
            },
            {
                id: 'demo_008',
                text: `India's stand on ${query} at the international forum was commendable. We must protect our national interests while remaining open to dialogue. Proud of our diplomacy. 🇮🇳 #IndiaRises`,
                author: {
                    id: 'u_008',
                    name: 'S. Jaishankar',
                    username: 'DrSJaishankar',
                    verified: true,
                    verified_type: 'Government',
                    description: 'External Affairs Minister of India | Member of Parliament',
                    followers_count: 7400000,
                    following_count: 210,
                    tweet_count: 8900,
                    profile_image_url: '',
                    role: 'Minister',
                },
                metrics: { retweet_count: 9100, reply_count: 1800, like_count: 54000, quote_count: 1400, impression_count: 780000 },
                created_at: new Date(now.getTime() - 10 * 3600000).toISOString(),
            },
        ],
    };

    // Pick the topic-matched set or fall back to default
    const topicKey = Object.keys(demoData).find((k) => q.includes(k)) || 'default';
    let tweets = demoData[topicKey] || demoData.default;

    // Customize tweet text slightly based on actual query
    tweets = tweets.map((t) => ({
        ...t,
        text: t.text.replace(/default_topic/g, query),
    }));

    // Filter by mode
    if (mode === 'journalist') {
        return tweets.filter((t) => t.author.verified || t.author.followers_count > 100000);
    }
    if (mode === 'research') {
        return tweets.filter((t) => t.author.followers_count > 10000 || t.author.role === 'Citizen');
    }

    return tweets;
}

export function generateDemoAnalysis(tweet: Tweet, topic: string): TweetAnalysis {
    const text = tweet.text.toLowerCase();
    const role = tweet.author.role || 'Citizen';

    // ── 1. STANCE DETECTION ───────────────────────────────────────────────────
    // Broad keyword sets for more reliable detection
    const strongSupportKw = ['excellent', 'commendable', 'proud', 'exactly what india needed', 'bold decision',
        'thank you pm', 'well done', 'great initiative', 'hats off', 'historic', 'wonderful', 'applaud',
        'congratulate', 'celebrate', 'milestone', 'achievement', 'progressive', 'welcomed', 'hopeful',
        'positive step', 'right direction', 'proactive', 'commend'];
    const mildSupportKw = ['needed', 'initiative', 'important', 'necessary', 'good', 'support',
        'benefit', 'advantage', 'growth', 'stability', 'progress', 'stand', 'proud', 'endorse'];
    const strongOpposeKw = ['alarming', 'will not stay silent', 'unacceptable', 'shameful',
        'dangerous', 'failure', 'betrayal', 'demand accountability', 'must resign', 'condemn',
        'outraged', 'injustice', 'exploitation', 'corrupt', 'incompetent', 'misleading', 'lie',
        'cover up', 'crisis', 'disaster', 'protest', 'reject', 'oppose'];
    const mildOpposeKw = ['accountability', 'transparency', 'not stay silent', 'must be addressed',
        'concerned', 'worry', 'question', 'doubt', 'challenge', 'issue', 'problem', 'failure'];
    const analyticKw = ['research', 'data', 'study', 'report', 'analysis', 'evidence', 'survey',
        'according to', 'findings', 'statistics', 'paper', 'systemic', 'structural'];
    const emotionalKw = ['ordinary people', 'grassroots', 'village', 'rural', 'farmers', 'poor',
        'suffering', 'struggling', 'plea', 'please share', 'voice', 'real impact'];

    const ss = strongSupportKw.filter((k) => text.includes(k)).length;
    const ms = mildSupportKw.filter((k) => text.includes(k)).length;
    const so = strongOpposeKw.filter((k) => text.includes(k)).length;
    const mo = mildOpposeKw.filter((k) => text.includes(k)).length;
    const an = analyticKw.filter((k) => text.includes(k)).length;
    const em = emotionalKw.filter((k) => text.includes(k)).length;

    const supportScore = ss * 3 + ms;
    const opposeScore = so * 3 + mo;

    // Role-based prior (Ministers tend to support, Opposition to oppose, etc.)
    type StanceType = 'Support' | 'Oppose' | 'Neutral';
    let stance: StanceType;
    let stanceConfidence: number;
    let argumentType: string;

    if (role === 'Minister' || role === 'Organization') {
        // Government bodies almost always take a Support stance
        if (opposeScore > supportScore + 2) {
            stance = 'Oppose'; stanceConfidence = 70 + so * 4; argumentType = 'Policy Counter-Statement';
        } else {
            stance = 'Support'; stanceConfidence = 75 + ss * 3 + ms; argumentType = 'Policy Advocacy';
        }
    } else if (role === 'Leader') {
        // Political leaders (especially opposition) mostly oppose
        if (supportScore > opposeScore + 2) {
            stance = 'Support'; stanceConfidence = 68 + ss * 3; argumentType = 'Political Endorsement';
        } else {
            stance = 'Oppose'; stanceConfidence = 72 + so * 4 + mo; argumentType = 'Political Opposition';
        }
    } else if (role === 'Media') {
        // Media is analytical / neutral with slight lean based on content
        if (supportScore > opposeScore + 1) {
            stance = 'Support'; stanceConfidence = 62; argumentType = 'Investigative Report';
        } else if (opposeScore > supportScore + 1) {
            stance = 'Oppose'; stanceConfidence = 64; argumentType = 'Critical Journalism';
        } else {
            stance = 'Neutral'; stanceConfidence = 60 + an * 3; argumentType = 'Analytical Report';
        }
    } else {
        // Citizens / Researchers
        if (an > 0) {
            // Researcher-type content
            if (supportScore > opposeScore) { stance = 'Support'; stanceConfidence = 66; argumentType = 'Evidence-Based Support'; }
            else if (opposeScore > supportScore) { stance = 'Oppose'; stanceConfidence = 68; argumentType = 'Evidence-Based Critique'; }
            else { stance = 'Neutral'; stanceConfidence = 58 + an * 4; argumentType = 'Academic Analysis'; }
        } else if (em > 0) {
            // Emotional / grassroots voice
            stance = opposeScore >= supportScore ? 'Oppose' : 'Support';
            stanceConfidence = 62; argumentType = 'Grassroots / Emotional Appeal';
        } else {
            if (supportScore > opposeScore) { stance = 'Support'; stanceConfidence = 64; argumentType = 'Public Opinion'; }
            else if (opposeScore > supportScore) { stance = 'Oppose'; stanceConfidence = 66; argumentType = 'Critical Opinion'; }
            else { stance = 'Neutral'; stanceConfidence = 58; argumentType = 'Balanced Observation'; }
        }
    }

    // Cap confidence
    stanceConfidence = Math.min(Math.max(stanceConfidence, 55), 94);

    // ── 2. CREDIBILITY SCORE ──────────────────────────────────────────────────
    let credScore = 45;
    if (tweet.author.verified) credScore += 22;
    if (tweet.author.followers_count > 5000000) credScore += 18;
    else if (tweet.author.followers_count > 1000000) credScore += 14;
    else if (tweet.author.followers_count > 100000) credScore += 9;
    else if (tweet.author.followers_count > 10000) credScore += 4;
    if (role === 'Minister') credScore += 11;
    if (role === 'Media') credScore += 7;
    if (role === 'Leader') credScore += 6;
    if (an > 0) credScore += 4; // researcher-type language
    credScore = Math.min(credScore, 98);

    const reasons: string[] = [];
    if (tweet.author.verified) reasons.push('Verified account on X platform');
    if (tweet.author.followers_count > 1000000) reasons.push('High follower count — prominent public figure');
    else if (tweet.author.followers_count > 100000) reasons.push('Significant audience reach (100K+ followers)');
    if (role === 'Minister') reasons.push('Active government official — authoritative source');
    if (role === 'Media') reasons.push('Established media organization');
    if (role === 'Leader') reasons.push('Elected political representative');
    if (an > 0) reasons.push('Uses data/research-based language');
    if (!tweet.author.verified) reasons.push('Unverified account — independent cross-check recommended');
    if (tweet.author.followers_count < 50000) reasons.push('Relatively limited reach — assess source carefully');

    // ── 3. KEY CLAIMS (4–5 distinct, tweet-specific claims) ──────────────────
    // Extract a meaningful snippet from the actual tweet text (not just topic)
    const rawSnippet = tweet.text.replace(/https?:\/\/\S+/g, '').replace(/#\w+/g, '').trim();
    const snippet = rawSnippet.length > 90 ? rawSnippet.substring(0, 90) + '…' : rawSnippet;

    const keyClaims: string[] = [
        // Claim 1: Who said what
        `${tweet.author.name} (${role}) publicly states: "${snippet}"`,
        // Claim 2: Stance classification
        `Argument classified as '${argumentType}' — ${stance === 'Support' ? 'advocates for' : stance === 'Oppose' ? 'criticises' : 'presents a balanced view of'} ${topic}`,
        // Claim 3: Rhetorical/content focus
        (() => {
            if (an > 1) return `Uses empirical language — references data, research, or systemic evidence (${an} indicator(s) found)`;
            if (em > 0) return `Employs emotional appeal targeting lived experiences of ordinary/rural populations`;
            if (ss > 0 || ms > 0) return `Contains ${ss} strong + ${ms} mild support signal(s); tone is affirmative and endorsing`;
            if (so > 0 || mo > 0) return `Contains ${so} strong + ${mo} mild opposition signal(s); tone is critical and questioning`;
            return `Tone is measured and informational; avoids explicit partisan framing`;
        })(),
        // Claim 4: Influence / reach assessment
        `Estimated reach: ${tweet.metrics.impression_count ? (tweet.metrics.impression_count / 1000).toFixed(0) + 'K impressions' : (tweet.metrics.like_count * 12 / 1000).toFixed(0) + 'K estimated impressions'} — ${tweet.metrics.retweet_count.toLocaleString()} retweets amplifying message`,
        // Claim 5: Source credibility verdict
        `Source credibility score: ${credScore}/100 (${credScore >= 70 ? 'HIGH' : credScore >= 45 ? 'MEDIUM' : 'LOW'}) — ${reasons[0] || 'Assess independently'}`,
    ];

    // ── 4. SIMPLE ENGLISH & HINDI ─────────────────────────────────────────────
    const stanceWord = stance === 'Support' ? 'in favour of' : stance === 'Oppose' ? 'against' : 'neutral about';
    const simpleEnglish = `${tweet.author.name}, a ${role.toLowerCase()}, has shared their view on ${topic}. They appear to be ${stanceWord} this topic. "${rawSnippet.substring(0, 110)}…" Their account has ${tweet.author.followers_count.toLocaleString()} followers and ${tweet.author.verified ? 'is' : 'is not'} verified on X.`;

    const hindiStance = stance === 'Support' ? 'समर्थन' : stance === 'Oppose' ? 'विरोध' : 'तटस्थ';
    const hindiSummary = `${tweet.author.name} (${role}) ने X (Twitter) पर ${topic} के बारे में अपनी राय साझा की। उनका रुख ${hindiStance} का है। उनके ${tweet.author.followers_count.toLocaleString()} फॉलोअर हैं और ${tweet.author.verified ? 'उनका अकाउंट वेरिफ़ाइड है' : 'उनका अकाउंट वेरिफ़ाइड नहीं है'}। विश्वसनीयता स्कोर: ${credScore}/100।`;

    return {
        stance,
        stance_confidence: stanceConfidence,
        credibility_score: credScore,
        credibility_reasons: reasons,
        is_bot: false,
        is_bot_confidence: tweet.author.verified ? 2 : tweet.author.followers_count < 500 ? 35 : 8,
        is_rumor: credScore < 42,
        is_rumor_confidence: Math.max(0, 55 - credScore),
        rumor_explanation: credScore < 42 ? 'Low credibility signals detected — independently verify before citing or sharing' : undefined,
        simple_english: simpleEnglish,
        hindi_summary: hindiSummary,
        key_claims: keyClaims,
        argument_type: argumentType,
        sentiment: stance === 'Support' ? 'positive' : stance === 'Oppose' ? 'negative' : an > 0 ? 'analytical' : 'neutral',
    };
}
