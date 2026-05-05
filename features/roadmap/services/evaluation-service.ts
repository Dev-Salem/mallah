import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { Project, ProjectReview } from '../types';

export class EvaluationService {
    static async evaluateProject(
        project: Project,
        submission: { github_url?: string | null; demo_url?: string | null; personal_note?: string | null }
    ) {
        if (!submission.github_url) {
            throw new Error('GitHub URL is required for AI evaluation');
        }

        const prompt = `
            You are a senior technical interviewer and mentor. Your task is to evaluate a project submission against specific criteria.
            
            PROJECT CONTEXT:
            Title: ${project.title}
            Description: ${project.description || project.overview}
            Core Requirements: ${project.core_requirements?.join(', ') || 'N/A'}
            Stretch Goals: ${project.stretch_goals?.join(', ') || 'N/A'}
            Difficulty: ${project.difficulty_level}

            USER SUBMISSION:
            GitHub URL: ${submission.github_url}
            Demo URL: ${submission.demo_url || 'None'}
            Personal Note: ${submission.personal_note || 'None'}

            EVALUATION STEPS:
            1. Analyze the GitHub repository (mentally, based on the provided URL and project type).
            2. Verify if core requirements are likely met.
            3. Check for stretch goals.
            4. Provide a verdict (strong, solid, needs_work).
            5. Provide a score out of 100.
            6. List 2-3 strengths and 2-3 improvements.
            7. Suggest 1-2 topics for further study if needed.

            RESPONSE FORMAT:
            Provide the evaluation in a structured JSON format.
        `;

        try {
            const result = await generateObject({
                model: openai('gpt-4o'),
                schema: z.object({
                    overall_verdict: z.enum(['strong', 'solid', 'needs_work']),
                    score: z.number().min(0).max(100),
                    strengths: z.string().describe("Markdown list of strengths"),
                    improvements: z.string().describe("Markdown list of improvements"),
                    requirements_results: z.array(z.object({
                        requirement: z.string(),
                        passed: z.boolean(),
                        feedback: z.string().optional()
                    })),
                    recommended_topics: z.array(z.string()).optional(),
                    stretch_score: z.number().optional()
                }),
                prompt: prompt,
            });

            return result.object;
        } catch (error) {
            console.error('AI Evaluation Error:', error);
            throw new Error('Failed to complete AI evaluation. Please check your GitHub URL and try again.');
        }
    }
}
