// Admin feature types

export type AdminLevel = 'normal' | 'super';

export interface AdminUser {
  user_id: string;
  display_name: string;
  admin_level: AdminLevel;
  email: string;
  status: string;
  created_at: string;
  last_sign_in_at?: string;
}

export interface AdminAuditLogEntry {
  log_id: string;
  admin_id: string;
  event_type: string;
  description: string;
  entity_type: string | null;
  entity_id: string | null;
  ip_address: string | null;
  created_at: string;
  // Joined fields
  admin_display_name?: string;
  admin_email?: string;
}

export type EntityType = 'path' | 'stage' | 'topic' | 'resource' | 'skill' | 'project' | 'user' | 'admin';

export type EventType =
  | 'admin_login'
  | 'admin_login_failed'
  | 'admin_created'
  | 'admin_deactivated'
  | 'path_created'
  | 'path_edited'
  | 'path_deactivated'
  | 'stage_created'
  | 'stage_edited'
  | 'stage_deleted'
  | 'stage_reordered'
  | 'topic_created'
  | 'topic_edited'
  | 'topic_deleted'
  | 'topic_reordered'
  | 'resource_added'
  | 'resource_edited'
  | 'resource_deleted'
  | 'skill_created'
  | 'skill_verified'
  | 'skill_rejected'
  | 'skill_edited'
  | 'project_created'
  | 'project_edited'
  | 'project_deactivated'
  | 'learner_blocked'
  | 'learner_unblocked';

// Dashboard types
export interface DashboardStats {
  totalLearners: number;
  activeThisWeek: number;
  topicsCompletedLast30Days: number;
  pendingSkillReviews: number;
}

export interface PathOverview {
  path_id: string;
  name: string;
  learner_count: number;
  avg_completion: number;
  active_this_week: number;
}

export interface ContentWarning {
  type: 'path_no_stages' | 'stage_no_topics' | 'topic_no_resources';
  message: string;
  entity_id: string;
  entity_type: EntityType;
}

// Content management types
export interface AdminPath {
  path_id: string;
  name: string;
  short_description: string;
  is_active: boolean;
  stage_count: number;
  learner_count: number;
}

export interface AdminStage {
  stage_id: string;
  path_id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  order_index: number;
  topic_count: number;
  learner_count: number;
}

export interface AdminTopic {
  topic_id: string;
  stage_id: string;
  title: string;
  summary: string | null;
  topic_type: string;
  estimated_time_min: number | null;
  difficulty_level: string | null;
  is_mandatory: boolean;
  order_index: number;
}

export interface AdminResource {
  resource_id: string;
  topic_id: string;
  resource_type: 'VIDEO' | 'ARTICLE' | 'INTERNAL_TEXT' | 'CERT';
  title: string | null;
  url: string | null;
  content: string | null;
  provider: string | null;
  cost_type: string | null;
  cost_note: string | null;
  order_index: number;
}

export interface AdminTopicWithResources extends AdminTopic {
  resources: AdminResource[];
}

export interface AdminStageWithTopics extends Omit<AdminStage, 'topic_count'> {
  topics: AdminTopicWithResources[];
}

export interface AdminPathWithFullContent extends Omit<AdminPath, 'stage_count'> {
  stages: AdminStageWithTopics[];
}

export interface AdminSkill {
  skill_id: string;
  name: string;
  category: string;
  is_verified: boolean;
  topic_count: number;
  project_count: number;
}

export interface AdminProject {
  project_id: string;
  title: string;
  description: string | null;
  difficulty_level: string | null;
  stage_id: string | null;
  is_active: boolean;
  is_public_default: boolean;
  source_type: string | null;
  stage_title?: string;
  path_name?: string;
  skill_count: number;
}

export interface AdminLearner {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  current_path_id: string | null;
  path_name: string | null;
  onboarding_completed: boolean;
  status: string;
  created_at: string;
  progress_percent: number;
  last_active: string | null;
}

export interface AdminActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}
