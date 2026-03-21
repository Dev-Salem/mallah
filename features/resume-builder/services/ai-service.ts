import { generateObject, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const MODEL = openai('gpt-4o');

export async function parseJobDescription(jobDescription: string) {
    try {
        const { object: jdData } = await generateObject({
            model: MODEL,
            maxRetries: 2,
            schema: z.object({
                job_title: z.string().nullable(),
                company_name: z.string().nullable(),
                required_skills: z.array(z.string()),
                preferred_skills: z.array(z.string()),
            }),
            system: "You are an expert technical recruiter extracting details from a job description.",
            prompt: `Extract the details from this job description:\n\n${jobDescription}`
        });
        return jdData;
    } catch (e) {
        console.error("Failed to parse JD:", e);
        throw new Error("Failed to parse Job Description. Please try a more detailed version.");
    }
}

export async function improveResumeText({
    text,
    sectionType,
    pathId,
    primaryGoal,
    languagePref
}: {
    text: string;
    sectionType: string;
    pathId?: string | null;
    primaryGoal?: string | null;
    languagePref?: string | null;
}) {
    try {
        const promptContext = `
Section: ${sectionType}
Learner Path: ${pathId || 'General'}
Primary Goal: ${primaryGoal || 'Getting a job'}
Language Preference: ${languagePref || 'en'}

Original text: "${text}"`;

        const { text: improvedText } = await generateText({
            model: MODEL,
            maxRetries: 2,
            system: `You are an expert resume writer. Improve the provided resume text. 
Rules:
1. Use strong action verbs.
2. Be concise and impactful.
3. Make it ATS-friendly based on the user's path.
4. ONLY return the improved text, no quotes, no conversational filler.
5. Write in the requested language preference (en = English, ar = Arabic, mix = Mix of both).`,
            prompt: `Improve this text: \n${promptContext}`
        });

        return improvedText.trim();
    } catch (e) {
        console.error("AI Improve Error:", e);
        throw new Error("AI features are currently unavailable.");
    }
}
