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
