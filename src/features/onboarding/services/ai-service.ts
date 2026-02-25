import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import {
    OnboardingResponse,
    InterestVector,
    WorkstyleVector,
    ConfidenceSnapshot,
    AILanguagePref,
    AIDetailLevel
} from "../types";

const RecommendationSchema = z.object({
    recommended_path_id: z.enum(["frontend", "fullstack", "cybersecurity", "datascience"]),
    confidence_score: z.number().min(0).max(100),
    explanation: z.object({
        summary: z.string(),
        top_3_reasons: z.array(z.string()),
        what_this_path_looks_like: z.string(),
    }),
    alternatives: z.array(z.object({
        path_id: z.string(),
        why_it_was_close: z.string(),
    })).max(2),
    starter_plan_2_weeks: z.array(z.object({
        week: z.number(),
        actions: z.array(z.string()),
    })),
    first_milestone: z.object({
        title: z.string(),
        success_criteria: z.array(z.string()),
    }),
    risk_flags: z.array(z.string()).optional(),
    next_step_choice: z.enum(["recommended", "ask_one_more_question", "manual_pick_suggested"]),
    followup_question: z.string().optional(),
});

export type AIRecommendationOutput = z.infer<typeof RecommendationSchema>;

export async function generateRecommendation(
    response: Partial<OnboardingResponse>,
    pathScorecard: any,
    topSignals: string[]
): Promise<AIRecommendationOutput> {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
    You are the Mallah Career Navigator. Your goal is to recommend the best learning path for a student based on their onboarding signals.
    
    COLLECTED SIGNALS:
    - Background: ${response.background_type}
    - Primary Goal: ${response.primary_goal}
    - Weekly Commitment: ${response.weekly_hours_category}
    - Interest Vectors: ${JSON.stringify(response.interest_vector)}
    - Workstyle Vectors: ${JSON.stringify(response.workstyle_vector)}
    - Readiness Level: ${response.readiness_level}/100
    - Pre-computed Path Scorecard: ${JSON.stringify(pathScorecard)}
    - Top Strongest Indicators: ${topSignals.join(", ")}
    
    CONSTRAINTS:
    - You MUST pick from: [frontend, fullstack, cybersecurity, datascience].
    - Language Preference: ${response.ai_language_pref} (If AR, respond in Arabic. If MIX, use both).
    - Detail Level: ${response.ai_detail_level}.
    - Be encouraging but realistic.
    
    Return the recommendation in the specified structured JSON format.
  `;

    try {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o-2024-08-06", // Use latest model supporting structured outputs
            messages: [
                { role: "system", content: "You are a professional maritime-themed career advisor for software engineering." },
                { role: "user", content: prompt },
            ],
            response_format: zodResponseFormat(RecommendationSchema, "recommendation"),
            temperature: 0.1,
        });

        const result = completion.choices[0].message.parsed;
        if (!result) throw new Error("Failed to parse AI response");

        return result;
    } catch (error) {
        console.error("OpenAI Recommendation Error:", error);
        throw error;
    }
}
