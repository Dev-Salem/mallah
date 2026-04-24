import OpenAI from "openai";
import type { 
    OnboardingFormData, 
    AIRecommendationResponse, 
    PathId, 
    LearningVelocity 
} from "../types";
import { PATH_IDS } from "../types";
import { INTEREST_SIGNALS, VELOCITY_MAP } from "../constants";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Deterministically computes the base scores for all paths.
 * Formula (v3): 40% Interest + 25% Goal + 20% Readiness + 15% Commitment
 */
export function calculateBaseScores(data: OnboardingFormData): Record<PathId, number> {
    const scores: Record<PathId, number> = { frontend: 0, fullstack: 0, cybersecurity: 0, datascience: 0 };

    // 1. Interest Signal (40%)
    const interestWeights: Record<PathId, number> = { frontend: 0, fullstack: 0, cybersecurity: 0, datascience: 0 };
    
    // Spec: interest_score[path] = interest_raw[path] / interest_max[path]
    // Max possible interest sum for each path across all statements in spec:
    // frontend: 1.2, fullstack: 2.2, cybersecurity: 1.9, datascience: 1.8
    const interestMax: Record<PathId, number> = { frontend: 1.2, fullstack: 2.2, cybersecurity: 1.9, datascience: 1.8 };

    for (const signal of INTEREST_SIGNALS) {
        if (data.interests.includes(signal.id)) {
            for (const pathId of PATH_IDS) {
                interestWeights[pathId] += (signal.pathWeights[pathId] || 0);
            }
        }
    }

    // 2. Goal Fit (25%)
    const goalMatrix: Record<string, Record<PathId, number>> = {
        job: { frontend: 0.9, fullstack: 1.0, cybersecurity: 0.8, datascience: 0.8 },
        freelance: { frontend: 1.0, fullstack: 0.9, cybersecurity: 0.4, datascience: 0.5 },
        startup: { frontend: 0.7, fullstack: 1.0, cybersecurity: 0.3, datascience: 0.7 },
        exploring: { frontend: 0.8, fullstack: 0.8, cybersecurity: 0.7, datascience: 0.7 },
    };

    // 3. Readiness Fit (20%)
    // Spec: readiness_score[path] = 1.0 - max(0, complexity_baseline[path] - normalized_readiness)
    const complexityBaseline: Record<PathId, number> = {
        frontend: 0.3,
        fullstack: 0.5,
        cybersecurity: 0.6,
        datascience: 0.55,
    };
    const rawReadiness = data.confidenceItems.reduce((acc, item) => {
        if (item.level === "comfortable") return acc + 2;
        if (item.level === "tried") return acc + 1;
        return acc;
    }, 0);
    const normalizedReadiness = rawReadiness / 8;

    // 4. Commitment Fit (15%)
    const velocity = VELOCITY_MAP[data.weeklyHoursCategory];
    const commitmentMatrix: Record<LearningVelocity, Record<PathId, number>> = {
        slow: { frontend: 1.0, fullstack: 0.6, cybersecurity: 0.5, datascience: 0.6 },
        normal: { frontend: 1.0, fullstack: 1.0, cybersecurity: 0.9, datascience: 1.0 },
        fast: { frontend: 1.0, fullstack: 1.0, cybersecurity: 1.0, datascience: 1.0 },
    };

    // Calculate final scores
    for (const path of PATH_IDS) {
        const interestScore = data.interests.length > 0 
            ? Math.min(1, interestWeights[path] / interestMax[path])
            : 0.5;

        const goalScore = goalMatrix[data.primaryGoal][path];
        const readinessScore = 1.0 - Math.max(0, complexityBaseline[path] - normalizedReadiness);
        const commitmentScore = commitmentMatrix[velocity][path];

        const baseScore = (
            interestScore * 0.40 +
            goalScore * 0.25 +
            readinessScore * 0.20 +
            commitmentScore * 0.15
        ) * 100;

        scores[path] = Math.round(baseScore);
    }

    return scores;
}

export async function generatePathRecommendation(
    data: OnboardingFormData
): Promise<AIRecommendationResponse | null> {
    const baseScores = calculateBaseScores(data);
    
    // Sort paths by score to find the top recommendation
    const sortedPaths = (Object.entries(baseScores) as [PathId, number][])
        .sort((a, b) => b[1] - a[1]);
    
    const recommendedPathId = sortedPaths[0][0];
    const baseRecommendedScore = sortedPaths[0][1];

    const prompt = `You are Mallah's Expert Career Advisor. Your goal is to guide the learner toward their ideal tech career path.

## Learner Profile
- Background: ${data.backgroundType}
- Career Goal: ${data.primaryGoal}
- Time Commitment: ${data.weeklyHoursCategory}
- Interests: ${data.interests.join(", ")}
- Readiness Indicator: ${data.confidenceItems.map(i => `${i.key} (${i.level})`).join(", ")}

## Initial Analysis (Deterministic Scores)
- Frontend: ${baseScores.frontend}%
- Full-Stack: ${baseScores.fullstack}%
- Cybersecurity: ${baseScores.cybersecurity}%
- Data Science: ${baseScores.datascience}%

Recommended Path: ${recommendedPathId}
Base Score: ${baseRecommendedScore}

## Mission
1. Review the recommended path and its base score.
2. You may adjust the score by up to ±10 points based on your professional judgment of the learner's signals.
3. Provide 2-3 specific, encouraging reasons for this recommendation. Each reason must refer to a specific answer from the learner.
4. Suggest 1-2 secondary paths with a brief rationale for each.
5. Use a professional, inspiring SaaS tone. Avoid military or overly tactical language.

Return structured JSON according to the schema.`;

    const responseFormat = {
        type: "json_schema" as const,
        json_schema: {
            name: "path_recommendation",
            strict: true,
            schema: {
                type: "object",
                properties: {
                    final_score: { type: "integer" },
                    adjustment_reason: { type: ["string", "null"] },
                    reasons: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 2,
                        maxItems: 3
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
                        minItems: 1,
                        maxItems: 2
                    },
                },
                required: ["final_score", "adjustment_reason", "reasons", "alternatives"],
                additionalProperties: false,
            },
        },
    };

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: responseFormat,
            temperature: 0.5,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No AI response");

        const aiOutput = JSON.parse(content);
        
        // v3 Logic: Clamp final_score to ±10 of base score
        let finalScore = aiOutput.final_score;
        const diff = finalScore - baseRecommendedScore;
        if (Math.abs(diff) > 10) {
            finalScore = baseRecommendedScore + (diff > 0 ? 10 : -10);
        }
        finalScore = Math.max(0, Math.min(100, finalScore));

        return {
            recommended_path_id: recommendedPathId,
            match_score: finalScore,
            base_score: baseRecommendedScore,
            ai_adjustment: finalScore - baseRecommendedScore,
            adjustment_reason: aiOutput.adjustment_reason,
            reasons: aiOutput.reasons,
            alternatives: aiOutput.alternatives,
            fallback_used: false
        };
    } catch (error) {
        console.error("AI recommendation failed, using fallback:", error);
        
        // Fallback Logic (v3)
        return {
            recommended_path_id: recommendedPathId,
            match_score: baseRecommendedScore,
            base_score: baseRecommendedScore,
            ai_adjustment: 0,
            adjustment_reason: null,
            reasons: [
                `Based on your interest in ${data.interests[0] || 'solving technical challenges'}, this path aligns perfectly with your goals.`,
                `Your commitment of ${data.weeklyHoursCategory} hours per week provides a solid foundation for growth in ${recommendedPathId}.`
            ],
            alternatives: sortedPaths.slice(1, 3).map(([id]) => ({
                path_id: id,
                reason: "This path also aligns well with your profile and career objectives."
            })),
            fallback_used: true
        } as AIRecommendationResponse;
    }
}

