DO $$
DECLARE
  stage_frontend_3_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('frontend', 'JavaScript Core', 3, 'beginner')
  RETURNING stage_id INTO stage_frontend_3_id;

  DECLARE
    topic_frontend_3_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'JavaScript Basics', '', 'lesson', 2, 'beginner', 1)
    RETURNING topic_id INTO topic_frontend_3_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_1_id, 'VIDEO', 'JavaScript Tutorial for Beginners', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_1_id, 'ARTICLE', 'JavaScript basics', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Adding_interactivity', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'JavaScript is where your pages go from static to alive. Unlike HTML and CSS which are declarative (you describe the result), JS is imperative — you write step-by-step instructions. The most important habit to build: run your code constantly and read error messages carefully. Every error message tells you exactly what went wrong and where.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_1_id, 'javascript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_3_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'Functions & Scope', '', 'lesson', 2, 'beginner', 2)
    RETURNING topic_id INTO topic_frontend_3_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_2_id, 'VIDEO', 'JavaScript Functions', 'https://www.youtube.com/watch?v=gigtS_5KOqo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_2_id, 'ARTICLE', 'Functions', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Arrow functions (`const add = (a, b) => a + b`) are the modern standard — you''ll see them everywhere in React code. They''re not just shorter syntax; they also handle `this` differently, which matters later. For now, focus on understanding when a function returns a value versus when it just runs some code (a side effect). Most bugs come from forgetting a `return`.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_2_id, 'javascript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_3_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'Arrays & Objects', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_frontend_3_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_3_id, 'VIDEO', 'JavaScript Array Methods', 'https://www.youtube.com/watch?v=R8rmfD9Y5-c', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_3_id, 'ARTICLE', 'Array methods', 'https://javascript.info/array-methods', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`map`, `filter`, and `reduce` are the three most important array methods in modern JavaScript. You will use `map` to transform lists into UI elements (especially in React), `filter` to narrow down results, and `reduce` sparingly for aggregating values. Destructuring (`const { name, price } = product`) is syntax sugar you''ll see constantly in real codebases — learn it here so it doesn''t surprise you later.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_3_id, 'javascript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_3_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'The DOM: Selecting & Manipulating Elements', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_frontend_3_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_4_id, 'VIDEO', 'JavaScript DOM Manipulation', 'https://www.youtube.com/watch?v=y17RuWkWdn8', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_4_id, 'ARTICLE', 'Manipulating documents', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The DOM (Document Object Model) is JavaScript''s representation of your HTML. When you call `document.querySelector(''.card'')`, you get back a live object that you can read and mutate — and the browser immediately updates the page to reflect the change. This is where JS becomes visual: you write code, and something on screen moves.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_4_id, 'javascript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_3_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'Events & User Interaction', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_frontend_3_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_5_id, 'VIDEO', 'JavaScript Events', 'https://www.youtube.com/watch?v=XF1_MlZ5l6M', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_5_id, 'ARTICLE', 'Introduction to events', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Events are how your JS responds to the user. `addEventListener` attaches a function to an element that fires when something happens. The key insight: always call `e.preventDefault()` on form submit events, otherwise the browser will reload the page before your JS gets to run. Event delegation (listening on a parent element rather than each child) is a performance pattern used in every real codebase — learn it here.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_5_id, 'javascript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_3_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'Async JavaScript: Promises & Fetch', '', 'lesson', 2, 'intermediate', 6)
    RETURNING topic_id INTO topic_frontend_3_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_6_id, 'VIDEO', 'Async JavaScript, Fetch & Promises', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jAhrjtZ9U93UMIhnCc44MH', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_6_id, 'ARTICLE', 'How to use Fetch API', 'https://javascript.info/fetch', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'JavaScript is single-threaded — it can only do one thing at a time. Async code solves the problem of "wait for the server to respond without freezing the entire page." `async/await` is just cleaner syntax for Promises — use it by default. The pattern is always the same: `try { const data = await fetch(url).then(r => r.json()) } catch (e) { handle error }`. Memorize this pattern. You''ll write it hundreds of times.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_6_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_6_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_3_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'Local Storage & State', '', 'lesson', 1, 'intermediate', 7)
    RETURNING topic_id INTO topic_frontend_3_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_7_id, 'VIDEO', 'JavaScript localStorage', 'https://www.youtube.com/watch?v=AUOzvFzdIk4', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_7_id, 'ARTICLE', 'Window.localStorage', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`localStorage` can only store strings, which is why you need `JSON.stringify()` before saving objects and `JSON.parse()` when reading them back. The concept of "state" — data that lives in memory and controls what the UI shows — is the most important idea in frontend development. React is built entirely around this concept. Learning it in vanilla JS first means React''s `useState` will feel natural, not mysterious.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_7_id, 'javascript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_3_8_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_3_id, 'PROJECT: Interactive Quiz App', '', 'project_milestone', 8, 'intermediate', 8)
    RETURNING topic_id INTO topic_frontend_3_8_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_8_id, 'VIDEO', 'Build a Quiz App with HTML, CSS & JavaScript', 'https://www.youtube.com/watch?v=riDzcEQbX6k', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_3_8_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is your first real JavaScript project. Before writing code, map out the state your app needs to track: current question index, score, remaining time, quiz status (idle/active/finished). Every feature follows from updating one of these values and re-rendering the UI to match. This mental model — state drives UI — is the foundation of React.', 2);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_8_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_8_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_8_id, 'responsive_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_3_id, 'PROJECT: Interactive Quiz App', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Git, Tools & Deployment
