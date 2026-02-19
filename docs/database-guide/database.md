# Mallah – Database Design (Implementation-Level)

This document describes the **relational database schema** for Mallah in an implementation-ready way.

- Works with any SQL RDBMS (MySQL / PostgreSQL).
- Column names are **snake_case**.
- `PK` = Primary Key, `FK` = Foreign Key.

---

## 0. Global Conventions

- `INT` = integer (size depends on DB).
- `VARCHAR(n)` = variable-length string.
- `TEXT` = long text.
- `DATETIME` = timestamp (with time zone if supported).
- `BOOLEAN` = true/false (or TINYINT(1)).
- `ENUM(...)` = use DB enum or `VARCHAR` + check constraint.

Common columns (where used):

- `created_at` – `DATETIME`, default NOW.
- `updated_at` – `DATETIME`, updated via trigger/app.

---

## 1. Users & Roles

### 1.1 `users`

Base identity table (supertype for Learner & Admin).

| Column         | Type            | Constraints           | Description                         |
|----------------|-----------------|------------------------|-------------------------------------|
| `user_id`      | INT             | PK, AUTO_INCREMENT     | Unique user ID                      |
| `email`        | VARCHAR(255)    | UNIQUE, NOT NULL       | Login email                         |
| `password_hash`| VARCHAR(255)    | NOT NULL               | Hashed password                     |
| `status`       | ENUM('active','blocked') | NOT NULL, DEFAULT 'active' | Account status          |
| `created_at`   | DATETIME        | NOT NULL               | Creation time                       |
| `last_login_at`| DATETIME        | NULL                   | Last login time                     |

---

### 1.2 `learners`

Subtype of `users` – all fields attached to learner onboarding & preferences.

| Column                  | Type                                        | Constraints               | Description                                                |
|-------------------------|---------------------------------------------|---------------------------|------------------------------------------------------------|
| `user_id`               | INT                                         | PK, FK → `users.user_id`  | Same ID as in `users`                                     |
| `first_name`            | VARCHAR(100)                                | NOT NULL                  | Learner first name                                         |
| `last_name`             | VARCHAR(100)                                | NOT NULL                  | Learner last name                                          |
| `background_type`       | ENUM('Student','FreshGraduate','CareerShifter','NoTechBackground') | NOT NULL | From onboarding |
| `primary_goal`          | ENUM('FullTimeJob','Freelance','OwnProject') | NOT NULL                | Career goal                                                |
| `onboarding_completed`  | BOOLEAN                                     | NOT NULL, DEFAULT 0       | Finished onboarding wizard or not                          |
| `current_path_id`       | INT                                         | NULL, FK → `paths.path_id`| Recommended/selected path                                  |
| `ai_language_pref`      | ENUM('AR','EN','MIX')                       | NOT NULL, DEFAULT 'AR'    | Preferred AI language                                      |
| `ai_detail_level`       | ENUM('Short','Balanced','Detailed')        | NOT NULL, DEFAULT 'Balanced' | Preferred response length                             |
| `weekly_learning_hours` | INT                                         | NULL                      | Approx. hours available per week                           |
| `learning_style_primary`| ENUM('Video','Reading','HandsOn')          | NULL                      | Main learning style                                        |

---

### 1.3 `admins`

Subtype of `users` – platform admins.

| Column         | Type         | Constraints              | Description                |
|----------------|--------------|--------------------------|----------------------------|
| `user_id`      | INT          | PK, FK → `users.user_id` | Same ID as in `users`      |
| `display_name` | VARCHAR(150) | NOT NULL                 | Admin display name         |
| `admin_level`  | ENUM('normal','super') | NOT NULL, DEFAULT 'normal' | Admin rank        |

---

## 2. Learning Content

### 2.1 `paths`

High-level learning paths.

| Column             | Type         | Constraints                 | Description                            |
|--------------------|--------------|-----------------------------|----------------------------------------|
| `path_id`          | INT          | PK, AUTO_INCREMENT          | Path ID                                |
| `name`             | VARCHAR(150) | NOT NULL                    | Path name (e.g. Frontend Development)  |
| `short_description`| TEXT         | NOT NULL                    | Short description                      |
| `is_active`        | BOOLEAN      | NOT NULL, DEFAULT 1         | Path availability                      |

---

### 2.2 `stages`

Stages inside a path.

| Column            | Type                                   | Constraints                    | Description                           |
|-------------------|----------------------------------------|--------------------------------|---------------------------------------|
| `stage_id`        | INT                                   | PK, AUTO_INCREMENT             | Stage ID                              |
| `path_id`         | INT                                   | NOT NULL, FK → `paths.path_id` | Parent path                           |
| `title`           | VARCHAR(150)                          | NOT NULL                       | Stage title                           |
| `description`     | TEXT                                  | NOT NULL                       | Stage description                     |
| `difficulty_level`| ENUM('Beginner','Intermediate','Advanced') | NOT NULL                 | Difficulty of this stage             |
| `order_index`     | INT                                   | NOT NULL                       | Order within path (1,2,3,...)         |

---

### 2.3 `topics`

Individual lessons/topics inside a stage.

| Column            | Type                                   | Constraints                    | Description                                    |
|-------------------|----------------------------------------|--------------------------------|------------------------------------------------|
| `topic_id`        | INT                                   | PK, AUTO_INCREMENT             | Topic ID                                       |
| `stage_id`        | INT                                   | NOT NULL, FK → `stages.stage_id` | Parent stage                                 |
| `title`           | VARCHAR(200)                          | NOT NULL                       | Topic title                                    |
| `summary`         | TEXT                                  | NOT NULL                       | Short explanation                              |
| `estimated_time_min` | INT                                | NULL                           | Estimated time in minutes                      |
| `difficulty_level`| ENUM('Beginner','Intermediate','Advanced') | NOT NULL                  | Topic difficulty                               |
| `order_index`     | INT                                   | NOT NULL                       | Order inside stage                             |

---

### 2.4 `topic_resources`

Weak conceptually (depends on Topic). Implementation uses a PK.

| Column          | Type                                     | Constraints                        | Description                                  |
|-----------------|------------------------------------------|------------------------------------|----------------------------------------------|
| `resource_id`   | INT                                      | PK, AUTO_INCREMENT                 | Resource ID                                  |
| `topic_id`      | INT                                      | NOT NULL, FK → `topics.topic_id`   | Parent topic                                 |
| `resource_type` | ENUM('VIDEO','ARTICLE','INTERNAL_TEXT')  | NOT NULL                           | Type of resource                             |
| `title`         | VARCHAR(200)                             | NOT NULL                           | Resource title                               |
| `url`           | TEXT                                     | NULL                               | External link (video/article)                |
| `content`       | TEXT                                     | NULL                               | Internal text (for INTERNAL_TEXT)            |
| `order_index`   | INT                                      | NOT NULL                           | Order within topic                           |

---

## 3. Progress & Skills

### 3.1 `user_progress`

Tracks user status for each topic.

| Column        | Type                                                       | Constraints                                   | Description                                      |
|---------------|------------------------------------------------------------|-----------------------------------------------|--------------------------------------------------|
| `user_id`     | INT                                                        | PK (composite), FK → `users.user_id`          | Learner ID                                       |
| `topic_id`    | INT                                                        | PK (composite), FK → `topics.topic_id`        | Topic ID                                         |
| `status`      | ENUM('NotStarted','InProgress','Completed')                | NOT NULL, DEFAULT 'NotStarted'                | Progress status                                  |
| `completed_at`| DATETIME                                                   | NULL                                          | Completion time (if Completed)                   |
| `last_accessed_at` | DATETIME                                              | NULL                                          | Last time user opened this topic                 |

---

### 3.2 `skills`

Master skill catalog.

| Column        | Type                                            | Constraints               | Description                                    |
|---------------|-------------------------------------------------|---------------------------|------------------------------------------------|
| `skill_id`    | INT                                             | PK, AUTO_INCREMENT        | Skill ID                                       |
| `name`        | VARCHAR(150)                                   | NOT NULL, UNIQUE          | Skill name (HTML, Git, Docker...)              |
| `description` | TEXT                                           | NULL                      | Skill description                              |
| `category`    | ENUM('Technical','ToolPlatform','FrameworkLibrary','SoftSkill') | NOT NULL | Skill category                                  |

---

### 3.3 `user_skills`

Skills acquired by learners.

| Column        | Type                                        | Constraints                                   | Description                                   |
|---------------|---------------------------------------------|-----------------------------------------------|-----------------------------------------------|
| `user_id`     | INT                                         | PK (composite), FK → `users.user_id`          | Learner ID                                    |
| `skill_id`    | INT                                         | PK (composite), FK → `skills.skill_id`        | Skill ID                                      |
| `level`       | ENUM('Beginner','Intermediate','Advanced')  | NOT NULL                                      | Skill level for this learner                  |
| `source`      | ENUM('Roadmap','Project','Manual')          | NOT NULL                                      | How skill was acquired                        |
| `acquired_at` | DATETIME                                    | NOT NULL                                      | When user acquired this skill                 |

---

### 3.4 `topic_skills`

Which skills are covered by each topic.

| Column               | Type                                        | Constraints                                      | Description                                     |
|----------------------|---------------------------------------------|--------------------------------------------------|-------------------------------------------------|
| `topic_id`           | INT                                         | PK (composite), FK → `topics.topic_id`          | Topic ID                                        |
| `skill_id`           | INT                                         | PK (composite), FK → `skills.skill_id`          | Skill ID                                        |
| `contribution_level` | ENUM('Intro','Practice','Advanced')         | NULL                                             | How strongly topic contributes to this skill    |

---

## 4. Projects

### 4.1 `projects`

Project templates/ideas available on the platform.

| Column          | Type                                                       | Constraints                    | Description                                   |
|-----------------|------------------------------------------------------------|--------------------------------|-----------------------------------------------|
| `project_id`    | INT                                                        | PK, AUTO_INCREMENT             | Project ID                                    |
| `title`         | VARCHAR(200)                                               | NOT NULL                       | Project title                                 |
| `description`   | TEXT                                                       | NOT NULL                       | Project description                           |
| `difficulty_level` | ENUM('Beginner','Intermediate','Advanced')             | NOT NULL                       | Project difficulty                            |
| `source_type`   | ENUM('RoadmapSuggested','OpportunityAnalyzer','PlatformSuggested','UserCustom') | NOT NULL | Where project came from           |
| `is_active`     | BOOLEAN                                                    | NOT NULL, DEFAULT 1            | Active or not (for showing to users)          |

---

### 4.2 `project_skills`

M:N relation between projects and skills, plus importance.

| Column            | Type                                       | Constraints                                      | Description                                |
|-------------------|--------------------------------------------|--------------------------------------------------|--------------------------------------------|
| `project_id`      | INT                                        | PK (composite), FK → `projects.project_id`       | Project ID                                 |
| `skill_id`        | INT                                        | PK (composite), FK → `skills.skill_id`           | Skill ID                                   |
| `importance_level`| ENUM('Core','Important','NiceToHave')      | NOT NULL                                         | Importance of this skill in the project    |

---

### 4.3 `user_projects`

Project instances done by learners.

| Column        | Type                                            | Constraints                                       | Description                                    |
|---------------|-------------------------------------------------|---------------------------------------------------|------------------------------------------------|
| `user_id`     | INT                                             | PK (composite), FK → `users.user_id`              | Learner ID                                     |
| `project_id`  | INT                                             | PK (composite), FK → `projects.project_id`        | Project ID                                     |
| `status`      | ENUM('Available','InProgress','Completed')      | NOT NULL, DEFAULT 'Available'                     | Project status                                 |
| `github_url`  | TEXT                                            | NULL                                              | GitHub link (optional)                         |
| `started_at`  | DATETIME                                        | NULL                                              | Start time                                     |
| `completed_at`| DATETIME                                        | NULL                                              | Completion time                                |

---

## 5. Resume Builder

### 5.1 `resumes`

Each row = one resume document for a learner.

| Column         | Type                       | Constraints                    | Description                       |
|----------------|----------------------------|--------------------------------|-----------------------------------|
| `resume_id`    | INT                        | PK, AUTO_INCREMENT             | Resume ID                         |
| `user_id`      | INT                        | FK → `users.user_id`, NOT NULL | Owner                             |
| `title`        | VARCHAR(200)               | NOT NULL                       | Resume label (e.g., "Frontend CV")|
| `language`     | ENUM('AR','EN')            | NOT NULL                       | Resume language                   |
| `created_at`   | DATETIME                   | NOT NULL                       | Created time                      |
| `last_updated_at` | DATETIME                | NOT NULL                       | Last update time                  |
| `ats_score`    | INT                        | NULL                           | Last ATS score (0–100)            |

---

### 5.2 `resume_sections`

Weak conceptually (depends on `resumes`); implementation has its own PK.

| Column           | Type                                    | Constraints                           | Description                                 |
|------------------|-----------------------------------------|---------------------------------------|---------------------------------------------|
| `section_id`     | INT                                     | PK, AUTO_INCREMENT                    | Section ID                                  |
| `resume_id`      | INT                                     | FK → `resumes.resume_id`, NOT NULL    | Parent resume                               |
| `section_type`   | ENUM('SUMMARY','EXPERIENCE','EDUCATION','PROJECTS','SKILLS','CERTIFICATES','ACTIVITIES','CUSTOM') | NOT NULL | Section category             |
| `header`         | VARCHAR(200)                            | NULL                                  | Section title heading (optional)           |
| `section_content`| TEXT                                    | NOT NULL                              | Rich text content of this section           |
| `sort_order`     | INT                                     | NOT NULL                              | Display order inside resume                 |

---

## 6. Opportunity Analyzer

### 6.1 `opportunity_analyses`

Stores each saved job analysis.

| Column                 | Type                                       | Constraints                       | Description                                   |
|------------------------|--------------------------------------------|-----------------------------------|-----------------------------------------------|
| `analysis_id`          | INT                                        | PK, AUTO_INCREMENT                | Analysis ID                                   |
| `user_id`              | INT                                        | FK → `users.user_id`, NOT NULL    | Owner                                         |
| `job_title_extracted`  | VARCHAR(200)                               | NULL                              | Parsed job title                              |
| `seniority_level`      | ENUM('Junior','Mid','Senior')              | NULL                              | Level of role                                 |
| `raw_input_type`       | ENUM('TEXT','FILE_UPLOAD')                 | NOT NULL                          | How data was input                            |
| `original_source`      | VARCHAR(100)                               | NULL                              | e.g. LinkedIn / Indeed / Other                |
| `match_score`          | INT                                        | NULL                              | 0–100 job match score                         |
| `missing_skills_summary` | TEXT                                    | NULL                              | Text summary of missing skills                |
| `action_plan_richtext` | TEXT                                      | NULL                              | Full structured action plan                   |
| `created_at`           | DATETIME                                   | NOT NULL                          | When analysis was executed                    |
| `is_saved`             | BOOLEAN                                    | NOT NULL, DEFAULT 1               | Whether user chose to store it                |

---

## 7. AI Chat (Tutor & Career Advisor)

### 7.1 `chat_sessions`

Logical conversation session (topic tutor / career advisor / resume help / job analysis Q&A).

| Column         | Type                                                 | Constraints                       | Description                                         |
|----------------|------------------------------------------------------|-----------------------------------|-----------------------------------------------------|
| `session_id`   | INT                                                  | PK, AUTO_INCREMENT                | Chat session ID                                     |
| `user_id`      | INT                                                  | FK → `users.user_id`, NOT NULL    | Owner learner                                       |
| `session_type` | ENUM('TopicTutor','CareerAdvisor','ResumeHelper','OpportunityFollowup') | NOT NULL | What feature this chat belongs to    |
| `topic_id`     | INT                                                  | NULL, FK → `topics.topic_id`      | For TopicTutor sessions (else NULL)                 |
| `created_at`   | DATETIME                                             | NOT NULL                          | Session start time                                  |
| `last_activity_at` | DATETIME                                         | NOT NULL                          | Last message time                                   |

---

### 7.2 `chat_messages`

Messages in a chat session.

| Column        | Type                                   | Constraints                       | Description                         |
|---------------|----------------------------------------|-----------------------------------|-------------------------------------|
| `message_id`  | INT                                   | PK, AUTO_INCREMENT                | Message ID                          |
| `session_id`  | INT                                   | FK → `chat_sessions.session_id`, NOT NULL | Parent session              |
| `sender_type` | ENUM('User','AI')                    | NOT NULL                          | Who sent this message               |
| `content`     | TEXT                                  | NOT NULL                          | Text content                        |
| `created_at`  | DATETIME                              | NOT NULL                          | Message time                        |

---

## 8. Admin Content Management (Relations Only)

Admin doesn’t need special join tables in implementation for permissions (single role), but the **logical relationships** are:

- `admins` create/update/delete:
  - `paths`
  - `stages`
  - `topics`
  - `topic_resources`
  - `skills`
  - `projects`

You can track audit history later in extra tables like `content_audit_log` if needed, but it’s **not required** in this first version.

---

## 9. Relationship Summary (Implementation View)

- `learners.user_id` → `users.user_id` (1–1)
- `admins.user_id` → `users.user_id` (1–1)
- `stages.path_id` → `paths.path_id` (many stages per path)
- `topics.stage_id` → `stages.stage_id` (many topics per stage)
- `topic_resources.topic_id` → `topics.topic_id` (many resources per topic)
- `user_progress.user_id` → `users.user_id` (many progress rows per learner)
- `user_progress.topic_id` → `topics.topic_id`
- `user_skills.user_id` → `users.user_id`
- `user_skills.skill_id` → `skills.skill_id`
- `topic_skills.topic_id` → `topics.topic_id`
- `topic_skills.skill_id` → `skills.skill_id`
- `project_skills.project_id` → `projects.project_id`
- `project_skills.skill_id` → `skills.skill_id`
- `user_projects.user_id` → `users.user_id`
- `user_projects.project_id` → `projects.project_id`
- `resumes.user_id` → `users.user_id`
- `resume_sections.resume_id` → `resumes.resume_id`
- `opportunity_analyses.user_id` → `users.user_id`
- `chat_sessions.user_id` → `users.user_id`
- `chat_sessions.topic_id` → `topics.topic_id` (optional)
- `chat_messages.session_id` → `chat_sessions.session_id`

---

## 10. Mapping to Data Stores (DFD)

For clarity with the DFD we already have:

- **D1 – Users & Learners Data**  
  → `users`, `learners`, `admins`

- **D2 – Learning Content**  
  → `paths`, `stages`, `topics`, `topic_resources`, `topic_skills`

- **D3 – User Progress Data**  
  → `user_progress`

- **D4 – Skills Data**  
  → `skills`, `user_skills`

- **D5 – Projects Data**  
  → `projects`, `project_skills`, `user_projects`

- **D6 – Resumes Data**  
  → `resumes`, `resume_sections`

- **D7 – Opportunity Analyses**  
  → `opportunity_analyses`

- **(AI session data)**  
  → `chat_sessions`, `chat_messages` (used by multiple processes)

---

This schema is consistent with:

- The final **EER diagram** we agreed on.
- The **DFD** data stores and flows.
- The **UI features** (onboarding, roadmap, skills/projects hub, resume builder, opportunity analyzer, AI tools).

You can now:

- Use this as a **single source of truth** for implementation.
- Translate each table into actual `CREATE TABLE` statements for MySQL/PostgreSQL.
