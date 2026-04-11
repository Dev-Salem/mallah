"use server";

import { createClient } from '@/lib/supabase/server';
import { JobListing } from '../types';

/**
 * Computes the matching score based on required and preferred skills
 * using the specified Phase 1 formula:
 * match = (required_covered / total_required) * 0.70 + (preferred_covered / total_preferred) * 0.30
 */
function calculatePhaseOneMatchScore(job: JobListing, learnerSkills: string[]): number {
    const learnerSkillsLower = learnerSkills.map(s => s.toLowerCase());

    const requiredCovered = job.required_skills.filter(skill =>
        learnerSkillsLower.some(s => s === skill.toLowerCase())
    ).length;

    const preferredCovered = job.preferred_skills.filter(skill =>
        learnerSkillsLower.some(s => s === skill.toLowerCase())
    ).length;

    const requiredScore = job.required_skills.length > 0 
        ? (requiredCovered / job.required_skills.length) * 0.70 
        : 0;

    const preferredScore = job.preferred_skills.length > 0
        ? (preferredCovered / job.preferred_skills.length) * 0.30
        : 0;

    return Math.round((requiredScore + preferredScore) * 100);
}

export async function getJobListingsAction(
    pathId: string,
    learnerSkills: string[],
    sortBy: 'Best Match' | 'Newest' = 'Best Match',
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

    const { data: jobs, error } = await query;

    if (error) {
        console.error('Error fetching job listings:', error);
        throw new Error('Failed to fetch job listings');
    }

    // Append match score manually
    const scoredJobs = (jobs as JobListing[]).map(job => ({
        ...job,
        matchScore: calculatePhaseOneMatchScore(job, learnerSkills)
    }));

    if (sortBy === 'Best Match') {
        scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    } else {
        scoredJobs.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }

    return scoredJobs.slice(0, 10); // Returns max 10 for the feed
}
