-- Cybersecurity Curriculum Seed Data
-- Stage: Foundations: Networking & Operating Systems
DO $$
DECLARE
  stage_cybersecurity_1_id uuid;
BEGIN
  INSERT INTO public.stages (path_id, title, order_index, difficulty_level)
  VALUES ('cybersecurity', 'Foundations: Networking & Operating Systems', 1, 'beginner')
  RETURNING stage_id INTO stage_cybersecurity_1_id;

  DECLARE
    topic_cybersecurity_1_1_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_cybersecurity_1_id, 'How Networks Work: The OSI & TCP/IP Models', '', 'concept', 2, 'beginner', 1)
    RETURNING topic_id INTO topic_cybersecurity_1_1_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_1_id, 'VIDEO', 'Networking Fundamentals', 'https://www.youtube.com/watch?v=0uflG0SemyM', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_1_id, 'ARTICLE', 'The OSI Model', 'https://www.comptia.org/content/guides/what-is-the-osi-model', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_1_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'The OSI model isn''t just exam fodder — it''s a debugging framework. When something doesn''t work on a network, you work down from Layer 7 (is the application configured correctly?) to Layer 1 (is the cable plugged in?). When something is being attacked, you think about which layer the attack targets. SQL injection is a Layer 7 attack. ARP poisoning is Layer 2. SYN floods are Layer 4. This mental model makes every security concept you encounter make sense immediately.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('networking', 'Networking', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_1_id, 'networking') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_cybersecurity_1_2_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_cybersecurity_1_id, 'Protocols That Matter for Security: HTTP, HTTPS, DNS, FTP, SSH, SMTP', '', 'concept', 2, 'beginner', 2)
    RETURNING topic_id INTO topic_cybersecurity_1_2_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_2_id, 'VIDEO', 'HTTP Explained', 'https://www.youtube.com/watch?v=iYM2zFP3Zn0', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_2_id, 'ARTICLE', 'HTTP Overview', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_2_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'HTTP headers are gold for an attacker: `Server: Apache/2.2.17` reveals a version from 2010 with known CVEs. `X-Powered-By: PHP/5.3.6` tells you the entire backend stack. Most headers that make a defender''s life easier (CSP, HSTS, X-Frame-Options) are absent on poorly configured sites. Understanding exactly what information HTTP exposes is the first step to understanding web application security — both attacking and hardening.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('networking', 'Networking', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_2_id, 'networking') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('http_basics', 'HTTP basics', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_2_id, 'http_basics') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_cybersecurity_1_3_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_cybersecurity_1_id, 'Operating Systems: Windows & Linux Security Architecture', '', 'concept', 2, 'beginner', 3)
    RETURNING topic_id INTO topic_cybersecurity_1_3_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_3_id, 'VIDEO', 'Linux for Hackers', 'https://www.youtube.com/watch?v=VbEx7B_PTOE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_3_id, 'ARTICLE', 'Linux File Permissions', 'https://linuxcommand.org/lc3_lts0090.php', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_3_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Every professional penetration tester is fluent in both Windows and Linux because real-world networks run both. Windows dominates corporate environments (Active Directory, Exchange, IIS). Linux dominates servers, cloud infrastructure, and IoT. SUID binaries are a classic Linux privilege escalation vector — when a binary runs as root regardless of who executes it, a bug in that binary can be exploited to get a root shell. GTFOBins (gtfobins.github.io) is the reference for commonly abused SUID binaries.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('linux', 'Linux', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_3_id, 'linux') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('windows', 'Windows', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_3_id, 'windows') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_cybersecurity_1_4_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_cybersecurity_1_id, 'Virtualisation & Building Your Home Lab', '', 'lesson', 3, 'beginner', 4)
    RETURNING topic_id INTO topic_cybersecurity_1_4_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_4_id, 'VIDEO', 'Build an Ethical Hacking Home Lab', 'https://www.youtube.com/watch?v=mvsiSHjbNvA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_4_id, 'ARTICLE', 'Kali Linux Download & VM setup', 'https://www.kali.org/get-kali/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_4_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your home lab is the most important investment in this path. Having your own attack-and-defend environment means you can experiment freely without fear of legal consequences or breaking anything real. The Metasploitable VM is intentionally full of vulnerabilities — it exists specifically for this purpose. Every technique you''ll learn in Stages 4–6 will be practised here first before you go to TryHackMe or HackTheBox challenges. Always restore from a snapshot before a new exercise — this gives you a clean target every time.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('virtualisation', 'Virtualisation', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_4_id, 'virtualisation') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('kali_linux', 'Kali Linux', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_4_id, 'kali_linux') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_cybersecurity_1_5_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_cybersecurity_1_id, 'The Ethical Hacking Framework: Methodology & Legal Foundations', '', 'concept', 1, 'beginner', 5)
    RETURNING topic_id INTO topic_cybersecurity_1_5_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_5_id, 'VIDEO', 'Ethical Hacking Full Course Introduction', 'https://www.youtube.com/watch?v=3Kq1MIfTWCE', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_5_id, 'ARTICLE', 'OWASP Testing Guide', 'https://owasp.org/www-project-web-security-testing-guide/', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_5_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Methodology matters more than tools. A professional penetration tester follows a repeatable, documented process — not "run tools until something interesting happens." Every engagement starts with a written scope agreement that defines exactly what can and cannot be tested. Scanning a server not listed in scope — even accidentally — is a breach of contract and potentially illegal. Bug bounty programs are the closest thing to practicing legally on real production systems: companies explicitly invite researchers to find vulnerabilities in defined scopes.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('security_fundamentals', 'Security Fundamentals', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_5_id, 'security_fundamentals') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('ethical_hacking_methodology', 'Ethical Hacking Methodology', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_5_id, 'ethical_hacking_methodology') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_cybersecurity_1_6_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_cybersecurity_1_id, 'Python & Bash for Security Scripting', '', 'lesson', 2, 'beginner', 6)
    RETURNING topic_id INTO topic_cybersecurity_1_6_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_6_id, 'VIDEO', 'Python for Ethical Hacking', 'https://www.youtube.com/watch?v=XWuP5Yf5ILI', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_6_id, 'ARTICLE', 'Python socket module', 'https://docs.python.org/3/library/socket.html', NULL, 2);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_6_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Security professionals who can script are 10x more effective than those who can''t. A port scanner that takes 3 minutes manually takes 3 seconds in a loop. A password wordlist that has 100,000 entries needs automation to process. More importantly, understanding how tools like Nmap work internally — they''re all built on the same socket connections you''ll write here — makes you a better user of those tools when something unexpected happens.', 3);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('python', 'Python', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_6_id, 'python') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('bash', 'Bash', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_6_id, 'bash') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('scripting', 'Scripting', 'practice') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_6_id, 'scripting') ON CONFLICT DO NOTHING;
  END;
  DECLARE
    topic_cybersecurity_1_7_id uuid;
  BEGIN
    INSERT INTO public.topics (stage_id, title, summary, topic_type, estimated_time_min, difficulty_level, order_index)
    VALUES (stage_cybersecurity_1_id, 'PROJECT: Home Lab Setup & Documentation', '', 'project_milestone', 4, 'beginner', 7)
    RETURNING topic_id INTO topic_cybersecurity_1_7_id;

    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_7_id, 'VIDEO', 'Complete Home Lab Tutorial', 'https://www.youtube.com/watch?v=LqRqvkGEiSA', NULL, 1);
    INSERT INTO public.topic_resources (topic_id, resource_type, title, url, content, order_index)
    VALUES (topic_cybersecurity_1_7_id, 'INTERNAL_TEXT', 'Mallah Context', NULL, 'Your GitHub repo for this path should be **private** — not because the content is secret, but because public repositories documenting hacking techniques, even against lab environments, can be misinterpreted and attract the wrong attention. Keep lab notes, pentest reports, and tool configurations private. Your portfolio pieces for this path are CTF write-ups and bug bounty reports — those can be public, because they document findings on systems you were explicitly authorised to test.', 2);
    INSERT INTO public.skills (skill_id, name, category) VALUES ('virtualisation', 'Virtualisation', 'tool') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_7_id, 'virtualisation') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('kali_linux', 'Kali Linux', 'platform_service') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_7_id, 'kali_linux') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('networking', 'Networking', 'fundamentals') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_7_id, 'networking') ON CONFLICT DO NOTHING;
    INSERT INTO public.skills (skill_id, name, category) VALUES ('bash', 'Bash', 'language') ON CONFLICT (skill_id) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category;
    INSERT INTO public.topic_skills (topic_id, skill_id) VALUES (topic_cybersecurity_1_7_id, 'bash') ON CONFLICT DO NOTHING;
    INSERT INTO public.projects (stage_id, title, description, difficulty_level) VALUES (stage_cybersecurity_1_id, 'PROJECT: Home Lab Setup & Documentation', '', 'beginner') ON CONFLICT DO NOTHING;
  END;
END $$;

-- Stage: Linux & Command Line Mastery
