# Mallah – Resume Builder 

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

- **Guided from the start.** First-time users go through a wizard that walks them through only the sections that need their input — Summary, Experience, Education. Sections already pre-filled by Mallah (Skills, Projects, Personal Info) are skipped. The learner always knows exactly what to do next. The wizard is always skippable — it's guidance, not a gate.
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

The wizard runs **only when a new resume is created for the first time.** Returning users who click "Edit" on an existing resume go directly to the full editor — no wizard, ever.

The wizard is **always skippable.** "Skip to editor →" is visible at every step. Skipping takes the learner directly to the full editor with whatever they've filled so far.

### 5.1 What the Wizard Covers

Only the sections that need human input. Pre-filled sections are skipped entirely.

| Section | In wizard? | Reason |
|---|---|---|
| Personal Info | No | Auto-filled from profile |
| Skills | No | Auto-populated from `user_skills` |
| Projects | No | Auto-populated from `user_projects` |
| Summary | **Yes** | Cannot be auto-generated |
| Experience | **Yes** | Manual only |
| Education | **Yes** | Manual only |
| Certifications | **Yes** (optional) | Not available elsewhere |

**Total wizard steps: 4** (Summary → Experience → Education → Certifications)

### 5.2 Wizard Shell Layout

Single-column centered layout. Replaces the editor entirely during the wizard.

```
┌────────────────────────────────────────────────────────────┐
│  Step 2 of 4 — Experience          [Skip to editor →]     │
│  ████████████░░░░░░░░░░  50%                               │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [Step heading]                                            │
│  [Step description / guidance note]                        │
│                                                            │
│  [Step-specific form fields]                               │
│                                                            │
│  ▼ Preview  (collapsible — shows resume so far)            │
│  ┌────────────────────────────────────────────────────┐    │
│  │  [A4 paper card — live, updates as learner types]  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                            │
│  [← Back]     [Skip this step]     [Continue →]           │
└────────────────────────────────────────────────────────────┘
```

**Components:**
- Step label: "Step N of 4 — [Section name]" (`text-sm`, muted)
- `Progress` bar showing % complete
- "Skip to editor →" `Button` (ghost) — top right, always present
- Collapsible live preview panel at bottom (A4 paper card, collapsed by default, learner can expand to check how the resume looks)
- Navigation row: `← Back` (ghost), `Skip this step` (outline), `Continue →` (default/primary)
- On final step: `Continue →` becomes `Finish & open editor →`

### 5.3 Step 1 — Summary

Heading: "Write your professional summary"
Guidance: "2–4 sentences. Lead with your role and top skills. State what you're looking for."

- `Textarea` (min 3 rows, auto-expands)
- Word counter below: "32 / 80 words" — amber when approaching limit
- `AI Improve` `Button` (outline, `Sparkles` icon) — inline diff panel behavior (Section 9)

Skipping leaves Summary empty — ATS sidebar will flag it in the editor.

### 5.4 Step 2 — Experience

Heading: "Your work experience"
Guidance: "Add jobs, internships, freelance work, or open source contributions. No experience yet? That's fine — skip this step."

- "Add experience entry" `Button` opens an inline entry form (same fields as Section 8.5)
- Multiple entries can be added
- Each saved entry collapses to a compact summary row with edit/remove buttons

Skipping leaves Experience empty — completion dot will be grey in the editor.

### 5.5 Step 3 — Education

Heading: "Your education"
Guidance: "Add degrees, bootcamps, or courses."

- `Alert` (info, muted): "No formal degree? Your Projects and Skills carry more weight for tech roles."
- "Add education entry" `Button` — same pattern as Experience step

### 5.6 Step 4 — Certifications (Optional)

Heading: "Certifications & courses"
Guidance: "Add certifications like CompTIA, freeCodeCamp, or Google certificates. Skip if you don't have any yet."

- "Add certification" `Button`
- CTA changes to `Finish & open editor →`

### 5.7 Wizard Completion

On "Finish & open editor →" or "Skip to editor":
1. All wizard content saved to `resume_sections`
2. `resumes.status` set to `'in_progress'`
3. Learner lands in the **full editor** (Section 6) with ATS sidebar active, all sections populated, live preview showing the complete resume
4. One-time `Sonner` toast: "Your resume is ready — review and refine it below."

**The wizard never runs again for this resume.** All subsequent edits go directly to the full editor.

---

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

6. Open the **full editor** (Section 6) — no wizard. The resume is already configured. A one-time `Alert` (info) at the top of the form panel: "This resume is tailored for [Job Title]. Skills and projects have been pre-selected based on the job requirements."

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

The editor is the core building experience. It has three zones:

```
┌──────────────────────────────────────────────────────────────────────┐
│  HEADER BAR                                                          │
│  ← My Resumes  |  [Title]  |  [Save]  [Export PDF ↓]               │
├──────────────────┬────────────────────────────┬──────────────────────┤
│  LEFT            │  CENTER                    │  RIGHT               │
│  ATS SCORE       │  FORM PANEL                │  LIVE PREVIEW        │
│  SIDEBAR         │  (~50% width)              │  (~30% width)        │
│  (~20% width)    │  Scrollable                │  Sticky              │
│  Sticky          │                            │  A4 paper card       │
│                  │  Section form fields       │  on grey background  │
│  Score ring      │  with completion dots      │                      │
│  Score breakdown │                            │  Updates 300ms       │
│  Hints           │                            │  after each change   │
│  [Recalculate]   │                            │                      │
└──────────────────┴────────────────────────────┴──────────────────────┘
```

### 6.1 Header Bar

| Element | Component | Notes |
|---|---|---|
| Back link | `Button` (ghost) + `ChevronLeft` icon | "← My Resumes" — returns to cards grid |
| Resume title | Inline editable `Input` | Click to rename. Saves on blur. |
| Resume type badge | `Badge` | "🎯 Job-Based" shown only on job-based resumes, always visible in the header |
| Save button | `Button` (outline) | `Spinner` while saving. "Saved ✓" via `Sonner` toast for 2s on success. |
| Export PDF | `Button` (default) | Primary CTA. `Loader` icon while generating. |

### 6.2 Left Sidebar — ATS Score Panel (Persistent)

The ATS score sidebar is always visible while the learner edits. It is the "coach looking over your shoulder" — always there, never intrusive.

**Top of sidebar — Score ring:**

A circular progress ring (64px) with the score number in the center. Color matches the threshold:

| Score | Color |
|---|---|
| 0–49 | Red |
| 50–74 | Amber |
| 75–89 | Green |
| 90–100 | Blue/Teal |

Below the ring: the label ("Needs Work" / "Getting There" / "Good" / "Excellent") and a small "Recalculate" `Button` (ghost, small).

**Score breakdown — 5 compact rows:**

Each factor shown as a mini `Progress` bar + percentage:

```
Keyword coverage    ████████░░  78%
Section complete    ██████████ 100%
Summary quality     █████░░░░░  52%
Project descs       ████░░░░░░  40%
Formatting          ██████████ 100%
```

**Hints — 2–4 cards:**

Each hint is a compact card with:
- Short issue label (bold, 1 line)
- One sentence description
- `Button` (ghost, xs) "Fix →" — scrolls to the relevant form section

Example:
```
┌──────────────────────────┐
│ Summary too short        │
│ Add 2–3 more sentences   │
│ with action verbs.  Fix →│
└──────────────────────────┘
```

**"Before first save" state:** Ring shows grey, score shows "—", text below: "Save to calculate your ATS score."

**Job-Based Resume — JD context card:**

For job-based resumes, a compact `Card` appears at the top of the ATS sidebar above the score ring:

```
┌─────────────────────────────┐
│ 🎯 Targeting                │
│ Frontend Dev @ Noon         │
│ Match: 74%                  │
│ [Create another version →]  │
└─────────────────────────────┘
```

- Shows the job this resume is tailored for
- Shows the Opportunity Analyzer match score if the resume was created from a saved analysis (from `source_jd.analysis_id`). Hidden if created from a pasted JD.
- "Create another version →" `Button` (ghost, small) — returns the learner to the Cards Grid where they can create a new job-based resume for a different role. This resume is never modified from within the editor.

### 6.3 Center Panel — Form

Scrollable. Each section is a shadcn `Card` with `CardHeader` and `CardContent`. The `CardHeader` shows:
- Section title
- Completion dot (green / amber / grey)
- Section-level action buttons ("Add entry", visibility toggle)

**Section completion dot rules:**

| Section | Green (complete) | Amber (partial) | Grey (empty) |
|---|---|---|---|
| Personal Info | Always green (auto-filled) | — | — |
| Summary | ≥ 20 words | 1–19 words | Empty |
| Skills | ≥ 1 included | Skills exist but all excluded | No skills available |
| Projects | ≥ 1 included | Projects exist but all excluded | No completed projects |
| Experience | ≥ 1 entry with bullets | Entry exists, no bullets | No entries |
| Education | ≥ 1 entry complete | Entry started, not finished | No entries |
| Certifications | ≥ 1 entry OR hidden | — | Visible but empty |

### 6.4 Right Panel — Live Preview

A white A4-proportioned card (shadow, rounded corners, grey background behind it) that renders exactly what the PDF will look like. Updates 300ms after every keystroke (debounced).

**Typography (matches PDF output exactly):**
- Learner name: 18px bold
- Contact line: 11px, pipe-separated, single line
- Section headings: 11px, bold, uppercase, with a thin `Separator` below
- Body text: 10px
- Bullet points: `•` character

**Empty state:** when a section has no content yet, the preview shows muted grey placeholder text where that section would appear ("Summary will appear here…", "Skills will appear here…"). Never a blank white card.

**Mobile (< 768px):** sticky `Tabs` at top: "Edit" and "Preview." Default on mobile is "Edit." ATS sidebar collapses into a floating score badge at top-right corner of the edit view — tapping opens a `Sheet` with the full score breakdown.

---

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
| LinkedIn URL | Manual | `Input` placeholder: "linkedin.com/in/yourname" |
| GitHub URL | Manual | `Input` placeholder: "github.com/yourname" |
| Portfolio URL | Auto: `mallah.app/portfolio/{slug}` | `Input` read-only + copy `Button` |
| Location | Manual, city/country only | `Input` placeholder: "Riyadh, Saudi Arabia" |

**Portfolio link is always included.** Connects the resume to the learner's live Mallah portfolio, giving recruiters direct access to verified projects and skills.

---

### 7.2 Summary

`Textarea` (min 3 rows, auto-expands to content). Max 80 words — enforced with a live counter shown below.

- Placeholder: "Write 2–4 sentences. Lead with your role and top skills. State what you're looking for."
- Word counter: "32 / 80 words" — turns amber when approaching limit
- `AI Improve` `Button` (outline, `Sparkles` icon) — see Section 8

---

### 7.3 Skills

Auto-populated from `user_skills` where `source IN ('roadmap', 'project')`.

Rendered as a **checkbox grid** grouped by `skills.category`:

```
Technical Skills
  ☑ React          ☑ TypeScript      ☑ Node.js
  ☑ PostgreSQL      ☐ Docker          ☑ REST API

Tools & Platforms
  ☑ Git            ☑ VS Code         ☐ Figma
```

- `Checkbox` per skill to include/exclude from this resume
- "Add skill" `Button` (ghost, small) → inline `Input` that appends to `manual_skills` in `resume_sections`. Does not write to `user_skills`.
- Manual skills show a muted "Manual" `Badge` and a remove `Button`

**In the live preview:** rendered as plain grouped comma-separated text. ATS reads plain text reliably.

---

### 7.4 Projects

Auto-populated from `user_projects` where `status = 'completed'`.

Each project renders as a collapsible `Card`:

- `Switch` toggle: include/exclude from this resume
- Title (read-only, from `projects.title`)
- Description `Textarea`: pre-filled from `user_projects.personal_note` → falls back to `projects.description`. Override stored in `resume_sections`, does not touch `user_projects`.
- Skills chip list (read-only, from `project_skills`)
- GitHub URL (read-only if set in `user_projects`, editable `Input` if not)
- Demo URL (same logic)
- `AI Improve` `Button` on description

"Add External Project" `Button` at bottom: opens an inline form for projects built outside Mallah. Stored in `resume_sections` only.

---

### 7.5 Experience

Manual entries. Each entry is a `Card` (collapsible once saved).

Fields:
- Job title (`Input`, required)
- Company name (`Input`, required)
- Location (`Input`, optional)
- Start date (`Input`, type="month")
- End date (`Input`, type="month") OR `Checkbox` "Currently here" → shows "Present"
- Bullets: dynamic list of `Textarea` fields
  - "Add bullet" `Button` adds a row
  - Each bullet has remove `Button` and individual `AI Improve` `Button`
  - Inline guidance below first bullet: "Start with an action verb. Add a result. Example: 'Built a checkout flow that cut abandonment by 15%.'"

"Add Experience" `Button` at bottom.

---

### 7.6 Education

Manual entries. Each entry is a `Card`.

Fields: Degree / Certificate name, Institution, Field of study, Graduation year OR `Checkbox` "In Progress."

"Add Education" `Button` at bottom.

**No degree note:** `Alert` (info) above the section: "No degree? Your Projects and Skills carry more weight for tech roles."

---

### 7.7 Certifications & Courses (Optional)

Hidden by default. Enabled via "Show Certifications" toggle in the section header.

Each entry: Certificate name, Issuing organization, Year — compact row.

Placeholder guidance: "e.g. CompTIA Security+, freeCodeCamp, Google UX Design Certificate"

---

## 8. AI Improve Flow

### 8.1 Where It Appears

`AI Improve` `Button` (outline, small, `Sparkles` icon) on:
- Summary `Textarea`
- Each project description `Textarea`
- Each experience bullet `Textarea`

### 8.2 The Flow

1. Learner clicks `AI Improve`
2. Button → loading state: `Spinner` + "Improving…"
3. Backend builds prompt: current text + section type + `current_path_id` + `primary_goal` + instruction to use action verbs, be concise, ATS-keyword-aware
4. AI returns improved version
5. An **inline diff panel** appears directly below the `Textarea` — no modal:

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

6. **Use this** → replaces textarea, collapses panel, preview updates
7. **Keep original** → collapses panel, textarea unchanged
8. **Try again** → re-runs with a varied prompt

### 8.3 Rules

- Respects `ai_language_pref` — Arabic or Mix → AI writes in that language
- If AI is unavailable → all `AI Improve` buttons hidden. `Alert` (info) at top of form: "AI features are unavailable right now. The rest of the builder works normally."
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
| No skills in `user_skills` | Skills section shows `Alert` (info): "Complete roadmap topics to auto-fill your skills." Manual add still works. Completion dot is grey. |
| No completed projects | Projects section shows `Alert` (info): "Finish a roadmap project to add it here." Manual external add still works. |
| AI unavailable | All `AI Improve` buttons hidden. `Alert` (info) at top of form. ATS score still calculates (rule-based). Job-Based Resume tailoring still works for skills/projects reordering — only the pre-drafted summary falls back to empty (flagged by ATS sidebar). |
| Resume has no Summary | Completion dot amber. ATS sidebar hint: "Add a Summary." Fix → scrolls to Summary. |
| Export attempted with empty Summary or no skills | `Alert` (destructive): "Add a Summary and at least one Skill before exporting." Export blocked. |
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
