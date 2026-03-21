# Mallah – Opportunity Analyzer

## 1. Purpose

The Opportunity Analyzer is Mallah's most unique feature. It bridges the gap between
where the learner is right now and a specific job they want — then tells them exactly
what to do to close that gap, with every action linked directly back to their roadmap.

It does three things no other feature on the platform does:

1. **Parses a real job description** and extracts what the employer actually wants.
2. **Compares that against the learner's full profile** — skills earned on Mallah, projects built, roadmap progress, and optionally a CV they upload with prior experience.
3. **Generates a prioritized, roadmap-linked action plan** that tells the learner not just what they're missing, but exactly which topics to study and which projects to build to fix it.

The result is not a generic score. It is a personalized gap report with a concrete path forward.

---

## 2. What Makes This Different from a Resume Scanner

Most ATS tools (Jobscan, SkillSyncer, etc.) compare a resume to a job description. Mallah's
Opportunity Analyzer does something fundamentally different:

| Feature | Typical ATS Tool | Mallah Opportunity Analyzer |
|---|---|---|
| Input | Resume text | Live Mallah data + optional CV |
| Output | Keyword match % | Skill gap + roadmap action plan |
| Actionability | "Add this keyword" | "Study Topic X → Build Project Y" |
| Connected to learning | No | Yes — links directly to roadmap topics |
| Tracks improvement over time | No | Yes — re-analyze to see progress |
| Works for new users | No | Yes — CV upload fills the gap |

This is not a resume optimizer. It is a **learning direction engine** built around a specific opportunity.

---

## 3. Scope & Dependencies

**Entry points:**
- Dashboard → Quick Navigation → "Opportunity Analyzer"
- Sidebar navigation → "Opportunity Analyzer"
- Resume Builder → Cards Grid → `🎯 Job-Based Resume` (uses saved analysis as JD source)

**Depends on:**
- `opportunity_analyses`
- `user_skills`, `skills`
- `user_projects`, `projects`, `project_skills`
- `paths`, `stages`, `topics`, `topic_skills`
- `user_progress`
- `cv_uploads` *(new — optional, stores parsed CV data per user)*
- AI Engine (required for JD parsing, CV parsing, and action plan generation)

---

## 4. Dual Input Model

The analyzer has two data sources for the learner's side of the comparison. Both are always used together when available.

### 4.1 Source A — Mallah Profile (Always Active)

Automatically pulled for every learner. No action required.

| Data | Table | What it contributes |
|---|---|---|
| Skills earned via roadmap | `user_skills` where `source = 'roadmap'` | Verified skills — highest credibility |
| Skills from completed projects | `user_skills` where `source = 'project'` | Verified skills — high credibility |
| Skills added manually | `user_skills` where `source = 'manual'` | Self-reported — moderate credibility |
| Completed projects | `user_projects` where `status = 'completed'` | Portfolio evidence |
| Roadmap progress | `user_progress` | Path alignment signal |

### 4.2 Source B — CV Upload (Optional, Additive)

The learner can upload a CV (PDF or DOCX). The AI parses it and extracts skills and experience that may not yet be reflected in their Mallah profile — prior work experience, courses taken elsewhere, freelance projects, etc.

**Key rules:**
- CV upload is always **additive**, never a replacement. It adds to the Mallah profile data, never overrides it.
- Skills extracted from a CV are labeled `source = 'cv'` and displayed with a distinct **"From CV — unverified"** tag throughout the results.
- CV skills count toward the match score at **0.7x weight** compared to Mallah-verified skills at **1.0x weight**. This reflects that Mallah-earned skills are demonstrated through actual projects and progress, while CV skills are self-reported.
- A learner can upload a CV once and it persists across multiple analyses (stored in `cv_uploads`). They can update or remove it at any time.
- If a skill appears in both the Mallah profile and the CV, the Mallah-verified version takes precedence — it is displayed as verified, not as CV-unverified.

**Why this matters:** A brand new learner with zero Mallah data but real prior work experience gets a meaningful analysis immediately. An active learner who has prior experience outside Mallah can include it without losing the roadmap action plan — the plan still routes through Mallah topics for any missing skills.

---

## 5. UI — Component Library & Design Language

All UI in the Opportunity Analyzer is built with **shadcn/ui** components on top of Tailwind CSS. This section specifies exactly which components map to which parts of the feature.

### 5.1 Input Screen Components

| Element | shadcn/ui Component | Notes |
|---|---|---|
| JD textarea | `Textarea` | Large, min 6 rows, placeholder: "Paste the job description here…" |
| Job title field | `Input` | Optional, placeholder: "Job title (optional — we'll detect it)" |
| Company name field | `Input` | Optional, placeholder: "Company name (optional)" |
| CV upload zone | `shadcn-dropzone` / react-dropzone + shadcn styling | Dashed border zone, "Drop your CV here or click to browse". Accepts PDF and DOCX only. Max 5MB. Shows filename + remove button after upload. |
| CV status indicator | `Badge` (secondary variant) | Shows "CV uploaded: [filename]" when a CV is attached. "No CV — using Mallah profile only" when not. |
| Analyze button | `Button` (default, large) | Full width on mobile. Loading state: `Button` with `Spinner` inside + "Analyzing…" label. |
| Form wrapper | `Card` > `CardContent` | Clean centered card, max-w-2xl, no unnecessary padding |

**Input screen layout:**

```
┌─────────────────────────────────────────┐
│  Analyze a Job Opportunity              │
│  ─────────────────────────────────────  │
│  [JD Textarea — large]                  │
│                                         │
│  Job title (optional)  Company (opt.)   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  📄 Upload your CV (optional)   │    │
│  │  Drop PDF/DOCX or click to browse│   │
│  │  Adds your prior experience     │    │
│  └─────────────────────────────────┘    │
│  [Badge: CV status]                     │
│                                         │
│  [Analyze →]  (primary, full width)     │
└─────────────────────────────────────────┘
```

### 5.2 Results Screen Components

| Element | shadcn/ui Component | Notes |
|---|---|---|
| Results page wrapper | `Tabs` | 5 tabs: Overview / Skills / Portfolio / Action Plan / Saved. Active tab highlighted. |
| Match score circle | Custom SVG radial + shadcn `Card` | Circular progress ring with % in center. Color: red <35%, amber 35–54%, yellow 55–74%, green 75–89%, emerald 90–100%. Label below score. |
| Score breakdown sub-stats | `Card` > `CardContent` with 4 small stat rows | Required skills matched X/Y, Preferred X/Y, Projects X, Path alignment % |
| CV contribution notice | `Alert` (info variant) | Shown if CV was used: "X skills from your CV contributed to this score. Complete roadmap topics to verify them." |
| Skill badge — verified | `Badge` (default/green variant) + `BadgeCheck` icon | Used for Mallah-verified skills |
| Skill badge — CV unverified | `Badge` (secondary/outline variant) + `FileText` icon | Used for CV-sourced skills. Tooltip on hover: "From your CV — not yet verified by Mallah" |
| Skill badge — missing required | `Badge` (destructive variant) | Red, used for missing required skills |
| Skill badge — missing preferred | `Badge` (outline variant) | Muted, used for missing preferred skills |
| Skill badge — partial match | `Badge` (warning/amber variant) | Amber, used for skills at lower level than required |
| Skills section | `Card` with 3 column grid (responsive → 1 col mobile) | ✅ You Have / ⚠ Partial / ❌ Missing |
| Roadmap topic deep link | `Button` (ghost/link variant) with `ArrowRight` icon | "Learn in Stage X → Topic Y" |
| Project cards | `Card` with `CardHeader` + `CardContent` + `CardFooter` | Project title, skills, GitHub/demo links as `Button` (outline) |
| Action plan steps | `Card` list, each step as a numbered row | `Badge` for step type (learn / build / update resume / apply), title, reason, CTA `Button` |
| Step type badge colors | `Badge` variants | `learn_topic` = blue, `build_project` = purple, `update_resume` = amber, `apply_now` = green |
| Bottom action buttons | `Button` group | `Save Analysis` (default), `Re-analyze` (outline), `Analyze New Job` (ghost) |
| Loading state (full results) | `Skeleton` components | Skeleton shapes matching each panel's layout. Renders immediately on submit, replaced when data arrives. |
| Toast notification | `Sonner` | "Analysis saved" / "Re-analysis complete — score updated" |

### 5.3 Saved Analyses List Components

| Element | shadcn/ui Component | Notes |
|---|---|---|
| Saved analyses list | `Card` list or `Table` | Job title, company, score badge, date, Re-analyze + Delete buttons |
| Score badge in list | `Badge` colored by threshold | Same color logic as match score circle |
| Score delta | `Badge` (green) | "+12% since last analysis" — shown if score improved on re-analyze |
| Empty state | shadcn `Empty` or custom | "No saved analyses yet. Paste a job description to get started." |

---

## 6. The Two-Phase UX

The feature has two clear phases: **Input** and **Results**.

---

### Phase 1 — Input

**Single focused screen. No clutter.**

Components (see Section 5.1 for shadcn mapping):
- Large `Textarea`: "Paste the job description here"
  - Minimum 100 characters to proceed (validates on submit via Zod)
  - No maximum — full JDs are welcome
- Optional `Input`: Job title (editable — pre-filled by AI after parse, learner can correct)
- Optional `Input`: Company name (for saved analysis labeling only, not used in scoring)
- CV Upload zone: drag-and-drop or click-to-browse. PDF/DOCX only, max 5MB.
  - If a CV was previously uploaded: shows "Using: [filename]" with a "Remove" option
  - If no CV: shows "No CV attached — analysis will use your Mallah profile only"
- `Analyze` button (primary, large)

**What happens on submit:**
- Button transitions to loading state with `Spinner` + "Analyzing…"
- `Skeleton` placeholders render immediately for all 5 result panels
- Backend processes in the background (see Section 8)
- `Tabs` results screen replaces the skeleton when data arrives (typically 3–8 seconds)

---

### Phase 2 — Results

Results are organized into **5 tabs** using shadcn `Tabs`. Each tab is independently navigable. The default open tab is "Overview."

---

#### Tab 1 — Overview

Contains Panel 1 (Job Snapshot) and Panel 2 (Match Score) side by side on desktop, stacked on mobile.

**Panel 1 — Job Snapshot**

Extracted automatically by AI from the job description. Learner can edit any field inline.

| Field | Source |
|---|---|
| Job title | AI-extracted, editable |
| Seniority level | AI-extracted: `Intern` / `Junior` / `Mid` / `Senior` |
| Key responsibilities | AI-extracted: 3–5 bullet summary |
| Employment type | AI-extracted: Full-time / Part-time / Contract / Remote |

**Panel 2 — Match Score**

A circular SVG progress ring showing the match percentage (0–100%).

```
        ╭──────╮
       ( 68%   )   ← ring color = amber (55–74%)
        ╰──────╯
     Strong Candidate
  ─────────────────────
  Required skills:  8/12  ████████░░░░
  Preferred skills: 3/5   ██████░░░░
  Projects:         2/3   ████████░░
  Path alignment:   72%   ████████████░░░░
```

Score label thresholds:

| Score | Label | Ring color |
|---|---|---|
| 0–34% | Not Ready Yet | Red (`text-red-500`) |
| 35–54% | Early Stage | Amber (`text-amber-500`) |
| 55–74% | Getting Close | Yellow (`text-yellow-500`) |
| 75–89% | Strong Candidate | Green (`text-green-500`) |
| 90–100% | Excellent Match | Emerald (`text-emerald-500`) |

If CV data contributed to the score, an `Alert` (info variant) appears below the score:
> "X of your matched skills came from your CV and are unverified. Complete roadmap topics to strengthen them."

---

#### Tab 2 — Skills

Panel 3 — Skills Breakdown. Three columns (responsive: stacked on mobile):

**✅ You Have These**
- Skills from `user_skills` that match extracted job requirements
- Mallah-verified skills: `Badge` (green) + `BadgeCheck` icon
- CV-sourced skills: `Badge` (outline) + `FileText` icon + "From CV" label
- Source tag below each: Roadmap / Project / Manual / CV
- For Mallah project skills: small chip showing which project demonstrates it

**⚠ Partial Match**
- Skills the learner has at a lower level than the job likely requires
- `Badge` (amber) showing: current level → required level estimate
- Action link: `Button` (ghost) "Strengthen this skill →" → relevant roadmap topics

**❌ Missing**
- Skills from the JD with no match in `user_skills` or the CV
- Required missing: `Badge` (destructive) — shown first
- Preferred missing: `Badge` (outline, muted) — shown second
- For each missing required skill:
  - "Is this on your roadmap?" indicator
  - If yes: `Button` (ghost) "Learn it in Stage X → Topic Y" → opens Topic Viewer
  - If no: muted label "Outside current path scope"

---

#### Tab 3 — Portfolio

Panel 4 — Portfolio Relevance. Two sub-sections within the tab.

**Your relevant projects:**
- Lists completed `user_projects` relevant to this job (matched via `project_skills` + extracted skills)
- Each as a `Card`: project title, skill `Badge` chips, GitHub/demo `Button` (outline) links
- Sub-label: "Highlight these in your resume for this role"
- If CV projects exist: displayed separately with "From CV" label

**Projects to build:**
- Suggests 1–3 specific projects from the `projects` catalog that address skill gaps
- Prioritizes: (a) not yet done, (b) cover the most missing required skills, (c) within learner's current stage range
- Each `Card` shows: project title, skills it would add as `Badge` chips, which stage it belongs to
- CTA: `Button` "Add to My Projects" → writes to `user_projects` with `status = 'available'`

---

#### Tab 4 — Action Plan

Panel 5 — The most important output. AI-generated, roadmap-anchored, prioritized.

A numbered list of concrete steps. Each step is a `Card` row with:
- Step number (large, muted)
- Step type `Badge` (color-coded: learn = blue, build = purple, update resume = amber, apply = green)
- Title (one line, bold)
- Reason (1–2 lines, muted — omitted if `ai_detail_level = short`)
- CTA `Button` (outline or ghost depending on step type)

**Step ordering:** learn first → build second → resume/apply third.

**Example:**

```
1  [learn]   Complete "CSS Flexbox & Grid"
             Stage 1 · Topic 4 · ~45 mins
             Required by this JD. Currently missing from your skills.
             → Open Topic

2  [build]   Build the "Responsive Portfolio Page" project
             Demonstrates HTML/CSS — employers want proof, not just knowledge.
             → View Project

3  [build]   Complete "JavaScript Async & Fetch API"
             Stage 2 · Topic 6
             Listed as required. Currently missing from your skills.
             → Open Topic

4  [resume]  Add your "Movie Search App" to your resume for this role
             Demonstrates React and API integration — both required.
             → Open Resume Builder

5  [resume]  Update your Summary section
             Your current summary is generic. This JD has 3 frontend-specific keywords.
             → Open Resume Builder
```

**Rules for AI-generated action plan:**
- Maximum 7 steps. More becomes overwhelming.
- Every `learn_topic` step must include a deep link to the Topic Viewer.
- Every `build_project` step must link to the Portfolio Hub.
- Every `update_resume` step must link to the Resume Builder — specifically:
  - If the learner has a job-based resume whose `source_jd.analysis_id` matches this saved analysis → link directly to that resume in the editor.
  - If no matching job-based resume exists → link to the Resume Builder Cards Grid, where the learner can create a job-based resume for this role.
- Steps ordered: learn → build → apply/polish.
- Respects `ai_language_pref` and `ai_detail_level`.
- If `ai_detail_level = short` → reason omitted, steps are one line each.

---

#### Tab 5 — Saved

Lists all saved analyses for this learner. See Section 7.

---

#### Bottom Action Bar (Persistent across all tabs)

Sticky bar at the bottom of the results screen:

- `Button` (default): `Save Analysis` — persists to `opportunity_analyses`
- `Button` (outline): `Re-analyze` — reruns same JD + CV against updated learner data
- `Button` (ghost): `Analyze New Job` — clears and returns to input screen
- `Button` (outline, v2 only): `Export as PDF`

---

## 7. Saved Analyses

Learners can save analyses and return to them later.

**Saved Analyses list** (Tab 5 of results, or accessible from the input screen):
- Job title + company (if entered)
- Match score `Badge` (colored by threshold)
- Score delta `Badge` (green "+X%" if re-analyzed and improved)
- Date saved
- `Button` (outline): "Re-analyze" — reruns against current Mallah data + CV
- `Button` (ghost/destructive): "Delete"

**Re-analyze is a key feature.** As the learner completes topics and builds projects, their match score for a saved job increases. Seeing that number move from 52% to 71% is a powerful motivator. This is what makes the Opportunity Analyzer a living tool, not a one-time report.

---

## 8. Backend Processing Flow

### 8.1 Step 1 — Parse Job Description (AI)

Send raw JD text to AI. Extract strict JSON:

```json
{
  "job_title": "string",
  "seniority": "Intern | Junior | Mid | Senior",
  "employment_type": "Full-time | Part-time | Contract | Remote",
  "required_skills": ["React", "TypeScript", "REST API"],
  "preferred_skills": ["GraphQL", "Docker"],
  "responsibilities": ["string", "string", "string"]
}
```

### 8.2 Step 2 — Parse CV (AI, if uploaded)

If a CV file is attached, send to AI. Extract strict JSON:

```json
{
  "extracted_skills": ["React", "Node.js", "Python"],
  "inferred_level": {
    "React": "intermediate",
    "Node.js": "beginner",
    "Python": "intermediate"
  },
  "experience_years": 2,
  "previous_roles": ["Frontend Intern", "Freelance Developer"]
}
```

Parsed CV data is stored in `cv_uploads` and reused across analyses unless the learner updates it. Skills extracted from the CV are tagged `source = 'cv'`.

### 8.3 Step 3 — Merge Profile Data

Combine Mallah profile + CV data into a unified learner skill set:

- For each skill: if present in both Mallah and CV → use Mallah version (higher credibility). Discard CV duplicate.
- For skills only in CV: include with `source = 'cv'`, credibility weight = 0.7.
- For skills only in Mallah: include with full credibility weight = 1.0.
- Result: a merged skill map with source and weight for every skill.

### 8.4 Step 4 — Skill Matching

For each extracted JD skill (required + preferred):
1. Exact match against `skills` catalog (case-insensitive)
2. Fuzzy match if no exact match ("ReactJS" → "React", "Postgres" → "PostgreSQL")
3. Check merged skill map:
   - Found with level → matched (full weight) or partial (level mismatch)
   - Found as CV-only → matched at 0.7x weight
   - Not found → missing
4. Skills not in the catalog at all → flagged as `unrecognized_skill`, included in report as missing, labeled "Not in catalog"

### 8.5 Step 5 — Project Matching

For each required skill:
- Query `project_skills` → find Mallah catalog projects that teach this skill
- Cross-reference `user_projects` → which has this learner completed?
- Relevant = completed projects covering ≥ 1 required skill
- Suggested = not-yet-completed projects covering the most missing required skills (priority: within learner's current stage range)

### 8.6 Step 6 — Score Calculation

Weighted composite score:

| Factor | Weight | Description |
|---|---|---|
| Required skill coverage | 50% | % of required skills matched (Mallah = 1.0x, CV = 0.7x per skill) |
| Preferred skill coverage | 20% | % of preferred skills matched (same weighting logic) |
| Relevant projects | 20% | % of job-relevant project types in `user_projects` |
| Roadmap progress alignment | 10% | How far through the relevant path the learner is |

Returns:
- `match_score` (0–100 int)
- `required_skills_matched` count + total
- `preferred_skills_matched` count + total
- `cv_skills_contributed` count (how many CV skills contributed to the score)
- `relevant_projects_count`
- `roadmap_progress_alignment` %

### 8.7 Step 7 — Action Plan Generation (AI)

Send to AI:
- Missing required skills (with linked topics from `topic_skills`)
- Partial match skills (with links to strengthening topics)
- Suggested projects
- Resume gaps (summary present? skills section populated?)
- CV skills that are unverified (action plan can suggest completing a roadmap topic to verify them)
- Learner's current stage and velocity
- `ai_language_pref`, `ai_detail_level`

AI returns ordered action steps (max 7). Each step:
- `step_type`: `learn_topic` / `build_project` / `update_resume` / `apply_now`
- `title`: one-line description
- `reason`: why this step (omitted if `ai_detail_level = short`)
- `link_target`: `topic_id` / `project_id` / `resume` / null

### 8.8 Failure Handling

| Failure scenario | Behavior |
|---|---|
| AI JD parse fails / bad JSON | Retry once. On second failure: show manual skill input fallback |
| CV parse fails | Proceed without CV data. Show `Alert`: "We couldn't parse your CV. Analysis is based on your Mallah profile only." |
| JD too vague (< 5 skills extracted) | Show `Alert` (warning): "This JD has limited detail. Results may be incomplete." Proceed anyway. |
| All skills unrecognized | Show: "We couldn't match skills from this JD to our catalog. Try a more detailed description." |
| AI action plan fails | Show Skills tab only. Hide Action Plan tab. Show `Alert`: "Action plan unavailable right now." |

---

## 9. Data Model

### `opportunity_analyses` table

| Field | Type | Notes |
|---|---|---|
| `analysis_id` | UUID (PK) | |
| `user_id` | FK | |
| `job_title` | VARCHAR | AI-extracted, learner-editable |
| `company_name` | VARCHAR | Optional |
| `seniority_level` | ENUM | `Intern` / `Junior` / `Mid` / `Senior` |
| `raw_jd_text` | TEXT | Original pasted JD |
| `extracted_skills` | JSONB | `{ required: [], preferred: [] }` |
| `match_score` | INT | 0–100 at time of last analysis |
| `cv_skills_contributed` | INT | Count of CV skills that contributed to score |
| `skills_breakdown` | JSONB | Matched / partial / missing arrays, each item includes `source` and `weight` |
| `action_plan` | JSONB | Array of step objects |
| `is_saved` | BOOLEAN | Default `false` — flips on Save |
| `created_at` | TIMESTAMP | |
| `last_reanalyzed_at` | TIMESTAMP | Updated on every re-analyze |

### `cv_uploads` table *(new)*

| Field | Type | Notes |
|---|---|---|
| `cv_id` | UUID (PK) | |
| `user_id` | FK | One active CV per user (upsert on new upload) |
| `file_name` | VARCHAR | Original filename shown in UI |
| `extracted_skills` | JSONB | `{ skill_name, inferred_level }[]` |
| `experience_years` | INT | AI-estimated total years of experience |
| `previous_roles` | TEXT[] | AI-extracted role titles |
| `uploaded_at` | TIMESTAMP | |

---

## 10. Roadmap Integration

When a learner saves an analysis, the relevant missing-skill topics are flagged in the roadmap UI with a badge: **"From Opportunity Analyzer"**.

This means:
- On the Roadmap page, topics that address a saved job's skill gaps get a subtle visual tag
- The learner doesn't have to remember what to study — the roadmap reminds them
- This tag is removed when the topic is completed
- CV-unverified skills that have a corresponding roadmap topic are also flagged — completing that topic upgrades the skill from "unverified (CV)" to "verified (roadmap)"

This is the loop that makes the platform coherent:
> Job analysis → identifies gaps → flags roadmap topics → learner studies → skill upgrades from CV to verified → re-analyze → score improves

---

## 11. States & Edge Cases

| Scenario | Behavior |
|---|---|
| Learner has no Mallah skills AND no CV | Show 0% match. `Alert` (info): "Upload your CV or start your roadmap to get a meaningful analysis." Action plan focuses entirely on roadmap start. |
| Learner has no Mallah skills but uploads CV | Score calculated from CV data at 0.7x weight. Action plan includes roadmap topics to verify CV skills. |
| Active Mallah learner, no CV uploaded | Full analysis from Mallah data. CV upload zone shown but not required. |
| CV parse fails | Proceed using Mallah profile only. Show `Alert` (warning). |
| Very low match (< 35%) for Senior role | Honest message in action plan: "This is a Senior role. We recommend building your skills through your roadmap before applying." |
| All required skills already matched | Celebrate in Overview: "You're an excellent match. Focus on portfolio polish and applying." |
| JD is not a tech role | `Alert` (warning): "This doesn't appear to be a tech role. Results may be inaccurate." Proceed. |
| Learner re-analyzes saved job | Score updates. If improved: `Badge` (green) "+X% since last analysis" shown in Saved tab and at top of Overview. |
| Missing skill has no roadmap topic | Label "Outside current path scope." Suggest as manual skill to add after path completion. |
| CV skill already covered by Mallah skill | Mallah version takes precedence. CV version silently discarded. Not shown as duplicate. |

---

## 12. Integration Points

- **Roadmap** — Tags topics linked to missing skills with "From Opportunity Analyzer" badge when an analysis is saved. CV-unverified skills with roadmap topics are also tagged. Completing a tagged topic upgrades a CV skill to roadmap-verified.
- **Portfolio Hub** — "Projects to Build" suggestions can be added directly to `user_projects` with `status = 'available'`.
- **Resume Builder** — Action plan `update_resume` steps deep-link directly to the learner's job-based resume for this role if one exists, or to the Resume Builder Cards Grid to create one. The Job-Based Resume feature uses the saved analysis (`analysis_id`) as its source JD — creating a tailored resume copy pre-configured around this job's requirements. This connection is live in v1.
- **Dashboard** — Quick Navigation links here. `opportunity_analyses.created_at` feeds the Dashboard Recent Activity section.
