"use server";

import { revalidatePath } from "next/cache";
import { fetchResumes, createResume, upsertResumeSections, updateResumeStatus, fetchResumeById } from "../services/resume-service";
import { parseJobDescription, improveResumeText } from "../services/ai-service";
import { calculateATSScore, PATH_BASELINES } from "../services/ats-service";

export async function createGeneralResumeAction(title: string) {
    const resume = await createResume(title, "general");
    revalidatePath("/resume-builder");
    return resume;
}

export async function createJobBasedResumeAction(jdText: string, title: string) {
    const jdData = await parseJobDescription(jdText);
    const resume = await createResume(title, "job_based", jdData as any);
    
    const allResumes = await fetchResumes();
    const generalResumes = allResumes.filter((r: any) => r.resume_type === 'general');
    if (generalResumes.length > 0) {
        const latestGeneral = generalResumes[0];
        const baseResumeData = await fetchResumeById(latestGeneral.resume_id);
        
        if (baseResumeData?.resume_sections) {
            const newSections = baseResumeData.resume_sections.map((s: any) => {
                // Remove section_id so it generates new ones for the copied sections
                const { section_id, ...rest } = s; 
                return {
                    ...rest,
                    resume_id: resume.resume_id,
                };
            });
            
            await upsertResumeSections(newSections);
        }
    }

    revalidatePath("/resume-builder");
    return resume;
}

export async function saveResumeAction(resumeId: string, sections: any[], pathId: string = 'frontend') {
    const payload = sections.map(s => ({ ...s, resume_id: resumeId }));
    await upsertResumeSections(payload);

    const targetKeywords = PATH_BASELINES[pathId] || [];
    const atsResult = calculateATSScore(payload, targetKeywords);

    let newStatus: "not_created" | "in_progress" | "ready" = "in_progress";
    if (atsResult.score >= 50 && atsResult.breakdown.sectionCompleteness === 100) {
        newStatus = "ready";
    }

    await updateResumeStatus(resumeId, atsResult.score, newStatus);
    revalidatePath(`/resume-builder/${resumeId}`);
    return atsResult;
}

export async function aiImproveAction(text: string, sectionType: string, pathId: string, primaryGoal: string) {
    return await improveResumeText({ text, sectionType, pathId, primaryGoal, languagePref: 'en' });
}
