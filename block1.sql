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
