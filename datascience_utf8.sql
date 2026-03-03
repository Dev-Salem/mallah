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
    VALUES (topic_datascience_4_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Bayes'' theorem is the mathematical foundation of many ML algorithms ƒ?" not just Naive Bayes, but also Bayesian optimisation (used for hyperparameter search) and probabilistic models. More importantly, understanding that model outputs are probability estimates (not certainties) is what separates thoughtful data scientists from algorithm runners. When a model says "70% probability of fraud" ƒ?" what does that really mean? Bayes gives you the language to think about it rigorously.', 3);
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
    VALUES (topic_datascience_4_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A/B testing is how technology companies make product decisions with statistical rigour. The "peeking problem" is the most common A/B testing mistake: stopping the experiment early because you saw a significant result in the first few days. Early significance is often a statistical artefact ƒ?" you need to run the test for the pre-determined sample size regardless. In data science roles at tech companies, A/B testing analysis is a daily task and a frequent interview topic.', 3);
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
    VALUES (topic_datascience_4_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The ability to translate a business question into a statistical test ƒ?" and then translate the result back into a business recommendation ƒ?" is what makes a data scientist valuable to a non-technical team. "Should we ship this feature?" should get an answer like "The test showed a 12% increase in conversion (p=0.02, Cohen''s d=0.31). The effect is statistically significant and practically meaningful. I recommend shipping." Not a p-value and a shrug.', 2);
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
    VALUES (topic_datascience_5_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The biggest mistake beginners make in ML is treating it as: "load data ƒ+' fit model ƒ+' done." The workflow is: define the problem precisely ƒ+' choose the right evaluation metric for that problem ƒ+' split data correctly to prevent leakage ƒ+' engineer features ƒ+' train a baseline ƒ+' iterate. The "define the problem" step is the most neglected and the most important. If you optimise for accuracy on an imbalanced dataset (99% class A), a model that predicts A every time scores 99% accuracy ƒ?" but is useless.', 3);
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
    VALUES (topic_datascience_5_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The "fit on train only, transform test" rule is the most critical data leakage prevention principle. If you fit a `StandardScaler` on all your data (including test), the test set''s statistics influence the scaler ƒ?" meaning your model "sees" the test set indirectly. In production, when you serve a new prediction, you transform it using the scaler fitted only on historical training data. Always replicate that process in your ML pipeline.', 3);
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
    VALUES (topic_datascience_5_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Choosing the right evaluation metric is more important than choosing the right algorithm. For a cancer detection model (rare disease, high cost of false negatives): optimise for recall, not accuracy. For a spam filter (where false positives ruin UX): optimise for precision. AUC-ROC measures how well a model distinguishes between classes across all thresholds ƒ?" it''s threshold-independent and the best single summary metric for binary classification when class imbalance isn''t extreme.', 3);
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
    VALUES (topic_datascience_5_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Regularisation is how you prevent overfitting in linear models. Lasso (L1) drives some coefficients to exactly zero ƒ?" effectively performing feature selection. Ridge (L2) shrinks all coefficients towards zero but keeps all features. In practice: use Lasso when you suspect only a few features matter; use Ridge when you think most features contribute something. Always tune the regularisation parameter with cross-validation ƒ?" the default is almost never optimal.', 3);
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
    VALUES (topic_datascience_5_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Clustering is unsupervised learning ƒ?" there are no labels telling the algorithm what''s correct. The quality of clusters depends heavily on: what features you include, whether you''ve scaled them (K-Means uses Euclidean distance ƒ?" unscaled features dominate), and the algorithm you choose. Interpreting clusters is as important as creating them. A cluster with no interpretable meaning has no business value. Name every cluster you find and write down what distinguishes it.', 3);
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
    VALUES (topic_datascience_5_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Always establish a baseline before evaluating any model. A baseline is the simplest possible prediction strategy: for classification, predict the most common class; for regression, predict the mean. If your model doesn''t substantially beat the baseline, either the features contain no signal, the data is too noisy, or the model is underfit. Learning curves are your debugging tool: if training score is high but validation score is low ƒ+' overfitting. If both are low ƒ+' underfitting. Each diagnosis has a different fix.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_6_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_6_id, 'scikit_learn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_5_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_5_id, 'PROJECT: Predictive Model', '', 'project_milestone', 12, 'intermediate ƒ+' advanced', 7)
    RETURNING topic_id INTO topic_datascience_5_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'VIDEO', 'End-to-End Machine Learning Project', 'https://www.youtube.com/watch?v=fiz1ORTBGpY', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'ARTICLE', 'Scikit-learn Pipeline', 'https://scikit-learn.org/stable/modules/pipeline.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_5_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'This project is what employers actually look at. The code quality, the thought process, the error analysis, the plain-language explanation. A Jupyter notebook that only shows the winning model is unimpressive. A notebook that shows what you tried, why you made each decision, what surprised you, and where the model still fails ƒ?" that is the work of a thoughtful data scientist.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'scikit_learn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('machine_learning', 'Machine Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'machine_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_5_7_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_5_id, 'PROJECT: Predictive Model', '', 'intermediate ƒ+' advanced') ON CONFLICT DO NOTHING;
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
    VALUES (topic_datascience_6_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Gradient boosting algorithms (XGBoost, LightGBM, CatBoost) win most structured data Kaggle competitions ƒ?" not deep learning. On tabular data with fewer than a few million rows, XGBoost with good features and tuning typically outperforms neural networks. This is why they''re the industry standard for fraud detection, credit scoring, demand forecasting, and churn prediction. SHAP (SHapley Additive exPlanations) values explain individual predictions ƒ?" critical for building ML systems where regulators or stakeholders need to understand why a decision was made.', 3);
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
    VALUES (topic_datascience_6_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Fraud detection, disease prediction, and anomaly detection are all imbalanced problems ƒ?" the event you care about (fraud, disease) is rare. Accuracy is a useless metric on a dataset that''s 99% not-fraud: a model that predicts "not fraud" for everything scores 99% accuracy. Use Precision-Recall AUC instead. SMOTE (Synthetic Minority Oversampling Technique) creates synthetic minority samples by interpolating between real ones ƒ?" but it can introduce noise. Always compare SMOTE to simple class weighting before committing to it.', 3);
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
    VALUES (topic_datascience_6_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'More features is not always better. Irrelevant features add noise, slow training, and can decrease model performance ƒ?" the curse of dimensionality. Feature selection is particularly important when: (1) you have more features than samples, (2) you need an interpretable model (fewer features = clearer story), (3) inference latency matters in production. Tree-based feature importances are the fastest filter; RFE is slower but more principled because it actually measures how removing each feature affects model performance.', 3);
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
    VALUES (topic_datascience_6_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Time series forecasting requires a different mindset from standard ML: the past cannot "see" the future. When creating lag features, a lag-7 feature (value 7 days ago) must never include data that wouldn''t have been available at prediction time. This is "temporal leakage" ƒ?" it''s why you must use `TimeSeriesSplit` in cross-validation instead of regular K-fold. Prophet is particularly good for business time series with daily seasonality and known holidays ƒ?" you can inject custom holiday effects and it handles missing data gracefully.', 3);
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
    VALUES (topic_datascience_6_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Kaggle competitions are the closest thing to a job interview simulation in data science. The feedback loop is tight: you submit, you see your score relative to thousands of other participants, you iterate. The leaderboard position doesn''t matter as much as the debrief ƒ?" what did you learn? The learners who get hired from Kaggle are those who can explain why each experiment they tried either worked or failed, not just those who got the best score.', 3);
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
    VALUES (topic_datascience_7_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Implementing a neural network from scratch in NumPy is the most clarifying exercise in deep learning. When you write `output = sigmoid(np.dot(W, input) + b)` and then derive the gradient update by hand ƒ?" backpropagation stops being mysterious. You understand why vanishing gradients happen with sigmoid, why ReLU is usually better, and why batch size affects training stability. This understanding makes debugging real PyTorch models dramatically easier.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_1_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_7_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'PyTorch is the dominant framework for research and production ML in 2026. Its dynamic computation graph (define-by-run) makes debugging natural ƒ?" you can add a `print()` anywhere in your model and it works. The training loop in PyTorch is explicit: zero gradients ƒ+' forward pass ƒ+' compute loss ƒ+' backward pass ƒ+' update weights. Understanding this loop deeply means you''ll never be confused about when to call `optimizer.zero_grad()` or why `loss.backward()` must come before `optimizer.step()`.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_2_id, 'pytorch') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_7_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'NLP tasks ƒ?" sentiment analysis, topic modelling, text classification, named entity recognition ƒ?" are among the most commercially valuable data science applications. The fundamental pipeline: raw text ƒ+' tokens ƒ+' numerical representation ƒ+' model. TF-IDF (Term Frequency-Inverse Document Frequency) scores words by how often they appear in a document weighted against how common they are across all documents ƒ?" common words like "the" get low scores; rare but meaningful words get high scores. It''s often the strongest baseline for text classification.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('nlp', 'NLP', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_3_id, 'nlp') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scikit_learn', 'Scikit-learn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_7_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Transfer learning is the most important paradigm shift in modern AI. Instead of training a model from scratch on your specific task (which requires massive data and compute), you take a model pre-trained on billions of text tokens and fine-tune it on your few thousand examples. DistilBERT is 40% smaller than BERT but retains 97% of its performance ƒ?" a sensible trade-off for learning projects and production systems where latency matters. The HuggingFace ecosystem is the industry standard for NLP in 2026.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('nlp', 'NLP', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_4_id, 'nlp') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_4_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_7_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Convolutional layers are not magic ƒ?" each filter is a small matrix that slides across an image, detecting a specific pattern (edge, texture, colour gradient). Early layers detect simple patterns; deeper layers detect complex ones (eyes, wheels, faces). Transfer learning works because these learned features are general ƒ?" a model trained on ImageNet''s 1.2M images learns filters useful for almost any visual recognition task. You fine-tune only the final layer (which maps features to your specific classes) while keeping the earlier feature detectors frozen.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_5_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_7_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A model that lives only in a notebook is invisible. A model with a live URL that anyone can demo in 30 seconds is a portfolio piece. Streamlit transforms a Python script into a web app with almost no extra code ƒ?" `st.text_input()`, `st.button()`, `st.write()` cover most use cases. Streamlit Cloud deploys from GitHub for free. This project should be the first link in your portfolio ƒ?" something you can open on a phone during a coffee chat and demo instantly.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('nlp', 'NLP', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_6_id, 'nlp') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('deep_learning', 'Deep Learning', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_6_id, 'deep_learning') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pytorch', 'PyTorch', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_7_6_id, 'pytorch') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('streamlit', 'Streamlit', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_8_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Without experiment tracking, ML development is chaos ƒ?" you forget which hyperparameters produced which result, you can''t compare experiments reproducibly, and you can''t roll back to a better model version. MLflow solves this with four components: Tracking (log params and metrics), Projects (package code for reproducibility), Models (standard format for any ML model), and Registry (version control for models). It''s the industry standard and used at Netflix, Microsoft, and thousands of other companies.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_1_id, 'mlops') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlflow', 'MLflow', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_8_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A Jupyter notebook cannot serve production traffic. To use a model in a real product ƒ?" a mobile app, a web app, a backend service ƒ?" it needs to be behind an API endpoint. FastAPI is the standard for ML APIs in Python: it generates automatic documentation, validates inputs with Pydantic schemas (rejecting malformed requests before they hit your model), and is fast enough for production traffic. The pattern: load model once at startup, serve predictions per request. Never load the model per request ƒ?" it''s too slow.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_2_id, 'mlops') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('docker', 'Docker', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_8_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Stakeholders don''t use Jupyter notebooks. They use browser tabs. Streamlit bridges the gap: you write Python, stakeholders get a web app. The `@st.cache_data` decorator is critical for dashboards ƒ?" it caches expensive operations (loading a dataset, training a model) so the app feels instant on every interaction. For model demos in interviews, a polished Streamlit app is worth 10 notebooks. It shows you think about the end user, not just the algorithm.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('streamlit', 'Streamlit', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_3_id, 'streamlit') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_8_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In production, data science isn''t a one-time analysis. It''s a pipeline that runs daily, weekly, or in real-time ƒ?" collecting fresh data, cleaning it, retraining or scoring models, and surfacing results. Data validation is non-negotiable: a pipeline that silently consumes corrupted data and produces wrong predictions is worse than a pipeline that fails loudly. "Monitor your data like you monitor your code" ƒ?" schema changes, missing values, distribution shifts all need to be detected and alerted on.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('mlops', 'MLOps', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_8_4_id, 'mlops') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    VALUES (topic_datascience_8_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your capstone is the conversation starter in every data science interview. "Walk me through a project you built from scratch." This is that project. The written report matters as much as the code ƒ?" data scientists must communicate findings to non-technical stakeholders. The live Streamlit demo matters as much as the model accuracy ƒ?" it shows you can ship something real. Make it something you''d be excited to talk about for 45 minutes.', 2);
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_8_id, 'PROJECT: Capstone', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

