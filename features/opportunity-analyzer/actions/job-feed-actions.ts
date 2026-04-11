"use server";

import { createClient } from '@/lib/supabase/server';
import { JobListing } from '../types';

/**
 * Fetches the learner's current_path_id and name from the learners table joined with paths.
 */
export async function getLearnerPathAction(): Promise<{ id: string; name: string } | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('learners')
        .select(`
            current_path_id,
            path:current_path_id (
                name
            )
        `)
        .eq('user_id', user.id)
        .single();

    if (error || !data || !data.current_path_id) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pathName = (data.path as any)?.name || 'Unknown Path';

    return {
        id: data.current_path_id,
        name: pathName
    };
}

/**
 * Fetches the learner's skill names from user_skills joined with skills.
 */
export async function getLearnerSkillsAction(): Promise<string[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('user_skills')
        .select('skills(name)')
        .eq('user_id', user.id);

    if (error || !data) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => row.skills?.name).filter(Boolean) as string[];
}

/**
 * Fetches published job listings for a given path.
 * Match scoring is deferred until AI skill extraction is implemented on feed jobs.
 */
export async function getJobListingsAction(
    pathId: string,
    learnerSkills: string[],
    sortBy: 'Best Match' | 'Newest' = 'Newest',
    search: string = '',
    seniority: string = 'All levels'
) {
    const supabase = await createClient();

    let query = supabase
        .from('job_listings')
        .select('*')
        .eq('path_id', pathId)
        .eq('status', 'published');

    if (search.trim() !== '') {
        query = query.ilike('title', `%${search}%`);
    }

    if (seniority !== 'All levels') {
        query = query.eq('seniority', seniority);
    }

    // Sort by newest by default since match scoring is not yet available
    query = query.order('published_at', { ascending: false });

    const { data: jobs, error } = await query;

    if (error) {
        console.error('Error fetching job listings:', error);
        throw new Error('Failed to fetch job listings');
    }

    // Append a placeholder matchScore of 0 for now
    // Match scoring will be meaningful once required_skills/preferred_skills
    // are populated by AI extraction
    const scoredJobs = (jobs as JobListing[]).map(job => ({
        ...job,
        matchScore: 0
    }));

    // Suppress unused variable warning — learnerSkills will be used for scoring
    // once AI skill extraction populates required_skills on feed jobs
    void learnerSkills;
    void sortBy;

    return scoredJobs;
}
