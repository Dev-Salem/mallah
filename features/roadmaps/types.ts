export interface Topic {
    id: string;
    stage_id: string;
    title: string;
    description: string;
    content_markdown?: string;
    estimated_time_min: number;
    difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
    order_index: number;
    is_mandatory: boolean;
    status?: 'NotStarted' | 'InProgress' | 'Completed';
}

export interface Stage {
    id: string;
    path_id: string;
    title: string;
    description: string;
    difficulty_level: string;
    order_index: number;
    topics: Topic[];
    stats?: {
        percent: number;
    };
}

export interface RoadmapPath {
    id: string;
    name: string;
    name_ar: string;
    description: string;
    description_ar: string;
}

export interface RoadmapData {
    path: RoadmapPath;
    stages: Stage[];
    stats: {
        totalTopics: number;
        completedTopics: number;
        overallPercent: number;
    };
}
