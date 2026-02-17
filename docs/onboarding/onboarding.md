# Mallah – Smart Onboarding

## 1. Overview

The Smart Onboarding module is a guided multi-step wizard that collects key learner information
and assigns a recommended career path (track) and roadmap (paths → stages → topics). It runs
once on first login (or until completed), then stores the selected path and preferences in the
Learner profile.

## 2. Goals

- Understand who the learner is (background, current level, time, and goal).
- Capture high-level interests to recommend a suitable path.
- Persist AI and learning preferences for later AI-powered features.
- Assign `current_path_id` and mark `onboarding_completed = true`.

## 3. Actors

- **Learner** (primary actor)
- **Backend API**
- **Database** (Users & Learners, Learning Content)
- **(Optional) AI Engine** – may be used later to refine logic, but v1 is rules-based.

## 4. Main Flow (UX)

1. **Entry**
   - Trigger: After successful login, if `onboarding_completed = false`.
   - Redirect to `/onboarding` wizard (cannot skip; only “Back” within steps).

2. **Step 1 – Basic Info (from Register + completion)**
   - Already have email & password from registration.
   - Display and allow editing:
     - First name
     - Last name
   - Action: `Save & Continue` → update Learner row.

3. **Step 2 – Background & Current Situation**
   - Single-choice cards:
     - `Student`
     - `Fresh Graduate`
     - `Career Shifter`
     - `No Tech Background`
   - Store as `background_type`.
   - Action: `Next`.

4. **Step 3 – Learning Commitment & Style**
   - Question: “How many hours per week can you study seriously?”
     - Options: `0–3`, `4–7`, `8–12`, `13+` → store as `weekly_learning_hours` (category).
   - Question: “How do you prefer to learn?”
     - `Video`, `Reading`, `Hands-on / Projects` → store as `learning_style_primary`.
   - Action: `Next`.

5. **Step 4 – Tech Interests (lightweight)**
   - 3–5 simple questions with single-choice answers, e.g.:
     - “Do you enjoy building things people use visually on the web?” → Frontend score +1.
     - “Are you more excited about protecting systems and understanding attacks?” → Cybersecurity score +1.
     - “Do you like working with numbers / patterns / data?” → Data / AI score +1.
   - Internal scoring:
     - Build a score vector like `{frontend, cybersecurity, data, backend, ...}`.
   - Action: `Next`.

6. **Step 5 – Career Goal**
   - Cards:
     - `Full-time Job`
     - `Freelance`
     - `Own Project / Startup`
   - Store as `primary_goal`.
   - Action: `Next`.

7. **Step 6 – AI & Language Preferences**
   - “Preferred AI assistant language?”
     - `Arabic`, `English`, `Mix` → `ai_language_pref`.
   - “How do you prefer AI answers?”
     - `Short`, `Balanced`, `Detailed` → `ai_detail_level`.
   - Action: `Next`.

8. **Step 7 – Path Recommendation Screen**
   - Backend computes `recommended_path`:
     - Use interest scores + simple rules (e.g., if cybersecurity highest and active → `current_path_id = cybersecurity`).
     - If top-scored path is inactive, fallback to closest active path (e.g., Data path if Cyber not ready).
   - UI shows:
     - Recommended path name (e.g. “Frontend Development”).
     - 2–3 bullet points (what you will learn, typical role).
   - Controls:
     - `Accept Recommendation` → save `current_path_id` and mark `onboarding_completed = true`.
     - `Choose Another Path` → allow manual selection from list of active paths.

9. **Finish**
   - After accepting a path, redirect to **Dashboard**.
   - Dashboard uses `current_path_id` and learner data to initialize progress.

## 5. Functional Requirements

- Validate required fields in each step before allowing “Next”.
- Persist partial answers on each step (don’t lose data on refresh).
- Only allow one active `current_path_id` per learner.
- On re-login:
  - If `onboarding_completed = true` → go directly to Dashboard.
  - If `false` → resume from last completed onboarding step.

## 6. Data Integration

- **Entities used**
  - `User` (auth)
  - `Learner`
    - `first_name`, `last_name`
    - `background_type`
    - `primary_goal`
    - `onboarding_completed`
    - `current_path_id`
    - `ai_language_pref`
    - `ai_detail_level`
    - `weekly_learning_hours`
    - `learning_style_primary`
  - `Path` (for recommendation & manual selection)

- **Main writes**
  - Create `Learner` row after registration.
  - Update learner attributes per step.
  - Set `current_path_id` and `onboarding_completed = true` on final acceptance.

## 7. UI Notes

- Use big tappable cards for answers (mobile-friendly, but web-first).
- Show step indicators (e.g., “Step 2 of 7”).
- Keep language simple and beginner-friendly.
- Avoid any AI text generation at this stage to keep it predictable.
