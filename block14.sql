DO $$
DECLARE
  stage_fullstack_8_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'Advanced Patterns & Capstone', 8, 'beginner')
  RETURNING stage_id INTO stage_fullstack_8_id;

  DECLARE
    topic_fullstack_8_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'API Testing with Vitest & Supertest', '', 'lesson', 2, 'advanced', 1)
    RETURNING topic_id INTO topic_fullstack_8_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_1_id, 'VIDEO', 'API Testing with Supertest', 'https://www.youtube.com/watch?v=FKnzS_icp20', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_1_id, 'ARTICLE', 'Supertest', 'https://www.npmjs.com/package/supertest', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Integration tests test your API end-to-end — they make real HTTP requests to a real Express server connected to a real (test) database. Unlike unit tests, they catch bugs that span multiple layers. The key: always use a separate test database, never your dev or production database. Run `prisma migrate dev` against the test DB in CI setup. A passing test suite is a deployability signal — if tests pass, it''s safe to deploy.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('backend_testing', 'Backend Testing', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_1_id, 'backend_testing') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Advanced TypeScript: Generics & Utility Types', '', 'lesson', 1, 'advanced', 2)
    RETURNING topic_id INTO topic_fullstack_8_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_2_id, 'VIDEO', 'TypeScript Generics', 'https://www.youtube.com/watch?v=EcCTIExsqmI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_2_id, 'ARTICLE', 'TypeScript Utility Types', 'https://www.typescriptlang.org/docs/handbook/utility-types.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Generics are TypeScript''s way of writing code that works with multiple types while still being type-safe — like a typed function parameter for types. `ApiResponse<User>` is a response that wraps a User; `ApiResponse<Post[]>` wraps a list of Posts. The same generic handles both. Utility types like `Omit<User, ''password''>` are how you create "safe" versions of types that exclude sensitive fields — a pattern used in nearly every production API.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_2_id, 'typescript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Rate Limiting, Security Headers & OWASP Basics', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_8_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'VIDEO', 'Express Security Best Practices', 'https://www.youtube.com/watch?v=igehB5dPidI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'ARTICLE', 'OWASP Top 10', 'https://owasp.org/www-project-top-ten/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Security is not a feature you add at the end — it''s a practice you maintain throughout. `helmet` adds dozens of security headers in one line. Rate limiting on auth routes prevents brute-force attacks. Input sanitisation prevents XSS. The OWASP Top 10 is the industry standard list of the most critical security risks — every developer should read it at least once. These mitigations aren''t optional for anything real users will use.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_security', 'Web Security', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_3_id, 'web_security') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Emails, Background Jobs & Queues', '', 'lesson', 2, 'advanced', 4)
    RETURNING topic_id INTO topic_fullstack_8_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'VIDEO', 'Send Emails with Resend & Node.js', 'https://www.youtube.com/watch?v=P3MlSFJWMqo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'ARTICLE', 'Resend Node.js SDK', 'https://resend.com/docs/send-with-nodejs', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Email verification protects your database from fake accounts and ensures you can reach users. Resend is the cleanest transactional email API for developers — the free tier sends 3,000 emails/month. The email verification token should be a random string (not a JWT) stored hashed in the database with an expiry timestamp. Never send the token in plain text in a URL and store it plain — always hash it, just like passwords.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_4_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Capstone Planning & Architecture', '', 'lesson', 2, 'advanced', 5)
    RETURNING topic_id INTO topic_fullstack_8_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'VIDEO', 'How to Plan a Full-Stack Project', 'https://www.youtube.com/watch?v=0pThnRneDjw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'ARTICLE', 'Writing a Technical Spec', 'https://basecamp.com/shapeup/1.5-chapter-06', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Professional developers don''t open their code editor first — they think first. A technical spec forces you to make decisions on paper (cheap) rather than in code (expensive to change). Your ERD will expose missing relations. Your API list will reveal inconsistencies. Your component tree will catch missing pages. Spending 2 hours planning saves 20 hours of refactoring.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('system_design', 'System Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_5_id, 'system_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'PROJECT: Capstone Full-Stack Product', '', 'project_capstone', 30, 'advanced', 6)
    RETURNING topic_id INTO topic_fullstack_8_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_6_id, 'ARTICLE', 'Readme Driven Development', 'https://tom.preston-werner.com/2010/08/23/readme-driven-development.html', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your capstone is what employers will actually look at. Not your certificates, not your course completion, not your freeCodeCamp badge. When a hiring manager Googles your name, this project should come up. Make it something you''re proud to demo in a 30-minute interview. The README should be so good that a developer you''ve never met could clone it, run it, and understand exactly what it does and why every decision was made.', 2);
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_8_id, 'PROJECT: Capstone Full-Stack Product', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Python for Data Science
