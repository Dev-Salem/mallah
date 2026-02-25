# Mallah – Resume Builder v3 (Functional Contract)

## 1. Purpose

The Resume Builder is a resume composition and export module.

It owns:
- Building one or more resumes from Mallah data + manual entries.
- Storing resume content as structured sections.
- Exporting an ATS-safe PDF using a fixed, single-column template.
- Optional AI-assisted rewriting for text fields.
- Optional ATS-style scoring and actionable hints (server-side).

It does not own:
- Skill generation (owned by Roadmap + Projects completion).
- Project completion tracking (owned by Projects module).
- Learner profile edits (Profile/Settings owns that).

---

## 2. Actors

- Learner (authenticated)
- Backend API
- Database
- Optional: OpenAI (text improvement only)

---

## 3. Scope Boundaries

### This module CAN:
- Read: users/learners basic identity fields, user_skills, user_projects.
- Create/update/delete resume records and resume sections.
- Store per-resume overrides (included skills/projects, description overrides, manual items).
- Export PDF from a fixed template.
- Compute ATS score and hints server-side (optional).
- Provide AI “Improve” outputs for specific text fields (optional).

### This module CANNOT:
- Modify users/learners profile data (resume-only overrides do not write back to Profile).
- Modify user_skills or user_projects (resume can only include/exclude and override display text).
- Compute progress or change roadmap state.

---

## 4. Dependencies (Read Sources)

Reads from:
- `users` (email)
- `learners` (first_name, last_name, current_path_id, primary_goal, ai prefs, portfolio_slug)
- `user_skills` JOIN `skills` (skills inventory)
- `user_projects` JOIN `projects` (completed projects inventory)
- `project_skills` (skills per project)
- `resumes`, `resume_sections` (resume state)

---

## 5. Resume Section Order (Fixed in v1)

Section order is fixed and not user-reorderable in v1:

1. PERSONAL_INFO
2. SUMMARY
3. SKILLS
4. PROJECTS
5. EXPERIENCE
6. EDUCATION
7. CERTIFICATIONS (optional)

Learner may hide optional sections but cannot reorder sections.

---

## 6. Data Ownership and Overrides

Resume Builder must support “resume-only overrides” without mutating source records.

Examples:
- Personal info (phone, links, location) lives in resume sections only.
- Skills inclusion/exclusion is per-resume only.
- Project description overrides are per-resume only.
- Manual experience/education/certifications are per-resume only.

---

## 7. Section Contracts

### 7.1 PERSONAL_INFO (resume-only fields)
Fields:
- full_name (default from learners.first_name + last_name; editable within resume only)
- email (default from users.email; shown in resume; not editable in v1 unless you allow it)
- phone
- linkedin_url
- github_url
- portfolio_url (default: mallah.app/portfolio/{learners.portfolio_slug})
- location (city/country only)

Rules:
- Portfolio URL is included by default.
- No full address requirement.

---

### 7.2 SUMMARY
Field:
- text (max ~80 words recommended; enforce either word or char max)

Optional AI:
- Improve summary based on:
  - current_path_id
  - primary_goal
  - user text
- Output must be shown as “suggested replacement” (learner must accept to apply).

---

### 7.3 SKILLS
Auto-source:
- `user_skills` where source IN (Roadmap, Project)

Resume content stores:
- included_skill_ids (subset of catalog skills)
- manual_skills (resume-only strings)

Rules:
- Default includes all Roadmap/Project skills.
- Manual skills added here do not create skills in catalog or user_skills.

---

### 7.4 PROJECTS
Auto-source:
- `user_projects` where status = Completed

Resume stores:
- project inclusion flags
- per-project description_override (optional)
- optional manual projects (resume-only)

Rules:
- Default includes completed projects.
- If user_projects.personal_note exists, it can be used as the default description display.
- Project links:
  - github_url (if present on user_projects)
  - demo_url (if present)

Optional AI:
- Improve project description (action verb + task + outcome style).

---

### 7.5 EXPERIENCE (manual only)
Resume stores:
- list of entries: title, company, location, start, end/present, bullets[]

Rules:
- Reverse chronological display order (by end date then start date).

Optional AI:
- Improve a bullet (rewrite only; learner must accept).

---

### 7.6 EDUCATION (manual only)
Resume stores:
- degree/certificate, institution, field, year/status

Rules:
- Reverse chronological order.

---

### 7.7 CERTIFICATIONS (optional, manual)
Resume stores:
- name, issuer, year

---

## 8. ATS Score (Optional Feature)

ATS score is computed server-side and stored on the resume record.

Score range:
- 0–100

Inputs may include:
- completeness checks (required sections non-empty)
- keyword coverage against a path keyword set (v1 baseline)
- basic formatting compliance checks for export template constraints
- presence of action verbs in summary/projects/experience bullets (rule-based heuristics)

Outputs:
- ats_score
- ats_hints[] (2–3 actionable hints)

Rules:
- Score updates on save or via explicit recalc endpoint.
- If ATS scoring disabled, ats_score remains null and UI hides scoring.

v1 baseline keyword sets are derived from current_path_id (no job description required).
Job-description matching is a v2 feature.

---

## 9. PDF Export (ATS-Safe Template)

Export output requirements:
- Single column
- Plain text-friendly structure
- No images/icons
- No tables
- Standard section headings (e.g., SUMMARY, SKILLS, PROJECTS, EXPERIENCE, EDUCATION, CERTIFICATIONS)
- Text-based PDF (not image rendering)

Export naming:
- `{first_name}-{last_name}-Resume.pdf` (or resume title variant)

Generation:
- Backend compiles resume_sections in fixed order into a static template renderer.
- Returns PDF as downloadable response.

Export guardrails:
- Block export if minimum viable content missing (policy decision; recommended: require SKILLS and SUMMARY).

---

## 10. Multiple Resumes

Learner can create multiple resumes.

Rules:
- Each resume has its own included skills/projects and manual entries.
- Creating a new resume can auto-populate from current user_skills + completed user_projects snapshot.
- Deleting a resume does not affect portfolio data.

v1 limit:
- Up to 3 resumes per learner (enforced server-side).

---

## 11. Core Flows

### 11.1 Load Resume List
- GET list of resumes for user_id
- Return: resume_id, title, ats_score, last_updated_at

### 11.2 Load Resume Editor
- Load resumes + resume_sections
- If none exist:
  - auto-create one resume (“My Resume”)
  - seed PERSONAL_INFO, SKILLS, PROJECTS from current data
- Return full editor payload

### 11.3 Save
- Patch updated sections
- Update resumes.last_updated_at
- Optionally recompute ats_score + hints
- Return updated ats_score + hints

### 11.4 AI Improve
- Input: section_type + field payload + context (path/goal + AI prefs)
- Output: suggested rewrite only
- Learner acceptance required to apply

### 11.5 Export PDF
- Compile sections
- Render fixed template
- Return PDF

---

## 12. API Contract (Minimum)

- GET  /api/resumes
- POST /api/resumes            (create new resume)
- GET  /api/resumes/:resume_id (load resume + sections)
- PATCH /api/resumes/:resume_id/sections
- POST /api/resumes/:resume_id/recalculate-ats   (optional)
- POST /api/resumes/ai/improve                   (optional)
- GET  /api/resumes/:resume_id/export

All endpoints require learner authentication and onboarding_completed = true.

---

## 13. Data Model

### 13.1 resumes

Fields:
- resume_id (UUID PK)
- user_id (FK)
- title
- ats_score (nullable)
- last_updated_at
- created_at

### 13.2 resume_sections

Fields:
- section_id (UUID PK)
- resume_id (FK)
- section_type (PERSONAL_INFO | SUMMARY | SKILLS | PROJECTS | EXPERIENCE | EDUCATION | CERTIFICATIONS)
- content (JSONB)
- is_visible (boolean, default true)
- sort_order (int, fixed per section type in v1)

Recommended JSON shapes:

PERSONAL_INFO:
{ "full_name": "", "email": "", "phone": "", "linkedin_url": "", "github_url": "", "portfolio_url": "", "location": "" }

SUMMARY:
{ "text": "" }

SKILLS:
{ "included_skill_ids": [], "manual_skills": [] }

PROJECTS:
{ "items": [{ "project_id": "uuid", "included": true, "description_override": "" }], "manual_projects": [] }

EXPERIENCE:
{ "items": [{ "title": "", "company": "", "location": "", "start": "", "end": "", "bullets": [] }] }

EDUCATION:
{ "items": [{ "degree": "", "institution": "", "field": "", "year": "" }] }

CERTIFICATIONS:
{ "items": [{ "name": "", "issuer": "", "year": "" }] }

---

## 14. Edge Cases

- No skills yet:
  - SKILLS auto-source empty; learner can add manual skills to resume only.
- No completed projects:
  - PROJECTS auto-source empty; learner can add manual projects.
- AI unavailable:
  - AI endpoints return disabled; builder remains usable without AI.
- ATS scoring unavailable:
  - ats_score remains null; hints hidden.
- Resume limit reached:
  - creation endpoint rejects with a clear message.

---

## 15. Integration Points

- Portfolio Hub:
  - Supplies user_skills and completed user_projects; resume consumes without mutating them.
- Dashboard:
  - Reads latest resume ats_score and last_updated_at for readiness tile.
- Onboarding:
  - ai_language_pref, ai_detail_level, primary_goal, current_path_id shape AI improve prompts.
- Opportunity Analyzer (v2):
  - Can provide job-description keywords to ATS scoring engine (future extension).