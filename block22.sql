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
    VALUES (topic_datascience_8_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A Jupyter notebook cannot serve production traffic. To use a model in a real product — a mobile app, a web app, a backend service — it needs to be behind an API endpoint. FastAPI is the standard for ML APIs in Python: it generates automatic documentation, validates inputs with Pydantic schemas (rejecting malformed requests before they hit your model), and is fast enough for production traffic. The pattern: load model once at startup, serve predictions per request. Never load the model per request — it''s too slow.', 3);
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
    VALUES (topic_datascience_8_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Stakeholders don''t use Jupyter notebooks. They use browser tabs. Streamlit bridges the gap: you write Python, stakeholders get a web app. The `@st.cache_data` decorator is critical for dashboards — it caches expensive operations (loading a dataset, training a model) so the app feels instant on every interaction. For model demos in interviews, a polished Streamlit app is worth 10 notebooks. It shows you think about the end user, not just the algorithm.', 3);
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
    VALUES (topic_datascience_8_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'In production, data science isn''t a one-time analysis. It''s a pipeline that runs daily, weekly, or in real-time — collecting fresh data, cleaning it, retraining or scoring models, and surfacing results. Data validation is non-negotiable: a pipeline that silently consumes corrupted data and produces wrong predictions is worse than a pipeline that fails loudly. "Monitor your data like you monitor your code" — schema changes, missing values, distribution shifts all need to be detected and alerted on.', 3);
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
    VALUES (topic_datascience_8_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your capstone is the conversation starter in every data science interview. "Walk me through a project you built from scratch." This is that project. The written report matters as much as the code — data scientists must communicate findings to non-technical stakeholders. The live Streamlit demo matters as much as the model accuracy — it shows you can ship something real. Make it something you''d be excited to talk about for 45 minutes.', 2);
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_8_id, 'PROJECT: Capstone', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

