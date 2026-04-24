# Mallah – Smart Onboarding v3
### Full Redesign: Visuals · Copy · Match Score Logic

---

## 1. What Changed From v2

| Area | v2 | v3 |
|---|---|---|
| Match score | Fully AI-generated (black box) | Hybrid: deterministic formula + AI adjustment ±10 |
| Visual design | Minimal, flat | Tactical HUD — glassmorphism, grid overlay, glow effects |
| Copy (EN) | Generic, instructional | Mission-briefing tone — direct, confident, specific |
| Copy (AR) | Translation-grade | Equal-quality Arabic, written for native readers, RTL-native layout |
| Intro screen | Short message + Start button | Full "Mission Briefing" screen with animated HUD frame |
| Step cards | Plain form | Glass-card with .glow-border on active selection, scanline header |
| Loading state (AI) | Spinner | Animated HUD analysis sequence with step-by-step status lines |
| Recommendation screen | Flat list | Two-panel layout: score ring left, path detail right |
| Step indicator | Numbered | Segmented progress bar with .hud-grid fill animation |

---

## 2. Visual Design System

All components use the Mallah Tactical HUD design language. Dark mode is the default and primary experience.

### 2.1 Component Tokens

| Element | Spec |
|---|---|
| Background | `oklch(0.12 0.01 106)` – Deep Graphite |
| Card surface | `.glass` — `backdrop-blur: 12px`, `background: oklch(0.22 0.01 106 / 0.6)`, border `oklch(0.68 0.13 38.8 / 0.25)` |
| Active selection | `.glow-border` — `box-shadow: 0 0 0 1px oklch(0.68 0.13 38.8), 0 0 16px oklch(0.68 0.13 38.8 / 0.3)` |
| Primary text | `oklch(0.94 0.01 106)` – Silver Gray |
| Muted text | `oklch(0.70 0.01 106)` – Subdued Steel |
| Primary accent | `oklch(0.68 0.13 38.8)` – Mallah Orange |
| Progress fill | Mallah Orange gradient left-to-right |
| Body font (EN) | Inter |
| Display / labels (EN) | Inter, weight 600–700, letter-spacing: 0.05em, uppercase for system labels |
| Body font (AR) | IBM Plex Sans Arabic |
| Data / numbers | JetBrains Mono |
| Grid overlay | `.hud-grid` — 30px grid, primary color at 5% opacity |

### 2.2 Layout Rules

- Maximum wizard container width: `560px`, centered.
- Each step card: `border-radius: 16px`, padding `32px`.
- HUD grid overlay applied behind the card, not inside it.
- Progress bar: fixed at top of wizard container, full width, height `3px`.
- Back arrow: top-left, outside card bounds, always visible.
- Step counter: top-right, `font-family: JetBrains Mono`, format `01 / 07`.
- All Arabic content: `direction: rtl`, `text-align: right`. Step counter stays `ltr` and left-right positions swap in RTL layout.
- Transitions between steps: `translateX` slide — forward slides left-in, back slides right-in. Duration `280ms ease-out`.

### 2.3 Option Card Anatomy

Each selectable option is a card, not a radio button.

```
┌──────────────────────────────────────────────────────┐
│  [Icon]  Label text                                  │
│          Supporting subtext (muted, smaller)         │
└──────────────────────────────────────────────────────┘
```

- Default state: `.glass` card, no glow.
- Hover: `background` lightens slightly, `border-color` tints orange at 40%.
- Selected: `.glow-border` applied, background slightly brighter, icon fills orange.
- For multi-select steps: checkmark badge appears top-right of card on selection.
- Transition: `150ms ease`.

---

## 3. Onboarding Flow (Full Redesign)

### Step 0 – Mission Briefing (Introduction)

**Purpose:** Set the tone. Establish Mallah as a serious, purposeful tool. Make the learner feel like they're about to do something that matters.

---

**Visual:**
Full-screen dark card with `.hud-grid` background. Centered layout. A thin animated scanline sweeps top-to-bottom once on load. The Mallah wordmark sits at top-center.

Below the wordmark, a "MISSION BRIEF" system label in JetBrains Mono, Mallah Orange, uppercase, letter-spaced.

---

**Headline (EN):**
> Your career path starts with 6 honest answers.

**Subtext (EN):**
> We'll analyze your background, goals, and interests — then show you the exact path built for where you're headed. Takes 3 minutes.

---

**Headline (AR):**
> مسارك المهني يبدأ بـ 6 أسئلة صادقة.

**Subtext (AR):**
> سنحلل خلفيتك وأهدافك واهتماماتك — ثم نريك المسار المصمم بدقة لوجهتك. يستغرق 3 دقائق.

---

**CTA Button:**
- EN: `Begin Mission`
- AR: `ابدأ المهمة`
- Style: full-width, Mallah Orange fill, `border-radius: 8px`, Inter 600.

**Below button — social proof line (muted text, small):**
- EN: `Joined by 4,000+ learners building real careers in tech.`
- AR: `انضم إليها أكثر من 4,000 متعلم يبنون مساراتهم في التقنية.`

*(Note: Update the number to match actual user count once platform is live. Remove this line if count is below 500.)*

---

### Step 1 – Identity

**Step label:** `01 / 06`

**Question (EN):** Where are you starting from?
**Question (AR):** من أين تبدأ؟

**Subtext (EN):** This helps us set the right starting point — no wrong answer here.
**Subtext (AR):** هذا يساعدنا على تحديد نقطة البداية الصحيحة — لا توجد إجابة خاطئة.

---

**Options:**

| Icon | Label (EN) | Subtext (EN) | Label (AR) | Subtext (AR) | value |
|---|---|---|---|---|---|
| 🎓 | Student | Currently studying, exploring tech | طالب | أدرس حالياً وأستكشف التقنية | `student` |
| 🚀 | Fresh Graduate | Just finished my degree | خريج حديث | أنهيت دراستي مؤخراً | `fresh_grad` |
| 🔄 | Career Shifter | Coming from a different field | محول مهني | قادم من مجال مختلف | `career_shifter` |
| 💡 | Complete Beginner | No tech background at all | مبتدئ تماماً | لا خلفية تقنية لديّ | `no_tech` |

*Note: "No Tech Background" renamed to "Complete Beginner" / "مبتدئ تماماً" — more empowering, less othering.*

---

### Step 2 – Career Goal

**Step label:** `02 / 06`

**Question (EN):** What's the outcome you're working toward?
**Question (AR):** ما النتيجة التي تسعى إليها؟

**Subtext (EN):** Be honest — this shapes which path will actually get you there.
**Subtext (AR):** كن صريحاً — هذا يحدد المسار الذي سيوصلك فعلاً.

---

**Options:**

| Icon | Label (EN) | Subtext (EN) | Label (AR) | Subtext (AR) | value |
|---|---|---|---|---|---|
| 💼 | Land a Full-Time Job | Get hired at a company as a developer | الحصول على وظيفة | أُوظَّف في شركة كمطور | `job` |
| 🌐 | Work as a Freelancer | Build client projects on my own terms | العمل الحر | بناء مشاريع للعملاء باستقلالية | `freelance` |
| ⚡ | Build My Own Product | Launch a startup or personal project | بناء منتجي الخاص | إطلاق مشروعي أو شركتي الناشئة | `startup` |
| 🧭 | Explore First | I want to understand my options before committing | الاستكشاف أولاً | أريد فهم خياراتي قبل الالتزام | `exploring` |

---

### Step 3 – Weekly Commitment

**Step label:** `03 / 06`

**Question (EN):** How many hours per week can you realistically commit?
**Question (AR):** كم ساعة في الأسبوع تستطيع الالتزام بها فعلاً؟

**Subtext (EN):** Be realistic, not aspirational. Consistent hours beat big plans that don't hold.
**Subtext (AR):** كن واقعياً، لا تفاؤلياً. الثبات أهم من الطموح الذي لا يستمر.

---

**Options:**

| Icon | Label (EN) | Subtext (EN) | Label (AR) | Subtext (AR) | value | velocity |
|---|---|---|---|---|---|---|
| 🕐 | 1–3 hrs / week | Light — good for exploring | 1–3 ساعات أسبوعياً | خفيف — مناسب للاستكشاف | `0-3` | `slow` |
| 🕓 | 4–7 hrs / week | Steady — career growth pace | 4–7 ساعات أسبوعياً | منتظم — وتيرة النمو المهني | `4-7` | `normal` |
| 🕗 | 8–12 hrs / week | Focused — serious about results | 8–12 ساعة أسبوعياً | مكثف — جاد في النتائج | `8-12` | `fast` |
| ⚡ | 13+ hrs / week | Intensive — accelerated timeline | 13+ ساعة أسبوعياً | مكثف جداً — جدول زمني متسارع | `13+` | `fast` |

---

**Live Pace Preview (shown immediately after selection):**

Displayed below the option grid inside a small `.glass` info bar with a clock icon. Uses JetBrains Mono for the week count.

| velocity | EN preview | AR preview |
|---|---|---|
| `slow` | At this pace, your first milestone project takes approx. **20–24 weeks**. | بهذه الوتيرة، مشروعك الأول يستغرق تقريباً **20–24 أسبوعاً**. |
| `normal` | At this pace, your first milestone project takes approx. **12–16 weeks**. | بهذه الوتيرة، مشروعك الأول يستغرق تقريباً **12–16 أسبوعاً**. |
| `fast` | At this pace, your first milestone project takes approx. **6–10 weeks**. | بهذه الوتيرة، مشروعك الأول يستغرق تقريباً **6–10 أسابيع**. |

*These are display estimates only. The roadmap calculates precise milestones after path selection.*

---

### Step 4 – Interest Signals

**Step label:** `04 / 06`

**Question (EN):** Which of these sound like you? Select all that apply.
**Question (AR):** أيٌّ من هذه تصفك؟ اختر كل ما ينطبق.

**Subtext (EN):** Don't overthink it — go with your gut reaction.
**Subtext (AR):** لا تُفكّر كثيراً — اتّبع ردّة فعلك الأولى.

---

**Options (multi-select):**

| Icon | Label (EN) | Subtext (EN) | Label (AR) | Subtext (AR) | Maps to paths |
|---|---|---|---|---|---|
| 🎨 | I love building things people can see and interact with | Visual results motivate me | أحب بناء أشياء يراها الناس ويتفاعلون معها | النتائج المرئية تحفزني | `frontend`, `fullstack` |
| 🔍 | I'm drawn to finding hidden flaws in systems | Thinking like an attacker interests me | أنجذب لاكتشاف الثغرات الخفية في الأنظمة | التفكير كالمهاجم يثير اهتمامي | `cybersecurity` |
| 📊 | I enjoy working with data, patterns, and numbers | I like finding meaning in information | أستمتع بالعمل مع البيانات والأنماط والأرقام | أحب إيجاد المعنى في المعلومات | `datascience` |
| ⚙️ | I like understanding how things work under the hood | Logic and systems thinking appeal to me | أحب فهم كيف تعمل الأشياء من الداخل | منطق الأنظمة يجذبني | `fullstack`, `cybersecurity` |

**Validation:** at least 1 must be selected to proceed. If none selected after 5s of inactivity on a mobile device, show a soft prompt: "Select at least one — even a weak preference counts." / "اختر واحدة على الأقل — حتى التفضيل الضعيف يُحتسب."

---

### Step 5 – Confidence Snapshot

**Step label:** `05 / 06`

**Question (EN):** How familiar are you with these?
**Question (AR):** ما مدى إلمامك بهذه الأشياء؟

**Subtext (EN):** No experience needed to start. This just helps us calibrate your starting point.
**Subtext (AR):** لا تحتاج إلى خبرة للبدء. هذا فقط يساعدنا على تحديد نقطة انطلاقك.

---

**Items:**

| Statement (EN) | Statement (AR) |
|---|---|
| Using Git (version control) | استخدام Git (التحكم في الإصدارات) |
| What an API is and how it works | ما هو الـ API وكيف يعمل |
| Writing basic code in any language | كتابة كود أساسي بأي لغة |
| Building and shipping any project | بناء مشروع ونشره |

**Response options per item:**

| Value | Label (EN) | Label (AR) |
|---|---|---|
| `0` | Never heard of it | لم أسمع به من قبل |
| `1` | Heard of it / tried it | سمعت به / جربته |
| `2` | Comfortable with it | ملمّ به |

**Visual treatment:** each item is a row with the statement on the left (AR: right) and three pill-shaped toggle buttons on the right (AR: left). Selected pill fills with Mallah Orange.

**Readiness computation:**
```
readiness_level = sum of all item values (0–8 range)
normalized_readiness = readiness_level / 8  → 0.0–1.0
```

*Note: The data model stores `readiness_level` as the raw sum (0–8 is more granular than the v2 0–3). The match score formula uses the normalized value.*

---

### Step 6 – Assistant Preferences

**Step label:** `06 / 06`

**Question (EN):** How do you want your AI assistant to talk to you?
**Question (AR):** كيف تريد أن يتحدث إليك مساعدك الذكي؟

**Subtext (EN):** You can change this anytime in your settings.
**Subtext (AR):** يمكنك تغيير هذا في أي وقت من الإعدادات.

---

**Language preference:**

| Icon | Label (EN) | Subtext (EN) | Label (AR) | Subtext (AR) | value |
|---|---|---|---|---|---|
| 🇸🇦 | Arabic | Explanations fully in Arabic | عربي | الشرح بالكامل بالعربية | `arabic` |
| 🇬🇧 | English | Explanations fully in English | إنجليزي | الشرح بالكامل بالإنجليزية | `english` |
| 🔀 | Mixed | Arabic context, English terms | مختلط | سياق بالعربية، مصطلحات بالإنجليزية | `mix` |

**Detail level:**

| Icon | Label (EN) | Subtext (EN) | Label (AR) | Subtext (AR) | value |
|---|---|---|---|---|---|
| ⚡ | Concise | Short, direct answers | مختصر | إجابات قصيرة ومباشرة | `short` |
| ⚖️ | Balanced | Clear explanations with context | متوازن | شرح واضح مع سياق | `balanced` |
| 📖 | Detailed | Full explanations with examples | مفصّل | شرح كامل مع أمثلة | `detailed` |

Both selections shown on the same screen. Proceed button activates only when both are selected.

**Proceed button:**
- EN: `Analyze My Profile →`
- AR: `→ تحليل ملفي`
- Style: Mallah Orange, full-width. On click, triggers the match score computation and AI call simultaneously.

---

### Step 7 – Analysis Loading Screen

This is not a passive spinner. It's an animated HUD sequence that communicates real computation happening.

**Visual:** Dark full-screen card with `.hud-grid` overlay. A vertical stack of status lines appears one at a time, each with a pulsing orange dot that turns solid green (success color) when "complete."

**Sequence (EN):**
```
[●] Reading your background and goals...
[●] Scoring path alignment...
[●] Calibrating for your availability...
[●] Analyzing your interests...
[●] Generating your match report...
```

**Sequence (AR):**
```
[●] قراءة خلفيتك وأهدافك...
[●] قياس توافق المسارات...
[●] المعايرة بناءً على وقتك المتاح...
[●] تحليل اهتماماتك...
[●] إنشاء تقرير التوافق الخاص بك...
```

**Timing:** Each line appears at `~600ms` intervals. The sequence takes `~3s` to complete. If the API returns faster, hold on the last line for the remainder. If the API takes longer than `8s`, show:
- EN: `Still working — this takes a moment for first-time analysis.`
- AR: `لا يزال يعمل — هذا يستغرق لحظة للتحليل الأول.`

---

## 4. Hybrid Match Score System

This is the core change from v2. The match score is no longer fully AI-generated. The frontend computes a deterministic base score; the AI is given this score and may adjust it by ±10 points, then writes the reasons.

### 4.1 Why Hybrid

- The AI's score in v2 was inconsistent — identical profiles sometimes got different scores across runs.
- The deterministic formula is transparent: every point can be traced back to a specific answer.
- The AI still matters — it can recognize subtle fit the formula misses, and it writes the reasons that make the score meaningful.

### 4.2 Signal Mapping

Each answer maps to path fit scores. Higher = stronger fit for that path.

#### Signal 1 — Interest Alignment (Weight: 40%)

Each interest statement maps to paths with full (1.0) or partial (0.5) credit.

| Statement | frontend | fullstack | cybersecurity | datascience |
|---|---|---|---|---|
| Building things people see/interact with | 1.0 | 0.8 | 0.0 | 0.2 |
| Finding hidden flaws in systems | 0.0 | 0.3 | 1.0 | 0.2 |
| Data, patterns, numbers | 0.0 | 0.2 | 0.2 | 1.0 |
| How things work under the hood | 0.2 | 0.9 | 0.7 | 0.4 |

**Computation:**
```
For each selected interest statement, add the path score.
interest_raw[path] = sum of scores for selected statements
interest_max[path] = sum of max possible scores across all 4 statements for that path
interest_score[path] = interest_raw[path] / interest_max[path]  → 0.0–1.0
```

If no statements selected: `interest_score[all paths] = 0.5` (neutral, not zero — avoids unfair penalization).

#### Signal 2 — Goal Fit (Weight: 25%)

Each primary goal maps to how well each path delivers that outcome.

| Goal | frontend | fullstack | cybersecurity | datascience |
|---|---|---|---|---|
| `job` | 0.9 | 1.0 | 0.8 | 0.8 |
| `freelance` | 1.0 | 0.9 | 0.4 | 0.5 |
| `startup` | 0.7 | 1.0 | 0.3 | 0.7 |
| `exploring` | 0.8 | 0.8 | 0.7 | 0.7 |

`goal_score[path]` = lookup value above.

#### Signal 3 — Readiness Fit (Weight: 20%)

Some paths have higher complexity floors. Low readiness penalizes high-complexity paths more.

Path complexity baseline:
- `frontend`: 0.3 (most accessible)
- `fullstack`: 0.5 (moderate baseline needed)
- `cybersecurity`: 0.6 (conceptual depth needed)
- `datascience`: 0.55 (math comfort needed)

```
normalized_readiness = readiness_level / 8  → 0.0–1.0

readiness_score[path] = 1.0 - max(0, complexity_baseline[path] - normalized_readiness)
```

This means: if you scored 0.8 readiness and frontend needs 0.3, you get `1.0 - max(0, 0.3-0.8) = 1.0`. If you scored 0.1 readiness and cybersecurity needs 0.6, you get `1.0 - 0.5 = 0.5`.

#### Signal 4 — Commitment Fit (Weight: 15%)

Some paths realistically require more sustained hours.

Path minimum velocity:
- `frontend`: `slow` (achievable at any pace)
- `fullstack`: `normal` (slow pace means very long time-to-job)
- `cybersecurity`: `normal` (depth requires time)
- `datascience`: `normal` (math and projects need practice time)

| velocity | hours | commitment_score (frontend) | commitment_score (fullstack) | commitment_score (cybersecurity) | commitment_score (datascience) |
|---|---|---|---|---|---|
| `slow` | 0–3 | 1.0 | 0.6 | 0.5 | 0.6 |
| `normal` | 4–7 | 1.0 | 1.0 | 0.9 | 1.0 |
| `fast` | 8–12 | 1.0 | 1.0 | 1.0 | 1.0 |
| `fast` | 13+ | 1.0 | 1.0 | 1.0 | 1.0 |

### 4.3 Base Score Computation

```
base_score[path] = (
  interest_score[path]   × 0.40 +
  goal_score[path]       × 0.25 +
  readiness_score[path]  × 0.20 +
  commitment_score[path] × 0.15
) × 100

→ Result: float 0.0–100.0, rounded to nearest integer.
```

The path with the highest `base_score` is the `recommended_path_id`.

Ties: if two paths are within 3 points of each other, the tiebreaker is `goal_score` (whichever path serves the stated goal better).

### 4.4 AI Adjustment (±10)

The backend sends the following to the AI:

```json
{
  "learner_profile": {
    "background_type": "...",
    "primary_goal": "...",
    "weekly_hours_category": "...",
    "interest_signals": ["...", "..."],
    "readiness_level": 5,
    "normalized_readiness": 0.625
  },
  "deterministic_scores": {
    "frontend": 72,
    "fullstack": 81,
    "cybersecurity": 55,
    "datascience": 60
  },
  "recommended_path_id": "fullstack"
}
```

**AI system prompt instruction:**
> You are a career path advisor. You have received a learner profile and a deterministic match score for four tech career paths. Your job is to:
> 1. Review the deterministic scores. You may adjust the recommended path's score by a maximum of ±10 points if you see a strong signal the formula missed (e.g. a combination of signals that unusually strongly or weakly fits this path). Do not adjust if you see no clear reason.
> 2. Write 2–3 reasons for the recommendation. Each reason MUST reference a specific answer the learner gave. No generic statements.
> 3. Suggest 1–2 alternative paths with a reason for each.
> 4. Return strict JSON only. No preamble, no markdown.

**AI must return:**
```json
{
  "final_score": "integer 0–100 (deterministic score ±10 max, or unchanged)",
  "adjustment_reason": "one sentence explaining why you adjusted, or null if unchanged",
  "reasons": [
    "reason referencing a specific learner answer",
    "reason referencing a specific learner answer"
  ],
  "alternatives": [
    { "path_id": "...", "reason": "why this is a secondary fit" }
  ]
}
```

**Validation rules (backend enforces before storing):**
- `final_score` must be within ±10 of `base_score[recommended_path]`. If outside range → clamp.
- `final_score` must be 0–100. If outside → clamp.
- `reasons` must be an array of 2–3 strings. If missing → fall back to generic template reasons.
- `alternatives` must be 1–2 items, each referencing a valid path_id. If missing → omit alternatives section on recommendation screen.

**What is stored:**
- `ai_recommendations.match_score` = `final_score`
- `ai_recommendations.base_score` = `base_score[recommended_path]` *(new column — add to data model)*
- `ai_recommendations.ai_adjustment` = `final_score - base_score` *(new column)*

### 4.5 Score Labels (Updated)

| Score | Label (EN) | Label (AR) | Color token |
|---|---|---|---|
| 0–34% | Weak signal | إشارة ضعيفة | `destructive` |
| 35–54% | Possible fit | توافق محتمل | `warning` |
| 55–74% | Good match | توافق جيد | `warning` |
| 75–89% | Strong match | توافق قوي | `success` |
| 90–100% | Exceptional fit | توافق استثنائي | `success` |

---

## 5. Recommendation Screen (Full Redesign)

### 5.1 Layout

Two-column layout on desktop. Single column on mobile (score ring collapses to top).

**Left column (40% width):**
- Animated SVG score ring (see 5.2)
- Path name, large
- Match score percentage and label
- "Why this fits you" — AI reasons list

**Right column (60% width):**
- Path one-line description
- What you'll learn to do
- Skills you'll gain (pill tags, not a bullet list)
- Projects you'll build (numbered cards)
- Where this leads (role tags)

**Footer (full width):**
- `Start This Path` button — Mallah Orange, full width
- `Explore Other Paths` link — muted text, below button

### 5.2 Score Ring Component

SVG circular progress ring. Animates from 0 to final score on mount over `1.2s ease-out`.

Ring dimensions: `160px × 160px`.

Ring stroke color:
- 0–54%: `oklch(0.78 0.13 70)` — Tactical Amber
- 55–89%: `oklch(0.65 0.12 153)` — Forest Emerald
- 90–100%: `oklch(0.68 0.13 38.8)` — Mallah Orange (reserved for top tier)

Inside the ring:
- Score number: JetBrains Mono, `2rem`, primary color
- "MATCH" label: `0.6rem`, letter-spaced, muted, uppercase

Below the ring:
- Score label (from table 4.5): Inter 600, appropriate color token

Glow effect: when score ≥ 75%, apply a subtle radial glow behind the ring using the ring's color at 20% opacity.

### 5.3 "Why This Fits You" Section

Title (EN): `Why this fits you`
Title (AR): `لماذا يناسبك هذا المسار`

Displayed as 2–3 cards, each card containing:
- A small icon (bullet replacement): `◈` in Mallah Orange
- The AI-generated reason text

These cards use `.glass` styling. They must feel personal — the copy is anchored to the learner's actual answers by the AI.

### 5.4 Skills Pills

Skills are displayed as compact pill tags (not a bullet list). Background: `oklch(0.22 0.01 106)`, border: faint orange, text: Silver Gray. Font: Inter 500, `0.8rem`.

### 5.5 Project Cards

Each project is a numbered `.glass` card:
```
┌──────────────────────────────────┐
│  01  Blog REST API               │
│      Full CRUD with Node + PG    │
└──────────────────────────────────┘
```
Number: JetBrains Mono, Mallah Orange.

### 5.6 Alternative Paths

Shown below the main recommendation, collapsed by default under a toggle:
- EN: `See alternative paths →`
- AR: `← عرض المسارات البديلة`

On expand: 1–2 alternative path cards, each showing path name + the AI's reason for it being a secondary fit. Cards use a lighter glass treatment with a muted border (not orange glow — visually subordinate).

### 5.7 CTA Buttons

**Primary:**
- EN: `Start This Path`
- AR: `ابدأ هذا المسار`
- Style: full-width, Mallah Orange fill, `border-radius: 8px`, Inter 700.

**Secondary:**
- EN: `Explore All Paths`
- AR: `استعرض جميع المسارات`
- Style: ghost button (transparent fill, orange border), full-width.

On "Explore All Paths": navigate to a path selection grid showing all 4 paths with pre-defined content only. No AI involved. Learner picks manually. Same recommendation screen layout minus the match ring (replaced with path icon).

---

## 6. AI Fallback (No API Response)

If the AI call fails or times out (>12s):

1. Use the deterministic `base_score` as the final score unchanged.
2. Generate template reasons from the learner's answers (rule-based, no AI):

**Reason templates (EN):**
- Interest: `"You selected '{interest_label}' — this aligns directly with what {path_name} focuses on."`
- Goal: `"Your goal to {goal_label} is one of the most common outcomes for {path_name} graduates."`
- Commitment: `"At {hours} hours/week, {path_name} is achievable at a {velocity} pace."`

**Reason templates (AR):**
- Interest: `"اخترت '{interest_label}' — وهذا يتوافق مباشرة مع تركيز مسار {path_name}."`
- Goal: `"هدفك في {goal_label} هو من أكثر النتائج شيوعاً لخريجي مسار {path_name}."`
- Commitment: `"بمعدل {hours} ساعات أسبوعياً، مسار {path_name} قابل للتحقيق بوتيرة {velocity}."`

3. Show the recommendation screen normally. Do not show an error message.
4. Log the fallback event server-side.
5. Alternatives: show the top 2 paths by deterministic score (excluding recommended path), with the template reason `"Based on your answers, this path is also a strong fit for your goals."` / `"بناءً على إجاباتك، هذا المسار أيضاً يتناسب جيداً مع أهدافك."`

---

## 7. Updated Data Model

### `onboarding_responses` — no changes to existing columns.

`readiness_level` column meaning changes: now stores the raw sum (0–8) instead of 0–3. Backend migration: multiply existing values by 2 to approximate (or treat as NULL for re-onboarding users).

### `ai_recommendations` — additions

| Field | Type | Description |
|---|---|---|
| `base_score` | INT | Deterministic formula output before AI adjustment |
| `ai_adjustment` | INT | `final_score - base_score` (range: -10 to +10, or 0 if fallback) |
| `adjustment_reason` | TEXT | AI's one-sentence reason for adjusting, or NULL |
| `fallback_used` | BOOLEAN | TRUE if AI failed and template reasons were used |

All existing columns remain unchanged.

---

## 8. Progress Bar Behavior

The top progress bar fills proportionally across 6 steps (Step 0 is pre-progress, Step 6 = 100%).

| Current Step | Fill % |
|---|---|
| Step 0 (Intro) | 0% |
| Step 1 | ~17% |
| Step 2 | ~33% |
| Step 3 | ~50% |
| Step 4 | ~67% |
| Step 5 | ~83% |
| Step 6 | 100% |
| Loading / Step 7 | 100% (stays full) |

Fill animation: `transition: width 400ms ease-out`. Color: Mallah Orange.

---

## 9. RTL / Bilingual Implementation Notes

- Language switching is not part of onboarding UI itself. The wizard renders in the user's browser language (Arabic or English) detected at load time, defaulting to Arabic for `ar` locales.
- All copy is provided in both languages in this spec. Translations are equal-quality, not derived from each other.
- In RTL mode: progress bar fills right-to-left. Step counter stays numeric and non-directional. Back arrow points right. Slide transitions reverse direction.
- Interest statement cards maintain the same grid layout in RTL — Arabic text wraps naturally.
- JetBrains Mono (numbers, percentages, step counters) is always LTR even in RTL layouts, wrapped in `<span dir="ltr">`.
- Pace preview numbers: always rendered in JetBrains Mono, `dir="ltr"`, even inside RTL paragraphs.

---

## 10. Error & Edge Case Handling (Updated)

| Scenario | Behavior |
|---|---|
| AI API timeout or failure | Use deterministic base score + template reasons. Show recommendation normally. Log fallback. |
| AI returns invalid JSON | Retry once. On second failure, use fallback. |
| AI returns `path_id` that differs from deterministic recommendation | Honor the AI's path_id ONLY if the AI's score for that path (derived from its `final_score`) is within 5 points of the deterministic top score. Otherwise use deterministic recommendation. |
| AI adjustment exceeds ±10 | Clamp to ±10. Log anomaly. |
| `final_score` outside 0–100 | Clamp. Log. |
| No interest signals selected | Run formula with neutral `interest_score = 0.5` for all paths. Proceed. |
| All confidence items answered "Never heard of it" | `readiness_level = 0`. Formula applies naturally — low-complexity paths score higher. |
| Learner exits mid-onboarding | Auto-save each step on "Next" click. Resume from last completed step on return. |
| Learner completes onboarding twice | Block at route level. Redirect to Profile & Settings. |

---

## 11. Frontend States (Unchanged from v2)

| State | Description |
|---|---|
| `idle` | Intro screen shown |
| `in_progress` | Wizard active |
| `loading` | HUD analysis sequence running, AI call in progress |
| `recommendation` | Score and path result shown |
| `completed` | Path accepted, roadmap initialized, redirect to Dashboard |
| `error` | Hard error (non-AI) — generic error with retry |

---

## 12. Integration Points (Unchanged from v2)

- **Roadmap Initialization** → `POST /roadmap/init` with `{ user_id, path_id, learning_velocity }` on path acceptance.
- **AI Assistant Config** → `ai_language_pref` and `ai_detail_level` written to learner profile immediately on onboarding completion.
- **Dashboard** → New User Banner reads `ai_recommendations.reasons[0]` as a personalized welcome line on first load.

---

*End of Mallah Onboarding v3 Spec*
