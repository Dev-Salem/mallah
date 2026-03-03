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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_1_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_2_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_3_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_5_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'sql') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_2_id, 'PROJECT: Messy Data → Clean Insights', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Exploratory Data Analysis & Visualisation
