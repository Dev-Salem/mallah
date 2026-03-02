# Mallah – Smart Onboarding v2 (AI-Driven)

## 1. Overview

Smart Onboarding v2 is a guided, AI-powered multi-step wizard that runs once after user
registration.

Its purpose is to:
- Understand the learner's background, goals, time commitment, interests, and confidence level.
- Use AI to recommend the most fitting path and explain why.
- Configure the learner's roadmap starting point and learning velocity.
- Store a structured onboarding snapshot in the database.
- Allow editing later via Profile & Settings without corrupting roadmap progress.

Onboarding must be:
- Beginner-friendly (even for non-tech users)
- Fast (3–5 minutes max)
- Structured and deterministic
- Fully integrated with roadmap initialization

---

## 2. Goals

- Deliver an AI-generated path recommendation with a clear match score.
- Explain in plain language why this path fits this specific learner.
- Show consistent, pre-defined path content on the recommendation screen.
- Initialize learner configuration cleanly.
- Persist onboarding responses and AI output.
- Support safe edits later.

---

## 3. Actors

- **Learner**
- **Frontend Wizard**
- **Backend API**
- **Database**
- **OpenAI API (AI Recommender Engine)**

---

## 4. Onboarding Flow (UX)

### Step 0 – Introduction

Short intro screen.

Message:
> Answer 6 quick questions → get your best path + see exactly what you'll build.

Button:
- `Start`

---

### Step 1 – Identity

**Question:**
Where are you starting from?

Options:
- Student
- Fresh Graduate
- Career Shifter
- No Tech Background

Stored as:
- `background_type`

---

### Step 2 – Career Goal

**Question:**
What do you want first?

Options:
- Get a full-time job
- Freelance
- Build my own project / startup
- Just exploring

Stored as:
- `primary_goal`

---

### Step 3 – Weekly Commitment

**Question:**
How many hours per week can you seriously commit?

Options:
- 0–3
- 4–7
- 8–12
- 13+

System computes:
- `learning_velocity` → slow / normal / fast

UI displays a live preview:
> At this pace, you could complete your first milestone project in approximately X weeks.

Stored as:
- `weekly_hours_category`
- `learning_velocity`

---

### Step 4 – Interest Signals (Scenario-Based)

Learner selects all statements they relate to.

Options:
- I enjoy building things people can see and use.
- I like solving puzzles and finding system weaknesses.
- I enjoy working with numbers, patterns, and data.
- I prefer building the logic and systems behind applications.

System builds internally:
- `interest_vector` (scored)

---

### Step 5 – Confidence Snapshot

Light skill self-check (non-intimidating).

Statements:
- I have used Git before.
- I understand what an API is.
- I wrote a small program before.
- I built any project (even a simple one).

Options per item:
- Never
- Tried
- Comfortable

System computes:
- `readiness_level` (0–3)

Stored as:
- `confidence_snapshot`

---

### Step 6 – AI & Language Preferences

Questions:

Preferred AI assistant language?
- Arabic
- English
- Mix

Preferred answer style?
- Short
- Balanced
- Detailed

Stored as:
- `ai_language_pref`
- `ai_detail_level`

---

### Step 7 – AI Recommendation

**What the backend sends to the AI:**
- `background_type`
- `primary_goal`
- `weekly_hours_category`
- `learning_velocity`
- `interest_vector`
- `confidence_snapshot`
- `readiness_level`
- The four available path IDs: `frontend`, `fullstack`, `cybersecurity`, `datascience`

**What the AI must return — strict JSON, nothing else:**

```json
{
  "recommended_path_id": "one of: frontend | fullstack | cybersecurity | datascience",
  "match_score": "integer 0–100",
  "reasons": [
    "reason tied to a specific answer the learner gave",
    "reason tied to a specific answer the learner gave",
    "reason tied to a specific answer the learner gave"
  ],
  "alternatives": [
    {
      "path_id": "one of the remaining three path IDs",
      "reason": "why this is a secondary fit based on the learner's answers"
    }
  ]
}
```

**What the AI is responsible for:**
- Picking the best `recommended_path_id` from the four options.
- Calculating the `match_score` based on how well the learner's answers align with the path.
- Writing 2–3 `reasons` that reference something specific from the learner's actual answers —
  not generic statements.
- Suggesting 1–2 `alternatives` with a reason for each.

**What the AI does NOT generate:**
- Path descriptions
- Required skills lists
- Milestone projects
- Career outcomes
- 2-week starter plans
- Anything not listed above

All path content is pre-defined (see Section 5). The recommendation screen pulls the
pre-defined content for the recommended path and displays it alongside the AI's
`match_score` and `reasons`.

---

## 5. Pre-Defined Path Content

All content below is fixed. It is stored in the database and shown as-is on the
recommendation screen and path selection screen. The AI has no role in generating or
changing any of this.

---

### 5.1 Frontend Development

**Path ID:** `frontend`

**One-line description:**
Build websites and web apps that real people use — from layout to interaction.

**What you'll learn to do:**
Design and build responsive, accessible interfaces using modern web technologies.
By the end of this path you'll be able to build complete, deployable web applications
and connect them to external APIs.

**Skills you'll gain:**
- HTML5 & Semantic Markup
- CSS3, Flexbox, Grid
- JavaScript (ES6+)
- TypeScript (basics)
- React
- Responsive Design
- Git & GitHub
- REST API consumption
- Web Performance & Accessibility basics

**Projects you'll build:**
1. Personal portfolio website
2. Movie or product search app connected to a public API
3. E-commerce product page with cart functionality

**Where this path leads:**
Junior Frontend Developer · UI Developer · Frontend Engineer · Freelance Web Developer

---

### 5.2 Full-Stack Web Development

**Path ID:** `fullstack`

**One-line description:**
Build complete web products — front to back — entirely on your own.

**What you'll learn to do:**
Design and build both the user-facing side and the server-side logic of web applications.
By the end of this path you'll be able to design, build, and deploy a full working product
from scratch without depending on anyone else.

**Skills you'll gain:**
- HTML, CSS, JavaScript (ES6+)
- React (frontend)
- Node.js & Express (backend)
- REST API design and implementation
- PostgreSQL or MongoDB
- Authentication & Authorization (JWT)
- Git & GitHub
- Basic cloud deployment
- Docker basics

**Projects you'll build:**
1. Blog REST API with full CRUD operations
2. Social app with user authentication and a live feed
3. Deployed SaaS-style dashboard with real data

**Where this path leads:**
Full-Stack Developer · Web Application Developer · Backend Developer ·
Freelance Product Developer · Startup Engineer

---

### 5.3 Cybersecurity & Ethical Hacking

**Path ID:** `cybersecurity`

**One-line description:**
Find vulnerabilities in systems before the bad actors do — legally and professionally.

**What you'll learn to do:**
Understand how systems are attacked, practice identifying weaknesses in controlled
environments, and build the skills needed to protect real infrastructure.
By the end of this path you'll be able to conduct basic penetration tests and participate
in real bug bounty programs.

**Skills you'll gain:**
- Networking fundamentals (TCP/IP, DNS, HTTP, firewalls)
- Linux command line
- Python or Bash scripting (basic automation)
- OWASP Top 10 web vulnerabilities
- Penetration testing methodology
- Tools: Nmap, Burp Suite, Metasploit, Wireshark, Kali Linux
- CTF (Capture The Flag) problem-solving
- Basic cryptography concepts

**Projects you'll build:**
1. Home hacking lab (virtual machines, Kali Linux, practice targets)
2. Web application vulnerability report on a practice target
3. First bug bounty or CTF submission on a public platform

**Where this path leads:**
Junior Penetration Tester · SOC Analyst · Security Analyst · Bug Bounty Hunter

---

### 5.4 Data Science & Machine Learning

**Path ID:** `datascience`

**One-line description:**
Turn raw data into decisions — and build AI-powered products.

**What you'll learn to do:**
Work with real datasets, build and evaluate machine learning models, and eventually
integrate AI APIs into working applications.
By the end of this path you'll be able to analyze data, train basic models, and build
simple AI-powered tools.

**Skills you'll gain:**
- Python (core language for the entire path)
- SQL (data querying and manipulation)
- pandas & NumPy (data handling)
- Matplotlib & Seaborn (visualization)
- Statistics & probability fundamentals
- Machine learning basics: regression, classification, clustering (scikit-learn)
- Model evaluation and validation
- Working with AI APIs (OpenAI, HuggingFace)
- Jupyter Notebooks

**Projects you'll build:**
1. Exploratory data analysis report on a real-world dataset
2. Spam classifier or sentiment analysis model
3. LLM-powered Q&A app built with an AI API

**Where this path leads:**
Data Analyst · Junior Data Scientist · ML Engineer (entry level) ·
AI Product Developer · Business Intelligence Analyst

---

## 6. Recommendation Screen (UX)

Displayed after the AI response is received and validated.

**Layout — what the screen shows:**

1. **Match score** — the AI's `match_score` displayed as a percentage with a label:

| Score   | Label           |
|---------|-----------------|
| 0–34%   | Weak match      |
| 35–54%  | Possible fit    |
| 55–74%  | Good match      |
| 75–89%  | Strong match    |
| 90–100% | Excellent match |

2. **Path name + one-line description** — pulled from pre-defined content.

3. **Why this fits you** — the AI's `reasons` array, shown as 2–3 bullet points.
   These are the only AI-generated strings shown on screen.

4. **What you'll learn to do** — pulled from pre-defined content.

5. **Skills you'll gain** — pulled from pre-defined content.

6. **Projects you'll build** — pulled from pre-defined content.

7. **Where this leads** — pulled from pre-defined content.

8. **Alternative paths** — the AI's `alternatives`, each showing the pre-defined
   path name + the AI's reason.

**Buttons:**
- `Start This Path` → accepts the recommendation, initializes roadmap
- `Choose a Different Path` → shows all 4 paths using pre-defined content only,
  learner picks manually

---

## 7. Data Model

### `onboarding_responses` table

| Field                   | Type      | Description                                     |
|-------------------------|-----------|-------------------------------------------------|
| `id`                    | UUID      | Primary key                                     |
| `user_id`               | UUID      | Foreign key → users                             |
| `background_type`       | ENUM      | student / fresh_grad / career_shifter / no_tech |
| `primary_goal`          | ENUM      | job / freelance / startup / exploring           |
| `weekly_hours_category` | ENUM      | 0-3 / 4-7 / 8-12 / 13+                         |
| `learning_velocity`     | ENUM      | slow / normal / fast                            |
| `interest_vector`       | JSONB     | Scored interest signals                         |
| `confidence_snapshot`   | JSONB     | Per-item self-assessment                        |
| `readiness_level`       | INT       | 0–3 computed score                              |
| `ai_language_pref`      | ENUM      | arabic / english / mix                          |
| `ai_detail_level`       | ENUM      | short / balanced / detailed                     |
| `completed_at`          | TIMESTAMP | When onboarding was finished                    |

### `ai_recommendations` table

| Field                  | Type      | Description                                          |
|------------------------|-----------|------------------------------------------------------|
| `id`                   | UUID      | Primary key                                          |
| `user_id`              | UUID      | Foreign key → users                                  |
| `onboarding_id`        | UUID      | Foreign key → onboarding_responses                   |
| `recommended_path_id`  | VARCHAR   | frontend / fullstack / cybersecurity / datascience   |
| `match_score`          | INT       | 0–100                                                |
| `reasons`              | JSONB     | Array of reason strings (AI-generated)               |
| `alternatives`         | JSONB     | Array of { path_id, reason }                         |
| `accepted_path_id`     | VARCHAR   | Path the learner actually chose (may differ from rec)|
| `created_at`           | TIMESTAMP |                                                      |

---

## 8. Learning Velocity Logic

| Weekly Hours | Computed Velocity |
|--------------|-------------------|
| 0–3          | slow              |
| 4–7          | normal            |
| 8–12         | fast              |
| 13+          | fast              |

Velocity affects:
- How roadmap phase pacing is configured at initialization
- Milestone spacing inside the learner's roadmap view
- The Dashboard's progress forecast calculation

---

## 9. Editing After Onboarding

Learners can update their onboarding answers from **Profile & Settings**.

Rules:
- `background_type`, `primary_goal`, `ai_language_pref`, `ai_detail_level` → editable
  freely, no side effects on roadmap.
- `weekly_hours_category` → editable, re-derives `learning_velocity` immediately,
  updates roadmap pacing going forward only. Does not affect completed stages.
- `interest_vector`, `confidence_snapshot` → editable, but do not trigger an automatic
  path re-recommendation.
- Changing active path → requires explicit confirmation modal. Progress on the old path
  is preserved. Cannot be self-changed from settings — requires admin action.

---

## 10. Error & Edge Case Handling

| Scenario                           | Behavior                                                              |
|------------------------------------|-----------------------------------------------------------------------|
| OpenAI API timeout or failure      | Show fallback: learner picks path manually from all 4 options         |
| AI returns invalid JSON            | Retry once. On second failure, fall back to manual selection          |
| AI returns an invalid `path_id`    | Treat as failure, fall back to manual selection                       |
| `match_score` outside 0–100        | Clamp to valid range, log the anomaly                                 |
| Learner exits mid-onboarding       | Save progress step-by-step, resume from last completed step on return |
| Learner tries to run onboarding again | Block, redirect to Profile & Settings                              |
| All interest signals unselected    | AI still runs, `match_score` will be lower, alternatives highlighted  |

---

## 11. Frontend States

| State            | Description                                                              |
|------------------|--------------------------------------------------------------------------|
| `idle`           | Intro screen shown, waiting for Start                                    |
| `in_progress`    | Wizard active, tracking current step                                     |
| `loading`        | AI recommendation being fetched                                          |
| `recommendation` | AI result received — screen shows AI output + pre-defined path content   |
| `completed`      | Path accepted, roadmap initialized, redirect to Dashboard                |
| `error`          | API failure, fallback manual path selection shown                        |

---

## 12. Integration Points

- **Roadmap Initialization** → On path acceptance, backend calls
  `POST /roadmap/init` with `{ user_id, path_id, learning_velocity }` to scaffold the
  learner's full roadmap.
- **AI Assistant Config** → `ai_language_pref` and `ai_detail_level` are written to the
  learner's profile immediately after onboarding completes. All AI features (Tutor,
  Analyzer, Resume Builder) read these values from day one.
- **Dashboard** → First load after onboarding shows the pre-defined projects and skills
  for the chosen path in the New User Banner.
