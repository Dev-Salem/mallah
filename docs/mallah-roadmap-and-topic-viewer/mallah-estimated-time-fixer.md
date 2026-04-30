# Mallah — Estimated Time Fixer
## Spec & Agent Prompt

---

## 1. The Problem

Every topic across all four Mallah learning paths has an `**Estimated Time:**` field. Currently, the vast majority of lesson topics are set to a flat `2 hrs` or `1.5 hrs` — a copy-paste default that does not reflect actual study time.

A topic like **"SQL Injection: Detection, Exploitation & Defence"** and **"How the Web Works"** cannot both be `2 hrs`. One is a 45-minute concept read. The other requires reading, watching a demo, then practicing in a vulnerable environment for 3–4 hours.

Inaccurate times break learner trust — they cause surprise, frustration, and poor planning. Accurate times help learners schedule their study sessions realistically.

**Scope:** 4 paths × ~47 topics average = ~192 lesson topics to correct.

---

## 2. Files to Edit

The agent must edit all four path curriculum files:

| File | Path ID | Topics |
|---|---|---|
| `mallah-path-frontend.md` | `frontend` | 45 topics |
| `mallah-path-fullstack.md` | `fullstack` | 49 topics |
| `mallah-path-datascience.md` | `datascience` | 49 topics |
| `mallah-path-cybersecurity.md` | `cybersecurity` | 48 topics |

Each topic block contains this field to update:

```
**Estimated Time:** 2 hrs
```

The agent must find every instance of `**Estimated Time:**` in each file and replace the value with a calibrated estimate based on the rules below.

---

## 3. Estimation Rules

### 3.1 Topic Types — Reference

Each topic has a type, visible in its header or derivable from its name:

| Type | Description |
|---|---|
| `concept` | Pure reading/theory, no hands-on exercise |
| `concept_practice` | Theory with a short reflection or written exercise |
| `lesson_practice` | Lesson content + a hands-on coding/tool exercise |
| `lesson_lab` | Lesson content + a full lab session (cybersecurity path only) |
| `project_milestone` | Stage-ending project. **Do not change.** |
| `project_capstone` | Path-graduation project. **Do not change.** |

### 3.2 Time Ranges by Type and Complexity

**Concept topics** — reading, no hands-on:
- Simple (definitions, frameworks, mental models): `1–1.5 hrs`
- Medium (multiple sub-concepts, diagrams to internalize): `1.5–2 hrs`

**Concept + practice topics** — reading + short written/reflection exercise:
- Simple: `1.5–2 hrs`
- Medium: `2–3 hrs`

**Lesson + practice topics** — watch/read + do the hands-on practical output:

| Complexity Level | Examples | Time |
|---|---|---|
| Foundational / beginner | How the Web Works, HTML basics, Git basics, Deployment intro | `1.5–2 hrs` |
| Standard intermediate | CSS layouts, React basics, SQL CRUD, Pandas basics | `3–4 hrs` |
| High complexity | TypeScript, Next.js App Router, JWT Auth, Async JS, ML algorithms, Scikit-learn, Docker | `4–5 hrs` |
| Very high complexity | Advanced TypeScript generics, WebSockets, Full-stack integration, Deep learning | `5–6 hrs` |

**Lesson + lab topics (cybersecurity only)** — study the concept, then work through the lab platform (TryHackMe / Hack The Box / DVWA). Lab time alone is often 1–2 hrs on top of reading:

| Complexity Level | Examples | Time |
|---|---|---|
| Foundational lab | Nmap basics, Wireshark intro, Burp Suite intro | `3–4 hrs` |
| Intermediate lab | Password cracking, Enumeration, OpenVAS scanning, XSS | `4–5 hrs` |
| Advanced lab | SQL Injection, Metasploit, Privilege Escalation, Active Directory, Post-Exploitation | `5–6 hrs` |

**Project milestones and capstones — DO NOT CHANGE.**

### 3.3 Format

All estimated times must use this format: `X hrs`, `X–Y hrs`, or `X min`.

Do not write: `~2 hours`, `about 3 hrs`, `2-3 hours`. Use en-dash for ranges: `3–4 hrs`.

---

## 4. Path-by-Path Guidance

### Frontend (`mallah-path-frontend.md`)

Topics needing the biggest corrections — currently all flat `2 hrs`:

- `Topic 1.1 — How the Web Works` → concept, foundational → `1 hr`
- `Topic 3.1 — JavaScript Basics` → lesson_practice, high complexity (first JS exposure) → `4–5 hrs`
- `Topic 3.6 — Async JavaScript: Promises & Fetch` → lesson_practice, high complexity → `4–5 hrs`
- `Topic 5.1 — Why React? Components & JSX` → lesson_practice, intermediate → `3–4 hrs`
- `Topic 5.2 — State & useState Hook` → lesson_practice, intermediate-high → `3–4 hrs`
- `Topic 5.3 — useEffect & Data Fetching` → lesson_practice, high → `4–5 hrs`
- `Topic 6.1 — TypeScript for React Developers` → lesson_practice, very high → `5–6 hrs`
- `Topic 6.2 — Next.js: Routing, SSR & the App Router` → lesson_practice, very high → `5–6 hrs`
- `Topic 7.4 — Testing Basics: Vitest & React Testing Library` → lesson_practice, high → `4–5 hrs`

---

### Full-Stack (`mallah-path-fullstack.md`)

- `Topic 1.4 — JavaScript Core: Variables, Functions, Arrays & Objects` → currently `3 hrs`, high complexity for beginners → `4–5 hrs`
- `Topic 2.4 — TypeScript for React` → lesson_practice, very high → `5–6 hrs`
- `Topic 3.1 — Node.js Fundamentals` → lesson_practice, intermediate-high → `4–5 hrs`
- `Topic 4.1 — Relational Databases & SQL Basics` → lesson_practice, intermediate-high → `4–5 hrs`
- `Topic 4.4 — Database Relations & Advanced Queries` → lesson_practice, high → `4–5 hrs`
- `Topic 5.2 — JWT Authentication: Login & Protected Routes` → lesson_practice, very high → `5–6 hrs`
- `Topic 6.4 — Real-Time Features with WebSockets` → lesson_practice, very high → `5–6 hrs`
- `Topic 7.1 — Docker: Containerising Your App` → lesson_practice, high → `4–5 hrs`
- `Topic 8.2 — Advanced TypeScript: Generics & Utility Types` → lesson_practice, very high → `5–6 hrs`

---

### Data Science (`mallah-path-datascience.md`)

- `Topic 1.1 — Python Basics & the Data Science Environment` → lesson_practice, foundational → `3–4 hrs`
- `Topic 1.2 — NumPy: The Foundation of Numerical Python` → lesson_practice, intermediate → `3–4 hrs`
- `Topic 2.4 — SQL for Data Scientists` → lesson_practice, high → `4–5 hrs`
- `Topic 4.2 — Hypothesis Testing` → lesson_practice, high (statistical concepts + practical) → `4–5 hrs`
- `Topic 5.3 — Classification: Logistic Regression, Decision Trees & KNN` → lesson_practice, very high → `5–6 hrs`
- `Topic 6.1 — Ensemble Methods: Random Forest & Gradient Boosting` → lesson_practice, very high → `5–6 hrs`
- `Topic 7.1 — Neural Networks from Scratch` → lesson_practice, very high → `5–6 hrs`
- `Topic 7.2 — PyTorch Fundamentals` → lesson_practice, very high → `5–6 hrs`
- `Topic 7.4 — Transfer Learning & Transformers (Practical)` → lesson_practice, very high → `5–6 hrs`

---

### Cybersecurity (`mallah-path-cybersecurity.md`)

All `lesson_lab` topics need to be bumped significantly from their current `2 hrs`.

- `Topic 4.1 — Nmap: Network Scanning & Enumeration` → lesson_lab, intermediate → `4–5 hrs`
- `Topic 4.2 — Wireshark: Packet Capture & Traffic Analysis` → lesson_lab, intermediate → `4–5 hrs`
- `Topic 5.1 — Burp Suite: Web Proxy & Interception` → lesson_lab, intermediate-high → `4–5 hrs`
- `Topic 5.2 — SQL Injection: Detection, Exploitation & Defence` → lesson_lab, advanced → `5–6 hrs`
- `Topic 5.3 — XSS: Reflected, Stored & DOM` → lesson_lab, advanced → `4–5 hrs`
- `Topic 6.1 — Metasploit Framework` → lesson_lab, advanced → `5–6 hrs`
- `Topic 6.2 — Windows Privilege Escalation` → lesson_lab, advanced → `5–6 hrs`
- `Topic 6.3 — Linux Privilege Escalation` → lesson_lab, advanced → `5–6 hrs`
- `Topic 6.4 — Active Directory Attacks (Introduction)` → lesson_lab, advanced → `5–6 hrs`
- `Topic 6.5 — Post-Exploitation: Persistence, Pivoting & Covering Tracks` → lesson_lab, advanced → `5–6 hrs`
- `Topic 8.3 — Reverse Engineering & Binary Exploitation Basics` → lesson_lab, advanced → `5–6 hrs`

---

## 5. What NOT to Change

- Any line that does not start with `**Estimated Time:**`
- Project milestone topics (`### Topic X.X — PROJECT: ...`) — their time ranges stay as authored
- The cybersecurity `Ongoing` entries for Topics 8.1 and 8.5 — leave as-is
- Topic descriptions, resources, skills unlocked, practical output sections, or any other content

---

## 6. Validation Checklist (run after editing)

After making all changes, verify:

- [ ] No lesson topic remains at a flat `2 hrs` unless it is genuinely a short concept-only topic
- [ ] No `lesson_lab` topic (cybersecurity path) is under `3 hrs`
- [ ] All project topics are unchanged from their original values
- [ ] All time values use `–` (en-dash) for ranges, not `-` (hyphen)
- [ ] Format is consistent: `**Estimated Time:** X hrs` — no extra punctuation, no trailing spaces
- [ ] Total number of `**Estimated Time:**` occurrences per file matches before and after edit

---

## 7. Agent Prompt

Paste the following prompt to the agent that will make the edits:

---

```
You are a curriculum editor for Mallah, a Saudi Arabia tech learning platform.

Your task: update the **Estimated Time:** field for every lesson topic across 4 learning path files. The current values are mostly flat "2 hrs" defaults that do not reflect real study time. You must replace them with accurate, calibrated estimates.

## Files to edit (read all 4 first, then edit):
1. mallah-path-frontend.md
2. mallah-path-fullstack.md
3. mallah-path-datascience.md
4. mallah-path-cybersecurity.md

## Estimation rules:

### By topic type:
- concept (pure reading, no hands-on): 1–1.5 hrs
- concept_practice (reading + short written task): 1.5–2.5 hrs
- lesson_practice, foundational (HTML basics, basic Git, basic deployment): 1.5–2.5 hrs
- lesson_practice, standard intermediate (React basics, SQL basics, Pandas basics): 3–4 hrs
- lesson_practice, high complexity (TypeScript, JWT auth, Next.js, async JS, ML algorithms, Docker): 4–5 hrs
- lesson_practice, very high complexity (Advanced TypeScript, WebSockets, deep learning, Transformers): 5–6 hrs
- lesson_lab, foundational (cybersecurity — intro tool usage, basic scanning): 3–4 hrs
- lesson_lab, intermediate (cybersecurity — enumeration, XSS, Wireshark, Burp Suite): 4–5 hrs
- lesson_lab, advanced (cybersecurity — SQLi, Metasploit, Privilege Escalation, Active Directory, Post-Exploitation): 5–6 hrs
- project_milestone or project_capstone: DO NOT CHANGE

### Format rules:
- Use en-dash for ranges: "3–4 hrs" not "3-4 hrs"
- Use "hrs" not "hours"
- No ~ prefix
- Short concepts may use "45 min" or "1 hr"

## What to change:
Only the value on lines matching: `**Estimated Time:** X`
Do not change anything else — not topic descriptions, not resource lists, not practical outputs, not skills unlocked sections.

## Do NOT change:
- Any project milestone or capstone topic times
- Topics 8.1 and 8.5 in cybersecurity (they are "Ongoing" — leave them)
- Any content other than the **Estimated Time:** line

## Process:
1. Read all 4 files
2. For each topic in each file, determine the topic type and complexity level
3. Apply the correct time estimate based on the rules above
4. Edit each file in-place, changing only the **Estimated Time:** lines
5. After all edits, run a validation pass: confirm no lesson topic is still at a flat "2 hrs" unless it is genuinely a short foundational concept

When done, output a summary table of all changes made, grouped by path.
```

---

## 8. Summary

| Path | File | Topics to Fix (approx) |
|---|---|---|
| Frontend | `mallah-path-frontend.md` | ~30 lesson topics |
| Full-Stack | `mallah-path-fullstack.md` | ~35 lesson topics |
| Data Science | `mallah-path-datascience.md` | ~35 lesson topics |
| Cybersecurity | `mallah-path-cybersecurity.md` | ~35 lesson topics + all lab topics |

**Total: ~135 estimated time corrections across 4 files.**
