# Mallah – Resume Builder v3

## 1. Purpose

The Resume Builder is where everything the learner has built on Mallah becomes a career asset.
Skills earned through the roadmap, projects completed in the Portfolio Hub, and the learner's
personal profile all flow in automatically. The learner is then guided through only the sections
that need their input — Summary, Experience, Education — one at a time, so they always know
exactly what to do next. Pre-filled sections are handled automatically; the wizard only surfaces
the gaps.

The output is a clean, single-column, ATS-optimized PDF that passes automated screening and
looks professional to human recruiters.

---

## 2. Core Design Principles

- **Wizard-style with clear navigation.** A narrow left nav shows all sections with completion status. The right editing area shows one section at a time — focused, never overwhelming. First-time users are guided through the sections that need input in order. Returning users jump directly to any section. A Preview toggle shows the full resume on demand without leaving the editor.
- **Guided from the start.** The wizard runs within the editor layout — no separate wizard screen. Sections needing human input are highlighted with a "→ Fill this" indicator. The learner always knows exactly what to do next. The wizard is always skippable.
- **Pre-filled by default.** Skills, projects, and personal info are populated automatically from Mallah data. The resume has real content before the learner types a single word.
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

The Resume Builder opens to a **Resume Cards Grid** — a visual dashboard of all the learner's resumes. There are two types of resume a learner can create, represented by two creation buttons in the header.

```
┌──────────────────────────────────────────────────────────────────┐
│  My Resumes            [+ General Resume]  [🎯 Job-Based Resume] │
├──────────────────┬──────────────────┬───────────────────────────┤
│  ┌────────────┐  │  ┌────────────┐  │  ┌──────────────────────┐ │
│  │ [preview]  │  │  │ [preview]  │  │  │        +             │ │
│  │ thumbnail  │  │  │ thumbnail  │  │  │   General Resume     │ │
│  │            │  │  │            │  │  │                      │ │
│  ├────────────┤  │  ├────────────┤  │  └──────────────────────┘ │
│  │Frontend    │  │  │React Dev   │  │                           │
│  │Resume      │  │  │@ Noon      │  │                           │
│  │ATS: 82/100 │  │  │🎯 Job-Based│  │                           │
│  │Updated 2d  │  │  │ATS: 91/100 │  │                           │
│  │[Edit] [↓]  │  │  │[Edit] [↓]  │  │                           │
└──────────────────┴──────────────────┴───────────────────────────┘
```

**Each resume card shows:**
- A small live thumbnail preview (miniature A4 paper card render)
- Resume title (editable inline)
- ATS score `Badge` (color-coded)
- Resume type indicator: a subtle `🎯 Job-Based` tag on tailored resumes, nothing on general ones
- Last updated timestamp
- `Edit` → opens the full editor directly (no wizard for existing resumes)
- `↓` → exports PDF immediately without opening the editor
- On hover: `Delete` option with confirmation `Dialog`

**Two creation buttons in the header:**

| Button | Label | Flow |
|---|---|---|
| `Button` (outline) | `+ General Resume` | Creates a standard resume → opens Guided Wizard (Section 5) |
| `Button` (default, with target icon) | `🎯 Job-Based Resume` | Opens the Job-Based Resume setup (Section 5B) |

**First-time user (no resumes yet):** the grid shows two empty-state cards — one for General Resume, one for Job-Based Resume — each with a one-line description. General: "A full resume built from your Mallah profile." Job-Based: "A resume tailored to a specific job you want to apply for."

**Limit:** 3 resumes total per learner in v1 (general + job-based combined). When at the limit, both creation buttons are disabled with `Tooltip`: "Delete a resume to create a new one."

---

## 5. Guided Wizard (First-Time Setup Only)

The wizard runs **within the editor layout** — not as a separate screen. When a new resume is opened for the first time, the learner lands directly in the editor (Section 6) with wizard guidance active. Returning users who click "Edit" on an existing resume get the editor with no wizard guidance at all.

The wizard is **always skippable.** A "Skip to editor" `Button` (ghost) is visible at the bottom of every section form during the wizard. Skipping exits guided mode and lets the learner edit freely.

### 5.1 What the Wizard Covers

Only sections needing human input. Pre-filled sections are skipped.

| Section | In wizard? | Reason |
|---|---|---|
| Personal Info | No | Auto-filled |
| Skills | No | Auto-populated |
| Projects | No | Auto-populated |
| Summary | **Yes** | Cannot be auto-generated |
| Experience | **Yes** | Manual only |
| Education | **Yes** | Manual only |
| Certifications | **Yes** (optional) | Not available elsewhere |

### 5.2 Wizard Behavior in the Editor

**Left nav during wizard:** sections needing input show a subtle "→" indicator next to their name. Completed sections show a green dot. Active section highlighted as normal.

**Right editing area during wizard:** identical to normal editing, with two additions at the bottom of each section form:
- Progress indicator: "Step 1 of 4 — Summary" (muted, small)
- Navigation: `[Skip this section]` (outline) and `[Continue →]` (default/primary)

The learner fills the section, clicks "Continue →", and the nav automatically advances to the next required section. They can also click any nav section directly to jump freely at any time.

**"Continue →" on the last step** shows "Finish →" instead — exits wizard mode with a `Sonner` toast: "Your resume is ready — review and refine using the sections on the left."

**The wizard never activates again** for this resume after completion or skip.

## 5B. Job-Based Resume Setup

A Job-Based Resume is a **separate resume copy** built and optimized for a specific job. It preserves the learner's general resume(s) untouched and creates a new tailored version with content pre-configured around the target role's requirements.

### 5B.1 Entry Point

**One entry point only — the Cards Grid.**

The `🎯 Job-Based Resume` button in the Cards Grid header opens the Job Setup screen. There is no "Tailor for a Job" action inside the editor — all job-based resume creation starts from the grid.

This keeps the editor focused on editing and prevents the learner from accidentally affecting their general resume while working on a tailored version.

### 5B.2 Job Setup Screen

A focused single-screen modal or page (before the editor opens). The learner chooses their JD source:

```
┌──────────────────────────────────────────────────────────────┐
│  Which job are you targeting?                                │
│                                                              │
│  ○  Pick from saved analyses                                 │
│     ┌──────────────────────────────────────────────────┐    │
│     │  Frontend Developer @ Noon   · 68% match         │    │
│     │  React Engineer @ STC        · 74% match         │    │
│     │  UI Developer @ Jarir        · 51% match         │    │
│     └──────────────────────────────────────────────────┘    │
│                                                              │
│  ○  Paste a new job description                              │
│     ┌──────────────────────────────────────────────────┐    │
│     │  [Textarea — paste JD here]                      │    │
│     └──────────────────────────────────────────────────┘    │
│                                                              │
│  Resume title (auto-filled, editable):                       │
│  [Frontend Developer @ Noon]                                 │
│                                                              │
│  [Cancel]                    [Build Job Resume →]            │
└──────────────────────────────────────────────────────────────┘
```

**Option A — Pick from saved analyses:**
- Lists all `opportunity_analyses` where `is_saved = true`, sorted by most recent
- Each row shows: job title, company, match score `Badge`
- Selecting one pre-fills the JD title field
- If no saved analyses exist: this option is greyed out with a note "No saved analyses yet — use the Opportunity Analyzer to save one, or paste a JD below."

**Option B — Paste a new JD:**
- `Textarea` (min 100 characters to proceed, validated on submit)
- AI parses the JD on submission (same Step 1 backend flow as the Opportunity Analyzer)
- Parsed result is used for tailoring — not saved to `opportunity_analyses` automatically (learner can save it separately from the Opportunity Analyzer)

**Resume title:** auto-filled as "{Job Title} @ {Company}" — editable before proceeding.

**The general resume is never touched.** Every job-based resume is a new independent resume, created as a copy of the learner's most recent general resume and then tailored. The learner can have multiple job-based resumes — one per role they're targeting — all living independently on the grid alongside their general resume.

### 5B.3 Tailoring Logic (Backend)

When the learner clicks "Build Job Resume →":

1. **Create a new independent resume** copied from the learner's most recent general resume (`resume_type = 'general'`). New `resumes` row with `resume_type = 'job_based'`, `source_jd` JSONB field storing the JD data, title set to the entered title. The general resume is never modified — it remains exactly as it was.

2. **Pre-configure Skills section:**
   - Skills from `user_skills` that match JD required/preferred skills → pre-checked and **moved to the top** of the skills list
   - Skills with no JD relevance → pre-unchecked (still available to re-enable)
   - Skills only in the learner's CV (from Opportunity Analyzer CV data) → included with "From CV" label if they match

3. **Pre-configure Projects section:**
   - Projects reordered so the most JD-relevant ones (highest overlap with JD required skills via `project_skills`) appear first and are pre-included
   - Projects with no relevance to the JD → pre-unchecked (still available to re-enable)

4. **Pre-draft Summary:**
   - AI generates a job-specific summary using: learner's background, JD requirements, matched skills, and `primary_goal`
   - Stored as `summary.text` in the new resume's `resume_sections`
   - Learner can edit or AI Improve it in the editor

5. **ATS scoring reconfigured:**
   - For this resume, ATS Keyword Coverage uses the JD's extracted required/preferred skills instead of the path keyword baseline
   - All other ATS factors remain the same

6. Open the **full editor** (Section 6) — no wizard. The resume is already configured. A one-time `Alert` (info) at the top of the Skills section form: "This resume is tailored for [Job Title]. Skills and projects have been pre-selected based on the job requirements. Your general resume is unchanged."

### 5B.4 Job-Based Resume in the Editor

The editor for a Job-Based Resume is identical to the regular editor with two differences:

**Header indicator:** A `Badge` ("🎯 Job-Based") appears next to the resume title in the header, always visible.

**ATS sidebar — JD context:** Below the score ring, a small `Card` shows the job this resume is targeting: "Targeting: [Job Title] @ [Company]" with a `Button` (ghost, small) "Change job" — opens the Job Setup screen to re-tailor to a different JD (creates no new resume, just re-runs the tailoring on this one).

**"Tailor for a Job" button is hidden** on job-based resumes (already tailored).

### 5B.5 Data Model Additions

Two new fields on the `resumes` table:

| Field | Type | Notes |
|---|---|---|
| `resume_type` | ENUM | `general` (default) / `job_based` |
| `source_jd` | JSONB | Stores the parsed JD data used for tailoring. NULL for general resumes. Shape: `{ job_title, company_name, required_skills[], preferred_skills[], analysis_id (nullable) }` |

`analysis_id` is set if the learner picked a saved Opportunity Analyzer result. NULL if they pasted a new JD. This allows the editor to show the match score from the saved analysis if available.

---

## 6. Editor Layout

The editor uses a **two-zone layout** — a narrow left navigation and a full-width right editing area. Clean, focused, no clutter.

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

**First-time wizard mode:** when a new resume is opened for the first time, the wizard runs within this same layout. Sections needing input (Summary, Experience, Education) show a subtle "→ Fill this" indicator in the nav. The editor auto-navigates to Summary first. At the bottom of each form, "Next →" advances to the next required section. "Skip to editor" exits wizard guidance at any point. See Section 5 for full wizard details.

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
- **Job-based resume:** "🎯 Targeting: [Job Title]" shown below the score ring

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

**Typography (matches PDF exactly):**
- Name: 18px bold
- Contact line: 11px, pipe-separated
- Section headings: 11px, bold, uppercase, thin separator below
- Body text: 10px
- Bullets: `•` character

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

### 9.1 Calculation

Server-side. Runs on every save. Returns score (0–100) + hints.

| Factor | Weight | What it checks |
|---|---|---|
| Keyword coverage | 40% | Path-relevant skills/terms appearing in resume |
| Section completeness | 25% | Critical sections present and non-empty |
| Summary quality | 15% | ≥ 20 words, contains action verbs, role-relevant keywords |
| Project descriptions | 10% | Action verbs and concrete outcomes present |
| Formatting compliance | 10% | Single column, standard headings, no problematic structure |

### 9.2 Path Keyword Baselines (v1)

| Path | Key terms |
|---|---|
| `frontend` | HTML, CSS, JavaScript, React, TypeScript, Git, REST API, Responsive Design, Tailwind |
| `fullstack` | Node.js, Express, PostgreSQL, REST API, React, Docker, JWT, CI/CD |
| `cybersecurity` | Penetration Testing, Network Security, OWASP, Burp Suite, Linux, Python, Vulnerability Assessment |
| `datascience` | Python, Pandas, NumPy, Machine Learning, scikit-learn, SQL, Data Analysis, Visualization |

Job-description-specific ATS scoring is a v2 feature connected to the Opportunity Analyzer.

### 9.3 Score Display

Always visible in the left sidebar (see Section 5.2). Color-coded ring + breakdown bars + actionable hints with "Fix →" deep links to relevant sections.

---

## 10. PDF Export

### 10.1 Format Rules (ATS-Safe)

- Single column
- Fonts: Arial or Calibri, 10–11pt body, 13–14pt name
- No images, icons, color fills, or borders
- Section headings: bold, all caps
- Bullet points: `•` characters
- Contact info at top as plain text — not in a header/footer block
- Text-based PDF (not image-based — must be copy-pasteable by ATS)
- Filename: `{first_name}-{last_name}-Resume.pdf`

### 10.2 Export Guard

Before generating, backend validates:
- Summary is non-empty
- Skills has ≥ 1 included skill

If either fails: `Alert` (destructive) "Add at least a Summary and one Skill before exporting."

### 10.3 Generation

`GET /api/resume/:resume_id/export`

Backend fetches `resume_sections` ordered by `sort_order`, compiles into PDF via a fixed ATS-safe template. Returns as direct file download. No third-party PDF styling.

---

## 11. Core Flows

### 11.1 Open Resume Builder (Entry)

1. Load all `resumes` rows for this `user_id`
2. Render Resume Cards Grid with thumbnails, ATS scores, timestamps
3. If no resumes exist → show New Resume card with onboarding message

### 11.2 Open Editor (Existing Resume)

1. Load `resume_sections` for selected `resume_id`
2. Merge with current `user_skills` (roadmap + project sourced) and `user_projects` (completed)
3. Render three-zone editor: ATS sidebar + form panel + live preview
4. If `ats_score` is null → ATS sidebar shows "—" ring with "Save to calculate" message
5. **No wizard** — existing resumes always open directly to the full editor

### 11.3 Create New Resume (Wizard Flow)

1. Create `resumes` row with `status = 'in_progress'`, title = "My Resume {N}"
2. Auto-create `resume_sections`:
   - PERSONAL_INFO: pre-filled from `users` + `learners`
   - SKILLS: all `user_skills` where `source IN ('roadmap', 'project')` pre-checked
   - PROJECTS: all `user_projects` where `status = 'completed'` pre-included
   - SUMMARY, EXPERIENCE, EDUCATION, CERTIFICATIONS: empty
3. Open **Guided Wizard** (Section 5) — not the editor
4. Wizard walks through Summary → Experience → Education → Certifications
5. On wizard completion or skip → open full editor with `Sonner` toast: "Your resume is ready — review and refine it below."

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

### 11.7 Create Job-Based Resume

1. Learner clicks `🎯 Job-Based Resume` from the Cards Grid
2. Job Setup screen opens (Section 5B)
3. Learner selects a saved analysis or pastes a new JD, sets title
4. Backend:
   - Creates a new `resumes` row with `resume_type = 'job_based'`, `source_jd` populated
   - Copies all `resume_sections` content from the learner's most recent general resume as the base
   - **General resume is not touched in any way**
5. Runs tailoring logic: reorder/filter skills, reorder/filter projects, AI-draft job-specific summary
6. Opens full editor — no wizard. One-time `Alert` (info): "This resume is tailored for [Job Title]. Skills and projects have been pre-selected based on the job requirements. Your general resume is unchanged."

### 11.8 Create Another Job-Based Resume

The learner can create as many job-based resumes as the 3-resume limit allows. Each one is independent — a fresh tailored copy from the general resume base, targeting a different role. None of them affect each other or the general resume.

Process is identical to 11.7. Each new job-based resume appears as its own card on the grid.

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
| Job-Based Resume created with no saved analyses | "Pick from saved analyses" option greyed out in Job Setup. Learner must paste a new JD. |
| JD paste fails to parse (AI error) | Show `Alert` (destructive) in Job Setup: "We couldn't read this job description. Try pasting a more detailed version." Block progression until resolved. |
| Re-tailoring existing job-based resume | Not possible from within the editor. Learner returns to the Cards Grid and creates a new job-based resume for the new role. All resumes remain independent. |

---

## 14. Integration Points

- **Portfolio Hub** — `user_skills` and `user_projects` feed directly into the builder on every load. Resume always reflects the current portfolio state.
- **Dashboard** — reads `resumes.status` and `resumes.ats_score` for the Resume tile. `resumes.last_updated_at` feeds Recent Activity. Dashboard reads the highest ATS score across all resumes for the tile display.
- **Opportunity Analyzer** — directly connected in v1 for Job-Based Resumes. Saved analyses (`opportunity_analyses` where `is_saved = true`) appear in the Job Setup screen. The Opportunity Analyzer action plan "Open Resume Builder" steps now open the Job Setup screen pre-loaded with that analysis. `source_jd.analysis_id` links a job-based resume back to its originating analysis.
- **Onboarding** — `ai_language_pref`, `ai_detail_level`, `primary_goal`, and `current_path_id` shape every AI Improve prompt and the general ATS keyword baseline.
- **Auth / Profile** — `portfolio_slug` from `learners` auto-fills the Portfolio URL in Personal Info. This persists in all exported PDFs, connecting every resume — general and job-based — to the learner's live Mallah portfolio.
