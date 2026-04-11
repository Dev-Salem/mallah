# Mallah – Opportunity Analyzer

## 1. Purpose

The Opportunity Analyzer is Mallah's career intelligence layer. It does two connected things:

1. **Surfaces curated real jobs** relevant to the learner's path — sourced weekly from Saudi Arabia via SerpAPI (Google for Jobs), reviewed by admins, and refreshed every 7 days. The learner arrives to a curated job board, not a blank input screen.

2. **Analyzes any job in depth** — whether from the curated feed or pasted manually. It compares the job's requirements against the learner's full profile, identifies skill gaps, and generates a roadmap-linked action plan telling them exactly what to study and build to close the gap.

It does three things no other feature on the platform does:

1. **Surfaces curated, current job listings** from Saudi Arabia matched to the learner's career path, refreshed weekly.
2. **Parses any job description** and extracts what the employer actually wants.
3. **Generates a prioritized, roadmap-linked action plan** telling the learner exactly which topics to study and which projects to build to close the gap.

The result is a curated job discovery tool with a personalized gap report and a concrete path forward for each opportunity.

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
- `opportunity_analyses`, `job_listings` *(new — stores curated job posts)*
- `user_skills`, `skills`
- `user_projects`, `projects`, `project_skills`
- `paths`, `stages`, `topics`, `topic_skills`
- `user_progress`
- `cv_uploads` *(optional, stores parsed CV data per user)*
- **SerpAPI** — weekly Google for Jobs fetch for Saudi Arabia. Free tier (100 searches/month) covers 4 paths × 4 weeks = 16 calls/month.
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

### 5.1 Job Feed Components

| Element | shadcn/ui Component | Notes |
|---|---|---|
| Feed heading | `Text` + `Badge` | "This week's jobs — [Path Name]" + "Updated Monday" badge |
| Sort dropdown | `Select` | "Best Match" (default) / "Newest" |
| Seniority filter | `Select` | "All levels" / "Intern" / "Junior" / "Mid" / "Senior" |
| Search bar | `Input` with search icon | Filters feed by keyword, client-side |
| Job card | `Card` with hover shadow | Title, company, location, seniority, match score bar, expiry |
| Match score bar | Custom `Progress` | Colored by threshold — red/amber/green |
| Analyze button | `Button` (default, small) | "Analyze →" — triggers quick view |
| Save button | `Button` (ghost, small) | Saves to `opportunity_analyses` without running analysis |
| Analyze a JD button | `Button` (outline) | Opens manual JD input panel |
| Empty state | Custom | "No jobs this week yet" with CTA to paste JD |

### 5.2 Manual JD Input Components

| Element | shadcn/ui Component | Notes |
|---|---|---|
| JD textarea | `Textarea` | Large, min 6 rows, placeholder: "Paste the job description here…" |
| CV upload zone | react-dropzone + shadcn styling | Dashed border zone. Accepts PDF and DOCX only. Max 5MB. |
| CV status indicator | `Badge` (secondary variant) | Shows "CV uploaded: [filename]" or "No CV — Mallah profile only" |
| Analyze button | `Button` (default, large) | Full width on mobile. Loading state: `Spinner` + "Analyzing…" |

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
| Empty state | shadcn `Empty` or custom | "No saved analyses yet. Analyze a job from the feed or paste a JD to get started." |

---

## 6. The Three-Phase UX

The feature has three phases: **Job Feed → Job Card → Full Analysis**.

---

### Phase 1 — Job Feed (Landing Screen)

The learner lands on a **curated job board** showing the latest published jobs for their path. Jobs are sourced weekly from Google for Jobs (Saudi Arabia) via SerpAPI, published automatically, and auto-expire after 7 days.

```
┌──────────────────────────────────────────────────────────────────┐
│  Opportunity Analyzer                                            │
│                                                                  │
│  [🔍 Search jobs...    ] [All levels ▾]     [Analyze a JD]       │
│                                                                  │
│  This week's jobs — Frontend Development     Updated Monday      │
│  ─────────────────────────────────────────                       │
│  Sort: [Best Match ▾]                                            │
│                                                                  │
│  ┌────────────────────────────┐  ┌────────────────────────────┐  │
│  │ Frontend Developer         │  │ React Engineer             │  │
│  │ Noon · Riyadh · Junior     │  │ STC · Remote (SA) · Mid    │  │
│  │ Match: 88%  █████████░     │  │ Match: 74%  ████████░░     │  │
│  │ Expires in 5 days          │  │ Expires in 5 days          │  │
│  │ [Analyze →]  [Save]        │  │ [Analyze →]  [Save]        │  │
│  └────────────────────────────┘  └────────────────────────────┘  │
│  ┌────────────────────────────┐  ┌────────────────────────────┐  │
│  │ UI Developer               │  │ Junior Frontend Dev        │  │
│  │ Jarir · Jeddah · Junior    │  │ Aramco · Riyadh · Junior   │  │
│  │ Match: 61%  ██████░░░░     │  │ Match: 51%  █████░░░░░     │  │
│  │ Expires in 3 days          │  │ Expires in 3 days          │  │
│  │ [Analyze →]  [Save]        │  │ [Analyze →]  [Save]        │  │
│  └────────────────────────────┘  └────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

**How the feed works:**

- Shows up to 10 published `job_listings` where `path_id = learner.current_path_id` and `status = 'published'`
- **Default sort: match score descending** — best fit jobs shown first. Learner can toggle to "Newest" via the sort dropdown.
- Each card shows: job title, company, city, seniority level, match score bar, and days until expiry
- Jobs expire automatically 7 days after publishing

**Match score on the card:**

Calculated server-side without AI using the stored `required_skills[]` and `preferred_skills[]`:

```
match = (required_covered / total_required) × 0.70 + (preferred_covered / total_preferred) × 0.30
```

This is a **preview score** — fast, rule-based. Full AI analysis (Phase 3) runs only on explicit user action.

**Seniority filter:**

A dropdown next to the search bar: `All levels` / `Intern` / `Junior` / `Mid` / `Senior`. Filters the current feed. Default: `All levels`. Seniority is AI-extracted from the job description during the cron fetch and stored in `job_listings.seniority`.

**Search bar:**

Filters the current feed by job title keyword within published listings for the learner's path. If no results: "No jobs match your search. Try Analyze a JD to paste a job from anywhere."

**"Analyze a JD" button:**

Opens the manual JD input panel. Allows the learner to analyze any job from outside the feed.

**Empty state (no jobs published yet for this path):**

"No jobs this week yet — check back Monday. In the meantime, paste any job description to analyze it."

---

### Phase 2 — Job Card (Quick View)

Clicking `Analyze →` on any job card from the feed triggers analysis and shows a **quick analysis card** that expands inline or opens as a side panel. This is a condensed version of the full results — enough to decide whether this job is worth pursuing.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to feed                                                  │
│                                                                  │
│  Frontend Developer                                              │
│  Noon · Riyadh, Saudi Arabia · Full-time · Posted 2 days ago    │
│  [Apply on LinkedIn ↗]   [Save Analysis]   [Full Analysis →]    │
│  ─────────────────────────────────────────                       │
│                                                                  │
│  Match: 74%   ████████░░  Strong Candidate                       │
│                                                                  │
│  ✅ You have:  React · TypeScript · Git · REST API               │
│  ❌ Missing:   Node.js · PostgreSQL                              │
│  ⚠  Partial:  CSS (need advanced level)                         │
│                                                                  │
│  Top 3 actions:                                                  │
│  1. [learn] Complete "Node.js Fundamentals" → Open Topic         │
│  2. [build] Build "REST API Blog Backend" project → View         │
│  3. [resume] Create a job-based resume for this role → Builder   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**What's shown in the quick view:**
- Job details (title, company, location, type, posted date, apply link)
- Match score ring + label
- Skills you have (top 4–5)
- Missing required skills
- Partial matches
- Top 3 action plan steps
- `Full Analysis →` button — opens Phase 3 for the complete 5-tab results

The quick view is generated on click — no full AI analysis yet. It uses rule-based matching against `user_skills`. Full AI processing only happens when the learner clicks `Full Analysis →`.

---

### Phase 3 — Full Analysis

The full 5-tab results experience. Identical to the previous spec — triggered either from `Full Analysis →` in the quick view, or directly from `Analyze a JD` (manual paste flow).

The 5 tabs remain: **Overview / Skills / Portfolio / Action Plan / Saved.**

#### Tab 1 — Overview

Contains Panel 1 (Job Snapshot) and Panel 2 (Match Score) side by side on desktop, stacked on mobile.

**Panel 1 — Job Snapshot**

For jobs from the feed: pre-populated from `job_listings` data (SerpAPI). For pasted JDs: extracted by AI.

| Field | Source |
|---|---|
| Job title | `job_listings` / AI-extracted, editable |
| Company | `job_listings` / AI-extracted |
| Location | `job_listings` / AI-extracted |
| Seniority level | `job_listings` (AI-extracted during cron fetch) |
| Key responsibilities | AI-extracted: 3–5 bullet summary |
| Employment type | `job_listings` / AI-extracted: Full-time / Part-time / Contract / Remote |
| Apply URL | `job_listings.apply_url` (for feed jobs) / none (for pasted JDs) |

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

Score label thresholds — use Mallah color tokens:

| Score | Label | Color token |
|---|---|---|
| 0–34% | Not Ready Yet | `destructive` (Alert Red) |
| 35–54% | Early Stage | `warning` (Tactical Amber) |
| 55–74% | Getting Close | `warning` (Tactical Amber) |
| 75–89% | Strong Candidate | `success` (Forest Emerald) |
| 90–100% | Excellent Match | `success` (Forest Emerald) |

If CV data contributed to the score, an `Alert` (info variant) appears below the score:
> "X of your matched skills came from your CV and are unverified. Complete roadmap topics to strengthen them."

---

#### Tab 2 — Skills

Panel 3 — Skills Breakdown. Three columns (responsive: stacked on mobile):

**✅ You Have These**
- Skills from `user_skills` that match extracted job requirements
- Mallah-verified skills: `Badge` (success) + `BadgeCheck` icon
- CV-sourced skills: `Badge` (outline) + `FileText` icon + "From CV" label
- Source tag below each: Roadmap / Project / Manual / CV

**⚠ Partial Match**
- Skills the learner has at a lower level than the job likely requires
- `Badge` (warning) showing: current level → required level estimate
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

Panel 4 — Portfolio Relevance. Two sub-sections.

**Your relevant projects:**
- Lists completed `user_projects` relevant to this job (matched via `project_skills` + extracted skills)
- Each as a `Card`: project title, skill `Badge` chips, GitHub/demo `Button` links
- Sub-label: "Highlight these in your resume for this role"

**Projects to build:**
- Suggests 1–3 specific projects from the `projects` catalog that address skill gaps
- Prioritizes: (a) not yet done, (b) cover the most missing required skills, (c) within learner's current stage range
- CTA: `Button` "Add to My Projects" → writes to `user_projects` with `status = 'available'`

---

#### Tab 4 — Action Plan

Panel 5 — AI-generated, roadmap-anchored, prioritized. Maximum 7 steps.

A numbered list of concrete steps. Each step is a `Card` row with:
- Step number (large, muted)
- Step type `Badge` (learn = `info` Digital Blue, build = purple, update resume = `warning` Amber, apply = `success` Emerald)
- Title (one line, bold)
- Reason (1–2 lines, muted — omitted if `ai_detail_level = short`)
- CTA `Button`

**Rules:**
- Every `learn_topic` step → deep link to the Topic Viewer
- Every `build_project` step → link to the Portfolio Hub
- Every `update_resume` step → link to the Resume Builder (directly to matching job-based resume if `source_jd.analysis_id` matches, otherwise to the Cards Grid)
- Steps ordered: learn → build → resume/apply
- Respects `ai_language_pref` and `ai_detail_level`

---

#### Tab 5 — Saved

Lists all saved analyses for this learner. See Section 7.

---

#### Bottom Action Bar (Persistent across all tabs in Phase 3)

- `Button` (default): `Save Analysis`
- `Button` (outline): `Re-analyze` — reruns same JD + CV against updated learner data
- `Button` (ghost): `← Back to Feed` — returns to Phase 1

---

## 7. Saved Analyses

Learners can save analyses and return to them later.

**Saved Analyses list** (Tab 5 of results, or accessible from the input screen):
- Job title + company (if entered)
- Match score `Badge` (colored by threshold)
- Score delta `Badge` (success "+X%" if re-analyzed and improved)
- Date saved
- `Button` (outline): "Re-analyze" — reruns against current Mallah data + CV
- `Button` (ghost/destructive): "Delete"
- **"Apply Ready" badge** — shown prominently when match score ≥ 75%: a `Badge` (success) with a checkmark "✓ Ready to Apply". Clicking it deep-links to the Resume Builder to create a job-based resume for this role.

**Re-analyze is a key feature.** As the learner completes topics and builds projects, their match score for a saved job increases. Seeing that number move from 52% to 71% is a powerful motivator.

**Apply Ready notification:** when a learner re-analyzes a saved job and their score crosses 75% for the first time, a `Sonner` toast appears: "You're now ready to apply for [Job Title] at [Company]. Create a tailored resume to get started." The toast includes a direct link to the Resume Builder.

---

## 7B. Job Feed — SerpAPI Fully Automated

### 7B.1 Overview

Jobs are fetched automatically every Monday via SerpAPI (Google for Jobs), published immediately with no admin review, and expire automatically after 7 days. Learners always see a fresh weekly feed with zero manual effort.

**Volume:** 4 paths × ~10 jobs per fetch = ~40 jobs per week.
**Cost:** SerpAPI free tier allows 100 searches/month. 4 searches/week × 4 weeks = 16 calls/month. Free tier covers this indefinitely.

### 7B.2 Weekly Cron Job

Fires every **Monday at 8:00 AM AST**. Runs one SerpAPI query per path:

```ts
const pathQueries = {
  frontend:      'Frontend Developer OR React Developer Riyadh OR Jeddah Saudi Arabia',
  fullstack:     'Full Stack Developer OR Node.js Developer Riyadh OR Jeddah Saudi Arabia',
  cybersecurity: 'Cybersecurity Analyst OR Penetration Tester Saudi Arabia',
  datascience:   'Data Scientist OR Data Analyst Saudi Arabia',
};
```

Each query hits the SerpAPI Google Jobs endpoint with `location: "Saudi Arabia"` and `chips: "date_posted:month"` (jobs posted in the last 30 days — ensures enough results even in slow weeks).

**On each fetch:**
1. Fetch up to 10 results per path from SerpAPI
2. For each result, run AI skill + seniority extraction from the job description → populate `required_skills[]`, `preferred_skills[]`, and `seniority`
3. Save to `job_listings` with `status = 'published'`, `published_at = now()`, `expires_at = now() + 7 days`
4. Delete or expire any `job_listings` rows from the previous week (`expires_at < now()`)

No human review step. Jobs go live immediately after AI extraction.

### 7B.3 `job_listings` Table

| Field | Type | Notes |
|---|---|---|
| `job_id` | UUID (PK) | |
| `path_id` | VARCHAR | FK to paths |
| `title` | VARCHAR | |
| `company` | VARCHAR | |
| `location` | VARCHAR | City or "Remote (SA)" |
| `is_remote` | BOOLEAN | |
| `employment_type` | VARCHAR | Full-time / Part-time / Contract |
| `seniority` | ENUM | `Intern` / `Junior` / `Mid` / `Senior` — AI-extracted during cron fetch |
| `description` | TEXT | Full job description |
| `required_skills` | JSONB | `string[]` — AI-extracted on fetch |
| `preferred_skills` | JSONB | `string[]` — AI-extracted on fetch |
| `apply_url` | VARCHAR | Direct apply link from SerpAPI |
| `source_url` | VARCHAR | Original listing URL |
| `status` | ENUM | `published` / `expired` |
| `published_at` | TIMESTAMP | Set on cron insert |
| `expires_at` | TIMESTAMP | `published_at + 7 days` |
| `created_at` | TIMESTAMP | |

No `pending` or `rejected` status — fully automated means jobs are either live or expired.

### 7B.4 Auto-Expiry

A second cron job runs every day at **midnight AST**. It sets `status = 'expired'` for all rows where `expires_at < now()` and `status = 'published'`. Expired jobs disappear from learner view immediately.

### 7B.5 Match Score Calculation (Phase 1 Cards)

Calculated server-side without AI for speed when the learner opens the feed:

```ts
const requiredCovered = job.required_skills.filter(skill =>
  learnerSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())
).length;

const preferredCovered = job.preferred_skills.filter(skill =>
  learnerSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())
).length;

const matchScore = Math.round(
  (requiredCovered / job.required_skills.length) * 0.70 * 100 +
  (preferredCovered / Math.max(job.preferred_skills.length, 1)) * 0.30 * 100
);
```

Runs in < 100ms for 10 jobs. Cached per `(user_id, job_id)` and invalidated when the learner gains a new skill.

### 7B.6 Error Handling

| Scenario | Behavior |
|---|---|
| SerpAPI fetch fails | Log error, retry once after 1 hour. Previous week's jobs remain live until natural expiry. Error logged in server monitoring — no admin notification needed. |
| AI skill extraction fails for a job | Job is still published with `required_skills = []` and `preferred_skills = []`. Match score shows 0% on the card. Learner can still click Analyze → for full analysis. |
| No results returned for a path | That path's feed shows empty state: "No jobs this week — paste any JD to analyze it." Other paths unaffected. |
| Duplicate job fetched (same URL as previous week) | Deduplication by `source_url` before insert — duplicates are skipped. |

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
| Learner re-analyzes and crosses 75% for first time | `Sonner` toast: "You're now ready to apply for [Job Title]. Create a tailored resume to get started." → deep-link to Resume Builder. "Apply Ready" badge appears on the saved analysis card. |
| Learner has 0 skills and opens full analysis | Skills tab shows "You're just getting started" message instead of a wall of red badges. CTA: "Begin your [Path] roadmap to start building the skills this job needs." → links to Roadmap. Action Plan tab shows roadmap-first steps. |
| JD is not a tech role | `Alert` (warning): "This doesn't appear to be a tech role. Results may be inaccurate." Proceed. |
| Learner re-analyzes saved job | Score updates. If improved: `Badge` (green) "+X% since last analysis" shown in Saved tab and at top of Overview. |
| Missing skill has no roadmap topic | Label "Outside current path scope." Suggest as manual skill to add after path completion. |
| CV skill already covered by Mallah skill | Mallah version takes precedence. CV version silently discarded. Not shown as duplicate. |

---

## 12. Integration Points

- **SerpAPI** — weekly Google for Jobs fetch for Saudi Arabia. 4 queries per week (one per path) = 16/month, within the free tier. Results are published automatically with AI skill extraction — no admin review step.
- **Admin Panel** — the admin panel provides read-only visibility into the `job_listings` table for monitoring purposes (see what was fetched, verify expiry dates). No publish/reject workflow needed since jobs are automated.
- **Roadmap** — Tags topics linked to missing skills with "From Opportunity Analyzer" badge when an analysis is saved. Completing a tagged topic upgrades a CV skill to roadmap-verified.
- **Portfolio Hub** — "Projects to Build" suggestions can be added directly to `user_projects` with `status = 'available'`.
- **Resume Builder** — Action plan `update_resume` steps deep-link directly to the learner's job-based resume for this role if one exists, or to the Resume Builder Cards Grid to clone and personalize. The `source_jd.analysis_id` field on job-based resumes links back to the originating saved analysis.
- **Dashboard** — Quick Navigation links here. `opportunity_analyses.created_at` feeds the Dashboard Recent Activity section.
