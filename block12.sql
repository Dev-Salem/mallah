DO $$
DECLARE
  stage_fullstack_6_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'Full-Stack Integration', 6, 'beginner')
  RETURNING stage_id INTO stage_fullstack_6_id;

  DECLARE
    topic_fullstack_6_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_6_id, 'Connecting React to Your API', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_fullstack_6_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_1_id, 'VIDEO', 'Axios & CORS', 'https://www.youtube.com/watch?v=6LyagkoRWYA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_1_id, 'ARTICLE', 'CORS', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks your frontend from calling an API on a different domain by default. Your backend must explicitly allow requests from your frontend''s domain. In development: `cors({ origin: ''http://localhost:3000'' })`. In production: `cors({ origin: process.env.FRONTEND_URL })`. Never use `cors({ origin: ''*'' })` on an API that has authentication — it defeats the purpose.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_1_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_1_id, 'express_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_6_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_6_id, 'Auth State in the Frontend', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_fullstack_6_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_2_id, 'VIDEO', 'React Auth', 'https://www.youtube.com/watch?v=nI8PYZNFtac', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_2_id, 'ARTICLE', 'Where to store JWT', 'https://hasura.io/blog/best-practices-of-using-jwt-with-hasura-graphql-engine/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The safest place to store an access token is in JavaScript memory — not localStorage (vulnerable to XSS), not a cookie (accessible to JS). The refresh token goes in an HttpOnly cookie — JavaScript can''t read it, so XSS can''t steal it. On page load or token expiry, make a silent call to `POST /auth/refresh` to get a fresh access token. This pattern is used by major applications including GitHub and Google and is considered best practice in 2026.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_2_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_2_id, 'authentication') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_6_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_6_id, 'File Uploads & Storage', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_6_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_3_id, 'VIDEO', 'File Uploads with Multer & Cloudinary', 'https://www.youtube.com/watch?v=ZRCEzDk_MeA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_3_id, 'ARTICLE', 'Cloudinary Node.js SDK', 'https://cloudinary.com/documentation/node_integration', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Never store uploaded files in your Node.js server''s filesystem — servers are ephemeral in production (they restart, scale, and replace themselves). Always store files in a dedicated file storage service: Cloudinary for images/video, AWS S3 for general files. The pattern: receive file in Express (Multer buffers it in memory), upload buffer to Cloudinary, get back a public URL, store that URL in your database. The frontend loads images directly from Cloudinary''s CDN — your server is never in the image-serving path.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_3_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_3_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_6_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_6_id, 'Real-Time Features with WebSockets', '', 'lesson', 2, 'advanced', 4)
    RETURNING topic_id INTO topic_fullstack_6_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_4_id, 'VIDEO', 'Socket.io Crash Course', 'https://www.youtube.com/watch?v=jD7FnbI76Hg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_4_id, 'ARTICLE', 'Socket.io Documentation', 'https://socket.io/docs/v4/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'WebSockets maintain a persistent connection between client and server — data flows in both directions at any time without the overhead of a new HTTP request. Use WebSockets for: chat, live notifications, collaborative editing, real-time dashboards. Use REST for everything else. Socket.io adds rooms (grouping connections), namespaces (separating concerns), and reconnection logic on top of the raw WebSocket protocol.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('websockets', 'WebSockets', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_4_id, 'websockets') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_4_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_6_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_6_id, 'Search, Filtering & Pagination', '', 'lesson', 1, 'intermediate', 5)
    RETURNING topic_id INTO topic_fullstack_6_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_5_id, 'VIDEO', 'Pagination & Filtering with Prisma', 'https://www.youtube.com/watch?v=oNlMrpnUSFE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_5_id, 'ARTICLE', 'Prisma Filtering', 'https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Every production API needs search and pagination. Returning all 100,000 posts from `GET /posts` works in development and crashes in production. Offset pagination (`skip` + `take`) is simple but slow on large datasets (the database must scan all skipped rows). Cursor-based pagination is faster for deep pages but harder to implement. Start with offset — switch to cursor when you have performance data showing it matters.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_5_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_5_id, 'rest_api_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_6_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_6_id, 'PROJECT: Full-Stack App v1', '', 'project_milestone', 14, 'advanced', 6)
    RETURNING topic_id INTO topic_fullstack_6_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_6_id, 'VIDEO', 'Full Stack MERN Project', 'https://www.youtube.com/watch?v=7CqJlxBYj-M', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_6_id, 'ARTICLE', 'Monorepo with npm workspaces', 'https://docs.npmjs.com/cli/v10/using-npm/workspaces', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_6_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is a real product. It has a real URL, real users can sign up, and real data persists. The fact that it''s a "learning project" doesn''t change what it is technically. Ship it, share the URL, and get feedback from real users. Finding out that something doesn''t work as expected for a real person is worth more than 10 more hours of tutorial watching.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'postgresql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'rest_api_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_6_id, 'PROJECT: Full-Stack App v1', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: DevOps, Deployment & CI/CD
