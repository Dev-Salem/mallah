# Mallah — Topic Viewer Redesign + AI Project Evaluation
## Full Specification

**Document version:** v1  
**Covers:** Two features — (1) Topic Viewer & Project Viewer UI redesign, (2) AI Project Evaluation system  
**Does not change:** Core data model, stage unlock logic, path content, or any existing backend flows not listed here

---

## Part 1 — Topic Viewer & Project Viewer Redesign

### 1.1 Design Principles

The current Topic Viewer is a generic two-column layout that doesn't reflect Mallah's Tactical HUD identity. This redesign applies the full Mallah theme — glassmorphism cards, orange glow accents, HUD-style typography, subtle grid overlays — while solving the real UX problems: the cramped two-column split, the underpowered AI Tutor, and the plain resource cards.

**Core decisions:**
- The AI Tutor moves from a fixed right column to a **floating slide-in drawer**. Collapsed by default. The learner opens it intentionally. This gives lesson content the full page width it needs.
- The **bottom action bar becomes a sticky floating HUD bar** — always visible as the learner scrolls, elevated with a glass effect.
- Resource cards (VIDEO, ARTICLE, CERT) become **real visual components**, not plain links.
- The Mallah orange (`oklch(0.68 0.13 38.8)`) is used as an accent only — left borders, glow states, active indicators — not as a fill color everywhere.

---

### 1.2 Mallah Theme Tokens (reference for implementation)

```css
/* backgrounds */
--bg-primary:    oklch(0.12 0.01 106);   /* Deep Graphite — page bg */
--bg-surface:    oklch(0.22 0.01 106);   /* Darkened Slate — cards, panels */
--bg-surface-2:  oklch(0.17 0.01 106);   /* Mid surface — nested elements */

/* brand */
--brand:         oklch(0.68 0.13 38.8);  /* Mallah Orange */
--brand-subtle:  oklch(0.68 0.13 38.8 / 0.12); /* Orange at 12% — glow fills */
--brand-border:  oklch(0.68 0.13 38.8 / 0.35); /* Orange at 35% — borders */

/* text */
--text-primary:  oklch(0.94 0.01 106);   /* Silver Gray */
--text-muted:    oklch(0.70 0.01 106);   /* Subdued Steel */
--text-faint:    oklch(0.50 0.01 106);   /* Very muted */

/* status */
--success:       oklch(0.65 0.12 153);   /* Forest Emerald */
--warning:       oklch(0.78 0.13 70);    /* Tactical Amber */
--info:          oklch(0.63 0.10 245);   /* Digital Blue */
--danger:        oklch(0.55 0.18 25);    /* Alert Red */

/* glass effect */
--glass-bg:      oklch(0.22 0.01 106 / 0.75);
--glass-border:  oklch(0.68 0.13 38.8 / 0.20);
--glass-blur:    12px;

/* grid overlay (hud-grid) */
--grid-size:     30px;
--grid-color:    oklch(0.68 0.13 38.8 / 0.05);

/* typography */
--font-ui:       'Inter', sans-serif;
--font-arabic:   'IBM Plex Sans Arabic', sans-serif;
--font-mono:     'JetBrains Mono', monospace;
```

---

### 1.3 Topic Viewer Layout — Lesson Topics

#### 1.3.1 Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER BAR (sticky, glass effect)                              │
│  breadcrumb · topic title · position indicator · tutor toggle   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONTENT COLUMN (centered, max-width 760px, padding 0 2rem)     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  TOPIC HEADER BAND                                      │    │
│  │  Stage badge · Topic title (large) · Difficulty badge  │    │
│  │  Estimated time · Topic type label                     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SUMMARY BLOCK                                          │    │
│  │  Short description paragraph from topics.summary       │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  RESOURCE BLOCKS (rendered in order_index)                     │
│  · INTERNAL_TEXT card                                           │
│  · VIDEO card                                                   │
│  · ARTICLE card                                                 │
│  · CERT card (always last)                                      │
│                                                                 │
│  [PRACTICAL OUTPUT BLOCK — lesson_lab only]                     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  STICKY ACTION BAR (bottom, floating glass)                     │
│  ← Back    [Mark as Complete]    Next Topic →                   │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │  AI TUTOR DRAWER        │  ← slides in from right
                    │  (triggered by button   │     when opened
                    │   in header bar)        │
                    └─────────────────────────┘
```

#### 1.3.2 Header Bar

- **Position:** sticky top, full width, z-index above content
- **Style:** `background: var(--glass-bg)`, `backdrop-filter: blur(var(--glass-blur))`, `border-bottom: 1px solid var(--glass-border)`
- **Left:** Breadcrumb in `--font-mono`, small, muted — `PATH_NAME / STAGE_NAME / TOPIC_TITLE`. Each segment separated by a `/` glyph in brand orange.
- **Center:** Topic title — `--font-ui`, 16px, `--text-primary`
- **Right:** Position indicator in mono (`03 / 07`) + **"Tutor"** toggle button with a pulse indicator dot when tutor hasn't been opened yet (subtle orange dot, stops pulsing after first open)
- **Height:** 56px

#### 1.3.3 Topic Header Band

Sits at the top of the content column, below the sticky header. Full-width card with `hud-grid` background overlay.

- **Background:** `--bg-surface` with `.hud-grid` overlay at 5% opacity
- **Border-left:** 3px solid `--brand` (Mallah orange accent stripe)
- **Border-radius:** 8px
- **Padding:** 24px 28px
- **Contents (top row):** Stage badge (`STAGE 02` in `--font-mono`, uppercase, muted background pill) · separator · Difficulty badge (color-coded: Beginner = info blue, Intermediate = warning amber, Advanced = danger red)
- **Contents (main):** Topic title in 28px, weight 600, `--text-primary`
- **Contents (bottom row):** Clock icon + estimated time in mono · dot separator · topic type label in muted text
- **Scanline animation** (`.scanline`) runs subtly across this band on first load, then stops — signals "active topic"

#### 1.3.4 Summary Block

- Plain card, `--bg-surface-2`, subtle border
- Summary text in 15px, `--text-muted`, line-height 1.7
- No heading — just the paragraph. Clean.

#### 1.3.5 Resource Cards

**INTERNAL_TEXT card:**
- Background: `--brand-subtle` (orange at 12%)
- Left border: 3px solid `--brand`
- Label: `MALLAH NOTE` in `--font-mono`, 11px, brand orange, uppercase — rendered above the text
- Text: 15px, `--text-primary`, line-height 1.75
- No external link — this is Mallah's own content, rendered inline

**VIDEO card:**
- Background: `--bg-surface`
- Border: 1px solid `oklch(0.30 0.01 106)` (subtle)
- Left section (16:9 thumbnail placeholder): dark fill with a play icon in brand orange, centered. If a thumbnail URL is available (parsed from YouTube), render it.
- Right section: title in 14px medium, channel/author in 12px muted, duration badge in mono if extractable
- Full card is clickable — opens video in new tab (or embedded modal, future v2)
- Label chip in top-left corner: `VIDEO` in mono, 10px, muted background

**ARTICLE card:**
- Background: `--bg-surface`
- Border: 1px solid `oklch(0.30 0.01 106)`
- Left: source favicon (fetched client-side from `https://www.google.com/s2/favicons?domain={domain}`) — fallback to a generic doc icon
- Body: title in 14px medium, source domain in 12px muted, "Opens in new tab" indicator
- Right edge: arrow icon in muted color, brightens on hover
- Label chip: `ARTICLE` in mono

**CERT card (always rendered last):**
- Distinct visual treatment — uses info blue (`--info`) accent, not orange
- Background: `oklch(0.63 0.10 245 / 0.08)` (info at 8%)
- Border: 1px solid `oklch(0.63 0.10 245 / 0.30)`
- Top label: `OPTIONAL CERTIFICATE` in mono, info blue
- Title, provider, cost note
- "Not required to complete this topic" in small muted text — sets expectation clearly
- External link button: "View Certificate →"

#### 1.3.6 Practical Output Block (lesson_lab topics — cybersecurity only)

- Visually distinct from regular content — uses warning amber accent (`--warning`)
- Background: `oklch(0.78 0.13 70 / 0.08)` (amber at 8%)
- Border-left: 3px solid `--warning`
- Label: `PRACTICAL OUTPUT` in mono, amber, uppercase
- Content: the lab deliverable description
- Bottom note: "Complete this in your lab environment (TryHackMe / Hack The Box / DVWA)"

#### 1.3.7 AI Tutor Drawer

- **Trigger:** "Tutor" button in header bar. Clicking toggles the drawer open/closed.
- **Position:** Fixed, right side, full viewport height, slides in with a `translateX` animation (300ms ease-out). Does NOT push content — overlays it with a dark scrim behind.
- **Width:** 420px on desktop, full-width on mobile
- **Style:** `background: var(--glass-bg)`, `backdrop-filter: blur(var(--glass-blur))`, `border-left: 1px solid var(--glass-border)`, `.glow-border` active variant on the left edge
- **Header:** "Mallah Tutor" in mono + topic title in small muted text + close button
- **Chat area:** Scrollable message history. User bubbles right-aligned with `--brand-subtle` background. AI bubbles left-aligned with `--bg-surface-2`. Timestamps in mono, faint.
- **Quick chips:** rendered as pill buttons below the input — "Explain differently", "Summarize", "Give me a practice task". Chips use `--bg-surface` with orange hover border.
- **Input:** Full-width textarea, 1–3 lines auto-expand. Send button uses brand orange. Pressing Enter sends (Shift+Enter for newline).
- **Rate limit state:** Input disabled, gentle message in muted text: "Take a moment — ask again in a few seconds."

#### 1.3.8 Sticky Action Bar

- **Position:** Fixed bottom, full width, above all content
- **Style:** `background: var(--glass-bg)`, `backdrop-filter: blur(12px)`, `border-top: 1px solid var(--glass-border)`, subtle box-shadow upward
- **Height:** 64px
- **Layout:** Three zones — left, center, right
  - Left: `← Back to Roadmap` — ghost button, muted text
  - Center: **`Mark as Complete`** — primary CTA, brand orange background, white text, `.glow-border` effect. When already completed: replaced with `Completed ✔` badge (success green, non-interactive)
  - Right: `Next Topic →` — appears only after topic is marked complete. Ghost button with orange text.
- **Disabled state:** `Mark as Complete` is dimmed with `opacity: 0.4` on locked topics, cursor not-allowed

---

### 1.4 Project Viewer Layout — Project Topics

The Project Viewer uses a different layout from lesson topics. No AI Tutor. The right panel is the project action panel. The overall feel should be more "mission briefing" — heavier, more purposeful.

#### 1.4.1 Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER BAR (same sticky glass style as lesson viewer)         │
│  breadcrumb · PROJECT badge · title · "Gates next stage" chip  │
├──────────────────────────────────┬──────────────────────────────┤
│                                  │                              │
│  PROJECT BRIEF (left, 60%)       │  PROJECT ACTION PANEL (40%) │
│  · Mission header band           │  · Status indicator          │
│  · Description                   │  · Submission form           │
│  · Requirements checklist        │  · AI Review result          │
│  · Skills demonstrated badges    │  · Re-submit controls        │
│  · Reference resources           │                              │
│                                  │                              │
├──────────────────────────────────┴──────────────────────────────┤
│  STICKY ACTION BAR                                              │
│  ← Back    [Mark Project as Complete]    Next Stage →           │
└─────────────────────────────────────────────────────────────────┘
```

#### 1.4.2 Header Bar

- Same glass sticky style as lesson viewer
- Left: Breadcrumb in mono
- Center: `PROJECT` badge (brand orange pill, mono text) + project title
- Right: `GATES NEXT STAGE` chip in warning amber mono — visible until project is completed. Disappears on completion, replaced with `STAGE UNLOCKED` in success green.

#### 1.4.3 Project Brief Panel (left)

**Mission Header Band:**
- Same structure as the Topic Header Band but uses a heavier variant
- Background: `--bg-surface` with `hud-grid` overlay
- Border-left: 3px solid `--brand`
- Top: `PROJECT MILESTONE` or `CAPSTONE PROJECT` label in mono, orange
- Title in 26px, weight 600
- Difficulty badge + Estimated time (same as lesson viewer)
- `.scanline` animation on load

**Description block:** Project brief text. 15px, line-height 1.7, full prose — not bullets.

**Requirements block:**
- Label: `REQUIREMENTS` in mono, muted, uppercase
- Each requirement rendered as a checklist row — but these are **display only** (the actual self-check is in the submission form). Checkbox icons, unchecked state, text in `--text-primary`.
- This list is the source of truth the AI reviewer checks against.

**Skills Demonstrated block:**
- Label: `SKILLS YOU'LL EARN` in mono, muted
- Skill badges: pill shape, `--bg-surface-2` background, muted border, skill name + level indicator dot (beginner/intermediate/advanced coded by color)

**Reference Resources:**
- VIDEO and ARTICLE cards — same style as lesson viewer but in a more compact "reference" variant (single-line, no thumbnail)
- Label above: `REFERENCE MATERIAL` in mono

#### 1.4.4 Project Action Panel (right)

This is the most important UI element on the page. It should feel like a command panel.

**Panel style:** `--bg-surface`, `border: 1px solid var(--glass-border)`, `border-radius: 12px`, `.glow-border` variant, sticky on desktop (scrolls with the viewport)

**State 1 — Available / In Progress (pre-submission):**

```
STATUS
● Available  (or ● In Progress)

─────────────────────────────────
SUBMIT YOUR PROJECT

GitHub Repository URL *
[ https://github.com/... ]

Live Demo URL (optional)
[ https://... ]

── For cybersecurity projects only ──
Report PDF Upload *
[ Choose file... ]
Private Scripts Repo URL (optional)
[ https://github.com/... ]
─────────────────────────────────────

Personal Note (optional, max 300 chars)
[ Write a note about your approach... ]

Tech Stack Tags (optional)
[ React ] [ Node.js ] [ + Add ]

[ Mark Project as Complete → ]
```

- GitHub URL field: required for all non-cybersecurity projects. Validated as a valid GitHub URL on blur.
- Live Demo URL: optional for all paths
- Cybersecurity hybrid fields shown only when `path_id = 'cybersecurity'`
- "Mark Project as Complete →" button: brand orange, full-width, `.glow-border`. Clicking this triggers the submission flow AND queues the AI review (non-blocking — see Part 2).

**State 2 — Under Review (post-submission, AI review pending):**

```
STATUS
● Submitted — Under Review

Your project has been submitted.
The AI reviewer is analyzing it now.
This usually takes 15–30 seconds.

[Animated HUD scan bar]

You've unlocked the next stage and
can continue while review completes.
```

- The stage unlocks immediately on submission (advisory model — see Part 2)
- The review runs async — learner is not blocked

**State 3 — Review Complete:**
See Part 2, Section 2.5 for the full review result UI.

**State 4 — Completed (read-only):**

```
STATUS
✔ Completed  [date in mono]

github.com/username/repo [link]
demo.vercel.app [link]
"Personal note text here"
[React] [Node.js]

AI Review: Passed ✔  (or: Reviewed ✓)

[ View Full Review ]  [ Edit Links ]
```

---

### 1.5 Roadmap Page — Stage Accordion Updates

Small but important changes to the roadmap list view to match the redesign:

- **Stage header:** add a thin left-border accent: brand orange for current stage, success green for completed, muted for locked. Replaces the state label text as the primary visual signal.
- **Topic rows:** add a left-side status dot (4px circle) — orange = in progress, green = completed, muted = not started, dark = locked.
- **Project rows:** styled distinctly — slightly taller, `--bg-surface` background card, `PROJECT` badge in mono orange left of the title, `GATES NEXT STAGE` chip right-aligned.
- **Difficulty badges:** pill shape, color-coded — Beginner uses info blue, Intermediate uses warning amber, Advanced uses danger red. All in mono, 10px.
- **Estimated time:** shown in mono, faint, right-aligned on each topic row.

---

## Part 2 — AI Project Evaluation System

### 2.1 Philosophy

The evaluation is **advisory, not blocking.** The learner submits, gets instant feedback, and can always proceed. The value is in the feedback quality — specific, actionable, tied to the project's published requirements — not in gatekeeping.

The learner should feel like they have a senior reviewer looking at their work, not a pass/fail test. The tone of all AI feedback is constructive and direct — not punishing.

---

### 2.2 What the AI Reviews

The AI reviewer checks three things for every project submission:

| Check | What it does | Applies to |
|---|---|---|
| **Requirements scan** | Reads the GitHub repo (README + file tree) and checks each published requirement from the project spec against what's present | All paths |
| **Code structure check** | Scans for expected files, folders, and patterns (e.g., a React project should have `components/`, a Node project should have `routes/` and `middleware/`) | Frontend, Full-Stack, Data Science |
| **Live demo check** | If a demo URL is provided, fetches the page and describes what it renders — confirms the app is actually live and not a blank page | Frontend, Full-Stack |
| **Report review** | Reads the submitted PDF and checks against the report rubric (scope defined, methodology documented, findings listed, recommendations present) | Cybersecurity only |
| **Script repo scan** | Scans the private scripts repo for any automation scripts relevant to the project | Cybersecurity only |

The AI does **not** evaluate code quality, style, or architecture — it checks against the published requirements list only. This keeps it fair and predictable.

---

### 2.3 Review Trigger & Flow

```
Learner clicks "Mark Project as Complete"
         │
         ▼
Submission saved to user_projects
(status = 'completed', fields saved)
         │
         ▼
Stage unlocks immediately ← learner can continue
         │
         ▼
AI review job queued (async)
         │
    ┌────┴────┐
    │         │
  GitHub    Cybersecurity
  /Demo      path only
  checks     ├── PDF read
    │         └── Scripts repo scan
    └────┬────┘
         │
         ▼
AI generates structured review
(requirements pass/fail + written feedback)
         │
         ▼
Review saved to user_project_reviews table
         │
         ▼
Learner notified (in-app notification + badge on project card)
```

**Timing:** Review typically completes in 15–30 seconds for a GitHub repo scan. PDF report review may take up to 60 seconds.

**Failure handling:** If the GitHub repo is private and inaccessible, or the demo URL returns an error, the AI notes this in the review and skips that check — it does not fail the whole review. The learner sees a note: "Could not access your repository — make sure it's public or check your URL."

---

### 2.4 Data Model Additions

New table: `user_project_reviews`

| Field | Type | Notes |
|---|---|---|
| `review_id` | UUID (PK) | |
| `user_id` | FK → users | |
| `project_id` | FK → projects | |
| `submission_number` | INT | 1 for first submission, increments on re-review |
| `status` | ENUM | `pending` / `complete` / `failed` (system error only) |
| `requirements_results` | JSONB | Array of `{requirement_text, passed: bool, note: string}` |
| `overall_verdict` | ENUM | `strong` / `solid` / `needs_work` |
| `strengths` | TEXT | AI-written, 2–3 sentences |
| `improvements` | TEXT | AI-written, 2–3 sentences |
| `recommended_topics` | TEXT[] | Topic IDs from the current path to revisit, if any |
| `created_at` | TIMESTAMP | |

**`overall_verdict` definition:**
- `strong` — All or almost all requirements met (≥85%)
- `solid` — Most requirements met (60–84%)
- `needs_work` — Fewer than 60% of requirements met

The learner can always request a re-review after updating their submission (new GitHub URL or updated repo). Each re-review increments `submission_number`.

---

### 2.5 Review Result UI (Project Action Panel — State 3)

When the review completes, the Project Action Panel updates to show the result. This is the most important piece of feedback UI in Mallah.

```
┌──────────────────────────────────────────┐
│  AI REVIEW                               │
│  Reviewed [date] · Submission #1         │
├──────────────────────────────────────────┤
│                                          │
│  VERDICT                                 │
│  ┌────────────────────────────────────┐  │
│  │  ● SOLID WORK          72%        │  │
│  │  8 of 11 requirements met         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  REQUIREMENTS                            │
│  ✔ Project deployed on Vercel           │
│  ✔ React Router — 3+ pages             │
│  ✔ useState used for interactivity     │
│  ✔ Responsive on mobile                │
│  ✔ Git history — 10+ commits           │
│  ✗ TypeScript — no .tsx files found    │
│  ✗ useEffect used for data fetch       │
│  ✗ README with setup instructions     │
│  ✔ Live demo URL works                 │
│  ✔ Error handling on fetch calls      │
│  ✔ Forms with validation              │
│                                          │
│  WHAT'S WORKING                         │
│  Your routing and state management      │
│  are solid. The live demo loads and     │
│  the mobile layout holds up well.      │
│                                          │
│  WHAT TO IMPROVE                        │
│  Add TypeScript — even just renaming    │
│  .js to .tsx gets you started. Your     │
│  README is missing setup steps.        │
│                                          │
│  TOPICS TO REVISIT                      │
│  · Topic 6.1 — TypeScript for React    │
│                                          │
│  [ Request Re-Review ]                  │
└──────────────────────────────────────────┘
```

**Visual details:**

- **Verdict badge:** Full-width colored band inside the panel
  - `strong` → success green background, `● STRONG WORK`
  - `solid` → warning amber background, `● SOLID WORK`
  - `needs_work` → danger red background, `● NEEDS WORK`
  - Verdict label in `--font-mono`, 13px, uppercase
  - Percentage right-aligned in mono

- **Requirements list:**
  - ✔ rows: success green dot + text in `--text-primary`
  - ✗ rows: danger red dot + text in `--text-muted` (visually de-emphasized — not alarming, just informational)
  - Each row is exactly one line — the requirement text from the project spec

- **What's Working / What to Improve:** plain prose, 2–3 sentences each. No headers needed — labels in mono uppercase are enough.

- **Topics to Revisit:** only shown if `recommended_topics` is non-empty. Links directly to the topic in the roadmap.

- **Request Re-Review button:** ghost button, muted. Clicking reopens the submission form (fields pre-filled with existing values) so the learner can update their GitHub URL or note and trigger a new review.

---

### 2.6 AI Prompt Structure (for implementation)

The review is powered by a structured AI call. The prompt is built server-side from:

1. The project's published `requirements` list (from `projects.description` + `INTERNAL_TEXT` resources)
2. The learner's submitted GitHub URL, demo URL, and/or PDF content
3. The GitHub repo content: README, file tree (top 2 levels), and `package.json` / `requirements.txt` if present
4. For cybersecurity: the parsed PDF text and scripts repo file tree

**System prompt:**
```
You are a project reviewer for Mallah, a tech learning platform.
Your job is to review a learner's submitted project against a published requirements list.
You check what's present, not how good the code is.
Be honest, specific, and constructive. Never be harsh.
Respond only in valid JSON matching the schema provided.
```

**User prompt structure:**
```
Project: {project_title}
Path: {path_name}
Stage: {stage_name}

REQUIREMENTS TO CHECK:
{requirements_list — numbered, one per line}

SUBMISSION:
GitHub: {github_url}
Demo: {demo_url or "not provided"}
README content: {readme_text}
File tree: {file_tree}
package.json / requirements.txt: {content if present}

For cybersecurity:
Report content: {parsed_pdf_text}
Scripts repo file tree: {file_tree or "not provided"}

Return JSON:
{
  "requirements_results": [
    {"requirement": "...", "passed": true/false, "note": "one sentence explanation"}
  ],
  "overall_verdict": "strong" | "solid" | "needs_work",
  "strengths": "2–3 sentence paragraph",
  "improvements": "2–3 sentence paragraph",
  "recommended_topics": ["topic_id_1", "topic_id_2"] // or empty array
}
```

---

### 2.7 Notification System (new)

When a review completes, the learner is notified even if they've navigated away from the project page.

**In-app notification (bell icon, header):**
- Toast: "Your [Project Name] review is ready." with a link to the project.
- The project card in the Portfolio Hub shows a `Review Ready` badge until the learner views it.

**Badge on roadmap:**
- The completed project's stage row shows a small `Review` indicator until the learner opens the project.

No email notification in v1 — in-app only.

---

### 2.8 Re-Review Rules

- A learner can request a re-review unlimited times.
- Each re-review requires submitting at minimum a new GitHub URL or confirming the repo has been updated (a "I've made changes" checkbox).
- Re-reviews run the same full pipeline as the first review.
- All review history is stored in `user_project_reviews` — learners can see their improvement across submissions (e.g., went from 6/11 → 9/11 requirements met).
- Re-review history displayed in a collapsed "Previous Reviews" section below the current review result.

---

### 2.9 Edge Cases & States

| Scenario | Behavior |
|---|---|
| GitHub repo is private / 404 | Skip code checks. Note in review: "Repository could not be accessed — ensure it is public." Other checks still run. |
| Demo URL returns error / blank page | Note in review: "Demo URL returned an error or blank page." Mark demo check as ✗ |
| PDF upload is corrupted / unreadable | Note in review: "Report could not be parsed. Please re-upload." Review held in `pending` state until re-upload. |
| AI review system is down | Show in panel: "Review is taking longer than expected. You'll be notified when it's ready." Status stays `pending`. |
| Capstone project review | Same flow as milestone projects. Completion of capstone still grants graduation badge immediately on submission — review is advisory and does not affect badge award. |
| Learner has no GitHub URL and no demo URL | "Mark as Complete" button still works. Review notes: "No repository or demo provided — manual review not possible. Add a GitHub URL to receive feedback." Review verdict set to `null` — no score displayed, just a prompt to add links. |

---

## Part 3 — Updated MD Spec Notes (for the roadmap-and-topic-viewer document)

When updating `mallah-roadmap-and-topic-viewer.md`, these sections change:

**Section 4.3 — Topic Resource (additions):**
- VIDEO cards now support thumbnail extraction from YouTube URLs (client-side)
- ARTICLE cards now display source domain favicon
- CERT card color treatment changed from default to info-blue accent

**Section 6.1 — Layout, Lesson Topics (replace with):**
- Single content column (max-width 760px, centered)
- AI Tutor moved to slide-in drawer, triggered by header button
- Sticky glass action bar replaces plain bottom bar

**Section 6.2 — Layout, Project Topics (replace with):**
- Two-column: brief left (60%) + action panel right (40%)
- Action panel has 4 states: Available, Under Review, Review Complete, Completed (read-only)
- Cybersecurity path shows PDF upload + scripts repo field in submission form

**Section 7.6 — Mark Project as Complete (additions):**
- On submission: immediately set `user_projects.status = 'completed'` AND queue async AI review job
- Create `user_project_reviews` row with `status = 'pending'`
- Stage unlock still happens immediately (advisory model — review does not block)
- When review job completes: update `user_project_reviews` row, trigger in-app notification

**New Section 7.8 — Request Re-Review:**
- Input: `user_id`, `project_id`, updated `github_url` (optional), confirmation checkbox
- Backend: create new `user_project_reviews` row with `submission_number = previous + 1`, status `pending`, queue new review job
- Output: Panel updates to "Under Review" state, previous review result archived in collapsed history

---

## Summary

| Feature | Status |
|---|---|
| Topic Viewer — single content column layout | New |
| Topic Viewer — AI Tutor slide-in drawer | New |
| Topic Viewer — redesigned resource cards (VIDEO, ARTICLE, CERT) | New |
| Topic Viewer — sticky glass action bar | New |
| Topic Viewer — HUD theme (scanline, glow border, grid overlay, mono labels) | New |
| Project Viewer — two-column brief + action panel | Updated |
| Project Viewer — cybersecurity hybrid submission fields | New |
| Project Viewer — 4-state action panel | New |
| AI Project Evaluation — async review pipeline | New |
| AI Project Evaluation — requirements pass/fail results | New |
| AI Project Evaluation — verdict + written feedback | New |
| AI Project Evaluation — re-review system | New |
| AI Project Evaluation — in-app notification | New |
| Roadmap accordion — stage left-border accent + topic status dots | Updated |
| `user_project_reviews` table | New |
