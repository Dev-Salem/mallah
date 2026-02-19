# Mallah – Opportunity Analyzer

## 1. Purpose

Help the learner understand how well they match a specific job posting and what to do next by:

- Parsing a job description.
- Comparing required skills to the learner’s skill & project data.
- Generating a clear action plan linked to the roadmap.

---

## 2. Scope & Dependencies

- Entry:
  - From Dashboard: “Analyze Job”
  - From nav menu
- Depends on:
  - `opportunity_analyses`
  - `user_skills`, `skills`
  - `user_projects`, `projects`
  - `paths`, `stages`, `topics`, `topic_skills`
  - AI Engine (for parsing and action plan)

---

## 3. UI Structure

### 3.1 Input Page

1. Header: “Opportunity Analyzer”
2. Text area:
   - Placeholder: “Paste the job description here…”
3. Optional fields:
   - Job title (editable)
4. Buttons:
   - “Analyze Match”
   - “Clear”

Validation: show error if description is too short.

---

### 3.2 Result Page

1. Job Summary Panel
   - Job title (extracted or user-edited)
   - Seniority (Junior / Mid / Senior)
   - Source (optional display only)

2. Match Score Panel
   - Big percentage: “Match Score: 72%”
   - Short label: “Good match / Needs work / Not ready yet”

3. Skills Comparison Panel
   - Required skills list:
     - Each line: skill name + status:
       - ✅ Matched (user already has this skill)
       - ⚠ Partially matched
       - ❌ Missing
   - For missing skills:
     - Show button: “Add to Roadmap” or “View related topics”

4. Projects Relevance Panel
   - Current user projects that support this role.
   - Suggestions:
     - “Consider building: [Suggested Project]” (if missing portfolio pieces)

5. Action Plan Panel
   - Timeline view:
     - Step 1: Learn X (linked to topics)
     - Step 2: Build project Y
     - Step 3: Update resume
   - AI-generated text with clear bullet steps.

6. Actions
   - “Save Analysis”
   - “Analyze New Job”

---

## 4. Core Flows

### 4.1 Analyze Job

**Input:**
- Raw job description text
- `user_id`

**Process:**
- Validate input length
- Backend sends prompt to AI:
  - Extract:
    - job title
    - seniority
    - required skills (list)
    - preferred skills (optional)
- Map extracted skills to `skills` table (exact match or fuzzy)
- Compare with `user_skills`:
  - Determine matched, partial, and missing
- Calculate match score:
  - For example: (Matched skills / total important skills) × 100
- Build action plan:
  - For each missing or weak skill:
    - Find related topics via `topic_skills`
  - Suggest projects via `projects` + `project_skills`
- Save summary in `opportunity_analyses` if user chooses “Save Analysis”

**Output UI:**
- Result page with match score, skills comparison, and action plan.

---

### 4.2 Add Missing Skill to Roadmap

**Input:**
- Click on “Add to Roadmap” for a missing skill

**Process (conceptual):**
- Identify:
  - Path and topics that teach this skill (`topic_skills`)
- Mark relevant topics as “recommended” or show inline hints in roadmap

**Output:**
- Confirmation message
- Possibly label topics in the Roadmap UI as “From Opportunity Analysis”

---

### 4.3 Save Analysis

**Input:**
- Button “Save Analysis”
- Current analysis data

**Process:**
- Insert into `opportunity_analyses`:
  - job_title_extracted
  - seniority_level
  - raw_input_type = TEXT
  - match_score
  - missing_skills_summary
  - action_plan_richtext
  - `created_at`, `is_saved = 1`

**Output:**
- Ability to re-open previous analyses list later

---

## 5. States & Edge Cases

- Weak parsing:
  - If AI fails to extract good structure, show fallback: basic summary + generic advice.
- Very low match score:
  - Show honest message: “This role requires significantly more experience; consider focusing on X first.”
- No roadmap topics for a missing skill:
  - Suggest manual learning or label as “Out of current scope”.

---
