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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_2_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_3_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_4_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_5_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_6_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_6_id, 'scikit_learn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'PROJECT: Predictive Model', '', 'project_milestone', 12, 'intermediate → advanced', 7)
    RETURNING topic_id INTO topic_datascience_5_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'VIDEO', 'End-to-End Machine Learning Project', 'https://www.youtube.com/watch?v=fiz1ORTBGpY', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'ARTICLE', 'Scikit-learn Pipeline', 'https://scikit-learn.org/stable/modules/pipeline.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This project is what employers actually look at. The code quality, the thought process, the error analysis, the plain-language explanation. A Jupyter notebook that only shows the winning model is unimpressive. A notebook that shows what you tried, why you made each decision, what surprised you, and where the model still fails — that is the work of a thoughtful data scientist.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_5_id, 'PROJECT: Predictive Model', '', 'intermediate → advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Advanced ML & Ensembles
