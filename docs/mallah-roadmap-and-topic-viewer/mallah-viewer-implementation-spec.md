# Mallah — Topic Viewer & Project Viewer
## Implementation Specification (Design + Functionality)

**For:** Frontend agent implementing Topic Viewer and Project Viewer  
**Reference files:** `mallah-topic-viewer.html` · `mallah-project-viewer.html`  
**Rule #1:** The HTML reference files are the visual source of truth. Do not redesign. Translate them into components exactly.

---

## 0. Critical Agent Instructions

Before writing a single line of code, read this section fully.

**You are not designing. You are implementing.** All visual decisions — colors, spacing, component structure, typography, interaction states — are already finalized in the two HTML reference files. Your job is to translate them into production React/Next.js components with real data and full functionality.

When the spec says "as shown in the reference", open the HTML file, find that exact element, and copy its structure, CSS variables, and behavior verbatim.

If you find yourself making a visual decision that isn't described here, stop and look at the HTML file first. If it's still not there, use the design tokens in Section 1 to make the closest possible match.

**Do not:**
- Change the color palette
- Use different fonts
- Redesign component layouts
- Add animations not present in the reference
- Use component libraries (shadcn, MUI, etc.) — write the components from scratch

---

## 1. Design System

### 1.1 Aesthetic Identity

Mallah uses a **Tactical HUD / Mission-Critical SaaS** aesthetic. Every UI decision flows from one concept: this is a career navigation system, not a learning app. It should feel like a cockpit, not a classroom.

The defining visual characteristics are:
- **Deep graphite backgrounds** — not pure black, slightly warm dark
- **Mallah Orange as a precision accent** — used for borders, left-edge stripes, glow states, active indicators. Never as a background fill on large surfaces.
- **JetBrains Mono for all system labels** — stage badges, timestamps, metadata, type chips, button text. This mono font IS the HUD identity.
- **Inter for prose content only** — topic descriptions, resource titles, AI tutor chat bubbles
- **Glassmorphism for floating surfaces** — header bar, sticky action bar, tutor drawer. Always `backdrop-filter: blur(12px)` with the semi-transparent glass background.
- **30px grid overlay** — present on the page background AND on highlighted surface cards (topic band, mission band). Extremely subtle at 4–5% opacity. This is what makes it feel like a HUD, not a generic dark SaaS.
- **Scanline animation on page entry** — a single sweep across the topic/mission header band on load. Runs once. Stops. Signals "active topic loaded."
- **Orange left-border stripe** — the primary visual signal that a surface is active or important. 3px, solid brand orange.
- **Glow effects** — used sparingly. Primary CTA buttons have an orange box-shadow glow. The tutor drawer's left edge has a gradient glow. Never overused.

### 1.2 CSS Design Tokens

Implement all of these as CSS custom properties on `:root`. Use them everywhere — never hardcode a color value.

```css
:root {
  /* Backgrounds */
  --bg-primary:    oklch(0.12 0.01 106);   /* #0f0f0d — page background */
  --bg-surface:    oklch(0.17 0.01 106);   /* #1a1a17 — cards, panels */
  --bg-surface-2:  oklch(0.14 0.01 106);   /* #141412 — nested elements, inputs */
  --bg-surface-3:  oklch(0.22 0.01 106);   /* #222220 — borders, dividers */

  /* Brand */
  --brand:         oklch(0.68 0.13 38.8);  /* Mallah Orange */
  --brand-subtle:  oklch(0.68 0.13 38.8 / 0.10);
  --brand-border:  oklch(0.68 0.13 38.8 / 0.30);
  --brand-glow:    oklch(0.68 0.13 38.8 / 0.15);

  /* Text */
  --text-primary:  oklch(0.94 0.01 106);   /* #f0ede6 — main content */
  --text-muted:    oklch(0.70 0.01 106);   /* #8a8780 — secondary text */
  --text-faint:    oklch(0.50 0.01 106);   /* #4a4845 — timestamps, placeholders */

  /* Status */
  --success:       oklch(0.65 0.12 153);
  --success-bg:    oklch(0.65 0.12 153 / 0.10);
  --success-border:oklch(0.65 0.12 153 / 0.25);
  --success-text:  oklch(0.72 0.12 153);

  --warning:       oklch(0.78 0.13 70);
  --warning-bg:    oklch(0.78 0.13 70 / 0.10);
  --warning-border:oklch(0.78 0.13 70 / 0.25);

  --info:          oklch(0.63 0.10 245);
  --info-bg:       oklch(0.63 0.10 245 / 0.10);
  --info-border:   oklch(0.63 0.10 245 / 0.25);

  --danger:        oklch(0.55 0.18 25);
  --danger-bg:     oklch(0.55 0.18 25 / 0.10);
  --danger-border: oklch(0.55 0.18 25 / 0.25);

  /* Glass surfaces */
  --glass-bg:      oklch(0.14 0.01 106 / 0.88);
  --glass-border:  oklch(0.68 0.13 38.8 / 0.15);
  --glass-blur:    12px;

  /* Grid overlay */
  --grid-size:     30px;
  --grid-color:    oklch(0.68 0.13 38.8 / 0.04);

  /* Typography */
  --font-ui:       'Inter', sans-serif;
  --font-arabic:   'IBM Plex Sans Arabic', sans-serif;
  --font-mono:     'JetBrains Mono', monospace;

  /* Radius */
  --radius-sm:     4px;
  --radius:        8px;
  --radius-lg:     12px;
}
```

### 1.3 Typography Rules

| Use case | Font | Size | Weight | Color |
|---|---|---|---|---|
| Page/section labels | `--font-mono` | 10px | 400 | `--text-faint` |
| Type chips (VIDEO, ARTICLE) | `--font-mono` | 9–10px | 400 | `--text-faint` |
| Stage badges, breadcrumbs | `--font-mono` | 11px | 400 | `--text-muted` |
| Metadata (time, position) | `--font-mono` | 11px | 400 | `--text-muted` |
| Button text | `--font-mono` | 12px | 500 | varies |
| Topic/project title | `--font-ui` | 26px | 600 | `--text-primary` |
| Resource card titles | `--font-ui` | 14px | 500 | `--text-primary` |
| Body/description text | `--font-ui` | 14–15px | 400 | `--text-muted` |
| Chat bubbles | `--font-ui` | 13px | 400 | `--text-primary` |
| Mallah Note content | `--font-ui` | 14px | 400 | `--text-primary` |

All uppercase labels (STAGE 05, VIDEO, ARTICLE, MALLAH NOTE, REQUIREMENTS) must use `letter-spacing: 0.10em` and `text-transform: uppercase`.

### 1.4 Reusable CSS Utilities

Implement these as utility classes:

```css
/* HUD grid overlay — apply to page body and header band backgrounds */
.hud-grid {
  background-image:
    linear-gradient(var(--grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}

/* Glass surface — apply to header bar, action bar, tutor drawer */
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
}

/* Orange glow border — apply to primary CTA buttons and active drawer edge */
.glow-border {
  box-shadow: 0 0 16px var(--brand-glow);
}

/* Scanline animation — apply to topic-band and mission-band */
.scanline-once::after {
  content: '';
  position: absolute;
  top: -2px; left: 0;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, oklch(0.68 0.13 38.8 / 0.5), transparent);
  animation: scanline-sweep 3s ease-in-out 0.3s 1 forwards;
  pointer-events: none;
}
@keyframes scanline-sweep {
  0%   { top: -2px; opacity: 1; }
  100% { top: 102%; opacity: 0; }
}

/* Left-border accent card — apply to topic band, mission band, internal-text card */
.accent-card {
  border-left: 3px solid var(--brand);
  border-radius: var(--radius-lg);
}
```

### 1.5 Difficulty Badge Colors

Always rendered in `--font-mono`, 10px, uppercase:

| Level | Background | Border | Text |
|---|---|---|---|
| Beginner | `--info-bg` | `--info-border` | `--info` |
| Intermediate | `--warning-bg` | `--warning-border` | `--warning` |
| Advanced | `rgba(180,60,60,0.12)` | `rgba(180,60,60,0.25)` | `#c45a5a` |

---

## 2. Page Structure — Both Viewers

Both the Topic Viewer and the Project Viewer share the same outer chrome. Implement this as a shared layout component.

### 2.1 Shared Layout

```
┌──────────────────────────────────────────────────────────┐
│  STICKY HEADER BAR (56px, glass, z-index 100)            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  PAGE CONTENT (scrollable, z-index 1)                    │
│  · Topic Viewer: single column, max-width 760px          │
│  · Project Viewer: two-column grid                       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  STICKY ACTION BAR (64px, glass, fixed bottom, z-index 99│
└──────────────────────────────────────────────────────────┘
```

### 2.2 Page Background

The page `body` background is `--bg-primary` with a `.hud-grid` overlay as a `::before` pseudo-element, `position: fixed`, `inset: 0`, `pointer-events: none`, `z-index: 0`. All content sits on `z-index: 1` or higher.

---

## 3. Topic Viewer — Full Specification

### 3.1 Sticky Header Bar

Height: 56px. Three zones: left (breadcrumb), center (topic title), right (position + tutor button).

**Left — Breadcrumb:**
- Font: `--font-mono`, 11px, `--text-muted`
- Format: `PATH_NAME / STAGE_NAME / TOPIC_TITLE`
- Separators `/` rendered in `--brand` at 60% opacity
- Final segment (current topic) in `--text-primary`
- Overflow: ellipsis on small viewports

**Center — Topic title:**
- Font: `--font-ui`, 14px, weight 500, `--text-primary`
- `max-width: 300px`, `overflow: hidden`, `text-overflow: ellipsis`
- Hidden on viewports narrower than 640px

**Right — Controls:**
- Position badge: `--font-mono`, 11px, format `03 / 07`, pill shape, `--bg-surface` background
- AI Tutor toggle button — see Section 3.7 for full spec

### 3.2 Topic Header Band

The most important surface on the page. It signals to the learner "this topic is now active."

**Structure:**
```
┌─────────────────────────────────────────────────┐  ← accent-card + scanline-once
│ [grid overlay at 4% opacity behind everything]  │
│                                                 │
│  STAGE 03 · ●─── Intermediate                  │  ← mono labels
│                                                 │
│  useEffect & Data Fetching                      │  ← 26px, weight 600
│                                                 │
│  ⏱ 4–5 hrs  ·  Lesson + Practice  ·  Frontend  │  ← mono metadata row
└─────────────────────────────────────────────────┘
```

**CSS:**
- Background: `--bg-surface`
- `position: relative`, `overflow: hidden`
- Apply `.accent-card` (3px orange left border, `--radius-lg`)
- Apply `.scanline-once` — the sweep runs once on mount/page entry
- Apply `.hud-grid` as an absolutely positioned `::before` inside the card at 4% opacity
- Padding: `24px 28px`
- Margin-bottom: `20px`

**Top row:** Stage pill + separator dot + difficulty badge. All in `--font-mono`.

Stage pill:
- Background: `--bg-surface-2`
- Border: `1px solid --bg-surface-3`
- Text: `--text-muted`, uppercase, `letter-spacing: 0.08em`

**Title:** `font-size: 26px`, `font-weight: 600`, `letter-spacing: -0.02em`, `--text-primary`, `margin-bottom: 14px`

**Meta row:** Clock icon SVG + estimated time + dot + topic type + dot + path name. All `--font-mono`, 11px, `--text-muted`.

### 3.3 Summary Block

- Background: `--bg-surface-2`
- Border: `1px solid rgba(255,255,255,0.04)`
- Border-radius: `--radius`
- Padding: `18px 22px`
- Font: `--font-ui`, 14px, `--text-muted`, line-height 1.75
- No heading. Just the paragraph.
- Margin-bottom: `20px`

### 3.4 Resources Section — REDESIGNED

**This section is critical. The previous implementation failed because resources felt hidden and unclear. The new design must make it immediately obvious that this is where the learner goes to start studying.**

#### 3.4.1 Section Header

Render a prominent section header above the resource list — not a tiny mono label:

```
RESOURCES  ──────────────────────────────────────
           Start here · 3 items
```

- "RESOURCES" in `--font-mono`, 12px, `--brand` (orange), uppercase, `letter-spacing: 0.12em`
- Subtitle "Start here · X items" in `--font-mono`, 10px, `--text-muted`
- A full-width horizontal rule in `rgba(255,255,255,0.06)` to the right of the label
- This header must visually anchor the learner's eye to this section immediately

#### 3.4.2 Resource Stack Ordering

Resources always render in this order:
1. `INTERNAL_TEXT` — Mallah's own lesson content (read first)
2. `VIDEO` — primary external resource
3. `ARTICLE` — supplementary reading
4. `CERT` — optional, always last

Add a small ordering indicator on each card: `01`, `02`, `03` in `--font-mono`, faint, top-left of each card. This makes the learning order explicit.

#### 3.4.3 INTERNAL_TEXT Card — "Mallah Note"

This is Mallah's authored lesson content. It should feel like the most important card — the one the learner reads before anything else.

```
┌──────────────────────────────────────────────────────┐
│  01  MALLAH NOTE                                     │  ← orange label
│  ────────────────────────────────────────────────── │
│  Lesson text goes here. Full prose with inline code  │
│  snippets rendered correctly...                      │
└──────────────────────────────────────────────────────┘
```

- Background: `--brand-subtle` (orange at 10%)
- Border: `1px solid --brand-border`
- Border-left: `3px solid --brand`
- Border-radius: `--radius`
- Padding: `18px 22px`
- Label "MALLAH NOTE": `--font-mono`, 10px, `--brand`, uppercase
- A thin divider below the label before the content
- Content text: `--font-ui`, 14px, `--text-primary`, line-height 1.75
- Inline `<code>` elements: `background: rgba(255,255,255,0.08)`, `padding: 1px 5px`, `border-radius: 3px`, `--font-mono`, 12px

#### 3.4.4 VIDEO Card

The video card must feel like a real media object — not a plain link. The learner should immediately understand "I click here to watch a video."

```
┌──────────────────────────────────────────────────────┐
│ 02  VIDEO                                            │
│ ┌──────────┐  Title of the video here               │
│ │  ▶  play │  Channel / Author name                 │
│ │  thumb   │  → Open in new tab                     │
│ └──────────┘                                        │
└──────────────────────────────────────────────────────┘
```

- Card background: `--bg-surface`
- Border: `1px solid rgba(255,255,255,0.06)`
- Border-radius: `--radius`
- Hover state: `border-color: --brand-border`, `transform: translateY(-1px)`, transition 0.2s
- Full card is a clickable `<a>` tag, `target="_blank"`

**Thumbnail area (left, 140×90px):**
- Background: `--bg-surface-2`
- If YouTube URL: attempt to render `https://img.youtube.com/vi/{VIDEO_ID}/mqdefault.jpg` as `<img>`
- If no thumbnail available: show centered orange play button circle
- Play button: 36px circle, `--brand` fill, white triangle icon, centered
- `VIDEO` type chip: absolute top-left, `--font-mono`, 9px, `--text-faint`, dark pill background

**Body (right):**
- Title: `--font-ui`, 14px, weight 500, `--text-primary`
- Channel/author: `--font-ui`, 12px, `--text-muted`
- "→ Open in new tab": `--font-mono`, 11px, `--text-faint`

#### 3.4.5 ARTICLE Card

```
┌──────────────────────────────────────────────────────┐
│  03  ARTICLE                        [ARTICLE chip]   │
│  [favicon]  Article title here                       │
│             source-domain.com                 →      │
└──────────────────────────────────────────────────────┘
```

- Same card style as VIDEO
- Favicon: `<img src="https://www.google.com/s2/favicons?domain={domain}&sz=32">`, 32×32px, rounded 6px. Fallback: generic doc icon SVG.
- `ARTICLE` chip: same style as `VIDEO` chip
- Arrow `→` on far right, transitions to `--brand` on hover with `translateX(2px)`

#### 3.4.6 CERT Card — "Optional Certificate"

Distinct visual — uses info blue, not orange. Clearly marked as optional so learners don't feel blocked.

- Background: `--info-bg`
- Border: `1px solid --info-border`
- Label "OPTIONAL CERTIFICATE": `--font-mono`, 10px, `--info`
- Title, provider, cost note in standard typography
- "Not required to complete this topic" note: `--font-mono`, 11px, `--text-faint`
- "View Certificate →" button: ghost style, `--info` text, `--info-border` border

### 3.5 Practical Output Block (Cybersecurity path only)

Only render when `topic.type === 'lesson_lab'` and `path.id === 'cybersecurity'`.

- Background: `--warning-bg`
- Border: `1px solid --warning-border`
- Border-left: `3px solid --warning`
- Label "PRACTICAL OUTPUT": `--font-mono`, 10px, `--warning`, uppercase
- Content text: `--font-ui`, 14px, `--text-primary`
- Footer note: "Complete this in your lab environment · TryHackMe / Hack The Box / DVWA" — `--font-mono`, 11px, `--text-muted`

### 3.6 Completed State Banner

When `userTopic.status === 'completed'`, render a banner above the topic band (below the header):

- Background: `--success-bg`
- Border: `1px solid --success-border`
- Border-radius: `--radius`
- Content: `✔ Topic completed — you can still review the material anytime.`
- Font: `--font-mono`, 12px, `--success-text`

### 3.7 AI Tutor — REDESIGNED

**The old implementation had the tutor hidden as a small mono label in the header corner. This must change completely. The tutor is one of Mallah's most important features and needs to be unmissable.**

#### 3.7.1 Tutor Toggle Button

The toggle button lives in the sticky header bar, right side. It must be clearly a feature, not a system label.

**Design:**
- Size: taller than a standard pill — `padding: 8px 16px`
- Background: `--brand-subtle` (orange at 10%) — always, not just on hover
- Border: `1px solid --brand-border`
- Border-radius: `--radius`
- Content: chat bubble icon SVG (14px) + "Ask Tutor" text in `--font-mono`, 12px, `--brand`
- When drawer is open: background switches to `--brand` (solid orange fill), text/icon become white
- Hover (when closed): `background: rgba(212,120,42,0.18)`, `border-color: --brand`
- Transition: all 0.2s ease

**The button must look like a feature entry point, not a system toggle.**

**Pulse indicator:** A small orange dot (6px) to the left of the icon when the tutor has never been opened in this topic session. Animates with a `scale + opacity` pulse at 2s interval. Disappears permanently once the tutor is first opened (store in component state, not localStorage).

#### 3.7.2 Tutor Drawer

The drawer slides in from the right. On desktop it pushes the content column (main gets `margin-right: 440px`). On mobile it overlays full-width with a dark scrim.

**Normal mode (side drawer, 420px):**

```
┌────────────────────────────────────┐
│  MALLAH TUTOR     [□ Maximize] [✕]│  ← header
│  useEffect & Data Fetching         │
├────────────────────────────────────┤
│                                    │
│  chat messages...                  │
│                                    │
├────────────────────────────────────┤
│  [chips: Summarize / Practice]     │
├────────────────────────────────────┤
│  [ input field ]           [Send]  │
└────────────────────────────────────┘
```

**Maximize mode (full screen takeover):**

When the user clicks the maximize/expand icon:
- The drawer expands to fill the entire viewport (position fixed, inset 0)
- The chat messages area gets wider and taller
- The header bar now shows "MALLAH TUTOR — [topic name]" with a minimize button `[⊡]` to return to side drawer
- The input area stays at the bottom
- This mode is for deep study sessions where the learner wants to focus entirely on the conversation

**Maximize button:** located in the drawer header, between the title and the close button. Icon: expand/maximize SVG (two outward-facing arrows or a square with arrow). `--font-mono`, muted color, transitions to `--brand` on hover. Tooltip: "Maximize tutor".

**Drawer visual specs:**
- Background: `--bg-surface`
- Left edge: `1px solid --glass-border`
- Left edge glow: `::before` pseudo-element, absolute left -1px, top 20% bottom 20%, 1px wide, `background: linear-gradient(to bottom, transparent, --brand, transparent)`, opacity 0.5 — this is the HUD glow accent
- Open/close transition: `transform: translateX(100%)` → `translateX(0)`, 300ms `cubic-bezier(0.4, 0, 0.2, 1)`
- Box shadow: `-8px 0 32px rgba(0,0,0,0.4)`

**Drawer header (56px):**
- Left: "MALLAH TUTOR" in `--font-mono`, 12px, `--brand`, uppercase + topic subtitle in 11px `--text-muted` below
- Right: Maximize icon button + Close `✕` button
- Border-bottom: `1px solid rgba(255,255,255,0.06)`

**Chat messages area:**
- Scrollable, `flex: 1`, `overflow-y: auto`
- Padding: `20px`
- Gap between messages: `14px`
- Scrollbar: thin, `--bg-surface-3` thumb on transparent track

AI bubble (left-aligned):
- Background: `--bg-surface-2`
- Border: `1px solid rgba(255,255,255,0.05)`
- Border-radius: `10px 10px 10px 2px`
- Padding: `12px 14px`
- Font: `--font-ui`, 13px, `--text-primary`, line-height 1.65

User bubble (right-aligned):
- Background: `--brand-subtle`
- Border: `1px solid --brand-border`
- Border-radius: `10px 10px 2px 10px`
- Same padding and font

Timestamps: `--font-mono`, 9px, `--text-faint`, `padding: 0 4px`

**Quick chips:**
- Container: `padding: 12px 20px`, `border-top: 1px solid rgba(255,255,255,0.04)`
- Each chip: `--font-mono`, 11px, `--text-muted`, `--bg-surface-2` background, `border: 1px solid rgba(255,255,255,0.07)`, `border-radius: 20px`, `padding: 5px 12px`
- Hover: `color: --brand`, `border-color: --brand-border`, `background: --brand-subtle`
- Chips are contextual, from `topic.quick_prompts` or defaults: "Explain differently", "Summarize this topic", "Give me a practice task"

**Input area:**
- Container: `padding: 14px 20px 20px`, `border-top: 1px solid rgba(255,255,255,0.06)`
- Textarea: `--bg-surface-2`, `--text-primary`, `--font-ui`, 13px, `border-radius: 8px`, auto-expands 1–4 rows, `max-height: 120px`
- Focus state: `border-color: --brand-border`
- Send button: 36px square, `--brand` background, white arrow icon SVG, `border-radius: 8px`
- Enter sends. Shift+Enter = newline.

#### 3.7.3 Tutor Context (AI Integration)

The tutor session is scoped to the current topic. On drawer open, if no session exists for this topic:
- Create a new `chat_session` with `type: 'topic_tutor'`, `topic_id`, `user_id`
- Send an initial system message to the AI with topic context (see Section 3.7.4)
- Display a welcome message from the AI

If a session already exists for this topic, load and display the full message history.

#### 3.7.4 Tutor System Prompt

```
You are Mallah Tutor, an AI learning assistant for Mallah, a Saudi Arabia tech learning platform.

You are helping a student with this specific topic:
Topic: {topic.name}
Stage: {stage.name}
Path: {path.name}
Estimated Time: {topic.estimated_time}
Summary: {topic.summary}

The student's profile:
Background: {user.background}
Experience Level: {user.experience_level}
Preferred language: {user.preferred_language}
Detail preference: {user.detail_preference}

Rules:
- Stay focused on this topic. Don't answer questions about other topics or unrelated things.
- Match the student's preferred detail level (concise or detailed).
- If they ask for a practice task, give a short, specific task they can do right now.
- If they ask you to explain again, use a different approach (analogy, code example, diagram description).
- Be direct and technically precise. Don't over-explain basics to advanced learners.
- Respond in {user.preferred_language} if set.
```

### 3.8 Sticky Action Bar

Height: 64px. Fixed bottom. Full width. Glass style.

When tutor drawer is open in side mode: `right: 420px` (shifts left to not overlap drawer). Transition: `right 0.3s ease`.

**Layout — three zones:**

Left: `← Back to Roadmap` — `btn-ghost` style

Center: Primary CTA — changes by state:
- Default: `Mark as Complete` — `--btn-primary` style with `.glow-border`
- Completed: `Completed ✔` — `--success-bg` background, `--success-border` border, `--success-text` color, not interactive

Right: `Next Topic →` — `--font-mono`, 12px, `--brand` text, `--brand-border` border, ghost style. Opacity 0, pointer-events none by default. Becomes visible with opacity 1 when topic is marked complete.

**Button styles:**

```css
.btn-ghost {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-muted);
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}
.btn-ghost:hover { color: var(--text-primary); background: var(--bg-surface); }

.btn-primary {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  background: var(--brand);
  border: 1px solid var(--brand);
  padding: 10px 24px;
  border-radius: var(--radius);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  box-shadow: 0 0 16px var(--brand-glow);
  transition: all 0.2s;
}
.btn-primary:hover { background: oklch(0.62 0.14 38.8); box-shadow: 0 0 24px oklch(0.68 0.13 38.8 / 0.3); }
```

### 3.9 Mark as Complete — Functionality

**On click:**
1. Optimistic UI update — immediately show completed state (banner, button change, next topic button)
2. Call `PATCH /api/user-topics/{user_topic_id}` with `{ status: 'completed', completed_at: new Date() }`
3. On API error: revert to previous state, show toast error

**What updates on completion:**
- Completed banner appears above topic band
- Center CTA → `Completed ✔` state
- Next Topic button becomes visible
- Update roadmap progress in global state (stage completion %, topic status dot)
- If this was the last topic before a project: show a subtle toast "Stage 5 topics complete — ready for the project?"

---

## 4. Project Viewer — Full Specification

### 4.1 Sticky Header Bar

Same glass style as topic viewer. Different right-side content:

Left: Breadcrumb — same format

Center: Hidden (no single "current" title — the project name is in the brief)

Right:
- `PROJECT MILESTONE` badge: `--font-mono`, 10px, `--brand`, `--brand-subtle` bg, `--brand-border` border, `border-radius: 4px`
- Gate chip — two states:
  - Locked: `GATES NEXT STAGE` — `--warning` text, `--warning-bg` bg, `--warning-border` border
  - Unlocked: `STAGE UNLOCKED` — `--success-text` text, `--success-bg` bg, `--success-border` border

Gate chip transitions from locked to unlocked immediately when user submits the project.

### 4.2 Two-Column Layout

```
grid-template-columns: 1fr 380px;
gap: 24px;
max-width: 1200px;
margin: 0 auto;
padding: 28px 24px 120px;
align-items: start;
```

On viewports < 900px: stack to single column, action panel above brief.

### 4.3 Mission Band (Left Column)

Same structure as Topic Header Band with these differences:
- `MISSION_TYPE` label: `PROJECT MILESTONE` or `CAPSTONE PROJECT` in `--font-mono`, 10px, `--brand`
- Title: project title in 26px, weight 600
- Meta row: difficulty badge + time estimate + primary tech stack tag
- Same `.accent-card` + `.scanline-once` + `.hud-grid` treatments

### 4.4 Project Brief (Left Column)

**Description block:** Same style as topic summary block. Prose text about what the project is and why it matters. `--font-ui`, 14px, `--text-muted`.

**Requirements block:**

Section label: "REQUIREMENTS" in mono, `--text-faint`, uppercase

Each requirement row:
- Background: `--bg-surface`
- Border: `1px solid rgba(255,255,255,0.04)`
- Border-radius: `--radius`
- Layout: unchecked checkbox (16px, `--text-faint` border, 3px radius) + requirement text
- These are display-only — not interactive. The actual confirmation is in the submission form.
- Gap: `6px` between rows

**Skills Earned block:**

Section label: "SKILLS YOU'LL EARN"

Skill badges: pill shape, `--bg-surface` bg, `rgba(255,255,255,0.07)` border, `--text-muted` text, colored dot (6px) by level — Beginner=info, Intermediate=warning, Advanced=brand.

**Reference Material block:**

Section label: "REFERENCE MATERIAL"

Compact resource rows (single-line, no thumbnail):
- Background: `--bg-surface`
- Border: `1px solid rgba(255,255,255,0.04)`
- Border-radius: `--radius`
- Layout: type chip (VIDEO/ARTICLE, 9px mono pill) + title (13px) + arrow
- Hover: `border-color: --brand-border`

### 4.5 Action Panel (Right Column)

This is the command center of the project page. It must feel weighty and purposeful — not a form, a mission panel.

**Panel style:**
- Background: `--bg-surface`
- Border: `1px solid --glass-border`
- Border-radius: `--radius-lg`
- `position: sticky`, `top: 76px` (clears the header)
- Left glow: same `::before` glow stripe as tutor drawer

**Panel header (always visible):**
- Padding: `14px 20px`
- Status indicator: colored dot (7px circle) + status label in `--font-mono`, 11px, `--text-muted`
- Status states: `In Progress` (info blue dot), `Under Review` (warning amber dot), `Review Ready` (warning amber dot), `Completed` (success green dot)

**State tabs (for demo/development only):** Remove from production — the panel state is driven by `userProject.status` from the database.

### 4.6 Panel State 1 — Submission Form

Shown when `userProject.status === 'available'` or `'in_progress'`.

```
SUBMIT YOUR PROJECT

GitHub Repository URL *
[ input ]

Live Demo URL (optional)
[ input ]

── CYBERSECURITY PATH ONLY ──
Report PDF Upload *
[ file picker ]
Private Scripts Repo URL (optional)
[ input ]
─────────────────────────────

Personal Note (optional · max 300 chars)
[ input ]

Tech Stack Tags
[React] [TypeScript] [+ Add]

[ Mark Project as Complete → ]
```

**Field specs:**
- All labels: `--font-mono`, 10px, uppercase, `letter-spacing: 0.08em`, `--text-muted`
- Required star `*`: `--brand`
- Optional note: `--text-faint`, 9px
- All inputs: `--bg-surface-2`, `1px solid rgba(255,255,255,0.07)` border, `--font-mono`, 11px, `--text-primary`, `border-radius: 6px`, `padding: 9px 12px`
- Input focus: `border-color: --brand-border`
- Cybersecurity divider: centered label `── CYBERSECURITY PATH ONLY ──` in `--font-mono`, 9px, `--text-faint`, with thin lines either side — only rendered when `path.id === 'cybersecurity'`

**Tech Stack Tags:**
- Existing tags: orange pill style
- `+ Add` tag: dashed border `rgba(255,255,255,0.12)`, `--text-faint`
- On `+ Add` click: small inline text input appears between existing tags

**Submit button:**
- Full width, `--brand` background, white text
- `--font-mono`, 12px, weight 500, uppercase, `letter-spacing: 0.05em`
- `border-radius: 8px`, `padding: 12px`
- `.glow-border` box-shadow
- Hover: darker brand, stronger glow

**Validation:**
- GitHub URL: required for non-cybersecurity paths. Must match `github.com` on blur.
- PDF: required for cybersecurity path. Accepted types: `.pdf`.
- Show inline error in `--danger` below the field on failed validation.
- Do not submit if required fields are empty.

### 4.7 Panel State 2 — Under Review

Shown immediately after submission while AI review is pending (`userProject.review_status === 'pending'`).

```
Submitted · Under Review

"The AI reviewer is scanning your repository
and demo. This usually takes 15–30 seconds."

[════════ animated scan bar ════════]

✔ Stage unlocked — you can continue
learning while the review runs.
```

**Scan bar:**
- Track: `2px` height, `--bg-surface-3` background, `border-radius: 1px`
- Fill: `background: linear-gradient(90deg, transparent, --brand, transparent)`, width 40%, `animation: scanning 1.8s ease-in-out infinite`

```css
@keyframes scanning {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
```

**Unlock note:** `--success-text`, `--success-bg` background, `--success-border` border, `--font-mono`, 11px, `border-radius: 6px`, `padding: 8px 12px`.

### 4.8 Panel State 3 — Review Complete

Shown when `userProject.review_status === 'complete'`.

**Verdict band (full-width colored block):**

Three variants based on `review.overall_verdict`:

| Verdict | Background | Border | Text |
|---|---|---|---|
| `strong` | `--success-bg` | `--success-border` | `--success-text` |
| `solid` | `--warning-bg` | `--warning-border` | `--warning` |
| `needs_work` | `--danger-bg` | `--danger-border` | `--danger` |

Content:
- Left: `● STRONG WORK` / `● SOLID WORK` / `● NEEDS WORK` — `--font-mono`, 11px, uppercase, `letter-spacing: 0.08em`
- Right: fraction `8 / 11` — `--font-mono`, 16px, weight 500

**Requirements list:**

Section label: "REQUIREMENTS" in mono faint

Each row:
- Pass: `✔` in `--success-text` + requirement text in `--text-primary`
- Fail: `✗` in `--danger` + requirement text in `--text-muted`
- Row separator: `1px solid rgba(255,255,255,0.03)`
- Font: 12px, line-height 1.4

**Written feedback:**

"WHAT'S WORKING" section label + prose paragraph (12px, `--text-muted`, line-height 1.65)

"WHAT TO IMPROVE" section label + prose paragraph

**Topics to revisit:**

Only render if `review.recommended_topics` is non-empty.

Section label: "TOPICS TO REVISIT"

Each topic: `·` dot in `--info` + topic name in `--font-mono`, 11px, `--info`. Clickable — navigates to that topic in the roadmap.

**Re-Review button:**
- Full width
- Ghost style: no background, `1px solid rgba(255,255,255,0.08)` border, `--text-muted` text
- Hover: `border-color: --brand-border`, `color: --brand`
- On click: resets panel to State 1 (submission form with pre-filled values) AND creates a new `user_project_reviews` row via `POST /api/project-reviews`

### 4.9 Panel State 4 — Completed (Read-Only)

Shown when `userProject.status === 'completed'` and user is viewing an already-completed project.

Display:
- Completion date in `--font-mono`, faint
- GitHub URL as a clickable link in `--info`
- Demo URL as a clickable link in `--info`
- Personal note in italic, `--text-muted`
- AI verdict in `--success-text`: `● AI Review: Solid Work · 8/11`
- "View Full Review" ghost button that switches panel back to State 3

### 4.10 Mark Project as Complete — Functionality

**On submit button click:**

1. **Validate** required fields. If invalid: show field errors, do not proceed.
2. **Optimistic update:** immediately set panel to State 2 (Under Review). Update gate chip to "Stage Unlocked".
3. **API call:** `POST /api/user-projects/{user_project_id}/submit` with:
   ```json
   {
     "github_url": "...",
     "demo_url": "...",
     "note": "...",
     "tech_tags": ["React", "TypeScript"],
     "pdf_file": <File | null>,
     "scripts_repo_url": "..."
   }
   ```
4. **On API success:**
   - `userProject.status` → `'completed'`
   - `userProject.review_status` → `'pending'`
   - Stage unlock happens server-side — update local stage status in global state
   - Show in-app toast: "Project submitted — AI review running in background."
5. **On API error:** revert panel to State 1, show error toast.
6. **When review completes** (poll `GET /api/user-projects/{id}/review` every 5 seconds while in State 2, or use websocket):
   - Update panel to State 3 with review data
   - Show in-app notification: "Your [Project Name] review is ready."

**Bottom action bar sync:**
- On submit: center CTA → "Submitted" state (no longer clickable)
- Next Stage button becomes visible

---

## 5. Component Map

Implement these as named components:

| Component | Used in |
|---|---|
| `<ViewerHeaderBar>` | Both viewers |
| `<StickyActionBar>` | Both viewers |
| `<HudPageBackground>` | Both viewers (layout wrapper) |
| `<TopicBand>` | Topic Viewer |
| `<SummaryBlock>` | Topic Viewer |
| `<ResourcesSection>` | Topic Viewer |
| `<InternalTextCard>` | Topic Viewer |
| `<VideoCard>` | Topic Viewer + Project Viewer (ref) |
| `<ArticleCard>` | Topic Viewer + Project Viewer (ref) |
| `<CertCard>` | Topic Viewer |
| `<PracticalOutputBlock>` | Topic Viewer (cybersec only) |
| `<TutorButton>` | Topic Viewer header |
| `<TutorDrawer>` | Topic Viewer |
| `<TutorChatMessage>` | TutorDrawer |
| `<MissionBand>` | Project Viewer |
| `<ProjectBrief>` | Project Viewer |
| `<RequirementsDisplay>` | Project Viewer |
| `<ActionPanel>` | Project Viewer |
| `<SubmissionForm>` | ActionPanel State 1 |
| `<ReviewPending>` | ActionPanel State 2 |
| `<ReviewResult>` | ActionPanel State 3 |
| `<CompletedReadOnly>` | ActionPanel State 4 |

---

## 6. Data Dependencies

### Topic Viewer expects:
```typescript
topic: {
  id: string
  name: string
  summary: string
  estimated_time: string
  type: 'lesson_practice' | 'lesson_lab' | 'concept' | 'concept_practice'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  resources: Resource[]
  quick_prompts?: string[]
}
stage: { name: string; number: number }
path: { id: string; name: string }
userTopic: { status: 'not_started' | 'in_progress' | 'completed'; completed_at?: Date }
user: { id: string; background: string; experience_level: string; preferred_language: string; detail_preference: string }
navigation: { current: number; total: number; next_topic_id?: string; prev_topic_id?: string }
```

### Project Viewer expects:
```typescript
project: {
  id: string
  name: string
  type: 'project_milestone' | 'project_capstone'
  description: string
  estimated_time: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  requirements: string[]
  skills_earned: { name: string; level: 'beginner' | 'intermediate' | 'advanced' }[]
  reference_resources: Resource[]
  tech_stack: string[]
}
stage: { name: string; number: number; next_stage_id?: string }
path: { id: string; name: string }
userProject: {
  id: string
  status: 'available' | 'in_progress' | 'completed'
  review_status: 'none' | 'pending' | 'complete' | 'failed'
  github_url?: string
  demo_url?: string
  note?: string
  tech_tags?: string[]
  completed_at?: Date
}
review?: {
  overall_verdict: 'strong' | 'solid' | 'needs_work'
  requirements_results: { requirement: string; passed: boolean; note: string }[]
  strengths: string
  improvements: string
  recommended_topics: string[]
  submission_number: number
  created_at: Date
}
```

---

## 7. What the HTML Reference Files Are For

The two HTML files (`mallah-topic-viewer.html` and `mallah-project-viewer.html`) are the **pixel-accurate design reference**. Use them to:

- Extract exact CSS values for every component
- Understand the full interaction model (open the files in a browser and click through every state)
- Copy markup structure directly — the class names, nesting, and element types are intentional
- Verify your implementation matches visually before considering a component done

The HTML files show:
- Topic Viewer: lesson mode, lab mode (cybersec), completed state, tutor drawer open/closed, quick chip interactions
- Project Viewer: all 4 panel states (Submit → Reviewing → Result → Completed), gate chip transitions, bottom bar sync

**When in doubt: open the HTML file in a browser and match it exactly.**
