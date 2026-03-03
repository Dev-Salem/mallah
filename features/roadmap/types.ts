export type ResourceType = 'VIDEO' | 'ARTICLE' | 'INTERNAL_TEXT' | 'DOCUMENTATION';

export interface TopicResource {
    id: string;
    topic_id: string;
    resource_type: ResourceType;
    title: string;
    url?: string | null;
    content?: string | null;
    provider?: string | null;
    cost_type?: string | null;
    order_index: number;
}

export interface Skill {
    skill_id: string;
    name: string;
    category: string;
}

export interface Topic {
    topic_id: string;
    stage_id: string;
    title: string;
    summary?: string | null;
    topic_type: 'concept' | 'lesson' | 'lesson_lab' | 'project_milestone' | 'project_capstone';
    estimated_time_min: number;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    order_index: number;
    user_status?: 'not_started' | 'in_progress' | 'completed'; // Joined from user_progress
    resources?: TopicResource[];
    skills?: Skill[];
}

export interface Project {
    project_id: string;
    stage_id: string;
    title: string;
    description?: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    thumbnail_url?: string | null;
    is_public_default: boolean;
    user_status?: 'available' | 'in_progress' | 'completed'; // Joined from user_projects
}

export interface Stage {
    stage_id: string;
    path_id: string;
    title: string;
    order_index: number;
    difficulty_level: string;
    is_unlocked: boolean; // Calculated field based on previous project
    topics: Topic[];
    project: Project | null;
}

export interface RoadmapData {
    path_id: string;
    stages: Stage[];
}
