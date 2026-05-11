# Agent Spec — Portfolio Hub: Project Organization System
## Feature: Status Tabs + Type Filters + Full State Logic

---

## 1. Context & Current Architecture

**What exists today:**
- `ProjectsSection` — top-level wrapper, has `useState` for `isAddOpen` (drawer)
- `ProjectCardGrid` — orchestrates grid layout and empty states
- `ProjectCard` — single project card with `useState` for `isModalOpen`
- `ProjectModal` — expanded detail view
- `AddExternalProjectDrawer` — fully built, wired with Zod validation

**Data:** Single combined query in `portfolio-service.ts` fetches `user_projects JOIN projects` + `project_skills`. All fields needed for filtering (`status`, `source_type`, `is_public`) are already in the bundle. No new queries needed — all filtering is pure client-side derived state.

**URL params:** `initialOpenProjectId` already supported. Extend this pattern for filter persistence.

---

## 2. What You Are Building

A complete project organization system on top of the existing architecture:

1. **Status tab bar** — primary filter axis
2. **Type filter chips** — secondary filter axis
3. **Visibility toggle** — tertiary filter (owner view only)
4. **Revised state machine** — updated logic for all project types
5. **Revised CTAs** — per-card action buttons matching state
6. **Revised drawer** — `Available` added as a status option
7. **Delete flow** — external projects only
8. **Unmark complete flow** — external projects only
9. **URL persistence** for all active filters

---

## 3. Revised State Machine

### States

| State | Roadmap | External | Description |
|---|---|---|---|
| `available` | ✅ | ✅ | Not started. Roadmap: auto-created when prerequisites complete. External: manually set in drawer OR pushed from Analysis tab "Add to Portfolio Hub" button. |
| `in_progress` | ✅ | ✅ | Actively being worked on. |
| `completed` | ✅ | ✅ | Finished. Public-eligible. |

### State Transitions

```
ROADMAP:
  available   → in_progress   : "Start Project" button (no confirmation needed)
  in_progress → completed     : "Mark as Complete" sub-modal (with optional fields)
  completed   → [locked]      : No reversal. Skill unlocks already fired.

EXTERNAL:
  available   → in_progress   : "Start Project" button (no confirmation needed)
  in_progress → completed     : "Mark as Complete" → single confirm dialog
  completed   → available     : "Unmark Complete" → confirm dialog with warning
                                (reverts to available, NOT in_progress — intentional)
  any state   → deleted       : "Delete Project" → two-step confirm (external only)
```

### Why completed reverts to `available` not `in_progress`

When a learner unmarks a completed external project, they are saying "this isn't done." Dropping it back to `in_progress` would be dishonest about the current state. `available` puts it back in the waiting list — from there they consciously press "Start Project" to re-enter `in_progress`. This keeps all transitions intentional.

### Data behavior on Unmark Complete

When an external project reverts from `completed` → `available`:
- `status = 'available'`
- `completed_at = NULL`
- `is_public = false` (auto-set — a non-completed project must not appear on public portfolio)
- All other fields (GitHub URL, demo URL, tech stack, skills, thumbnail, description) are **preserved**. Do not wipe them.

---

## 4. Filter State

### Add to `ProjectsSection`

```typescript
type StatusFilter  = 'all' | 'available' | 'in_progress' | 'completed'
type TypeFilter    = 'all' | 'roadmap' | 'external'     // 'external' maps to source_type = 'user_custom'
type VisibilityFilter = 'all' | 'public' | 'private'    // owner view only

const [statusFilter,     setStatusFilter]     = useState<StatusFilter>('all')
const [typeFilter,       setTypeFilter]       = useState<TypeFilter>('all')
const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all')
```

### Derived filtered array (computed before passing to `ProjectCardGrid`)

```typescript
const filtered = projects
  .filter(p => statusFilter === 'all' || p.status === statusFilter)
  .filter(p => typeFilter   === 'all' ||
    (typeFilter === 'roadmap'   && p.source_type === 'roadmap') ||
    (typeFilter === 'external'  && p.source_type === 'user_custom'))
  .filter(p => visibilityFilter === 'all' ||
    (visibilityFilter === 'public'  &&  p.is_public) ||
    (visibilityFilter === 'private' && !p.is_public))
```

### Tab badge counts

Counts are derived from the **unfiltered** `projects` array (before type/visibility filters apply) so they don't cascade into confusing zeroes:

```typescript
const counts = {
  all:         projects.length,
  available:   projects.filter(p => p.status === 'available').length,
  in_progress: projects.filter(p => p.status === 'in_progress').length,
  completed:   projects.filter(p => p.status === 'completed').length,
}
```

---

## 5. UI Layout — `ProjectsSection`

```
┌─────────────────────────────────────────────────────────────────┐
│  [All (12)] [Available (3)] [In Progress (2)] [Completed (7)]   │  ← Status tabs
│                                                                  │
│  Type: [All Types] [Roadmap] [External]    Visibility: [All ▾]  │  ← Filter row (owner only)
│                                                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐                  [+ Add Project]    │
│  │ card │ │ card │ │ card │                                      │
│  └──────┘ └──────┘ └──────┘                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Status Tabs

- Render as a tab bar using the Mallah HUD design system
- Active tab: `--primary` orange underline + text color
- Inactive tabs: `--muted` color
- Badge count: shown in a small pill next to each label using `--font-mono`
- If a tab count is `0`, still show the tab — do not hide it
- `Available` tab is **visible in owner view only** — hide entirely in public view

### Type Filter Chips (owner view only)

- Render as pill/chip buttons below the tab bar
- Active chip: `--primary-dim` background + `--primary-border` border + `--primary` text
- Inactive: `--accent` background + `--glass-border` border + `--muted` text
- Label mapping: `'roadmap'` → "Roadmap" · `'user_custom'` → "External"

### Visibility Toggle (owner view only)

- Render as a compact dropdown or segmented control, right-aligned in the filter row
- Options: `All` · `Public only` · `Private only`
- Default: `All`

### Filter row visibility

- In **public view**: hide the entire filter row (tabs, chips, visibility toggle). Public view is always read-only and already pre-filtered at service level.
- In **owner view**: show all controls.

---

## 6. URL Persistence

Extend the existing `initialOpenProjectId` query param pattern.

**Params to sync:**

```
/portfolio?tab=completed&type=external&visibility=public
```

| Param | Values | Default |
|---|---|---|
| `tab` | `all` \| `available` \| `in_progress` \| `completed` | `all` |
| `type` | `all` \| `roadmap` \| `external` | `all` |
| `visibility` | `all` \| `public` \| `private` | `all` |

**Behavior:**
- Read all three params on mount with `useSearchParams`
- Write to URL on every filter change (replace, not push — don't pollute history)
- If a param value is the default (`all`), omit it from the URL to keep it clean
- `visibility` param is **ignored silently** in public view even if present in URL

---

## 7. Revised CTA Buttons Per Card State

### Card-level CTAs (shown on the card itself, bottom of card body)

| State | Roadmap | External |
|---|---|---|
| `available` | `"Start Project"` button | `"Start Project"` button |
| `in_progress` | `"Mark as Complete"` button | `"Mark as Complete"` button |
| `completed` | No CTA (locked) | `"Unmark Complete"` button (ghost/muted style) |

### Modal-level CTAs (shown in `ProjectModal` footer, owner view only)

| State | Roadmap | External |
|---|---|---|
| `available` | `"Start Project"` | `"Start Project"` + `"Delete"` (destructive) |
| `in_progress` | `"Mark as Complete"` | `"Mark as Complete"` + `"Delete"` (destructive) |
| `completed` | Visibility toggle only | `"Unmark Complete"` + `"Delete"` (destructive) |

**Delete button:** external projects only, all states, owner view only. Right-aligned in modal footer. Style: `--destructive` color, ghost variant. Never show on roadmap projects.

---

## 8. Action Flows

### 8.1 Start Project (both types)

1. Learner clicks "Start Project" on an `available` card or modal
2. No confirmation dialog needed — low-stakes action
3. `PATCH user_projects`: `status = 'in_progress'`
4. Card re-renders with `in_progress` state dot and "Mark as Complete" CTA
5. Tab badge counts update immediately (optimistic UI)

---

### 8.2 Mark as Complete — Roadmap

1. Learner clicks "Mark as Complete" on an `in_progress` roadmap card
2. Opens a **completion sub-modal** (separate from `ProjectModal`) with fields:
   - GitHub URL (text input, optional)
   - Live Demo URL (text input, optional)
   - Personal Note (textarea, max 300 chars, with live char counter, optional)
   - Thumbnail upload (JPG/PNG/WebP, max 2MB, optional — overrides admin default)
   - Tech stack tags (free-text + catalog picker, pre-filled if already set, optional)
3. "Complete Project" confirm button
4. `PATCH user_projects`: `status = 'completed'`, `completed_at = NOW()`, save all provided fields
5. Trigger skill unlock: for each `project_skills` row on this project → upsert `user_skills` with `source = 'project'`
6. Close sub-modal, card re-renders as `completed`
7. Tab counts update

---

### 8.3 Mark as Complete — External

1. Learner clicks "Mark as Complete" on an `in_progress` external card
2. Single confirm dialog (not a full sub-modal): `"Mark this project as complete?"` with confirm + cancel
3. `PATCH user_projects`: `status = 'completed'`, `completed_at = NOW()`
4. **No skill unlock** — skills were assigned manually at creation time, no system trigger needed
5. Card re-renders as `completed`

---

### 8.4 Unmark Complete — External Only

1. Learner clicks "Unmark Complete" on a `completed` external card or modal
2. Confirm dialog with warning message:
   > "This will move the project back to your waiting list. It will be hidden from your public portfolio immediately."
3. On confirm:
   - `PATCH user_projects`: `status = 'available'`, `completed_at = NULL`, `is_public = false`
   - All other fields preserved (GitHub URL, demo URL, tech stack, skills, thumbnail, description)
4. Card re-renders as `available` with private ribbon if applicable
5. If active filter tab is `completed`, this card disappears from the current view — expected behavior

---

### 8.5 Delete Project — External Only

Two-step confirmation:

**Step 1 — Base confirm dialog:**
> "Delete [Project Title]? This will permanently remove it from your portfolio and cannot be undone."

**Step 2 — Additional warning (show only if `is_public = true` AND `status = 'completed'`):**
> "This project is currently visible on your public portfolio. Deleting it will remove it from public view immediately."

Both steps shown as a single dialog with layered messaging — not two separate dialogs.

On confirm:
- Delete `user_projects` row
- If `projects` row has `source_type = 'user_custom'` and no other `user_projects` reference it → delete the `projects` row too
- Close modal, remove card from grid with exit animation
- Update tab counts

---

## 9. Revised `AddExternalProjectDrawer`

Add `Available (Waiting List)` as a third status option at creation time.

### Status field (currently: `In Progress` / `Completed`)

Update to three options:

```
○ Available — Add to my waiting list, I'll work on this later
○ In Progress — I'm currently working on this
○ Completed — I've already finished this
```

Default selection: `In Progress` (preserve existing behavior)

### If `Available` is selected

- Hide GitHub URL, Live Demo URL fields (not relevant yet)
- Still show: Title, Description, Difficulty, Thumbnail, Tech Stack, Formal Skills
- On save: `status = 'available'`, `is_public = false` (waiting list projects are private by default)

### If `Completed` is selected

- Show all fields including GitHub URL, Live Demo URL
- On save: trigger the same skill unlock flow as 8.3
- `status = 'completed'`, `completed_at = NOW()`, `is_public = true` by default

---

## 10. Empty States Per Filter Combination

All empty states rendered by `ProjectCardGrid`. Use the existing dashed-border container style.

| Active filters | Message |
|---|---|
| No projects at all (owner) | `"Complete topics in your roadmap or add your own projects to get started."` |
| Tab: `available`, no results | `"No projects in your waiting list. Start a roadmap project or add your own."` |
| Tab: `in_progress`, no results | `"No projects in progress. Pick something from your waiting list to start."` |
| Tab: `completed`, no results | `"No completed projects yet. Finish a project to add it here."` |
| Type: `roadmap`, no results | `"No roadmap projects match this filter."` |
| Type: `external`, no results | `"No external projects match this filter. Add one with the button above."` |
| Visibility: `private`, no results | `"No private projects. All your projects are currently public."` |
| Public view, nothing to show | `"This learner hasn't made their portfolio public yet."` |

---

## 11. Visibility Rules Summary

| State | Can be public? | Default `is_public` |
|---|---|---|
| `available` | ❌ Never — hidden from public regardless | `false` |
| `in_progress` | ❌ Never — hidden from public regardless | `false` |
| `completed` | ✅ Yes — learner controls toggle | `true` |

Even if a learner manually sets `is_public = true` on an `available` or `in_progress` project, the public portfolio service filters `WHERE status = 'completed'` — so it will never appear publicly. No need to block the toggle UI, just silently enforce at the query level.

---

## 12. Analysis Tab Integration

The "Add to Portfolio Hub" button in the Opportunity Analyzer creates an external project entry:

```typescript
// Values passed from Analysis tab
{
  source_type:  'user_custom',
  status:       'available',
  is_public:    false,
  title:        <job-derived project title>,
  description:  <job-derived description>,
  // All other fields null/empty — learner fills them in later
}
```

On creation, the learner is redirected (or shown a toast) to the Portfolio Hub with `?tab=available` so they land directly on their waiting list.

---

## 13. Files to Modify

| File | Change |
|---|---|
| `ProjectsSection.tsx` | Add `statusFilter`, `typeFilter`, `visibilityFilter` state + URL sync + filter row UI + derived filtered array |
| `ProjectCardGrid.tsx` | Accept filtered array (no internal changes needed) + update empty state messages |
| `ProjectCard.tsx` | Add CTA buttons per state + type. Wire Start / Mark Complete / Unmark actions |
| `ProjectModal.tsx` | Add modal-level CTAs + Delete button (external only) + Unmark flow |
| `AddExternalProjectDrawer.tsx` | Add `Available` as third status option + conditional field visibility |
| `portfolio-service.ts` | Add `updateProjectStatus()`, `deleteExternalProject()` service methods |
| `usePortfolioFilters.ts` | New hook — encapsulates filter state + URL sync logic (keeps `ProjectsSection` clean) |

---

## 14. New Hook: `usePortfolioFilters`

Extract all filter logic into a dedicated hook to keep `ProjectsSection` clean:

```typescript
// hooks/usePortfolioFilters.ts

export function usePortfolioFilters(projects: Project[], isOwner: boolean) {
  // Reads/writes URL params
  // Returns: statusFilter, typeFilter, visibilityFilter, setters, filtered array, counts
}
```

Returns:
```typescript
{
  statusFilter,     setStatusFilter,
  typeFilter,       setTypeFilter,
  visibilityFilter, setVisibilityFilter,
  filteredProjects,  // derived array ready for ProjectCardGrid
  counts: {          // from unfiltered array for tab badges
    all, available, in_progress, completed
  }
}
```
