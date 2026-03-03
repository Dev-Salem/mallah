DO $$
DECLARE
  stage_fullstack_5_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'Authentication & Security', 5, 'beginner')
  RETURNING stage_id INTO stage_fullstack_5_id;

  DECLARE
    topic_fullstack_5_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_5_id, 'Authentication vs Authorization & Password Hashing', '', 'lesson', 1, 'intermediate', 1)
    RETURNING topic_id INTO topic_fullstack_5_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_1_id, 'VIDEO', 'Password Hashing with bcrypt', 'https://www.youtube.com/watch?v=AzA_LTDoFqY', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_1_id, 'ARTICLE', 'How bcrypt works', 'https://auth0.com/blog/hashing-in-action-understanding-bcrypt/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Passwords must never be stored in plain text. Even in encrypted form. The reason: if your database is breached, you want an attacker to have useless hashes rather than real passwords. Bcrypt is a one-way hashing function with a configurable work factor — as computers get faster, you increase the work factor to keep brute-forcing expensive. 10 salt rounds is the minimum for new projects in 2026; 12 is better for sensitive applications.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_1_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_1_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_5_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_5_id, 'JWT Authentication: Login & Protected Routes', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_fullstack_5_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_2_id, 'VIDEO', 'JWT Authentication', 'https://www.youtube.com/watch?v=mbsmsi7l3r4', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_2_id, 'ARTICLE', 'JWT Introduction', 'https://jwt.io/introduction', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A JWT is three Base64-encoded JSON objects joined by dots: `header.payload.signature`. The server signs the token with a secret key — if anyone tampers with the payload, the signature won''t match and verification fails. JWTs are stateless: the server doesn''t store them. This means you can''t invalidate a single token without a blocklist — which is why short expiry times (15 minutes for access tokens, 7 days for refresh tokens) are important.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_2_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_2_id, 'express_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_5_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_5_id, 'Refresh Tokens & Secure Token Storage', '', 'lesson', 2, 'advanced', 3)
    RETURNING topic_id INTO topic_fullstack_5_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_3_id, 'VIDEO', 'Refresh Token Implementation', 'https://www.youtube.com/watch?v=s-4k5TcGKHg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_3_id, 'ARTICLE', 'JWT Refresh Tokens', 'https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The access/refresh token pattern exists because short-lived access tokens are more secure (less damage if leaked) but require refresh tokens for a good UX (so users aren''t logged out every 15 minutes). The refresh token is stored hashed in the database — only the hash, never the raw token. When `POST /auth/refresh` is called, you hash the incoming token and compare it to the stored hash, just like password verification. Token rotation on refresh means a stolen refresh token can only be used once before it''s invalidated.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_3_id, 'authentication') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_5_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_5_id, 'Role-Based Authorization (RBAC)', '', 'lesson', 1, 'intermediate', 4)
    RETURNING topic_id INTO topic_fullstack_5_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_4_id, 'VIDEO', 'Role-Based Access Control', 'https://www.youtube.com/watch?v=jI4K7L-LI58', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_4_id, 'ARTICLE', 'RBAC', 'https://auth0.com/docs/manage-users/access-control/rbac', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '401 Unauthorized means "you''re not logged in." 403 Forbidden means "you''re logged in but you don''t have permission." Using the wrong code confuses clients and leaks information about your system. RBAC (Role-Based Access Control) is the most common authorization pattern: every user has a role, and roles grant access to resources. Keep roles simple at first — `user` and `admin` covers most apps. Avoid the temptation to create roles for every possible permission level.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_4_id, 'authentication') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_5_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_5_id, 'PROJECT: Auth System', '', 'project_milestone', 8, 'advanced', 5)
    RETURNING topic_id INTO topic_fullstack_5_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_5_id, 'VIDEO', 'Full Auth System', 'https://www.youtube.com/watch?v=enopDSs3DRw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_5_id, 'ARTICLE', 'OWASP Authentication Cheat Sheet', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_5_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Authentication is the most security-critical code you''ll ever write. A bug here doesn''t just break a feature — it exposes every user''s account. Read the OWASP Authentication Cheat Sheet. It''s not long. Every point on it represents a real breach pattern. The fundamentals: hash passwords, use short-lived tokens, validate all input, never log passwords or tokens, use HTTPS in production.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_5_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_5_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_5_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_5_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_5_id, 'PROJECT: Auth System', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Full-Stack Integration
