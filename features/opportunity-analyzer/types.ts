export interface OpportunityAnalysis {
    id: string;
    user_id: string;
    job_title: string | null;
    job_description: string;
    seniority: string | null;
    required_skills: string[];
    preferred_skills: string[];
    matched_skills: string[];
    missing_skills: string[];
    match_score: number | null;
    action_plan: string | null;
    created_at: string;
}
