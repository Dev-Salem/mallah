# Mallah – Learner Dashboard

## 1. Overview

The Dashboard is the central hub the learner sees after login and completing onboarding. It
summarizes current path, progress, skills, projects, resume status, and provides shortcuts to
key tools (Roadmap, Skills & Projects, Resume Builder, Opportunity Analyzer).

## 2. Goals

- Give a clear “where am I now?” snapshot.
- Provide a single “Resume Learning” entry point to the next topic.
- Surface quick stats related to skills, projects, and job readiness.
- Offer lightweight AI guidance (optional) without overwhelming the learner.

## 3. Actors

- **Learner**
- **Frontend UI**
- **Backend API**
- **Database** (Users, Learners, Progress, Skills, Projects, Resumes)
- **AI Engine** (for optional tip of the day)

## 4. Main Sections (UI Layout)

1. **Header / Greeting**
   - “Welcome back, {FirstName}”
   - Sub-line: “Path: {PathName} – Current Stage: {StageName}”

2. **Global Progress Card**
   - Overall progress bar:
     - `% = completed_topics / total_topics_in_path * 100`.
   - Text: “You’ve completed X of Y lessons in this path.”

3. **Next Step / Resume Learning Card**
   - Logic:
     - Fetch first topic in current path where `status != Completed`.
   - UI:
     - Topic title + stage name.
     - `Resume Learning` button → opens Topic Viewer on that topic.

4. **Quick Stats Row**
   - `Skills Unlocked`: count of skills in `UserSkill` with any level.
   - `Projects Completed`: count of completed `UserProject`.
   - `Resume Readiness`: simple indicator:
     - e.g. `Not Created`, `In Progress`, `Ready`.
     - Optionally show `ats_score` if available.

5. **AI Insight / Tip Panel (Optional)**
   - Small card titled “Today’s Hint”:
     - Example outputs:
       - “You’re one lesson away from finishing Stage 1, consider completing {TopicName} today.”
       - “You have 0 projects yet. Try starting a small project from your path.”
   - Backend can decide simple rules first; AI can rephrase text later.

6. **Quick Actions Section**
   - Buttons:
     - `View Roadmap`
     - `Open Skills & Projects Hub`
     - `Open Resume Builder`
     - `Analyze Job Opportunity`
   - Each button routes to the corresponding module.

7. **Recent Activity (Optional v1 or v2)**
   - List last 3–5 recent actions:
     - Completed topics.
     - Completed projects.
     - Last job analysis.

## 5. Functional Requirements

- Dashboard should load in one backend call aggregating:
  - User profile (name, current_path_id).
  - Path & stage info.
  - Progress summary for current path.
  - Skills & projects counts.
  - Resume status / ATS score (if any).
- If learner has no path (`current_path_id` null) → redirect to onboarding.
- “Resume Learning” must be disabled if all topics are completed (show “Path Completed” state).
- AI tip:
  - If AI not available, fall back to rule-based text or hide tip card.

## 6. Data Integration

- **Reads**
  - `Learner`:
    - `first_name`, `current_path_id`, `primary_goal`.
  - `Path`, `Stage`, `Topic`:
    - To compute progress and find next topic.
  - `UserProgress`:
    - Counts of completed topics.
  - `UserSkill`:
    - Count of skills per learner.
  - `UserProject`:
    - Count of completed projects.
  - `Resume`:
    - If exists, latest `ats_score` and status.

- **AI Integration (optional)**
  - Input:
    - Small summary: `{name, path_name, completion_percent, skills_count, projects_count}`.
  - Output:
    - 1–2 sentences of encouragement/tip.
  - Display only after dashboard core data is ready.

## 7. UX Notes

- Keep the dashboard visually simple: 3–4 main cards max on first screen.
- Make `Resume Learning` visually dominant (primary CTA).
- All numbers should be clearly labeled (e.g., “Skills Unlocked” not just “12”).
- Avoid overcrowding with charts in v1; simple cards and bars are enough.
