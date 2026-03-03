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
    VALUES (topic_fullstack_1_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In full-stack development, HTML is usually generated dynamically by a template engine or a frontend framework ƒ?" but you must understand its structure first. Every form input, every link, every button you build on the backend will eventually render as HTML. Get the semantics right from day one.', 3);
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
    VALUES (topic_fullstack_1_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Full-stack developers don''t need to master every CSS nuance ƒ?" but you need to be fast enough with Tailwind to build clean UIs without a designer handing you code. The goal here is fluency, not perfection. Tailwind''s utility classes map directly to CSS properties ƒ?" once you internalize `p-4 = padding: 1rem`, it becomes muscle memory.', 3);
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
    VALUES (topic_fullstack_1_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'JavaScript runs on both sides of the stack. In the browser it powers your UI ƒ?" in Node.js it powers your server. Learning it deeply now means you''ll write the same language everywhere. Focus especially on array methods (`map`, `filter`, `reduce`) ƒ?" they''re the backbone of every data transformation you''ll do on both frontend and backend.', 3);
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
    VALUES (topic_fullstack_1_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Async code is everywhere in full-stack development: reading from a database, calling an external API, writing a file. `async/await` is just syntactic sugar over Promises ƒ?" it makes async code read like synchronous code. The pattern `try { const data = await someAsyncThing() } catch (err) { handleError(err) }` is something you will write hundreds of times across frontend and backend. Internalize it now.', 3);
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
    VALUES (topic_fullstack_1_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Never commit `.env` files. This is the single most important Git habit for full-stack developers ƒ?" `.env` files contain database passwords and API secrets. If they end up on GitHub (even privately), they''re compromised. Add `.env` to `.gitignore` on every project before the first commit. Use `.env.example` to document which variables are needed without exposing their values.', 3);
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
    VALUES (topic_fullstack_1_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This portfolio will grow throughout the entire path. Every project you build gets added here. By Stage 8, it will be a real, full-stack portfolio app ƒ?" but it starts here as a simple static page. Ship it now, improve it later.', 3);
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
    VALUES (topic_fullstack_2_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'React''s mental model: UI is a function of data. Instead of imperatively manipulating the DOM (`document.querySelector(''.card'').textContent = ''new''`), you declare what the UI should look like given some data, and React handles the DOM updates. This is the shift from imperative to declarative programming ƒ?" and it''s the biggest conceptual jump in this path.', 3);
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
    VALUES (topic_fullstack_2_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'React Router makes single-page apps behave like multi-page ones ƒ?" the browser URL changes and the browser back/forward buttons work, but the page never fully reloads. `useParams` extracts dynamic route segments (e.g. `/user/torvalds` ƒ+' `{ username: ''torvalds'' }`). This hook pattern is exactly how full-stack apps pass IDs between frontend routes and backend API calls.', 3);
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
    VALUES (topic_fullstack_2_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'TypeScript is non-negotiable in 2026 for full-stack development. The main benefit: type errors catch bugs at development time rather than at runtime in production. For full-stack devs, TypeScript is doubly valuable because you can share types between frontend and backend ƒ?" define a `User` type once, use it in your React component AND your Express route handler.', 3);
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
    VALUES (topic_fullstack_2_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Form handling is where frontend and backend meet ƒ?" every form submission eventually becomes an HTTP request to your server. Getting form validation right on the frontend (before the server even sees the data) is both a better UX and a security principle called defence in depth. Your backend should still validate everything ƒ?" but good frontend validation catches obvious errors instantly without a round trip.', 3);
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
    VALUES (topic_fullstack_2_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Next.js bridges the frontend/backend divide beautifully. Its API routes (`app/api/...`) let you write server-side logic ƒ?" database queries, external API calls with hidden keys, server actions ƒ?" inside the same codebase as your React components. For many small full-stack apps, Next.js alone replaces a separate Express server. You''ll learn Express separately in Stage 3 because understanding the fundamentals of a web server matters ƒ?" but in practice, many teams use Next.js for everything.', 3);
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
    VALUES (topic_fullstack_3_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Node.js is JavaScript running outside the browser ƒ?" on a server, a machine, or the command line. It uses the same language you already know, but with access to the file system, network sockets, and system resources. The key concept: Node is single-threaded but non-blocking. It handles thousands of concurrent connections by delegating I/O to the operating system and continuing to run other code while waiting. This is why Node.js powers high-traffic APIs at Netflix, LinkedIn, and Uber.', 3);
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
    VALUES (topic_fullstack_3_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Express is minimal by design ƒ?" it gives you routing and middleware, nothing else. Every other feature (database access, authentication, validation, logging) you add yourself or via npm packages. This makes it flexible but requires you to make decisions. Middleware is the key concept: a middleware function runs between receiving a request and sending a response. Authentication, logging, body parsing, error handling ƒ?" all of these are middleware functions that run in sequence.', 3);
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
    VALUES (topic_fullstack_3_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'REST is a set of conventions, not a strict protocol. The most important ones: use nouns in URLs (not verbs) ƒ?" `/users`, not `/getUsers`. Use HTTP methods for the action ƒ?" `GET /users` lists, `POST /users` creates, `PUT /users/1` updates, `DELETE /users/1` deletes. Always return consistent JSON structure. Always use correct status codes ƒ?" a `200` response with `{ error: ''not found'' }` is worse than a `404`. Your frontend code depends on these contracts being reliable.', 3);
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
    VALUES (topic_fullstack_3_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Never trust data from the client. Ever. A user can send any JSON they want to your API ƒ?" wrong types, missing fields, SQL injection strings, excessively long strings. Zod lets you define the exact shape of valid input and throws a structured error when anything doesn''t match. The global error handler catches those errors and sends a `400` response before the bad data reaches your database. This is your first line of defence in backend security.', 3);
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
    VALUES (topic_fullstack_3_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'TypeScript on the backend gives you the same benefits as on the frontend ƒ?" type safety, autocomplete, refactoring confidence ƒ?" but the Node.js setup is slightly different. You need `ts-node` (or `tsx`) to run `.ts` files directly, and a `tsconfig.json` configured for Node (not the browser). The biggest win of full-stack TypeScript: define your types once in a shared package or file and import them in both your frontend and backend. When your API changes shape, TypeScript tells you everywhere that breaks.', 3);
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
    VALUES (topic_fullstack_3_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Environment variables are how you configure an application without hardcoding secrets. Database URL, JWT secret, API keys, port number ƒ?" all of these change between environments (your laptop vs a production server). Never commit a `.env` file. Validate env vars on startup so the app fails fast with a clear error rather than crashing later on first use. A common pattern: use Zod to parse and validate `process.env` into a typed config object.', 3);
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
    VALUES (topic_fullstack_3_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This server has no database yet ƒ?" all data lives in memory and disappears when the server restarts. That''s intentional. Building the API logic first, without database complexity, forces you to focus on route design, validation, and error handling. In Stage 4 you swap the in-memory arrays for real database calls ƒ?" the route handlers barely change.', 3);
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
    VALUES (topic_fullstack_4_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'SQL is the most durable skill in this entire path. JavaScript frameworks come and go, but SQL has been the standard for relational databases since the 1970s and remains dominant today. Every company with real data uses SQL. Understanding joins is the critical skill ƒ?" a `LEFT JOIN` between users and their posts, including users with no posts, is the kind of query you''ll write every day in production.', 3);
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
    VALUES (topic_fullstack_4_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Prisma replaces raw SQL in your Node.js code with a type-safe API. Instead of writing `SELECT * FROM users WHERE id = $1`, you write `prisma.user.findUnique({ where: { id } })`. Prisma generates TypeScript types directly from your schema ƒ?" so if you query a `User`, you get autocomplete for every field. Migrations track schema changes over time, like Git for your database ƒ?" critical for teams and production deployments.', 3);
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
    VALUES (topic_fullstack_4_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is a pivotal moment: your API now persists data. The route handlers barely changed ƒ?" you replaced `array.push(item)` with `await prisma.post.create({ data: item })`. This is the power of a clean API layer between your routes and your data source. The route doesn''t care whether data comes from an array, a database, or a cache ƒ?" it just calls a function and gets data back.', 3);
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
    VALUES (topic_fullstack_4_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Real-world data is relational. A post has an author, comments, and tags. Getting a post with its author name and comment count in a single query is standard in production. Without proper relation handling, you''d make 3 separate queries for what Prisma does in one. Understanding when to use `include` (eager load ƒ?" get everything now) vs separate queries (lazy load ƒ?" fetch only when needed) is a performance decision you''ll make constantly.', 3);
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
    VALUES (topic_fullstack_4_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Seed scripts are your database''s "factory reset" ƒ?" they populate a fresh database with enough realistic data to develop and test against. Without seeds, every new dev on your team has to manually create test data. Migrations track every schema change in version control. The rule: `prisma migrate dev` creates migrations and applies them in development; `prisma migrate deploy` applies pre-created migrations in production ƒ?" never generate new migrations in prod.', 3);
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
    VALUES (topic_fullstack_4_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Railway and Render both offer free PostgreSQL databases ƒ?" they''re the fastest way to get a real hosted database without touching AWS. The production URL will look like `postgresql://user:pass@host:port/dbname`. Store it in your Railway environment variables, never in code. This is your first live backend API ƒ?" share the URL with someone and have them make real requests.', 3);
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
    VALUES (topic_fullstack_5_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Passwords must never be stored in plain text. Even in encrypted form. The reason: if your database is breached, you want an attacker to have useless hashes rather than real passwords. Bcrypt is a one-way hashing function with a configurable work factor ƒ?" as computers get faster, you increase the work factor to keep brute-forcing expensive. 10 salt rounds is the minimum for new projects in 2026; 12 is better for sensitive applications.', 3);
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
    VALUES (topic_fullstack_5_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A JWT is three Base64-encoded JSON objects joined by dots: `header.payload.signature`. The server signs the token with a secret key ƒ?" if anyone tampers with the payload, the signature won''t match and verification fails. JWTs are stateless: the server doesn''t store them. This means you can''t invalidate a single token without a blocklist ƒ?" which is why short expiry times (15 minutes for access tokens, 7 days for refresh tokens) are important.', 3);
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
    VALUES (topic_fullstack_5_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The access/refresh token pattern exists because short-lived access tokens are more secure (less damage if leaked) but require refresh tokens for a good UX (so users aren''t logged out every 15 minutes). The refresh token is stored hashed in the database ƒ?" only the hash, never the raw token. When `POST /auth/refresh` is called, you hash the incoming token and compare it to the stored hash, just like password verification. Token rotation on refresh means a stolen refresh token can only be used once before it''s invalidated.', 3);
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
    VALUES (topic_fullstack_5_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '401 Unauthorized means "you''re not logged in." 403 Forbidden means "you''re logged in but you don''t have permission." Using the wrong code confuses clients and leaks information about your system. RBAC (Role-Based Access Control) is the most common authorization pattern: every user has a role, and roles grant access to resources. Keep roles simple at first ƒ?" `user` and `admin` covers most apps. Avoid the temptation to create roles for every possible permission level.', 3);
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
    VALUES (topic_fullstack_5_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Authentication is the most security-critical code you''ll ever write. A bug here doesn''t just break a feature ƒ?" it exposes every user''s account. Read the OWASP Authentication Cheat Sheet. It''s not long. Every point on it represents a real breach pattern. The fundamentals: hash passwords, use short-lived tokens, validate all input, never log passwords or tokens, use HTTPS in production.', 3);
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
    VALUES (topic_fullstack_6_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks your frontend from calling an API on a different domain by default. Your backend must explicitly allow requests from your frontend''s domain. In development: `cors({ origin: ''http://localhost:3000'' })`. In production: `cors({ origin: process.env.FRONTEND_URL })`. Never use `cors({ origin: ''*'' })` on an API that has authentication ƒ?" it defeats the purpose.', 3);
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
    VALUES (topic_fullstack_6_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The safest place to store an access token is in JavaScript memory ƒ?" not localStorage (vulnerable to XSS), not a cookie (accessible to JS). The refresh token goes in an HttpOnly cookie ƒ?" JavaScript can''t read it, so XSS can''t steal it. On page load or token expiry, make a silent call to `POST /auth/refresh` to get a fresh access token. This pattern is used by major applications including GitHub and Google and is considered best practice in 2026.', 3);
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
    VALUES (topic_fullstack_6_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Never store uploaded files in your Node.js server''s filesystem ƒ?" servers are ephemeral in production (they restart, scale, and replace themselves). Always store files in a dedicated file storage service: Cloudinary for images/video, AWS S3 for general files. The pattern: receive file in Express (Multer buffers it in memory), upload buffer to Cloudinary, get back a public URL, store that URL in your database. The frontend loads images directly from Cloudinary''s CDN ƒ?" your server is never in the image-serving path.', 3);
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
    VALUES (topic_fullstack_6_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'WebSockets maintain a persistent connection between client and server ƒ?" data flows in both directions at any time without the overhead of a new HTTP request. Use WebSockets for: chat, live notifications, collaborative editing, real-time dashboards. Use REST for everything else. Socket.io adds rooms (grouping connections), namespaces (separating concerns), and reconnection logic on top of the raw WebSocket protocol.', 3);
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
    VALUES (topic_fullstack_6_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Every production API needs search and pagination. Returning all 100,000 posts from `GET /posts` works in development and crashes in production. Offset pagination (`skip` + `take`) is simple but slow on large datasets (the database must scan all skipped rows). Cursor-based pagination is faster for deep pages but harder to implement. Start with offset ƒ?" switch to cursor when you have performance data showing it matters.', 3);
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
    VALUES (topic_fullstack_7_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Docker solves the "works on my machine" problem by packaging your app and all its dependencies into a container ƒ?" a self-contained, reproducible environment. A new developer can clone your repo, run `docker compose up`, and have a fully working app in minutes with no manual setup. Docker is standard in every company that deploys backend services. Understanding it is non-negotiable for full-stack developers in 2026.', 3);
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
    VALUES (topic_fullstack_7_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'CI/CD (Continuous Integration / Continuous Deployment) means every code change automatically goes through a quality gate (tests, type checking, linting) before it can be merged. This prevents "it works on my machine" from becoming "it''s broken in production." GitHub Actions is free for public repos and generous for private ones. A good CI pipeline is one of the biggest professional signals in a portfolio project ƒ?" it shows you think about code quality, not just shipping.', 3);
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
    VALUES (topic_fullstack_7_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In production, you can''t add `console.log` and refresh. You need structured logs that are queryable ƒ?" fields like `{ timestamp, level, method, path, statusCode, duration, userId }`. Sentry captures exceptions with full stack traces and context, sends you an alert when something breaks, and shows you exactly which users were affected. A `GET /health` endpoint lets load balancers, uptime monitors, and automated deployment systems check if your app is alive and connected to its database.', 3);
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
    VALUES (topic_fullstack_7_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The N+1 problem is the most common performance mistake in ORM-heavy backends: you fetch 20 posts (1 query), then for each post you fetch the author (20 queries) = 21 total queries for what should be 1. Prisma''s `include` solves this with a single JOIN. Database indexes are the next biggest win: without an index on `posts.authorId`, every query that filters by author scans the entire table. Adding the index makes it O(log n). These two fixes alone can make an API 10ƒ?"100x faster.', 3);
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
    VALUES (topic_fullstack_7_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '"Production-ready" is a mindset, not a checklist. It means: when something breaks (and it will), you know about it immediately (Sentry + logging). When you deploy (and you will), the process is automatic and repeatable (CI/CD). When traffic grows (and it might), your queries are efficient (indexes, no N+1). A portfolio project with Docker, CI/CD, and monitoring is a rare and impressive signal to employers ƒ?" it shows you think like an engineer, not just a coder.', 3);
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
    VALUES (topic_fullstack_8_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Integration tests test your API end-to-end ƒ?" they make real HTTP requests to a real Express server connected to a real (test) database. Unlike unit tests, they catch bugs that span multiple layers. The key: always use a separate test database, never your dev or production database. Run `prisma migrate dev` against the test DB in CI setup. A passing test suite is a deployability signal ƒ?" if tests pass, it''s safe to deploy.', 3);
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
    VALUES (topic_fullstack_8_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Generics are TypeScript''s way of writing code that works with multiple types while still being type-safe ƒ?" like a typed function parameter for types. `ApiResponse<User>` is a response that wraps a User; `ApiResponse<Post[]>` wraps a list of Posts. The same generic handles both. Utility types like `Omit<User, ''password''>` are how you create "safe" versions of types that exclude sensitive fields ƒ?" a pattern used in nearly every production API.', 3);
