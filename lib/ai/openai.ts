import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is not set. AI features will not work.");
}

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
});

export const AI_MODEL = "gpt-4o-mini";

export async function generateAIResponse(
    systemPrompt: string,
    userMessage: string,
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
        return "AI features are currently unavailable. Please configure the OPENAI_API_KEY.";
    }

    const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
    });

    return response.choices[0]?.message?.content || "No response generated.";
}

export async function generateAIResponseWithHistory(
    systemPrompt: string,
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    options?: {
        temperature?: number;
        maxTokens?: number;
    }
): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
        return "AI features are currently unavailable. Please configure the OPENAI_API_KEY.";
    }

    const response = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            ...messages,
        ],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 1024,
    });

    return response.choices[0]?.message?.content || "No response generated.";
}
