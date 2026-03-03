-- Mallah Curriculum Seed Data
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_fundamentals', 'Web fundamentals', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_1_id, 'web_fundamentals') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('http_basics', 'HTTP basics', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_5_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('chrome_devtools', 'Chrome DevTools', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_7_id, 'html') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_1_7_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('chrome_devtools', 'Chrome DevTools', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_1_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_2_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_6_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_2_6_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_6_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_8_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_3_8_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_1_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_2_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('chrome_devtools', 'Chrome DevTools', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vercel', 'Vercel', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_4_id, 'vercel') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('netlify', 'Netlify', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'github') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vercel', 'Vercel', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'vercel') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'responsive_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_4_5_id, 'html') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_1_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vite', 'Vite', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_3_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_8_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_8_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_5_8_id, 'responsive_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_3_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_6_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_6_7_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_performance', 'Web Performance', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_accessibility', 'Web Accessibility', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seo', 'SEO', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('frontend_testing', 'Frontend Testing', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_performance', 'Web Performance', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'web_performance') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_accessibility', 'Web Accessibility', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'web_accessibility') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seo', 'SEO', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'seo') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_frontend_7_5_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_frontend_7_id, 'PROJECT: Final Portfolio (Polished)', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Web Foundations + JavaScript
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_fundamentals', 'Web fundamentals', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_1_id, 'web_fundamentals') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('http_basics', 'HTTP basics', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_1_id, 'http_basics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_1_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_3_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_3_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('responsive_design', 'Responsive Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_5_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_6_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github', 'GitHub', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('html', 'HTML', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'html') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('css', 'CSS', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('javascript', 'JavaScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'javascript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('git', 'Git', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_1_7_id, 'git') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vercel', 'Vercel', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_2_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'React''s mental model: UI is a function of data. Instead of imperatively manipulating the DOM (`document.querySelector(''.card'').textContent = ''new''`), you declare what the UI should look like given some data, and React handles the DOM updates. This is the shift from imperative to declarative programming — and it''s the biggest conceptual jump in this path.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_1_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('vite', 'Vite', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_2_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('tailwind_css', 'Tailwind CSS', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_2_7_id, 'tailwind_css') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_3_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Node.js is JavaScript running outside the browser — on a server, a machine, or the command line. It uses the same language you already know, but with access to the file system, network sockets, and system resources. The key concept: Node is single-threaded but non-blocking. It handles thousands of concurrent connections by delegating I/O to the operating system and continuing to run other code while waiting. This is why Node.js powers high-traffic APIs at Netflix, LinkedIn, and Uber.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_3_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Express is minimal by design — it gives you routing and middleware, nothing else. Every other feature (database access, authentication, validation, logging) you add yourself or via npm packages. This makes it flexible but requires you to make decisions. Middleware is the key concept: a middleware function runs between receiving a request and sending a response. Authentication, logging, body parsing, error handling — all of these are middleware functions that run in sequence.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_3_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'REST is a set of conventions, not a strict protocol. The most important ones: use nouns in URLs (not verbs) — `/users`, not `/getUsers`. Use HTTP methods for the action — `GET /users` lists, `POST /users` creates, `PUT /users/1` updates, `DELETE /users/1` deletes. Always return consistent JSON structure. Always use correct status codes — a `200` response with `{ error: ''not found'' }` is worse than a `404`. Your frontend code depends on these contracts being reliable.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_3_id, 'rest_api_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_3_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Never trust data from the client. Ever. A user can send any JSON they want to your API — wrong types, missing fields, SQL injection strings, excessively long strings. Zod lets you define the exact shape of valid input and throws a structured error when anything doesn''t match. The global error handler catches those errors and sends a `400` response before the bad data reaches your database. This is your first line of defence in backend security.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_4_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_3_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'TypeScript on the backend gives you the same benefits as on the frontend — type safety, autocomplete, refactoring confidence — but the Node.js setup is slightly different. You need `ts-node` (or `tsx`) to run `.ts` files directly, and a `tsconfig.json` configured for Node (not the browser). The biggest win of full-stack TypeScript: define your types once in a shared package or file and import them in both your frontend and backend. When your API changes shape, TypeScript tells you everywhere that breaks.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_5_id, 'typescript') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_3_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Environment variables are how you configure an application without hardcoding secrets. Database URL, JWT secret, API keys, port number — all of these change between environments (your laptop vs a production server). Never commit a `.env` file. Validate env vars on startup so the app fails fast with a clear error rather than crashing later on first use. A common pattern: use Zod to parse and validate `process.env` into a typed config object.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_3_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This server has no database yet — all data lives in memory and disappears when the server restarts. That''s intentional. Building the API logic first, without database complexity, forces you to focus on route design, validation, and error handling. In Stage 4 you swap the in-memory arrays for real database calls — the route handlers barely change.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_7_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_7_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_3_7_id, 'rest_api_design') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_4_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'SQL is the most durable skill in this entire path. JavaScript frameworks come and go, but SQL has been the standard for relational databases since the 1970s and remains dominant today. Every company with real data uses SQL. Understanding joins is the critical skill — a `LEFT JOIN` between users and their posts, including users with no posts, is the kind of query you''ll write every day in production.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_1_id, 'sql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_4_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Prisma replaces raw SQL in your Node.js code with a type-safe API. Instead of writing `SELECT * FROM users WHERE id = $1`, you write `prisma.user.findUnique({ where: { id } })`. Prisma generates TypeScript types directly from your schema — so if you query a `User`, you get autocomplete for every field. Migrations track schema changes over time, like Git for your database — critical for teams and production deployments.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_2_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_4_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This is a pivotal moment: your API now persists data. The route handlers barely changed — you replaced `array.push(item)` with `await prisma.post.create({ data: item })`. This is the power of a clean API layer between your routes and your data source. The route doesn''t care whether data comes from an array, a database, or a cache — it just calls a function and gets data back.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_3_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_4_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Real-world data is relational. A post has an author, comments, and tags. Getting a post with its author name and comment count in a single query is standard in production. Without proper relation handling, you''d make 3 separate queries for what Prisma does in one. Understanding when to use `include` (eager load — get everything now) vs separate queries (lazy load — fetch only when needed) is a performance decision you''ll make constantly.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_4_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_4_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Seed scripts are your database''s "factory reset" — they populate a fresh database with enough realistic data to develop and test against. Without seeds, every new dev on your team has to manually create test data. Migrations track every schema change in version control. The rule: `prisma migrate dev` creates migrations and applies them in development; `prisma migrate deploy` applies pre-created migrations in production — never generate new migrations in prod.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_5_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_4_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Railway and Render both offer free PostgreSQL databases — they''re the fastest way to get a real hosted database without touching AWS. The production URL will look like `postgresql://user:pass@host:port/dbname`. Store it in your Railway environment variables, never in code. This is your first live backend API — share the URL with someone and have them make real requests.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'postgresql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'sql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_4_6_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_5_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Passwords must never be stored in plain text. Even in encrypted form. The reason: if your database is breached, you want an attacker to have useless hashes rather than real passwords. Bcrypt is a one-way hashing function with a configurable work factor — as computers get faster, you increase the work factor to keep brute-forcing expensive. 10 salt rounds is the minimum for new projects in 2026; 12 is better for sensitive applications.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_1_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_2_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_5_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_5_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_5_5_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_6_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks your frontend from calling an API on a different domain by default. Your backend must explicitly allow requests from your frontend''s domain. In development: `cors({ origin: ''http://localhost:3000'' })`. In production: `cors({ origin: process.env.FRONTEND_URL })`. Never use `cors({ origin: ''*'' })` on an API that has authentication — it defeats the purpose.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_1_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_2_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_3_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('websockets', 'WebSockets', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_4_id, 'websockets') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_5_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('react', 'React', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'react') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('next_js', 'Next.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'next_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('express_js', 'Express.js', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'express_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'prisma') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'postgresql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('authentication', 'Authentication', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_6_6_id, 'authentication') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_design', 'REST API design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_7_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Docker solves the "works on my machine" problem by packaging your app and all its dependencies into a container — a self-contained, reproducible environment. A new developer can clone your repo, run `docker compose up`, and have a fully working app in minutes with no manual setup. Docker is standard in every company that deploys backend services. Understanding it is non-negotiable for full-stack developers in 2026.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('docker', 'Docker', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_7_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'CI/CD (Continuous Integration / Continuous Deployment) means every code change automatically goes through a quality gate (tests, type checking, linting) before it can be merged. This prevents "it works on my machine" from becoming "it''s broken in production." GitHub Actions is free for public repos and generous for private ones. A good CI pipeline is one of the biggest professional signals in a portfolio project — it shows you think about code quality, not just shipping.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github_actions', 'GitHub Actions', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_2_id, 'github_actions') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('ci_cd', 'CI/CD', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_7_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In production, you can''t add `console.log` and refresh. You need structured logs that are queryable — fields like `{ timestamp, level, method, path, statusCode, duration, userId }`. Sentry captures exceptions with full stack traces and context, sends you an alert when something breaks, and shows you exactly which users were affected. A `GET /health` endpoint lets load balancers, uptime monitors, and automated deployment systems check if your app is alive and connected to its database.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_3_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('ci_cd', 'CI/CD', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_7_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The N+1 problem is the most common performance mistake in ORM-heavy backends: you fetch 20 posts (1 query), then for each post you fetch the author (20 queries) = 21 total queries for what should be 1. Prisma''s `include` solves this with a single JOIN. Database indexes are the next biggest win: without an index on `posts.authorId`, every query that filters by author scans the entire table. Adding the index makes it O(log n). These two fixes alone can make an API 10–100x faster.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_4_id, 'postgresql') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('prisma', 'Prisma', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_7_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '"Production-ready" is a mindset, not a checklist. It means: when something breaks (and it will), you know about it immediately (Sentry + logging). When you deploy (and you will), the process is automatic and repeatable (CI/CD). When traffic grows (and it might), your queries are efficient (indexes, no N+1). A portfolio project with Docker, CI/CD, and monitoring is a rare and impressive signal to employers — it shows you think like an engineer, not just a coder.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('docker', 'Docker', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'docker') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('github_actions', 'GitHub Actions', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'github_actions') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('ci_cd', 'CI/CD', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'ci_cd') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_7_5_id, 'node_js') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('postgresql', 'PostgreSQL', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_8_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Integration tests test your API end-to-end — they make real HTTP requests to a real Express server connected to a real (test) database. Unlike unit tests, they catch bugs that span multiple layers. The key: always use a separate test database, never your dev or production database. Run `prisma migrate dev` against the test DB in CI setup. A passing test suite is a deployability signal — if tests pass, it''s safe to deploy.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('backend_testing', 'Backend Testing', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
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
    VALUES (topic_fullstack_8_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Generics are TypeScript''s way of writing code that works with multiple types while still being type-safe — like a typed function parameter for types. `ApiResponse<User>` is a response that wraps a User; `ApiResponse<Post[]>` wraps a list of Posts. The same generic handles both. Utility types like `Omit<User, ''password''>` are how you create "safe" versions of types that exclude sensitive fields — a pattern used in nearly every production API.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('typescript', 'TypeScript', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_2_id, 'typescript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Rate Limiting, Security Headers & OWASP Basics', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_8_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'VIDEO', 'Express Security Best Practices', 'https://www.youtube.com/watch?v=igehB5dPidI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'ARTICLE', 'OWASP Top 10', 'https://owasp.org/www-project-top-ten/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Security is not a feature you add at the end — it''s a practice you maintain throughout. `helmet` adds dozens of security headers in one line. Rate limiting on auth routes prevents brute-force attacks. Input sanitisation prevents XSS. The OWASP Top 10 is the industry standard list of the most critical security risks — every developer should read it at least once. These mitigations aren''t optional for anything real users will use.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_security', 'Web Security', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_3_id, 'web_security') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Emails, Background Jobs & Queues', '', 'lesson', 2, 'advanced', 4)
    RETURNING topic_id INTO topic_fullstack_8_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'VIDEO', 'Send Emails with Resend & Node.js', 'https://www.youtube.com/watch?v=P3MlSFJWMqo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'ARTICLE', 'Resend Node.js SDK', 'https://resend.com/docs/send-with-nodejs', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Email verification protects your database from fake accounts and ensures you can reach users. Resend is the cleanest transactional email API for developers — the free tier sends 3,000 emails/month. The email verification token should be a random string (not a JWT) stored hashed in the database with an expiry timestamp. Never send the token in plain text in a URL and store it plain — always hash it, just like passwords.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_4_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Capstone Planning & Architecture', '', 'lesson', 2, 'advanced', 5)
    RETURNING topic_id INTO topic_fullstack_8_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'VIDEO', 'How to Plan a Full-Stack Project', 'https://www.youtube.com/watch?v=0pThnRneDjw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'ARTICLE', 'Writing a Technical Spec', 'https://basecamp.com/shapeup/1.5-chapter-06', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Professional developers don''t open their code editor first — they think first. A technical spec forces you to make decisions on paper (cheap) rather than in code (expensive to change). Your ERD will expose missing relations. Your API list will reveal inconsistencies. Your component tree will catch missing pages. Spending 2 hours planning saves 20 hours of refactoring.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('system_design', 'System Design', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_5_id, 'system_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'PROJECT: Capstone Full-Stack Product', '', 'project_capstone', 30, 'advanced', 6)
    RETURNING topic_id INTO topic_fullstack_8_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_6_id, 'ARTICLE', 'Readme Driven Development', 'https://tom.preston-werner.com/2010/08/23/readme-driven-development.html', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your capstone is what employers will actually look at. Not your certificates, not your course completion, not your freeCodeCamp badge. When a hiring manager Googles your name, this project should come up. Make it something you''re proud to demo in a 30-minute interview. The README should be so good that a developer you''ve never met could clone it, run it, and understand exactly what it does and why every decision was made.', 2);
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_8_id, 'PROJECT: Capstone Full-Stack Product', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Python for Data Science
DO $$
DECLARE
  stage_datascience_1_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Python for Data Science', 1, 'beginner')
  RETURNING stage_id INTO stage_datascience_1_id;

  DECLARE
    topic_datascience_1_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_1_id, 'Python Basics & the Data Science Environment', '', 'lesson', 2, 'beginner', 1)
    RETURNING topic_id INTO topic_datascience_1_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_1_id, 'VIDEO', 'Python for Beginners', 'https://www.youtube.com/watch?v=rfscVS0vtbw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_1_id, 'ARTICLE', 'Jupyter Notebook Tutorial', 'https://www.datacamp.com/tutorial/tutorial-jupyter-notebook', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Data science Python is different from web developer Python. You''ll spend less time on classes and design patterns, and more time on list comprehensions, lambda functions, and working with data structures that mirror tables. Jupyter Notebooks are the default environment because they let you run one cell at a time, see output immediately, and embed charts alongside code — perfect for exploratory work where you don''t yet know what the data will reveal.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_1_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('jupyter', 'Jupyter', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_1_id, 'jupyter') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_1_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_1_id, 'NumPy: The Foundation of Numerical Python', '', 'lesson', 2, 'beginner', 2)
    RETURNING topic_id INTO topic_datascience_1_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_2_id, 'VIDEO', 'NumPy Crash Course', 'https://www.youtube.com/watch?v=QUT1VHiLmmI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_2_id, 'ARTICLE', 'NumPy Quickstart', 'https://numpy.org/doc/stable/user/quickstart.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'NumPy is the engine beneath almost all data science in Python. Pandas DataFrames are built on NumPy arrays. Scikit-learn models take NumPy arrays as input. When you understand NumPy''s vectorised operations — doing math on entire arrays without loops — you understand why Python can process millions of rows quickly. The key concept is broadcasting: applying an operation across arrays of different shapes without writing loops. Internalize it now and everything downstream becomes clearer.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_2_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('numpy', 'NumPy', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_2_id, 'numpy') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_1_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_1_id, 'Pandas Part 1: Loading, Inspecting & Selecting Data', '', 'lesson', 2, 'beginner', 3)
    RETURNING topic_id INTO topic_datascience_1_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_3_id, 'VIDEO', 'Pandas for Beginners', 'https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_3_id, 'ARTICLE', 'Pandas Getting Started', 'https://pandas.pydata.org/docs/getting_started/intro_tutorials/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Pandas is to data science what SQL is to databases — it''s the primary tool for selecting, slicing, and filtering tabular data. Most of your data science life will be spent in Pandas DataFrames. The crucial distinction: `.loc` selects by label (column name, index label), `.iloc` selects by integer position. Getting this wrong causes subtle bugs. Boolean indexing (`df[df[''age''] > 30]`) is the most frequently used pattern in EDA — learn it until it''s automatic.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_3_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_1_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_1_id, 'Pandas Part 2: Transforming, Grouping & Aggregating', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_datascience_1_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_4_id, 'VIDEO', 'Pandas GroupBy', 'https://www.youtube.com/watch?v=txMdrV1Ut64', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_4_id, 'ARTICLE', 'Pandas groupby', 'https://pandas.pydata.org/docs/user_guide/groupby.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`groupby` is the Pandas equivalent of SQL''s `GROUP BY` — it splits a DataFrame into groups and applies an aggregation function to each. The pattern `df.groupby(''column'')[''metric''].agg([''mean'', ''count''])` covers 80% of real-world grouping tasks. Missing value handling is the most common first task on any real dataset — real data always has holes. Understanding *why* data is missing (random vs systematic) affects what you do with it. Imputing with median per subgroup (like `Pclass`) is smarter than imputing with the global median because it preserves group-level patterns.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_4_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_1_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_1_id, 'Python for Data Science: Functions, Comprehensions & OOP Basics', '', 'lesson', 1, 'beginner', 5)
    RETURNING topic_id INTO topic_datascience_1_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_5_id, 'VIDEO', 'Python Functions & Comprehensions', 'https://www.youtube.com/watch?v=9Os0o3wzS_I', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_5_id, 'ARTICLE', 'Python Type Hints', 'https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Data science code that lives only in notebooks is hard to reuse and impossible to test. Wrapping your logic in functions lets you call the same cleaning process on multiple datasets, write unit tests, and share code across projects. The Scikit-learn API is built entirely on OOP — every model is a class with `.fit()` and `.predict()` methods. Understanding that pattern (even without deep OOP knowledge) makes Scikit-learn feel logical rather than magical.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_5_id, 'python') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_1_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_1_id, 'Working with Files, APIs & Data Sources', '', 'lesson', 1, 'beginner', 6)
    RETURNING topic_id INTO topic_datascience_1_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_6_id, 'VIDEO', 'Python Requests & APIs', 'https://www.youtube.com/watch?v=tb8gHvYlCFs', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_6_id, 'ARTICLE', 'Pandas read_csv docs', 'https://pandas.pydata.org/docs/reference/api/pandas.read_csv.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Real data science starts with data acquisition. In the real world, data doesn''t arrive as a clean CSV waiting for you — you fetch it from APIs, scrape it from websites, query it from databases, or receive it as a messy Excel file with merged cells and hidden rows. Building fluency with data sourcing before modelling means you can work on real problems, not just tutorial datasets.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_6_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_6_id, 'rest_api_consumption') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_1_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_1_id, 'PROJECT: Data Exploration Script', '', 'project_milestone', 5, 'beginner', 7)
    RETURNING topic_id INTO topic_datascience_1_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_7_id, 'VIDEO', 'Building a Data Analysis Script', 'https://www.youtube.com/watch?v=r-uOLxNrNk8', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_7_id, 'ARTICLE', 'Pandas profiling', 'https://docs.profiling.ydata.ai/latest/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_1_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The goal of this project isn''t the output — it''s the habit. Data scientists who write reproducible, reusable code from the start build better projects faster. Your exploration script should be something you actually use on every future project in this path. Add to it as you learn new techniques. By Stage 8, it should feel like your personal toolkit.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('numpy', 'NumPy', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'numpy') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('jupyter', 'Jupyter', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'jupyter') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_1_id, 'PROJECT: Data Exploration Script', '', 'beginner') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Data Wrangling & SQL
DO $$
DECLARE
  stage_datascience_2_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Data Wrangling & SQL', 2, 'beginner')
  RETURNING stage_id INTO stage_datascience_2_id;

  DECLARE
    topic_datascience_2_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_2_id, 'Data Cleaning: Missing Values, Duplicates & Outliers', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_datascience_2_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_1_id, 'VIDEO', 'Data Cleaning with Pandas', 'https://www.youtube.com/watch?v=iYie42M1ZyU', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_1_id, 'ARTICLE', 'Handling missing data', 'https://pandas.pydata.org/docs/user_guide/missing_data.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Data scientists spend 60–80% of project time cleaning data — not building models. The critical skill isn''t knowing which function to call; it''s developing the judgment to ask: why is this data missing? A column with 40% missing values in a medical dataset might be missing *because* the test wasn''t done for healthy patients — and deleting those rows would introduce bias. Clean data first, model second. Always.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_1_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_1_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_2_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_2_id, 'Data Reshaping & Merging', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_datascience_2_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_2_id, 'VIDEO', 'Pandas Merge, Join & Concatenate', 'https://www.youtube.com/watch?v=h4hOPGo4UVU', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_2_id, 'ARTICLE', 'Pandas merging', 'https://pandas.pydata.org/docs/user_guide/merging.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Merging datasets is one of the most powerful data wrangling operations — and one of the most error-prone. The most common mistake: not checking for duplicate keys before merging, which causes row explosion (a 100-row DataFrame merged with a 100-row DataFrame becomes 10,000 rows if keys aren''t unique). Always check with `df.duplicated(subset=[''key'']).sum()` before a merge. Pivot tables are SQL''s `GROUP BY` with a visual pivot — once you internalise them, a whole category of "how many X per Y?" questions become one-liners.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_2_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_2_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_2_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_2_id, 'Time Series Data with Pandas', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_2_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_3_id, 'VIDEO', 'Time Series Analysis with Pandas', 'https://www.youtube.com/watch?v=e8Yw4alG16Q', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_3_id, 'ARTICLE', 'Pandas time series', 'https://pandas.pydata.org/docs/user_guide/timeseries.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Time series data is everywhere: stock prices, website traffic, sensor readings, sales figures. The critical concept is resampling — aggregating fine-grained data (hourly readings) into coarser units (daily averages) without losing temporal ordering. Rolling averages are the most used smoothing technique — they reduce noise so you can see underlying trends. In job interviews, time series questions are extremely common. Start thinking in these temporal patterns early.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_3_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_3_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_2_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_2_id, 'SQL for Data Scientists', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_datascience_2_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_4_id, 'VIDEO', 'SQL for Data Analysis', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_4_id, 'ARTICLE', 'SQLite Python Tutorial', 'https://www.sqlite.org/lang.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'SQL is the most commonly tested skill in data science interviews — not Python, not machine learning. Every data scientist needs to query databases to get the data they''ll later analyse. Window functions (ROW_NUMBER, RANK, LAG) are what separate intermediate from advanced SQL users — they let you compute running totals, rank within groups, and compare rows to previous/next rows without self-joins. Learn them now; they appear in almost every SQL interview.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_4_id, 'sql') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_2_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_2_id, 'Advanced Pandas: Performance & Best Practices', '', 'lesson', 1, 'intermediate', 5)
    RETURNING topic_id INTO topic_datascience_2_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_5_id, 'VIDEO', 'Pandas Performance Tips', 'https://www.youtube.com/watch?v=SAFmrTnEHLg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_5_id, 'ARTICLE', 'Enhancing performance', 'https://pandas.pydata.org/docs/user_guide/enhancingperf.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`.apply()` with a lambda is the most common performance trap in data science code. It runs Python in a loop under the hood — on 1M rows, it''s 10–100x slower than vectorised Pandas operations. The rule: if a vectorised Pandas or NumPy function exists for your operation, use it. If it doesn''t, `.apply()` is acceptable for small datasets but should be refactored for large ones. Method chaining (`df.pipe(clean).pipe(engineer).pipe(validate)`) makes data pipelines readable and auditable — each step is a named, testable function.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_5_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_5_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_2_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_2_id, 'PROJECT: Messy Data → Clean Insights', '', 'project_milestone', 8, 'intermediate', 6)
    RETURNING topic_id INTO topic_datascience_2_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_6_id, 'ARTICLE', 'Kaggle Datasets', 'https://www.kaggle.com/datasets', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_6_id, 'ARTICLE', 'data.gov', 'https://data.gov/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Choosing your own dataset for this project is intentional. The discipline of finding, loading, and auditing a completely unknown dataset — with no instructions — is the core skill of a data scientist. The dataset you choose should be something you''re genuinely curious about. Curiosity produces better analysis. When your questions are real, your investigation is thorough.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'sql') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_2_id, 'PROJECT: Messy Data → Clean Insights', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Exploratory Data Analysis & Visualisation
DO $$
DECLARE
  stage_datascience_3_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Exploratory Data Analysis & Visualisation', 3, 'beginner')
  RETURNING stage_id INTO stage_datascience_3_id;

  DECLARE
    topic_datascience_3_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Matplotlib: The Foundation of Python Visualisation', '', 'lesson', 2, 'beginner', 1)
    RETURNING topic_id INTO topic_datascience_3_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_1_id, 'VIDEO', 'Matplotlib Tutorial', 'https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_1_id, 'ARTICLE', 'Matplotlib Tutorials', 'https://matplotlib.org/stable/tutorials/index.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Matplotlib gives you complete control over every pixel in a chart — but that power comes with verbosity. The object-oriented API (`fig, ax = plt.subplots()`, then `ax.plot(...)`) is the professional way to use Matplotlib — it''s explicit and composable, unlike the implicit `plt.plot()` style that confuses beginners. Learn the OO API now; it also makes Seaborn and Pandas plotting understandable because they wrap it.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('matplotlib', 'Matplotlib', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_1_id, 'matplotlib') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Seaborn: Statistical Visualisation', '', 'lesson', 1, 'beginner', 2)
    RETURNING topic_id INTO topic_datascience_3_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_2_id, 'VIDEO', 'Seaborn Tutorial', 'https://www.youtube.com/watch?v=6GUZXDef2U0', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_2_id, 'ARTICLE', 'Seaborn Tutorial', 'https://seaborn.pydata.org/tutorial.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Seaborn is built for exploratory data analysis — it adds statistical context to visuals automatically. A `boxplot` doesn''t just show distribution shape; it marks the median, quartiles, and outliers in one chart. A `regplot` adds a regression line with confidence interval. The `hue` parameter lets you split any chart by a categorical variable to spot group-level patterns instantly. Think of Seaborn as Matplotlib with statistical intelligence baked in.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seaborn', 'Seaborn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_2_id, 'seaborn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Plotly: Interactive Visualisation', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_3_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_3_id, 'VIDEO', 'Plotly Express Tutorial', 'https://www.youtube.com/watch?v=_b2KXL0wHQg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_3_id, 'ARTICLE', 'Plotly Python', 'https://plotly.com/python/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Static charts belong in PDFs and academic papers. Interactive charts belong everywhere else. When a stakeholder can hover over a data point to see exact values, zoom into a time range, or filter by clicking a legend item — their questions get answered without a follow-up email to you. Plotly''s `.to_html(include_plotlyjs=''cdn'')` exports a single HTML file that works in any browser with no dependencies — easy to share, email, or embed in a portfolio page.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('plotly', 'Plotly', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_3_id, 'plotly') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'The EDA Framework: A Structured Approach', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_datascience_3_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_4_id, 'VIDEO', 'Exploratory Data Analysis', 'https://www.youtube.com/watch?v=xi0vhXFPegw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_4_id, 'ARTICLE', 'EDA Guide', 'https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The EDA process: (1) understand what each column means — domain knowledge first, code second. (2) Look at distributions of individual columns. (3) Look at relationships between pairs. (4) Look at relationships across 3+ dimensions simultaneously. The biggest EDA mistake beginners make is jumping straight to correlation matrices and scatterplot matrices without first understanding what the data represents. A chart without domain knowledge is just a picture.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_4_id, 'exploratory_data_analysis') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Feature Engineering Basics', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_datascience_3_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_5_id, 'VIDEO', 'Feature Engineering', 'https://www.youtube.com/watch?v=6WDFfaYtN6s', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_5_id, 'ARTICLE', 'Feature Engineering for Machine Learning', 'https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Feature engineering is where domain knowledge meets technical skill — and it''s often the difference between a model that scores 75% and one that scores 85% on the same dataset. Before touching a machine learning algorithm, ask: what transformations of the raw data might make patterns more learnable? Log-transforming a right-skewed price column reduces the influence of extreme values and often dramatically improves model performance on price prediction tasks.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_5_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_5_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'PROJECT: EDA Report', '', 'project_milestone', 8, 'intermediate', 6)
    RETURNING topic_id INTO topic_datascience_3_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_6_id, 'ARTICLE', 'How to write a great Kaggle notebook', 'https://www.kaggle.com/discussions/general/273726', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Publishing on Kaggle serves two purposes: the community feedback loop (comments, upvotes, forking) accelerates your learning faster than any tutorial, and your public Kaggle profile becomes part of your data science portfolio. Hiring managers do look at Kaggle profiles. A notebook with 50+ upvotes is a credible signal of communication and analytical quality — not just code that runs.', 2);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('matplotlib', 'Matplotlib', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'matplotlib') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seaborn', 'Seaborn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'seaborn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('plotly', 'Plotly', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'plotly') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'exploratory_data_analysis') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_3_id, 'PROJECT: EDA Report', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Statistics & Probability Foundations
DO $$
DECLARE
  stage_datascience_4_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Statistics & Probability Foundations', 4, 'beginner')
  RETURNING stage_id INTO stage_datascience_4_id;

  DECLARE
    topic_datascience_4_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_4_id, 'Descriptive Statistics & Distributions', '', 'lesson', 2, 'intermediate', 1)
    RETURNING topic_id INTO topic_datascience_4_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_1_id, 'VIDEO', 'Statistics for Data Science', 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_1_id, 'ARTICLE', 'scipy.stats', 'https://docs.scipy.org/doc/scipy/reference/stats.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The Central Limit Theorem is the single most important theorem in statistics for data science: regardless of the shape of the original distribution, the distribution of sample means approaches normal as sample size grows. This is why we can apply statistical tests to non-normal data. Josh Starmer''s StatQuest YouTube channel is the best statistics resource ever made for practitioners — clear, visual, with minimal jargon. Watch the CLT video twice.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_1_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_1_id, 'python') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_4_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_4_id, 'Hypothesis Testing', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_datascience_4_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_2_id, 'VIDEO', 'Hypothesis Testing', 'https://www.youtube.com/watch?v=0oc49DyA3hU', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_2_id, 'ARTICLE', 'Statistical tests in Python', 'https://docs.scipy.org/doc/scipy/reference/stats.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The p-value is the most misunderstood concept in data science. A p-value of 0.04 does NOT mean "there''s a 96% chance the effect is real." It means "if the null hypothesis were true, there''s a 4% chance of observing data at least this extreme." Effect size (Cohen''s d, Cramer''s V) tells you whether the effect is practically meaningful — a result can be statistically significant but so tiny it doesn''t matter. Always report both.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_2_id, 'statistics') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_4_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_4_id, 'Correlation, Causation & Regression Basics', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_4_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_3_id, 'VIDEO', 'Linear Regression', 'https://www.youtube.com/watch?v=nk2CQITm_eo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_3_id, 'ARTICLE', 'statsmodels OLS', 'https://www.statsmodels.org/stable/regression.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Use `statsmodels` when you care about statistical inference — p-values, confidence intervals, coefficient interpretability, R². Use Scikit-learn when you care about predictive performance — cross-validation, pipelines, hyperparameter tuning. These are two different goals. In data science you often need both: `statsmodels` to understand *why* a feature matters, Scikit-learn to build a model that actually predicts well.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_3_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statsmodels', 'Statsmodels', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_3_id, 'statsmodels') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_4_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_4_id, 'Probability for Machine Learning', '', 'lesson', 1, 'intermediate', 4)
    RETURNING topic_id INTO topic_datascience_4_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_4_id, 'VIDEO', 'Bayes Theorem', 'https://www.youtube.com/watch?v=HZGCoVF3YvM', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_4_id, 'ARTICLE', 'Naive Bayes', 'https://towardsdatascience.com/all-about-naive-bayes-8e13cef044cf', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Bayes'' theorem is the mathematical foundation of many ML algorithms — not just Naive Bayes, but also Bayesian optimisation (used for hyperparameter search) and probabilistic models. More importantly, understanding that model outputs are probability estimates (not certainties) is what separates thoughtful data scientists from algorithm runners. When a model says "70% probability of fraud" — what does that really mean? Bayes gives you the language to think about it rigorously.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_4_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_4_id, 'machine_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_4_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_4_id, 'A/B Testing & Experimentation', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_datascience_4_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_5_id, 'VIDEO', 'A/B Testing', 'https://www.youtube.com/watch?v=zFMgpxG-chM', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_5_id, 'ARTICLE', 'Udacity A/B Testing course notes', 'https://storage.googleapis.com/supplemental_media/udacityu/1566803494/Lesson%201%20Notes.pdf', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A/B testing is how technology companies make product decisions with statistical rigour. The "peeking problem" is the most common A/B testing mistake: stopping the experiment early because you saw a significant result in the first few days. Early significance is often a statistical artefact — you need to run the test for the pre-determined sample size regardless. In data science roles at tech companies, A/B testing analysis is a daily task and a frequent interview topic.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_5_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_5_id, 'exploratory_data_analysis') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_4_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_4_id, 'PROJECT: Statistical Analysis Report', '', 'project_milestone', 8, 'intermediate', 6)
    RETURNING topic_id INTO topic_datascience_4_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_6_id, 'VIDEO', 'Statistics with Python', 'https://www.youtube.com/watch?v=lvmjbkZYMvA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_4_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The ability to translate a business question into a statistical test — and then translate the result back into a business recommendation — is what makes a data scientist valuable to a non-technical team. "Should we ship this feature?" should get an answer like "The test showed a 12% increase in conversion (p=0.02, Cohen''s d=0.31). The effect is statistically significant and practically meaningful. I recommend shipping." Not a p-value and a shrug.', 2);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_6_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_6_id, 'exploratory_data_analysis') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statsmodels', 'Statsmodels', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_6_id, 'statsmodels') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_4_id, 'PROJECT: Statistical Analysis Report', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Machine Learning Fundamentals
DO $$
DECLARE
  stage_datascience_5_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Machine Learning Fundamentals', 5, 'beginner')
  RETURNING stage_id INTO stage_datascience_5_id;

  DECLARE
    topic_datascience_5_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'The Machine Learning Framework', '', 'concept', 1, 'intermediate', 1)
    RETURNING topic_id INTO topic_datascience_5_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_1_id, 'VIDEO', 'Machine Learning Fundamentals', 'https://www.youtube.com/watch?v=Gv9_4yMHFhI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_1_id, 'ARTICLE', 'The ML Workflow', 'https://developers.google.com/machine-learning/crash-course/framing/ml-terminology', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The biggest mistake beginners make in ML is treating it as: "load data → fit model → done." The workflow is: define the problem precisely → choose the right evaluation metric for that problem → split data correctly to prevent leakage → engineer features → train a baseline → iterate. The "define the problem" step is the most neglected and the most important. If you optimise for accuracy on an imbalanced dataset (99% class A), a model that predicts A every time scores 99% accuracy — but is useless.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_1_id, 'machine_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'Scikit-learn API & Preprocessing', '', 'lesson', 2, 'intermediate', 2)
    RETURNING topic_id INTO topic_datascience_5_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_2_id, 'VIDEO', 'Scikit-learn Tutorial', 'https://www.youtube.com/watch?v=0Lt9w-BxKFQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_2_id, 'ARTICLE', 'Scikit-learn Preprocessing', 'https://scikit-learn.org/stable/modules/preprocessing.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The "fit on train only, transform test" rule is the most critical data leakage prevention principle. If you fit a `StandardScaler` on all your data (including test), the test set''s statistics influence the scaler — meaning your model "sees" the test set indirectly. In production, when you serve a new prediction, you transform it using the scaler fitted only on historical training data. Always replicate that process in your ML pipeline.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_2_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_2_id, 'machine_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'Classification: Logistic Regression, Decision Trees & KNN', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_5_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_3_id, 'VIDEO', 'Decision Trees', 'https://www.youtube.com/watch?v=7VeUPuFGJHk', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_3_id, 'ARTICLE', 'Scikit-learn Classification', 'https://scikit-learn.org/stable/supervised_learning.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Choosing the right evaluation metric is more important than choosing the right algorithm. For a cancer detection model (rare disease, high cost of false negatives): optimise for recall, not accuracy. For a spam filter (where false positives ruin UX): optimise for precision. AUC-ROC measures how well a model distinguishes between classes across all thresholds — it''s threshold-independent and the best single summary metric for binary classification when class imbalance isn''t extreme.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_3_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_3_id, 'machine_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'Regression: Linear, Ridge, Lasso & Evaluation', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_datascience_5_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_4_id, 'VIDEO', 'Ridge and Lasso Regression', 'https://www.youtube.com/watch?v=NGf0voTMlcs', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_4_id, 'ARTICLE', 'Linear Models', 'https://scikit-learn.org/stable/modules/linear_model.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Regularisation is how you prevent overfitting in linear models. Lasso (L1) drives some coefficients to exactly zero — effectively performing feature selection. Ridge (L2) shrinks all coefficients towards zero but keeps all features. In practice: use Lasso when you suspect only a few features matter; use Ridge when you think most features contribute something. Always tune the regularisation parameter with cross-validation — the default is almost never optimal.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_4_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_4_id, 'machine_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'Unsupervised Learning: Clustering & Dimensionality Reduction', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_datascience_5_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_5_id, 'VIDEO', 'K-Means Clustering', 'https://www.youtube.com/watch?v=4b5d3muPQmA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_5_id, 'ARTICLE', 'Clustering', 'https://scikit-learn.org/stable/modules/clustering.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Clustering is unsupervised learning — there are no labels telling the algorithm what''s correct. The quality of clusters depends heavily on: what features you include, whether you''ve scaled them (K-Means uses Euclidean distance — unscaled features dominate), and the algorithm you choose. Interpreting clusters is as important as creating them. A cluster with no interpretable meaning has no business value. Name every cluster you find and write down what distinguishes it.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_5_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_5_id, 'scikit_learn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'Model Selection, Evaluation & Avoiding Overfitting', '', 'lesson', 2, 'intermediate', 6)
    RETURNING topic_id INTO topic_datascience_5_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_6_id, 'VIDEO', 'Cross Validation', 'https://www.youtube.com/watch?v=fSytzGwwBVw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_6_id, 'ARTICLE', 'Cross-validation', 'https://scikit-learn.org/stable/modules/cross_validation.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Always establish a baseline before evaluating any model. A baseline is the simplest possible prediction strategy: for classification, predict the most common class; for regression, predict the mean. If your model doesn''t substantially beat the baseline, either the features contain no signal, the data is too noisy, or the model is underfit. Learning curves are your debugging tool: if training score is high but validation score is low → overfitting. If both are low → underfitting. Each diagnosis has a different fix.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_6_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_6_id, 'scikit_learn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'PROJECT: Predictive Model', '', 'project_milestone', 12, 'advanced', 7)
    RETURNING topic_id INTO topic_datascience_5_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'VIDEO', 'End-to-End Machine Learning Project', 'https://www.youtube.com/watch?v=fiz1ORTBGpY', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'ARTICLE', 'Scikit-learn Pipeline', 'https://scikit-learn.org/stable/modules/pipeline.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This project is what employers actually look at. The code quality, the thought process, the error analysis, the plain-language explanation. A Jupyter notebook that only shows the winning model is unimpressive. A notebook that shows what you tried, why you made each decision, what surprised you, and where the model still fails — that is the work of a thoughtful data scientist.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_5_id, 'PROJECT: Predictive Model', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Advanced ML & Ensembles
DO $$
DECLARE
  stage_datascience_6_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Advanced ML & Ensembles', 6, 'beginner')
  RETURNING stage_id INTO stage_datascience_6_id;

  DECLARE
    topic_datascience_6_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_6_id, 'Ensemble Methods: Random Forest & Gradient Boosting', '', 'lesson', 2, 'advanced', 1)
    RETURNING topic_id INTO topic_datascience_6_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_1_id, 'VIDEO', 'XGBoost', 'https://www.youtube.com/watch?v=TyvYZ26alZs', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_1_id, 'ARTICLE', 'XGBoost Documentation', 'https://xgboost.readthedocs.io/en/stable/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Gradient boosting algorithms (XGBoost, LightGBM, CatBoost) win most structured data Kaggle competitions — not deep learning. On tabular data with fewer than a few million rows, XGBoost with good features and tuning typically outperforms neural networks. This is why they''re the industry standard for fraud detection, credit scoring, demand forecasting, and churn prediction. SHAP (SHapley Additive exPlanations) values explain individual predictions — critical for building ML systems where regulators or stakeholders need to understand why a decision was made.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('xgboost', 'XGBoost', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_1_id, 'xgboost') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_1_id, 'machine_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_6_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_6_id, 'Model Interpretability & Fairness', '', 'lesson', 2, 'advanced', 2)
    RETURNING topic_id INTO topic_datascience_6_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_2_id, 'VIDEO', 'SHAP Values Explained', 'https://www.youtube.com/watch?v=VB9uV-x0gtg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_2_id, 'ARTICLE', 'SHAP Documentation', 'https://shap.readthedocs.io/en/latest/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Model explainability is now a compliance requirement in many industries. EU''s AI Act, US financial regulations, and GDPR all require that automated decisions affecting people can be explained. SHAP is the most rigorous method: it''s rooted in game theory (Shapley values) and produces consistent, theoretically sound explanations. "The model gave this loan applicant a low score primarily because their debt-to-income ratio was in the top 5%." That''s the level of explanation regulators expect.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_2_id, 'machine_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_6_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_6_id, 'Handling Imbalanced Datasets', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_6_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_3_id, 'VIDEO', 'SMOTE Oversampling', 'https://www.youtube.com/watch?v=FheTDyCwRdE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_3_id, 'ARTICLE', 'imbalanced-learn docs', 'https://imbalanced-learn.org/stable/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Fraud detection, disease prediction, and anomaly detection are all imbalanced problems — the event you care about (fraud, disease) is rare. Accuracy is a useless metric on a dataset that''s 99% not-fraud: a model that predicts "not fraud" for everything scores 99% accuracy. Use Precision-Recall AUC instead. SMOTE (Synthetic Minority Oversampling Technique) creates synthetic minority samples by interpolating between real ones — but it can introduce noise. Always compare SMOTE to simple class weighting before committing to it.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_3_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_3_id, 'scikit_learn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_6_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_6_id, 'Feature Selection & Dimensionality Reduction', '', 'lesson', 1, 'intermediate', 4)
    RETURNING topic_id INTO topic_datascience_6_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_4_id, 'VIDEO', 'Feature Selection', 'https://www.youtube.com/watch?v=vUstzHqr_Zk', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_4_id, 'ARTICLE', 'Feature Selection', 'https://scikit-learn.org/stable/modules/feature_selection.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'More features is not always better. Irrelevant features add noise, slow training, and can decrease model performance — the curse of dimensionality. Feature selection is particularly important when: (1) you have more features than samples, (2) you need an interpretable model (fewer features = clearer story), (3) inference latency matters in production. Tree-based feature importances are the fastest filter; RFE is slower but more principled because it actually measures how removing each feature affects model performance.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_4_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_4_id, 'scikit_learn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_6_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_6_id, 'Time Series Forecasting', '', 'lesson', 2, 'advanced', 5)
    RETURNING topic_id INTO topic_datascience_6_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_5_id, 'VIDEO', 'Time Series Forecasting', 'https://www.youtube.com/watch?v=e8Yw4alG16Q', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_5_id, 'ARTICLE', 'Prophet Documentation', 'https://facebook.github.io/prophet/docs/quick_start.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Time series forecasting requires a different mindset from standard ML: the past cannot "see" the future. When creating lag features, a lag-7 feature (value 7 days ago) must never include data that wouldn''t have been available at prediction time. This is "temporal leakage" — it''s why you must use `TimeSeriesSplit` in cross-validation instead of regular K-fold. Prophet is particularly good for business time series with daily seasonality and known holidays — you can inject custom holiday effects and it handles missing data gracefully.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_5_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_5_id, 'feature_engineering') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_6_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_6_id, 'PROJECT: Kaggle Competition Entry', '', 'project_milestone', 15, 'advanced', 6)
    RETURNING topic_id INTO topic_datascience_6_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_6_id, 'VIDEO', 'How to Compete on Kaggle', 'https://www.youtube.com/watch?v=GJBBDzTAASc', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_6_id, 'ARTICLE', 'Kaggle Learn + Competitions', 'https://www.kaggle.com/competitions', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_6_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Kaggle competitions are the closest thing to a job interview simulation in data science. The feedback loop is tight: you submit, you see your score relative to thousands of other participants, you iterate. The leaderboard position doesn''t matter as much as the debrief — what did you learn? The learners who get hired from Kaggle are those who can explain why each experiment they tried either worked or failed, not just those who got the best score.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('xgboost', 'XGBoost', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'xgboost') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_6_id, 'PROJECT: Kaggle Competition Entry', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Deep Learning & NLP Basics
DO $$
DECLARE
  stage_datascience_7_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Deep Learning & NLP Basics', 7, 'beginner')
  RETURNING stage_id INTO stage_datascience_7_id;

  DECLARE
    topic_datascience_7_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_7_id, 'Neural Networks from Scratch', '', 'lesson', 2, 'advanced', 1)
    RETURNING topic_id INTO topic_datascience_7_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_1_id, 'VIDEO', 'Neural Networks from Scratch', 'https://www.youtube.com/playlist?list=PLQVvvaa0QuDcjD5BAebJ80bFMGq_1AAAQ', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_1_id, 'ARTICLE', 'Neural Networks and Deep Learning', 'http://neuralnetworksanddeeplearning.com/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Implementing a neural network from scratch in NumPy is the most clarifying exercise in deep learning. When you write `output = sigmoid(np.dot(W, input) + b)` and then derive the gradient update by hand — backpropagation stops being mysterious. You understand why vanishing gradients happen with sigmoid, why ReLU is usually better, and why batch size affects training stability. This understanding makes debugging real PyTorch models dramatically easier.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_1_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_1_id, 'pytorch') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_7_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_7_id, 'PyTorch Fundamentals', '', 'lesson', 2, 'advanced', 2)
    RETURNING topic_id INTO topic_datascience_7_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_2_id, 'VIDEO', 'PyTorch for Deep Learning', 'https://www.youtube.com/watch?v=V_xro1bcAuA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_2_id, 'ARTICLE', 'PyTorch Tutorial', 'https://pytorch.org/tutorials/beginner/basics/intro.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'PyTorch is the dominant framework for research and production ML in 2026. Its dynamic computation graph (define-by-run) makes debugging natural — you can add a `print()` anywhere in your model and it works. The training loop in PyTorch is explicit: zero gradients → forward pass → compute loss → backward pass → update weights. Understanding this loop deeply means you''ll never be confused about when to call `optimizer.zero_grad()` or why `loss.backward()` must come before `optimizer.step()`.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_2_id, 'pytorch') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_2_id, 'deep_learning') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_7_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_7_id, 'Text Processing & NLP Fundamentals', '', 'lesson', 2, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_7_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_3_id, 'VIDEO', 'NLP with Python', 'https://www.youtube.com/watch?v=M7SWr5xObkA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_3_id, 'ARTICLE', 'spaCy 101', 'https://spacy.io/usage/spacy-101', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'NLP tasks — sentiment analysis, topic modelling, text classification, named entity recognition — are among the most commercially valuable data science applications. The fundamental pipeline: raw text → tokens → numerical representation → model. TF-IDF (Term Frequency-Inverse Document Frequency) scores words by how often they appear in a document weighted against how common they are across all documents — common words like "the" get low scores; rare but meaningful words get high scores. It''s often the strongest baseline for text classification.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('nlp', 'NLP', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_3_id, 'nlp') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_3_id, 'scikit_learn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_7_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_7_id, 'Transfer Learning & Transformers (Practical)', '', 'lesson', 2, 'advanced', 4)
    RETURNING topic_id INTO topic_datascience_7_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_4_id, 'VIDEO', 'HuggingFace Transformers', 'https://www.youtube.com/watch?v=1pedAIvTWXk', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_4_id, 'ARTICLE', 'HuggingFace Transformers', 'https://huggingface.co/docs/transformers/index', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Transfer learning is the most important paradigm shift in modern AI. Instead of training a model from scratch on your specific task (which requires massive data and compute), you take a model pre-trained on billions of text tokens and fine-tune it on your few thousand examples. DistilBERT is 40% smaller than BERT but retains 97% of its performance — a sensible trade-off for learning projects and production systems where latency matters. The HuggingFace ecosystem is the industry standard for NLP in 2026.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('nlp', 'NLP', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_4_id, 'nlp') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_4_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_4_id, 'pytorch') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_7_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_7_id, 'Convolutional Neural Networks (Image Classification)', '', 'lesson', 2, 'advanced', 5)
    RETURNING topic_id INTO topic_datascience_7_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_5_id, 'VIDEO', 'CNN Explained', 'https://www.youtube.com/watch?v=HGwBXDKFk9I', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_5_id, 'ARTICLE', 'PyTorch Transfer Learning Tutorial', 'https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Convolutional layers are not magic — each filter is a small matrix that slides across an image, detecting a specific pattern (edge, texture, colour gradient). Early layers detect simple patterns; deeper layers detect complex ones (eyes, wheels, faces). Transfer learning works because these learned features are general — a model trained on ImageNet''s 1.2M images learns filters useful for almost any visual recognition task. You fine-tune only the final layer (which maps features to your specific classes) while keeping the earlier feature detectors frozen.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_5_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_5_id, 'pytorch') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_7_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_7_id, 'PROJECT: Text Classifier', '', 'project_milestone', 12, 'advanced', 6)
    RETURNING topic_id INTO topic_datascience_7_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_6_id, 'VIDEO', 'Streamlit for Data Science', 'https://www.youtube.com/watch?v=JwSS70SZdyM', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_6_id, 'ARTICLE', 'Streamlit Documentation', 'https://docs.streamlit.io/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_7_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A model that lives only in a notebook is invisible. A model with a live URL that anyone can demo in 30 seconds is a portfolio piece. Streamlit transforms a Python script into a web app with almost no extra code — `st.text_input()`, `st.button()`, `st.write()` cover most use cases. Streamlit Cloud deploys from GitHub for free. This project should be the first link in your portfolio — something you can open on a phone during a coffee chat and demo instantly.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('nlp', 'NLP', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_6_id, 'nlp') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_6_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_6_id, 'pytorch') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('streamlit', 'Streamlit', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_6_id, 'streamlit') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_7_id, 'PROJECT: Text Classifier', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: MLOps, Deployment & Capstone
DO $$
DECLARE
  stage_datascience_8_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'MLOps, Deployment & Capstone', 8, 'beginner')
  RETURNING stage_id INTO stage_datascience_8_id;

  DECLARE
    topic_datascience_8_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_8_id, 'MLflow: Experiment Tracking & Model Registry', '', 'lesson', 2, 'advanced', 1)
    RETURNING topic_id INTO topic_datascience_8_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_1_id, 'VIDEO', 'MLflow Tutorial', 'https://www.youtube.com/watch?v=kshjh3MDpDU', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_1_id, 'ARTICLE', 'MLflow Documentation', 'https://mlflow.org/docs/latest/index.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Without experiment tracking, ML development is chaos — you forget which hyperparameters produced which result, you can''t compare experiments reproducibly, and you can''t roll back to a better model version. MLflow solves this with four components: Tracking (log params and metrics), Projects (package code for reproducibility), Models (standard format for any ML model), and Registry (version control for models). It''s the industry standard and used at Netflix, Microsoft, and thousands of other companies.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_1_id, 'mlops') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlflow', 'MLflow', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_1_id, 'mlflow') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_8_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_8_id, 'Deploying ML Models as APIs', '', 'lesson', 2, 'advanced', 2)
    RETURNING topic_id INTO topic_datascience_8_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_2_id, 'VIDEO', 'FastAPI for ML', 'https://www.youtube.com/watch?v=b5F667g1yCk', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_2_id, 'ARTICLE', 'FastAPI Documentation', 'https://fastapi.tiangolo.com/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A Jupyter notebook cannot serve production traffic. To use a model in a real product — a mobile app, a web app, a backend service — it needs to be behind an API endpoint. FastAPI is the standard for ML APIs in Python: it generates automatic documentation, validates inputs with Pydantic schemas (rejecting malformed requests before they hit your model), and is fast enough for production traffic. The pattern: load model once at startup, serve predictions per request. Never load the model per request — it''s too slow.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_2_id, 'mlops') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('docker', 'Docker', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_2_id, 'docker') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_8_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_8_id, 'Building Interactive Data Apps with Streamlit', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_8_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_3_id, 'VIDEO', 'Advanced Streamlit', 'https://www.youtube.com/watch?v=ZZ4B0QUHuNc', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_3_id, 'ARTICLE', 'Streamlit App Gallery', 'https://streamlit.io/gallery', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Stakeholders don''t use Jupyter notebooks. They use browser tabs. Streamlit bridges the gap: you write Python, stakeholders get a web app. The `@st.cache_data` decorator is critical for dashboards — it caches expensive operations (loading a dataset, training a model) so the app feels instant on every interaction. For model demos in interviews, a polished Streamlit app is worth 10 notebooks. It shows you think about the end user, not just the algorithm.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('streamlit', 'Streamlit', 'framework_library') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_3_id, 'streamlit') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_3_id, 'mlops') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_8_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_8_id, 'Data Pipelines & Automation', '', 'lesson', 1, 'advanced', 4)
    RETURNING topic_id INTO topic_datascience_8_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_4_id, 'VIDEO', 'Apache Airflow Tutorial', 'https://www.youtube.com/watch?v=AHMm1wfGuHE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_4_id, 'ARTICLE', 'schedule library', 'https://schedule.readthedocs.io/en/stable/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In production, data science isn''t a one-time analysis. It''s a pipeline that runs daily, weekly, or in real-time — collecting fresh data, cleaning it, retraining or scoring models, and surfacing results. Data validation is non-negotiable: a pipeline that silently consumes corrupted data and produces wrong predictions is worse than a pipeline that fails loudly. "Monitor your data like you monitor your code" — schema changes, missing values, distribution shifts all need to be detected and alerted on.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_4_id, 'mlops') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_4_id, 'data_wrangling') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_8_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_8_id, 'PROJECT: Capstone', '', 'project_capstone', 30, 'advanced', 5)
    RETURNING topic_id INTO topic_datascience_8_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_5_id, 'ARTICLE', 'How to structure an ML project', 'https://drivendata.github.io/cookiecutter-data-science/', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_8_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your capstone is the conversation starter in every data science interview. "Walk me through a project you built from scratch." This is that project. The written report matters as much as the code — data scientists must communicate findings to non-technical stakeholders. The live Streamlit demo matters as much as the model accuracy — it shows you can ship something real. Make it something you''d be excited to talk about for 45 minutes.', 2);
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_8_id, 'PROJECT: Capstone', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

