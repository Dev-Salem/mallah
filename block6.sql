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

-- Stage: Web Foundations + JavaScript
