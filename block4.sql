DO $$
DECLARE
  stage_frontend_5_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('frontend', 'React Fundamentals', 5, 'beginner')
  RETURNING stage_id INTO stage_frontend_5_id;

  DECLARE
    topic_frontend_5_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'Why React? Components & JSX', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_frontend_5_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_1_id, 'VIDEO', 'React Tutorial for Beginners', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_1_id, 'ARTICLE', 'Your first component', 'https://react.dev/learn/your-first-component', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'React''s core idea: your UI is a function of your data. Instead of manually reaching into the DOM to change things (like you did in vanilla JS), you describe what the UI should look like given the current data, and React handles the updates. Components are just functions that return JSX (which looks like HTML but is actually JavaScript). Every React app is a tree of these functions.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_1_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vite', 'Vite', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_1_id, 'vite') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_5_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'State & useState Hook', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_frontend_5_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_2_id, 'VIDEO', 'useState Hook', 'https://www.youtube.com/watch?v=O6P86uwfdR0', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_2_id, 'ARTICLE', 'State: a component''s memory', 'https://react.dev/learn/state-a-components-memory', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'State is data that, when it changes, causes the component to re-render. The rule: never mutate state directly. Always use the setter function. The most common beginner bug: calling a setter inside the render function (causes an infinite re-render loop). State updates are asynchronous — use the updater function pattern (`setCount(prev => prev + 1)`) when the new value depends on the old one.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_2_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_5_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'useEffect & Data Fetching', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_frontend_5_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_3_id, 'VIDEO', 'useEffect Hook', 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_3_id, 'ARTICLE', 'Synchronizing with Effects', 'https://react.dev/learn/synchronizing-with-effects', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`useEffect` runs after the component renders. The dependency array controls when: `[]` = run once on mount; `[value]` = run every time `value` changes; no array = run on every render (almost never what you want). The cleanup function (returned from useEffect) runs before the next effect fires — it''s used to cancel subscriptions, clear timers, or abort fetch requests.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_3_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_3_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_5_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'Lists, Keys & Conditional Rendering', '', 'lesson', 1, 'intermediate', 4)
    RETURNING topic_id INTO topic_frontend_5_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_4_id, 'VIDEO', 'Rendering Lists in React', 'https://www.youtube.com/watch?v=0sasRxl35_8', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_4_id, 'ARTICLE', 'Rendering lists', 'https://react.dev/learn/rendering-lists', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Every item in a rendered list needs a unique `key` prop. React uses keys to track which items changed, were added, or removed between renders. Never use the array index as a key for lists that can reorder or filter — it causes subtle bugs. Use a unique ID from your data. For conditional rendering: be careful with `{condition && <Component />}` when condition might be `0` — it renders the number 0, not nothing. Use a ternary or explicit boolean check.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_4_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_5_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'React Router: Multi-Page Apps', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_frontend_5_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_5_id, 'VIDEO', 'React Router v6 Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9iVKmtNuCeIswnQ97in2GGf', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_5_id, 'ARTICLE', 'React Router', 'https://reactrouter.com/en/main/start/tutorial', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'React Router is a library that simulates multiple pages in a single-page app. The browser never actually navigates to a new HTML file — React Router intercepts clicks, reads the URL, and renders the matching component. `useParams` gives you the dynamic segment from the URL (e.g. `/movie/123` → `{ id: ''123'' }`). `useNavigate` lets you redirect programmatically (e.g. after a form submit).', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_5_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_5_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'Forms & Validation in React', '', 'lesson', 2, 'intermediate', 6)
    RETURNING topic_id INTO topic_frontend_5_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_6_id, 'VIDEO', 'React Hook Form Tutorial', 'https://www.youtube.com/watch?v=R_Pj593TH_Q', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_6_id, 'ARTICLE', 'React Hook Form', 'https://react-hook-form.com/get-started', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Controlled inputs in React: every input''s value is stored in state and the input is updated via the state setter on `onChange`. This gives you full control over the form at all times. React Hook Form is a library that reduces the amount of state you need to write by managing form state internally — use it for complex multi-field forms where writing `useState` for every field becomes tedious.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_6_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_5_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'Context API & Global State', '', 'lesson', 2, 'intermediate', 7)
    RETURNING topic_id INTO topic_frontend_5_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_7_id, 'VIDEO', 'React Context & useContext', 'https://www.youtube.com/watch?v=5LrDIWkK_Bc', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_7_id, 'ARTICLE', 'Passing data deeply with context', 'https://react.dev/learn/passing-data-deeply-with-context', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Context solves prop drilling — when you need to pass data through many component levels that don''t actually use it themselves. Good use cases: theme, authenticated user, language preference, global cart. Bad use cases: state that changes frequently at high frequency (like typing input) — Context re-renders all consumers on every change. For complex global state, you''ll learn Zustand in Stage 6.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_7_id, 'react') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_5_8_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_5_id, 'PROJECT: Task Manager App', '', 'project_milestone', 10, 'intermediate', 8)
    RETURNING topic_id INTO topic_frontend_5_8_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_8_id, 'VIDEO', 'Build a Task Manager in React', 'https://www.youtube.com/watch?v=XK374-KZRDA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_5_8_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Plan your component tree before writing any code: what components exist, what state they own, what props they receive. Sketch it on paper. This is the skill that separates developers who build cleanly from those who refactor constantly. Your project structure should mirror the UI structure.', 2);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_8_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_8_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_8_id, 'responsive_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_8_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_5_id, 'PROJECT: Task Manager App', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Modern Frontend Stack
