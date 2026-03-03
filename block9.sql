DO $$
DECLARE
  stage_fullstack_3_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'Node.js & Backend Basics', 3, 'beginner')
  RETURNING stage_id INTO stage_fullstack_3_id;

  DECLARE
    topic_fullstack_3_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_3_id, 'Node.js Fundamentals', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_fullstack_3_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_1_id, 'VIDEO', 'Node.js Crash Course', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jszkrzs8tLD_WEEQBpKmqN', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_1_id, 'ARTICLE', 'Introduction to Node.js', 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Node.js is JavaScript running outside the browser — on a server, a machine, or the command line. It uses the same language you already know, but with access to the file system, network sockets, and system resources. The key concept: Node is single-threaded but non-blocking. It handles thousands of concurrent connections by delegating I/O to the operating system and continuing to run other code while waiting. This is why Node.js powers high-traffic APIs at Netflix, LinkedIn, and Uber.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_1_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_3_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_3_id, 'Express.js: Routing & Middleware', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_fullstack_3_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_2_id, 'VIDEO', 'Express.js Crash Course', 'https://www.youtube.com/watch?v=L72fhGm1tfE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_2_id, 'ARTICLE', 'Express.js', 'https://expressjs.com/en/starter/installing.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Express is minimal by design — it gives you routing and middleware, nothing else. Every other feature (database access, authentication, validation, logging) you add yourself or via npm packages. This makes it flexible but requires you to make decisions. Middleware is the key concept: a middleware function runs between receiving a request and sending a response. Authentication, logging, body parsing, error handling — all of these are middleware functions that run in sequence.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_2_id, 'express_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_3_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_3_id, 'REST API Design Principles', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_3_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_3_id, 'VIDEO', 'REST API Design Best Practices', 'https://www.youtube.com/watch?v=-MTSQjw5DrM', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_3_id, 'ARTICLE', 'RESTful API Design', 'https://restfulapi.net/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'REST is a set of conventions, not a strict protocol. The most important ones: use nouns in URLs (not verbs) — `/users`, not `/getUsers`. Use HTTP methods for the action — `GET /users` lists, `POST /users` creates, `PUT /users/1` updates, `DELETE /users/1` deletes. Always return consistent JSON structure. Always use correct status codes — a `200` response with `{ error: ''not found'' }` is worse than a `404`. Your frontend code depends on these contracts being reliable.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_3_id, 'rest_api_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_3_id, 'express_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_3_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_3_id, 'Input Validation & Error Handling', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_fullstack_3_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_4_id, 'VIDEO', 'Zod Validation Tutorial', 'https://www.youtube.com/watch?v=L6BE-U3oy80', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_4_id, 'ARTICLE', 'Zod Documentation', 'https://zod.dev/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Never trust data from the client. Ever. A user can send any JSON they want to your API — wrong types, missing fields, SQL injection strings, excessively long strings. Zod lets you define the exact shape of valid input and throws a structured error when anything doesn''t match. The global error handler catches those errors and sends a `400` response before the bad data reaches your database. This is your first line of defence in backend security.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_4_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_4_id, 'rest_api_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_3_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_3_id, 'TypeScript on the Backend', '', 'lesson', 1, 'intermediate', 5)
    RETURNING topic_id INTO topic_fullstack_3_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_5_id, 'VIDEO', 'TypeScript with Express', 'https://www.youtube.com/watch?v=qy8PxD3alWw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_5_id, 'ARTICLE', 'TypeScript + Node.js', 'https://nodejs.org/en/learn/getting-started/nodejs-with-typescript', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'TypeScript on the backend gives you the same benefits as on the frontend — type safety, autocomplete, refactoring confidence — but the Node.js setup is slightly different. You need `ts-node` (or `tsx`) to run `.ts` files directly, and a `tsconfig.json` configured for Node (not the browser). The biggest win of full-stack TypeScript: define your types once in a shared package or file and import them in both your frontend and backend. When your API changes shape, TypeScript tells you everywhere that breaks.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_5_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_5_id, 'express_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_3_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_3_id, 'Environment Variables & Configuration', '', 'lesson', 1, 'beginner', 6)
    RETURNING topic_id INTO topic_fullstack_3_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_6_id, 'VIDEO', 'dotenv & Environment Variables', 'https://www.youtube.com/watch?v=17UVejOw3zA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_6_id, 'ARTICLE', 'dotenv', 'https://www.npmjs.com/package/dotenv', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Environment variables are how you configure an application without hardcoding secrets. Database URL, JWT secret, API keys, port number — all of these change between environments (your laptop vs a production server). Never commit a `.env` file. Validate env vars on startup so the app fails fast with a clear error rather than crashing later on first use. A common pattern: use Zod to parse and validate `process.env` into a typed config object.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_6_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_3_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_3_id, 'PROJECT: REST API Server', '', 'project_milestone', 8, 'intermediate', 7)
    RETURNING topic_id INTO topic_fullstack_3_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_7_id, 'VIDEO', 'Build a REST API with Node.js', 'https://www.youtube.com/watch?v=BDo1lgaZuII', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_7_id, 'ARTICLE', 'Express routing guide', 'https://expressjs.com/en/guide/routing.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_3_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This server has no database yet — all data lives in memory and disappears when the server restarts. That''s intentional. Building the API logic first, without database complexity, forces you to focus on route design, validation, and error handling. In Stage 4 you swap the in-memory arrays for real database calls — the route handlers barely change.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_7_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_7_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_7_id, 'rest_api_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_7_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_3_id, 'PROJECT: REST API Server', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Databases with PostgreSQL & Prisma
