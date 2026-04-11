# Mallah – Opportunity Analyzer Redesign

## 2. Page Structure Changes

### REMOVE
- `<h1>Opportunity Analyzer</h1>` above the tabs — delete entirely
- Subtitle `"Discover jobs matching your skills or analyze a custom job description."` above tabs — delete entirely
- Duplicate title + subtitle inside the Custom Analysis card — delete entirely
- Top-level padding that was compensating for the removed header
- Briefcase icon from the Job Description field label in Custom Analysis

### UPDATE
- Tabs now sit as the **first element** on the page with no header above them
- Active tab uses a **primary orange bottom-border underline**, not a filled background

```css
[data-state="active"] {
  background: transparent;
  border-bottom: 2px solid oklch(0.68 0.13 38.8);
  border-radius: 0;
  color: oklch(0.68 0.13 38.8);
}
```

---

## 3. Tab Labels

| Location | Current EN | New EN | New AR |
|---|---|---|---|
| Tab 1 | Discover Jobs | **Job Feed** | **وظائف** |
| Tab 2 | Custom Analysis | **Analyze a Role** | **حلّل وظيفة** |

---

## 4. Job Feed Tab

### 4.1 Feed Header — Replace "Curated Job Feed"

**Remove:** Static `"Curated Job Feed"` heading.

**Add:** Live status bar component (`FeedHeader.tsx`):

```
● LIVE FEED — Frontend Development        Refreshes weekly · 10 roles
```

**Arabic:**
```
● وظائف هذا الأسبوع — تطوير الواجهات        يتجدد كل أسبوع · ١٠ وظائف
```

**Specs:**
- `●` dot: CSS pulse animation (opacity 1 → 0.3 → 1, 2s infinite), primary orange color
- `LIVE FEED` / `وظائف هذا الأسبوع`: `JetBrains Mono`, uppercase, primary color, 11px
- Path name: regular weight, same line
- Right side: muted, mono font

**Scanline on tab mount:**
- `.scanline` sweep runs once on `JobFeedTab` mount, 1.5s, then stops
- Implementation in `FeedHeader.tsx` or `JobFeedTab.tsx` wrapper:

```tsx
const [scanActive, setScanActive] = useState(false)

useEffect(() => {
  setScanActive(true)
  const t = setTimeout(() => setScanActive(false), 1500)
  return () => clearTimeout(t)
}, [])

className={cn('relative', scanActive && 'scanline')}
```

If `.scanline` is not yet in `globals.css`:
```css
@keyframes scanSweep {
  from { transform: translateY(-100%); opacity: 0.03; }
  to   { transform: translateY(100%); opacity: 0; }
}
.scanline::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    oklch(0.68 0.13 38.8 / 0.06) 50%,
    transparent 100%
  );
  animation: scanSweep 1.5s ease-in-out forwards;
  pointer-events: none;
}
```

### 4.2 Search & Filters — Copy Only

| Element | Current EN | New EN | New AR |
|---|---|---|---|
| Search placeholder | Search roles, skills... | Search by title, skill, or company... | دوّر على وظيفة، مهارة، أو شركة... |
| Level filter | All levels | All Levels | كل المستويات |
| Sort filter | Best Match | Best Match | الأقرب لمستواك |

### 4.3 Job Card — Full Redesign (`JobCard.tsx`)

**New layout (top → bottom):**
```
┌─────────────────────────────────────────────┐
│  [Seniority Badge]              [Save ♡]    │  ← top row
│                                             │
│  Junior Data Scientist                      │  ← title, bold, large
│  byteSpark.ai  ·  Riyadh  ·  Full-time      │  ← muted meta row
│                                             │
│  [React] [TypeScript] [Git]                 │  ← 2-3 skill tags
│                                             │
│  Match   ████████░░  74%                    │  ← animated bar
│                                             │
│  [  Run Analysis  ]                         │  ← full-width primary btn
│                                             │
├─────────────────────────────────────────────┤
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░│  ← 5px expiry strip
└─────────────────────────────────────────────┘
```

**Skill tags:** 2-3 chips from `extracted_skills.required`. Small, outlined, `--accent` bg. Display only — not clickable.

**Match bar:** `"Match"` label in mono + `Progress` component + percentage. Animate from `0` to actual score on mount over `600ms ease-out` using `useEffect`.

**Save button:** Ghost heart icon, top-right, no label. On save → fills primary orange + `heartBounce` keyframe:
```css
@keyframes heartBounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.2); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}
.heart-saved {
  animation: heartBounce 300ms ease-out;
  color: oklch(0.68 0.13 38.8);
}
```

**Expiry strip (bottom 5px border):**
| Days Remaining | Color | Behavior |
|---|---|---|
| 6–7 days | `--success` Forest Emerald | Static |
| 3–5 days | `--warning` Tactical Amber | Static |
| 1–2 days | `--destructive` Alert Red | `stripPulse` animation |

```css
@keyframes stripPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
.expiry-strip--urgent {
  animation: stripPulse 1.2s ease-in-out infinite;
}
```

Tooltip on hover (shadcn `Tooltip` or `title` attribute):
- 6–7 days: `"Expires in 7 days"`
- 3–5 days: `"Expires in X days"`
- 1–2 days: `"Expires tomorrow"`

**Remove:** `"Expires in 7 days"` text from the card body entirely — strip + tooltip replaces it.

**Hover state (Full HUD):**
```css
.job-card:hover {
  border-color: oklch(0.68 0.13 38.8 / 0.4);
  box-shadow: 0 0 20px oklch(0.68 0.13 38.8 / 0.15);
  transition: all 200ms ease;
}
```

**Match bar re-pulse on hover:**
```tsx
const [isPulsing, setIsPulsing] = useState(false)

const handleMouseEnter = () => {
  setIsPulsing(true)
  setTimeout(() => setIsPulsing(false), 600)
}
```
```css
@keyframes pulseOnce {
  0%   { opacity: 1; }
  50%  { opacity: 0.6; }
  100% { opacity: 1; }
}
.animate-pulse-once {
  animation: pulseOnce 600ms ease-out;
}
```

**Card entrance animation (staggered):**
```css
.job-card {
  animation: cardEntrance 400ms ease-out both;
  animation-delay: calc(var(--card-index) * 80ms);
}

@keyframes cardEntrance {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Set `--card-index` inline per card:
```tsx
<div className="job-card" style={{ '--card-index': index } as React.CSSProperties}>
```

**Button copy:**
| Current EN | New EN | New AR |
|---|---|---|
| Analyze → | **Run Analysis** | **حلّلها** |
| Save (text label) | *(icon only — remove label)* | *(icon only)* |

### 4.4 Empty State (`EmptyFeedState.tsx`)

| | EN | AR |
|---|---|---|
| **Copy** | No missions this week — yet. Check back Monday, or paste any job description in **Analyze a Role** to run your own analysis. | ما في وظائف الأسبوع هذا — راجع الاثنين. أو روح **حلّل وظيفة** وحط أي وصف تبيه. |

"Analyze a Role" / "حلّل وظيفة" → clickable link that switches to the second tab.

---

## 5. Analyze a Role Tab (`CustomAnalysisPanel.tsx`)

### 5.1 Container — Full Restyle

**Remove:** White card background, default border, any inherited light theme styles.

**Add:**
```css
background: oklch(0.16 0.01 106);
border: 1px solid oklch(0.68 0.13 38.8 / 0.15);
backdrop-filter: blur(12px);
padding: 40px; /* 24px mobile */
border-radius: 12px;
```
- Faint `.hud-grid` overlay at **3% opacity** (lighter than normal) on the panel background

### 5.2 Mission Label — Add Above Textarea

**Remove:** Duplicate page title (`<h2>Opportunity Analyzer</h2>`) and subtitle inside the card.

**Add:** Mission label:
```
MISSION BRIEF
Paste a job description below. We'll map it against your skills and tell you exactly where you stand.
```
**Arabic:**
```
وش اللي تبي تقدّم عليه؟
حط وصف الوظيفة وبنقولك وين توقف بالضبط.
```

**Specs:**
- `MISSION BRIEF` / `وش اللي تبي تقدّم عليه؟`: `JetBrains Mono`, 11px, uppercase, primary color
- Subtitle: regular body text, muted

### 5.3 Job Description Textarea

| Element | Current | Updated |
|---|---|---|
| Label icon | Briefcase icon | **Remove icon** |
| Label EN | Job Description | Job Description *(unchanged)* |
| Label AR | — | وصف الوظيفة |
| Placeholder EN | Paste the full job description here... | Paste the full job description — the more detail, the sharper the analysis. |
| Placeholder AR | — | حط وصف الوظيفة هنا — كل ما كان أطول كان التحليل أدق. |
| Min height | ~3 rows | **8 rows** |
| Focus border | default | `1px solid oklch(0.68 0.13 38.8 / 0.4)` + glow shadow |

### 5.4 CV Upload Zone

| Element | Current EN | New EN | New AR |
|---|---|---|---|
| Label | Upload your CV (Optional) | **Boost Your Score — Add Your CV** | **عندك CV؟ أضفه يطلع التحليل أحسن** |
| Main text | Drag & drop your CV here | **Drop your CV here, or click to browse** | **اسحبه هنا أو اضغط واختاره** |
| Sub text | PDF or DOCX up to 5MB | **PDF or DOCX · Max 5MB** | **PDF أو DOCX · بحد أقصى 5MB** |
| Status text | No CV — Mallah profile only | **Running on Mallah profile only — CV adds prior experience** | **شغّال على ملفك في ملّاح بس — الـ CV يضيف خبراتك اللي برّا** |

**Styling:**
- Dashed border: `--primary` at 25% opacity
- On drag-over:
```tsx
const [isDragging, setIsDragging] = useState(false)

className={cn(
  'border-dashed border rounded-lg transition-all duration-200',
  isDragging
    ? 'border-primary bg-primary/5 [&>svg]:scale-110'
    : 'border-primary/25'
)}
```

### 5.5 Analyze Button — 3 States

| State | Condition | EN | AR | Style |
|---|---|---|---|---|
| Empty | No JD text | Paste a job description to begin | حط وصف الوظيفة أولاً | Disabled, muted |
| Ready | JD has content | **Run Full Analysis** | **حلّل الوظيفة** | Full primary orange |
| Loading | Submitted | **Analyzing… hold tight** | **جاري التحليل...** | Spinner left + text |

**Remove:** The washed-out/disabled-looking orange on the ready state — it should be full primary orange.

### 5.6 View Saved Analyses Button

| Current EN | New EN | New AR |
|---|---|---|
| View Saved Analyses | **My Saved Analyses** | **تحليلاتك المحفوظة** |

**Style change:** `outline` variant only — not a heavy filled button. Gap from Analyze button: `mt-4`.

---

## 6. i18n — `messages/en.json`

Add/update under `Dashboard.Opportunities`:

```json
{
  "tabFeed": "Job Feed",
  "tabCustom": "Analyze a Role",
  "feedLive": "LIVE FEED",
  "feedRefresh": "Refreshes weekly",
  "rolesCount": "{{count}} roles",
  "searchPlaceholder": "Search by title, skill, or company...",
  "allLevels": "All Levels",
  "bestMatch": "Best Match",
  "analyzeBtn": "Run Analysis",
  "missionBrief": "MISSION BRIEF",
  "missionSubtitle": "Paste a job description below. We'll map it against your skills and tell you exactly where you stand.",
  "jdLabel": "Job Description",
  "jdPlaceholder": "Paste the full job description — the more detail, the sharper the analysis.",
  "cvLabel": "Boost Your Score — Add Your CV",
  "cvDrop": "Drop your CV here, or click to browse",
  "cvSub": "PDF or DOCX · Max 5MB",
  "cvStatus": "Running on Mallah profile only — CV adds prior experience",
  "analyzeEmpty": "Paste a job description to begin",
  "analyzeReady": "Run Full Analysis",
  "analyzeLoading": "Analyzing… hold tight",
  "savedBtn": "My Saved Analyses",
  "emptyFeed": "No missions this week — yet. Check back Monday, or paste any job description in Analyze a Role.",
  "expiresIn": "Expires in {{days}} days",
  "expiresTomorrow": "Expires tomorrow"
}
```

---

## 7. i18n — `messages/ar.json`

Same keys under `Dashboard.Opportunities`:

```json
{
  "tabFeed": "وظائف",
  "tabCustom": "حلّل وظيفة",
  "feedLive": "وظائف هذا الأسبوع",
  "feedRefresh": "يتجدد كل أسبوع",
  "rolesCount": "{{count}} وظيفة",
  "searchPlaceholder": "دوّر على وظيفة، مهارة، أو شركة...",
  "allLevels": "كل المستويات",
  "bestMatch": "الأقرب لمستواك",
  "analyzeBtn": "حلّلها",
  "missionBrief": "وش اللي تبي تقدّم عليه؟",
  "missionSubtitle": "حط وصف الوظيفة وبنقولك وين توقف بالضبط.",
  "jdLabel": "وصف الوظيفة",
  "jdPlaceholder": "حط وصف الوظيفة هنا — كلما كان أطول كان التحليل أدق.",
  "cvLabel": "عندك CV؟ أضفه يطلع التحليل أحسن",
  "cvDrop": "اسحبه هنا أو اضغط واختاره",
  "cvSub": "PDF أو DOCX · بحد أقصى 5MB",
  "cvStatus": "شغّال على ملفك في ملّاح بس — الـ CV يضيف خبراتك اللي برّا",
  "analyzeEmpty": "حط وصف الوظيفة أولاً",
  "analyzeReady": "حلّل الوظيفة",
  "analyzeLoading": "جاري التحليل...",
  "savedBtn": "تحليلاتك المحفوظة",
  "emptyFeed": "ما في وظائف الأسبوع هذا — راجع الاثنين. أو روح حلّل وظيفة وحط أي وصف تبيه.",
  "expiresIn": "ينتهي خلال {{days}} أيام",
  "expiresTomorrow": "ينتهي غداً"
}
```

---

## 8. `globals.css` — CSS Additions

Confirm these utilities exist, add if missing:

```css
/* Pulse dot for live feed header */
@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.pulse-dot {
  animation: dotPulse 2s ease-in-out infinite;
}

/* Card entrance stagger */
@keyframes cardEntrance {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.job-card {
  animation: cardEntrance 400ms ease-out both;
  animation-delay: calc(var(--card-index) * 80ms);
}

/* Card hover glow */
.job-card:hover {
  border-color: oklch(0.68 0.13 38.8 / 0.4);
  box-shadow: 0 0 20px oklch(0.68 0.13 38.8 / 0.15);
  transition: all 200ms ease;
}

/* Expiry strip */
@keyframes stripPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
.expiry-strip--urgent {
  animation: stripPulse 1.2s ease-in-out infinite;
}

/* Match bar re-pulse on hover */
@keyframes pulseOnce {
  0%   { opacity: 1; }
  50%  { opacity: 0.6; }
  100% { opacity: 1; }
}
.animate-pulse-once {
  animation: pulseOnce 600ms ease-out;
}

/* Save heart bounce */
@keyframes heartBounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.2); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); }
}
.heart-saved {
  animation: heartBounce 300ms ease-out;
  color: oklch(0.68 0.13 38.8);
}

/* Scanline sweep — runs once */
@keyframes scanSweep {
  from { transform: translateY(-100%); opacity: 0.03; }
  to   { transform: translateY(100%); opacity: 0; }
}
.scanline::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    oklch(0.68 0.13 38.8 / 0.06) 50%,
    transparent 100%
  );
  animation: scanSweep 1.5s ease-in-out forwards;
  pointer-events: none;
}

/* Tab active state — underline indicator */
[data-state="active"] {
  background: transparent;
  border-bottom: 2px solid oklch(0.68 0.13 38.8);
  border-radius: 0;
  color: oklch(0.68 0.13 38.8);
}
```

---

## 9. Files to Touch — Summary

| File | Change Type |
|---|---|
| `OpportunityAnalyzerPage.tsx` | Remove page header + subtitle. Tabs become first element. |
| `FeedHeader.tsx` | Replace "Curated Job Feed" with live status bar + scanline mount effect. |
| `FeedFilters.tsx` | Copy updates only — placeholders and filter labels. |
| `JobCard.tsx` | Full layout restructure — skill tags, match bar, expiry strip, hover glow, stagger animation, save bounce, re-pulse. |
| `EmptyFeedState.tsx` | Copy update + tab switch link. |
| `CustomAnalysisPanel.tsx` | Full restyle — dark panel, mission label, textarea min-height, CV zone drag state, 3-state analyze button, saved button style. |
| `messages/en.json` | Add/update all keys under `Dashboard.Opportunities`. |
| `messages/ar.json` | Add/update all keys under `Dashboard.Opportunities`. |
| `globals.css` | Add all new keyframes and utility classes listed above. |

---

## 10. Files NOT to Touch

- `/actions` — no changes
- `/services` — no changes
- `/types.ts` — no changes
- Results tabs: Overview, Skills, Portfolio, Action Plan, Saved — untouched
- Any feature outside `opportunity-analyzer/`
