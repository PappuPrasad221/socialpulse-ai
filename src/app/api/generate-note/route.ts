import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const NOTE_SYSTEM_PROMPT = `You are a professional research analyst specializing in social media analysis. Generate structured research notes for tweets that include:

1. **Key Insight**: The main takeaway or significance of the tweet
2. **Context**: Relevant background information
3. **Implications**: What this means for the research topic
4. **Sources**: Any claims that can be verified

Be concise, analytical, and focus on facts.`;

function createNotePrompt(tweetText: string, authorName: string, authorRole: string, topic?: string): string {
  return `Generate a research note for this tweet:
Tweet: "${tweetText}"
Author: ${authorName}
Role: ${authorRole || 'Citizen'}
${topic ? `Research Topic: ${topic}` : ''}

Provide a structured research note covering key insight, context, implications, and any verifiable claims. Keep it concise (2-4 sentences).`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tweet_text, author_name, author_role, topic } = body;

    if (!tweet_text) {
      return NextResponse.json(
        { error: 'tweet_text is required' },
        { status: 400 }
      );
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: NOTE_SYSTEM_PROMPT },
          { role: 'user', content: createNotePrompt(tweet_text, author_name, author_role, topic) },
        ],
        temperature: 0.4,
        max_tokens: 500,
      });

      const note = response.choices[0]?.message?.content;
      
      if (!note) {
        throw new Error('No response from OpenAI');
      }

      return NextResponse.json({ note });
    } catch (openaiError) {
      console.error('OpenAI note generation error:', openaiError);
      
      const fallbackNote = `Research Note: "${tweet_text.substring(0, 100)}..." - Author: ${author_name || 'Unknown'}${author_role ? ` (${author_role})` : ''}. Note: AI generation unavailable. Manual annotation required.`;
      
      return NextResponse.json({ note: fallbackNote });
    }
  } catch (error) {
    console.error('Generate note error:', error);
    return NextResponse.json(
      { error: 'Failed to generate note' },
      { status: 500 }
    );
  }
}
