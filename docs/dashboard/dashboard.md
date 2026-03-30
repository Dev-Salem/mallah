# Mallah – Learner Dashboard v3 (Mission-Based)

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

## 3. App Shell — Persistent Navigation (Sidebar)

The app shell wraps all learner-facing pages. It is not part of the dashboard content — it is always present across the entire learner experience: Dashboard, Roadmap, Portfolio Hub, Resume Builder, Opportunity Analyzer, and Profile Settings.

### 3.1 Sidebar Structure

**Position:** Fixed left sidebar. Always visible on desktop. Collapses to a bottom tab bar on mobile (see Section 3.4).

**Width:** ~240px expanded. Collapses to 64px icon-only rail if the learner toggles it.

**Layout (top to bottom):**

```
┌─────────────────────┐
│  [Mallah logo]      │  ← links to dashboard
├─────────────────────┤
│  ▸ Dashboard        │  ← home icon
│  ▸ My Roadmap       │  ← map icon
│  ▸ Portfolio Hub    │  ← layers icon
│  ▸ Resume Builder   │  ← document icon
│  ▸ Opportunity      │  ← briefcase icon
│    Analyzer         │
├─────────────────────┤
│  [Path badge]       │  ← e.g. "Frontend Dev · Stage 2"
│  [Progress ring]    │  ← circular path %, glanceable
├─────────────────────┤
│  ▸ Settings         │  ← gear icon
│  [Avatar + name]    │  ← links to profile settings
└─────────────────────┘
```

### 3.2 Nav Item Behavior

| Item | Icon | Active State | Indicator |
|---|---|---|---|
| Dashboard | Home | Filled icon + accent left border | None |
| My Roadmap | Map/Route | Filled icon + accent left border | None |
| Portfolio Hub | Layers/Grid | Filled icon + accent left border | None |
| Resume Builder | Document | Filled icon + accent left border | Amber dot if `resume_status = not_created` AND `unlocked_skills_count ≥ 5` |
| Opportunity Analyzer | Briefcase | Filled icon + accent left border | None |
| Settings | Gear | Filled icon + accent left border | None |

**Active state:** The currently active page shows a filled icon variant and a 2–3px left-side accent border. All inactive items show outline icon variants.

**Resume Builder dot:** A subtle amber dot appears on the Resume Builder nav item if `resume_status = not_created` AND `unlocked_skills_count ≥ 5`. This surfaces the "build your resume" signal passively without any alert. The dot disappears once `resume_status` moves to `in_progress`.

### 3.3 Path Mini-Status (Sidebar Footer Area)

Positioned above the Settings/Avatar row. Compact ambient context — not a primary UI element.

- **Path badge:** Short path name (e.g. "Frontend Dev") with a small path-color accent dot.
- **Progress ring:** A small circular progress indicator (24–32px) showing `path_completion_percent`. The percentage number sits in the center. No label needed.
- **Stage label:** "Stage {n} of {total}" in small muted text below the ring.

This gives the learner a persistent orientation anchor on every page of the platform without requiring them to open the Roadmap.

### 3.4 Mobile — Bottom Tab Bar

On mobile (< 768px), the sidebar collapses into a fixed bottom tab bar with 5 items:

| Tab | Icon | Label |
|---|---|---|
| Home | Home | Dashboard |
| Roadmap | Map | Roadmap |
| Portfolio | Layers | Portfolio |
| Resume | Document | Resume |
| More | Grid/Menu | Reveals Opportunity Analyzer + Settings in a bottom sheet |

The path mini-status is hidden on mobile — its information moves into the Dashboard greeting bar on smaller screens.

---

## 4. Dashboard Page Layout

### 4.1 Two-Column Structure

The dashboard uses a **two-column layout** on desktop. The left column (~60% width) carries the primary action flow. The right column (~40%) carries ambient status and support.

```
┌──────────────────────────────────────────────────────┐
│  GREETING & CONTEXT BAR                   [Status]   │  ← full width
├─────────────────────────────┬────────────────────────┤
│  New User Banner (cond.)    │                        │  ← left only
├─────────────────────────────┤  READINESS TILES       │
│  TODAY'S MISSION CARD       │  Skills / Projects /   │
│  (primary)                  │  Resume                │
│                             ├────────────────────────┤
│  AI MICRO-COACH             │  PACE & MOMENTUM       │
│  (directly below mission)   │  STRIP                 │
├─────────────────────────────┴────────────────────────┤
│  PROGRESS ZONE (Path + Stage + Forecast — one card)  │  ← full width
├──────────────────────────────────────────────────────┤
│  QUICK NAVIGATION                                    │  ← full width
├──────────────────────────────────────────────────────┤
│  RECENT ACTIVITY (optional)                          │  ← full width
└──────────────────────────────────────────────────────┘
```

**Section render order:**
1. Greeting & Context Bar
2. New User Onboarding Banner *(left column, new users only)*
3. Today's Mission Card *(left column, primary)*
4. AI Micro-Coach *(left column, directly below Mission Card)*
5. Readiness Tiles *(right column, top)*
6. Pace & Momentum Strip *(right column, below Readiness Tiles)*
7. Progress Zone *(full width)*
8. Quick Navigation *(full width)*
9. Recent Activity *(full width, optional)*

---

## 5. Greeting & Context Bar

**Display:**

> Welcome back, {first_name}

Subtext line:

> Path: {path_display_name} · Stage: {current_stage_title} · Goal: {primary_goal_label}

`primary_goal_label` maps from onboarding value:

| `primary_goal` (DB) | Display Label |
|---|---|
| `job` | Get a Full-Time Job |
| `freelance` | Freelance |
| `startup` | Build My Own Project |
| `exploring` | Exploring |

`path_display_name` maps from `path_id`:

| `path_id` | Display Name |
|---|---|
| `frontend` | Frontend Development |
| `fullstack` | Full-Stack Web Development |
| `cybersecurity` | Cybersecurity & Ethical Hacking |
| `datascience` | Data Science & Machine Learning |

**Status badge** (right side of greeting bar):

| Condition | Badge |
|---|---|
| On track based on velocity | `On Track` |
| Behind by more than one expected session | `Slightly Behind` |
| Path fully completed | `Path Completed` |
| Onboarding not finished | — (redirect, see Section 14) |

---

## 6. New User Onboarding Banner

**Shown when:** learner has completed onboarding but has 0 completed topics.

**Content:**
- Title: "Here's your personalized starter plan"
- The 2-week starter plan tasks from `ai_recommendations.plan_2_weeks` (rendered as a short checklist)
- First milestone project name from `ai_recommendations.first_milestone`
- CTA: `Start My First Lesson →` → navigates to first topic in roadmap

**Dismissal:** learner can dismiss manually, or it auto-hides once the first topic is marked `in_progress`.

**Do not show:** once any topic has been started or the learner has returned more than once.

**First session layout rule:** When this banner is active, the Pace & Momentum Strip and Recent Activity sections are hidden entirely — no empty states rendered. Right column shows only the Readiness Tiles at their zero-state. This prevents a brand new learner from seeing five sections of empty data simultaneously.

---

## 7. Today's Mission Card (Primary Section)

This is the largest, most prominent element on the page. Only **one mission** is shown at a time. The frontend renders entirely from the `mission` object returned by the API — it does not compute mission logic itself.

### 7.1 Mission Selection Logic (Strict Priority Order)

Evaluated server-side in this exact order:

| Priority | Condition | Mission Type |
|---|---|---|
| 1 | Onboarding not completed | `CompleteOnboarding` |
| 2 | Path fully completed (all mandatory topics done) | `ChooseNewPath` |
| 3 | 0 projects completed AND learner has passed Stage 1 | `StartFirstProject` |
| 4 | Inactive for ≥ 7 days (no `last_accessed_at` activity) | `GetBackOnTrack` |
| 5 | Current stage ≥ 80% complete | `FinishStage` |
| 6 | Default (none of the above) | `ContinueLearning` |

**Notes:**
- Priority 3 requires the learner to have passed Stage 1 to avoid pushing projects too early.
- The inactivity threshold (7 days) must be configurable in the backend, not hardcoded in the frontend.
- `CompleteOnboarding` is only triggered if `learners.onboarding_completed = false`.

### 7.2 Mission Card Content Per Type

**`ContinueLearning`**
- Title: "Continue Your Learning"
- Description: "Next up: {next_topic_title} in {current_stage_title}"
- Estimated time: shown if `topics.estimated_time_min` is available
- Context line: "Stage {n} · {remaining_topics} topics remaining"
- CTA: `Continue` → Topic Viewer for `next_topic_id`

**`FinishStage`**
- Title: "Finish Stage {n} — You're Almost There"
- Description: "Complete {next_topic_title} to unlock {next_stage_title}."
- Context line: "{remaining_topics} topic(s) left in this stage"
- CTA: `Complete the Stage` → Topic Viewer for `next_topic_id`

**`GetBackOnTrack`**
- Title: "Ready to Pick Up Where You Left Off?"
- Description: "You were working on {next_topic_title}. It only takes {estimated_time_min} minutes."
- Context line: "Last active: {days_since_last_active} days ago"
- CTA: `Resume Learning` → Topic Viewer for `next_topic_id`

**`StartFirstProject`**
- Title: "Time to Build Something Real"
- Description: "You've learned the theory. Projects are what make your skills visible to employers and clients."
- Context line: null
- CTA: `Start Your First Project` → Portfolio Hub

**`ChooseNewPath`**
- Title: "You've Completed Your Path — What's Next?"
- Description: "Explore a new path to keep growing."
- Context line: null
- CTA: `Explore Paths` → Roadmap / Path selection screen

**`CompleteOnboarding`**
- Title: "Let's Finish Setting Up Your Path"
- Description: "Answer a few quick questions to get your personalized learning roadmap."
- Context line: null
- CTA: `Complete Setup` → Onboarding wizard

### 7.3 Mission Card UI Rules

- Estimated time shown only when `topics.estimated_time_min` is not null.
- CTA button always present — no mission without an action.
- Card must be visually dominant: full left-column width, high contrast background distinct from the page background, unambiguous primary button.
- Context line (if not null) renders as small muted text below the CTA button. Real data only — never fabricated.

---

## 8. AI Micro-Coach

Positioned **directly below the Mission Card** in the left column — not at the bottom of the page. This placement is intentional: the AI tip is most useful when the learner is deciding whether to act on the mission.

Visually lighter than the Mission Card — no border, subtle background tint, smaller text.

**Rules:**
- Maximum 2 sentences.
- Must reference real data only (`next_topic_title`, `stage_completion_percent`, `completed_projects_count`, etc.).
- Never fabricate achievements or invent numbers.
- Respects `ai_language_pref` (Arabic / English / Mix) and `ai_detail_level` (Short / Balanced / Detailed).
- `ai_detail_level = Short` → 1 sentence max.
- `ai_detail_level = Detailed` → up to 3 sentences.

**Example:**
> "You're 1 lesson away from completing Stage 1. Finishing it unlocks your first portfolio project milestone."

**Fallback behavior:**
- If AI is unavailable → rule-based template with real metrics:
  > "Keep going — {remaining_topics_in_stage} topic(s) left in {current_stage_title}."
- If brand new user with no metrics → hide the section entirely. No placeholder text.

**Must never block page rendering.** Loads asynchronously after the rest of the dashboard is displayed.

---

## 9. Readiness Tiles (Right Column, Top)

Three tiles stacked vertically in the right column. Each has a **primary value** and a **context sub-label**. The number alone is not sufficient — context is required to make it meaningful.

### 9.1 Skills Tile

- **Label:** "Skills Unlocked"
- **Primary value:** `{unlocked_skills_count}`
- **Context sub-label:** "{roadmap_skills_count} from roadmap · {manual_skills_count} added manually"
- **Link:** → Portfolio Hub (Skills section)
- No warning state.

### 9.2 Projects Tile

- **Label:** "Projects Completed"
- **Primary value:** `{completed_projects_count}`
- **Context sub-label:** "{available_projects_count} available to start" (always shown)
- **Warning state:** If `completed_projects_count = 0` → subtle amber left border on the tile. Not alarming red.
- **Link:** → Portfolio Hub (Projects section)

### 9.3 Resume Tile

- **Label:** "Resume"
- **Primary value and sub-label (state-based):**

| State | Primary Value | Context Sub-label |
|---|---|---|
| `not_created` | "Not Started" | "Build yours to apply for jobs" |
| `in_progress` | "In Progress" | "Last updated: {N} days ago" |
| `ready` | "Ready" | "Looking good — keep it updated" |
| ATS score exists | "ATS: {score}/100" | Score color: green ≥ 75, amber 50–74, red < 50 |

**Multi-resume logic:** the learner may have more than one resume (general + one or more job-based). The tile always reflects the most favorable state across all resumes:
- `resume_status` = the highest status across all resumes (`ready` > `in_progress` > `not_created`)
- `ats_score` = the highest ATS score across all resumes
- `resume_last_updated_days_ago` = days since the most recently updated resume (`MIN` of `last_updated_at` across all `resumes` rows)

This means if the learner has a general resume at 74 and a job-based resume at 91, the tile shows "ATS: 91/100."

- **Link:** → Resume Builder (Cards Grid)

---

## 10. Pace & Momentum Strip (Right Column, Below Readiness Tiles)

Three visually distinct sub-components in a compact card. These are discrete visual elements — not a text string.

### 10.1 Streak Counter

- **Visual:** Flame icon (large, prominent) with the streak number beside it in large type.
- **Label below:** "day streak"
- **Zero state:** Grey/dim flame icon + "Start your streak today" in muted text. Never show "0 day streak."

### 10.2 Weekly Sessions Tracker

- **Visual:** A row of 7 small dot or pill indicators, one per day Mon–Sun. Filled/colored if a session occurred that day; empty/grey if not.
- **Label above the dots:** "This week"
- **Sub-label below:** "{sessions_done} of {target_sessions} sessions"
- **Zero state:** All 7 dots empty. Sub-label still shows the target: "0 of {target_sessions} sessions."

### 10.3 Pace Badge

A color-coded pill badge:

| `pace_status` | Color | Label |
|---|---|---|
| `Ahead` | Green | "Ahead of pace" |
| `On Track` | Blue/Teal | "On track" |
| `Behind` | Amber | "Behind pace" |

**`target_sessions` derivation:**

| `weekly_hours_category` | `target_sessions` |
|---|---|
| `0-3` | 2 |
| `4-7` | 3 |
| `8-12` | 5 |
| `13+` | 7 |

**Pace logic:**

| Condition | Status |
|---|---|
| Actual > target | `Ahead` |
| Actual ≥ target | `On Track` |
| Actual = target − 1 | `Behind` |
| Actual < target − 1 | `Behind` |

---

## 11. Progress Zone (Full Width)

A single full-width card below both columns. Path progress, stage progress, and forecast are unified here — not three separate sections.

### 11.1 Path Progress Bar

- **Label:** "Path Progress"
- **Bar:** `path_completion_percent`, left to right.
- **Right-aligned:** "{completed_topics} of {total_mandatory_topics} lessons"

### 11.2 Stage Progress Bar

Nested inside the same card, below the path bar. Visually subordinate — lighter bar weight, smaller label.

- **Label:** "{current_stage_title}"
- **Bar:** `stage_completion_percent`
- **Right-aligned:** "{stage_completed_topics} of {stage_total_topics} topics done"

### 11.3 Forecast Line

Derived from `learning_velocity`:

| `learning_velocity` | Assumed hrs/week | Topics/week |
|---|---|---|
| `slow` | ~2 hrs | ~1–2 |
| `normal` | ~5.5 hrs | ~3–4 |
| `fast` | ~10+ hrs | ~5–7 |

Displayed as right-aligned muted text below the stage bar:
> "At your current pace, you'll finish this stage in ~{estimated_days} days."

`estimated_days` = remaining mandatory topics in stage ÷ topics_per_week × 7

**Fallback:** Hide entirely if `learning_velocity` is null or remaining topics = 0. Never show a zero or fabricated estimate.

---

## 12. Quick Navigation (Full Width)

Compact icon + label link row below the Progress Zone. Visually subtle — must not compete with the Mission Card.

| Link | Icon (16px) | Indicator |
|---|---|---|
| View Full Roadmap | Map/Route | None |
| Portfolio Hub | Layers/Grid | None |
| Resume Builder | Document | Amber dot if `resume_status = not_created` AND `unlocked_skills_count ≥ 5` |
| Opportunity Analyzer | Briefcase | None |

**Icons are required.** Use the same icon set as the sidebar. The 16px icons allow the row to be scanned instantly without reading all four labels.

**Layout:** Single horizontal row on desktop. 2×2 grid on mobile.

---

## 13. Recent Activity (Full Width, Optional)

Last 3–5 learner actions.

| Activity | Source |
|---|---|
| Completed a topic | `user_progress.completed_at` |
| Completed a project | `user_projects.completed_at` |
| Updated resume | Most recent `resumes.last_updated_at` across all of the learner's resumes |
| Saved a job analysis | `opportunity_analyses.created_at` |

**Fallback:** Do not show the section — no empty state, no placeholder — if all timestamps are null or if the Onboarding Banner is active (first session).

---

## 14. Edge Cases & Redirects

| Condition | Behavior |
|---|---|
| `learners.onboarding_completed = false` | Redirect to onboarding wizard |
| `learners.current_path_id = NULL` | Redirect to path selection screen |
| Assigned path `is_active = 0` | Show banner: "This path is no longer available. Choose a new one." + CTA |
| Path has no stages or topics | Error state: "Content is being updated. Check back soon." |
| Brand new user (0 topics started) | Show Onboarding Banner, hide Pace Strip and Recent Activity, show zero-state tiles |
| All `user_progress` rows are `not_started` | `next_topic_id` = first topic in path. Mission = `ContinueLearning`. |

---

## 15. API Contract

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
    "type": "ContinueLearning | FinishStage | GetBackOnTrack | StartFirstProject | ChooseNewPath | CompleteOnboarding",
    "title": "string",
    "description": "string",
    "cta_label": "string",
    "cta_target": "string",
    "context_line": "string | null"
  },
  "readiness": {
    "unlocked_skills_count": 0,
    "roadmap_skills_count": 0,
    "manual_skills_count": 0,
    "completed_projects_count": 0,
    "available_projects_count": 0,
    "resume_status": "not_created | in_progress | ready",
    "resume_last_updated_days_ago": null,
    "ats_score": null
  },
  "pace": {
    "streak_days": 0,
    "sessions_this_week": 0,
    "target_sessions_per_week": 0,
    "pace_status": "On Track | Behind | Ahead",
    "active_days_this_week": []
  },
  "onboarding_banner": {
    "show": false,
    "plan_2_weeks": [],
    "first_milestone": "string"
  },
  "ai_tip": null
}
```

**New fields vs v2:**
- `mission.context_line` — secondary context line below the CTA (e.g. "Stage 2 · 4 topics remaining"). Null if not applicable.
- `readiness.roadmap_skills_count` — skills earned via roadmap. Feeds Skills tile sub-label.
- `readiness.manual_skills_count` — skills added manually. Feeds Skills tile sub-label.
- `readiness.available_projects_count` — projects with `user_projects.status = 'available'`. Feeds Projects tile sub-label.
- `readiness.resume_last_updated_days_ago` — integer days since the most recently updated resume across all of the learner's `resumes` rows. Feeds Resume tile sub-label.
- `pace.active_days_this_week` — array of day indices (0 = Monday … 6 = Sunday) where a `user_progress.last_accessed_at` update occurred this calendar week. Feeds the weekly dots visual.

**Resume readiness aggregation:** `resume_status` and `ats_score` in the readiness object reflect the most favorable values across all the learner's resumes (general + job-based). The backend queries all `resumes` rows for this `user_id` and returns the highest `status` and highest `ats_score`. This means a high-scoring job-based resume surfaces on the Dashboard tile even if the general resume has a lower score.

**Rules:**
- `ai_tip` is always last — must never delay the rest of the response.
- Frontend renders all other fields immediately. `ai_tip` appended asynchronously.
- If `mission.type = CompleteOnboarding` or `current_path_id = NULL` → redirect immediately, do not render dashboard.

---

## 16. What Makes This Dashboard Strong

- **Single dominant action** — Mission Card removes all ambiguity about what to do next.
- **Two-column layout** — left column = action flow, right column = ambient status. Natural F-pattern scan.
- **Persistent sidebar** — learner always knows where they are. Path mini-status in the sidebar footer provides orientation on every page of the platform without opening the Roadmap.
- **Pace Strip as visual components** — streak counter, weekly activity dots, and pace badge are distinct visual elements with real psychological weight. Not a text string with an emoji.
- **Readiness Tiles with context sub-labels** — every number has a second line of meaning. "7 skills" is meaningless; "7 skills — 5 from roadmap · 2 added manually" tells a story.
- **AI Micro-Coach adjacent to Mission** — positioned where it is actually useful, not buried at the bottom.
- **First session layout variant** — brand new users see a focused view, not five sections of zeros.
- **Fully behavior-driven** — every section responds to real learner state.
- **Consistent across all module specs** — all path IDs, goal labels, velocity values, and navigation entry points match Auth, Onboarding, Roadmap, Portfolio Hub, Resume Builder, and Opportunity Analyzer.
- **Designed to scale** — additional mission types or tiles can be added without restructuring.
