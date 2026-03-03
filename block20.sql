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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('xgboost', 'XGBoost', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_1_id, 'xgboost') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_3_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_4_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_5_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('xgboost', 'XGBoost', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'xgboost') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_6_6_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_6_id, 'PROJECT: Kaggle Competition Entry', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Deep Learning & NLP Basics
