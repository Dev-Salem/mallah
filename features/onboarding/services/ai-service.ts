import OpenAI from "openai";
import type { OnboardingFormData, AIRecommendationResponse, InterestVector, PathId } from "../types";
import { PATH_IDS } from "../types";
import { INTEREST_SIGNALS } from "../constants";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function buildInterestVector(selectedIds: string[]): InterestVector {

    const vector: InterestVector = { frontend: 0, fullstack: 0, cybersecurity: 0, datascience: 0 };

    for (const signal of INTEREST_SIGNALS) {
        if (selectedIds.includes(signal.id)) {
            for (const pathId of PATH_IDS) {
                vector[pathId] += signal.pathWeights[pathId];
            }
        }
    }
    return vector;
}

function computeReadinessLevel(
    confidenceItems: Array<{ key: string; level: string }>
): number {
    let score = 0;
    for (const item of confidenceItems) {
        if (item.level === "comfortable") score += 1;
        else if (item.level === "tried") score += 0.5;
    }
    return Math.min(3, Math.round(score));
}

export async function generatePathRecommendation(
    data: OnboardingFormData
): Promise<AIRecommendationResponse | null> {
    const interestVector = buildInterestVector(data.interests);
    const readinessLevel = computeReadinessLevel(data.confidenceItems);

    const prompt = `You are Mallah's AI Career Path Advisor. Analyze the learner profile below and recommend the single best-fit learning path.

## Learner Profile
- Background: ${data.backgroundType}
- Primary Goal: ${data.primaryGoal}
- Weekly Hours: ${data.weeklyHoursCategory}
- Interest Signals (higher = more interest):
  - Frontend: ${interestVector.frontend}
  - Full-Stack: ${interestVector.fullstack}
  - Cybersecurity: ${interestVector.cybersecurity}
  - Data Science: ${interestVector.datascience}
- Confidence Snapshot: ${JSON.stringify(data.confidenceItems)}
- Readiness Level (0-3): ${readinessLevel}

## Available Paths
1. frontend — Frontend Development (building visual web interfaces)
2. fullstack — Full-Stack Web Development (client + server engineering)
3. cybersecurity — Cybersecurity & Ethical Hacking (security, pen-testing)
4. datascience — Data Science & Machine Learning (data analysis, ML models)

## Instructions
- Pick the BEST path for this learner based on their specific answers.
- Give a match_score (0-100) reflecting how well the learner's profile fits the recommended path.
- Provide 2-3 reasons that directly reference the learner's actual answers.
- Suggest 1-2 alternative paths with a reason each.
- Only use these path IDs: frontend, fullstack, cybersecurity, datascience.

Return ONLY valid JSON, no explanation text.`;

    const responseFormat = {
        type: "json_schema" as const,
        json_schema: {
            name: "path_recommendation",
            strict: true,
            schema: {
                type: "object",
                properties: {
                    recommended_path_id: {
                        type: "string",
                        enum: ["frontend", "fullstack", "cybersecurity", "datascience"],
                    },
                    match_score: { type: "integer" },
                    reasons: {
                        type: "array",
                        items: { type: "string" },
                    },
                    alternatives: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                path_id: {
                                    type: "string",
                                    enum: ["frontend", "fullstack", "cybersecurity", "datascience"],
                                },
                                reason: { type: "string" },
                            },
                            required: ["path_id", "reason"],
                            additionalProperties: false,
                        },
                    },
                },
                required: ["recommended_path_id", "match_score", "reasons", "alternatives"],
                additionalProperties: false,
            },
        },
    };

    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: responseFormat,
                temperature: 0.4,
                max_tokens: 500,
            });

            const content = completion.choices[0]?.message?.content;
            if (!content) continue;

            const parsed: AIRecommendationResponse = JSON.parse(content);

            // Validate path IDs
            if (!PATH_IDS.includes(parsed.recommended_path_id as PathId)) continue;
            for (const alt of parsed.alternatives) {
                if (!PATH_IDS.includes(alt.path_id as PathId)) continue;
            }

            // Clamp match_score
            parsed.match_score = Math.max(0, Math.min(100, parsed.match_score));

            return parsed;
        } catch (error) {
            console.error(`AI recommendation attempt ${attempt + 1} failed:`, error);
            if (attempt === 1) return null;
        }
    }

    return null;
}

export { buildInterestVector, computeReadinessLevel };
