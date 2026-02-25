# Mallah – Projects & Skills Hub v3 (Functional Contract)

## 1. Purpose

The Projects & Skills Hub is the portfolio evidence layer of Mallah.

It owns:
- Displaying the learner’s skills and projects as a portfolio.
- Managing project status (Available → InProgress → Completed).
- Managing public visibility for skills and projects.
- Providing a public read-only portfolio view.

It feeds Resume Builder and Opportunity Analyzer.
It does not control roadmap progression.

---

## 2. Actors

- Learner (authenticated)
- Public viewer (unauthenticated)
- Backend API
- Database

---

## 3. Public Portfolio URL

Route pattern: /portfolio/{portfolio_slug}

Example:
If learners.portfolio_slug = "sara-ahmad-4x2"
Public URL becomes:
mallah.app/portfolio/sara-ahmad-4x2

Rules:
- portfolio_slug is generated at registration.
- Must be unique.
- Immutable in v1.
- Public route must never expose private items.

---

## 4. Scope Boundaries

### This module CAN:
- Read skill and project evidence.
- Create/update/delete manual skills.
- Create/update/delete custom projects.
- Update project status.
- Toggle visibility (is_public).
- Serve a public read-only portfolio view.

### This module CANNOT:
- Modify roadmap structure.
- Mark roadmap topics complete.
- Change active path.
- Create verified catalog skills without admin approval.

No AI in v1.

---

## 5. Data Dependencies

Tables used:

- learners (portfolio_slug, bio, current_path_id)
- skills (catalog)
- user_skills (learner evidence)
- projects (roadmap + custom project definitions)
- user_projects (learner project evidence)
- project_skills (project → skill mapping)
- paths (display metadata)
- stages (display metadata)

Roadmap updates user_skills via topic completion.
This module reflects that data only.

---

## 6. Skills Evidence Rules

Each user_skills row must contain:

- skill_id
- level (Beginner | Intermediate | Advanced)
- source (Roadmap | Project | Manual)
- is_public (boolean)

Rules:
- Roadmap skills are read-only.
- Manual skills can be edited or deleted.
- Duplicate skills per user are not allowed.
- Manual additions must come from catalog.
- If learner proposes a new skill:
  - Save as unverified (is_verified = false)
  - Flag for admin review.

Public view shows only user_skills where is_public = true.

---

## 7. Project Evidence Rules

Each user_projects row must contain:

- project_id
- status (Available | InProgress | Completed)
- is_public
- github_url (nullable)
- demo_url (nullable)
- personal_note (nullable, max 300 chars)
- completed_at (nullable)

Rules:
- Public view shows only Completed AND is_public = true.
- Roadmap project title/description are not editable.
- Custom projects (UserCustom) are fully editable.
- Status downgrade from Completed is not allowed in v1.

---

## 8. Core Flows

### 8.1 Load Private View

Input:
- user_id

Backend returns:
- Learner profile summary
- All user_skills joined with skills
- All user_projects joined with projects
- Derived skill-to-project links

Frontend renders without recalculating logic.

---

### 8.2 Load Public View

Input:
- portfolio_slug

Backend:
- Resolve learner
- Filter:
  - user_skills.is_public = true
  - user_projects.is_public = true
  - user_projects.status = Completed

Return read-only structure.

If nothing public:
Return neutral empty state.

---

### 8.3 Add Manual Skill

Input:
- skill_id OR suggested_name
- level
- is_public (default true)

Validation:
- Prevent duplicates.

Write:
- Insert user_skills with source = Manual.

---

### 8.4 Add External Project

Input:
- title
- description
- difficulty_level
- skill_ids
- github_url (optional)
- demo_url (optional)
- status
- is_public (default true)

Write:
- Create project record (source_type = UserCustom)
- Insert user_projects row
- Insert project_skills mappings

If status = Completed:
Trigger skill unlock logic.

---

### 8.5 Mark Project Completed

Input:
- user_id
- project_id

Process:
- Update user_projects:
  - status = Completed
  - completed_at = now
- Fetch project_skills
- Upsert corresponding user_skills with source = Project
- Do not downgrade existing higher skill level

---

### 8.6 Toggle Visibility

Input:
- skill_id or project_id
- is_public boolean

Patch:
- user_skills.is_public OR user_projects.is_public

Changes reflect immediately in public view.

---

## 9. Data Model Fields

learners:
- portfolio_slug (unique)
- bio (nullable, max 160)

user_skills:
- is_public (boolean default true)
- source (enum)
- level (enum)

user_projects:
- is_public (boolean default true)
- status (enum)
- demo_url (nullable)
- personal_note (nullable)
- completed_at (nullable)

skills:
- is_verified (boolean default true)

---

## 10. Edge Cases

- No skills → return empty state.
- No completed projects → return empty state.
- All items private → public page shows neutral message.
- Attempt to delete roadmap skill → reject.
- Attempt to edit roadmap project core data → reject.
- Duplicate skill → reject.
- Invalid URLs → validate and reject.

---

## 11. Integration Points

Resume Builder:
- Reads user_skills and completed user_projects.

Dashboard:
- Reads counts for readiness indicators.

Roadmap:
- May unlock roadmap projects.
- Writes roadmap-derived skills.

Opportunity Analyzer:
- Reads user_skills for gap analysis.

---

## 12. Non-Functional Requirements

- Public view must never expose private data.
- All write operations require authentication.
- Portfolio slug must be unique.
- No frontend-derived business logic.
- No AI dependency in v1.
