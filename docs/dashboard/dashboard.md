# Mallah – Learner Dashboard v3 (Functional Contract)

## 1. Purpose

The Dashboard is a read-only aggregation layer for learners.

It exists to:
- Present the single highest-priority next action (Mission).
- Display real progress metrics (path + stage).
- Display readiness indicators (skills, projects, resume).
- Display pacing indicators (streak, sessions, pace status).
- Optionally display a non-blocking AI tip.

The Dashboard does not own roadmap logic, onboarding logic, or skill inference logic. It renders backend-provided state only.

---

## 2. Actors

- Learner (authenticated)
- Backend API
- Database
- Optional: OpenAI (AI Micro-Coach only)

---

## 3. Scope Boundaries

### This module CAN:
- Render a mission object returned by the backend.
- Render progress and readiness metrics returned by the backend.
- Render an onboarding banner returned by the backend.
- Render an optional AI tip returned by the backend.

### This module CANNOT:
- Compute or override mission selection.
- Compute progress percentages.
- Compute next-topic logic.
- Mutate roadmap progress or onboarding state.
- Derive skills or projects counts beyond what is returned.

---

## 4. Mission System (Primary Output)

Exactly one mission is returned per request.

Mission selection is server-side only and follows this strict priority order:

| Priority | Condition | Mission Type |
|----------|-----------|--------------|
| 1 | learners.onboarding_completed = false | CompleteOnboarding |
| 2 | Path is complete (all mandatory topics completed) | ChooseNewPath |
| 3 | completed_projects_count = 0 AND learner has passed Stage 1 | StartFirstProject |
| 4 | Inactive for >= inactivity_threshold_days | GetBackOnTrack |
| 5 | current stage completion >= 80% | FinishStage |
| 6 | default | ContinueLearning |

Notes:
- inactivity_threshold_days must be configurable server-side.
- “passed Stage 1” is determined by roadmap engine progress (not UI).

Mission object must always include:
- type
- title
- description
- cta_label
- cta_target

Frontend must not modify mission content or apply local mission logic.

---

## 5. Onboarding Banner

Onboarding banner is optional and returned by the backend.

Shown only when:
- learners.onboarding_completed = true
- completed_topics = 0

Data source:
- ai_recommendations.starter_plan_2_weeks
- ai_recommendations.first_milestone

Banner must include:
- show (boolean)
- starter_plan_2_weeks (array)
- first_milestone (string)
- cta_target (next_topic_id or topic URL)

Banner dismissal behavior is UI-only and must not change data state except a local preference flag (recommended: client-side or a lightweight server preference field).

---

## 6. Progress Outputs (Read-only)

All progress values are computed server-side (Roadmap Engine is the source of truth).

### Path Progress
- completion_percent (nullable if undefined)
- completed_topics
- total_mandatory_topics

### Stage Progress
- current_stage_id
- current_stage_title
- stage_completion_percent (nullable if undefined)
- stage_completed_topics
- stage_total_topics

### Forecast (Optional)
Forecast is returned only if it can be computed from real data.

It may include:
- estimated_days_to_finish_stage
- assumption_basis (e.g., learning_velocity)

Frontend must hide forecast if backend returns null.

---

## 7. Readiness Indicators (Read-only)

Backend provides:
- unlocked_skills_count
- completed_projects_count
- resume_status (not_created | in_progress | ready)
- ats_score (nullable)

Frontend may apply warning styling when:
- completed_projects_count = 0
This is purely visual and does not change logic.

---

## 8. Pace & Momentum (Read-only)

Backend provides:
- streak_days
- sessions_this_week
- target_sessions_per_week
- pace_status (On Track | Behind | Ahead)

Rules:
- If no activity is present, backend may return neutral text and/or streak_days = 0.
- Frontend must not synthesize streak or pace values.

---

## 9. AI Micro-Coach (Optional, Non-Blocking)

AI tip:
- Must never block dashboard rendering.
- Must reference real fields only (no fabrication).
- Must respect:
  - ai_language_pref
  - ai_detail_level

If AI is unavailable:
- Backend returns ai_tip = null OR a deterministic rule-based message.

Constraints:
- short: max 1 sentence
- balanced: max 2 sentences
- detailed: max 3 sentences

AI tip must not alter mission selection.

---

## 10. Quick Navigation

Static navigation links (no logic):
- Roadmap
- Projects & Skills
- Resume Builder
- Opportunity Analyzer

---

## 11. Recent Activity (Optional)

Backend may return last 3–5 activity items derived from:
- user_progress.completed_at
- user_projects.completed_at
- resumes.last_updated_at
- opportunity_analyses.created_at

If no activity exists:
- Return empty array or omit section.
Frontend must hide the section when empty.

---

## 12. Redirect Rules (Hard Rules)

Frontend must redirect and not render dashboard if:
- learners.onboarding_completed = false → onboarding route
- learners.current_path_id is null → path selection route (or onboarding resolution)

Backend should also enforce these rules via response flags or a 409/redirect directive object.

---

## 13. API Contract

Endpoint:
GET /api/dashboard/summary

Response shape (contract):

- learner:
  - first_name
  - primary_goal
  - ai_language_pref
  - ai_detail_level
  - learning_velocity
  - weekly_hours_category
  - onboarding_completed
- path:
  - path_id
  - path_display_name
  - completion_percent
- stage:
  - current_stage_id
  - current_stage_title
  - stage_completion_percent
  - stage_completed_topics
  - stage_total_topics
- topics:
  - completed_topics
  - total_mandatory_topics
  - next_topic_id
  - next_topic_title
  - next_topic_estimated_time_min
- mission:
  - type
  - title
  - description
  - cta_label
  - cta_target
- readiness:
  - unlocked_skills_count
  - completed_projects_count
  - resume_status
  - ats_score
- pace:
  - streak_days
  - sessions_this_week
  - target_sessions_per_week
  - pace_status
- onboarding_banner:
  - show
  - starter_plan_2_weeks
  - first_milestone
  - cta_target
- forecast (optional):
  - estimated_days_to_finish_stage
  - assumption_basis
- ai_tip (optional):
  - text

Rules:
- ai_tip must be computed asynchronously or returned as null if delayed.
- Dashboard must be renderable without ai_tip.

---

## 14. Non-Functional Requirements

- API response time target: < 2 seconds under normal load.
- No mock values returned.
- Enumerations must match shared system enums (onboarding + roadmap).
- No client-side reimplementation of mission/progress algorithms.

---

## 15. Invariants

- Exactly one mission is displayed.
- Mission always includes a CTA.
- Roadmap Engine remains the single source of truth for progress and next topic.
- Dashboard remains usable with AI disabled.