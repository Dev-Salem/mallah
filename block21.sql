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
    VALUES (topic_datascience_7_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Implementing a neural network from scratch in NumPy is the most clarifying exercise in deep learning. When you write `output = sigmoid(np.dot(W, input) + b)` and then derive the gradient update by hand — backpropagation stops being mysterious. You understand why vanishing gradients happen with sigmoid, why ReLU is usually better, and why batch size affects training stability. This understanding makes debugging real PyTorch models dramatically easier.', 3);
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
    VALUES (topic_datascience_7_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'PyTorch is the dominant framework for research and production ML in 2026. Its dynamic computation graph (define-by-run) makes debugging natural — you can add a `print()` anywhere in your model and it works. The training loop in PyTorch is explicit: zero gradients → forward pass → compute loss → backward pass → update weights. Understanding this loop deeply means you''ll never be confused about when to call `optimizer.zero_grad()` or why `loss.backward()` must come before `optimizer.step()`.', 3);
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
    VALUES (topic_datascience_7_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'NLP tasks — sentiment analysis, topic modelling, text classification, named entity recognition — are among the most commercially valuable data science applications. The fundamental pipeline: raw text → tokens → numerical representation → model. TF-IDF (Term Frequency-Inverse Document Frequency) scores words by how often they appear in a document weighted against how common they are across all documents — common words like "the" get low scores; rare but meaningful words get high scores. It''s often the strongest baseline for text classification.', 3);
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
    VALUES (topic_datascience_7_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Transfer learning is the most important paradigm shift in modern AI. Instead of training a model from scratch on your specific task (which requires massive data and compute), you take a model pre-trained on billions of text tokens and fine-tune it on your few thousand examples. DistilBERT is 40% smaller than BERT but retains 97% of its performance — a sensible trade-off for learning projects and production systems where latency matters. The HuggingFace ecosystem is the industry standard for NLP in 2026.', 3);
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
    VALUES (topic_datascience_7_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Convolutional layers are not magic — each filter is a small matrix that slides across an image, detecting a specific pattern (edge, texture, colour gradient). Early layers detect simple patterns; deeper layers detect complex ones (eyes, wheels, faces). Transfer learning works because these learned features are general — a model trained on ImageNet''s 1.2M images learns filters useful for almost any visual recognition task. You fine-tune only the final layer (which maps features to your specific classes) while keeping the earlier feature detectors frozen.', 3);
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
    VALUES (topic_datascience_7_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'A model that lives only in a notebook is invisible. A model with a live URL that anyone can demo in 30 seconds is a portfolio piece. Streamlit transforms a Python script into a web app with almost no extra code — `st.text_input()`, `st.button()`, `st.write()` cover most use cases. Streamlit Cloud deploys from GitHub for free. This project should be the first link in your portfolio — something you can open on a phone during a coffee chat and demo instantly.', 3);
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
