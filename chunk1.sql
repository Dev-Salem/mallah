-- Mallah Curriculum Seed Data
DELETE FROM public.topic_skills;
DELETE FROM public.topic_resources;
DELETE FROM public.topics;
DELETE FROM public.projects;
DELETE FROM public.stages;

-- Stage: Web Foundations
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
DO $$
DECLARE
  stage_frontend_2_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('frontend', 'CSS Layouts & Styling', 2, 'beginner')
  RETURNING stage_id INTO stage_frontend_2_id;

  DECLARE
    topic_frontend_2_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_2_id, 'Flexbox', '', 'lesson', 2, 'beginner', 1)
    RETURNING topic_id INTO topic_frontend_2_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_1_id, 'VIDEO', 'Flexbox Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9i3FXJSUfmsNOx8E7u6UuhG', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_1_id, 'ARTICLE', 'Flexbox', 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Flexbox is a one-dimensional layout system — it works along a single axis (row or column). It''s perfect for navbars, card rows, centering things, and aligning items within a container. Once you understand `justify-content` (main axis) and `align-items` (cross axis), 80% of Flexbox just clicks. Bookmark the CSS-Tricks guide — it''s the most referenced CSS reference on the internet.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_1_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_1_id, 'responsive_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_2_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_2_id, 'CSS Grid', '', 'lesson', 2, 'beginner', 2)
    RETURNING topic_id INTO topic_frontend_2_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_2_id, 'VIDEO', 'CSS Grid Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9itC4TxYMzFy9Z2QualRLUU', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_2_id, 'ARTICLE', 'CSS Grid', 'https://css-tricks.com/snippets/css/complete-guide-grid/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Grid is two-dimensional — it controls both rows and columns simultaneously. Use Grid for overall page layout and complex arrangements; use Flexbox for aligning items within a single row or column. The rule of thumb: Grid for the page structure, Flexbox for the components inside it.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_2_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_2_id, 'responsive_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_2_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_2_id, 'Responsive Design & Media Queries', '', 'lesson', 2, 'beginner', 3)
    RETURNING topic_id INTO topic_frontend_2_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_3_id, 'VIDEO', 'Responsive Web Design Tutorial', 'https://www.youtube.com/watch?v=bn-DQznEZm0', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_3_id, 'ARTICLE', 'Responsive design', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Mobile-first means you write your base CSS for small screens, then use `@media (min-width: ...)` to add complexity as the screen gets larger. This is the opposite of what beginners instinctively do (design for desktop, then shrink down) — but it produces leaner, more maintainable code. Start with the smallest screen. Expand from there.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_3_id, 'responsive_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_2_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_2_id, 'Tailwind CSS', '', 'lesson', 2, 'beginner', 4)
    RETURNING topic_id INTO topic_frontend_2_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_4_id, 'VIDEO', 'Tailwind CSS Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HVjp8', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_4_id, 'ARTICLE', 'Tailwind CSS', 'https://tailwindcss.com/docs/installation', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Tailwind CSS gives you utility classes like `p-4`, `text-lg`, `flex`, and `bg-blue-500` that you apply directly in HTML. Instead of writing custom CSS, you compose styles from small, single-purpose classes. It sounds verbose at first, but it''s fast in practice — no switching files, no naming things, no specificity fights. Most companies using React also use Tailwind, which is why you''re learning it before React.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_4_id, 'tailwind_css') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_2_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_2_id, 'CSS Animations & Transitions', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_frontend_2_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_5_id, 'VIDEO', 'CSS Animations Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9iGYgmjWBuZSPRN9hFVRlYx', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_5_id, 'ARTICLE', 'Using CSS animations', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Animations are where CSS starts feeling like a superpower. The key distinction: `transition` handles changes between two states (hover on/off), while `@keyframes` defines a multi-step animation sequence (a spinner that rotates forever). Start with transitions — they''re simpler and cover 90% of UI feedback effects. Use `@keyframes` for loading states and entrance animations.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_5_id, 'css') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_2_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_2_id, 'PROJECT: Responsive Landing Page', '', 'project_milestone', 6, 'beginner', 6)
    RETURNING topic_id INTO topic_frontend_2_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_6_id, 'VIDEO', 'Build a Responsive Landing Page with Tailwind', 'https://www.youtube.com/watch?v=dFgzHOX84xQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_6_id, 'ARTICLE', 'Frontend Mentor', 'https://www.frontendmentor.io/challenges', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_2_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Don''t aim for pixel-perfect the first time. Start with the structure (HTML, sections), then apply Tailwind classes, then make it responsive. Frontend Mentor has free design files you can use as a reference if you want a real design spec to work from instead of inventing your own.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_6_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_6_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_6_id, 'responsive_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_2_id, 'PROJECT: Responsive Landing Page', '', 'beginner') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: JavaScript Core
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
DO $$
DECLARE
  stage_frontend_4_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('frontend', 'Git, Tools & Deployment', 4, 'beginner')
  RETURNING stage_id INTO stage_frontend_4_id;

  DECLARE
    topic_frontend_4_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_4_id, 'Git & GitHub Fundamentals', '', 'lesson', 2, 'beginner', 1)
    RETURNING topic_id INTO topic_frontend_4_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_1_id, 'VIDEO', 'Git & GitHub Tutorial for Beginners', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_1_id, 'ARTICLE', 'Git', 'https://rogerdudler.github.io/git-guide/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Git is the single most important tool in a developer''s workflow — more important than any framework. Every company uses it. The key mental model: your project lives in three places at once — your working directory (files you''re editing), the staging area (changes you''ve selected to commit), and the repository (committed history). `git add` moves changes to staging. `git commit` saves them to history permanently.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_1_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_1_id, 'github') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_4_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_4_id, 'GitHub Workflow: Branches & Pull Requests', '', 'lesson', 1, 'beginner', 2)
    RETURNING topic_id INTO topic_frontend_4_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_2_id, 'VIDEO', 'Git Branching & Merging', 'https://www.youtube.com/watch?v=S2TUommS3O0', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_2_id, 'ARTICLE', 'About pull requests', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The feature branch workflow is how virtually every professional team works: never commit directly to `main`. Create a branch for your feature, do your work, open a PR for review, then merge. Even working solo, this habit builds discipline. Merge conflicts are not emergencies — they''re normal. Git tells you exactly where the conflict is. Choose the version you want (or combine them), save, and commit.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_2_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_2_id, 'github') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_4_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_4_id, 'Browser DevTools Deep Dive', '', 'lesson', 2, 'beginner', 3)
    RETURNING topic_id INTO topic_frontend_4_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_3_id, 'VIDEO', 'Chrome DevTools Full Tutorial', 'https://www.youtube.com/watch?v=gTVpBbFWry8', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_3_id, 'ARTICLE', 'Chrome DevTools Overview', 'https://developer.chrome.com/docs/devtools/overview', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'DevTools is your debugging environment. You will spend a significant portion of your career in this panel. The Network tab alone is worth mastering — it shows every request your page makes, the response it gets, how long it took, and what the data looks like. When something doesn''t work, check the Console first (errors), then the Network tab (failed requests). Most problems announce themselves loudly here.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('chrome_devtools', 'Chrome DevTools', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_3_id, 'chrome_devtools') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_4_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_4_id, 'Deployment: Vercel, Netlify & GitHub Pages', '', 'lesson', 1, 'beginner', 4)
    RETURNING topic_id INTO topic_frontend_4_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_4_id, 'VIDEO', 'Deploy a Website with Netlify & Vercel', 'https://www.youtube.com/watch?v=HCDCrjQsEhg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_4_id, 'ARTICLE', 'Get started with Vercel', 'https://vercel.com/docs/getting-started-with-vercel', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Shipping code that real people can visit is a milestone. GitHub Pages is the simplest option for static HTML/CSS/JS. Vercel and Netlify are more powerful — they support build processes (for when you use React or Next.js later) and can automatically redeploy whenever you push to GitHub. Connect your repo once, and every `git push` goes live in seconds.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vercel', 'Vercel', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_4_id, 'vercel') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('netlify', 'Netlify', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_4_id, 'netlify') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_4_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_4_id, 'PROJECT: Live Portfolio Site v1', '', 'project_milestone', 6, 'intermediate', 5)
    RETURNING topic_id INTO topic_frontend_4_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_5_id, 'VIDEO', 'Build a Portfolio Website', 'https://www.youtube.com/watch?v=xV7S8BhIeBo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_5_id, 'ARTICLE', 'Formspree', 'https://formspree.io/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_4_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your portfolio is the most important project you''ll build on Mallah. Every future project you complete gets added here. A clean, live portfolio with 3+ working projects is worth more than any certificate. Prioritize: everything loads and works on mobile, every link is real, it looks like you care about quality.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'github') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vercel', 'Vercel', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'vercel') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'responsive_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'html') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_4_id, 'PROJECT: Live Portfolio Site v1', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: React Fundamentals
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
DO $$
DECLARE
  stage_frontend_7_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('frontend', 'Performance, Accessibility & Polish', 7, 'beginner')
  RETURNING stage_id INTO stage_frontend_7_id;

  DECLARE
    topic_frontend_7_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_7_id, 'Web Performance Fundamentals', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_frontend_7_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_1_id, 'VIDEO', 'Web Performance Fundamentals', 'https://www.youtube.com/watch?v=0fONene3OIA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_1_id, 'ARTICLE', 'Web Vitals', 'https://web.dev/articles/vitals', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The three Core Web Vitals Google measures: LCP (Largest Contentful Paint) — how fast the main content loads; CLS (Cumulative Layout Shift) — how much the page jumps around while loading; INP (Interaction to Next Paint) — how fast the page responds to clicks. These metrics directly affect your Google search ranking. `next/image` automatically handles lazy loading, resizing, and modern formats — always use it instead of a raw img tag in Next.js.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_performance', 'Web Performance', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_1_id, 'web_performance') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_7_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_7_id, 'Web Accessibility (a11y)', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_frontend_7_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_2_id, 'VIDEO', 'Web Accessibility Tutorial', 'https://www.youtube.com/watch?v=e2nkq3h1lcw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_2_id, 'ARTICLE', 'Accessibility', 'https://developer.mozilla.org/en-US/docs/Web/Accessibility', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Accessibility is not optional. In many countries (US, EU, UK), inaccessible websites are a legal liability. More importantly: 15% of the global population has a disability. ARIA attributes (aria-label, aria-describedby, role) fill in the semantic gaps where HTML tags don''t communicate enough. The fastest audit tool: the axe DevTools Chrome extension. Install it. Run it on every project before you call it done.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_accessibility', 'Web Accessibility', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_2_id, 'web_accessibility') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_7_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_7_id, 'SEO for Frontend Developers', '', 'lesson', 1, 'beginner', 3)
    RETURNING topic_id INTO topic_frontend_7_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_3_id, 'VIDEO', 'SEO for Developers', 'https://www.youtube.com/watch?v=-B58GgsehKQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_3_id, 'ARTICLE', 'Optimizing: Metadata', 'https://nextjs.org/docs/app/building-your-application/optimizing/metadata', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In Next.js App Router, metadata is exported from page files as a `metadata` object or a `generateMetadata` async function for dynamic pages. Open Graph tags control how your page looks when shared on LinkedIn, Twitter, Slack, and iMessage — the title, description, and image shown in the preview card. A site with good OG metadata looks professional when shared; without it, the preview is blank or broken.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seo', 'SEO', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_3_id, 'seo') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_7_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_7_id, 'Testing Basics: Vitest & React Testing Library', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_frontend_7_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_4_id, 'VIDEO', 'React Testing Library Tutorial', 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gm4_-5UsNmLqMosM-dzuvQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_4_id, 'ARTICLE', 'React Testing Library', 'https://testing-library.com/docs/react-testing-library/intro/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The guiding principle of React Testing Library: test what the user sees and does, not implementation details. Query elements by their accessible role (`getByRole(''button'', { name: ''Add Task'' })`), not by class name or internal state. This makes your tests resilient to refactoring — if you rename a CSS class but the button still says "Add Task" and still works, the test still passes.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('frontend_testing', 'Frontend Testing', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_4_id, 'frontend_testing') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_frontend_7_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_frontend_7_id, 'PROJECT: Final Portfolio (Polished)', '', 'project_milestone', 10, 'advanced', 5)
    RETURNING topic_id INTO topic_frontend_7_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_5_id, 'VIDEO', 'Build a Developer Portfolio with Next.js 14', 'https://www.youtube.com/watch?v=6ar3QefEtO8', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_5_id, 'ARTICLE', 'View Transitions API', 'https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_frontend_7_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This portfolio is your graduation project. It doesn''t just showcase your work — it IS a piece of your work. Treat it with the same care you''d give a client project: clean code, meaningful commit history, no broken links, no placeholder text. This is what an employer opens before they decide whether to contact you.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_performance', 'Web Performance', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'web_performance') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_accessibility', 'Web Accessibility', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'web_accessibility') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seo', 'SEO', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'seo') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_7_id, 'PROJECT: Final Portfolio (Polished)', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;
