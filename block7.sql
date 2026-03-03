DO $$
DECLARE
  stage_fullstack_1_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'Web Foundations + JavaScript', 1, 'beginner')
  RETURNING stage_id INTO stage_fullstack_1_id;

  DECLARE
    topic_fullstack_1_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_1_id, 'How the Web Works + Dev Environment Setup', '', 'concept', 1, 'beginner', 1)
    RETURNING topic_id INTO topic_fullstack_1_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_1_id, 'VIDEO', 'How The Web Works', 'https://www.youtube.com/watch?v=hJHvdBlSxug', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_1_id, 'ARTICLE', 'How the Web works', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Full-stack development means you own the entire request-response cycle: you build what users see (frontend), the logic that processes their actions (backend), and the storage that persists their data (database). Understanding how these three layers communicate is the single most important mental model in this path. Everything you build from here reinforces this cycle.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_fundamentals', 'Web fundamentals', 'fundamentals') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_1_id, 'web_fundamentals') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('http_basics', 'HTTP basics', 'fundamentals') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_1_id, 'http_basics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_1_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_1_id, 'git') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_1_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_1_id, 'HTML & Semantic Markup', '', 'lesson', 1, 'beginner', 2)
    RETURNING topic_id INTO topic_fullstack_1_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_2_id, 'VIDEO', 'HTML Crash Course', 'https://www.youtube.com/watch?v=UB1O30fR-EE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_2_id, 'ARTICLE', 'HTML basics', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In full-stack development, HTML is usually generated dynamically by a template engine or a frontend framework — but you must understand its structure first. Every form input, every link, every button you build on the backend will eventually render as HTML. Get the semantics right from day one.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_2_id, 'html') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_1_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_1_id, 'CSS, Flexbox & Tailwind', '', 'lesson', 2, 'beginner', 3)
    RETURNING topic_id INTO topic_fullstack_1_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_3_id, 'VIDEO', 'Tailwind CSS Crash Course', 'https://www.youtube.com/watch?v=dFgzHOX84xQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_3_id, 'ARTICLE', 'Tailwind CSS Docs', 'https://tailwindcss.com/docs/installation', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Full-stack developers don''t need to master every CSS nuance — but you need to be fast enough with Tailwind to build clean UIs without a designer handing you code. The goal here is fluency, not perfection. Tailwind''s utility classes map directly to CSS properties — once you internalize `p-4 = padding: 1rem`, it becomes muscle memory.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_3_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_3_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_3_id, 'responsive_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_1_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_1_id, 'JavaScript Core: Variables, Functions, Arrays & Objects', '', 'lesson', 3, 'beginner', 4)
    RETURNING topic_id INTO topic_fullstack_1_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_4_id, 'VIDEO', 'JavaScript Crash Course', 'https://www.youtube.com/watch?v=hdI2bqOjy3c', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_4_id, 'ARTICLE', 'JavaScript', 'https://javascript.info/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'JavaScript runs on both sides of the stack. In the browser it powers your UI — in Node.js it powers your server. Learning it deeply now means you''ll write the same language everywhere. Focus especially on array methods (`map`, `filter`, `reduce`) — they''re the backbone of every data transformation you''ll do on both frontend and backend.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_4_id, 'javascript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_1_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_1_id, 'Async JavaScript: Promises, Fetch & async/await', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_fullstack_1_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_5_id, 'VIDEO', 'Async JS, Promises, Fetch', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jAhrjtZ9U93UMIhnCc44MH', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_5_id, 'ARTICLE', 'Async/await', 'https://javascript.info/async-await', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Async code is everywhere in full-stack development: reading from a database, calling an external API, writing a file. `async/await` is just syntactic sugar over Promises — it makes async code read like synchronous code. The pattern `try { const data = await someAsyncThing() } catch (err) { handleError(err) }` is something you will write hundreds of times across frontend and backend. Internalize it now.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_5_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_5_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_1_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_1_id, 'Git & GitHub Professional Workflow', '', 'lesson', 1, 'beginner', 6)
    RETURNING topic_id INTO topic_fullstack_1_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_6_id, 'VIDEO', 'Git & GitHub Crash Course', 'https://www.youtube.com/watch?v=SWYqp7iY_Tc', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_6_id, 'ARTICLE', 'Git', 'https://rogerdudler.github.io/git-guide/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Never commit `.env` files. This is the single most important Git habit for full-stack developers — `.env` files contain database passwords and API secrets. If they end up on GitHub (even privately), they''re compromised. Add `.env` to `.gitignore` on every project before the first commit. Use `.env.example` to document which variables are needed without exposing their values.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_6_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_6_id, 'github') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_1_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_1_id, 'PROJECT: Static Portfolio Page', '', 'project_milestone', 4, 'beginner', 7)
    RETURNING topic_id INTO topic_fullstack_1_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_7_id, 'VIDEO', 'Build a Portfolio Website', 'https://www.youtube.com/watch?v=xV7S8BhIeBo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_7_id, 'ARTICLE', 'Formspree', 'https://formspree.io', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_1_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This portfolio will grow throughout the entire path. Every project you build gets added here. By Stage 8, it will be a real, full-stack portfolio app — but it starts here as a simple static page. Ship it now, improve it later.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'html') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vercel', 'Vercel', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'vercel') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_1_id, 'PROJECT: Static Portfolio Page', '', 'beginner') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: React & Frontend Fundamentals
