import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { messages, sessionId, context }: {
            messages: UIMessage[];
            sessionId: string;
            context?: {
                topicTitle?: string;
                topicSummary?: string;
            };
        } = await req.json();

        if (!sessionId) {
            return new NextResponse('Missing sessionId', { status: 400 });
        }

        // Validate that the session belongs to the user
        const { data: sessionData, error: sessionError } = await supabase
            .from('chat_sessions')
            .select('id')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single();

        if (sessionError || !sessionData) {
            return new NextResponse('Session not found', { status: 404 });
        }

        // Get the latest user message and persist it
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role === 'user') {
            // Extract text content from parts
            const userText = latestMessage.parts
                ?.filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
                .map(p => p.text)
                .join('') || '';

            if (userText) {
                await supabase.from('chat_messages').insert({
                    session_id: sessionId,
                    role: 'user',
                    content: userText
                });
            }
        }

        // Extract context for the system prompt
        const topicTitle = context?.topicTitle || 'A learning topic';
        const topicSummary = context?.topicSummary || '';

        // Fetch learner preferences securely
        const { data: learnerData } = await supabase
            .from('learners')
            .select('ai_language_pref, ai_detail_level')
            .eq('user_id', user.id)
            .single();

        const aiLanguagePref = learnerData?.ai_language_pref || 'english';
        const aiDetailLevel = learnerData?.ai_detail_level || 'standard';

        // Resolve language preference into a clear instruction for the model
        const languageInstruction = aiLanguagePref === 'arabic'
            ? 'You MUST respond in Arabic only.'
            : aiLanguagePref === 'mix'
                ? 'Match the language of the user\'s message: if they write in English, respond in English. If they write in Arabic, respond in Arabic.'
                : 'You MUST respond in English only.';

        // Resolve detail level into a clear instruction
        const detailInstruction = aiDetailLevel === 'detailed'
            ? 'Provide thorough, in-depth explanations with examples.'
            : aiDetailLevel === 'short'
                ? 'Keep responses very brief and to the point — 2-3 sentences max.'
                : 'Provide balanced responses — concise but informative.';

        const systemPrompt = `You are the Mallah AI Lesson Tutor, a helpful and expert instructor.
You are currently helping a learner with the topic: "${topicTitle}".
Topic Context: ${topicSummary}

Language Rule: ${languageInstruction}
Detail Level: ${detailInstruction}

Instructions:
1. Act as a supportive, encouraging mentor. 
2. Directly answer the learner's questions using clear, simple analogies.
3. Don't give away direct answers to assignments—guide them to the right conclusion.
4. Follow the language and detail level rules above strictly.`;

        const result = streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages: await convertToModelMessages(messages),
            async onFinish({ text }) {
                // Persist the assistant's response to the database
                await supabase.from('chat_messages').insert({
                    session_id: sessionId,
                    role: 'assistant',
                    content: text
                });
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new NextResponse(error.message || 'Internal server error', { status: 500 });
    }
}
