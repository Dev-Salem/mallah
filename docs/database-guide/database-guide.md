# Mallah – Database Design (Implementation-Level)

This document is the single source of truth for the Mallah relational database schema.
Every table, column, type, and constraint here is consistent with and derived from the
individual feature specs (Auth, Onboarding, Dashboard, Roadmap, Portfolio Hub, Resume
Builder, Opportunity Analyzer, Admin Panel, Profile & Settings).

When there is a conflict between this document and a feature spec, the feature spec
takes precedence and this document should be updated to match.

---

## 0. Global Conventions

- Database: PostgreSQL (recommended). MySQL compatible with minor adjustments noted inline.
- All primary keys use `UUID` — not `INT AUTO_INCREMENT`. This prevents enumerable IDs
  in URLs and is consistent with all feature specs.
- Column names: `snake_case`.
- `PK` = Primary Key, `FK` = Foreign Key.
- `ENUM(...)` = use native DB ENUM or `VARCHAR` + `CHECK` constraint.
- `JSONB` = PostgreSQL native. Use `JSON` or `TEXT` in MySQL.
- `TIMESTAMP` = timestamp with time zone (`TIMESTAMPTZ` in PostgreSQL).

**Common columns (where used):**
- `created_at` — `TIMESTAMP`, default `NOW()`, NOT NULL.
- `updated_at` — `TIMESTAMP`, updated via trigger or application layer.

**ENUM value casing convention:**
All ENUM values use lowercase with underscores (`snake_case`) throughout. e.g.
`'fresh_grad'` not `'FreshGraduate'`. This is consistent with how the feature specs
define them and avoids case-sensitivity bugs.

---

## 1. Users & Roles

### 1.1 `users`

Base identity table. Supertype for both `learners` and `admins`.
Role is an explicit column — never inferred from subtype table existence.

| Column          | Type                              | Constraints                      | Notes                                    |
|-----------------|-----------------------------------|----------------------------------|------------------------------------------|
| `user_id`       | UUID                              | PK, DEFAULT gen_random_uuid()    | Unique user identifier                   |
| `email`         | VARCHAR(255)                      | UNIQUE, NOT NULL                 | Login email — immutable after registration |
| `password_hash` | VARCHAR(255)                      | NOT NULL                         | bcrypt or argon2id hash, never plain text |
| `role`          | ENUM('learner','admin')           | NOT NULL                         | Read directly on every auth check        |
| `status`        | ENUM('active','blocked','deleted')| NOT NULL, DEFAULT 'active'       | 'deleted' = soft delete from account deletion flow |
| `email_verified`| BOOLEAN                           | NOT NULL, DEFAULT false          | Set to true on email verification        |
| `created_at`    | TIMESTAMP                         | NOT NULL, DEFAULT NOW()          |                                          |
| `last_login_at` | TIMESTAMP                         | NULL                             | Updated on every successful login        |

**Notes:**
- `email` is immutable after registration. No self-service email change in v1.
- `status = 'deleted'` is set by the account deletion flow (soft delete). Rows are
  never hard-deleted in v1 to preserve foreign key integrity and audit log references.
- `role` is set to `'learner'` at registration. Only a super admin can set `role = 'admin'`.

---

### 1.2 `learners`

Subtype of `users`. One row per learner, same `user_id`.
All onboarding fields are NULL at registration and populated by the Onboarding Wizard.

| Column                  | Type                                                      | Constraints                     | Notes                                                        |
|-------------------------|-----------------------------------------------------------|---------------------------------|--------------------------------------------------------------|
| `user_id`               | UUID                                                      | PK, FK → `users.user_id`        | 1-to-1 with users                                            |
| `first_name`            | VARCHAR(100)                                              | NOT NULL                        |                                                              |
| `last_name`             | VARCHAR(100)                                              | NOT NULL                        |                                                              |
| `onboarding_completed`  | BOOLEAN                                                   | NOT NULL, DEFAULT false         | Set to true on onboarding completion                         |
| `current_path_id`       | VARCHAR(50)                                               | NULL, FK → `paths.path_id`      | NULL until onboarding complete                               |
| `background_type`       | ENUM('student','fresh_grad','career_shifter','no_tech')   | NULL                            | Set by onboarding Step 1                                     |
| `primary_goal`          | ENUM('job','freelance','startup','exploring')             | NULL                            | Set by onboarding Step 2                                     |
| `weekly_hours_category` | ENUM('0-3','4-7','8-12','13+')                           | NULL                            | Set by onboarding Step 3                                     |
| `learning_velocity`     | ENUM('slow','normal','fast')                              | NULL                            | Derived from `weekly_hours_category` — always re-derived on update |
| `readiness_level`       | INT                                                       | NULL, CHECK (0 <= x <= 3)       | Computed from onboarding Step 5 confidence snapshot          |
| `ai_language_pref`      | ENUM('arabic','english','mix')                            | NULL                            | Set by onboarding Step 6                                     |
| `ai_detail_level`       | ENUM('short','balanced','detailed')                       | NULL                            | Set by onboarding Step 6                                     |
| `portfolio_slug`        | VARCHAR(100)                                              | UNIQUE, NOT NULL                | Generated at registration: `{first}-{last}-{suffix}`. Never changes. |
| `bio`                   | VARCHAR(160)                                              | NULL                            | Optional short bio shown on public portfolio                 |

**Removed from old schema:**
- `weekly_learning_hours` (INT) → replaced by `weekly_hours_category` (ENUM)
- `learning_style_primary` → removed entirely. Never used by any feature in v1.

**Derivation rule for `learning_velocity`:**
Whenever `weekly_hours_category` is written (onboarding or settings), `learning_velocity`
must be re-derived atomically in the same transaction:

| `weekly_hours_category` | `learning_velocity` |
|-------------------------|---------------------|
| `0-3`                   | `slow`              |
| `4-7`                   | `normal`            |
| `8-12`                  | `fast`              |
| `13+`                   | `fast`              |

---

### 1.3 `admins`

Subtype of `users`. One row per admin, same `user_id`.

| Column         | Type                       | Constraints                 | Notes                                   |
|----------------|----------------------------|-----------------------------|-----------------------------------------|
| `user_id`      | UUID                       | PK, FK → `users.user_id`   | 1-to-1 with users                       |
| `display_name` | VARCHAR(150)               | NOT NULL                    | Shown in admin panel and audit log      |
| `admin_level`  | ENUM('normal','super')     | NOT NULL, DEFAULT 'normal'  | Controls what actions are permitted     |

---

## 2. Onboarding

### 2.1 `onboarding_responses`

Stores the raw answers from the Onboarding Wizard. One row per completed onboarding.
Preserved even after onboarding fields are written to `learners`.

| Column                  | Type                                                    | Constraints                       | Notes                                      |
|-------------------------|---------------------------------------------------------|-----------------------------------|--------------------------------------------|
| `onboarding_id`         | UUID                                                    | PK, DEFAULT gen_random_uuid()     |                                            |
| `user_id`               | UUID                                                    | NOT NULL, FK → `users.user_id`    |                                            |
| `background_type`       | ENUM('student','fresh_grad','career_shifter','no_tech') | NOT NULL                          |                                            |
| `primary_goal`          | ENUM('job','freelance','startup','exploring')           | NOT NULL                          |                                            |
| `weekly_hours_category` | ENUM('0-3','4-7','8-12','13+')                         | NOT NULL                          |                                            |
| `learning_velocity`     | ENUM('slow','normal','fast')                            | NOT NULL                          | Derived at time of onboarding              |
| `interest_vector`       | JSONB                                                   | NULL                              | Scored interest signals from Step 4        |
| `confidence_snapshot`   | JSONB                                                   | NULL                              | Per-item self-assessment from Step 5       |
| `readiness_level`       | INT                                                     | NULL, CHECK (0 <= x <= 3)         | Computed from confidence_snapshot          |
| `ai_language_pref`      | ENUM('arabic','english','mix')                          | NOT NULL                          |                                            |
| `ai_detail_level`       | ENUM('short','balanced','detailed')                     | NOT NULL                          |                                            |
| `completed_at`          | TIMESTAMP                                               | NOT NULL                          |                                            |

---

### 2.2 `ai_recommendations`

Stores the AI recommendation result from the end of onboarding.
One row per completed onboarding. Preserved for reference.

| Column                 | Type         | Constraints                              | Notes                                              |
|------------------------|--------------|------------------------------------------|----------------------------------------------------|
| `id`                   | UUID         | PK, DEFAULT gen_random_uuid()            |                                                    |
| `user_id`              | UUID         | NOT NULL, FK → `users.user_id`           |                                                    |
| `onboarding_id`        | UUID         | NOT NULL, FK → `onboarding_responses.onboarding_id` |                                       |
| `recommended_path_id`  | VARCHAR(50)  | NOT NULL                                 | What the AI suggested                              |
| `confidence_score`     | INT          | NOT NULL, CHECK (0 <= x <= 100)          | AI's confidence in the recommendation             |
| `reasons`              | JSONB        | NOT NULL                                 | Array of reason strings                            |
| `alternatives`         | JSONB        | NULL                                     | Array of `{ path_id, reason }` objects             |
| `plan_2_weeks`         | JSONB        | NOT NULL                                 | Array of task strings for first 2 weeks            |
| `first_milestone`      | VARCHAR(200) | NULL                                     | Name of the first milestone project                |
| `accepted_path_id`     | VARCHAR(50)  | NULL                                     | Path the learner actually chose (may differ from recommendation) |
| `created_at`           | TIMESTAMP    | NOT NULL, DEFAULT NOW()                  |                                                    |

---

## 3. Email & Auth Tokens

### 3.1 `email_verification_tokens`

One-time tokens for email verification.

| Column       | Type         | Constraints                           | Notes                                |
|--------------|--------------|---------------------------------------|--------------------------------------|
| `token_id`   | UUID         | PK, DEFAULT gen_random_uuid()         |                                      |
| `user_id`    | UUID         | NOT NULL, FK → `users.user_id`        |                                      |
| `token_hash` | VARCHAR(255) | NOT NULL, UNIQUE                      | Hashed token — never store raw       |
| `expires_at` | TIMESTAMP    | NOT NULL                              | 24 hours after creation              |
| `used_at`    | TIMESTAMP    | NULL                                  | Set when token is consumed           |
| `created_at` | TIMESTAMP    | NOT NULL, DEFAULT NOW()               |                                      |

---

### 3.2 `password_reset_tokens`

One-time tokens for password reset.

| Column       | Type         | Constraints                           | Notes                                |
|--------------|--------------|---------------------------------------|--------------------------------------|
| `token_id`   | UUID         | PK, DEFAULT gen_random_uuid()         |                                      |
| `user_id`    | UUID         | NOT NULL, FK → `users.user_id`        |                                      |
| `token_hash` | VARCHAR(255) | NOT NULL, UNIQUE                      | Hashed token — never store raw       |
| `expires_at` | TIMESTAMP    | NOT NULL                              | 1 hour after creation                |
| `used_at`    | TIMESTAMP    | NULL                                  | Set when token is consumed (single-use) |
| `created_at` | TIMESTAMP    | NOT NULL, DEFAULT NOW()               |                                      |

---

## 4. Learning Content

### 4.1 `paths`

Top-level learning paths. `path_id` is a slug, not an integer.
The four valid slugs are: `frontend`, `fullstack`, `cybersecurity`, `datascience`.

| Column              | Type         | Constraints                   | Notes                                           |
|---------------------|--------------|-------------------------------|-------------------------------------------------|
| `path_id`           | VARCHAR(50)  | PK                            | Slug — e.g. `frontend`. Never changed after learners enroll. |
| `name`              | VARCHAR(150) | NOT NULL                      | Display name — e.g. "Frontend Development"      |
| `short_description` | TEXT         | NOT NULL                      |                                                 |
| `is_active`         | BOOLEAN      | NOT NULL, DEFAULT true        | Inactive paths cannot be newly enrolled in      |

**Changed from old schema:** `path_id` is now `VARCHAR(50)` (slug), not `INT`.
`learners.current_path_id` is also `VARCHAR(50)` to match.

---

### 4.2 `stages`

Stages within a path, ordered by `order_index`.

| Column           | Type                                       | Constraints                         | Notes                            |
|------------------|--------------------------------------------|-------------------------------------|----------------------------------|
| `stage_id`       | UUID                                       | PK, DEFAULT gen_random_uuid()       |                                  |
| `path_id`        | VARCHAR(50)                                | NOT NULL, FK → `paths.path_id`      |                                  |
| `title`          | VARCHAR(150)                               | NOT NULL                            |                                  |
| `description`    | TEXT                                       | NULL                                |                                  |
| `difficulty_level`| ENUM('beginner','intermediate','advanced') | NOT NULL                           |                                  |
| `order_index`    | INT                                        | NOT NULL                            | Unique per path — enforced at app level |

**Index:** `(path_id, order_index)` — used constantly for roadmap rendering.

---

### 4.3 `topics`

Individual lessons within a stage.

| Column               | Type                                       | Constraints                          | Notes                              |
|----------------------|--------------------------------------------|--------------------------------------|------------------------------------|
| `topic_id`           | UUID                                       | PK, DEFAULT gen_random_uuid()        |                                    |
| `stage_id`           | UUID                                       | NOT NULL, FK → `stages.stage_id`     |                                    |
| `title`              | VARCHAR(200)                               | NOT NULL                             |                                    |
| `summary`            | TEXT                                       | NULL                                 |                                    |
| `estimated_time_min` | INT                                        | NULL                                 | Shown in UI as estimated read time |
| `difficulty_level`   | ENUM('beginner','intermediate','advanced') | NOT NULL                             |                                    |
| `is_mandatory`       | BOOLEAN                                    | NOT NULL, DEFAULT true               | Non-mandatory topics don't count toward stage completion % |
| `order_index`        | INT                                        | NOT NULL                             | Unique per stage — enforced at app level |

**Added from old schema:** `is_mandatory` — required by Dashboard stage completion logic.

**Index:** `(stage_id, order_index)` — used for roadmap topic list rendering.

---

### 4.4 `topic_resources`

Learning assets attached to a topic.

| Column          | Type                                        | Constraints                          | Notes                                       |
|-----------------|---------------------------------------------|--------------------------------------|---------------------------------------------|
| `resource_id`   | UUID                                        | PK, DEFAULT gen_random_uuid()        |                                             |
| `topic_id`      | UUID                                        | NOT NULL, FK → `topics.topic_id`     |                                             |
| `resource_type` | ENUM('VIDEO','ARTICLE','INTERNAL_TEXT')     | NOT NULL                             |                                             |
| `title`         | VARCHAR(200)                                | NOT NULL                             |                                             |
| `url`           | TEXT                                        | NULL                                 | Required for VIDEO and ARTICLE types        |
| `content`       | TEXT                                        | NULL                                 | Required for INTERNAL_TEXT type             |
| `order_index`   | INT                                         | NOT NULL                             |                                             |

**Constraint:** `CHECK ((resource_type = 'INTERNAL_TEXT' AND content IS NOT NULL) OR (resource_type IN ('VIDEO','ARTICLE') AND url IS NOT NULL))`

---

### 4.5 `topic_skills`

M:N — which skills a topic teaches, with importance weight.

| Column            | Type                              | Constraints                            | Notes                                                    |
|-------------------|-----------------------------------|----------------------------------------|----------------------------------------------------------|
| `topic_id`        | UUID                              | PK (composite), FK → `topics.topic_id` |                                                         |
| `skill_id`        | UUID                              | PK (composite), FK → `skills.skill_id` |                                                         |
| `importance_level`| ENUM('low','medium','high')       | NOT NULL, DEFAULT 'medium'             | Used by Opportunity Analyzer to prioritize topic recommendations |

**Changed from old schema:** `contribution_level` renamed to `importance_level` with new
values (`low`/`medium`/`high`) to match the admin panel and Opportunity Analyzer specs.

---

## 5. Skills

### 5.1 `skills`

Master skill catalog. Admin-managed. Learner-submitted skills start with `is_verified = false`.

| Column        | Type                                                              | Constraints                    | Notes                                              |
|---------------|-------------------------------------------------------------------|--------------------------------|----------------------------------------------------|
| `skill_id`    | UUID                                                              | PK, DEFAULT gen_random_uuid()  |                                                    |
| `name`        | VARCHAR(150)                                                      | NOT NULL, UNIQUE               | Case-insensitive uniqueness enforced at app level  |
| `description` | TEXT                                                              | NULL                           |                                                    |
| `category`    | ENUM('technical','tool_platform','framework_library','soft_skill')| NOT NULL                       |                                                    |
| `is_verified` | BOOLEAN                                                           | NOT NULL, DEFAULT true         | false = learner-submitted, pending admin review. true = active in catalog. |

**Added from old schema:** `is_verified` — required by Portfolio Hub learner skill submission
and Admin Panel skill review flow.

---

### 5.2 `user_skills`

Skills acquired by a learner. Written by Topic Viewer (on topic completion) and
Portfolio Hub (manual add).

| Column        | Type                                       | Constraints                                  | Notes                                         |
|---------------|--------------------------------------------|----------------------------------------------|-----------------------------------------------|
| `user_id`     | UUID                                       | PK (composite), FK → `users.user_id`         |                                               |
| `skill_id`    | UUID                                       | PK (composite), FK → `skills.skill_id`       |                                               |
| `level`       | ENUM('beginner','intermediate','advanced') | NOT NULL                                     |                                               |
| `source`      | ENUM('roadmap','project','manual')         | NOT NULL                                     | How the skill was acquired                    |
| `is_public`   | BOOLEAN                                    | NOT NULL, DEFAULT true                       | Controls visibility on public portfolio       |
| `acquired_at` | TIMESTAMP                                  | NOT NULL, DEFAULT NOW()                      |                                               |

**Added from old schema:** `is_public` — required by Portfolio Hub public/private toggle.

---

## 6. Projects

### 6.1 `projects`

Project templates — both platform-defined and learner-created.

| Column           | Type                                       | Constraints                    | Notes                                              |
|------------------|--------------------------------------------|--------------------------------|----------------------------------------------------|
| `project_id`     | UUID                                       | PK, DEFAULT gen_random_uuid()  |                                                    |
| `title`          | VARCHAR(200)                               | NOT NULL                       |                                                    |
| `description`    | TEXT                                       | NOT NULL                       |                                                    |
| `difficulty_level`| ENUM('beginner','intermediate','advanced') | NOT NULL                      |                                                    |
| `source_type`    | ENUM('platform','user_custom')             | NOT NULL                       | 'platform' = admin-created. 'user_custom' = learner-created. |
| `stage_id`       | UUID                                       | NULL, FK → `stages.stage_id`   | Which stage this project belongs to (platform projects only) |
| `is_active`      | BOOLEAN                                    | NOT NULL, DEFAULT true         | Inactive = hidden from learner roadmaps            |

**Changed from old schema:** `source_type` values simplified to `platform` and `user_custom`
(removed `RoadmapSuggested`, `OpportunityAnalyzer`, `PlatformSuggested` — these distinctions
are not used by any feature spec). Added `stage_id` FK required by Admin Panel project management.

---

### 6.2 `project_skills`

M:N — which skills a project teaches or demonstrates.

| Column            | Type                              | Constraints                               | Notes                                        |
|-------------------|-----------------------------------|-------------------------------------------|----------------------------------------------|
| `project_id`      | UUID                              | PK (composite), FK → `projects.project_id`|                                              |
| `skill_id`        | UUID                              | PK (composite), FK → `skills.skill_id`    |                                              |
| `importance_level`| ENUM('low','medium','high')       | NOT NULL, DEFAULT 'medium'                | Used by Opportunity Analyzer project suggestions |

---

### 6.3 `user_projects`

A learner's relationship to a project — status, links, and personal content.

| Column          | Type                                        | Constraints                                  | Notes                                          |
|-----------------|---------------------------------------------|----------------------------------------------|------------------------------------------------|
| `user_id`       | UUID                                        | PK (composite), FK → `users.user_id`         |                                                |
| `project_id`    | UUID                                        | PK (composite), FK → `projects.project_id`   |                                                |
| `status`        | ENUM('available','in_progress','completed') | NOT NULL, DEFAULT 'available'                |                                                |
| `github_url`    | TEXT                                        | NULL                                         |                                                |
| `demo_url`      | TEXT                                        | NULL                                         | Live demo link — added for Portfolio Hub       |
| `personal_note` | VARCHAR(300)                                | NULL                                         | Learner's commentary — shown on public portfolio |
| `is_public`     | BOOLEAN                                     | NOT NULL, DEFAULT true                       | Controls visibility on public portfolio        |
| `started_at`    | TIMESTAMP                                   | NULL                                         |                                                |
| `completed_at`  | TIMESTAMP                                   | NULL                                         |                                                |

**Added from old schema:** `demo_url`, `personal_note`, `is_public` — all required by Portfolio Hub.

---

## 7. Progress

### 7.1 `user_progress`

Per-learner, per-topic progress. Written exclusively by the Topic Viewer.
Progress only moves forward — never reset.

| Column             | Type                                                | Constraints                                   | Notes                                   |
|--------------------|-----------------------------------------------------|-----------------------------------------------|-----------------------------------------|
| `user_id`          | UUID                                                | PK (composite), FK → `users.user_id`          |                                         |
| `topic_id`         | UUID                                                | PK (composite), FK → `topics.topic_id`        |                                         |
| `status`           | ENUM('not_started','in_progress','completed')       | NOT NULL, DEFAULT 'not_started'               |                                         |
| `completed_at`     | TIMESTAMP                                           | NULL                                          | Set when status → 'completed'           |
| `last_accessed_at` | TIMESTAMP                                           | NULL                                          | Updated every time the topic is opened  |

---

## 8. Resume Builder

### 8.1 `resumes`

One resume document per row. A learner can have up to 3 resumes (enforced at app level).

| Column            | Type         | Constraints                          | Notes                                    |
|-------------------|--------------|--------------------------------------|------------------------------------------|
| `resume_id`       | UUID         | PK, DEFAULT gen_random_uuid()        |                                          |
| `user_id`         | UUID         | NOT NULL, FK → `users.user_id`       |                                          |
| `title`           | VARCHAR(200) | NOT NULL                             | e.g. "Frontend Resume", "Freelance CV"   |
| `ats_score`       | INT          | NULL, CHECK (0 <= x <= 100)          | Calculated server-side on every save     |
| `created_at`      | TIMESTAMP    | NOT NULL, DEFAULT NOW()              |                                          |
| `last_updated_at` | TIMESTAMP    | NOT NULL                             | Updated on every save                    |

**Removed from old schema:** `language` (ENUM AR/EN) — the resume builder uses the
learner's `ai_language_pref` from their profile, not a per-resume language field.

---

### 8.2 `resume_sections`

Individual sections within a resume. Content is stored as JSONB for flexibility.

| Column           | Type                                                                                          | Constraints                             | Notes                                            |
|------------------|-----------------------------------------------------------------------------------------------|-----------------------------------------|--------------------------------------------------|
| `section_id`     | UUID                                                                                          | PK, DEFAULT gen_random_uuid()           |                                                  |
| `resume_id`      | UUID                                                                                          | NOT NULL, FK → `resumes.resume_id`      |                                                  |
| `section_type`   | ENUM('PERSONAL_INFO','SUMMARY','SKILLS','PROJECTS','EXPERIENCE','EDUCATION','CERTIFICATIONS') | NOT NULL                                | Fixed set — no CUSTOM type in v1                 |
| `content`        | JSONB                                                                                         | NOT NULL                                | Shape varies by section_type (see below)         |
| `is_visible`     | BOOLEAN                                                                                       | NOT NULL, DEFAULT true                  | Learner can hide optional sections               |
| `sort_order`     | INT                                                                                           | NOT NULL                                | Fixed per section_type in v1                     |

**Changed from old schema:**
- `section_content TEXT` → `content JSONB` for structured per-section data
- `header VARCHAR` removed — section headings are determined by `section_type`, not a free-text header
- `section_type` ENUM updated to match feature spec (removed `ACTIVITIES`, `CUSTOM`; added `PERSONAL_INFO`, `CERTIFICATIONS`)
- Added `is_visible` boolean

**JSONB content shapes by section_type:**

```
PERSONAL_INFO:  { phone, linkedin, github, portfolio, location }
SUMMARY:        { text }
SKILLS:         { included_skill_ids: [], manual_skills: [] }
PROJECTS:       [{ project_id, included, description_override }]
EXPERIENCE:     [{ title, company, location, start, end, bullets: [] }]
EDUCATION:      [{ degree, institution, field, year }]
CERTIFICATIONS: [{ name, issuer, year }]
```

---

## 9. Opportunity Analyzer

### 9.1 `opportunity_analyses`

Stores each job analysis — both in-session and saved.

| Column                | Type                                          | Constraints                       | Notes                                             |
|-----------------------|-----------------------------------------------|-----------------------------------|---------------------------------------------------|
| `analysis_id`         | UUID                                          | PK, DEFAULT gen_random_uuid()     |                                                   |
| `user_id`             | UUID                                          | NOT NULL, FK → `users.user_id`    |                                                   |
| `job_title`           | VARCHAR(200)                                  | NULL                              | AI-extracted, learner-editable                    |
| `company_name`        | VARCHAR(200)                                  | NULL                              | Optional, learner-entered                         |
| `seniority_level`     | ENUM('intern','junior','mid','senior')        | NULL                              | AI-extracted                                      |
| `raw_jd_text`         | TEXT                                          | NOT NULL                          | Original pasted job description                   |
| `extracted_skills`    | JSONB                                         | NULL                              | `{ required: [], preferred: [] }`                 |
| `match_score`         | INT                                           | NULL, CHECK (0 <= x <= 100)       | At time of last analysis run                      |
| `skills_breakdown`    | JSONB                                         | NULL                              | `{ matched: [], partial: [], missing: [] }`       |
| `action_plan`         | JSONB                                         | NULL                              | Array of step objects `{ step_type, title, reason, link_target }` |
| `is_saved`            | BOOLEAN                                       | NOT NULL, DEFAULT false           | true = learner clicked "Save Analysis"            |
| `created_at`          | TIMESTAMP                                     | NOT NULL, DEFAULT NOW()           |                                                   |
| `last_reanalyzed_at`  | TIMESTAMP                                     | NULL                              | Updated on every re-analyze run                   |

**Changed from old schema:**
- `job_title_extracted` → `job_title` (learner can edit it)
- `raw_input_type` and `original_source` removed — not used by any feature in v1
- `missing_skills_summary TEXT` and `action_plan_richtext TEXT` → replaced with structured
  `extracted_skills JSONB`, `skills_breakdown JSONB`, `action_plan JSONB`
- Added `company_name`, `raw_jd_text`, `last_reanalyzed_at`
- `seniority_level` ENUM updated: added `'intern'`, values lowercased

---

## 10. AI Chat (Topic Tutor)

### 10.1 `chat_sessions`

A logical conversation session. In v1 the only active session type is `topic_tutor`.

| Column             | Type                      | Constraints                          | Notes                                             |
|--------------------|---------------------------|--------------------------------------|---------------------------------------------------|
| `session_id`       | UUID                      | PK, DEFAULT gen_random_uuid()        |                                                   |
| `user_id`          | UUID                      | NOT NULL, FK → `users.user_id`       |                                                   |
| `session_type`     | ENUM('topic_tutor')       | NOT NULL                             | Extendable in v2 for career advisor, resume helper |
| `topic_id`         | UUID                      | NULL, FK → `topics.topic_id`         | Required for topic_tutor sessions                 |
| `created_at`       | TIMESTAMP                 | NOT NULL, DEFAULT NOW()              |                                                   |
| `last_activity_at` | TIMESTAMP                 | NOT NULL                             | Updated on every new message                      |

**Changed from old schema:** `session_type` ENUM reduced to `topic_tutor` only for v1.
`CareerAdvisor`, `ResumeHelper`, `OpportunityFollowup` are v2 additions.

---

### 10.2 `chat_messages`

Individual messages within a session.

| Column        | Type                  | Constraints                                 | Notes           |
|---------------|-----------------------|---------------------------------------------|-----------------|
| `message_id`  | UUID                  | PK, DEFAULT gen_random_uuid()               |                 |
| `session_id`  | UUID                  | NOT NULL, FK → `chat_sessions.session_id`   |                 |
| `sender_type` | ENUM('user','ai')     | NOT NULL                                    |                 |
| `content`     | TEXT                  | NOT NULL                                    |                 |
| `created_at`  | TIMESTAMP             | NOT NULL, DEFAULT NOW()                     |                 |

---

## 11. Admin Audit Log

### 11.1 `admin_audit_log`

Append-only log of every admin action. No `UPDATE` or `DELETE` permitted at the
application level on this table.

| Column        | Type         | Constraints                              | Notes                                                          |
|---------------|--------------|------------------------------------------|----------------------------------------------------------------|
| `log_id`      | UUID         | PK, DEFAULT gen_random_uuid()            |                                                                |
| `admin_id`    | UUID         | NOT NULL, FK → `users.user_id`           | The admin who performed the action                             |
| `event_type`  | VARCHAR(50)  | NOT NULL                                 | Snake_case: `topic_created`, `learner_blocked`, `skill_verified` |
| `description` | TEXT         | NOT NULL                                 | Human-readable full description                               |
| `entity_type` | VARCHAR(50)  | NULL                                     | `path` / `stage` / `topic` / `skill` / `project` / `user` / `admin` |
| `entity_id`   | UUID         | NULL                                     | ID of the record acted upon (NULL for login events)            |
| `ip_address`  | VARCHAR(45)  | NULL                                     | IPv4 or IPv6                                                   |
| `created_at`  | TIMESTAMP    | NOT NULL, DEFAULT NOW()                  | Server time only — never client-supplied                       |

**Added from old schema:** This table was marked as "optional future addition" in the old
schema. It is required in v1 per the Admin Panel spec.

---

## 12. Complete Relationship Map

```
users (1) ──────────── (1) learners
users (1) ──────────── (1) admins
users (1) ──────────── (N) onboarding_responses
users (1) ──────────── (N) ai_recommendations
users (1) ──────────── (N) email_verification_tokens
users (1) ──────────── (N) password_reset_tokens
users (1) ──────────── (N) user_progress
users (1) ──────────── (N) user_skills
users (1) ──────────── (N) user_projects
users (1) ──────────── (N) resumes
users (1) ──────────── (N) opportunity_analyses
users (1) ──────────── (N) chat_sessions
users (1) ──────────── (N) admin_audit_log  [as admin_id]

learners (N) ────────── (1) paths  [via current_path_id]

paths (1) ──────────── (N) stages
stages (1) ─────────── (N) topics
topics (1) ─────────── (N) topic_resources
topics (M) ─────────── (N) skills  [via topic_skills]
projects (M) ────────── (N) skills  [via project_skills]
stages (1) ─────────── (N) projects  [platform projects]

resumes (1) ────────── (N) resume_sections
chat_sessions (1) ───── (N) chat_messages
onboarding_responses (1) ─ (1) ai_recommendations
```

---

## 13. Data Store Mapping

For consistency with any DFD or architecture diagram:

| Store | Tables |
|-------|--------|
| D1 – Users & Identity | `users`, `learners`, `admins`, `email_verification_tokens`, `password_reset_tokens` |
| D2 – Onboarding | `onboarding_responses`, `ai_recommendations` |
| D3 – Learning Content | `paths`, `stages`, `topics`, `topic_resources`, `topic_skills` |
| D4 – User Progress | `user_progress` |
| D5 – Skills | `skills`, `user_skills` |
| D6 – Projects | `projects`, `project_skills`, `user_projects` |
| D7 – Resumes | `resumes`, `resume_sections` |
| D8 – Opportunity Analyses | `opportunity_analyses` |
| D9 – AI Chat | `chat_sessions`, `chat_messages` |
| D10 – Admin Audit | `admin_audit_log` |

---

## 14. Summary of All Changes from Old Schema

| Change | Detail |
|--------|--------|
| All PKs → UUID | Was INT AUTO_INCREMENT. UUIDs used throughout all feature specs. |
| `users.role` column added | Was missing entirely. Role is explicit, never inferred from subtype. |
| `users.email_verified` added | Required by auth spec email verification flow. |
| `users.status` extended | Added `'deleted'` value for soft-delete account deletion flow. |
| `learners.weekly_learning_hours` removed | Replaced by `weekly_hours_category` ENUM. |
| `learners.learning_style_primary` removed | Not used by any v1 feature. |
| `learners.weekly_hours_category` added | Correct field name per all specs. |
| `learners.learning_velocity` added | Derived field — always re-derived when hours change. |
| `learners.readiness_level` added | Computed from onboarding confidence snapshot. |
| `learners.portfolio_slug` added | Required by Portfolio Hub public URL. |
| `learners.bio` added | Optional short bio on public portfolio. |
| `learners.primary_goal` ENUM fixed | Was `('FullTimeJob','Freelance','OwnProject')`. Correct: `('job','freelance','startup','exploring')`. |
| `learners.background_type` ENUM fixed | Was `('Student','FreshGraduate',...)`. Correct: `('student','fresh_grad','career_shifter','no_tech')`. |
| `learners.current_path_id` type changed | Was INT FK → paths. Now VARCHAR(50) slug FK → paths. |
| `paths.path_id` type changed | Was INT AUTO_INCREMENT. Now VARCHAR(50) slug PK. |
| `topics.is_mandatory` added | Required by Dashboard stage completion % calculation. |
| `topic_skills.importance_level` renamed | Was `contribution_level` with values Intro/Practice/Advanced. Now `importance_level` with low/medium/high. |
| `skills.is_verified` added | Required by learner skill submission and admin review flow. |
| `user_skills.is_public` added | Required by Portfolio Hub public/private toggle. |
| `user_projects.demo_url` added | Required by Portfolio Hub. |
| `user_projects.personal_note` added | Required by Portfolio Hub. |
| `user_projects.is_public` added | Required by Portfolio Hub public/private toggle. |
| `projects.stage_id` added | Required by Admin Panel project management. |
| `projects.source_type` ENUM simplified | Was 4 values. Now `platform` / `user_custom` only. |
| `resumes.language` removed | Not used — learner's `ai_language_pref` is used instead. |
| `resume_sections` restructured | `section_content TEXT` → `content JSONB`. `header` removed. `section_type` ENUM corrected. `is_visible` added. |
| `opportunity_analyses` restructured | All TEXT summary fields replaced with JSONB. Multiple fields added/renamed. |
| `chat_sessions.session_type` reduced | v1 only supports `topic_tutor`. |
| `onboarding_responses` added | Was missing from old schema entirely. |
| `ai_recommendations` added | Was missing from old schema entirely. |
| `email_verification_tokens` added | Was missing from old schema entirely. |
| `password_reset_tokens` added | Was missing from old schema entirely. |
| `admin_audit_log` added | Was "optional future" in old schema. Required in v1. |
