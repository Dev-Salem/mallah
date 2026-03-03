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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_1_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_3_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statsmodels', 'Statsmodels', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_4_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_5_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statistics', 'Statistics', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_6_id, 'statistics') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_6_id, 'exploratory_data_analysis') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('statsmodels', 'Statsmodels', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_4_6_id, 'statsmodels') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_4_id, 'PROJECT: Statistical Analysis Report', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Machine Learning Fundamentals
