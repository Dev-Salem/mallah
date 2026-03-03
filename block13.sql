DO $$
DECLARE
  stage_fullstack_7_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'DevOps, Deployment & CI/CD', 7, 'beginner')
  RETURNING stage_id INTO stage_fullstack_7_id;

  DECLARE
    topic_fullstack_7_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_7_id, 'Docker: Containerising Your App', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_fullstack_7_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_1_id, 'VIDEO', 'Docker Crash Course for Beginners', 'https://www.youtube.com/watch?v=pg19Z8LL06w', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_1_id, 'ARTICLE', 'Dockerize a Node.js app', 'https://docs.docker.com/guides/nodejs/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Docker solves the "works on my machine" problem by packaging your app and all its dependencies into a container — a self-contained, reproducible environment. A new developer can clone your repo, run `docker compose up`, and have a fully working app in minutes with no manual setup. Docker is standard in every company that deploys backend services. Understanding it is non-negotiable for full-stack developers in 2026.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('docker', 'Docker', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_1_id, 'docker') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_7_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_7_id, 'GitHub Actions: CI/CD Pipelines', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_fullstack_7_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_2_id, 'VIDEO', 'GitHub Actions CI/CD Tutorial', 'https://www.youtube.com/watch?v=R8_veQiYBjI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_2_id, 'ARTICLE', 'GitHub Actions Quickstart', 'https://docs.github.com/en/actions/quickstart', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'CI/CD (Continuous Integration / Continuous Deployment) means every code change automatically goes through a quality gate (tests, type checking, linting) before it can be merged. This prevents "it works on my machine" from becoming "it''s broken in production." GitHub Actions is free for public repos and generous for private ones. A good CI pipeline is one of the biggest professional signals in a portfolio project — it shows you think about code quality, not just shipping.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github_actions', 'GitHub Actions', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_2_id, 'github_actions') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('ci_cd', 'CI/CD', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_2_id, 'ci_cd') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_7_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_7_id, 'Monitoring, Logging & Error Tracking', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_7_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_3_id, 'VIDEO', 'Node.js Logging with Pino', 'https://www.youtube.com/watch?v=68rscMwPgTc', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_3_id, 'ARTICLE', 'Sentry for Node.js', 'https://docs.sentry.io/platforms/node/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In production, you can''t add `console.log` and refresh. You need structured logs that are queryable — fields like `{ timestamp, level, method, path, statusCode, duration, userId }`. Sentry captures exceptions with full stack traces and context, sends you an alert when something breaks, and shows you exactly which users were affected. A `GET /health` endpoint lets load balancers, uptime monitors, and automated deployment systems check if your app is alive and connected to its database.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_3_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('ci_cd', 'CI/CD', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_3_id, 'ci_cd') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_7_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_7_id, 'Performance: Caching & Query Optimization', '', 'lesson', 2, 'advanced', 4)
    RETURNING topic_id INTO topic_fullstack_7_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_4_id, 'VIDEO', 'N+1 Problem with Prisma', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_4_id, 'ARTICLE', 'Database indexes explained', 'https://use-the-index-luke.com/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The N+1 problem is the most common performance mistake in ORM-heavy backends: you fetch 20 posts (1 query), then for each post you fetch the author (20 queries) = 21 total queries for what should be 1. Prisma''s `include` solves this with a single JOIN. Database indexes are the next biggest win: without an index on `posts.authorId`, every query that filters by author scans the entire table. Adding the index makes it O(log n). These two fixes alone can make an API 10–100x faster.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_4_id, 'postgresql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_4_id, 'prisma') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_7_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_7_id, 'PROJECT: Production-Ready App', '', 'project_milestone', 8, 'advanced', 5)
    RETURNING topic_id INTO topic_fullstack_7_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_5_id, 'VIDEO', 'Full-Stack Deployment with Docker & GitHub Actions', 'https://www.youtube.com/watch?v=eIkMRMUzFPc', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_5_id, 'ARTICLE', 'Node.js Production Best Practices', 'https://expressjs.com/en/advanced/best-practice-performance.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_7_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '"Production-ready" is a mindset, not a checklist. It means: when something breaks (and it will), you know about it immediately (Sentry + logging). When you deploy (and you will), the process is automatic and repeatable (CI/CD). When traffic grows (and it might), your queries are efficient (indexes, no N+1). A portfolio project with Docker, CI/CD, and monitoring is a rare and impressive signal to employers — it shows you think like an engineer, not just a coder.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('docker', 'Docker', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'docker') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github_actions', 'GitHub Actions', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'github_actions') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('ci_cd', 'CI/CD', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'ci_cd') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'postgresql') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_7_id, 'PROJECT: Production-Ready App', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Advanced Patterns & Capstone
