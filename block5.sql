DO $$
DECLARE
  stage_frontend_6_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('frontend', 'Modern Frontend Stack', 6, 'beginner')
  RETURNING stage_id INTO stage_frontend_6_id;

  DECLARE
    topic_frontend_6_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_6_id, 'TypeScript for React Developers', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_frontend_6_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_1_id, 'VIDEO', 'TypeScript for React Developers', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gNhFQgS4edYLqP7LkZcFMN', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_1_id, 'ARTICLE', 'React TypeScript Cheatsheet', 'https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'TypeScript is JavaScript with type annotations. It doesn''t change how your code runs — it only adds a compile step that checks your code for type errors before it reaches the browser. The main benefit: when you misuse a variable (pass a string where a number is expected, access a property that doesn''t exist), TypeScript tells you immediately during development instead of at runtime in front of a user. Most companies now require TypeScript for frontend roles.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_1_id, 'typescript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_6_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_6_id, 'Next.js: Routing, SSR & the App Router', '', 'lesson', 3, 'intermediate', 2)
    RETURNING topic_id INTO topic_frontend_6_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_2_id, 'VIDEO', 'Next.js 14 Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jClk8wl1yJcN3Zlrr8YSA1', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_2_id, 'ARTICLE', 'Next.js', 'https://nextjs.org/docs/getting-started/installation', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Next.js is React with superpowers. It adds: server-side rendering (HTML generated on the server = better SEO and initial load), file-based routing (no React Router needed), built-in image optimization, and API routes. In 2026, most new React projects start with Next.js, not bare React. The App Router is now the standard — Server Components run on the server and send pre-rendered HTML; Client Components handle interactivity in the browser.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_2_id, 'next_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_6_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_6_id, 'API Routes & Server Actions', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_frontend_6_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_3_id, 'VIDEO', 'Next.js API Routes', 'https://www.youtube.com/watch?v=vrR4MlB7nBI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_3_id, 'ARTICLE', 'Route Handlers', 'https://nextjs.org/docs/app/building-your-application/routing/route-handlers', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'API routes in Next.js let you write server-side code inside your frontend project. The most important use case: never expose API keys in client-side code (they end up in the browser''s source). Instead, make requests to your own `/api/...` endpoint, which runs on the server and calls the external API securely. This is called a Backend for Frontend (BFF) pattern.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_3_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_3_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_6_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_6_id, 'Tailwind CSS at Scale & Component Libraries', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_frontend_6_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_4_id, 'VIDEO', 'shadcn/ui Tutorial', 'https://www.youtube.com/watch?v=7MKEOfSP2s4', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_4_id, 'ARTICLE', 'shadcn/ui', 'https://ui.shadcn.com/docs', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'shadcn/ui is not a component library you install — it''s a collection of copy-paste-able components built on Radix UI (accessible primitives) and styled with Tailwind. You own the code; it lives in your project. This is the current industry preference over libraries like MUI or Chakra because you have full control with no version lock-in. Companies like Vercel and Linear use this approach.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_4_id, 'tailwind_css') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_6_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_6_id, 'State Management with Zustand', '', 'lesson', 1, 'intermediate', 5)
    RETURNING topic_id INTO topic_frontend_6_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_5_id, 'VIDEO', 'Zustand State Management Tutorial', 'https://www.youtube.com/watch?v=AYO4qHAnLQI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_5_id, 'ARTICLE', 'Zustand', 'https://github.com/pmndrs/zustand', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Zustand is a tiny state management library. You create a store with `create()`, define state and updater functions inside it, and subscribe to it from any component using a hook — no Provider required. The key advantage over Context: components only re-render when the specific slice of state they subscribe to changes, not the entire tree. This makes it far more performant for high-frequency updates.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_5_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_6_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_6_id, 'React Query: Server State & Caching', '', 'lesson', 2, 'intermediate', 6)
    RETURNING topic_id INTO topic_frontend_6_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_6_id, 'VIDEO', 'React Query Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jUPIes5fRFddaqzBa3RJKZ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_6_id, 'ARTICLE', 'TanStack Query', 'https://tanstack.com/query/latest/docs/framework/react/overview', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Every time you write `useEffect(() => { fetch(...) }, [])`, you''re reinventing what React Query does — poorly. React Query manages loading, error, and success states for you, caches responses, handles background refetching, deduplicates concurrent requests, and gives you optimistic updates. It''s one of the highest-impact libraries you can add to a React project.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_6_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_6_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_6_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_6_id, 'PROJECT: Full-Featured Web App', '', 'project_milestone', 14, 'advanced', 7)
    RETURNING topic_id INTO topic_frontend_6_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_7_id, 'VIDEO', 'Build a Full Stack Next.js App', 'https://www.youtube.com/watch?v=wm5gMKuwSYk', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_7_id, 'ARTICLE', 'Next.js', 'https://nextjs.org/docs/app/building-your-application', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_6_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is your most important portfolio project at this stage. Pick the idea you''d actually use yourself — passion shows in the details. Scope it for 2–3 weeks: a finished, polished, smaller app is worth far more than an ambitious unfinished one. Ship it, write a good README, and link it everywhere.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_6_id, 'PROJECT: Full-Featured Web App', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Performance, Accessibility & Polish
