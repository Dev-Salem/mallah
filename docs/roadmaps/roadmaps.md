# Mallah – Learning Roadmap Engine v3 (Core Contract)

## 1. Purpose

The Learning Roadmap is the core progression engine of Mallah.

It owns:
- The Path → Stage → Topic hierarchy
- Progress state per learner per topic
- Next-topic resolution (single source of truth)
- Progress aggregation (stage/path completion)
- Skill unlocking triggers (via topic completion)

Downstream modules (Dashboard, Skills Hub, Resume Builder, Opportunity Analyzer, Career Advisor) are consumers of roadmap outputs, not owners of progression logic.

---

## 2. Allowed Paths (Closed Set)

These are the only valid path IDs across onboarding, roadmap, UI, and AI outputs:

| Path ID         | Path Name                       |
|----------------|---------------------------------|
| `frontend`      | Frontend Development            |
| `fullstack`     | Full-Stack Web Development      |
| `cybersecurity` | Cybersecurity & Ethical Hacking |
| `datascience`   | Data Science & Machine Learning |

No other values are permitted.

---

## 3. Scope Boundaries

### Roadmap Engine CAN:
- Read learner’s active path (`learners.current_path_id`)
- Load paths/stages/topics structure
- Resolve and return:
  - topic status per learner
  - stage completion
  - path completion
  - next topic
- Create/update `user_progress` on topic access
- Mark topic completion
- Trigger skill updates upon topic completion

### Roadmap Engine CANNOT:
- Change active path without explicit confirmation flow (separate feature)
- Create or edit curriculum content (admin only)
- Compute UI presentation state (frontend responsibility)
- Infer skills without explicit mappings (`topic_skills` only)

---

## 4. Data Dependencies

| Table              | Role |
|--------------------|------|
| `users`            | Identity/session |
| `learners`         | `current_path_id`, AI prefs, learning velocity |
| `paths`            | Path metadata + active status |
| `stages`           | Ordered chapters in a path |
| `topics`           | Ordered lessons in a stage |
| `topic_resources`  | Content assets per topic |
| `skills`           | Skill catalog |
| `topic_skills`     | Topic → Skill mapping |
| `user_progress`    | Per learner per topic progress state |
| `user_skills`      | Learner skill evidence updated on completion |

Notes:
- `chat_sessions` and `chat_messages` are not part of the Roadmap Engine contract. They belong to the Topic Tutor module.

---

## 5. Core Entities (Contract-Level)

### Path
- `path_id`
- `name`
- `is_active`

### Stage
- `stage_id`
- `path_id`
- `title`
- `difficulty_level`
- `order_index`

### Topic
- `topic_id`
- `stage_id`
- `title`
- `summary`
- `estimated_time_min`
- `difficulty_level`
- `order_index`
- `is_mandatory`

### UserProgress
- `user_id`
- `topic_id`
- `status`: `NotStarted | InProgress | Completed`
- `completed_at` (nullable)
- `last_accessed_at`

---

## 6. Progress Rules (Authoritative)

### 6.1 Topic Status
- Default status for a topic with no row in `user_progress` is `NotStarted`.
- Topic becomes `InProgress` when the learner opens the topic for the first time.
- Topic becomes `Completed` only via explicit completion action (Topic Viewer completion endpoint).

### 6.2 Stage Completion %
- numerator: completed mandatory topics in stage
- denominator: total mandatory topics in stage
- if denominator = 0, stage completion is undefined and must not be shown as 0% (return `null`)

### 6.3 Path Completion %
- numerator: completed mandatory topics in path
- denominator: total mandatory topics in path
- if denominator = 0, path completion is undefined and must not be shown as 0% (return `null`)

All completion calculations are server-side only.

---

## 7. Next Topic Resolution (Single Source of Truth)

Used by:
- Dashboard “Continue/Resume”
- Roadmap “highlight next”
- Topic Viewer “Next Topic” navigation

Algorithm (v1):
1. Fetch all topics for `current_path_id` ordered by `(stage.order_index, topic.order_index)`.
2. Iterate in order:
   - Select the first topic where:
     - `is_mandatory = true`
     - status != `Completed`
     - and topic is accessible (not locked by prerequisites if prerequisites exist in v2+)
3. If none found:
   - Path is complete.

Output:
- `next_topic_id`
- `next_topic_title`
- `next_stage_id`
- `next_stage_title`
- `is_path_complete`

The frontend must not reimplement this algorithm.

---

## 8. Core Flows

### 8.1 Assign Path After Onboarding (Initialization Hook)

Input:
- `user_id`
- `accepted_path_id`

Rules:
- `accepted_path_id` must exist and `paths.is_active = true`.
- If inactive, reject or force manual selection flow (policy decision, not UI-only).
- Set `learners.current_path_id`.

No `user_progress` pre-creation. Progress rows are created lazily on first topic access.

---

### 8.2 Load Roadmap Structure (Read-only)

Input:
- `user_id` (session)

Process:
- Resolve `current_path_id`.
- Load:
  - path
  - stages ordered
  - topics ordered
  - user_progress rows for those topics (if any)
- Compute:
  - per-topic status (default NotStarted)
  - stage completion % (nullable if no mandatory topics)
  - path completion % (nullable if no mandatory topics)
  - next topic object using the single resolution algorithm

Output:
- Roadmap summary object (path + stages + topics + progress)

---

### 8.3 Open Topic (Topic Access Side Effect)

Input:
- `user_id`, `topic_id`

Validation:
- Topic must belong to learner’s active path.
- Topic must exist and be active (if topic-level active flag exists).
- If topic locked by prerequisites (v2+), enforce access policy.

Side effects:
- If no `user_progress` row exists:
  - create row with `status = InProgress`, `last_accessed_at = now`
- If row exists with `status = NotStarted`:
  - update to `InProgress`
- Always update `last_accessed_at = now`

Output:
- Topic payload: metadata + ordered resources + current progress status

---

### 8.4 Mark Topic as Completed (Only Authoritative Write)

Input:
- `user_id`, `topic_id`

Process:
1. Upsert `user_progress`:
   - `status = Completed`
   - `completed_at = now`
   - `last_accessed_at = now`
2. Fetch mapped skills via `topic_skills`.
3. Update `user_skills` for each skill:
   - Create if missing
   - Upgrade level deterministically (policy-defined)
   - Set `source = Roadmap`
   - Record evidence link to topic (recommended)

Output:
- Completion confirmation + updated progress summary (optional)

---

## 9. Edge Cases

| Scenario | Behavior |
|---------|----------|
| `current_path_id` is null | Reject roadmap request; caller redirects to onboarding/path selection |
| Path inactive | Reject access and force new path selection |
| Path has 0 stages/topics | Return empty state with admin-facing error log |
| Stage has 0 mandatory topics | Return stage completion as `null` |
| Topic not in active path | Reject with 403 |
| Duplicate completion requests | Idempotent: keep Completed, do not overwrite completed_at unless policy allows |

---

## 10. Integration Contracts

### Dashboard
Consumes:
- next topic object
- path completion %
- stage completion %
- completed topics counts

Dashboard must not compute these.

### Skills & Projects Hub
Consumes:
- `user_skills` updated by roadmap completion.
Roadmap is the authoritative source of roadmap-earned skills.

### Resume Builder
Reads:
- `user_skills` (roadmap-derived evidence)

### Opportunity Analyzer
Uses:
- `topic_skills` to map missing skills → topics

### Career Advisor
Reads:
- aggregates only (progress summaries)
Does not modify progress.

---

## 11. Non-Functional Requirements

- Server-side calculation only; do not trust client values.
- Predictable query pattern: path → stages → topics → user_progress (bounded joins).
- Idempotent writes for completion.
- Topic access updates must be cheap (single upsert/update).
- No module is allowed to implement its own “next topic” logic.

---

# Mallah – Topic Viewer v3 (Functional Contract)

## 1. Purpose

The Topic Viewer is the learning execution screen for a single Topic.

It owns:
- Rendering topic content and resources
- Topic access side effects (in-progress and last access)
- Completion action trigger (calls roadmap completion endpoint)
- Optional AI Lesson Tutor UI container (logic belongs to Tutor module)

It does not own roadmap aggregation logic.

---

## 2. Inputs / Outputs

Input:
- `topic_id` (route parameter)
- `user_id` (session)

Output:
- Topic payload (metadata + ordered resources + progress status)

---

## 3. Content Delivery Rules

Resources are ordered by `topic_resources.order_index`.

Supported types:
- `INTERNAL_TEXT`
- `VIDEO` (external link)
- `ARTICLE` (external link)

If no resources:
- render topic summary only
- completion still allowed

---

## 4. Completion Rules

- “Mark as Complete” calls backend completion endpoint.
- Completion is idempotent.
- After completion:
  - viewer may request next-topic info from roadmap engine (not compute locally)

---

## 5. Integration Points

- Roadmap Engine:
  - topic load
  - topic completion
  - next topic resolution (if needed)

- Topic Tutor:
  - receives topic context from backend (separate module)

---

## 6. Edge Cases

| Scenario | Behavior |
|---------|----------|
| Topic locked (v2+) | viewer renders read-only, completion disabled |
| Topic already completed | show completed state, completion disabled |
| Topic not found | 404 |
| Topic not in active path | 403 |

---

## 7. Non-Functional Requirements

- Viewer renders without AI availability.
- AI panel is optional and non-blocking.
- No progress calculations in frontend.
