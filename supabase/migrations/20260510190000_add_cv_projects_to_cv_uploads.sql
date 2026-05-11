alter table public.cv_uploads
add column if not exists cv_projects jsonb not null default '[]'::jsonb;
