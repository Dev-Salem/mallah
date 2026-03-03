    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_2_id, 'typescript') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Rate Limiting, Security Headers & OWASP Basics', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_fullstack_8_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'VIDEO', 'Express Security Best Practices', 'https://www.youtube.com/watch?v=igehB5dPidI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'ARTICLE', 'OWASP Top 10', 'https://owasp.org/www-project-top-ten/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Security is not a feature you add at the end ƒ?" it''s a practice you maintain throughout. `helmet` adds dozens of security headers in one line. Rate limiting on auth routes prevents brute-force attacks. Input sanitisation prevents XSS. The OWASP Top 10 is the industry standard list of the most critical security risks ƒ?" every developer should read it at least once. These mitigations aren''t optional for anything real users will use.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('web_security', 'Web Security', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_3_id, 'web_security') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Emails, Background Jobs & Queues', '', 'lesson', 2, 'advanced', 4)
    RETURNING topic_id INTO topic_fullstack_8_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'VIDEO', 'Send Emails with Resend & Node.js', 'https://www.youtube.com/watch?v=P3MlSFJWMqo', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'ARTICLE', 'Resend Node.js SDK', 'https://resend.com/docs/send-with-nodejs', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Email verification protects your database from fake accounts and ensures you can reach users. Resend is the cleanest transactional email API for developers ƒ?" the free tier sends 3,000 emails/month. The email verification token should be a random string (not a JWT) stored hashed in the database with an expiry timestamp. Never send the token in plain text in a URL and store it plain ƒ?" always hash it, just like passwords.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('node_js', 'Node.js', 'platform_service') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_4_id, 'node_js') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'Capstone Planning & Architecture', '', 'lesson', 2, 'advanced', 5)
    RETURNING topic_id INTO topic_fullstack_8_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'VIDEO', 'How to Plan a Full-Stack Project', 'https://www.youtube.com/watch?v=0pThnRneDjw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'ARTICLE', 'Writing a Technical Spec', 'https://basecamp.com/shapeup/1.5-chapter-06', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Professional developers don''t open their code editor first ƒ?" they think first. A technical spec forces you to make decisions on paper (cheap) rather than in code (expensive to change). Your ERD will expose missing relations. Your API list will reveal inconsistencies. Your component tree will catch missing pages. Spending 2 hours planning saves 20 hours of refactoring.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('system_design', 'System Design', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_fullstack_8_5_id, 'system_design') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_fullstack_8_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_fullstack_8_id, 'PROJECT: Capstone Full-Stack Product', '', 'project_capstone', 30, 'advanced', 6)
    RETURNING topic_id INTO topic_fullstack_8_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_6_id, 'ARTICLE', 'Readme Driven Development', 'https://tom.preston-werner.com/2010/08/23/readme-driven-development.html', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_fullstack_8_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your capstone is what employers will actually look at. Not your certificates, not your course completion, not your freeCodeCamp badge. When a hiring manager Googles your name, this project should come up. Make it something you''re proud to demo in a 30-minute interview. The README should be so good that a developer you''ve never met could clone it, run it, and understand exactly what it does and why every decision was made.', 2);
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_fullstack_8_id, 'PROJECT: Capstone Full-Stack Product', '', 'advanced') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Python for Data Science
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
    VALUES (topic_datascience_1_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Data science Python is different from web developer Python. You''ll spend less time on classes and design patterns, and more time on list comprehensions, lambda functions, and working with data structures that mirror tables. Jupyter Notebooks are the default environment because they let you run one cell at a time, see output immediately, and embed charts alongside code ƒ?" perfect for exploratory work where you don''t yet know what the data will reveal.', 3);
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
    VALUES (topic_datascience_1_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'NumPy is the engine beneath almost all data science in Python. Pandas DataFrames are built on NumPy arrays. Scikit-learn models take NumPy arrays as input. When you understand NumPy''s vectorised operations ƒ?" doing math on entire arrays without loops ƒ?" you understand why Python can process millions of rows quickly. The key concept is broadcasting: applying an operation across arrays of different shapes without writing loops. Internalize it now and everything downstream becomes clearer.', 3);
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
    VALUES (topic_datascience_1_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Pandas is to data science what SQL is to databases ƒ?" it''s the primary tool for selecting, slicing, and filtering tabular data. Most of your data science life will be spent in Pandas DataFrames. The crucial distinction: `.loc` selects by label (column name, index label), `.iloc` selects by integer position. Getting this wrong causes subtle bugs. Boolean indexing (`df[df[''age''] > 30]`) is the most frequently used pattern in EDA ƒ?" learn it until it''s automatic.', 3);
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
    VALUES (topic_datascience_1_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`groupby` is the Pandas equivalent of SQL''s `GROUP BY` ƒ?" it splits a DataFrame into groups and applies an aggregation function to each. The pattern `df.groupby(''column'')[''metric''].agg([''mean'', ''count''])` covers 80% of real-world grouping tasks. Missing value handling is the most common first task on any real dataset ƒ?" real data always has holes. Understanding *why* data is missing (random vs systematic) affects what you do with it. Imputing with median per subgroup (like `Pclass`) is smarter than imputing with the global median because it preserves group-level patterns.', 3);
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
    VALUES (topic_datascience_1_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Data science code that lives only in notebooks is hard to reuse and impossible to test. Wrapping your logic in functions lets you call the same cleaning process on multiple datasets, write unit tests, and share code across projects. The Scikit-learn API is built entirely on OOP ƒ?" every model is a class with `.fit()` and `.predict()` methods. Understanding that pattern (even without deep OOP knowledge) makes Scikit-learn feel logical rather than magical.', 3);
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
    VALUES (topic_datascience_1_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Real data science starts with data acquisition. In the real world, data doesn''t arrive as a clean CSV waiting for you ƒ?" you fetch it from APIs, scrape it from websites, query it from databases, or receive it as a messy Excel file with merged cells and hidden rows. Building fluency with data sourcing before modelling means you can work on real problems, not just tutorial datasets.', 3);
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
    VALUES (topic_datascience_1_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The goal of this project isn''t the output ƒ?" it''s the habit. Data scientists who write reproducible, reusable code from the start build better projects faster. Your exploration script should be something you actually use on every future project in this path. Add to it as you learn new techniques. By Stage 8, it should feel like your personal toolkit.', 3);
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
    VALUES (topic_datascience_2_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Data scientists spend 60ƒ?"80% of project time cleaning data ƒ?" not building models. The critical skill isn''t knowing which function to call; it''s developing the judgment to ask: why is this data missing? A column with 40% missing values in a medical dataset might be missing *because* the test wasn''t done for healthy patients ƒ?" and deleting those rows would introduce bias. Clean data first, model second. Always.', 3);
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
    VALUES (topic_datascience_2_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Merging datasets is one of the most powerful data wrangling operations ƒ?" and one of the most error-prone. The most common mistake: not checking for duplicate keys before merging, which causes row explosion (a 100-row DataFrame merged with a 100-row DataFrame becomes 10,000 rows if keys aren''t unique). Always check with `df.duplicated(subset=[''key'']).sum()` before a merge. Pivot tables are SQL''s `GROUP BY` with a visual pivot ƒ?" once you internalise them, a whole category of "how many X per Y?" questions become one-liners.', 3);
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
    VALUES (topic_datascience_2_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Time series data is everywhere: stock prices, website traffic, sensor readings, sales figures. The critical concept is resampling ƒ?" aggregating fine-grained data (hourly readings) into coarser units (daily averages) without losing temporal ordering. Rolling averages are the most used smoothing technique ƒ?" they reduce noise so you can see underlying trends. In job interviews, time series questions are extremely common. Start thinking in these temporal patterns early.', 3);
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
    VALUES (topic_datascience_2_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'SQL is the most commonly tested skill in data science interviews ƒ?" not Python, not machine learning. Every data scientist needs to query databases to get the data they''ll later analyse. Window functions (ROW_NUMBER, RANK, LAG) are what separate intermediate from advanced SQL users ƒ?" they let you compute running totals, rank within groups, and compare rows to previous/next rows without self-joins. Learn them now; they appear in almost every SQL interview.', 3);
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
    VALUES (topic_datascience_2_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, '`.apply()` with a lambda is the most common performance trap in data science code. It runs Python in a loop under the hood ƒ?" on 1M rows, it''s 10ƒ?"100x slower than vectorised Pandas operations. The rule: if a vectorised Pandas or NumPy function exists for your operation, use it. If it doesn''t, `.apply()` is acceptable for small datasets but should be refactored for large ones. Method chaining (`df.pipe(clean).pipe(engineer).pipe(validate)`) makes data pipelines readable and auditable ƒ?" each step is a named, testable function.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_5_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_5_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_2_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_2_id, 'PROJECT: Messy Data ƒ+' Clean Insights', '', 'project_milestone', 8, 'intermediate', 6)
    RETURNING topic_id INTO topic_datascience_2_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_6_id, 'ARTICLE', 'Kaggle Datasets', 'https://www.kaggle.com/datasets', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_6_id, 'ARTICLE', 'data.gov', 'https://data.gov/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_2_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Choosing your own dataset for this project is intentional. The discipline of finding, loading, and auditing a completely unknown dataset ƒ?" with no instructions ƒ?" is the core skill of a data scientist. The dataset you choose should be something you''re genuinely curious about. Curiosity produces better analysis. When your questions are real, your investigation is thorough.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'pandas') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('data_wrangling', 'Data Wrangling', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'data_wrangling') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('sql', 'SQL', 'language') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_2_6_id, 'sql') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_2_id, 'PROJECT: Messy Data ƒ+' Clean Insights', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Exploratory Data Analysis & Visualisation
DO $$
DECLARE
  stage_datascience_3_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('datascience', 'Exploratory Data Analysis & Visualisation', 3, 'beginner')
  RETURNING stage_id INTO stage_datascience_3_id;

  DECLARE
    topic_datascience_3_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Matplotlib: The Foundation of Python Visualisation', '', 'lesson', 2, 'beginner', 1)
    RETURNING topic_id INTO topic_datascience_3_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_1_id, 'VIDEO', 'Matplotlib Tutorial', 'https://www.youtube.com/playlist?list=PL-osiE80TeTvipOqomVEeZ1HRrcEvtZB_', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_1_id, 'ARTICLE', 'Matplotlib Tutorials', 'https://matplotlib.org/stable/tutorials/index.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Matplotlib gives you complete control over every pixel in a chart ƒ?" but that power comes with verbosity. The object-oriented API (`fig, ax = plt.subplots()`, then `ax.plot(...)`) is the professional way to use Matplotlib ƒ?" it''s explicit and composable, unlike the implicit `plt.plot()` style that confuses beginners. Learn the OO API now; it also makes Seaborn and Pandas plotting understandable because they wrap it.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('matplotlib', 'Matplotlib', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_1_id, 'matplotlib') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Seaborn: Statistical Visualisation', '', 'lesson', 1, 'beginner', 2)
    RETURNING topic_id INTO topic_datascience_3_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_2_id, 'VIDEO', 'Seaborn Tutorial', 'https://www.youtube.com/watch?v=6GUZXDef2U0', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_2_id, 'ARTICLE', 'Seaborn Tutorial', 'https://seaborn.pydata.org/tutorial.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Seaborn is built for exploratory data analysis ƒ?" it adds statistical context to visuals automatically. A `boxplot` doesn''t just show distribution shape; it marks the median, quartiles, and outliers in one chart. A `regplot` adds a regression line with confidence interval. The `hue` parameter lets you split any chart by a categorical variable to spot group-level patterns instantly. Think of Seaborn as Matplotlib with statistical intelligence baked in.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seaborn', 'Seaborn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_2_id, 'seaborn') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Plotly: Interactive Visualisation', '', 'lesson', 1, 'intermediate', 3)
    RETURNING topic_id INTO topic_datascience_3_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_3_id, 'VIDEO', 'Plotly Express Tutorial', 'https://www.youtube.com/watch?v=_b2KXL0wHQg', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_3_id, 'ARTICLE', 'Plotly Python', 'https://plotly.com/python/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Static charts belong in PDFs and academic papers. Interactive charts belong everywhere else. When a stakeholder can hover over a data point to see exact values, zoom into a time range, or filter by clicking a legend item ƒ?" their questions get answered without a follow-up email to you. Plotly''s `.to_html(include_plotlyjs=''cdn'')` exports a single HTML file that works in any browser with no dependencies ƒ?" easy to share, email, or embed in a portfolio page.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('plotly', 'Plotly', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_3_id, 'plotly') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'The EDA Framework: A Structured Approach', '', 'lesson', 2, 'intermediate', 4)
    RETURNING topic_id INTO topic_datascience_3_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_4_id, 'VIDEO', 'Exploratory Data Analysis', 'https://www.youtube.com/watch?v=xi0vhXFPegw', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_4_id, 'ARTICLE', 'EDA Guide', 'https://towardsdatascience.com/exploratory-data-analysis-8fc1cb20fd15', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The EDA process: (1) understand what each column means ƒ?" domain knowledge first, code second. (2) Look at distributions of individual columns. (3) Look at relationships between pairs. (4) Look at relationships across 3+ dimensions simultaneously. The biggest EDA mistake beginners make is jumping straight to correlation matrices and scatterplot matrices without first understanding what the data represents. A chart without domain knowledge is just a picture.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_4_id, 'exploratory_data_analysis') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'Feature Engineering Basics', '', 'lesson', 2, 'intermediate', 5)
    RETURNING topic_id INTO topic_datascience_3_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_5_id, 'VIDEO', 'Feature Engineering', 'https://www.youtube.com/watch?v=6WDFfaYtN6s', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_5_id, 'ARTICLE', 'Feature Engineering for Machine Learning', 'https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Feature engineering is where domain knowledge meets technical skill ƒ?" and it''s often the difference between a model that scores 75% and one that scores 85% on the same dataset. Before touching a machine learning algorithm, ask: what transformations of the raw data might make patterns more learnable? Log-transforming a right-skewed price column reduces the influence of extreme values and often dramatically improves model performance on price prediction tasks.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_5_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('pandas', 'Pandas', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_5_id, 'pandas') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_datascience_3_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_datascience_3_id, 'PROJECT: EDA Report', '', 'project_milestone', 8, 'intermediate', 6)
    RETURNING topic_id INTO topic_datascience_3_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_6_id, 'ARTICLE', 'How to write a great Kaggle notebook', 'https://www.kaggle.com/discussions/general/273726', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_datascience_3_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Publishing on Kaggle serves two purposes: the community feedback loop (comments, upvotes, forking) accelerates your learning faster than any tutorial, and your public Kaggle profile becomes part of your data science portfolio. Hiring managers do look at Kaggle profiles. A notebook with 50+ upvotes is a credible signal of communication and analytical quality ƒ?" not just code that runs.', 2);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('matplotlib', 'Matplotlib', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'matplotlib') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('seaborn', 'Seaborn', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'seaborn') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('plotly', 'Plotly', 'framework_library') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'plotly') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('exploratory_data_analysis', 'Exploratory Data Analysis', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'exploratory_data_analysis') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('feature_engineering', 'Feature Engineering', 'practice') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_datascience_3_6_id, 'feature_engineering') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_datascience_3_id, 'PROJECT: EDA Report', '', 'intermediate') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Statistics & Probability Foundations
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
    VALUES (topic_datascience_4_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The Central Limit Theorem is the single most important theorem in statistics for data science: regardless of the shape of the original distribution, the distribution of sample means approaches normal as sample size grows. This is why we can apply statistical tests to non-normal data. Josh Starmer''s StatQuest YouTube channel is the best statistics resource ever made for practitioners ƒ?" clear, visual, with minimal jargon. Watch the CLT video twice.', 3);
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
    VALUES (topic_datascience_4_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The p-value is the most misunderstood concept in data science. A p-value of 0.04 does NOT mean "there''s a 96% chance the effect is real." It means "if the null hypothesis were true, there''s a 4% chance of observing data at least this extreme." Effect size (Cohen''s d, Cramer''s V) tells you whether the effect is practically meaningful ƒ?" a result can be statistically significant but so tiny it doesn''t matter. Always report both.', 3);
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
    VALUES (topic_datascience_4_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Use `statsmodels` when you care about statistical inference ƒ?" p-values, confidence intervals, coefficient interpretability, RAý. Use Scikit-learn when you care about predictive performance ƒ?" cross-validation, pipelines, hyperparameter tuning. These are two different goals. In data science you often need both: `statsmodels` to understand *why* a feature matters, Scikit-learn to build a model that actually predicts well.', 3);
