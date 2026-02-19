# Mallah – Learning Roadmap Module

## 1. Purpose

The Learning Roadmap is the **core engine** of Mallah.  
It turns a learner’s profile (onboarding data + path choice) into a **structured, trackable curriculum**:

- Path → Stage → Topic
- Each Topic linked to skills, resources, and progress
- Drives Dashboard stats, Skills Hub, Projects, Resume, and Opportunity Analyzer

Any agent (human or AI) should treat the Roadmap as the **single source of truth** for “what the learner should learn next”.

---

## 2. Scope & Dependencies

### 2.1 Functional Scope

The Roadmap module covers:

- Selecting and assigning a **Path** to the learner (via onboarding or manual change)
- Showing the learner a **visual track** of all Stages and Topics
- Allowing the learner to **open** a Topic and **mark it complete**
- Maintaining **progress** at Topic, Stage, and Path levels
- Exposing this progress to:
  - Dashboard (overall completion, “Resume Learning”)
  - Skills & Projects Hub (auto skill unlocking)
  - Resume Builder (skills/projects pulled from roadmap)
  - Opportunity Analyzer (mapping missing skills to topics)
  - AI Tutors (Topic Tutor + Career Advisor context)

### 2.2 Data Dependencies

Roadmap depends on these tables (from our final schema/EER):

- `users`, `learners`  
- `paths`  
- `stages`  
- `topics`  
- `topic_resources`  
- `skills`  
- `topic_skills`  
- `user_progress`  
- `user_skills` (indirectly, via progress → skill unlock rules)

---

## 3. Core Concepts & Terminology

These terms must be consistent across UI, DB, and docs.

### 3.1 Path

> High-level career track chosen for the learner.

Examples:
- `Frontend Development`
- `Cybersecurity`
- `Backend Development`

Key properties (from `paths`):

- `path_id` (PK)
- `name`
- `short_description`
- `is_active`

Notes:

- At any time, a learner has **one current Path** (`learners.current_path_id`).
- Future versions may add “secondary paths”, but v1 assumes one main path.

---

### 3.2 Stage

> Logical “chapter” inside a Path.

Examples for Frontend Path:
- Stage 1 – Web Foundations
- Stage 2 – Advanced Frontend
- Stage 3 – React Basics
- Stage 4 – Job Readiness

Key properties (from `stages`):

- `stage_id` (PK)
- `path_id` (FK)
- `title`
- `description`
- `difficulty_level` (Beginner / Intermediate / Advanced)
- `order_index` (int – position inside the path)

Notes:

- Stages are **ordered** per path by `order_index`.
- Completion of earlier stages may be required to unlock later ones (business rule).

---

### 3.3 Topic

> The smallest learning unit in the roadmap (lesson/mini-module).

Examples:
- “HTML Basics”
- “CSS Flexbox & Grid”
- “React Components & Props”

Key properties (from `topics`):

- `topic_id` (PK)
- `stage_id` (FK)
- `title`
- `summary` (short description)
- `estimated_time_min`
- `difficulty_level`
- `order_index` (position inside the stage)
- `is_mandatory` (Y/N)

Notes:

- Topics are **ordered** within each Stage.
- Topic completion status per learner is stored in `user_progress`.

---

### 3.4 Topic Resource

> A concrete learning asset used inside a Topic (video, article, internal note).

Types (from `topic_resources.resource_type`):

- `VIDEO` – external link (YouTube, etc.)
- `ARTICLE` – external blog/doc link
- `INTERNAL_TEXT` – short internal explanation/snippet used in Topic Viewer

Key properties (weak entity in EER, strong table in schema):

- `resource_id` (PK)
- `topic_id` (FK)
- `resource_type`
- `title`
- `url` (for VIDEO/ARTICLE)
- `content` (for INTERNAL_TEXT)
- `order_index`

---

### 3.5 Topic Skill Mapping (`topic_skills`)

> Connects each Topic to the Skills it contributes to.

Properties:

- `topic_id` (FK)
- `skill_id` (FK)
- `importance_level` (e.g., Low / Medium / High)

Usage:

- When Topic is completed, system can **unlock or strengthen** the related skills in `user_skills`.
- Used by Opportunity Analyzer to map missing skills back to specific Topics.

---

### 3.6 User Progress (`user_progress`)

> Tracks the learner’s status per Topic.

Properties:

- `user_id` (FK)
- `topic_id` (FK)
- `status` (`NotStarted` / `InProgress` / `Completed`)
- `completed_at` (datetime, nullable)
- `last_accessed_at` (datetime, nullable)

Derived metrics:

- Stage completion % =  
  Completed topics in stage / Total mandatory topics in stage
- Path completion % =  
  Completed mandatory topics in all stages / Total mandatory topics in path

---

## 4. UI – Roadmap Page

This is the main Roadmap screen the learner sees.

### 4.1 Entry Points

- From Dashboard:
  - “View Roadmap” button
  - “Resume Learning” → directly goes to active Topic but Roadmap is accessible
- From sidebar navigation:
  - “Learning Roadmap”

### 4.2 Layout

1. **Header Section**
   - Path name (e.g., “Frontend Development Roadmap”)
   - Overall progress bar (% completion of path)
   - Small indicators:
     - `Stages completed / total`
     - `Topics completed / total`

2. **Stage Accordion List**
   For each Stage (ordered by `order_index`):

   - Stage header row:
     - Stage title (e.g., “Stage 1 – Foundations”)
     - Difficulty badge
     - Stage progress bar (% topics completed in stage)
     - Optional label: “Current Stage” / “Locked” / “Completed”
     - Expand/Collapse icon

   - Expanded content:
     - List of topics as rows/cards:
       - Topic title
       - Estimated time
       - Difficulty badge
       - Status badge:
         - `Not Started`
         - `In Progress`
         - `Completed`
         - `Locked` (if prerequisites not met)
       - “Start” / “Continue” button for the next active topic
       - Click on topic row → open Topic Viewer

3. **Side Panel (optional future)**
   - “Recommended next topics”
   - “From Opportunity Analyzer” tags
   - Path tips (small text)

---

## 5. Core Roadmap Flows

### 5.1 Assign Path after Onboarding

**Trigger:**
- Onboarding completed and system picks a recommended path.

**Input:**
- `user_id`
- `recommended_path_id`
- Possibly `fallback_path_id` if recommended path inactive

**Process (Backend):**

1. Validate `recommended_path_id` is active in `paths`.
2. If inactive, select next best active path.
3. Set `learners.current_path_id = chosen_path_id`.
4. Optionally:
   - Initialize `user_progress` with `NotStarted` entries for the first N topics (not mandatory in v1; can create on first visit instead).

**Output / UI:**

- Final onboarding screen:
  - “We recommend: [Path Name]”
  - Short description
  - “Start Journey” button → goes to Dashboard or directly to Roadmap.

---

### 5.2 Roadmap View Rendering

**Input:**
- `user_id` (session)
- Derived `current_path_id` from `learners`

**Process:**

1. Fetch Path:
   - `SELECT * FROM paths WHERE path_id = current_path_id AND is_active = 1`
2. Fetch Stages for that Path:
   - `SELECT * FROM stages WHERE path_id = current_path_id ORDER BY order_index`
3. Fetch Topics for those Stages:
   - `SELECT * FROM topics WHERE stage_id IN (stage_ids) ORDER BY stage_id, order_index`
4. Fetch User Progress:
   - `SELECT * FROM user_progress WHERE user_id = ... AND topic_id IN (topic_ids)`
5. Compute:
   - Per-topic status (default to `NotStarted` if no row)
   - Per-stage completion %
   - Overall path completion %

**Output / UI:**

- Render hierarchical view Path → Stages → Topics with visual progress.

---

### 5.3 Topic Navigation & Completion

> Detailed learning experience is handled in **Topic Viewer**, but Roadmap controls access and status.

**Open Topic Flow:**

- From Roadmap:
  - Click on active topic → navigate to Topic Viewer (`/topic/:id`)
- Roadmap passes:
  - `topic_id`, `user_id` (session)
- Topic Viewer loads content and user_progress, as per its own spec.

**Mark Complete Flow (high-level):**

- Topic Viewer marks topic as completed:
  - Upsert in `user_progress` with `status = 'Completed'`, timestamps.
- Roadmap:
  - On next load, recalculates stage/path progress.

---

### 5.4 “Resume Learning” (Next Topic Logic)

This logic is used by both Dashboard and Roadmap.

**Goal:**
- Identify the **next topic the learner should open**.

**Possible algorithm (v1 simple version):**

1. For learner’s `current_path_id`, fetch all stages and topics ordered by stage `order_index`, then topic `order_index`.
2. For each topic in that order:
   - Check `user_progress.status`:
     - If not `Completed` and topic is not “Locked” → this is the “Next Topic”.
3. If all mandatory topics are completed:
   - Show “You’ve completed this path!” message.

**Outputs:**

- `next_topic_id`
- Stage/topic metadata (title, stage name, etc.)

Used in:

- Dashboard → “Resume Learning” button
- Roadmap → highlight “Current Topic”

---

## 6. Integration with Other Modules

### 6.1 Dashboard

Dashboard consumes Roadmap data:

- Path name
- Path completion %
- Count of completed topics
- “Next Topic” for “Resume Learning”

Data comes from:

- `paths`, `stages`, `topics`, `user_progress`

### 6.2 Skills & Projects Hub

Roadmap completion unlocks skills:

- When Topic completed:
  - Use `topic_skills` to find related `skills`
  - Update `user_skills` with proper level and `source = 'Roadmap'`
- Skills Hub then shows which skills came from Roadmap vs Manual vs Projects.

### 6.3 Resume Builder

Resume Builder uses:

- Skills derived from roadmap (via `user_skills`)
- Projects tied to specific paths/stages (optional future link)

No direct UI integration, but data flows through the shared entities.

### 6.4 Opportunity Analyzer

When a job requires a skill:

- Analyzer uses `topic_skills` to suggest **which Topics (and Stages) to study**.
- Roadmap may highlight those topics with a badge “From Opportunity Analyzer”.

### 6.5 AI Tutors

- Topic Tutor (per lesson):
  - Uses `topics`, `topic_resources`, `topic_skills` to build context.
- Career Advisor:
  - Uses `paths`, `stages`, `topics`, `user_progress` summaries to discuss overall progress.

---

## 7. States & Edge Cases

- **No Path Assigned**
  - If learner reaches Roadmap with `current_path_id` NULL:
    - Redirect to Onboarding or Path selection page.
- **Path Inactive**
  - If `is_active = 0`:
    - Block roadmap view and show message:
      - “This path is no longer available. Please choose a new path.”
- **Empty Path (no stages or topics)**
  - Show clear empty state and log for admin to fix content.

---

## 8. Non-Functional & Implementation Notes

- All computation of progress should be **server-side**, not just front-end.
- Roadmap queries must be optimized:
  - Typically: 1 query for path, 1 for stages, 1 for topics, 1 for progress.
- Use consistent naming in code:
  - `Path`, `Stage`, `Topic` everywhere (no mixing with “track/module/lesson”).
- All business logic that decides **what the learner should see next** must go through the roadmap logic, not random adhoc queries.

---

## 9. Summary for Agents

When implementing or extending Mallah:

- Treat the **Roadmap** as the backbone of the system.
- Any feature that recommends learning, measures progress, or analyzes readiness should **read from / write to**:
  - `paths`, `stages`, `topics`, `topic_skills`, `user_progress`, `user_skills`.
- UI must reflect:
  - Clear hierarchy (Path → Stage → Topic).
  - Accurate progress indicators.
  - A simple “Next Topic” mechanism.

If this module is correct and consistent, the rest of Mallah (Dashboard, Skills Hub, Resume, Opportunity Analyzer, AI) will stay coherent by design.
