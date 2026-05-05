# Agent Prompt — Mallah Portfolio Hub: Project Cards

---

## Context

You are building the **Project Cards** component for Mallah's Portfolio Hub page. There are two card types: **Roadmap** and **External**. Each card has a **collapsed view** (the card itself) and an **expanded view** (a modal that opens on click). Build both types as a single cohesive component system.

---

## Design System (Apply to Everything)

### Theme: Tactical HUD / SaaS Dark

**Primary experience is dark mode.** Light mode exists but dark is the default.

### Color Tokens (OKLCH)

```
--bg:              oklch(0.12 0.01 106)   /* Deep Graphite */
--primary:         oklch(0.68 0.13 38.8)  /* Mallah Orange */
--primary-dim:     oklch(0.68 0.13 38.8 / 0.15)
--primary-border:  oklch(0.68 0.13 38.8 / 0.35)
--fg:              oklch(0.94 0.01 106)   /* Silver Gray */
--muted:           oklch(0.70 0.01 106)   /* Subdued Steel */
--accent:          oklch(0.22 0.01 106)   /* Darkened Slate */
--glass-bg:        oklch(0.18 0.01 106 / 0.85)
--glass-border:    oklch(0.68 0.13 38.8 / 0.18)
--success:         oklch(0.65 0.12 153)   /* Forest Emerald */
--warning:         oklch(0.78 0.13 70)    /* Tactical Amber */
--destructive:     oklch(0.55 0.18 25)    /* Alert Red */
--info:            oklch(0.63 0.10 245)   /* Digital Blue */
```

### Typography

```
--font-main: 'Inter', sans-serif          /* UI text */
--font-mono: 'JetBrains Mono', monospace  /* badges, labels, metadata, coordinates */
```

### Visual Effects

- `.glass` — `backdrop-filter: blur(12px)` + semi-transparent border using `--glass-border`
- `.hud-grid` — geometric overlay using `background-image` repeating grid lines at 30px, color `--primary` at 5% opacity
- `.glow-border` — `box-shadow: 0 0 0 1px var(--primary-border)` on active/hover states
- Status dots with active glow: use `box-shadow: 0 0 6px <color>` on colored dots

---

## Card Types

### Type A — Roadmap Card

Sourced from `user_projects JOIN projects` where `source_type = 'roadmap'`.

#### Collapsed Card — What to Show

| Element             | Notes                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thumbnail           | Resolve: `user_projects.thumbnail_url` → `projects.thumbnail_url` → styled placeholder. Placeholder shows project title + path-color tinted background. Never a broken image. |
| Source badge        | Label: `Roadmap` — styled in `--info` color (Digital Blue)                                                                                                                    |
| Status dot          | Top-right corner dot. Color-coded (see Status section below)                                                                                                                  |
| Title               | From `projects.title`. Not editable.                                                                                                                                          |
| Description preview | From `projects.description`. Truncated to 2 lines. Not editable.                                                                                                              |
| Difficulty badge    | From `projects.difficulty`: Beginner / Intermediate / Advanced                                                                                                                |
| Tech stack tags     | From `user_projects.tech_stack` (TEXT[]). Display-only flat tags. If empty, show nothing.                                                                                     |
| Expand hint         | Small arrow icon + `"expand"` label in mono font, bottom-right. Clickable to open modal.                                                                                      |
| Private ribbon      | If `user_projects.is_public = false`: show a bottom ribbon overlay reading `"Private — Hidden from public portfolio"` in `--destructive` color.                               |

#### Expanded Modal — What to Show (all fields from collapsed +)

| Element              | Notes                                                                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thumbnail            | Full-width at top of modal, same resolution logic as card                                                                                                                                      |
| Privacy banner       | If `is_public = false`: show a warning strip between thumbnail and content: `"Private — Not visible on public portfolio"`                                                                      |
| Title                | Full, untruncated                                                                                                                                                                              |
| Difficulty badge     | Same as collapsed                                                                                                                                                                              |
| Status badge         | Text version of status (see Status section)                                                                                                                                                    |
| Completed date       | `user_projects.completed_at`. Show in mono font if set. Hide if null.                                                                                                                          |
| Source badge         | `Roadmap` in blue                                                                                                                                                                              |
| Description          | Full `projects.description`. Read-only.                                                                                                                                                        |
| Tech stack tags      | Full `user_projects.tech_stack` array. Editable in private view.                                                                                                                               |
| Skills unlocked      | From `project_skills JOIN skills`. Show `skill.name` + `skill.category` as chips. Digital Blue color.                                                                                          |
| GitHub button        | Show if `user_projects.github_url` is set. Hide if null.                                                                                                                                       |
| Live Demo button     | Show if `user_projects.demo_url` is set. Hide if null.                                                                                                                                         |
| Personal Note        | **Roadmap-only field.** From `user_projects.personal_note` (max 300 chars). Style as a left-bordered blockquote in `--primary` orange. If null: show `"No note added yet"` in muted mono text. |
| Visibility toggle    | Private view only. Toggle `user_projects.is_public`.                                                                                                                                           |
| Mark as Complete CTA | Show only if `status != 'completed'`. Opens a completion sub-modal (see below).                                                                                                                |

---

### Type B — External Card

Sourced from `user_projects JOIN projects` where `source_type = 'user_custom'`.

#### Collapsed Card — What to Show

| Element             | Notes                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Thumbnail           | Resolve: `user_projects.thumbnail_url` → styled placeholder with user-upload icon                |
| Source badge        | Label: `External` — styled in `--success` color (Forest Emerald)                                 |
| Status dot          | Same logic as roadmap. External projects only have: In Progress / Completed (no Available state) |
| Title               | From `user_projects.title` (learner-written)                                                     |
| Description preview | From `user_projects.description`. Truncated to 2 lines.                                          |
| Difficulty badge    | From `user_projects.difficulty`                                                                  |
| Tech stack tags     | From `user_projects.tech_stack`. Display-only. If empty, show nothing.                           |
| Expand hint         | Same as roadmap card                                                                             |
| Private ribbon      | Same logic as roadmap card                                                                       |

#### Expanded Modal — What to Show (all fields from collapsed +)

| Element           | Notes                                                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Thumbnail         | Same as collapsed but full-width                                                                                                  |
| Privacy banner    | Same as roadmap if `is_public = false`                                                                                            |
| Title             | Full title. **Editable in private view.**                                                                                         |
| Difficulty badge  | Editable in private view                                                                                                          |
| Status badge      | Text version                                                                                                                      |
| Completed date    | `user_projects.completed_at`. Show in mono if set.                                                                                |
| Source badge      | `External` in green                                                                                                               |
| Description       | Full `user_projects.description` (max 300 chars). **Editable in private view.**                                                   |
| Tech stack tags   | Full array. **Editable in private view.**                                                                                         |
| Formal skills     | From `project_skills JOIN skills`. Same chip style as roadmap. **Editable in private view** (multi-select from verified catalog). |
| GitHub button     | Show if `user_projects.github_url` is set.                                                                                        |
| Live Demo button  | Show if `user_projects.demo_url` is set.                                                                                          |
| ~~Personal Note~~ | **Does not exist on external projects.** Do not render this field at all.                                                         |
| Visibility toggle | Private view only                                                                                                                 |
| Delete button     | External projects only — private view only. Destructive action with confirmation.                                                 |

---

## Status System

| Status              | Applies To            | Dot Color       | Glow       | Text Badge Color |
| ------------------- | --------------------- | --------------- | ---------- | ---------------- |
| `available`         | Roadmap only          | `--muted`       | None       | Muted gray       |
| `in_progress`       | Both                  | `--warning`     | Amber glow | `--warning`      |
| `completed`         | Both                  | `--success`     | Green glow | `--success`      |
| `is_public = false` | Both (completed only) | `--destructive` | Red glow   | `--destructive`  |

> Note: A completed + private project shows the **red private dot**, not the green completed dot. Privacy state takes priority in the dot.

---

## Difficulty Badge Colors

| Level        | Background             | Text                  | Border                |
| ------------ | ---------------------- | --------------------- | --------------------- |
| Beginner     | `--success / 0.12`     | `--success`           | `--success / 0.3`     |
| Intermediate | `--warning / 0.12`     | `--warning`           | `--warning / 0.3`     |
| Advanced     | `--destructive / 0.12` | `oklch(0.70 0.18 25)` | `--destructive / 0.3` |

---

## Skill Category Chip Colors

Skill chips show `skill.name`. Color by `skill.category`:

| Category            | Color Token                           |
| ------------------- | ------------------------------------- |
| `fundamentals`      | `--info` (Digital Blue)               |
| `language`          | `--primary` (Mallah Orange)           |
| `framework_library` | `--success` (Forest Emerald)          |
| `tool`              | `--warning` (Tactical Amber)          |
| `platform_service`  | `oklch(0.63 0.10 245)` (same as info) |
| `practice`          | `--muted`                             |
| `other`             | `--muted`                             |

---

## Views: Private vs Public

### Private View (authenticated learner)

- Shows ALL projects regardless of `is_public`
- Private projects get the bottom ribbon + red status dot
- Edit controls visible: visibility toggle, delete (external only), edit fields
- "Mark as Complete" CTA visible on non-completed roadmap projects

### Public View (anyone with portfolio link)

- Only shows: `is_public = true` AND `status = 'completed'`
- All edit controls hidden
- No private ribbon (those cards don't appear at all)
- Read-only modal

---

## Mark as Complete — Sub-Modal (Private View, Roadmap Only)

Triggered by "Mark as Complete" button on `available` or `in_progress` roadmap cards.

Fields (all optional except status update):

- GitHub URL (text input)
- Live Demo URL (text input)
- Personal Note (textarea, max 300 chars, with char counter)
- Thumbnail upload (JPG / PNG / WebP, max 2MB)
- Tech stack tags (free-text + catalog picker)

On confirm:

- `PATCH user_projects`: `status = 'completed'`, `completed_at = NOW()`, save all provided fields
- Trigger skill unlock for all `project_skills` rows on this project

---

## Thumbnail Placeholder Logic

When no thumbnail is set, render a styled placeholder **inside the card thumbnail area**:

- **Roadmap placeholder**: dark accent background + document/code icon (SVG) centered + project title in small mono text below icon
- **External placeholder**: dark accent background + person/user icon (SVG) centered + `"User Added"` label in small mono text

Never show a broken `<img>` tag. Always resolve the fallback chain before rendering.

---

## Empty States

| Context                              | Message                                                  |
| ------------------------------------ | -------------------------------------------------------- |
| No projects at all                   | `"Finish a project from your roadmap to add it here"`    |
| Public portfolio, everything private | `"This learner hasn't made their portfolio public yet."` |

Style: dashed border, centered mono text, subtle icon above text.

---

## Props Interface (Component API)

```typescript
// Shared base
interface BaseProject {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "available" | "in_progress" | "completed";
  isPublic: boolean;
  techStack: string[]; // user_projects.tech_stack
  skills: ProjectSkill[]; // from project_skills JOIN skills
  githubUrl: string | null;
  demoUrl: string | null;
  completedAt: string | null; // ISO date string
  thumbnailUrl: string | null; // resolved: user override OR admin default OR null
  viewMode: "private" | "public";
}

interface ProjectSkill {
  name: string;
  category:
    | "fundamentals"
    | "language"
    | "framework_library"
    | "tool"
    | "platform_service"
    | "practice"
    | "other";
}

// Roadmap-specific
interface RoadmapProject extends BaseProject {
  sourceType: "roadmap";
  personalNote: string | null; // user_projects.personal_note, max 300 chars
}

// External-specific
interface ExternalProject extends BaseProject {
  sourceType: "user_custom";
  // No personalNote field
}

type Project = RoadmapProject | ExternalProject;
```

---

## What NOT to Include

- No hardcoded project titles, descriptions, or skill names in component logic
- No hardcoded colors outside the token system
- Personal Note field must not render at all on External cards — not even as empty/disabled
- No `Available` status on External cards — they only have `in_progress` or `completed`
- Visibility toggle and delete button must be completely absent in public view — not hidden with CSS, not rendered at all
- Thumbnail must never be a broken image — always resolve the fallback chain

---

## Files to Produce

1. `ProjectCard.tsx` — unified card component, branches on `sourceType`
2. `ProjectModal.tsx` — expanded modal, branches on `sourceType`
3. `projectCards.css` (or inline tokens) — all design tokens and utility classes
4. `ProjectCardGrid.tsx` — grid wrapper with empty state handling
