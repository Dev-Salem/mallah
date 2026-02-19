export interface UserSkill {
    skill_id: string;
    user_id: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    source: 'Roadmap' | 'Project' | 'Manual';
    acquired_at: string;
    skills?: {
        name: string;
    };
}

export interface UserProject {
    project_id: string;
    user_id: string;
    github_url?: string;
    status: 'Available' | 'InProgress' | 'Completed';
    started_at?: string;
    completed_at?: string;
    projects?: {
        title: string;
        description: string;
    };
}

export interface HubData {
    skills: UserSkill[];
    projects: UserProject[];
}
