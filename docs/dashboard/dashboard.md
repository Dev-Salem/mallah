# Mallah – Learner Dashboard v2 (Mission-Based)

## 1. Overview

The Dashboard is the learner's Command Center.

It must answer immediately:

- What should I do right now?
- Am I making progress?
- What is blocking me?
- How close am I to my goal?

The Dashboard is **mission-driven, not statistics-driven**. Every element earns its place by either directing action or showing meaningful progress. Decorative metrics and filler cards are not allowed.

---

## 2. Core Design Philosophy

- One dominant action at a time — eliminate decision overload.
- Progress must be visible and feel meaningful.
- Surface risk early: no projects, stalled progress, incomplete resume.
- The page must be fully usable without AI. AI enhances; it never blocks.
- New users and returning users see fundamentally different dashboards.

---

## 3. Layout Structure (Top to Bottom)

1. Greeting & Context Bar
2. New User Onboarding Banner *(new users only, auto-dismisses)*
3. Today's Mission Card *(primary section)*
4. Progress & Forecast
5. Readiness Indicators *(4 tiles)*
6. Pace & Momentum Strip
7. AI Micro-Coach *(secondary, optional)*
8. Opportunity Analyzer Prompt *(contextual — job/freelance goals only)*
9. Quick Navigation
10. Recent Activity *(optional)*

---

## 4. Greeting & Context Bar

**Display:**

> Welcome back, {first_name}

Subtext line:

> Path: {path_display_name} · Stage: {current_stage_title} · Goal: {primary_goal_label}

`primary_goal_label` maps from onboarding value:

| `primary_goal` (DB)  | Display Label           |
|----------------------|-------------------------|
| `job`                | Get a Full-Time Job     |
| `freelance`          | Freelance               |
| `startup`            | Build My Own Project    |
| `exploring`          | Exploring               |

`path_display_name` maps from `path_id`:

| `path_id`        | Display Name                       |
|------------------|------------------------------------|
| `frontend`       | Frontend Development               |
| `fullstack`      | Full-Stack Web Development         |
| `cybersecurity`  | Cybersecurity & Ethical Hacking    |
| `datascience`    | Data Science & Machine Learning    |

**Status badge** (right side of greeting bar):

| Condition                                   | Badge           |
|---------------------------------------------|-----------------|
| On track based on velocity                  | `On Track`      |
| Behind by more than one expected session    | `Slightly Behind` |
| Path fully completed                        | `Path Completed`  |
| Onboarding not finished                     | — (redirect, see Section 12) |

---

## 5. New User Onboarding Banner

**Shown when:** learner has completed onboarding but has 0 completed topics (brand new to their path).

**Content:**
- Title: "Here's your learning path"
- Path match score from `ai_recommendations.match_score` — shown as: "You're a {score}% match for {path_display_name}"
- Top 2 reasons from `ai_recommendations.reasons` — rendered as short bullets explaining why this path fits them
- First milestone project name — pulled from the pre-defined path content (first project in `projects` table linked to this path's Stage 1), not AI-generated
- CTA: `Start My First Lesson →` → navigates to first topic in roadmap

**Dismissal:** learner can dismiss manually, or it auto-hides once the first topic is marked `in_progress`.

**Do not show:** once any topic has been started or the learner has returned more than once.

---

## 6. Today's Mission Card (Primary Section)

This is the largest, most prominent card on the page. Only **one mission** is shown at a time. The frontend renders entirely from the `mission` object returned by the API — it does not compute mission logic itself.

### 6.1 Mission Selection Logic (Strict Priority Order)

Evaluated server-side in this exact order:

| Priority | Condition | Mission Type |
|----------|-----------|--------------|
| 1 | Onboarding not completed | `complete_onboarding` |
| 2 | Path fully completed (all mandatory topics done) | `choose_new_path` |
| 3 | 0 projects completed AND learner has passed Stage 1 | `start_first_project` |
| 4 | Any roadmap project has `status = 'available'` and learner has not started it | `start_available_project` |
| 5 | Inactive for ≥ 7 days (no `last_accessed_at` activity) | `get_back_on_track` |
| 6 | Current stage ≥ 80% complete | `finish_stage` |
| 7 | Default (none of the above) | `continue_learning` |

**Notes:**
- Priority 3 requires the learner to have passed Stage 1 to avoid pushing projects too early on beginners.
- Priority 4 is distinct from Priority 3 — it fires for returning learners who have completed projects before but have a new roadmap project sitting available and untouched.
- The inactivity threshold (7 days) should be configurable in the backend, not hardcoded.
- `complete_onboarding` redirects to the onboarding wizard and only triggers if `learners.onboarding_completed = false`.

### 6.2 Mission Card Content Per Type

**`continue_learning`**
- Title: "Continue Your Learning"
- Description: "Next up: {next_topic_title} in {current_stage_title}"
- Estimated time: shown if `topics.estimated_time_min` is available
- CTA: `Continue` → Topic Viewer for `next_topic_id`

**`finish_stage`**
- Title: "Finish Stage {n} — You're Almost There"
- Description: "Complete {next_topic_title} to unlock {next_stage_title}."
- CTA: `Complete the Stage` → Topic Viewer for `next_topic_id`

**`get_back_on_track`**
- Title: "Ready to Pick Up Where You Left Off?"
- Description: "You were working on {next_topic_title}. It only takes {estimated_time_min} minutes."
- CTA: `Resume Learning` → Topic Viewer for `next_topic_id`

**`start_first_project`**
- Title: "Time to Build Something Real"
- Description: "You've learned the theory. Projects are what make your skills visible to employers and clients."
- CTA: `Start Your First Project` → Portfolio Hub (Projects tab)

**`start_available_project`**
- Title: "A New Project Is Ready for You"
- Description: "{project_title} is available in your roadmap. Building it will unlock {skill_count} new skills for your portfolio."
- CTA: `View Project` → Portfolio Hub, scrolled to the available project card
- `project_title` and `skill_count` come from the first available roadmap project for this learner

**`choose_new_path`**
- Title: "You've Completed Your Path — What's Next?"
- Description: "Explore a new path to keep growing."
- CTA: `Explore Paths` → Roadmap / Path selection screen

**`complete_onboarding`**
- Title: "Let's Finish Setting Up Your Path"
- Description: "Answer a few quick questions to get your personalized learning roadmap."
- CTA: `Complete Setup` → Onboarding wizard

### 6.3 Mission Card UI Rules

- Estimated time is shown only when `topics.estimated_time_min` is not null.
- CTA button is always present — there is no mission without an action.
- Card must be visually dominant: largest card on the page, high contrast, unambiguous primary button.

---

## 7. Progress & Forecast Section

### 7.1 Path Progress

- Progress bar: `path_completion_percent`
- Label: "Completed {completed_topics} of {total_mandatory_topics} lessons"

### 7.2 Stage Progress

- Stage title: `current_stage_title`
- Stage progress bar: `stage_completion_percent`
- Label: "{stage_completed_topics} of {stage_total_topics} topics done"

### 7.3 Forecast Line

Derived from `learning_velocity` (computed during onboarding from `weekly_hours_category`):

| `learning_velocity` | Assumed hours/week | Topics/week estimate |
|---------------------|--------------------|----------------------|
| `slow`              | ~2 hrs             | ~1–2 topics          |
| `normal`            | ~5.5 hrs           | ~3–4 topics          |
| `fast`              | ~10+ hrs           | ~5–7 topics          |

Forecast display:
> "At your current pace, you'll finish this stage in ~{estimated_days} days."

`estimated_days` = remaining mandatory topics in stage ÷ topics_per_week × 7

**Fallback:** If `learning_velocity` is null or remaining topics = 0, hide the forecast line entirely. Never show a fabricated or zero estimate.

---

## 8. Readiness Indicators (4 Tiles)

Four equal-width tiles in a row. Each links to its respective module.

### 8.1 Skills

- Label: "Skills Unlocked"
- Value: `{unlocked_skills_count}`
- Link → Portfolio Hub (Skills tab)
- No warning state for this tile.

### 8.2 Projects

- Label: "Projects Completed"
- Value: `{completed_projects_count}`
- If `completed_projects_count = 0` → render tile in a subtle warning style (muted amber border). Do not use alarming red.
- Link → Portfolio Hub (Projects tab)

### 8.3 Resume

- Label: "Resume"
- Value (state-based):

| State              | Display                     |
|--------------------|-----------------------------|
| `not_created`      | "Not Started"               |
| `in_progress`      | "In Progress"               |
| `ready`            | "Ready"                     |
| ATS score exists   | "ATS Score: {score}/100"    |

- Link → Resume Builder

### 8.4 Portfolio

- Label: "Portfolio"
- Value (state-based):

| State                                          | Display             |
|------------------------------------------------|---------------------|
| No public items (all private or nothing added) | "Not Public"        |
| Has public items                               | "Live"              |

- If `not_public` → render tile in a subtle warning style, same as Projects tile. A learner with skills and projects but a fully private portfolio is not visible to employers.
- Link → public portfolio URL (`mallah.app/portfolio/{portfolio_slug}`) in a new tab, or Portfolio Hub if nothing is public yet.

---

## 9. Pace & Momentum Strip

Compact single row. Not a primary section — it provides contextual momentum signals.

| Field            | Source / Logic                                                              |
|------------------|-----------------------------------------------------------------------------|
| Streak           | Consecutive days with at least one `user_progress.last_accessed_at` update  |
| This week        | Sessions completed this calendar week / `target_sessions`                   |
| Pace status      | Compared actual sessions vs expected sessions from `learning_velocity`       |

**`target_sessions` derivation from `weekly_hours_category`:**

| `weekly_hours_category` | `target_sessions` per week |
|-------------------------|----------------------------|
| `0-3`                   | 2                          |
| `4-7`                   | 3                          |
| `8-12`                  | 5                          |
| `13+`                   | 7                          |

**Pace status logic:**

| Condition                                              | Status label      |
|--------------------------------------------------------|-------------------|
| Actual sessions > target sessions                      | `Ahead`           |
| Actual sessions = target sessions                      | `On Track`        |
| Actual sessions = target sessions − 1                  | `Slightly Behind` |
| Actual sessions < target sessions − 1                  | `Behind`          |

Display format:
> 🔥 {streak} day streak · This week: {sessions_done}/{target_sessions} · {pace_status}

If streak = 0 or no sessions this week, show: "No activity yet this week" instead of "0 day streak".

---

## 10. AI Micro-Coach (Secondary, Optional)

Small card, rendered below the main sections.

**Rules:**
- Maximum 2 sentences.
- Must reference real data only (`next_topic_title`, `stage_completion_percent`, `completed_projects_count`, etc.).
- Never fabricate achievements or invent numbers.
- Respects learner's `ai_language_pref` (arabic / english / mix) and `ai_detail_level` (short / balanced / detailed) from onboarding.
- `ai_detail_level = short` → 1 sentence max.
- `ai_detail_level = detailed` → allowed up to 3 sentences.
- **Goal-aware:** the message must connect progress to the learner's `primary_goal`. See framing guide below.

**Goal framing guide (include one relevant reference per message):**

| `primary_goal` | Framing angle |
|----------------|---------------|
| `job`          | Reference job market signals — "Frontend devs are expected to know X", "Employers look for this skill" |
| `freelance`    | Reference client work — "This is what clients will ask you to build", "Freelancers who know X charge more" |
| `startup`      | Reference building — "This is the foundation your product will run on", "Ship faster once you know this" |
| `exploring`    | Neutral, curiosity-driven — "Here's something interesting about what you just learned" |

**Example (real data + goal-aware):**
> "You're 1 lesson away from completing Stage 1 — and React, one of the top skills in frontend job postings, is up next. Finish this stage to unlock your first portfolio project."

**Fallback behavior:**
- If AI is unavailable → use a rule-based template populated with real metrics. Example:
  > "Keep going — {remaining_topics_in_stage} topic(s) left in {current_stage_title}."
- If no metrics are available yet (brand new user) → hide the section entirely.

**The AI Micro-Coach must never block page rendering.** It loads asynchronously after the rest of the dashboard is fully displayed.

---

## 11. Quick Navigation

Minimal link row. Visually subtle — not a dominant section.

Links:
- View Full Roadmap
- Portfolio Hub
- Resume Builder
- Analyze Job Opportunity

No icons required. No large buttons. This section should not compete with the Mission Card for visual attention.

### 11.1 Opportunity Analyzer Prompt (Contextual)

For learners with `primary_goal = job` or `primary_goal = freelance`, show a small contextual card directly above the Quick Navigation row — not inside it.

**Content:**
- Title: "See how ready you are for a real job"
- Subtext: "Paste a job description and we'll show you exactly which skills you have and which you still need."
- CTA: `Analyze a Job Posting` → Opportunity Analyzer

**Rules:**
- Only shown when `primary_goal` is `job` or `freelance`.
- Not shown for `startup` or `exploring` — it would be irrelevant noise.
- Visually understated — smaller than the Mission Card, no competing primary button styling.
- If the learner has already run at least one analysis (`opportunity_analyses` count > 0), change the subtext to: "You've analyzed {count} job posting(s). Run another to track how your skills have grown."

---

## 12. Recent Activity (Optional)

Show the last 3–5 actions the learner has taken.

**Sources:**

| Activity                  | Source field                          |
|---------------------------|---------------------------------------|
| Completed a topic         | `user_progress.completed_at`          |
| Completed a project       | `user_projects.completed_at`          |
| Updated resume            | `resumes.last_updated_at`             |
| Saved a job analysis      | `opportunity_analyses.created_at`     |

**Fallback for new users (all timestamps null):**
- Do not show the section at all.
- No empty state message. Simply omit the section until there is real activity to show.

---

## 13. Edge Cases & Redirects

| Condition                                      | Behavior                                                                  |
|------------------------------------------------|---------------------------------------------------------------------------|
| `learners.onboarding_completed = false`        | Redirect to onboarding wizard before showing dashboard                    |
| `learners.current_path_id = NULL`              | Redirect to path selection screen                                         |
| Assigned path has `is_active = false`          | Show banner: "This path is no longer available. Choose a new one." + CTA  |
| Path exists but has no stages or topics        | Show error state: "Content is being updated. Check back soon."            |
| Brand new user (0 topics started)              | Show Onboarding Banner (Section 5), hide Recent Activity                  |
| All `user_progress` rows are `not_started`     | `next_topic_id` = first topic in path. Mission = `continue_learning`.     |

---

## 14. API Contract

Single aggregated endpoint:

```
GET /api/dashboard/summary
```

Response shape:

```json
{
  "learner": {
    "first_name": "string",
    "primary_goal": "job | freelance | startup | exploring",
    "ai_language_pref": "arabic | english | mix",
    "ai_detail_level": "short | balanced | detailed",
    "learning_velocity": "slow | normal | fast",
    "weekly_hours_category": "0-3 | 4-7 | 8-12 | 13+"
  },
  "path": {
    "path_id": "frontend | fullstack | cybersecurity | datascience",
    "path_display_name": "string",
    "completion_percent": 0
  },
  "stage": {
    "current_stage_id": "uuid",
    "current_stage_title": "string",
    "stage_completion_percent": 0,
    "stage_completed_topics": 0,
    "stage_total_topics": 0
  },
  "topics": {
    "completed_topics": 0,
    "total_mandatory_topics": 0,
    "next_topic_id": "uuid",
    "next_topic_title": "string",
    "next_topic_estimated_time_min": null
  },
  "mission": {
    "type": "continue_learning | finish_stage | get_back_on_track | start_first_project | start_available_project | choose_new_path | complete_onboarding",
    "title": "string",
    "description": "string",
    "cta_label": "string",
    "cta_target": "string"
  },
  "readiness": {
    "unlocked_skills_count": 0,
    "completed_projects_count": 0,
    "available_projects_count": 0,
    "resume_status": "not_created | in_progress | ready",
    "ats_score": null,
    "portfolio_has_public_items": false,
    "portfolio_slug": "string"
  },
  "pace": {
    "streak_days": 0,
    "sessions_this_week": 0,
    "target_sessions_per_week": 0,
    "pace_status": "ahead | on_track | slightly_behind | behind"
  },
  "opportunity_analyzer": {
    "show_prompt": false,
    "analyses_count": 0
  },
  "onboarding_banner": {
    "show": false,
    "match_score": 0,
    "match_reasons": [],
    "first_milestone_project_title": "string"
  },
  "ai_tip": null
}
```

**Rules:**
- `ai_tip` is always the last field populated. It must never delay the rest of the response.
- Frontend renders the dashboard from all other fields immediately. `ai_tip` is appended asynchronously.
- `opportunity_analyzer.show_prompt` is `true` only when `primary_goal` is `job` or `freelance`.
- `readiness.available_projects_count` drives the `start_available_project` mission type check.
- If `mission.type = complete_onboarding` or `learners.current_path_id = NULL`, the frontend redirects immediately and does not render the dashboard.

---

## 15. What Makes This Dashboard Strong

- **Single dominant action** — the Mission Card removes all ambiguity about what to do next.
- **Fully behavior-driven** — every section responds to real learner state, not placeholder data.
- **New users and returning users see an appropriately different experience.**
- **AI enhances but never blocks** — the page is fully functional without the AI tip.
- **Goal-aware throughout** — the AI micro-coach and the Opportunity Analyzer prompt both adapt to `primary_goal`. A job seeker and someone exploring see a meaningfully different experience.
- **Portfolio visibility is a first-class signal** — the fourth readiness tile surfaces portfolio public status, closing the gap between "has skills" and "is actually visible to employers."
- **Available projects are no longer invisible** — the `start_available_project` mission type ensures roadmap projects that are ready to build don't silently go unnoticed.
- **Pace logic is honest** — four distinct pace states (`ahead / on_track / slightly_behind / behind`) give the learner accurate, non-alarming feedback.
- **Consistent with all module contracts** — all path IDs, goal labels, ENUM values, and velocity definitions match exactly what is defined in the onboarding, roadmap, portfolio, and database specs.
