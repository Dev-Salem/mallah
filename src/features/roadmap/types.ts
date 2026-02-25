export type TopicProgressStatus = "NotStarted" | "InProgress" | "Completed";

export interface RoadmapTopic {
  topic_id: string;
  stage_id: string;
  title: string;
  summary: string | null;
  estimated_time_min: number | null;
  difficulty_level: string | null;
  order_index: number;
  is_mandatory: boolean;
  status: TopicProgressStatus;
}

export interface RoadmapStage {
  stage_id: string;
  path_id: string;
  title: string;
  difficulty_level: string | null;
  order_index: number;
  completion_percent: number | null;
  completed_topics: number;
  total_mandatory_topics: number;
  topics: RoadmapTopic[];
}

export interface RoadmapPath {
  path_id: string;
  path_key: string;
  name: string;
  completion_percent: number | null;
  completed_topics: number;
  total_mandatory_topics: number;
}

export interface NextTopic {
  next_topic_id: string | null;
  next_topic_title: string | null;
  next_stage_id: string | null;
  next_stage_title: string | null;
  next_topic_estimated_time_min: number | null;
  is_path_complete: boolean;
}

export interface RoadmapSummary {
  path: RoadmapPath;
  stages: RoadmapStage[];
  next_topic: NextTopic;
}

export interface TopicPayload {
  topic_id: string;
  stage_id: string;
  path_id: string;
  title: string;
  summary: string | null;
  estimated_time_min: number | null;
  difficulty_level: string | null;
  status: TopicProgressStatus;
  resources: Array<{
    id: string;
    resource_type: "INTERNAL_TEXT" | "VIDEO" | "ARTICLE";
    title: string;
    content: string | null;
    url: string | null;
    order_index: number;
  }>;
}

export interface CompleteTopicResult {
  topic_id: string;
  status: "Completed";
  completed_at: string;
  next_topic: NextTopic;
}
