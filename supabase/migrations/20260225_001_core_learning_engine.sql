-- Core learning engine schema for onboarding, roadmap, and profile settings.
-- Uses IF NOT EXISTS guards to remain safe across partially initialized environments.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'background_type_enum') then
    create type background_type_enum as enum ('Student', 'FreshGraduate', 'CareerShifter', 'NoTechBackground');
  end if;
  if not exists (select 1 from pg_type where typname = 'primary_goal_enum') then
    create type primary_goal_enum as enum ('FullTimeJob', 'Freelance', 'OwnProject', 'JustExploring');
  end if;
  if not exists (select 1 from pg_type where typname = 'weekly_hours_enum') then
    create type weekly_hours_enum as enum ('0-3', '4-7', '8-12', '13+');
  end if;
  if not exists (select 1 from pg_type where typname = 'learning_velocity_enum') then
    create type learning_velocity_enum as enum ('slow', 'normal', 'fast');
  end if;
  if not exists (select 1 from pg_type where typname = 'ai_language_pref_enum') then
    create type ai_language_pref_enum as enum ('AR', 'EN', 'MIX');
  end if;
  if not exists (select 1 from pg_type where typname = 'ai_detail_level_enum') then
    create type ai_detail_level_enum as enum ('Short', 'Balanced', 'Detailed');
  end if;
  if not exists (select 1 from pg_type where typname = 'ai_status_enum') then
    create type ai_status_enum as enum ('not_started', 'pending', 'success', 'failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'progress_status_enum') then
    create type progress_status_enum as enum ('NotStarted', 'InProgress', 'Completed');
  end if;
end
$$;

create table if not exists public.paths (
  id uuid primary key default gen_random_uuid(),
  path_id text not null unique check (path_id in ('frontend', 'fullstack', 'cybersecurity', 'datascience')),
  interest_key text unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stages (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  title text not null,
  difficulty_level text,
  order_index integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(path_id, order_index)
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references public.stages(id) on delete cascade,
  title text not null,
  summary text,
  estimated_time_min integer,
  difficulty_level text,
  order_index integer not null,
  is_mandatory boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(stage_id, order_index)
);

create table if not exists public.topic_resources (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  resource_type text not null check (resource_type in ('INTERNAL_TEXT', 'VIDEO', 'ARTICLE')),
  title text not null,
  content text,
  url text,
  order_index integer not null,
  created_at timestamptz not null default now(),
  unique(topic_id, order_index)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.topic_skills (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  importance_level integer not null default 1,
  unique(topic_id, skill_id)
);

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  status progress_status_enum not null default 'NotStarted',
  completed_at timestamptz,
  last_accessed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, topic_id)
);

create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  level integer not null default 1,
  source text not null default 'Roadmap',
  evidence_topic_id uuid references public.topics(id) on delete set null,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, skill_id, source)
);

alter table if exists public.learners
  add column if not exists current_path_id uuid references public.paths(id),
  add column if not exists weekly_hours_category weekly_hours_enum,
  add column if not exists learning_velocity learning_velocity_enum,
  add column if not exists ai_language_pref ai_language_pref_enum,
  add column if not exists ai_detail_level ai_detail_level_enum,
  add column if not exists onboarding_completed boolean not null default false;

create table if not exists public.onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(user_id) on delete cascade,
  background_type background_type_enum,
  primary_goal primary_goal_enum,
  weekly_hours_category weekly_hours_enum,
  learning_velocity learning_velocity_enum,
  interest_vector jsonb,
  workstyle_vector jsonb,
  confidence_snapshot jsonb,
  readiness_level integer,
  ai_language_pref ai_language_pref_enum default 'EN',
  ai_detail_level ai_detail_level_enum default 'Balanced',
  ai_status ai_status_enum not null default 'not_started',
  ai_attempt_count integer not null default 0,
  ai_last_attempt_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  onboarding_id uuid not null references public.onboarding_responses(id) on delete cascade,
  recommended_path_id text not null check (recommended_path_id in ('frontend', 'fullstack', 'cybersecurity', 'datascience')),
  confidence_score integer not null check (confidence_score >= 0 and confidence_score <= 100),
  explanation jsonb not null,
  alternatives jsonb,
  starter_plan_2_weeks jsonb,
  first_milestone jsonb,
  risk_flags jsonb,
  accepted_path_id text check (accepted_path_id in ('frontend', 'fullstack', 'cybersecurity', 'datascience')),
  created_at timestamptz not null default now()
);

create index if not exists idx_user_progress_user_topic_status on public.user_progress(user_id, topic_id, status);
create index if not exists idx_topics_stage_order on public.topics(stage_id, order_index);
create index if not exists idx_stages_path_order on public.stages(path_id, order_index);
create index if not exists idx_ai_recommendations_user_created on public.ai_recommendations(user_id, created_at desc);

insert into public.paths (path_id, interest_key, name, is_active)
values
  ('frontend', 'frontend', 'Frontend Development', true),
  ('fullstack', 'fullstack', 'Full-Stack Web Development', true),
  ('cybersecurity', 'cybersecurity', 'Cybersecurity & Ethical Hacking', true),
  ('datascience', 'datascience', 'Data Science & Machine Learning', true)
on conflict (path_id) do update
set
  interest_key = excluded.interest_key,
  name = excluded.name,
  is_active = excluded.is_active,
  updated_at = now();

-- Minimal curriculum seed: one stage and one topic per path.
insert into public.stages (path_id, title, difficulty_level, order_index, is_active)
select p.id, 'Stage 1: Foundations', 'beginner', 1, true
from public.paths p
where not exists (
  select 1 from public.stages s where s.path_id = p.id and s.order_index = 1
);

insert into public.topics (stage_id, title, summary, estimated_time_min, difficulty_level, order_index, is_mandatory, is_active)
select s.id, 'Topic 1: Getting Started', 'Kickoff topic for your selected path.', 45, 'beginner', 1, true, true
from public.stages s
where not exists (
  select 1 from public.topics t where t.stage_id = s.id and t.order_index = 1
);
