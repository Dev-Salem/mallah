# Mallah – Learning Roadmap & Topic Viewer

## 1. Purpose

The Learning Roadmap is the **core engine** of Mallah.  
It turns a learner's profile (onboarding data + path choice) into a **structured, trackable curriculum**.

The **Topic Viewer** is the lesson screen that lives inside the Roadmap — it is where learning actually happens. A learner opens a Topic from the Roadmap, studies the content, talks to the AI Lesson Tutor, and marks it complete. These two modules are documented together because they are tightly coupled and cannot be designed or implemented independently.

Together they:
- Organize learning into Path → Stage → Topic hierarchy
- Deliver lesson content and external resources per Topic
- Host the contextual AI Lesson Tutor per Topic
- Track progress at Topic, Stage, and Path level
- Drive all downstream modules: Dashboard, Portfolio Hub, Resume Builder, and Opportunity Analyzer

Any agent (human or AI) should treat the Roadmap as the **single source of truth** for what the learner should study next.

---

## 2. The 4 Learning Paths

Mallah offers four paths. These are the only valid values for `path_id` across all roadmap logic, onboarding AI output, and UI.

| Path ID          | Path Name                         | Primary Interest Signal                              |
|------------------|-----------------------------------|------------------------------------------------------|
| `frontend`       | Frontend Development              | Visual building, design, user-facing products        |
| `fullstack`      | Full-Stack Web Development        | Logic, backend systems, building complete products   |
| `cybersecurity`  | Cybersecurity & Ethical Hacking   | Puzzles, system weaknesses, security mindset         |
| `datascience`    | Data Science & Machine Learning   | Numbers, patterns, data, analysis, AI                |

Each path is composed of **Stages**, each Stage of **Topics**. Content structure is documented separately in the curriculum reference.

---

## 3. Scope & Dependencies

### 3.1 Functional Scope

This module covers:

- Assigning a Path to the learner (via onboarding or manual change)
- Rendering the full visual roadmap (all Stages and Topics with progress)
- Opening a Topic in the Topic Viewer
- Delivering topic content: internal text, videos, articles, certificate suggestions
- Hosting the AI Lesson Tutor per Topic
- Marking Topics complete and propagating progress upward
- Delivering Milestone Project topics and triggering `user_projects` writes on completion
- Enforcing stage unlock rules (project gate + self-assessment skip where applicable)
- Exposing progress to all dependent modules

### 3.2 Data Dependencies

| Table              | Role in this module                                          |
|--------------------|--------------------------------------------------------------|
| `users`            | Identity and session                                         |
| `learners`         | Holds `current_path_id`, AI prefs, background, velocity      |
| `paths`            | Path metadata and active status                              |
| `stages`           | Ordered chapters within a path                               |
| `topics`           | Ordered lesson units within a stage                          |
| `topic_resources`  | Content assets per topic (video, article, internal text, cert suggestion) |
| `skills`           | Skill catalog                                                |
| `topic_skills`     | Mapping of topics to skills they contribute to               |
| `projects`         | Milestone project templates defined per stage by admins      |
| `project_skills`   | Skills demonstrated by completing a milestone project        |
| `user_progress`    | Per-learner status per topic                                 |
| `user_projects`    | Per-learner completion record for milestone projects         |
| `user_skills`      | Skill levels per learner (updated on topic/project completion) |
| `chat_sessions`    | AI Tutor conversation sessions scoped per topic + user       |
| `chat_messages`    | Individual messages within a chat session                    |

---

## 4. Core Concepts & Terminology

Use these terms consistently across UI, DB, API, and documentation. Do not substitute synonyms (no "track", "module", "lesson", "chapter").

### 4.1 Path

The top-level career track assigned to a learner. A learner has exactly one active path at a time, stored in `learners.current_path_id`. The four valid paths are listed in Section 2.

### 4.2 Stage

A logical chapter inside a Path — a group of related Topics. Stages are ordered by `order_index` within their path. Completing earlier stages may be required to unlock later ones.

Key fields from `stages`: `stage_id`, `path_id`, `title`, `description`, `difficulty_level` (Beginner / Intermediate / Advanced), `order_index`.

### 4.3 Topic

The smallest learning unit — a single lesson or project. Topics are ordered within their Stage by `order_index`. Each topic has a status per learner tracked in `user_progress`.

Key fields from `topics`: `topic_id`, `stage_id`, `title`, `summary`, `estimated_time_min`, `difficulty_level`, `order_index`, `is_mandatory`, `topic_type`.

**`topic_type` values:**

| Value | Description |
|---|---|
| `lesson` | Standard learning topic. Content via `topic_resources`. |
| `lesson_practice` | Lesson with an embedded hands-on exercise. Most common type. |
| `lesson_lab` | Lesson with a practical lab output (cybersecurity path). Produces a private write-up, not a public portfolio item. |
| `concept` | Conceptual/theory topic with no hands-on component. |
| `concept_practice` | Concept with a short practice exercise. |
| `project_milestone` | A milestone project topic. Triggers `user_projects` write on completion. Gates the next stage. |
| `project_capstone` | The final graduation project of a path. Same behavior as `project_milestone` but also unlocks the path graduate badge. |

Topic Viewer renders differently based on `topic_type` — see Section 6.

### 4.4 Topic Resource

A concrete learning asset attached to a Topic. Four types:

- `VIDEO` — external link (YouTube or other). Displayed as an embedded card.
- `ARTICLE` — external blog, doc, or guide link. Opens in a new tab.
- `INTERNAL_TEXT` — a short internal explanation written by the Mallah team. Rendered inline in the Topic Viewer.
- `CERT` — a certificate suggestion relevant to the topic or stage. Not required to complete the topic. Displayed as an optional callout card at the bottom of the topic.

Key fields: `resource_id`, `topic_id`, `resource_type`, `title`, `url` (for VIDEO / ARTICLE / CERT), `content` (for INTERNAL_TEXT), `order_index`.

**CERT resource additional fields:** `provider` (e.g. "Google", "CompTIA"), `cost_type` (`free` / `paid` / `discounted`), `cost_note` (free-text description of cost or discount, e.g. "~$330 — voucher available via path completion").

`CERT` resources are always rendered last in the topic, after all other resources, regardless of `order_index`. They are never gated — learners can view and act on them at any time. They do not need to be completed for the topic to be marked done.

If a Topic has no resources, the Topic Viewer falls back to: topic summary + AI Lesson Tutor only.

### 4.5 Topic Skill Mapping

The `topic_skills` table connects Topics to the Skills they teach. Fields: `topic_id`, `skill_id`.

There is no importance or priority field on this link — the skill's own `category` field (defined once on the `skills` table) carries all the classification meaning needed by downstream modules.

Used for:
- Unlocking or strengthening skills in `user_skills` when a Topic is completed
- Allowing the Opportunity Analyzer to map a missing skill back to specific Topics to study — using `skills.category` to prioritize gaps (e.g. a missing `fundamentals` skill is more urgent than a missing `tool`)

### 4.6 User Progress

The `user_progress` table tracks each learner's status per Topic.

| Field              | Type       | Notes                                          |
|--------------------|------------|------------------------------------------------|
| `user_id`          | FK         |                                                |
| `topic_id`         | FK         |                                                |
| `status`           | ENUM       | `not_started` / `in_progress` / `completed`    |
| `completed_at`     | TIMESTAMP  | NULL until completed                           |
| `last_accessed_at` | TIMESTAMP  | Updated on every open                          |

Derived metrics:
- **Stage completion %** = completed mandatory topics in stage / total mandatory topics in stage
- **Path completion %** = completed mandatory topics across all stages / total mandatory topics in path

---

### 4.7 Milestone Projects

Every stage ends with a Milestone Project topic (`topic_type = 'project_milestone'` or `'project_capstone'`). This is the practical output of the stage — a real deliverable the learner builds and submits.

**Project data model:**

The `projects` table holds the admin-defined template for each milestone project:

| Field | Type | Notes |
|---|---|---|
| `project_id` | UUID (PK) | |
| `stage_id` | FK → stages | Which stage this project belongs to |
| `title` | VARCHAR | e.g. "Personal Profile Page" |
| `description` | TEXT | Admin-written project brief (the "what and why" framing paragraph) |
| `difficulty_level` | ENUM | `beginner` / `intermediate` / `advanced` |
| `thumbnail_url` | VARCHAR | Default thumbnail. Learner can override. |
| `is_public_default` | BOOLEAN | `true` for most paths. `false` for cybersecurity lab projects. |
| `learning_objectives` | TEXT[] | 3–4 bullet points: "After this project you'll be able to…" — shown before requirements to frame intent |
| `evaluation_criteria` | TEXT[] | 4–6 checkpoints the AI evaluator uses to grade the project. Also shown to the learner as the quality bar to aim for. |
| `stretch_goals` | TEXT[] | 2–3 optional extra challenges for learners who finish early. Never gating — purely additive. |
| `employer_signal` | TEXT | 1–2 sentences: what this project communicates to a hiring manager. Shown in the Project Viewer as a "What this tells employers" callout. |

The `project_skills` table maps projects to the skills they demonstrate (analogous to `topic_skills` for lessons).

**Project AI Evaluation:**

The `project_evaluations` table stores AI evaluation results for submitted projects:

| Field | Type | Notes |
|---|---|---|
| `evaluation_id` | UUID (PK) | |
| `user_id` | FK → users | |
| `project_id` | FK → projects | |
| `github_url` | VARCHAR | The URL evaluated (snapshot at evaluation time) |
| `demo_url` | VARCHAR | Optional live URL evaluated |
| `status` | ENUM | `pending` / `complete` / `failed` |
| `overall_score` | SMALLINT | 1–5 score assigned by AI |
| `criteria_scores` | JSONB | Per-criterion score and comment: `{ criterion: string, passed: boolean, comment: string }[]` |
| `strengths` | TEXT[] | 2–3 things the AI identified as well-executed |
| `improvements` | TEXT[] | 2–3 specific, actionable suggestions |
| `summary` | TEXT | 2–3 sentence overall verdict |
| `evaluated_at` | TIMESTAMP | |

One learner can have multiple evaluations per project (re-evaluation after improvements is allowed).

The `user_projects` table holds per-learner completion records:

| Field | Type | Notes |
|---|---|---|
| `user_id` | FK → users | |
| `project_id` | FK → projects | |
| `status` | ENUM | `available` / `in_progress` / `completed` |
| `is_public` | BOOLEAN | Default from `projects.is_public_default` |
| `completed_at` | TIMESTAMP | NULL until completed |
| `github_url` | VARCHAR | NULL until learner adds it |
| `demo_url` | VARCHAR | NULL until learner adds it |
| `thumbnail_url` | VARCHAR | NULL until learner uploads override |
| `personal_note` | VARCHAR | Max 300 chars. Roadmap projects only. |
| `tech_stack` | TEXT[] | Display-only tags added by learner |

**Project status lifecycle:** `available` → `in_progress` → `completed`

A `user_projects` row is created with `status = 'available'` when the learner's stage becomes accessible (not when they open the topic). This is what the Dashboard `start_available_project` mission type reads.

**Portfolio visibility:** By default, completed milestone projects appear in the Portfolio Hub as `is_public = true`. Exception: cybersecurity lab/pentest report projects have `is_public_default = false` on the `projects` template — their `user_projects` row is created with `is_public = false`. Only CTF write-ups and the capstone are public by default for that path.

**Graduation badges:** completing a `project_capstone` topic unlocks a path graduate badge on the learner's profile:

| Path | Badge |
|---|---|
| `frontend` | Frontend Graduate *(no capstone defined in v1 — standard milestone only)* |
| `fullstack` | Full-Stack Graduate |
| `datascience` | Data Science Graduate |
| `cybersecurity` | Cybersecurity Graduate |

---

### 4.8 Stage Unlock Rules

Stage progression is **sequential and gated**. The rules below apply to all four paths:

1. **Topics within a stage can be completed in any order.** There is no enforced topic ordering within a stage.
2. **Each stage requires its Milestone Project to be marked `completed` in `user_projects` before the next stage unlocks.** The next stage's topics are `Locked` until this condition is met.
3. **Self-assessment skip (Stage 1 only, path-specific):**

| Path | Skip Rule |
|---|---|
| `fullstack` | Learners with prior frontend experience can take a self-assessment to skip Stage 1 and begin at Stage 2. |
| `datascience` | Learners who already know Python basics can take a self-assessment to skip Stage 1 and begin at Stage 2. |
| `cybersecurity` | Learners with a strong networking/Linux background can take a self-assessment to begin at Stage 3. |
| `frontend` | No skip — Stage 1 is required for all learners. |

Self-assessment skip sets the skipped stages' `user_progress` topics to `completed` in bulk and creates their `user_projects` rows as `completed`. Progress metrics reflect this accurately.

4. **Frontend path preview rule:** after completing 50% of Stage 5, learners can preview Stage 6 topic descriptions (read-only) before Stage 5 is fully complete. This is a UI-only affordance — topics remain `Locked` for actual access until the Stage 5 project is submitted.

---

## 5. UI – Roadmap Page

### 5.1 Entry Points

- App header navigation → "Roadmap" link (available on all authenticated learner pages)
- Dashboard → Quick Navigation → "View Full Roadmap"
- Dashboard → Mission Card CTA → opens Topic Viewer directly (Roadmap accessible via breadcrumb)

### 5.2 Page Layout

**Header Section**
- Path name (e.g., "Frontend Development Roadmap")
- Overall path progress bar (% completion)
- Summary indicators: `Stages completed / total` and `Topics completed / total`

**Stage Accordion List**

Each Stage is rendered as an expandable row, ordered by `order_index`:

Stage header (always visible):
- Stage title (e.g., "Stage 1 – Web Foundations")
- Difficulty badge (Beginner / Intermediate / Advanced)
- Stage progress bar (% of topics completed within this stage)
- State label: `Current Stage` / `Completed` / `Locked`
- Expand / Collapse toggle

Expanded content (list of Topics):
- Topic title
- Estimated time
- Difficulty badge
- Topic type indicator: lesson topics show no special badge. `project_milestone` and `project_capstone` topics are visually distinct — rendered as a full-width "Project" row with a build icon and a "Gates next stage" label.
- Status badge: `Not Started` / `In Progress` / `Completed` / `Locked`
- `Start` or `Continue` button for the currently active topic
- `From Opportunity Analyzer` tag on topics that were surfaced by the Opportunity Analyzer for this learner's skill gaps
- Clicking any non-locked topic row → opens Topic Viewer

**Optional Side Panel (future v2)**
- "Recommended next topics"
- Topics tagged from Opportunity Analyzer
- Path-level tips

---

## 6. UI – Topic Viewer

The Topic Viewer is the full-screen lesson experience. It is accessed by clicking any active Topic from the Roadmap.

### 6.1 Layout — Lesson Topics

**Header Bar**
- Topic title
- Breadcrumb: Path name → Stage name → Topic title
- Position indicator: "Topic X of Y in Stage Z"

**Main Content Area (left/center)**
- Topic summary (short description from `topics.summary`)
- Lesson content rendered in order by `topic_resources.order_index`:
  - `INTERNAL_TEXT` blocks rendered inline
  - `VIDEO` resources shown as embedded card (external link or iframe)
  - `ARTICLE` resources shown as styled link cards (open in new tab)
  - `CERT` resources rendered last, after all other content, as optional callout cards ("Suggested Certificate") — regardless of their `order_index`
- Estimated time label: "Estimated time: ~N minutes"
- For `lesson_lab` topics (cybersecurity): a **Practical Output** block is shown below the resources, describing exactly what the learner must produce in their lab environment. This is rendered from the topic summary field and is visually distinct from regular summary text.

**AI Lesson Tutor Panel (right)**
- Title: "Mallah Lesson Tutor"
- Subtitle: "Ask anything about this topic"
- Chat window with message history (User vs AI bubbles)
- Input field + "Ask" button
- Quick prompt chips:
  - "Explain again with a simpler example"
  - "Summarize this topic"
  - "Give me a small practice task"

**Bottom Action Bar**
- `← Back to Roadmap`
- `Mark as Complete` (primary action, disabled if already completed)
- `Next Topic →` (appears once current topic is marked complete)

---

### 6.2 Layout — Project Topics (`project_milestone` / `project_capstone`)

Project topics have a different layout from lesson topics. The AI Tutor panel is replaced by a project brief panel, and the action bar includes project-specific actions.

**Header Bar**
- Topic title (e.g., "PROJECT: Personal Profile Page")
- "PROJECT" badge to distinguish from lesson topics
- Breadcrumb + position indicator (same as lessons)
- "Gates next stage" label — visible until the project is completed
- Difficulty badge and estimated time

**Main Content Area**

Rendered in this exact order:

1. **Project Description** (`projects.description`) — the "what and why" framing paragraph. Sets context before any requirements.

2. **Learning Objectives** (`projects.learning_objectives`) — displayed as a short bulleted list under the heading "What you'll be able to do after this." Shown before requirements so the learner understands intent, not just tasks. 3–4 items.

3. **Requirements** (`projects.requirements` stored as `INTERNAL_TEXT` resources, or as a dedicated field) — numbered checklist. These are the mandatory conditions the project must satisfy to be considered complete. The AI evaluator uses these as the baseline pass/fail criteria.

4. **Evaluation Criteria** (`projects.evaluation_criteria`) — displayed under "How this will be evaluated." 4–6 checkpoints. This is the quality bar shown to the learner upfront so there are no surprises in the AI evaluation report. The same criteria are used by the AI evaluator (Section 7.8).

5. **Skills Demonstrated** (`project_skills` → `skills`) — displayed as skill tags/badges under "Skills you'll unlock." Shows the learner what gets added to their profile upon completion.

6. **What This Tells Employers** (`projects.employer_signal`) — a short callout card (1–2 sentences). Framed as: "Employers see this as proof that you can…" This is the Portfolio Hub / career relevance hook. Makes the project feel purposeful, not academic.

7. **Stretch Goals** (`projects.stretch_goals`) — displayed under "Want to go further?" as an optional section. 2–3 items. Always visually de-emphasized (e.g. muted styling) — never framed as required.

8. **VIDEO and ARTICLE resources** — shown last as reference material under "Helpful References."

9. **Estimated time label** — shown inline near the top of the page alongside difficulty.

**Project Action Panel (right — replaces AI Tutor)**
- Current status indicator: `Available` / `In Progress` / `Completed`
- `Mark Project as Complete` button (primary) — opens the Submit modal (see below)
- If the project has been evaluated: shows the latest evaluation summary with a score badge and a "View Full Report" link
- `Get AI Evaluation` button — available after GitHub URL is submitted. Triggers Section 7.8 flow.
- Once completed: shows submitted GitHub link, demo link, and personal note. Read-only (learner can update GitHub/demo URLs post-completion).

**Submit Modal (triggered by "Mark Project as Complete")**
- GitHub URL (optional but strongly encouraged — needed for AI evaluation)
- Live demo URL (optional)
- Personal note (optional, max 300 chars)
- Thumbnail upload (optional, overrides admin default)
- Tech stack tags (optional)
- **Skip Project option** — a clearly de-emphasized secondary option at the bottom of the modal: "Skip this project." Tapping it opens a confirmation: "Are you sure? Skipping means this project won't appear in your portfolio and won't be evaluated. You can still unlock the next stage." If confirmed: project status is set to `skipped` (a new valid ENUM value on `user_projects.status`) and the next stage unlocks. The skipped project does not appear in Portfolio Hub. This option exists so learners are never permanently blocked — but it is never presented as the recommended path.

**AI Tutor is not shown on project topics** — learners work independently on projects.

**Bottom Action Bar**
- `← Back to Roadmap`
- `Mark Project as Complete` (same as panel button — primary CTA)
- `Next Stage →` appears only after project is marked complete (or skipped) and next stage unlocks

---

## 7. Core Flows

### 7.1 Assign Path after Onboarding

**Trigger:** Onboarding completed, AI recommendation accepted (or manual path chosen).

**Input:** `user_id`, `accepted_path_id`

**Backend process:**
1. Validate `accepted_path_id` is active (`paths.is_active = true`). If not, surface the next available active path.
2. Set `learners.current_path_id = accepted_path_id`.
3. `user_progress` rows are **not** pre-created — they are created on first access to each topic.
4. Create `user_projects` rows for all milestone projects in Stage 1 of the path, with `status = 'available'`. Projects in later stages are created as their stage unlocks (see Section 4.8).

**Output:** Learner is sent to Dashboard or Roadmap page. First load highlights the first topic with a "Start Here" prompt.

---

### 7.2 Roadmap View Rendering

**Input:** `user_id` (session) → derives `current_path_id` from `learners`

**Backend queries (in order):**
1. `SELECT * FROM paths WHERE path_id = current_path_id AND is_active = true`
2. `SELECT * FROM stages WHERE path_id = current_path_id ORDER BY order_index`
3. `SELECT * FROM topics WHERE stage_id IN (...) ORDER BY stage_id, order_index`
4. `SELECT * FROM user_progress WHERE user_id = ... AND topic_id IN (...)`
5. `SELECT * FROM user_projects WHERE user_id = ...` (used to determine stage lock state)

**Computed server-side:**
- Per-topic status (default `not_started` if no `user_progress` row exists)
- Per-stage lock state: a stage is `Locked` if the previous stage's milestone project does not have `user_projects.status = 'completed'`
- Per-stage completion %
- Overall path completion %

All progress computation is **server-side only**. Do not compute progress on the frontend.

---

### 7.3 Open Topic (Topic Viewer)

**Input:** `topic_id` from URL, `user_id` from session

**Backend loads:**
- `topics` — title, summary, difficulty, estimated_time_min, `topic_type`
- Stage + Path names via joins
- `topic_resources` ordered by `order_index` (CERT resources flagged separately for last-position rendering)
- `user_progress` row for this user + topic (if exists)
- If `topic_type` is `project_milestone` or `project_capstone`: also load `projects` record and `user_projects` row for this user

**Side effect (lesson topics only):**
- If `user_progress` row does not exist → create it with `status = 'in_progress'`, set `last_accessed_at = NOW()`.
- If row exists with `status = 'not_started'` → update to `'in_progress'`.
- If already `'completed'` → leave as-is, show "Completed ✔" state.

**Side effect (project topics):**
- Update `user_projects.status` to `'in_progress'` if currently `'available'`. Do not create a `user_progress` row — project topics are tracked via `user_projects`, not `user_progress`.

**Output:** Topic Viewer rendered with the correct layout variant for the topic type (Section 6.1 for lessons, Section 6.2 for projects).

---

### 7.4 AI Lesson Tutor – Ask a Question

**Input:** User's question text, `topic_id`, `user_id`

**Backend process:**
1. Check for an active `chat_session` where `session_type = 'topic_tutor'` AND `topic_id` matches AND `user_id` matches.
   - If none exists: create a new row in `chat_sessions`.
2. Insert user message into `chat_messages`.
3. Build AI context payload:
   - Topic title + summary
   - Related skills from `topic_skills` → `skills`
   - Learner's `ai_language_pref` and `ai_detail_level` from `learners`
   - Learner's `background_type` and `readiness_level` from onboarding snapshot
4. Call OpenAI API with context + user question.
5. Store AI response in `chat_messages`.

**Output:** AI answer appended in chat panel. Full message history persists per session.

**Rate limiting:** If a learner sends too many messages in a short window, display a gentle delay message. Do not hard-block.

---

### 7.5 Mark Topic as Complete

**Input:** Button click from Topic Viewer, `user_id`, `topic_id`

**Backend process:**
1. Upsert `user_progress`:
   - `status = 'completed'`
   - `completed_at = NOW()`
   - `last_accessed_at = NOW()`
2. Fetch all skills linked to this topic via `topic_skills`.
3. For each linked skill: create or upgrade the row in `user_skills` (`source = 'roadmap'`). Level is set based on the learner's existing level for that skill — if no existing row, defaults to `beginner`; if already `beginner`, upgrades to `intermediate` on repeated coverage across multiple topics.

**Output:**
- Success notification shown in Topic Viewer
- Status badge updates to `Completed ✔`
- `Next Topic →` button becomes active
- Roadmap stage/path progress recalculated on next roadmap load

---

### 7.6 Mark Project as Complete

**Input:** Modal submission from Topic Viewer project panel, `user_id`, `project_id`, optional fields (github_url, demo_url, personal_note, thumbnail, tech_stack)

**Backend process:**
1. Upsert `user_projects`:
   - `status = 'completed'`
   - `completed_at = NOW()`
   - Save any provided optional fields
2. Fetch all skills linked to this project via `project_skills`.
3. For each linked skill: create or upgrade the row in `user_skills` (`source = 'project'`). Same level upgrade logic as lesson topic completion.
4. **Stage unlock:** check if completing this project satisfies the gate for the next stage. If yes, create `user_projects` rows with `status = 'available'` for all milestone projects in the newly unlocked stage.
5. **Capstone check:** if `topic_type = 'project_capstone'`, write a graduation badge record for this learner + path combination.
6. **Auto-trigger AI evaluation:** if `github_url` was provided at submission time, automatically queue an AI evaluation (Section 7.8) in the background. The learner does not need to manually request it.

**Output:**
- Project status updates to `Completed` in the Topic Viewer panel
- `Next Stage →` button appears in the bottom action bar
- Project appears in Portfolio Hub automatically on next load
- Dashboard `start_available_project` mission type will reflect the new available projects in the next stage
- If GitHub URL was provided: AI evaluation begins in background; the Project Action Panel shows "Evaluation in progress…" until complete

---

### 7.6b Skip Project

**Input:** Skip confirmation from Submit modal, `user_id`, `project_id`

**Backend process:**
1. Upsert `user_projects`:
   - `status = 'skipped'`
   - `completed_at = NOW()`
2. **Stage unlock:** same logic as 7.6 step 4 — skipping still unlocks the next stage.
3. **No skills are written** — skipped projects do not contribute to `user_skills`.
4. **No portfolio entry** — skipped projects do not appear in Portfolio Hub.
5. **No badge** — capstone skips do not award the graduation badge.

`user_projects.status` ENUM must include `'skipped'` as a valid value alongside `'available'`, `'in_progress'`, and `'completed'`.

**Output:**
- `Next Stage →` button appears in the action bar
- Project card in Portfolio Hub is absent (skipped projects are invisible there)
- Dashboard reflects the newly unlocked stage

---

### 7.7 "Resume Learning" – Next Topic Logic

Used by both Dashboard (Mission Card CTA) and Roadmap (highlight current topic).

**Algorithm (v1):**
1. Fetch all stages and topics for `current_path_id`, ordered by `stage.order_index` then `topic.order_index`.
2. Also fetch `user_projects` for this learner to determine project completion state.
3. Iterate in order. For each topic:
   - If `topic_type` is a lesson type AND `user_progress.status` is not `'completed'` AND topic is not `Locked` → this is the next topic. Stop.
   - If `topic_type` is `project_milestone` or `project_capstone` AND `user_projects.status` is not `'completed'` AND project is not `Locked` → this is the next topic (surfaced as a project CTA, not a lesson). Stop.
4. If all mandatory topics and projects are `completed` → surface "Path Complete" state.

**Returns:** `next_topic_id` + topic/stage/type metadata (used by Dashboard to determine correct mission type and CTA label).

---

### 7.8 AI Project Evaluation

**Trigger:** Either (a) automatically after submission when a GitHub URL is provided, or (b) manually via "Get AI Evaluation" button in the Project Action Panel (available on completed projects with a GitHub URL).

**Input:** `user_id`, `project_id`, `github_url`, optional `demo_url`

**Backend process:**
1. Create a `project_evaluations` row with `status = 'pending'`.
2. Fetch the project template: `projects.evaluation_criteria`, `projects.requirements`, `projects.learning_objectives`, `projects.difficulty_level`.
3. Fetch the learner's submitted `github_url` and `demo_url` from `user_projects`.
4. Build the AI evaluation prompt with:
   - Project title, description, and difficulty
   - Full requirements list
   - Full evaluation criteria (the per-criterion checkpoints)
   - GitHub URL and demo URL
   - Learner's path stage context
5. Call AI with instructions to:
   - Score each criterion as `passed: true/false` with a 1–2 sentence comment
   - Assign an overall score (1–5)
   - List 2–3 strengths
   - List 2–3 specific, actionable improvements
   - Write a 2–3 sentence overall summary
   - Respond only in JSON matching the `criteria_scores`, `strengths`, `improvements`, `summary`, `overall_score` schema
6. Parse the response and write all fields to `project_evaluations`.
7. Update `status = 'complete'` (or `'failed'` if the AI call errors out).

**Output — Evaluation Report shown in Topic Viewer Project Action Panel:**
- Overall score badge (e.g. "4 / 5")
- Per-criterion pass/fail chips with expandable comments
- Strengths section (2–3 bullet points)
- Improvements section (2–3 actionable bullet points)
- Summary paragraph
- "Re-evaluate" button — available after the learner updates their GitHub URL, allowing a fresh evaluation on improved work. No limit on re-evaluations.
- The evaluation report is also accessible from the Portfolio Hub project card ("View Evaluation")

**Important constraints:**
- AI evaluation never blocks project completion or stage unlock. The project is already marked complete before evaluation runs.
- If evaluation fails (`status = 'failed'`), show: "Evaluation couldn't be completed. You can try again once your project is live." No error details exposed to the learner.
- Evaluation is only available if a `github_url` is present. If the learner submitted without a GitHub URL, the Project Action Panel shows: "Add a GitHub URL to get your project evaluated."
- For cybersecurity path projects with `is_public_default = false`: evaluation is still available (using the private repo URL), but the evaluation report is also kept private.

---

## 8. States & Edge Cases

### Roadmap-Level

| Scenario | Behavior |
|---|---|
| No path assigned | Redirect to onboarding or manual path selection page |
| Assigned path is inactive | Show message: "This path is no longer available. Please choose a new path." |
| Path has no stages or topics | Show empty state UI. Log for admin to resolve content issue. |
| Learner changes path | Require confirmation modal. Old path progress is preserved, not deleted. |
| Stage is locked (project gate not met) | Stage row is shown in the accordion but collapsed and non-expandable. Lock icon + "Complete the [Stage N] project to unlock" message visible on the header. |
| Self-assessment skip selected | Skipped stage topics bulk-set to `completed`. Skipped stage `user_projects` rows created as `completed`. First available stage highlighted. |

### Topic Viewer-Level

| Scenario | Behavior |
|---|---|
| Topic is locked | Content is visible (read-only). Actions disabled. Message: "Complete the [Stage N] project to unlock this stage." |
| Lesson topic already completed | Viewer opens normally. "Mark as Complete" replaced with "Completed ✔". AI Tutor still available. |
| Project topic already completed | Project panel shows submitted details (read-only). Learner can update GitHub/demo URLs post-completion. |
| Project topic skipped | Project panel shows "Skipped" status. Learner can still submit the project retroactively — doing so changes status to `completed`, awards skills, and adds it to Portfolio Hub. |
| No resources attached to topic | Show fallback: topic summary + AI Tutor only. No empty content error. |
| AI Tutor fails or times out | Show inline error: "Tutor is unavailable right now. Try again in a moment." |
| AI rate limit hit | Show gentle message: "Take a moment — ask your next question in a few seconds." |
| AI evaluation pending | Project Action Panel shows "Evaluation in progress…" spinner in place of the evaluation button. |
| AI evaluation failed | Show: "Evaluation couldn't be completed. You can try again once your project is live." Retry button visible. |
| Cybersecurity path — any topic | A permanent legal reminder is displayed at the bottom of every topic in the cybersecurity path: "All techniques are practised only in authorised environments. Unauthorised access to computer systems is a criminal offence. Always get written permission before testing any system you don't own." |

---

## 9. Integration with Other Modules

### 9.1 Dashboard
Consumes: path name, path completion %, completed topic count, next topic/project for Mission Card CTA, available project count for `start_available_project` mission type.
Source tables: `paths`, `stages`, `topics`, `user_progress`, `user_projects`.

### 9.2 Portfolio Hub
On lesson topic completion → `topic_skills` → `user_skills` updated with `source = 'roadmap'`.
On milestone project completion → `user_projects.status = 'completed'` → project card appears in Portfolio Hub automatically. Skills from `project_skills` written to `user_skills` with `source = 'project'`.
Portfolio Hub distinguishes skills sourced from Roadmap vs Manual vs Projects.

### 9.3 Resume Builder
Pulls skills from `user_skills` (populated by topic and project completion).
Pulls completed projects from `user_projects` for the work/projects section.

### 9.4 Opportunity Analyzer
When a job requires a skill the learner lacks → uses `topic_skills` to surface which Topics (and Stages) to study.
Roadmap badges those topics with a "From Opportunity Analyzer" tag visible in the stage accordion.

### 9.5 AI Career Advisor
Not in scope for v1. This integration point is reserved for v2.

### 9.6 AI Lesson Tutor (Topic Viewer)
Scoped to a single lesson Topic. Not shown on project topics. Context includes topic content, linked skills, and learner profile (background, velocity, AI language/detail preferences from onboarding).
Sessions stored in `chat_sessions` (`session_type = 'topic_tutor'`) and `chat_messages`.

---

## 10. Non-Functional Requirements

- All progress computation must be **server-side**. Never trust client-calculated progress values.
- Roadmap queries should be structured as a predictable set of 4 queries (path → stages → topics → progress). Avoid unbounded joins.
- Naming convention: use `Path`, `Stage`, `Topic` everywhere in code, APIs, and UI copy. Do not use synonyms.
- All business logic for "what the learner should see or do next" must route through the Roadmap's next-topic logic — no ad-hoc queries from other modules.
- Topic Viewer must handle slow AI responses gracefully with a loading state. The rest of the page must remain usable while the AI is thinking.
- Chat history in the AI Tutor panel must persist for the session — learners should be able to scroll up and re-read earlier answers within the same topic visit.

---

## 11. Summary for Agents

When implementing or extending Mallah:

- The **Roadmap** is the backbone. Everything that measures progress, recommends learning, or analyzes readiness reads from or writes to: `paths`, `stages`, `topics`, `topic_skills`, `user_progress`, `user_skills`, `projects`, `project_skills`, `user_projects`.
- The **Topic Viewer** is where progress is actually made. It is the only place that writes `'completed'` status to `user_progress` (lesson topics) and `user_projects` (project topics) and triggers skill unlocks.
- **Two distinct topic types exist at the end of every stage:** `project_milestone` and `project_capstone`. These topics do not use `user_progress` — they use `user_projects`. They do not show the AI Tutor — they show the project action panel. They gate the next stage until marked complete **or skipped**.
- **Four resource types exist:** `VIDEO`, `ARTICLE`, `INTERNAL_TEXT`, `CERT`. CERT resources are always rendered last and are optional — they never gate topic completion.
- **Stage unlock is project-gated:** a stage is `Locked` until the previous stage's milestone project has `user_projects.status = 'completed'` OR `'skipped'`. Three paths (fullstack, datascience, cybersecurity) support a Stage 1 self-assessment skip.
- **Project data model has four key content fields beyond description:** `learning_objectives` (why this project), `evaluation_criteria` (quality bar, shown to learner AND used by AI evaluator), `stretch_goals` (optional extras, never gating), `employer_signal` (career framing shown as a callout). All four are rendered in the Project Viewer main content area in a defined order — see Section 6.2.
- **Project Viewer content render order:** Description → Learning Objectives → Requirements → Evaluation Criteria → Skills Demonstrated → What This Tells Employers → Stretch Goals → Video/Article references.
- **`user_projects.status` has four valid values:** `available`, `in_progress`, `completed`, `skipped`. Skipped projects do not award skills, do not appear in Portfolio Hub, and do not award graduation badges.
- **AI evaluation** (`project_evaluations` table) is separate from project completion. It runs automatically after submission if a GitHub URL is provided. It never blocks completion or stage unlock. Re-evaluation is allowed after improvements.
- The **AI Lesson Tutor** lives inside the Topic Viewer for lesson topics only. It is scoped to one topic at a time. Its context is always built fresh from topic metadata + learner profile. Session type stored as `topic_tutor`.
- The four valid path IDs are: `frontend`, `fullstack`, `cybersecurity`, `datascience`. No other values are valid anywhere in the system.
- If the Roadmap and Topic Viewer are correct and consistent, the Dashboard, Portfolio Hub, Resume Builder, and Opportunity Analyzer stay coherent by design — they are consumers, not owners, of this data.
