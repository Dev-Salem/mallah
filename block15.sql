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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_1_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('jupyter', 'Jupyter', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_2_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('numpy', 'NumPy', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_6_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('rest_api_consumption', 'REST API consumption', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
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
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('numpy', 'NumPy', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'numpy') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('jupyter', 'Jupyter', 'tool') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_1_7_id, 'jupyter') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_1_id, 'PROJECT: Data Exploration Script', '', 'beginner') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Data Wrangling & SQL
