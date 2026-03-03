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
    VALUES (topic_datascience_3_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Matplotlib gives you complete control over every pixel in a chart — but that power comes with verbosity. The object-oriented API (`fig, ax = plt.subplots()`, then `ax.plot(...)`) is the professional way to use Matplotlib — it''s explicit and composable, unlike the implicit `plt.plot()` style that confuses beginners. Learn the OO API now; it also makes Seaborn and Pandas plotting understandable because they wrap it.', 3);
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
    VALUES (topic_datascience_3_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Seaborn is built for exploratory data analysis — it adds statistical context to visuals automatically. A `boxplot` doesn''t just show distribution shape; it marks the median, quartiles, and outliers in one chart. A `regplot` adds a regression line with confidence interval. The `hue` parameter lets you split any chart by a categorical variable to spot group-level patterns instantly. Think of Seaborn as Matplotlib with statistical intelligence baked in.', 3);
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
    VALUES (topic_datascience_3_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Static charts belong in PDFs and academic papers. Interactive charts belong everywhere else. When a stakeholder can hover over a data point to see exact values, zoom into a time range, or filter by clicking a legend item — their questions get answered without a follow-up email to you. Plotly''s `.to_html(include_plotlyjs=''cdn'')` exports a single HTML file that works in any browser with no dependencies — easy to share, email, or embed in a portfolio page.', 3);
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
    VALUES (topic_datascience_3_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The EDA process: (1) understand what each column means — domain knowledge first, code second. (2) Look at distributions of individual columns. (3) Look at relationships between pairs. (4) Look at relationships across 3+ dimensions simultaneously. The biggest EDA mistake beginners make is jumping straight to correlation matrices and scatterplot matrices without first understanding what the data represents. A chart without domain knowledge is just a picture.', 3);
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
    VALUES (topic_datascience_3_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Feature engineering is where domain knowledge meets technical skill — and it''s often the difference between a model that scores 75% and one that scores 85% on the same dataset. Before touching a machine learning algorithm, ask: what transformations of the raw data might make patterns more learnable? Log-transforming a right-skewed price column reduces the influence of extreme values and often dramatically improves model performance on price prediction tasks.', 3);
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
    VALUES (topic_datascience_3_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Publishing on Kaggle serves two purposes: the community feedback loop (comments, upvotes, forking) accelerates your learning faster than any tutorial, and your public Kaggle profile becomes part of your data science portfolio. Hiring managers do look at Kaggle profiles. A notebook with 50+ upvotes is a credible signal of communication and analytical quality — not just code that runs.', 2);
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
