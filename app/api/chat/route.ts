import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
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

        const { messages, sessionId, context } = await req.json();

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

        // Get the latest user message
        const latestMessage = messages[messages.length - 1];

        // Persist the user message to the database before processing
        if (latestMessage.role === 'user') {
            await supabase.from('chat_messages').insert({
                session_id: sessionId,
                role: 'user',
                content: latestMessage.content
            });
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

        const systemPrompt = `You are the Mallah AI Lesson Tutor, a helpful and expert instructor.
You are currently helping a learner with the topic: "${topicTitle}".
Topic Context: ${topicSummary}

The learner's preferences:
- Language: ${aiLanguagePref}
- Detail Level: ${aiDetailLevel}

Instructions:
1. Act as a supportive, encouraging mentor. 
2. Directly answer the learner's questions using clear, simple analogies.
3. Don't give away direct answers to assignments—guide them to the right conclusion.
4. Keep your responses concise unless they asked for a detailed explanation.
5. Provide your answers in the requested language preference.`;

        const result = streamText({
            model: openai('gpt-4o'),
            system: systemPrompt,
            messages,
            async onFinish({ text }) {
                // Persist the assistant's response to the database
                await supabase.from('chat_messages').insert({
                    session_id: sessionId,
                    role: 'assistant',
                    content: text
                });
            },
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new NextResponse(error.message || 'Internal server error', { status: 500 });
    }
}
