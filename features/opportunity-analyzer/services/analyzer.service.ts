import { createClient } from '@/lib/supabase/server';
import { OpportunityAnalysisResult, ExtractedCV } from '../types';

export const analyzerService = {
    saveCvUpload: async (fileName: string, extractedData: ExtractedCV) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('cv_uploads')
            .upsert({
                user_id: user.id,
                file_name: fileName,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                extracted_skills: extractedData.extracted_skills as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cv_projects: extractedData.extracted_projects as any,
                experience_years: extractedData.experience_years,
                previous_roles: extractedData.previous_roles,
                uploaded_at: new Date().toISOString()
            }, { onConflict: 'user_id' })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getCvUpload: async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('cv_uploads')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
        return data;
    },

    saveAnalysis: async (analysis: OpportunityAnalysisResult, existingAnalysisId?: string) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const payload = {
            user_id: user.id,
            job_title: analysis.job_title,
            company_name: analysis.company_name,
            seniority_level: analysis.seniority_level,
            raw_jd_text: analysis.raw_jd_text,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            extracted_skills: analysis.extracted_skills as any,
            match_score: analysis.match_score,
            cv_skills_contributed: analysis.cv_skills_contributed,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            skills_breakdown: analysis.skills_breakdown as any, // jsonb casting
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            action_plan: analysis.action_plan as any,
            is_saved: analysis.is_saved,
            last_reanalyzed_at: new Date().toISOString(),
        };

        let result;
        if (existingAnalysisId) {
            // Update
            const { data, error } = await supabase
                .from('opportunity_analyses')
                .update(payload)
                .eq('analysis_id', existingAnalysisId)
                .eq('user_id', user.id)
                .select()
                .single();
            if (error) throw error;
            result = data;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('opportunity_analyses')
                .insert({
                    ...payload,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();
            if (error) throw error;
            result = data;

            // Increment the counter only on insert
            await supabase.rpc('increment_opportunity_analyses_count', { user_uuid: user.id });
        }

        return result;
    },

    getSavedAnalyses: async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('opportunity_analyses')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_saved', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    getAnalysisById: async (analysisId: string) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase
            .from('opportunity_analyses')
            .select('*')
            .eq('analysis_id', analysisId)
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;

        let matchingResumeId: string | null = null;
        if (data) {
            const { data: resumeData } = await supabase
                .from('resumes')
                .select('resume_id')
                .eq('user_id', user.id)
                .eq('resume_type', 'job_based')
                .contains('source_jd', { analysis_id: analysisId })
                .maybeSingle();

            if (resumeData) matchingResumeId = resumeData.resume_id;
        }

        return data ? { ...data, matchingResumeId } : null;
    },

    deleteAnalysis: async (analysisId: string) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error } = await supabase
            .from('opportunity_analyses')
            .delete()
            .eq('analysis_id', analysisId)
            .eq('user_id', user.id);

        if (error) throw error;
        return true;
    },

    getLearnerProfileData: async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const profileRes = await supabase
            .from('learners')
            .select('current_path_id, readiness_level')
            .eq('user_id', user.id)
            .single();

        if (profileRes.error) throw profileRes.error;

        const currentPathId = profileRes.data?.current_path_id;

        const roadmapTopicsPromise = currentPathId
            ? supabase
                .from('topics')
                .select('topic_id, title, topic_skills(skills(name)), stages!inner(title, order_index, path_id)')
                .eq('stages.path_id', currentPathId)
            : Promise.resolve({ data: [], error: null });

        // Use Promise.all to fetch skills, projects, progress, and current-path topics concurrently
        const [skillsRes, projectsRes, progressRes, roadmapTopicsRes] = await Promise.all([
            supabase.from('user_skills').select('*, skills(name, category)').eq('user_id', user.id),
            supabase
                .from('user_projects')
                .select('project_id, tech_stack, projects(title, description, source_type, project_skills(skills(name, category)))')
                .eq('user_id', user.id)
                .eq('status', 'completed'),
            supabase
                .from('user_progress')
                .select('status, topics(title, topic_skills(skills(name, category)))')
                .eq('user_id', user.id)
                .eq('status', 'in_progress'),
            roadmapTopicsPromise
        ]);

        if (skillsRes.error) throw skillsRes.error;
        if (projectsRes.error) throw projectsRes.error;
        if (progressRes.error) throw progressRes.error;
        if (roadmapTopicsRes.error) throw roadmapTopicsRes.error;

        return {
            skills: skillsRes.data,
            completedProjects: projectsRes.data,
            progress: progressRes.data,
            learnerProfile: profileRes.data,
            roadmapTopics: roadmapTopicsRes.data ?? []
        };
    },

    getPortfolioSyncSourceData: async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const cvUploadPromise = supabase
            .from('cv_uploads')
            .select('cv_projects')
            .eq('user_id', user.id)
            .maybeSingle();

        const [completedProjectsRes, userProjectsRes, catalogProjectsRes, cvUploadRes, skillsCatalogRes] = await Promise.all([
            supabase
                .from('user_projects')
                .select('project_id, github_url, demo_url, tech_stack, projects(title, description, source_type, difficulty_level, recommended_tech, project_skills(skills(skill_id, name, category)))')
                .eq('user_id', user.id)
                .eq('status', 'completed'),
            supabase
                .from('user_projects')
                .select('project_id')
                .eq('user_id', user.id),
            supabase
                .from('projects')
                .select('project_id, title, description, difficulty_level, recommended_tech, source_type, project_skills(skills(skill_id, name, category))')
                .eq('is_active', true)
                .eq('source_type', 'roadmap'),
            cvUploadPromise,
            supabase
                .from('skills')
                .select('skill_id, name')
                .eq('is_verified', true)
        ]);

        if (completedProjectsRes.error) throw completedProjectsRes.error;
        if (userProjectsRes.error) throw userProjectsRes.error;
        if (catalogProjectsRes.error) throw catalogProjectsRes.error;
        if (cvUploadRes.error && cvUploadRes.error.code !== 'PGRST116') throw cvUploadRes.error;
        if (skillsCatalogRes.error) throw skillsCatalogRes.error;

        return {
            completedProjects: completedProjectsRes.data ?? [],
            existingUserProjectIds: (userProjectsRes.data ?? []).map((project) => project.project_id),
            catalogProjects: catalogProjectsRes.data ?? [],
            cvProjects: (cvUploadRes.data?.cv_projects as ExtractedCV['extracted_projects'] | null) ?? [],
            skillsCatalog: skillsCatalogRes.data ?? [],
        };
    }
};
