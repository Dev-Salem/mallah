DO $$
DECLARE
  stage_fullstack_4_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'Databases with PostgreSQL & Prisma', 4, 'beginner')
  RETURNING stage_id INTO stage_fullstack_4_id;

  DECLARE
    topic_fullstack_4_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_4_id, 'Relational Databases & SQL Basics', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_fullstack_4_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_1_id, 'VIDEO', 'SQL & PostgreSQL for Beginners', 'https://www.youtube.com/watch?v=qw--VYLpxG4', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_1_id, 'ARTICLE', 'PostgreSQL Tutorial', 'https://www.postgresqltutorial.com/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'SQL is the most durable skill in this entire path. JavaScript frameworks come and go, but SQL has been the standard for relational databases since the 1970s and remains dominant today. Every company with real data uses SQL. Understanding joins is the critical skill — a `LEFT JOIN` between users and their posts, including users with no posts, is the kind of query you''ll write every day in production.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_1_id, 'sql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_1_id, 'postgresql') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_4_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_4_id, 'Prisma ORM: Schema & Migrations', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_fullstack_4_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_2_id, 'VIDEO', 'Prisma Crash Course', 'https://www.youtube.com/watch?v=CYH04BJzamo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_2_id, 'ARTICLE', 'Prisma', 'https://www.prisma.io/docs/getting-started', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Prisma replaces raw SQL in your Node.js code with a type-safe API. Instead of writing `SELECT * FROM users WHERE id = $1`, you write `prisma.user.findUnique({ where: { id } })`. Prisma generates TypeScript types directly from your schema — so if you query a `User`, you get autocomplete for every field. Migrations track schema changes over time, like Git for your database — critical for teams and production deployments.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_2_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_2_id, 'postgresql') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_4_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_4_id, 'CRUD Operations with Prisma Client', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_4_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_3_id, 'VIDEO', 'Prisma CRUD Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jczav-YzFChkiUKQ9sNSb4', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_3_id, 'ARTICLE', 'Prisma CRUD', 'https://www.prisma.io/docs/orm/prisma-client/queries/crud', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is a pivotal moment: your API now persists data. The route handlers barely changed — you replaced `array.push(item)` with `await prisma.post.create({ data: item })`. This is the power of a clean API layer between your routes and your data source. The route doesn''t care whether data comes from an array, a database, or a cache — it just calls a function and gets data back.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_3_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_3_id, 'postgresql') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_4_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_4_id, 'Database Relations & Advanced Queries', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_fullstack_4_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_4_id, 'VIDEO', 'Prisma Relations', 'https://www.youtube.com/watch?v=RebA5J-rlwg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_4_id, 'ARTICLE', 'Prisma Relations', 'https://www.prisma.io/docs/orm/prisma-schema/data-model/relations', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Real-world data is relational. A post has an author, comments, and tags. Getting a post with its author name and comment count in a single query is standard in production. Without proper relation handling, you''d make 3 separate queries for what Prisma does in one. Understanding when to use `include` (eager load — get everything now) vs separate queries (lazy load — fetch only when needed) is a performance decision you''ll make constantly.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_4_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_4_id, 'sql') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_4_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_4_id, 'Database Seeding & Migrations in Production', '', 'lesson', 1, 'intermediate', 5)
    RETURNING topic_id INTO topic_fullstack_4_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_5_id, 'VIDEO', 'Prisma Seed Data', 'https://www.youtube.com/watch?v=7dpNJEkAo0Q', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_5_id, 'ARTICLE', 'Prisma Seeding', 'https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Seed scripts are your database''s "factory reset" — they populate a fresh database with enough realistic data to develop and test against. Without seeds, every new dev on your team has to manually create test data. Migrations track every schema change in version control. The rule: `prisma migrate dev` creates migrations and applies them in development; `prisma migrate deploy` applies pre-created migrations in production — never generate new migrations in prod.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_5_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_5_id, 'postgresql') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_4_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_4_id, 'PROJECT: Database-Backed API', '', 'project_milestone', 8, 'intermediate', 6)
    RETURNING topic_id INTO topic_fullstack_4_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_6_id, 'VIDEO', 'Deploy Node.js + PostgreSQL to Railway', 'https://www.youtube.com/watch?v=QXxy8Uv1LnQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_6_id, 'ARTICLE', 'Railway', 'https://docs.railway.app/guides/postgresql', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_4_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Railway and Render both offer free PostgreSQL databases — they''re the fastest way to get a real hosted database without touching AWS. The production URL will look like `postgresql://user:pass@host:port/dbname`. Store it in your Railway environment variables, never in code. This is your first live backend API — share the URL with someone and have them make real requests.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'postgresql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'sql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'rest_api_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_4_id, 'PROJECT: Database-Backed API', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Authentication & Security
