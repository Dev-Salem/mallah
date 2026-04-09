# Mallah – Resume Builder

## 1. Purpose

The Resume Builder is where everything the learner has built on Mallah becomes a career asset. Skills earned through the roadmap, projects completed in the Portfolio Hub, and the learner's personal profile all flow in automatically. The learner opens the editor and their resume already has real content — they fill in the human parts (summary, experience, education) and make editorial decisions.

The output is a clean, single-column, ATS-optimized PDF that passes automated screening and looks professional to human recruiters.

---

## 2. Core Design Principles

- **Two genuinely different resume types.** General and job-based resumes are functionally distinct. The job-based editor has three exclusive features the general editor doesn't: a persistent JD keyword strip, a live keyword match panel, and relevance indicators on skills and projects. Opening a job-based resume feels like a different tool built for a specific purpose.
- **Pre-filled by default.** Skills, projects, and personal info are populated automatically from Mallah data. The resume has real content before the learner types a single word.
- **Section-by-section editing.** A narrow left nav shows all sections with completion status. The right editing area shows one section at a time — focused, never overwhelming. A Preview toggle shows the full resume on demand.
- **Single-column PDF only.** Multi-column, tables, and graphics break ATS parsers. The preview and export are both single-column, no exceptions.
- **Standard section headings.** ATS systems recognize: Summary, Skills, Projects, Experience, Education, Certifications. No creative substitutions.
- **Exact skill terminology.** "React" not "ReactJS ecosystem." Keywords must match job description language.
- **No images, icons, or decorative elements in the PDF.** The builder UI is polished — the PDF output is plain.
- **Reverse chronological order** in Experience and Education. Most recent first.
- **Achievement-oriented language.** AI prompts push toward action verb + task + result format.
- **AI is on demand.** No proactive suggestions, no AI watching what the learner types. AI Improve appears as a button — used only when the learner asks for it.

---

## 3. Scope & Dependencies

**Entry points:**
- Dashboard → Quick Navigation → "Resume Builder"
- Sidebar navigation → "Resume Builder"

**Depends on:**
- `resumes`, `resume_sections`
- `users`, `learners` (personal info, path, goal, portfolio slug)
- `user_skills`, `skills` (auto-populated skills)
- `user_projects`, `projects`, `project_skills` (auto-populated projects)
- AI Engine (optional — for AI Improve and ATS scoring)

---

## 4. Entry — Resume Cards Grid

The Resume Builder opens to a **Resume Cards Grid**. All resumes start as general resumes. Job-based resumes are created by cloning a general resume and then personalizing it for a specific job.

```
┌──────────────────────────────────────────────────────────────────┐
│  My Resumes                                  [+ New Resume]      │
├──────────────────┬──────────────────┬───────────────────────────┤
│  ┌────────────┐  │  ┌────────────┐  │  ┌──────────────────────┐ │
│  │ [preview]  │  │  │ [preview]  │  │  │        +             │ │
│  │ thumbnail  │  │  │ thumbnail  │  │  │    New Resume        │ │
│  │            │  │  │            │  │  │                      │ │
│  ├────────────┤  │  ├────────────┤  │  └──────────────────────┘ │
│  │Frontend    │  │  │🎯 React Dev│  │                           │
│  │Resume      │  │  │  @ Noon    │  │                           │
│  │ATS: 82/100 │  │  │ATS: 91/100 │  │                           │
│  │Updated 2d  │  │  │Match: 74%  │  │                           │
│  │[Edit][↓][⋯]│  │  │[Edit][↓][⋯]│  │                           │
└──────────────────┴──────────────────┴───────────────────────────┘
```

**General resume card:**
- Standard card styling
- Shows: title, ATS score badge, last updated timestamp
- Dropdown `⋯` menu: `Edit` · `Download` · `Clone` · `Delete`

**Job-based resume card:**
- `🎯` icon + job title and company as the card headline (e.g. "React Dev @ Noon")
- Shows: ATS score badge AND match score (if personalized from a saved analysis)
- `Job-Based` badge on the card
- Dropdown `⋯` menu: `Edit` · `Download` · `Delete` (no Clone option on job-based resumes)

**One creation button in the header:** `+ New Resume` — creates a general resume, editor opens directly. No job-based creation from the grid header.

**First-time user (no resumes yet):** the grid shows only the New Resume empty-state card with the message: "Build your resume from your Mallah profile — your skills and projects are already here."

**Limit:** 3 resumes total per learner (general + job-based combined). When at the limit, `+ New Resume` and `Clone` are both disabled with `Tooltip`: "Delete a resume to create a new one."

---

## 5. Resume Creation

### 5.1 New General Resume

Clicking `+ New Resume` on the Cards Grid creates a general resume and opens the editor immediately — no wizard, no guided steps. The resume is pre-populated with the learner's skills, projects, and personal info from Mallah. They land on the Summary section and can edit freely.

### 5.2 Clone

The `Clone` option in a general resume card's `⋯` dropdown creates a **complete independent copy** of that resume. The clone:

- Gets the title "Copy of [Original Title]" (editable inline on the card)
- Copies all `resume_sections` content exactly — same summary, same skills, same projects, same experience
- Starts as `resume_type = 'general'`
- Is completely independent — the original is never modified, and future edits to either resume have no effect on the other
- Counts toward the 3-resume limit

The clone opens on the Cards Grid as a new card. The learner can edit it freely as a general resume, or personalize it for a specific job (Section 5B).

**Clone is only available on general resumes.** Job-based resumes cannot be cloned.

---

## 5B. Job-Based Personalization

A job-based resume is created by cloning a general resume and then personalizing the clone for a specific job. The AI rewrites the content — bullets, summary, skill ordering — to better match the pasted JD without changing any core facts.

### 5B.1 Entry Point — "Personalize for a Job" Button

In the editor header, a `Personalize for a Job` `Button` (outline) is visible **only on general resumes**. It disappears once the resume has been personalized (i.e. becomes job-based).

Clicking it opens the **Personalization Modal** (Section 5B.2).

### 5B.2 Personalization Modal

A centered `Dialog` that appears over the editor.

```
┌──────────────────────────────────────────────────────────┐
│  Personalize this resume for a job                 [×]   │
│                                                          │
│  Paste the job description                               │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │  [Textarea — paste the full JD here]               │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│  Minimum 100 characters                                  │
│                                                          │
│  Resume title (auto-filled from JD, editable)            │
│  [Frontend Developer @ Noon]                             │
│                                                          │
│  [Cancel]              [Personalize →]                   │
└──────────────────────────────────────────────────────────┘
```

- `Textarea` — min 100 characters to proceed, validated on submit
- Resume title auto-filled as "{Job Title} @ {Company}" once AI parses the JD — editable before confirming
- `Personalize →` triggers the personalization logic (Section 5B.3)

### 5B.3 Personalization Logic (Backend)

When the learner clicks `Personalize →`:

1. **Parse the JD** — AI extracts `job_title`, `company_name`, `required_skills[]`, `preferred_skills[]`. Same extraction logic as the Opportunity Analyzer.

2. **Rewrite Summary** — AI rewrites the existing summary to incorporate JD keywords and emphasize relevant experience. Core facts are preserved — no invented credentials or experience. The rewrite is stored back into `resume_sections.SUMMARY`.

3. **Rewrite Experience bullets** — AI rewrites each bullet to better highlight achievements relevant to the JD. Action verb + result structure enforced. Original meaning preserved, language optimized for the role.

4. **Reorder Skills** — Skills matching JD required keywords move to the top of the included skills list. Skills matching preferred keywords come next. Unmatched skills remain included but move to the bottom.

5. **Reorder Projects** — Projects with the highest overlap with JD required skills (via `project_skills`) move to the top of the included projects list.

6. **Store JD data** — `resumes.resume_type` flips to `'job_based'`. `resumes.source_jd` is populated with `{ job_title, company_name, required_skills[], preferred_skills[], analysis_id: null }`. Resume title is updated to the entered title.

7. **Reconfigure ATS scoring** — ATS Keyword Coverage now scores against JD required/preferred skills instead of the path keyword baseline.

8. Modal closes. Editor reloads with:
   - `Personalize for a Job` button replaced by `🎯 Job-Based` badge in the header
   - JD keyword strip appears at the top of the editing area
   - Relevance indicators activate in Skills and Projects sections
   - One-time `Sonner` toast: "Your resume has been personalized for [Job Title]. Review the changes below."

**Processing state:** while AI is working, the modal shows a loading state: spinner + "Personalizing your resume…". The `Personalize →` button is disabled. If AI fails: `Alert` (destructive) in the modal: "Personalization failed. Try again or paste a more detailed job description."

### 5B.4 Job-Based Resume in the Editor

Once personalized, the editor gains three exclusive features:

#### JD Keyword Strip

A fixed compact strip at the top of the editing area, always visible above the section form.

```
┌──────────────────────────────────────────────────────────────────────┐
│  🎯 React Engineer @ Noon  ·  React ✓  TypeScript ✓  Node.js ✗  REST API ✓  ·  Match: 74%  [↓] │
└──────────────────────────────────────────────────────────────────────┘
```

- Job title and company
- Top 4–5 required skills with live `✓` (included) / `✗` (missing) status
- Live match percentage
- `[↓]` expands the full keyword match panel

#### Live Keyword Match Panel

Expands below the strip on `[↓]`, pushes the editing area down. Collapsible.

```
┌──────────────────────────────────────────────────────────────────────┐
│  🎯 React Engineer @ Noon                                  [↑ Close] │
│                                                                      │
│  Required skills                    Preferred skills                 │
│  ✓ React              covered       ✓ GraphQL          covered       │
│  ✓ TypeScript         covered       ✗ Docker           missing       │
│  ✗ Node.js            missing       ✗ AWS              missing       │
│  ✓ REST API           covered                                        │
│  ✗ PostgreSQL         missing                                        │
│                                                                      │
│  Match: 74%   Required: 3/5 covered   Preferred: 1/3 covered        │
│  Missing: Node.js · PostgreSQL  →  Go to Skills                      │
└──────────────────────────────────────────────────────────────────────┘
```

- `✓` / `✗` updates live as skills are included/excluded — debounced 300ms, no save needed
- "→ Go to Skills" navigates the left nav to the Skills section

#### Relevance Indicators in Section Forms

**Skills section:**
- JD required skills → shown first, `Required` badge
- JD preferred skills → shown second, `Preferred` badge (outline)
- Unmatched skills → shown last, muted
- "Missing keywords" row at the bottom: skills the JD requires that aren't in the learner's profile at all — with note: "Add manually if you have experience with these."

**Projects section:**
- JD-relevant projects (overlap with JD required skills) → shown first, `Relevant to this job` tag
- Less relevant projects → shown last, muted but still includable

### 5B.5 Data Model

`resumes.resume_type` flips from `'general'` to `'job_based'` on personalization.

`resumes.source_jd` JSONB shape:
```json
{
  "job_title": "React Engineer",
  "company_name": "Noon",
  "required_skills": ["React", "TypeScript", "Node.js", "REST API", "PostgreSQL"],
  "preferred_skills": ["GraphQL", "Docker", "AWS"],
  "analysis_id": null
}
```

`analysis_id` is null when pasted directly. Reserved for future Opportunity Analyzer integration.

---

## 6. Editor Layout

The editor uses a **two-zone layout** — a narrow left navigation and a full-width right editing area. Clean, focused, no clutter.

The job-based editor is identical in layout and styling to the general editor, with the addition of the JD keyword strip at the top of the editing area (Section 5B.4).

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER                                                         │
│  ← My Resumes | [Title] [🎯] | [ATS: 74]  [Save]  [Export ↓]  │
├──────────────────────┬──────────────────────────────────────────┤
│  LEFT NAV (~200px)   │  RIGHT — EDITING AREA                   │
│                      │                                         │
│  ● Personal Info     │  [Active section form — full width]     │
│  ◉ Summary  ←active  │                                         │
│  ● Skills            │  Focused on one section at a time.      │
│  ● Projects          │  Clean, no scrolling past content       │
│  ● Experience        │  that isn't relevant right now.         │
│  ● Education         │                                         │
│  ○ Certifications    │            [Edit | Preview] toggle      │
│                      │                                         │
│                      │  When Preview is active:                │
│                      │  Full A4 resume replaces the form.      │
│                      │  White paper card on grey background.   │
└──────────────────────┴──────────────────────────────────────────┘
```

### 6.1 Header Bar

| Element | Component | Notes |
|---|---|---|
| Back link | `Button` (ghost) + `ChevronLeft` | "← My Resumes" |
| Resume title | Inline editable `Input` | Click to rename, saves on blur |
| Resume type badge | `Badge` | "🎯 Job-Based" — shown only on job-based resumes |
| ATS score badge | `Badge` (color-coded) | "ATS: 74" always visible. Click opens ATS Detail Overlay (Section 6.4). |
| Save | `Button` (outline) | `Spinner` while saving. "Saved ✓" `Sonner` toast on success. |
| Export PDF | `Button` (default) | Primary CTA. |

### 6.2 Left — Section Navigation

Narrow vertical list (~200px). Always visible. The learner's map of their resume and their progress.

Each nav item shows:
- Section name
- Completion dot: green (complete) / amber (partial) / grey (empty)
- Active state: filled background + left accent border

**Completion dot rules:**

| Section | Green | Amber | Grey |
|---|---|---|---|
| Personal Info | Always green (auto-filled) | — | — |
| Summary | ≥ 20 words | 1–19 words | Empty |
| Skills | ≥ 1 included | All excluded | None available |
| Projects | ≥ 1 included | All excluded | No completed projects |
| Experience | ≥ 1 entry with bullets | Entry exists, no bullets | No entries |
| Education | ≥ 1 entry complete | Entry started, unfinished | No entries |
| Certifications | ≥ 1 entry OR hidden | — | Visible but empty |

Clicking any section immediately loads its form in the editing area. Instant — no loading state.

### 6.3 Right — Editing Area

Full-width. Shows one section at a time based on nav selection.

**Edit / Preview toggle:** a `Tabs` component (`Edit` | `Preview`) pinned to the top-right of the editing area.

- **Edit** (default) — shows the active section's form fields
- **Preview** — replaces the entire editing area with the full A4 resume preview (Section 6.6). The left nav remains visible. Clicking any nav item switches back to Edit for that section.

Default active section on first load: Summary.

### 6.4 ATS Detail Overlay

Clicking the ATS badge in the header opens a **centered modal overlay** that dims the editor.

```
┌──────────────────────────────────────────────────────────┐
│  Your ATS Score                                    [×]   │
│                                                          │
│            ╭──────╮                                      │
│           ( 74    )   Getting There                      │
│            ╰──────╯                                      │
│                                                          │
│  Keyword coverage    ████████░░  78%  (40% weight)       │
│  Section complete    ██████████ 100%  (25% weight)       │
│  Summary quality     █████░░░░░  52%  (15% weight)       │
│  Project descs       ████░░░░░░  40%  (10% weight)       │
│  Formatting          ██████████ 100%  (10% weight)       │
│                                                          │
│  What to fix:                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Summary too short — add 2–3 sentences   [Fix →]   │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Project descriptions lack action verbs  [Fix →]   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  [Recalculate]                            [Close]        │
└──────────────────────────────────────────────────────────┘
```

- Each "Fix →" closes the overlay and navigates to that section in the left nav
- "Before first save" state: score "—", text: "Save to calculate your ATS score"
- **Job-based resume:** "🎯 Targeting: [Job Title] @ [Company]" shown below the score ring. Also shows required vs preferred skill breakdown and the match % consistent with the JD strip.

### 6.5 Right-Side Drawer — Structured Entry Editor

For Experience, Education, and Certifications entries: clicking "Edit" on an existing entry or "+ Add" opens a **right-side drawer** (~380px) that slides over the editing area.

```
┌────────────────────────────────────────┐
│  Add Experience                  [×]   │
│                                        │
│  Job title *                           │
│  [________________________]            │
│                                        │
│  Company *                             │
│  [________________________]            │
│                                        │
│  Location                              │
│  [________________________]            │
│                                        │
│  Start          End                    │
│  [MM/YYYY]   [MM/YYYY]  ☐ Current     │
│                                        │
│  Responsibilities & achievements       │
│  • [________________________] [AI ✨]  │
│  • [________________________] [AI ✨]  │
│  [+ Add bullet]                        │
│                                        │
│  Tip: Start with an action verb.       │
│  Add a result if possible.             │
│                                        │
│  [Delete]            [Save & close]    │
└────────────────────────────────────────┘
```

- "Save & close" → writes to `resume_sections`, closes drawer, section list updates
- "Delete" → inline confirmation, no separate dialog
- `AI Improve` per bullet — inline diff panel (Section 8)
- `react-hook-form` + Zod, validated on "Save & close" only

Education and Certifications drawers follow the same pattern.

### 6.6 Preview State

When the learner clicks "Preview":

- The editing area is fully replaced by a scrollable A4 paper card on a grey background
- Single column, plain typography — exactly what the PDF outputs
- Left nav remains visible. Clicking any section switches back to Edit for that section.
- A `← Edit` `Button` (outline, small) floats at the top-right of the preview for quick return

**Typography (matches PDF output exactly):**
- Name: 24pt, Inter Bold
- Contact line: 9.5pt, `·` separator, no icons
- Section headings: 10pt, Inter Bold, uppercase, letter-spacing 0.08em, 0.5pt rule below
- Entry titles: 10.5pt, Inter SemiBold
- Entry subtitles / dates: 9.5pt, Inter Normal
- Bullet text: 9.5pt, Inter Normal, line height 1.3
- Skills labels: 9.5pt, Inter SemiBold
- Page margins: 36pt all sides

**Empty sections** show muted grey placeholder text — never blank.

### 6.7 Mobile Layout (< 768px)

Left nav collapses to a horizontal scrollable row at the top. Editing area fills the rest of the screen. Edit/Preview toggle moves to the header next to the ATS badge.

Drawer becomes a full-screen bottom sheet. ATS overlay becomes a full-screen bottom sheet.

## 7. Resume Sections

Sections render in this fixed order. Order is locked in v1 for ATS compatibility.

1. Personal Info
2. Summary
3. Skills
4. Projects
5. Experience
6. Education
7. Certifications & Courses *(optional)*

---

### 7.1 Personal Info

Auto-filled from `users` and `learners`. Overrides stored in `resume_sections` — profile is never changed.

| Field | Source | Component |
|---|---|---|
| Full name | `first_name + last_name` | `Input` |
| Email | `users.email` | `Input` |
| Phone | Manual | `Input` type="tel" |
| LinkedIn URL | Manual | `Input` |
| GitHub URL | Manual | `Input` |
| Portfolio URL | Auto: `mallah.app/portfolio/{slug}` | `Input` read-only + copy `Button` |
| Location | Manual, city/country only | `Input` placeholder: "Riyadh, Saudi Arabia" |

**Portfolio link is always included.** Links the resume to the learner's live Mallah portfolio, giving recruiters direct access to verified projects and skills.

---

### 7.2 Summary

`Textarea` (min 3 rows, auto-expands). Max 80 words — live counter shown below.

- Placeholder: "Write 2–4 sentences. Lead with your role and top skills. State what you're looking for."
- Word counter: "32 / 80 words" — amber when approaching limit
- `AI Improve` `Button` (outline, `Sparkles` icon) — see Section 8

---

### 7.3 Skills

Auto-populated from `user_skills` where `source IN ('roadmap', 'project')`.

Rendered as a **checkbox grid** grouped by `skills.category`:

```
Technical Skills
  ☑ React          ☑ TypeScript      ☑ Node.js
  ☑ PostgreSQL      ☐ Docker

Tools & Platforms
  ☑ Git            ☑ VS Code         ☐ Figma
```

- `Checkbox` per skill — include/exclude from this resume
- "Add skill" `Button` (ghost, small) → inline `Input` appends to `manual_skills` in `resume_sections`. Does not write to `user_skills`.
- Manual skills show a muted "Manual" `Badge` and remove button

**In the live preview:** rendered as plain grouped comma-separated text. ATS reads plain text reliably.

**For job-based resumes:** JD-matched skills are shown first in the grid, separated from unmatched skills by a thin divider line with the label "Also available."

---

### 7.4 Projects

Auto-populated from `user_projects` where `status = 'completed'`.

Each project is a compact row with a `Switch` toggle (include/exclude) and an "Edit" `Button`:

- Toggle to include/exclude from this resume
- "Edit" opens a small popover or inline expansion with:
  - Description `Textarea` (pre-filled from `user_projects.personal_note` → falls back to `projects.description`). Override stored in `resume_sections`.
  - GitHub URL (read-only if set in `user_projects`, editable if not)
  - Demo URL (same logic)
  - `AI Improve` on the description

"Add External Project" `Button` at bottom — opens an inline form for projects built outside Mallah.

**For job-based resumes:** projects reordered — most JD-relevant shown first, separated from less relevant ones with a divider.

---

### 7.5 Experience

Manual entries. The section form shows a list of all entries. Each entry shows as a compact summary row (Job title @ Company, date range) with an "Edit" `Button` that opens the Drawer (Section 6.6).

"+ Add Experience" `Button` opens the Drawer for a new entry.

Empty state: "No experience added yet. Add jobs, internships, or freelance work."

---

### 7.6 Education

Manual entries. Same pattern as Experience — compact list with "Edit" per entry opening the Drawer, and "+ Add Education" button.

**No degree note:** `Alert` (info, muted) at top of section: "No degree? Your Projects and Skills carry more weight for tech roles."

---

### 7.7 Certifications & Courses (Optional)

Hidden by default. Enabled via a toggle at the top of the section form.

Same list + Drawer pattern as Experience and Education. Each entry: Certificate name, Issuing org, Year.

Placeholder guidance shown when empty: "e.g. CompTIA Security+, freeCodeCamp, Google UX Design Certificate"

---

## 8. AI Improve Flow

### 8.1 Where It Appears

`AI Improve` `Button` (outline, small, `Sparkles` icon) on:
- Summary `Textarea` (Section 7.2)
- Each project description `Textarea` (Section 7.4)
- Each experience bullet in the Drawer (Section 6.6)

### 8.2 The Flow

1. Learner clicks `AI Improve`
2. Button → loading state: `Spinner` + "Improving…"
3. Backend builds prompt: current text + section type + `current_path_id` + `primary_goal` + instruction to use action verbs, be concise, ATS-keyword-aware
4. AI returns improved version
5. An **inline diff panel** appears directly below the active `Textarea`:

```
┌──────────────────────────────────────────────────────────┐
│  Original                                                │
│  "I worked on frontend stuff and helped with React."     │
├──────────────────────────────────────────────────────────┤
│  ✨ Suggestion                                           │
│  "Built reusable React components for a production      │
│  e-commerce dashboard, cutting load time by 30%."       │
├──────────────────────────────────────────────────────────┤
│  [Use this]    [Keep original]    [Try again]            │
└──────────────────────────────────────────────────────────┘
```

6. **Use this** → replaces textarea content, collapses panel, live preview updates
7. **Keep original** → collapses panel, textarea unchanged
8. **Try again** → re-runs with a varied prompt

### 8.3 Rules

- Respects `ai_language_pref` — Arabic or Mix → AI writes in that language
- If AI is unavailable → all `AI Improve` buttons hidden. `Alert` (info) shown at the top of the active section form: "AI features are unavailable right now."
- Panel dismissable via Escape or clicking outside

---

## 9. ATS Score

### 9.1 What the Score Represents

The ATS Score (0–100) is Mallah's simulation of how an Applicant Tracking System would evaluate this resume. It is not a guarantee of passing any specific company's ATS — each company's ATS is different — but it is calibrated against real ATS behavior patterns to give the learner actionable, accurate feedback.

The score runs server-side on every save. It returns a number, a breakdown by factor, and 2–4 specific hints.

### 9.2 Scoring Factors and Weights

| Factor | Weight | Description |
|---|---|---|
| Keyword Coverage | 35% | How many path/JD keywords appear in the resume |
| Summary Quality | 20% | How well-written and targeted the summary is |
| Project Descriptions | 15% | Quality of project bullets |
| Section Completeness | 20% | Critical sections present and non-empty |
| Formatting Compliance | 10% | Single column, standard headings, parseable structure |

**Why these weights:** Research consistently shows keyword coverage is the primary ATS filter, but summary and project quality are what determine whether a human recruiter acts after the ATS passes the resume. Summary and projects combined (35%) reflect that both machines and humans are judging this document.

---

### 9.3 Factor Definitions

#### Factor 1 — Keyword Coverage (35%)

Checks how many keywords from the learner's path baseline (or JD for job-based resumes) appear anywhere in the resume text.

**Matching tiers — applied in order:**

| Tier | Method | Score weight |
|---|---|---|
| Exact match | Literal string match, case-insensitive | Full credit |
| Fuzzy match | Handles plurals, minor variations (e.g. "APIs" matches "API") | 0.8× credit |
| Semantic match | Known aliases (e.g. "JS" matches "JavaScript", "Postgres" matches "PostgreSQL") | 0.6× credit |

**Placement bonus:** keywords found in the Summary or Skills section receive a 1.2× multiplier. Keywords only found buried in bullet text receive no bonus. This reflects how real ATS systems weight high-visibility sections.

**Formula:**
```
coverage_score = Σ(matched_keyword_weight × placement_multiplier) / total_possible_score
keyword_factor = coverage_score × 100
```

**Threshold:** a keyword must appear at least once to count. Repetition beyond once adds no score — keyword stuffing is not rewarded and will flag as an ATS risk hint if a term appears 4+ times unnaturally.

---

#### Factor 2 — Summary Quality (20%)

Checks four independent signals. Each signal contributes to the factor score:

| Signal | Points | How it's measured |
|---|---|---|
| Word count in range | 25pts | Summary is 30–80 words. Below 30 = insufficient. Above 80 = penalised (verbose). |
| Starts with action verb or role title | 25pts | First word is a recognized action verb (from a curated list) or a professional title (e.g. "Frontend Developer", "Software Engineer") |
| Contains a quantifiable achievement | 30pts | Summary contains at least one number, percentage, or measurable result (regex: `\d+%`, `\d+ [a-z]+`, `\$\d+`) |
| Contains path-relevant keyword | 20pts | At least one keyword from the path baseline appears in the summary |

**Total: 100pts mapped to 0–100 for this factor.**

**Examples:**

- "Hardworking developer who loves coding and wants to learn more." → 10/100 (no action verb start, no number, no keyword, barely in word range)
- "Frontend Developer with 2 years building React applications. Reduced load time by 40% on an e-commerce project. Seeking a full-stack role." → 100/100 (role title start, number, keyword, 30 words)

---

#### Factor 3 — Project Descriptions (15%)

Evaluates every included project's description. Average score across all included projects.

Per project, checks:

| Signal | Points | How it's measured |
|---|---|---|
| Starts with action verb | 30pts | First bullet starts with a recognized action verb |
| Contains measurable result | 40pts | At least one bullet contains a number, %, scale, or concrete outcome |
| Minimum length | 30pts | At least 2 bullets, each ≥ 8 words |

**Action verb list (curated for tech):** Built, Developed, Designed, Implemented, Created, Deployed, Optimized, Reduced, Increased, Led, Integrated, Architected, Automated, Migrated, Refactored, Launched, Delivered, Engineered, Configured, Established + ~50 more.

If a project has no description at all → 0 points for that project. Projects with only a title and no bullets → 0.

---

#### Factor 4 — Section Completeness (20%)

Binary check per section. Each section is either complete or not:

| Section | Weight within factor | Complete condition |
|---|---|---|
| Summary | 30% | Non-empty, ≥ 10 words |
| Skills | 25% | ≥ 3 included skills |
| Projects | 20% | ≥ 1 included project with a description |
| Experience | 15% | ≥ 1 entry (or section hidden — hidden counts as complete) |
| Education | 10% | ≥ 1 entry (or section hidden) |

Personal Info is always pre-filled and always complete — not checked.
Certifications is optional — not checked.

---

#### Factor 5 — Formatting Compliance (10%)

Passes/fails checks enforced by the PDF template. Since Mallah controls the output, this factor should always be 100% for resumes built within the builder. It exists as a safety check and ATS education tool.

Checks:
- Single column: always true (enforced by template) → 100%
- Standard section headings: always true (enforced by template) → 100%
- No images or tables: always true → 100%
- Contact info in body (not header/footer block): always true → 100%
- Text-based PDF (not image-based): always true → 100%

If all pass: 100. If any fail (possible if learner somehow exports outside the builder): score reflects the failure with a specific hint.

---

### 9.4 Path Keyword Baselines (General Resumes)

Used for keyword coverage scoring when `resume_type = 'general'`. Curated based on actual job posting frequency for each path.

| Path | Required keywords | Preferred keywords |
|---|---|---|
| `frontend` | HTML, CSS, JavaScript, React, TypeScript, Git, REST API | Responsive Design, Tailwind, Next.js, Webpack, Testing |
| `fullstack` | Node.js, Express, PostgreSQL, REST API, React, Git | Docker, JWT, CI/CD, TypeScript, Redis |
| `cybersecurity` | Penetration Testing, Network Security, Linux, Python, Vulnerability Assessment | OWASP, Burp Suite, Wireshark, Metasploit, SIEM |
| `datascience` | Python, SQL, Pandas, NumPy, Machine Learning, Data Analysis | scikit-learn, Visualization, TensorFlow, Jupyter, Statistics |

**Required keywords** contribute full weight to keyword coverage. **Preferred keywords** contribute 0.5× weight — present but not critical. This mirrors how real ATS systems distinguish required vs preferred skills.

For `resume_type = 'job_based'`, the path baseline is replaced entirely by the extracted `source_jd.required_skills` (full weight) and `source_jd.preferred_skills` (0.5× weight).

---

### 9.5 Match Score (Job-Based Resumes Only)

A separate score from the ATS Score. Shown on the job-based resume card, in the JD keyword strip, and in the ATS overlay.

**Formula:**

```
required_covered = skills in resume that match source_jd.required_skills (case-insensitive)
preferred_covered = skills in resume that match source_jd.preferred_skills (case-insensitive)

required_rate = required_covered / total required_skills
preferred_rate = preferred_covered / total preferred_skills (0 if no preferred skills)

match_score = (required_rate × 0.70) + (preferred_rate × 0.30)
match_percent = round(match_score × 100)
```

Required skills carry 70% of the match. Preferred carry 30%. This is the industry-standard weighting used by Jobscan and Teal — required skills are what determine whether you meet the minimum bar for a role.

**Contextual thresholds shown in UI:**

| Match % | Label | Guidance shown |
|---|---|---|
| 0–49% | Low match | "You're missing several required skills for this role." |
| 50–74% | Moderate match | "You meet some requirements — add missing skills to improve." |
| 75–89% | Strong match | "You're a strong match — review preferred skills to go further." |
| 90–100% | Excellent match | "You meet all key requirements for this role." |

A 75%+ match is the recommended threshold before applying, based on industry data from Jobscan's State of the Job Search 2025 report.

---

### 9.6 Score Display

ATS Score badge always visible in the editor header. Color-coded:

| Score | Color token |
|---|---|
| 0–49 | `destructive` (Alert Red) |
| 50–74 | `warning` (Tactical Amber) |
| 75–89 | `success` (Forest Emerald) |
| 90–100 | `success` (Forest Emerald) |

Clicking the badge opens the ATS Detail Overlay (Section 6.4) with:
- Score ring
- 5 factor breakdown bars with percentages
- 2–4 actionable hints based on the lowest-scoring factors
- Each hint has a "Fix →" that navigates to the relevant section in the left nav

**Hint examples by factor:**

| Factor | Example hint |
|---|---|
| Keyword Coverage | "Your summary is missing key terms for your path. Add React and TypeScript." |
| Summary Quality | "Your summary doesn't start with a role title or action verb. Try: 'Frontend Developer with...'" |
| Summary Quality | "Add a number or result to your summary — e.g. '...built 5 production apps' or '...reduced load time by 30%'." |
| Project Descriptions | "Project bullets should start with action verbs. Change 'Worked on X' to 'Built X'." |
| Project Descriptions | "Add a measurable result to at least one project bullet — a number, %, or scale." |
| Section Completeness | "Add at least 3 skills to complete the Skills section." |

---

## 10. PDF Export

### 10.1 Format Rules (ATS-Safe)

- Single column, black and white only — no colors, no icons
- Text-based PDF — must be copy-pasteable by ATS, never image-based
- Contact info rendered as plain text at top — not in a header/footer block
- Bullet points: `•` character
- No images, borders, color fills, or decorative elements
- Filename: `{first_name}-{last_name}-Resume.pdf`

### 10.2 Typography System

The PDF uses `Inter` throughout — the same font Mallah uses in its UI, embedded via `@react-pdf/renderer`. This creates consistency and gives the output a clean, modern feel distinct from the generic Calibri/Helvetica resumes.

**Type scale:**

| Element | Font | Size | Weight | Style |
|---|---|---|---|---|
| Full name | Inter | 24pt | Bold | Normal |
| Contact line | Inter | 9.5pt | Normal | Normal |
| Section headings | Inter | 10pt | Bold | Uppercase + letter-spacing: 0.08em |
| Section rule | — | 0.5pt | — | Full-width horizontal line below heading |
| Entry title (job title, project name, degree) | Inter | 10.5pt | SemiBold | Normal |
| Entry subtitle (company, institution, tech stack) | Inter | 9.5pt | Normal | Normal |
| Date / location | Inter | 9.5pt | Normal | Right-aligned on same line as entry title |
| Bullet text | Inter | 9.5pt | Normal | Normal |
| Skills label (e.g. "Programming Languages:") | Inter | 9.5pt | SemiBold | Normal |
| Skills value | Inter | 9.5pt | Normal | Normal |

**Spacing system:**

| Location | Value |
|---|---|
| Page margins (all sides) | 36pt (0.5 inch) |
| Name block bottom padding | 6pt |
| Contact line bottom padding | 14pt |
| Between sections | 12pt |
| Section heading bottom margin (before rule) | 2pt |
| Section rule bottom margin | 5pt |
| Between entries within a section | 8pt |
| Between entry header and first bullet | 3pt |
| Between bullets | 2.5pt |
| Line height (body text) | 1.3 |

**Name block layout:**

```
Abdulaziz Alotaibi                          ← 24pt bold, full width
─────────────────────────────────────────── ← NOT a rule, just spacing
+966541533620 · abdulaziz@gmail.com · Riyadh, Saudi Arabia · linkedin.com/in/... 
                                            ← 9.5pt, · separator, no icons
```

**Section heading layout:**

```
EXPERIENCE                                  ← 10pt bold uppercase, letter-spacing
───────────────────────────────────────     ← 0.5pt full-width rule
```

**Entry layout (Experience, Projects):**

```
Frontend Developer                          May 2024 – Present
Noon · Riyadh, Saudi Arabia                 ← 9.5pt, muted

• Built reusable React components...
• Reduced load time by 30%...
```

Entry title + date on the same line (flexRow, spaceBetween). Company/subtitle on the line below in normal weight.

**Skills section layout:**

Rendered as labeled rows, not a flat comma string:

```
Programming Languages    Python, JavaScript, TypeScript, SQL
Tools & Platforms        Git, VS Code, MySQL, Google Colab
```

Label in SemiBold, value in Normal, both 9.5pt. Two-column appearance achieved via fixed label width (120pt) within the single-column layout — ATS-safe because it's plain text flow, not a table.

### 10.3 Export Guard

Before generating, backend validates:
- Summary is non-empty
- Skills has ≥ 1 included skill

If either fails: `Alert` (destructive) "Add at least a Summary and one Skill before exporting."

### 10.4 Generation

`GET /api/resume/:resume_id/export`

Backend fetches `resume_sections` ordered by `sort_order`, compiles via `resume-pdf-template.tsx` using `@react-pdf/renderer`. Returns as direct file download.

---

## 11. Core Flows

### 11.1 Open Resume Builder (Entry)

1. Load all `resumes` rows for this `user_id`
2. Render Resume Cards Grid with thumbnails, ATS scores, timestamps
3. If no resumes exist → show New Resume card with onboarding message

### 11.2 Open Editor (Existing Resume)

1. Load `resume_sections` for selected `resume_id`
2. Merge with current `user_skills` and `user_projects`
3. Render editor: left nav + active section form + Edit/Preview toggle
4. Default active section: Summary
5. If `ats_score` is null → ATS badge shows "—"

### 11.3 Create New Resume

1. Create `resumes` row with `status = 'in_progress'`, title = "My Resume {N}"
2. Auto-create `resume_sections`:
   - PERSONAL_INFO: pre-filled from `users` + `learners`
   - SKILLS: all `user_skills` where `source IN ('roadmap', 'project')` pre-checked
   - PROJECTS: all `user_projects` where `status = 'completed'` pre-included
   - SUMMARY, EXPERIENCE, EDUCATION, CERTIFICATIONS: empty
3. Open editor directly. Default active section: Summary.

### 11.4 Save

1. `PATCH /api/resume/:resume_id/sections`
2. Update `resumes.last_updated_at`
3. Evaluate `status` transition (Section 11)
4. Recalculate ATS score server-side
5. Return updated `ats_score` and hints
6. ATS sidebar updates in place. `Sonner` toast: "Saved ✓"

### 11.5 AI Improve

See Section 8.

### 11.6 Export PDF

`GET /api/resume/:resume_id/export` → validate guard → compile → return file download.

### 11.7 Clone Resume

1. Learner clicks `Clone` in a general resume card's `⋯` dropdown
2. Backend creates a new `resumes` row: `resume_type = 'general'`, `status = 'in_progress'`, title = "Copy of [Original Title]"
3. All `resume_sections` rows from the source resume are duplicated into the new resume — exact copies
4. New card appears on the Cards Grid
5. No editor opens automatically — learner clicks `Edit` when ready

**Guard:** Clone is disabled if the learner is already at the 3-resume limit.

### 11.8 Personalize for a Job

1. Learner clicks `Personalize for a Job` in the editor header of a general resume
2. Personalization Modal opens (Section 5B.2)
3. Learner pastes JD, confirms title, clicks `Personalize →`
4. Backend:
   - Parses JD via AI → extracts `job_title`, `company_name`, `required_skills[]`, `preferred_skills[]`
   - Rewrites `SUMMARY` section content via AI
   - Rewrites `EXPERIENCE` bullets via AI
   - Reorders skills in `SKILLS` section (required → preferred → unmatched)
   - Reorders projects in `PROJECTS` section (most JD-relevant first)
   - Updates `resumes.resume_type = 'job_based'`
   - Stores `resumes.source_jd` JSONB
   - Updates `resumes.title` to entered title
   - Reconfigures ATS scoring to use JD keywords
5. Modal closes. Editor reloads with JD keyword strip, relevance indicators active
6. `Sonner` toast: "Your resume has been personalized for [Job Title]. Review the changes below."

---

## 12. Data Model

### `resumes` table

| Field | Type | Notes |
|---|---|---|
| `resume_id` | UUID (PK) | |
| `user_id` | FK | |
| `title` | VARCHAR | e.g. "Frontend Resume", "React Dev @ Noon" |
| `resume_type` | ENUM | `general` (default) / `job_based` |
| `source_jd` | JSONB | NULL for general resumes. For job-based: `{ job_title, company_name, required_skills[], preferred_skills[], analysis_id }`. `analysis_id` is the FK to `opportunity_analyses` if created from a saved analysis, otherwise null. |
| `status` | ENUM | `not_created` / `in_progress` / `ready` |
| `ats_score` | INT | 0–100, null until first save |
| `last_updated_at` | TIMESTAMP | |
| `created_at` | TIMESTAMP | |

**`status` transition rules:**

| Transition | Trigger |
|---|---|
| No row → `not_created` | Learner has never opened the Resume Builder. Dashboard reads absence of a `resumes` row as `not_created`. |
| `not_created` → `in_progress` | A `resumes` row is created the moment the learner clicks "New Resume" or opens the editor for the first time. |
| `in_progress` → `ready` | On save: Summary non-empty AND ≥ 1 skill included AND `ats_score ≥ 50`. All three required. |
| `ready` → `in_progress` | On save: Summary cleared OR all skills excluded (resume regresses below threshold). |

**Dashboard reads `resume_status` as:**
- No `resumes` row → `not_created`
- Row with `status = 'in_progress'` → `in_progress`
- Row with `status = 'ready'` → `ready`
- Row with `status = 'ready'` AND `ats_score` set → "ATS: {score}/100"

### `resume_sections` table

| Field | Type | Notes |
|---|---|---|
| `section_id` | UUID (PK) | |
| `resume_id` | FK | |
| `section_type` | ENUM | `PERSONAL_INFO` / `SUMMARY` / `SKILLS` / `PROJECTS` / `EXPERIENCE` / `EDUCATION` / `CERTIFICATIONS` |
| `content` | JSONB | Structure varies per section type |
| `is_visible` | BOOLEAN | Default `true`. `false` for hidden optional sections. |
| `sort_order` | INT | Fixed per section type in v1 |

### `content` JSONB shapes

**PERSONAL_INFO:**
```json
{ "phone": "", "linkedin": "", "github": "", "portfolio": "", "location": "" }
```

**SUMMARY:**
```json
{ "text": "" }
```

**SKILLS:**
```json
{ "included_skill_ids": ["uuid"], "manual_skills": ["Zod", "Prisma"] }
```

**PROJECTS:**
```json
[{
  "project_id": "uuid",
  "included": true,
  "description_override": "",
  "github_override": "",
  "demo_override": ""
}]
```

**EXPERIENCE:**
```json
[{
  "title": "",
  "company": "",
  "location": "",
  "start": "2024-01",
  "end": "2025-03",
  "current": false,
  "bullets": ["", ""]
}]
```

**EDUCATION:**
```json
[{
  "degree": "",
  "institution": "",
  "field": "",
  "year": "2023",
  "in_progress": false
}]
```

**CERTIFICATIONS:**
```json
[{ "name": "", "issuer": "", "year": "" }]
```

---

## 13. States & Edge Cases

| Scenario | Behavior |
|---|---|
| No skills in `user_skills` | Skills section form shows `Alert` (info): "Complete roadmap topics to auto-fill your skills." Manual add still works. Completion dot is grey. |
| No completed projects | Projects section form shows `Alert` (info): "Finish a roadmap project to add it here." Manual external add still works. |
| AI unavailable | All `AI Improve` buttons hidden. `Alert` (info) shown at top of active section form. ATS score still calculates (rule-based). Job-Based Resume tailoring still works for skills/projects reordering — only the pre-drafted summary falls back to empty (flagged in ATS overlay). |
| Resume has no Summary | Summary completion dot amber. ATS overlay hint: "Add a Summary" → Fix → navigates to Summary in section nav. |
| Export attempted with empty Summary or no skills | `Alert` (destructive) at top of editor: "Add a Summary and at least one Skill before exporting." Export blocked. |
| 3 resume limit reached | Both creation buttons disabled with `Tooltip`. The limit applies to general + job-based combined. |
| `ready` resume has Summary cleared | On next save: `status` downgrades to `in_progress`. Dashboard tile updates. |
| Skill removed from `user_skills` after being included in a resume | Skill remains `included` in `resume_sections` but is reclassified as a manual skill for that resume. Not removed automatically. |
| Learner changes path | Skills section reloads with new path-relevant skills. General resume ATS keyword baseline updates to new path. Job-based resume ATS baseline stays JD-specific — unaffected by path change. |
| Job-Based Resume created with no saved analyses | No longer applicable — job-based resumes are created via the Personalize flow, not from the grid. |
| JD paste fails to parse (AI error) | `Alert` (destructive) in the Personalization Modal: "Personalization failed. Try again or paste a more detailed job description." Modal stays open. |
| Re-tailoring existing job-based resume | Not supported. Learner clones the general resume again and personalizes the new clone for the new role. |
| Clone attempted at 3-resume limit | `Clone` option disabled in the dropdown with `Tooltip`: "Delete a resume to create a new one." |
| Personalization AI partially fails (e.g. summary rewrites but bullets fail) | Apply what succeeded, flag what didn't with a `Sonner` toast: "Personalization partially completed — some sections couldn't be rewritten. Review and edit manually." |

---

## 14. Integration Points

- **Portfolio Hub** — `user_skills` and `user_projects` feed directly into the builder on every load. Resume always reflects the current portfolio state.
- **Dashboard** — reads `resumes.status` and `resumes.ats_score` for the Resume tile. `resumes.last_updated_at` feeds Recent Activity. Dashboard reads the highest ATS score across all resumes for the tile display.
- **Opportunity Analyzer** — directly connected in v1 for Job-Based Resumes. Saved analyses (`opportunity_analyses` where `is_saved = true`) appear in the Job Setup screen. The Opportunity Analyzer action plan "Open Resume Builder" steps now open the Job Setup screen pre-loaded with that analysis. `source_jd.analysis_id` links a job-based resume back to its originating analysis.
- **Onboarding** — `ai_language_pref`, `ai_detail_level`, `primary_goal`, and `current_path_id` shape every AI Improve prompt and the general ATS keyword baseline.
- **Auth / Profile** — `portfolio_slug` from `learners` auto-fills the Portfolio URL in Personal Info. This persists in all exported PDFs, connecting every resume — general and job-based — to the learner's live Mallah portfolio.
