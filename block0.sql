DO $$
DECLARE
  stage_frontend_1_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('frontend', 'Web Foundations', 1, 'beginner')
  RETURNING stage_id INTO stage_frontend_1_id;

  DECLARE
    topic_frontend_1_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_1_id, 'How the Web Works', '', 'concept', 45, 'beginner', 1)
    RETURNING topic_id INTO topic_frontend_1_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_1_id, 'VIDEO', 'How The Web Works', 'https://www.youtube.com/watch?v=hJHvdBlSxug', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_1_id, 'ARTICLE', 'How the Web works', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Before writing a single line of code, it helps to understand what the browser actually does. When you visit a website, your browser sends a request to a server, the server responds with HTML/CSS/JS files, and the browser renders them into the page you see. Understanding this cycle will make every frontend concept you learn feel purposeful — not magic.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_fundamentals', 'Web fundamentals', 'fundamentals') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_1_id, 'web_fundamentals') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('http_basics', 'HTTP basics', 'fundamentals') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_1_id, 'http_basics') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_1_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_1_id, 'HTML Structure & Semantics', '', 'lesson', 2, 'beginner', 2)
    RETURNING topic_id INTO topic_frontend_1_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_2_id, 'VIDEO', 'HTML Tutorial for Beginners (full playlist)', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9ibZ2TSBaGGNrgh4ZgYE6Cc', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_2_id, 'ARTICLE', 'HTML basics', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Semantic HTML means using the right tag for the right job — `<nav>` for navigation, `<article>` for standalone content, `<footer>` for page footer. Search engines and screen readers use these tags to understand your page. Using `<div>` for everything is the most common beginner mistake — this topic is about breaking that habit from day one.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_2_id, 'html') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_1_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_1_id, 'HTML Forms & Tables', '', 'lesson', 1, 'beginner', 3)
    RETURNING topic_id INTO topic_frontend_1_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_3_id, 'VIDEO', 'HTML Forms Tutorial', 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_3_id, 'ARTICLE', 'HTML forms', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Forms are how users communicate with your app — login, signup, search, contact. Getting forms right in pure HTML (proper labels, correct input types, accessible structure) is the foundation for everything that comes later, including form handling in React.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_3_id, 'html') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_1_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_1_id, 'Intro to CSS: Selectors, Colors & Typography', '', 'lesson', 2, 'beginner', 4)
    RETURNING topic_id INTO topic_frontend_1_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_4_id, 'VIDEO', 'CSS Tutorial for Beginners (full playlist)', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_4_id, 'ARTICLE', 'CSS first steps', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'CSS can feel overwhelming at first because there are hundreds of properties. Don''t try to memorize them. Focus on understanding the system: how selectors target elements, how the cascade determines which rule wins, and how properties like `color`, `font-size`, and `margin` work. Everything else is just more properties following the same rules.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_4_id, 'css') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_1_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_1_id, 'The Box Model', '', 'lesson', 1, 'beginner', 5)
    RETURNING topic_id INTO topic_frontend_1_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_5_id, 'VIDEO', 'CSS Box Model', 'https://www.youtube.com/watch?v=rIO5326FgPE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_5_id, 'ARTICLE', 'The box model', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Every element on a page is a box. The box model defines how that box is sized: the content area, then padding (space inside), then border, then margin (space outside). The most important setting to know: `box-sizing: border-box` — it makes width include padding and border, which matches how designers think about sizing. Set it globally on every project.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_5_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('chrome_devtools', 'Chrome DevTools', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_5_id, 'chrome_devtools') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_1_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_1_id, 'CSS Positioning & Display', '', 'lesson', 2, 'beginner', 6)
    RETURNING topic_id INTO topic_frontend_1_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_6_id, 'VIDEO', 'CSS Positioning Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9hudKGi5o5UiWuTAFL-guem', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_6_id, 'ARTICLE', 'CSS layout', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Positioning', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Positioning is one of the trickiest parts of CSS because `absolute` elements are positioned relative to their nearest `relative` ancestor — not the viewport, not the page. The most common bug: forgetting to set `position: relative` on the parent. This topic will click once you build the layered hero section yourself.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_6_id, 'css') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_1_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_1_id, 'PROJECT: Personal Profile Page', '', 'project_milestone', 4, 'beginner', 7)
    RETURNING topic_id INTO topic_frontend_1_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_7_id, 'VIDEO', 'Build a Profile Page with HTML & CSS', 'https://www.youtube.com/watch?v=yn6sV3aVWYQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_7_id, 'ARTICLE', 'Getting started with GitHub Pages', 'https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_1_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is your first portfolio piece. It doesn''t need to be perfect — it needs to be real. Focus on clean markup, readable styling, and getting it live. Employers have seen thousands of fancy CSS clones; they respect developers who ship.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_7_id, 'html') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_7_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('chrome_devtools', 'Chrome DevTools', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_7_id, 'chrome_devtools') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_1_id, 'PROJECT: Personal Profile Page', '', 'beginner') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: CSS Layouts & Styling
