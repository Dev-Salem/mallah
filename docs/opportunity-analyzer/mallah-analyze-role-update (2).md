# Mallah – Opportunity Analyzer: Analyze a Role Flow & Results
> Everything related to the Analyze a Role tab — input, 7-step backend pipeline, scoring, action plan, and all 6 result tabs.

---

## 1. Input Screen

The learner provides two inputs:

1. **JD textarea** — raw job description text (required). "Run Full Analysis" button stays disabled until text is present.
2. **CV upload** — optional PDF/DOCX, max 5MB.

**Button states:**
| State | Condition | Label |
|---|---|---|
| Disabled | No JD text | `حط وصف الوظيفة أولاً` / `Paste a job description to begin` |
| Ready | JD has content | `حلّل الوظيفة` / `Run Full Analysis` |
| Loading | Submitted | `شوي شوي، جاري التحليل...` / `Analyzing… hold tight` |

---

## 2. Backend Pipeline — 7 Steps

---

### Step 1 — JD Parsing (AI)

Sent to AI → returns strict JSON:

```json
{
  "job_title": "string",
  "seniority": "Intern | Junior | Mid | Senior",
  "employment_type": "Full-time | Part-time | Contract | Remote",
  "required_skills": ["React", "TypeScript", "Git"],
  "preferred_skills": ["GraphQL", "Docker"],
  "responsibilities": ["string", "string", "string"]
}
```

**Rules:**
- If fewer than 5 skills extracted → show warning alert but proceed with analysis
- Strip credential requirements (Bachelor's degree, Master's, etc.) from skills arrays before any further processing — credentials are never treated as skills anywhere in the system
- For feed jobs: this step is skipped entirely — data is already stored in `job_listings` from the weekly cron fetch

---

### Step 2 — CV Parsing (AI, only if uploaded)

Sent to AI → returns strict JSON:

```json
{
  "extracted_skills": ["React", "Node.js", "Python"],
  "inferred_level": {
    "React": "intermediate",
    "Node.js": "beginner",
    "Python": "intermediate"
  },
  "experience_years": 2,
  "previous_roles": ["Frontend Intern", "Freelance Developer"],
  "cv_projects": [
    {
      "title": "E-commerce Dashboard",
      "skills_used": ["React", "Node.js", "MongoDB"],
      "description": "Built a full-stack dashboard for a retail client"
    }
  ]
}
```

CV data stored in `cv_uploads`, reused on future analyses unless the learner uploads a new one.

---

### Step 3 — Profile Aggregation

Combines Mallah profile + CV into one unified skill map.

**Rules:**
- Skill exists in both Mallah and CV → Mallah version wins (same weight, better source label). CV duplicate silently discarded.
- Skill only in Mallah → `source: mallah`, weight: `1.0`
- Skill only in CV → `source: cv`, weight: `1.0`

**CV skills are treated as fully verified — 1.0x weight, same as Mallah skills.**
The only difference is the badge label in the UI:
- Mallah skills → `Verified via Roadmap`
- CV skills → `From CV`

No scoring penalty. No visual downgrade. Equal treatment.

---

### Step 4 — Skill Normalization

Every skill extracted from the JD is mapped against the Mallah skills catalog:

1. Exact match (case-insensitive)
2. Fuzzy match if no exact hit — `"ReactJS"` → `"React"`, `"Postgres"` → `"PostgreSQL"`
3. No match found → flagged as `unrecognized_skill`, shown as missing, labeled "Not in catalog"

---

### Step 5 — Skill Matching + Gap Calculation

For each normalized JD skill, check the merged skill map:

**✅ Matched — full credit (1.0)**
Skill found in profile at required level or above. Source doesn't matter — Mallah or CV both count equally.

---

**⚠ Partial — half credit (0.5)**
Skill exists in profile but doesn't fully meet the job's requirement.

Real cases only — no vague partials:

| Case | Example |
|---|---|
| Skill exists but lower level than required | Job needs `React — Advanced`, learner has `React — Beginner` |
| Close variant, same technology category | Job needs `PostgreSQL`, learner has `MySQL` (both relational DBs, different syntax) |
| Learner has a subset of what's required | Job needs `REST API + GraphQL`, learner only has `REST API` |
| Roadmap topic in progress but not yet completed | Learner is 60% through Node.js topic — started but not done |
| Skill in CV mentioned in passing, not primary | `Docker` appears once under one job, not listed as a core skill |
| Framework known, but ecosystem gaps exist | Job needs `Next.js`, learner has `React` — core knowledge transfers but SSR/routing/deployment knowledge is missing |

**What does NOT count as Partial:**
- Completely unrelated skill in the same broad category (`Python` does not partially satisfy `JavaScript`)
- A skill the learner has never touched in any form
- A tool from a completely different stack (`MongoDB` does not partially satisfy `PostgreSQL`)

---

**❌ Missing — zero credit**
Not found in Mallah profile or CV at all.

Missing skills are further split into:
- **Required** — must-haves from the job's required skills list
- **Preferred** — nice-to-haves from the job's preferred skills list

---

### Step 6 — Score Calculation

```
Score = (required_skill_coverage × 0.55)
      + (preferred_skill_coverage × 0.20)
      + (relevant_projects × 0.25)
```

**Required skill coverage (55%):**
```
coverage = (matched_full + matched_partial × 0.5) / total_required
```

**Preferred skill coverage (20%):**
Same formula as required. Missing preferred skills don't tank the score — they push it higher when present.

**Relevant projects (25%):**
- Source: completed Mallah roadmap projects + CV projects (if CV uploaded)
- CV projects count at 1.0x — same as Mallah projects
- A project is relevant if it covers ≥ 2 of the job's required skills
- Formula: `relevant_count / max(required_skill_groups, 3)` — capped to prevent one project dominating

**Roadmap alignment has been removed as a scoring factor.**
If the job uses a different tech stack than the learner's path, the score reflects that naturally through skill coverage. No additional penalty applied. The action plan handles the gap — not the score.

**What this means in practice:**
- A learner with a strong CV and solid projects but mid-way through their roadmap can score 75%+
- A learner with only early roadmap progress and no CV will get a score that honestly reflects their readiness
- A job that doesn't perfectly align with the learner's current path won't be artificially penalized — it'll score based on actual skill overlap

**Score labels:**
| Score | Label | Color Token |
|---|---|---|
| 0–34% | Not Ready Yet | `destructive` (Alert Red) |
| 35–54% | Early Stage | `warning` (Tactical Amber) |
| 55–74% | Getting Close | `warning` (Tactical Amber) |
| 75–89% | Strong Candidate | `success` (Forest Emerald) |
| 90–100% | Excellent Match | `success` (Forest Emerald) |

---

### Step 7 — Action Plan Generation (AI)

**Full learner context sent to AI before generating:**

1. Job's required + preferred skills
2. Full skill gap — missing + partial, each with source label and reason
3. Learner's completed Mallah topics (titles + skills covered)
4. Learner's in-progress Mallah topic — current stage + % complete
5. Learner's completed Mallah projects (titles + skills they cover)
6. Learner's CV skills + CV projects/roles (if CV uploaded)
7. Learner's `primary_goal` from onboarding: `job` / `freelance` / `startup` / `exploring`
8. Learner's `current_path_id` and current stage number
9. Which missing skills have a direct roadmap topic vs which don't exist in the path at all

**Generation rules — strictly enforced:**
- Never suggest a step the CV already covers at a meaningful level
- Never suggest learning a topic the learner already completed in the roadmap
- Never suggest credentials — no "get a degree", "earn a certification" unless it's a specific Mallah path milestone
- `apply_now` step only appears when score ≥ 75%
- Each `learn_topic` step must deep-link to the actual Mallah topic — no generic external links
- Each `build_project` step must suggest a specific named project tied to a missing skill — not vague ("build something with X")
- If learner is in progress on a topic → acknowledge it: "You're already working on this — finish it" rather than re-suggesting it as a new step
- Max 7 steps, ordered by highest-impact gaps first

**Goal-aware priority:**
| `primary_goal` | Step Priority |
|---|---|
| `job` | Balance learn + build. End with `update_resume` or `apply_now`. |
| `freelance` | Prioritize `build_project` steps over `learn_topic`. Portfolio matters more than theory. |
| `startup` | Prioritize `build_project` + full-stack coverage. |
| `exploring` | Lighter plan — focus on 2–3 high-impact learn steps, no pressure to apply. |

**Step structure:**
```json
{
  "step_type": "learn_topic | build_project | update_resume | apply_now",
  "title": "one-line description of the step",
  "reason": "why this step matters for this specific job",
  "link_target": "topic_id | project_id | resume_builder | apply_url | null"
}
```

**Step type badge colors:**
- `learn_topic` → blue
- `build_project` → purple
- `update_resume` → amber
- `apply_now` → green

---

## 3. Loading State

While steps 1–7 run, the learner sees skeleton screens shaped like the result tabs layout — not a spinner, not a blank page. Results replace skeletons as each step completes.

---

## 4. Result Tabs

---

### Tab 1 — Match Report (`ResultsTab.tsx`)
**Purpose:** Executive summary of readiness. The default active tab — first thing the learner sees when results load.

---

**Layout (top to bottom):**

**Circular Progress Ring**
- Animated SVG ring filling from 0% to actual score on mount — 600ms ease-out
- Score number in the center, large and bold
- Ring color follows score threshold tokens:
  - 0–34% → `destructive` (Alert Red)
  - 35–74% → `warning` (Tactical Amber)
  - 75–100% → `success` (Forest Emerald)
- Candidate label directly below the ring — two possible values only:
  - Score ≥ 75% → "Strong Candidate"
  - Score < 75% → "Developing Candidate"

**Two Progress Bars**

Bar 1 — Required Skills:
- Label: "Required Skills"
- Value: "X / Y matched" — e.g. "4 / 7 matched"
- Bar fills proportionally, color follows same threshold tokens as the ring
- Counts both full matches and partial matches (partial shown at half)

Bar 2 — CV Boost:
- Label: "CV Boost"
- Value: "+N skills" — number of skills the CV contributed that Mallah profile didn't already have
- Bar color: `info` (Digital Blue) — always blue regardless of score, visually distinct from the skills bar
- If CV was not uploaded → this bar is hidden entirely, no empty state shown
- If CV was uploaded but returned 0 skills → do NOT show "+0". Show instead an inline warning below the bar: "We couldn't extract skills from your CV. Try a more detailed CV or check the file format."

**Action Required — Gaps**
- Red-tinted card section
- Header: "Action Required: Gaps"
- Shows top 4–5 critical missing Required skills as badge chips
- Skills only — credentials (Bachelor's degree, Master's, certifications) are stripped before this renders, never shown here
- Below the badges: one line of copy — "Focus on these to increase your match score above 75%."
- If no missing required skills → this section is hidden. Replace with a success message: "You meet all the required skills for this role."

**Recommended Next Step**
- Green-tinted card section
- Header: "Recommended Next Step"
- Shows exactly 1 step — the top-priority item from the Action Plan
- Step shows: type badge + title + reason (one line) + CTA button
- Below the step card: text link "See full plan →" that switches to the Action Plan tab
- This section never shows a credential step. If the top action plan step is somehow credential-related it is skipped and the next valid step is shown instead.
- If action plan generation failed → this section is hidden entirely

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│         ╭──────────╮                    │
│        ( 68%        )  ← ring           │
│         ╰──────────╯                    │
│       Developing Candidate              │
│                                         │
│  Required Skills    4/7   ████████░░░   │
│  CV Boost           +3    ██████░░░░░   │
│                                         │
│  ┌─── Action Required: Gaps ─────────┐  │
│  │ [Node.js] [PostgreSQL] [Docker]   │  │
│  │ Focus on these to get above 75%   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─── Recommended Next Step ─────────┐  │
│  │ 🔵 learn  Complete Node.js        │  │
│  │ Fundamentals                      │  │
│  │ Required by job, not in roadmap   │  │
│  │ [ Open Topic ]  See full plan →   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

### Tab 2 — Role Insights (`OverviewTab.tsx`)
**Purpose:** Context about the job itself and what the score means for this specific learner. Not a score repeat — a score explanation.

---

**Layout (top to bottom):**

**Job Snapshot Card**
Displays extracted job metadata in a clean grid. Fields:
- Job Title
- Company Name
- Seniority / Level (e.g. Junior, Mid)
- Employment Type (Full-time / Part-time / Contract / Remote)
- Location
- Apply URL → shown as "Apply on [source]" button (feed jobs only). Hidden for pasted JDs that have no URL.

For feed jobs: all fields pre-populated from `job_listings`. For pasted JDs: AI-extracted. If a field couldn't be extracted → show "Not specified" — never show null or blank.

**Score Context Panel**
Does not repeat the ring from Match Report. Shows the score as text with its label and a human explanation:

| Score | Label | Explanation shown |
|---|---|---|
| 0–34% | Not Ready Yet | "You're at the start of your journey for this role. Follow the action plan to build toward it." |
| 35–54% | Early Stage | "You have some of the foundations. Keep building — this role is within reach." |
| 55–74% | Getting Close | "You're making real progress toward this role. A few more skills and projects will get you there." |
| 75–89% | Strong Candidate | "You're a strong match for this role. Polish your portfolio and apply." |
| 90–100% | Excellent Match | "You're an excellent fit. Apply now and lead with your projects." |

**Sub-stats Row**
Three small stat chips in a row:
- Required Skills: X / Y
- Preferred Skills: X / Y
- Projects Matched: X

**Alert Banners**
Shown conditionally — only the ones that apply:

CV Contribution (info — blue):
- Condition: CV was uploaded and contributed ≥ 1 skill
- Copy: "X of your matched skills came from your CV. Complete roadmap topics to strengthen them."

Apply Ready (success — green):
- Condition: score ≥ 75%
- Copy: "You're a strong candidate for this role. Create a tailored resume to apply."
- CTA button: "Open Resume Builder" → deep-links to Resume Builder pre-loaded with this analysis

Honest Low-Match (warning — amber):
- Condition: score < 35% AND job seniority is Mid or Senior
- Copy: "This is a Mid/Senior role. We recommend building your skills through the roadmap before applying."
- No CTA — informational only

Only one alert banner shows at a time. Priority: Apply Ready > CV Contribution > Honest Low-Match.

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  Job Snapshot                           │
│  ┌──────────────┬──────────────────┐    │
│  │ Title        │ Junior FE Dev    │    │
│  │ Company      │ Noon             │    │
│  │ Level        │ Junior           │    │
│  │ Type         │ Full-time        │    │
│  │ Location     │ Riyadh           │    │
│  └──────────────┴──────────────────┘    │
│  [ Apply on LinkedIn → ]               │
│                                         │
│  68% — Getting Close                   │
│  "You're making real progress..."       │
│                                         │
│  [Required 4/7] [Preferred 2/4] [Proj 1]│
│                                         │
│  ℹ 3 of your matched skills came from  │
│    your CV. Complete roadmap topics...  │
└─────────────────────────────────────────┘
```

---

### Tab 3 — Skill Gaps (`SkillsTab.tsx`)
**Purpose:** Granular side-by-side comparison. Shows the learner exactly where they stand skill by skill.

---

**Layout:** Three-column grid on desktop, stacked single column on mobile.

---

**Column 1 — ✅ You Have (Green)**

Lists every skill that is fully matched — from either Mallah or CV.

Each skill shown as a badge chip with:
- Skill name
- Source badge below the name:
  - `Verified via Roadmap` — skill completed through Mallah topics or projects
  - `From CV` — skill extracted from uploaded CV
- Both source types shown with identical visual weight — same badge size, same color, same font. No downgrade, no muted treatment for CV skills.

Empty state (no matched skills):
> "You don't have any of the required skills for this role yet. Start with the Action Plan."

---

**Column 2 — ⚠ Partial Match (Amber)**

Lists every skill that partially satisfies the job's requirement. Only real cases — no vague partials.

Each skill shown as a badge chip with:
- Skill name
- Inline reason directly below — one short sentence explaining the gap:
  - "You have React (Beginner) — this role needs Advanced"
  - "You have MySQL — this role requires PostgreSQL"
  - "You have REST API — this role also needs GraphQL"
  - "Node.js topic in progress — finish it to fully match"
  - "Listed in CV but not a primary skill"
  - "You know React — Next.js adds SSR and routing on top"

Empty state (no partials):
> No section shown. Column collapses. Grid becomes two columns.

---

**Column 3 — ❌ Missing (Red)**

Split into two labeled groups within the column:

**Required (must-haves):**
- Each skill shown as a badge chip
- Below each badge — an inline action link:
  - If skill exists in learner's current roadmap path → "Study this → Stage X / Topic Y" as a deep-link that navigates to that exact topic
  - If skill doesn't exist in the current path → small muted label: "Outside current path — add manually"
- Credentials are never shown here — stripped at Step 1 before reaching this tab

**Preferred (nice-to-haves):**
- Shown below Required with a visual separator
- Same badge format but slightly muted
- No inline links — preferred skills don't get roadmap deep-links
- Label above the group: "Nice to Have"

Empty state (no missing skills):
> "You meet all the required skills for this role." — shown in green with a checkmark. Preferred section still shows if there are missing preferred skills.

**Visual Layout:**
```
┌──────────────┬──────────────┬──────────────┐
│ ✅ You Have  │ ⚠ Partial   │ ❌ Missing   │
│              │              │              │
│ [React]      │ [Node.js]    │ Required:    │
│ Verified     │ "Beginner,   │ [PostgreSQL] │
│              │  needs Adv." │ Study → S2   │
│ [TypeScript] │              │              │
│ From CV      │ [Next.js]    │ [Docker]     │
│              │ "React known,│ Outside path │
│ [Git]        │  SSR missing"│              │
│ Verified     │              │ Nice to Have:│
│              │              │ [GraphQL]    │
│              │              │ [Redis]      │
└──────────────┴──────────────┴──────────────┘
```

---

### Tab 4 — Action Plan (`ActionPlanTab.tsx`)
**Purpose:** Turns the skill gap into a concrete, ordered, personalized plan the learner can act on immediately. The most actionable tab.

---

**Layout:** Vertical stepper/timeline. Max 7 steps. Steps are ordered by highest impact first — the most critical gap addressed in Step 1.

**Step type badge colors:**
- `learn_topic` → blue
- `build_project` → purple
- `update_resume` → amber
- `apply_now` → green

---

**Each step contains:**

1. Step number (1 through 7)
2. Type badge (colored)
3. Title — one clear action statement
4. Reason — one sentence explaining why this step matters for this specific job
5. CTA button — varies by type:
   - `learn_topic` → "Open Topic" → deep-links to the exact Mallah roadmap topic page. Never links to an external resource.
   - `build_project` → "View Project" → links to the Mallah project page or Portfolio Hub
   - `update_resume` → "Open Resume Builder" → opens Resume Builder pre-loaded with this analysis's job context
   - `apply_now` → "Apply Now" → opens the job's apply URL in a new tab. Only rendered when score ≥ 75%.

---

**What the AI knows before generating (all 9 context points):**
1. Job's required + preferred skills
2. Full skill gap — missing + partial, each with source label and reason
3. Learner's completed Mallah topics
4. Learner's in-progress Mallah topic — stage + % complete
5. Learner's completed Mallah projects + Portfolio Hub projects
6. Learner's CV skills + CV projects (if uploaded)
7. Learner's `primary_goal` — job / freelance / startup / exploring
8. Learner's `current_path_id` + current stage number
9. Which missing skills have a roadmap topic vs which don't exist in the path

**Generation rules — all enforced:**
- Never suggest a step the CV already covers meaningfully
- Never suggest a topic the learner already completed
- Never suggest credentials — no degree, no certification steps ever
- If learner is in progress on a relevant topic → step says "You're already working on this — finish it" with a link to that topic, not re-suggested as new
- `apply_now` step only appears when score ≥ 75%
- Each `learn_topic` → links to exact Mallah topic, no generic external links
- Each `build_project` → specific named project, not vague

**Goal-aware priority:**
| `primary_goal` | Step Priority |
|---|---|
| `job` | Balance learn + build, end with update_resume or apply_now |
| `freelance` | Prioritize build_project over learn_topic |
| `startup` | Prioritize build_project + full-stack coverage |
| `exploring` | 2–3 high-impact learn steps, no apply pressure |

**Empty state (action plan generation failed):**
- Action Plan tab and Portfolio Sync tab are hidden
- Alert shown: "Action plan unavailable right now. Your skill breakdown is still available in Skill Gaps."

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  1  🔵 learn                            │
│     Complete Node.js Fundamentals       │
│     "Required by this job, not yet      │
│      in your roadmap progress."         │
│     [ Open Topic ]                      │
│                                         │
│  2  🟣 build                            │
│     Build a REST API Blog Backend       │
│     "Covers Node.js + PostgreSQL in     │
│      one project — two gaps at once."   │
│     [ View Project ]                    │
│                                         │
│  3  🟡 resume                           │
│     Update your resume for this role    │
│     "Tailor your resume to highlight    │
│      your React and TypeScript skills." │
│     [ Open Resume Builder ]             │
└─────────────────────────────────────────┘
```

---

### Tab 5 — Portfolio Sync (`PortfolioTab.tsx`)
**Purpose:** Shows the learner what they already have as proof for this specific job, and exactly what to build to close the remaining gaps. Bridges learning and hiring.

---

**Layout:** Two sections stacked vertically.

---

**Section 1 — اللي عندك الحين**

**Data sources — all three combined:**
- Completed Mallah roadmap projects
- Projects manually added to Portfolio Hub
- CV projects extracted in Step 2 (if CV was uploaded)

**A project appears here if** it covers ≥ 2 of this job's required skills.

**Each project card shows:**
- Project title
- Skills from this job's required list that the project covers — shown as green highlighted tags
- Source badge: `Mallah Roadmap` / `Portfolio Hub` / `From CV`
- GitHub or demo link if the learner added one — if no link exists the card still shows without a link, no error state

**Framing copy above the grid:**
"These projects already prove you have what this job needs — make sure they're visible and polished before you apply."

**Empty state — no projects at all:**
> "ما عندك مشاريع لحد الآن — ابدأ ببناء شي وحطه في بورتفوليوك"

CTA button: "View Portfolio Hub" → navigates to Portfolio Hub. No red state, just a friendly nudge.

**Empty state — projects exist but none relevant to this job:**
> "مشاريعك الحالية ما تغطي متطلبات هالوظيفة — شوف القسم الثاني وابدأ ببناء الصح"

This naturally pushes the learner to Section 2.

---

**Section 2 — اللي تبنيه بعدين**

**Data sources — two-tier priority:**

Tier 1 — Mallah project catalog (`projects` table):
- Searches for existing platform projects that cover ≥ 2 of the learner's missing required skills
- Catalog projects are always shown first if they exist

Tier 2 — AI-generated suggestions:
- Only used when no catalog project covers a missing skill combination
- AI generates a specific, named project idea with a title, what to build, and which missing skills it addresses
- Never vague — always specific. Example: "Build a recipe finder app using React + REST API that fetches and filters data from a public food API" not "build something with React"

**Each project card shows:**
- Project title
- Missing required skills it covers — shown as tags
- Effort level badge: `Beginner` / `Intermediate`
- One-line reason: why this project matters for this specific job
- CTA button: "Add to Portfolio Plan" → saves to `user_projects` with `status = available`, immediately appears in Portfolio Hub as a planned project

**Empty state — no build steps needed:**
Shown when the action plan had no `build_project` steps — meaning skill coverage is strong enough that building isn't the current priority.
> "ما في مشاريع ناقصة الحين — ركّز على التقديم وتحديث سيرتك"

**Tab-level empty state (both sections empty):**
Only possible when learner has no projects AND AI generation failed.
> "ما قدرنا نحمّل تفاصيل المشاريع الحين — حاول مرة ثانية"

Retry button shown.

**Visual Layout:**
```
┌─────────────────────────────────────────┐
│  اللي عندك الحين                        │
│  "These projects prove you have..."     │
│                                         │
│  ┌──────────────┐  ┌──────────────┐     │
│  │ Portfolio    │  │ E-commerce   │     │
│  │ Website      │  │ Dashboard    │     │
│  │ [React][CSS] │  │ [React]      │     │
│  │ Mallah       │  │ [Node.js]    │     │
│  │ GitHub →     │  │ From CV      │     │
│  └──────────────┘  └──────────────┘     │
│                                         │
├─────────────────────────────────────────┤
│  اللي تبنيه بعدين                       │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ Recipe Finder App   Beginner     │   │
│  │ Covers: [REST API] [React]       │   │
│  │ "Directly covers 2 required      │   │
│  │  skills for this role"           │   │
│  │ [ Add to Portfolio Plan ]        │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ Auth System with JWT Intermediate│   │
│  │ Covers: [Node.js] [PostgreSQL]   │   │
│  │ "Backend skills this job needs"  │   │
│  │ [ Add to Portfolio Plan ]        │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 5. Bottom Action Bar (Persistent Across All Tabs)

- `Save Analysis` — default/primary button. Saves current analysis to `opportunity_analyses` with `is_saved = true`.
- `Re-analyze` — outline button. Reruns Steps 3–7 against current `user_skills` + CV. If a newer CV exists it re-runs Step 2 as well before continuing.
- `← Back to Feed` — ghost button. Returns to the Job Feed tab.

---

## 6. Error & Edge Cases

| Scenario | Behavior |
|---|---|
| JD has < 5 skills extracted | Warning shown but analysis proceeds |
| JD is not a tech role | Alert: "This doesn't appear to be a tech role. Results may be inaccurate." Proceed anyway. |
| CV parse fails | Proceed with Mallah profile only. Alert: "Couldn't parse your CV. Analysis based on your Mallah profile only." |
| CV uploaded but 0 skills matched | Alert: "We couldn't extract skills from your CV. Try a more detailed CV or check the file format." Never show "+0" with no context. |
| Learner has 0 skills + no CV | Score: 0%. Alert (info): "Upload your CV or start your roadmap to get a meaningful analysis." Action plan shows roadmap-first steps only. |
| Learner has strong CV but 0 Mallah progress | Score calculated fully from CV skills + CV projects. Action plan routes through roadmap to verify CV skills over time. |
| Missing skill has no roadmap topic | Labeled "Outside current path — add manually." |
| All required skills matched | Celebrate in Match Report: "You're an excellent match. Focus on applying and portfolio polish." |
| Score crosses 75% on re-analyze | `Sonner` toast fires → deep-link to Resume Builder. Apply Ready badge appears. |
| AI action plan generation fails | Show Skill Gaps tab only. Hide Action Plan and Portfolio Sync tabs. Alert: "Action plan unavailable right now." |
| Learner in progress on a topic that covers a missing skill | Action Plan acknowledges it: "You're already working on this — finish it" instead of re-suggesting it |

---

## 7. Files to Update

| File | What Changes |
|---|---|
| `ResultsTab.tsx` | CV Boost "+0" explanation, credential filter on gaps section, limit Recommended Next Step to 1 item with link to Action Plan tab |
| `OverviewTab.tsx` | Keep sub-stats and alert banners, remove score ring repeat if Match Report already shows it |
| `SkillsTab.tsx` | Implement real partial match cases with inline reasons, equal visual weight for CV vs Mallah skill badges, inline roadmap deep-links on missing required skills, credentials never rendered |
| `ActionPlanTab.tsx` | Pass full 9-point learner context to AI, implement all generation rules, CV/portfolio/roadmap/goal-aware, no credentials |
| `PortfolioTab.tsx` | Add Section 1 (existing evidence from both Mallah + CV), Section 2 (build steps with effort level and Add to Portfolio Plan CTA) |
| Backend — Step 2 | Add `cv_projects` array to CV parse JSON output |
| Backend — Step 3 | CV skills weight updated to 1.0x (equal to Mallah) |
| Backend — Step 6 | Remove roadmap alignment factor, implement new 3-factor formula (55/20/25) |
| Backend — Step 7 | Pass all 9 context points to AI, enforce all generation rules |
