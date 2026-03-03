DO $$
DECLARE
  stage_fullstack_2_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('fullstack', 'React & Frontend Fundamentals', 2, 'beginner')
  RETURNING stage_id INTO stage_fullstack_2_id;

  DECLARE
    topic_fullstack_2_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_2_id, 'React: Components, Props & JSX', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_fullstack_2_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_1_id, 'VIDEO', 'React Crash Course', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_1_id, 'ARTICLE', 'Your first component', 'https://react.dev/learn/your-first-component', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'React''s mental model: UI is a function of data. Instead of imperatively manipulating the DOM (`document.querySelector(''.card'').textContent = ''new''`), you declare what the UI should look like given some data, and React handles the DOM updates. This is the shift from imperative to declarative programming — and it''s the biggest conceptual jump in this path.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_1_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vite', 'Vite', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_1_id, 'vite') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_2_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_2_id, 'State, useState & useEffect', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_fullstack_2_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_2_id, 'VIDEO', 'useState & useEffect', 'https://www.youtube.com/watch?v=O6P86uwfdR0', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_2_id, 'ARTICLE', 'State: a component''s memory', 'https://react.dev/learn/state-a-components-memory', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`useState` and `useEffect` are the two most important hooks. 90% of React apps are built with just these two. The pattern: `useState` holds data that changes, `useEffect` runs side effects (fetching, timers, subscriptions) after render. Master these before touching any other hooks.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_2_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_2_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_2_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_2_id, 'React Router & Multi-Page Apps', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_2_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_3_id, 'VIDEO', 'React Router v6', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9iVKmtNuCeIswnQ97in2GGf', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_3_id, 'ARTICLE', 'React Router Tutorial', 'https://reactrouter.com/en/main/start/tutorial', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'React Router makes single-page apps behave like multi-page ones — the browser URL changes and the browser back/forward buttons work, but the page never fully reloads. `useParams` extracts dynamic route segments (e.g. `/user/torvalds` → `{ username: ''torvalds'' }`). This hook pattern is exactly how full-stack apps pass IDs between frontend routes and backend API calls.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_3_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_2_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_2_id, 'TypeScript for React', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_fullstack_2_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_4_id, 'VIDEO', 'TypeScript Crash Course', 'https://www.youtube.com/watch?v=BCg4U1FzODs', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_4_id, 'ARTICLE', 'TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'TypeScript is non-negotiable in 2026 for full-stack development. The main benefit: type errors catch bugs at development time rather than at runtime in production. For full-stack devs, TypeScript is doubly valuable because you can share types between frontend and backend — define a `User` type once, use it in your React component AND your Express route handler.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_4_id, 'typescript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_2_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_2_id, 'Forms, Validation & Context API', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_fullstack_2_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_5_id, 'VIDEO', 'React Hook Form', 'https://www.youtube.com/watch?v=R_Pj593TH_Q', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_5_id, 'ARTICLE', 'React Hook Form Docs', 'https://react-hook-form.com/get-started', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Form handling is where frontend and backend meet — every form submission eventually becomes an HTTP request to your server. Getting form validation right on the frontend (before the server even sees the data) is both a better UX and a security principle called defence in depth. Your backend should still validate everything — but good frontend validation catches obvious errors instantly without a round trip.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_5_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_2_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_2_id, 'Next.js: SSR, App Router & API Routes', '', 'lesson', 2, 'intermediate', 6)
    RETURNING topic_id INTO topic_fullstack_2_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_6_id, 'VIDEO', 'Next.js 14 Crash Course', 'https://www.youtube.com/watch?v=ZVnjOPwW4ZA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_6_id, 'ARTICLE', 'Next.js', 'https://nextjs.org/docs/getting-started/installation', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Next.js bridges the frontend/backend divide beautifully. Its API routes (`app/api/...`) let you write server-side logic — database queries, external API calls with hidden keys, server actions — inside the same codebase as your React components. For many small full-stack apps, Next.js alone replaces a separate Express server. You''ll learn Express separately in Stage 3 because understanding the fundamentals of a web server matters — but in practice, many teams use Next.js for everything.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_6_id, 'next_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_2_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_2_id, 'PROJECT: Frontend-Only SPA', '', 'project_milestone', 8, 'intermediate', 7)
    RETURNING topic_id INTO topic_fullstack_2_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_7_id, 'VIDEO', 'Build a Full Next.js App', 'https://www.youtube.com/watch?v=wm5gMKuwSYk', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_7_id, 'ARTICLE', 'Next.js App Router Guide', 'https://nextjs.org/docs/app/building-your-application', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_2_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is the last purely frontend project you''ll build. From Stage 3 onward, everything has a backend. Notice as you build this: where does it feel fragile? Where do you wish you controlled the data instead of depending on a third-party API? Those are exactly the problems your own backend will solve.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_2_id, 'PROJECT: Frontend-Only SPA', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Node.js & Backend Basics
