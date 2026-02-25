# Mallah – Opportunity Analyzer v3 (Functional Contract)

## 1. Purpose

The Opportunity Analyzer is a job-to-roadmap alignment engine.

It owns:
- Parsing a pasted job description into structured requirements.
- Comparing job requirements against learner’s real portfolio state (skills, projects, progress).
- Producing a prioritized action plan anchored to Roadmap topics and Projects.
- Persisting analyses and supporting re-analysis against updated learner data.
- Flagging roadmap topics tied to saved analyses (“From Job Analysis”).

It is not a resume keyword tool. It is a gap-to-learning system.

---

## 2. Actors

- Learner (authenticated)
- Backend API
- Database
- OpenAI API (required: JD parsing + action plan generation)

---

## 3. Dependencies (Read Sources)

Reads from:
- `learners` (current_path_id, primary_goal, ai_language_pref, ai_detail_level, learning_velocity)
- `user_skills` JOIN `skills` (skill inventory + levels + source)
- `user_projects` JOIN `projects` (completed/in-progress/available projects + links)
- `project_skills` (skill coverage by project)
- `paths`, `stages`, `topics` (roadmap structure)
- `topic_skills` (which topics teach which skills + importance)
- `user_progress` (topic completion status and recency)
Writes to:
- `opportunity_analyses`
- (optional integration write) a “topic flags” mechanism for roadmap badges (implementation-specific)

---

## 4. Scope Boundaries

### This module CAN:
- Extract required and preferred skills from a job description.
- Match extracted skills to the platform skills catalog and learner skills.
- Classify skill status: matched / partial / missing / unrecognized.
- Identify relevant completed projects and suggest projects to build (from catalog).
- Compute a match score server-side.
- Generate an action plan that deep-links to Topic Viewer / Projects Hub / Resume Builder.
- Save and re-run analyses.
- Flag relevant roadmap topics for saved analyses.

### This module CANNOT:
- Modify roadmap progress.
- Mark topics completed.
- Change learner path.
- Write to `user_skills` as “earned” (only suggests actions).
- Fabricate skills/projects that do not exist in DB.

---

## 5. UX Contract (Two Phases)

### Phase A — Input
Input fields:
- raw_jd_text (required, min 100 chars)
- job_title (optional; AI can suggest)
- company_name (optional; labeling only)

Action:
- Analyze (starts backend pipeline)
Output:
- analysis result object (not saved by default)

### Phase B — Results
Results must contain these panels (data-driven; UI is not enforced, ordering recommended):
1) Job Snapshot
2) Match Score
3) Skills Breakdown
4) Portfolio Relevance
5) Action Plan
Bottom actions:
- Save Analysis
- Re-analyze
- Analyze New Job

---

## 6. Backend Pipeline (Authoritative)

### Step 1 — Parse JD (AI required)
Input:
- raw_jd_text

AI output (strict JSON):
- job_title
- seniority (Intern | Junior | Mid | Senior)
- employment_type (Full-time | Part-time | Contract | Remote)
- responsibilities (3–5 strings)
- required_skills (array of strings)
- preferred_skills (array of strings)

If AI output invalid:
- Retry once.
- If still invalid: fall back to “manual skills mode” (learner enters skills lists) OR return a structured failure response.

---

### Step 2 — Normalize and Match Skills (Server)
For each extracted skill (required + preferred):
1. Normalize string (trim, case fold).
2. Try catalog match:
   - Exact match by `skills.name` (case-insensitive)
3. If not found: fuzzy match:
   - Alias mapping (examples: ReactJS → React, Postgres → PostgreSQL)
   - Controlled similarity match (implementation detail; must be deterministic)
4. If still not found:
   - classify as `unrecognized_skill` (kept in output as missing but flagged not-in-catalog)
5. If matched to `skill_id`:
   - lookup learner in `user_skills`
   - determine status:
     - matched: learner has the skill at sufficient level
     - partial: learner has the skill but level below required estimate
     - missing: learner does not have it

Required level estimation:
- v1 rule-based mapping using job seniority:
  - Intern/Junior: Beginner acceptable
  - Mid: Intermediate expected
  - Senior: Advanced expected
(You can refine later, but must be deterministic.)

---

### Step 3 — Project Relevance and Suggestions (Server)
Relevant completed projects:
- Completed `user_projects` that demonstrate >= 1 required skill (via `project_skills`).

Suggested projects to build:
- From platform `projects` catalog (source_type = Platform, is_active = true)
- Rank projects by:
  1) number of missing required skills covered (descending)
  2) number of missing preferred skills covered (descending)
  3) feasibility constraint: within learner’s current stage range (if available)
  4) exclude projects already completed

Output:
- relevant_projects[]
- suggested_projects[] (1–3 recommended)

Optional action:
- “Add to My Projects” creates/updates `user_projects` row:
  - status = Available
  - source remains Platform
This write is allowed because it does not claim completion.

---

### Step 4 — Match Score Calculation (Server)
Return a single `match_score` 0–100.

Weighted composite:

- Required skill coverage: 50%
- Preferred skill coverage: 20%
- Relevant projects: 20%
- Roadmap alignment: 10%

Definitions:
- required_skill_coverage = matched_required / total_required
- preferred_skill_coverage = matched_preferred / total_preferred (if none preferred, treat as neutral not penalty)
- relevant_projects_score:
  - normalized metric (implementation: min(1, relevant_projects_count / target_projects))
- roadmap_alignment:
  - based on learner’s path progress and whether missing required skills exist on their roadmap

All components must be deterministic and computed server-side.

---

### Step 5 — Action Plan Generation (AI required)
Input to AI:
- parsed JD snapshot
- missing required skills (with matched topic links where available)
- missing preferred skills (same)
- suggested projects (project_id + title + skills covered)
- learner context:
  - current_path_id
  - current stage (if available)
  - learning_velocity (if available)
  - ai_language_pref
  - ai_detail_level
- resume state summary (optional):
  - resume exists? ats score? summary present? projects included?

AI output (strict JSON):
- title_line (string) e.g., “Action Plan to reach 85%+ match”
- steps[] (max 7), each:
  - step_type: learn_topic | build_project | update_resume | apply_now
  - title: string
  - reason: string (omit if detail_level = short)
  - link_target:
    - topic_id (for learn_topic)
    - project_id (for build_project)
    - "resume" (for update_resume)
    - null (for apply_now)

Rules:
- Ordered: learn first → build second → polish/apply last.
- Every learn_topic/build_project/update_resume step must include a valid link_target.
- No hallucinated ids; all ids must exist in DB. If AI proposes unknown ids, server must reject/repair by mapping to nearest valid targets or drop the step.

If action plan fails:
- Return results without action plan; do not block the entire analysis.

---

## 7. Output Model (Result Object)

Minimum result payload returned by Analyze:

- job_snapshot:
  - job_title
  - seniority
  - employment_type
  - responsibilities[]
- match:
  - match_score
  - label (derived from thresholds)
  - breakdown:
    - required_matched, required_total
    - preferred_matched, preferred_total
    - relevant_projects_count
    - roadmap_alignment_percent
- skills_breakdown:
  - matched[] (skill_id, name, source, level, evidence_projects[])
  - partial[] (skill_id, name, learner_level, required_level_estimate, topic_links[])
  - missing[] (name, required_or_preferred, in_catalog, topic_links[], note_if_outside_scope)
- portfolio_relevance:
  - relevant_projects[] (project_id, title, demonstrated_skills[], links)
  - suggested_projects[] (project_id, title, missing_skills_covered[], stage_ref)
- action_plan (optional):
  - title_line
  - steps[]
- save_actions:
  - can_save (bool)
  - can_reanalyze (bool)

---

## 8. Saved Analyses

Saved analysis behavior:
- An analysis is not persisted until learner clicks “Save Analysis”.
- Saved analyses can be listed and re-analyzed.

Required saved list fields:
- analysis_id
- job_title
- company_name (optional)
- match_score_at_save
- saved_at
Actions:
- Re-analyze (reruns pipeline against current learner data; updates match_score and breakdown; keeps original raw_jd_text)
- Delete (removes saved record only)

Re-analyze must optionally display delta:
- match_score_delta = new_score - previous_score

---

## 9. Roadmap Topic Flagging Integration

When an analysis is saved:
- For each missing skill that maps to roadmap topics (via topic_skills):
  - flag those topics for this user and this analysis as “From Job Analysis”
- Flag must be removed automatically when:
  - the topic becomes Completed for the learner OR
  - the analysis is deleted (implementation decision)

Implementation options:
- Add a dedicated table (recommended): `user_topic_flags` (user_id, topic_id, source_type, source_id, created_at)
- Or store in opportunity_analyses JSON + compute flags dynamically (acceptable but heavier)

Roadmap UI consumes these flags to display badges.

---

## 10. Failure Handling (Hard Rules)

- AI parse invalid JSON:
  - retry once
  - then fallback to manual skills input OR return a structured error response
- JD too vague (e.g., fewer than 5 skills extracted):
  - return warning in result, proceed
- All skills unrecognized:
  - return warning and score may be low; still show unrecognized list
- Action plan generation fails:
  - return results without action plan and include warning

No failure should crash the page; the module must degrade gracefully.

---

## 11. API Contract (Minimum)

Analyze:
- POST /api/opportunities/analyze
  - input: raw_jd_text, job_title?, company_name?
  - output: analysis result object (not saved by default)

Save:
- POST /api/opportunities/:analysis_id/save
  - sets is_saved = true

List:
- GET /api/opportunities
  - returns saved analyses list

Read:
- GET /api/opportunities/:analysis_id
  - returns full stored analysis

Re-analyze:
- POST /api/opportunities/:analysis_id/reanalyze
  - reruns pipeline using stored raw_jd_text + current learner data
  - updates match_score + breakdown + action_plan + last_reanalyzed_at

Delete:
- DELETE /api/opportunities/:analysis_id

Project add shortcut:
- POST /api/opportunities/:analysis_id/add-project
  - input: project_id
  - effect: upsert user_projects status=Available

All endpoints require learner authentication and onboarding_completed = true.

---

## 12. Data Model

### opportunity_analyses

Fields:
- analysis_id (UUID PK)
- user_id (FK)
- job_title (string)
- company_name (nullable)
- seniority_level (Intern | Junior | Mid | Senior)
- employment_type (nullable)
- raw_jd_text (TEXT)
- extracted_skills (JSONB: required[], preferred[])
- match_score (INT 0–100)
- skills_breakdown (JSONB)
- portfolio_relevance (JSONB)
- action_plan (JSONB nullable)
- warnings (JSONB nullable)
- is_saved (boolean default false)
- created_at
- last_reanalyzed_at (nullable)

---

## 13. Integration Points

- Roadmap:
  - topic_skills mapping provides “learn_topic” link targets
  - user_topic_flags (or equivalent) badges topics for saved analyses
- Projects & Skills Hub:
  - suggested projects can be added to user_projects as Available
- Resume Builder:
  - action plan can deep-link to resume editor
  - v2: ATS scoring can use stored JD keywords for job-specific scoring
- Dashboard:
  - provides entry point; may show saved analyses count as engagement signal (read-only)

---

## 14. Invariants

- Output must be grounded in DB facts: real skills, real topics, real projects.
- Matching + scoring is server-side and deterministic.
- AI is used only for:
  - JD parsing into structured JSON
  - generating human-readable action plan steps
- Every action step link must resolve to an existing topic/project/resume route target.
- Re-analysis must reflect updated learner data and show improvement over time.