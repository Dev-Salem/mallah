# Mallah – Smart Onboarding v3 (Mandatory OpenAI Recommendation)

## 1. Overview

Smart Onboarding v3 is a guided multi-step wizard that runs once after user registration.

The AI recommendation is mandatory.

Onboarding is considered complete only when:
1. All onboarding responses are stored.
2. A valid OpenAI-generated recommendation is stored in the database.

If OpenAI is temporarily unavailable, onboarding enters a `pending_ai` state and the system must retry automatically. The learner may continue with manual path selection, but AI recommendation generation remains required at the system level.

Purpose:
- Collect structured learner signals.
- Build deterministic feature vectors.
- Call OpenAI for path recommendation.
- Return recommendation with explanation.
- Generate a 2-week starter plan.
- Initialize roadmap safely.
- Persist all AI outputs for auditability.

---

## 2. Actors

- Learner
- Frontend Wizard
- Backend API
- Database
- OpenAI API (mandatory recommendation engine)

---

## 3. Allowed Paths (Closed Set)

The AI must select one of the following:

| Path ID         | Path Name                       |
|-----------------|---------------------------------|
| `frontend`      | Frontend Development            |
| `fullstack`     | Full-Stack Web Development      |
| `cybersecurity` | Cybersecurity & Ethical Hacking |
| `datascience`   | Data Science & Machine Learning |

The model is not allowed to invent new paths.

---

## 4. Onboarding Questions (High-Signal Set)

All questions are structured (no free-text).

### Step 1 – Background
Where are you starting from?
- Student
- Fresh Graduate
- Career Shifter
- No Tech Background

Stored:
- `background_type`

---

### Step 2 – Primary Goal
What do you want first?
- Get a full-time job
- Freelance
- Build my own product
- Just exploring

Stored:
- `primary_goal`

---

### Step 3 – Weekly Commitment
How many hours per week can you realistically commit?
- 0–3
- 4–7
- 8–12
- 13+

Derived:
- `learning_velocity`

Stored:
- `weekly_hours_category`
- `learning_velocity`

---

### Step 4 – Interest Signals (Scaled Responses)

Rate each statement:
Strongly Disagree → Strongly Agree

1. I enjoy building things people interact with (UI/screens).
2. I enjoy building backend logic and system architecture.
3. I enjoy finding weaknesses and protecting systems.
4. I enjoy working with data, numbers, and patterns.
5. I enjoy debugging and optimizing systems.
6. I enjoy experimenting and testing hypotheses.

Derived:
- `interest_vector` (normalized)

Stored:
- `interest_vector`

---

### Step 5 – Preference Discriminator

Pick the closest statement:

A)
- I want to ship visual features quickly.
- I want to build complete products end-to-end.
- I want to secure and investigate systems.
- I want to analyze data and build predictive models.

B)
- I prefer clear step-by-step tasks.
- I can handle moderate ambiguity.
- I enjoy open-ended problems.

C)
Math comfort:
- Low
- Medium
- High

Derived:
- `workstyle_vector`

Stored:
- `workstyle_vector`

---

### Step 6 – Readiness Snapshot

Rate:
Never / Tried / Comfortable

- Git / version control
- Command line basics
- Writing small programs
- Understanding APIs
- Basic database usage
- Basic web fundamentals

Derived:
- `readiness_level`
- `confidence_snapshot`

Stored:
- `confidence_snapshot`
- `readiness_level`

---

### Step 7 – AI Preferences

Preferred language:
- Arabic
- English
- Mix

Preferred explanation style:
- Short
- Balanced
- Detailed

Stored:
- `ai_language_pref`
- `ai_detail_level`

---

## 5. Deterministic Pre-AI Scoring

Backend computes weighted scores for each path before calling OpenAI:

Inputs:
- `interest_vector`
- `workstyle_vector`
- `readiness_level`
- `weekly_hours_category`
- `primary_goal`

Output:
- `path_scorecard`
  - frontend
  - fullstack
  - cybersecurity
  - datascience
- `top_signals` (top 3 strongest indicators)

This prevents random AI decisions.

---

## 6. Mandatory OpenAI Call

### 6.1 Technical Requirements

- Must use OpenAI Responses API.
- Must use structured JSON schema.
- Strict output enforcement.
- Temperature low for stability.

### 6.2 Input Payload

Backend sends:

- background_type
- primary_goal
- weekly_hours_category
- learning_velocity
- interest_vector
- workstyle_vector
- readiness_level
- confidence_snapshot
- path_scorecard
- allowed_paths (enum list)
- ai_language_pref
- ai_detail_level

---

### 6.3 Required Output Schema

AI must return:

- `recommended_path_id` (enum)
- `confidence_score` (0–100)
- `explanation`
  - `summary`
  - `top_3_reasons` (array)
  - `what_this_path_looks_like`
- `alternatives` (0–2)
  - `path_id`
  - `why_it_was_close`
- `starter_plan_2_weeks` (array of actions)
- `first_milestone`
  - `title`
  - `success_criteria` (array)
- `risk_flags` (optional)
- `next_step_choice`
  - recommended
  - ask_one_more_question
  - manual_pick_suggested
- `followup_question` (if needed)

No additional fields allowed.

---

## 7. Recommendation Screen

Display:
- Recommended path
- Confidence score
- Explanation summary
- Top 3 reasons
- 2-week starter plan
- First milestone
- Alternatives (if any)

User actions:
- Accept recommendation
- Manually choose another path
- Answer follow-up question (if provided)

---

## 8. AI Status Enforcement

Add to `onboarding_responses`:

- `ai_status` ENUM:
  - not_started
  - pending
  - success
  - failed
- `ai_attempt_count`
- `ai_last_attempt_at`

Onboarding completion condition:

- `onboarding_responses.completed_at` exists
- AND `ai_recommendations` row exists
- AND `ai_status = success`

If OpenAI fails:
- Set `ai_status = pending`
- Allow manual selection
- Retry in background
- Notify user when recommendation becomes available

---

## 9. Data Model Updates

### onboarding_responses

| Field                | Type |
|----------------------|------|
| id                   | UUID |
| user_id              | UUID |
| background_type      | ENUM |
| primary_goal         | ENUM |
| weekly_hours_category| ENUM |
| learning_velocity    | ENUM |
| interest_vector      | JSONB |
| workstyle_vector     | JSONB |
| confidence_snapshot  | JSONB |
| readiness_level      | INT |
| ai_language_pref     | ENUM |
| ai_detail_level      | ENUM |
| ai_status            | ENUM |
| ai_attempt_count     | INT |
| ai_last_attempt_at   | TIMESTAMP |
| completed_at         | TIMESTAMP |

### ai_recommendations

| Field                | Type |
|----------------------|------|
| id                   | UUID |
| user_id              | UUID |
| onboarding_id        | UUID |
| recommended_path_id  | VARCHAR |
| confidence_score     | INT |
| explanation          | JSONB |
| alternatives         | JSONB |
| starter_plan_2_weeks | JSONB |
| first_milestone      | JSONB |
| risk_flags           | JSONB |
| accepted_path_id     | VARCHAR |
| created_at           | TIMESTAMP |

---

## 10. Learning Velocity Logic

| Weekly Hours | Velocity |
|--------------|----------|
| 0–3          | slow     |
| 4–7          | normal   |
| 8–12         | fast     |
| 13+          | fast     |

Velocity affects:
- Starter plan density
- Roadmap pacing configuration

---

## 11. Error Handling

| Scenario                      | Behavior |
|------------------------------|----------|
| OpenAI timeout                | Set ai_status=pending, allow manual pick, retry |
| Invalid JSON                  | Retry once, then pending |
| User exits mid-flow           | Save step state |
| AI returns low confidence     | Show alternatives clearly |
| AI repeatedly fails           | Keep pending + background retries |

---

## 12. Integration Points

- Roadmap Initialization:
  - `POST /roadmap/init`
  - `{ user_id, path_id, learning_velocity }`

- AI Preferences:
  - Saved immediately after onboarding.

- Dashboard:
  - Reads starter plan + milestone from `ai_recommendations`.
