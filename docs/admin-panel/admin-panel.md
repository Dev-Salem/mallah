# Mallah – Admin Panel v2

## 1. Purpose

Internal control center for Mallah administrators to manage all learning content, monitor
platform health, review learner activity, and maintain the skills and projects catalog.

The admin panel is completely invisible to learners. It exists on a separate URL, uses a
separate login page, and is never linked to or referenced anywhere in the learner-facing UI,
codebase comments, sitemaps, or API responses.

---

## 2. Core Design Principles

- **Task-oriented layout.** Admins visit to do something specific — create content, check stats,
  fix an issue. Every screen must make the most common task reachable in 2 clicks or fewer.
- **Data density with HUD polish.** Tables, inline filters, and side-drawer editing — but wrapped
  in the full Mallah Tactical HUD aesthetic. The panel is a tool, but it should feel like a
  high-tech mission control system, not a generic Bootstrap admin template.
- **Safe destructive actions.** Deleting or deactivating content that learners depend on requires
  a confirmation step that shows the real impact before proceeding.
- **Audit everything.** Every content change, login, and account action is logged with who, what,
  when, and from where.
- **Complete invisibility to learners.** No learner-facing page, API response, sitemap entry,
  or error message ever references the admin URL or login.

---

## 3. Tech Stack

| Layer          | Technology                                                              |
|----------------|-------------------------------------------------------------------------|
| Framework      | Next.js 16.1.6 — App Router (`/app` directory)                          |
| Styling        | Tailwind CSS 4.0                                                         |
| UI Components  | shadcn/ui (Radix UI primitives)                                          |
| Icons          | Lucide React (consistent with learner app)                               |
| Toasts         | Sonner (shadcn/ui integration) — used for all success/error feedback     |
| State          | React Server Components where possible, client components for interactivity |
| Data Fetching  | Server Actions + API routes under `/api/admin/`                           |

---

## 4. Visual Identity — Tactical HUD Theme

The admin panel uses the **full Mallah Tactical HUD / Mission Control theme**. It shares the
same design language as the learner-facing app — dark-first, glassmorphism, geometric overlays,
animated scanlines, and high-tech UI glows.

### 4.1 Core Palette (OKLCH)

| Token       | Dark Mode (Primary)                          | Light Mode                  |
|-------------|----------------------------------------------|-----------------------------|
| Background  | `oklch(0.12 0.01 106)` — Deep Graphite       | `oklch(0.96 0.01 106)`      |
| Primary     | `oklch(0.68 0.13 38.8)` — Mallah Orange      | `oklch(0.62 0.14 39)`       |
| Foreground  | `oklch(0.94 0.01 106)` — Silver Gray         | `oklch(0.12 0.01 106)`      |
| Muted       | `oklch(0.70 0.01 106)` — Subdued Steel       | `oklch(0.94 0.01 106)`      |
| Accent      | `oklch(0.22 0.01 106)` — Darkened Slate      | `oklch(0.92 0.01 106)`      |

**Status Colors:**
- Success: Forest Emerald — `oklch(0.65 0.12 153)`
- Warning: Tactical Amber — `oklch(0.78 0.13 70)`
- Destructive: Alert Red — `oklch(0.55 0.18 25)`
- Info: Digital Blue — `oklch(0.63 0.10 245)`

**Dark Mode is the default and intended primary experience.** Light mode exists for
accessibility but is not the design target.

### 4.2 Typography

| Context              | Font Family             | Usage                                            |
|----------------------|-------------------------|--------------------------------------------------|
| English / Universal  | Inter                   | All UI text — labels, headings, body, buttons     |
| Arabic               | IBM Plex Sans Arabic    | Reserved for future localization                  |
| Data / Metrics / Code| JetBrains Mono          | Stat card values, table numeric columns, timestamps, IDs, environment variables, audit log entries |

### 4.3 Visual Effects (CSS Utilities)

Applied throughout the admin panel — not optional or decorative-only.

| Utility Class   | Effect                                                                 | Where Applied                                    |
|-----------------|------------------------------------------------------------------------|--------------------------------------------------|
| `.hud-grid`     | Geometric overlay with 30px grid-size, `color-mix` primary at 5% opacity | Page backgrounds, login page                     |
| `.scanline`     | Vertical sweeping animation — "active monitoring" feel                 | Main content area background (subtle)            |
| `.glass`        | `backdrop-filter: blur(12px)` + semi-transparent border (primary)      | Sidebar, cards, drawers, modals, login card      |
| `.glow-border`  | Subtle outer glow using primary brand color                            | Active modules, focused inputs, hover states     |

### 4.4 shadcn/ui Component Styling

Every UI element maps to a specific shadcn/ui component with HUD customization:

| UI Element                  | Component           | HUD Treatment                                                            |
|-----------------------------|---------------------|--------------------------------------------------------------------------|
| Stat cards                  | `Card`              | `.glass` bg, `.glow-border` on hover, JetBrains Mono values             |
| Data tables                 | `Table`             | Striped rows (accent at 5%), sticky headers, horizontal scroll on mobile |
| Side drawers                | `Sheet` (right)     | `.glass` bg, 480px width desktop, full-width mobile                      |
| Confirmation modals         | `AlertDialog`       | `.glass` bg, destructive button for dangerous actions                    |
| Dropdowns                   | `Select`            | Dark popover with `.glass`, orange on active item                        |
| Toggles                     | `Switch`            | Orange when active, muted when off                                       |
| Buttons (primary)           | `Button` default    | Mallah Orange bg, dark text                                              |
| Buttons (destructive)       | `Button` destructive| Alert Red bg                                                             |
| Buttons (ghost)             | `Button` ghost      | Transparent, orange text on hover                                        |
| Text inputs                 | `Input`             | Dark bg, subtle border, orange focus ring                                |
| Badges                      | `Badge`             | Green (active/verified), amber (pending/invited), red (blocked), muted (inactive/expired) |
| Tooltips                    | `Tooltip`           | `.glass` popover                                                         |
| Breadcrumbs                 | Custom + `Separator`| Muted text, orange for current segment                                   |
| Warning banners             | `Alert` warning     | Tactical Amber left border + TriangleAlert icon                          |
| Tabs                        | `Tabs`              | Orange underline active, muted inactive                                  |
| Search inputs               | `Input` with icon   | Search icon prefix, muted placeholder                                    |
| Pagination                  | `Pagination`        | Ghost buttons, orange current page                                       |
| Success/error feedback      | `Sonner` toast      | Bottom-right position, auto-dismiss 4s for success, sticky for errors    |
| Skeleton loading            | `Skeleton`          | Pulsing dark rectangles matching data shape                              |
| Empty states                | Custom              | Centered muted text + icon + CTA button where applicable                 |

### 4.5 Responsive Behavior

Optimized for desktop (1280px+). Tablet supported. Mobile is functional but not primary.

| Breakpoint       | Sidebar                              | Tables                   | Drawers          |
|------------------|--------------------------------------|--------------------------|------------------|
| Desktop ≥1280px  | Fixed 240px, always visible          | Full width               | 480px from right |
| Tablet 768–1279  | 64px icon rail, click to expand      | Full width, dense        | 480px from right |
| Mobile <768px    | Hamburger → overlay                  | Horizontal scroll        | Full width       |

---

## 5. Route Structure (Next.js App Router)

```
/app/[adminPath]/
├── login/page.tsx                ← Admin login (public, no shell)
├── setup/page.tsx                ← Set-password for invited admins (public, no shell)
├── layout.tsx                    ← Admin shell: sidebar + content wrapper + auth check
├── dashboard/page.tsx
├── content/
│   ├── paths/page.tsx
│   ├── topics/page.tsx
│   └── skills/page.tsx
├── projects/page.tsx
├── jobs/page.tsx
├── learners/page.tsx
├── audit-log/page.tsx            ← super only
└── settings/page.tsx             ← super only
```

**Middleware behavior:**
1. Check `[adminPath]` matches `process.env.ADMIN_PANEL_PATH` → if no: return 404.
2. If path is `/login` or `/setup` → allow without session (these are public entry points).
3. For all other paths: check valid admin session → if no session: return 404 (never redirect to login, never confirm the path exists).
4. If session valid → proceed. Layout renders sidebar + content.

---

## 6. Access & Security

### 6.1 Admin URL — Obscured Entry Point

```
mallah.app/{ADMIN_PANEL_PATH}
```

`ADMIN_PANEL_PATH` is an environment variable (e.g. `manage-c7x2k`) set once at deployment.

**Rules:**
- Never hardcoded — always `process.env.ADMIN_PANEL_PATH`.
- `/admin` or `/administrator` → 404. No redirect.
- Correct path + no admin session → 404. Never confirm the path exists.
- Excluded from sitemap and `robots.txt`.

### 6.2 Two Admin Levels

| Level    | Can Do                                                                                 |
|----------|----------------------------------------------------------------------------------------|
| `normal` | Create, edit, deactivate content. View stats and learner list. Block/unblock learners. |
| `super`  | Everything normal can do + delete content, manage admin accounts, view audit log, access Settings. |

The first `super` admin is seeded directly in the database at deployment (bootstrapping protection).

### 6.3 Admin Level Visibility in the UI

| Location                     | Normal Admin Sees                    | Super Admin Sees                      |
|------------------------------|--------------------------------------|---------------------------------------|
| Sidebar footer               | Name + muted `ADMIN` badge           | Name + orange `SUPER` badge           |
| Sidebar nav: Audit Log       | Hidden (absent)                      | Visible                               |
| Sidebar nav: Settings        | Hidden (absent)                      | Visible                               |
| Delete buttons (paths, etc.) | Hidden (absent)                      | Visible                               |
| Dashboard: View Audit Log    | Hidden                               | Visible                               |
| Direct URL to super route    | 403 page: "No permission" + back btn | Normal access                         |

---

## 7. Complete Flow: Admin Login

### 7.1 Login Page (`/{ADMIN_PANEL_PATH}/login`)

**Visual:** Deep Graphite background with `.hud-grid` overlay. Centered `.glass` card. Subtle `.scanline` on background. No Mallah logo, no tagline, no marketing, no product name. Just the form.

**Fields:**
- Email (`Input`, required)
- Password (`Input` type password, required)
- "Sign In" `Button` (primary, full width, `.glow-border` on focus)

**No other links visible.** No Register, no Forgot Password, no Back to Home.

**On submit (frontend):**
1. Disable button, show spinner inside it.
2. POST `/api/admin/auth/login` with `{ email, password }`.
3. On success → redirect to `/{ADMIN_PANEL_PATH}/dashboard`.
4. On failure → show inline error below the form: "Invalid credentials." (generic — never reveals which field was wrong or whether the email exists).
5. Re-enable button.

**Backend login steps (in exact order):**
1. Check `users.email` match → if no match: return generic error.
2. Check `users.role = 'admin'` → if not admin: return generic error (never reveal a learner account exists).
3. Check `admins` table has matching row → if not: return generic error.
4. Check `users.status = 'active'` → if blocked: return generic error.
5. Verify password against `users.password_hash` → if wrong: return generic error.
6. All pass: issue admin session token (scoped, separate from learner sessions).
7. Log `admin_login` to `admin_audit_log` with IP address.
8. Return success + redirect URL.

**On any failure at any step:** return `{ error: "Invalid credentials." }`. Log `admin_login_failed` with email and IP.

**Session rules:**
- Expires after **2 hours of inactivity**.
- No "Remember Me" option.
- Every `/api/admin/*` request re-validates session + role server-side.

### 7.2 Setup Page (`/{ADMIN_PANEL_PATH}/setup?token=...`)

Used by invited admins to set their password. Same visual treatment as login page.

**On load:**
1. Extract `token` from URL params.
2. GET `/api/admin/auth/invite/:token` to validate.
3. If valid → show form with admin's email (read-only), password field, confirm password field, "Activate Account" button.
4. If invalid/expired → show: "This invite link has expired or is invalid. Contact a super admin for a new invite." No login link shown (don't confirm the admin path exists).
5. If already used → show: "This invite has already been used. You can sign in." + link to login page.

**On submit:**
1. POST `/api/admin/auth/setup` with `{ token, password }`.
2. Backend validates token again, sets `password_hash`, marks invite `status = 'accepted'`, sets `accepted_at`.
3. Logs `admin_invite_accepted`.
4. Redirect to login page with `Sonner` toast: "Account activated. Sign in to continue."

**Password requirements:** Same as learner — minimum 8 characters, at least one letter and one number.

### 7.3 Session Expiry

When an admin's session expires mid-work:
1. The next API call returns 401.
2. Frontend redirects to `/{ADMIN_PANEL_PATH}/login`.
3. Any unsaved form data is lost (no auto-save in v1).
4. No "session expired" message — just the login page. Keep it silent.

---

## 8. Admin Shell: Sidebar + Layout

After login, the admin shell wraps all pages. It consists of a fixed left sidebar and a scrollable main content area.

### 8.1 Sidebar Layout

```
┌─────────────────────────┐
│  [Geometric mark/icon]  │  ← no Mallah text logo, just a small abstract icon
├─────────────────────────┤
│  ▸ Dashboard            │  ← LayoutDashboard icon
│  ▸ Content        [▾]   │  ← BookOpen icon, collapsible section
│     ├── Paths & Stages  │  ← Route icon
│     ├── Topics          │  ← FileText icon
│     └── Skills          │  ← Zap icon
│  ▸ Projects             │  ← FolderKanban icon
│  ▸ Jobs                 │  ← Briefcase icon
│  ▸ Learners             │  ← Users icon
│  ▸ Audit Log            │  ← ScrollText icon   ← HIDDEN for normal admins
│  ▸ Settings             │  ← Settings icon      ← HIDDEN for normal admins
├─────────────────────────┤
│  Sara Ahmad             │  ← display name from `admins` table
│  [SUPER]                │  ← Badge: orange for super, muted for normal
│  [Sign Out]             │  ← LogOut icon + text
└─────────────────────────┘
```

### 8.2 Sidebar Behavior

- `.glass` background on the entire sidebar.
- Content section is collapsible, **expanded by default**.
- Active page: **2–3px left-side accent border** (Mallah Orange) + filled icon.
- Inactive: outline icon, no border.
- "Sign Out" at the bottom → POST `/api/admin/auth/logout` → redirect to login.
- Desktop: fixed 240px. Tablet: 64px icon rail (hover/click to expand). Mobile: hamburger overlay.

---

## 9. Dashboard (`/{ADMIN_PANEL_PATH}/dashboard`)

First screen after login. Answers: "Is everything healthy? What needs attention?"

### 9.1 Loading State

On initial load, show `Skeleton` components matching the exact shape of:
- 4 stat cards (rectangular placeholders)
- Path table (3–4 row placeholders)
- Activity feed (3–4 line placeholders)

### 9.2 Platform Health Metrics (4 stat cards)

Horizontal row of 4 `.glass` `Card` components with `.glow-border` on hover.

| Card                        | Icon             | Value Source                                                       |
|-----------------------------|------------------|--------------------------------------------------------------------|
| Total Learners              | Users            | COUNT `users` WHERE `role = 'learner'` AND `status = 'active'`    |
| Active This Week            | Activity         | COUNT DISTINCT `user_id` with `last_accessed_at` in last 7 days   |
| Topics Completed (30d)      | CheckCircle      | COUNT `user_progress` WHERE `status = 'completed'` AND `completed_at` in last 30 days |
| Pending Skill Reviews       | Clock            | COUNT `skills` WHERE `is_verified = false`                         |

- Values in JetBrains Mono, large size.
- Small muted label above each value.
- "Pending Skill Reviews" is clickable → navigates to Skills Catalog filtered to `status = Pending`.

### 9.3 Path Overview Table

`Table` component with striped rows. Numeric columns in JetBrains Mono.

| Path Name                       | Learners | Avg Completion % | Active This Week |
|---------------------------------|----------|------------------|------------------|
| Frontend Development            | 412      | 34%              | 87               |
| Full-Stack Web Development      | 231      | 28%              | 54               |
| Cybersecurity & Ethical Hacking | 189      | 41%              | 43               |
| Data Science & Machine Learning | 156      | 22%              | 38               |

Avg Completion % = average of all enrolled learners' path completion percentages.

### 9.4 Quick Action Buttons

Row of `Button` (outline variant) with Lucide icons:

| Button              | Action                                                             | Visibility |
|---------------------|--------------------------------------------------------------------|------------|
| `+ Add Topic`       | Navigate to Topics page with create drawer pre-opened              | All admins |
| `+ Add Skill`       | Navigate to Skills page with create drawer pre-opened              | All admins |
| Review Pending      | Navigate to Skills page filtered to `Pending`                      | All admins |
| View Audit Log      | Navigate to Audit Log                                              | Super only |

### 9.5 Content Health Warnings

`Alert` components (warning variant) with Tactical Amber left border. Each has a direct fix link.

Automatically generated for:
- Path with 0 stages → "Frontend Development has no stages." → link: "Add Stage →"
- Stage with 0 topics → "Stage: Advanced Topics (Cybersecurity) has no topics." → link: "Add Topic →"
- Topic with 0 resources → "Topic: SQL Basics has no resources attached." → link: "Add Resource →"

If no warnings: this section is hidden entirely (don't show an empty "All good" message).

### 9.6 Recent Admin Activity Feed

Last 10 entries from `admin_audit_log`, newest first. Vertical timeline layout.

Each entry shows:
- Admin email (bold, orange)
- Action description (normal text)
- Relative timestamp in JetBrains Mono ("2 hours ago", "Yesterday at 14:32")
- Clicking an entry navigates to the relevant record (if it still exists). If deleted, show `Sonner` toast: "This record no longer exists."

**Empty state:** "No recent activity." (shown for freshly deployed platforms)

---

## 10. Content Management

### 10.1 Paths & Stages (`/{ADMIN_PANEL_PATH}/content/paths`)

#### Page Layout
- Page title: "Paths & Stages"
- `+ New Path` button (top right)
- Paths table below

#### Paths Table

| Column    | Type          | Notes                                  |
|-----------|---------------|----------------------------------------|
| Name      | Text          | Path display name                      |
| Status    | `Badge`       | Green "Active" / Muted "Inactive"      |
| Stages    | Number (Mono) | Count of stages in this path           |
| Learners  | Number (Mono) | Count of enrolled learners             |
| Actions   | Buttons       | Edit · Deactivate (+ Delete for super) |

**Loading:** `Skeleton` rows (4 rows matching table shape).
**Empty state:** "No paths created yet." + `+ New Path` button.

#### Create Path (`+ New Path`)

Opens `Sheet` (right side, 480px):
- Title: "New Path"
- Fields:
  - Name (`Input`, required)
  - Description (`Textarea`, max 500 chars)
  - Path Slug (`Input`, auto-generated from name, editable before first save, lowercase + hyphens only)
  - Active (`Switch`, default ON)
- Footer: "Create Path" `Button` (primary) + "Cancel" `Button` (ghost)
- **On submit:** POST `/api/admin/paths` → on success: `Sonner` toast "Path created" + close drawer + refresh table. On error: inline error message in drawer.
- **Validation:** Name required, slug unique check against backend.

#### Edit Path

Opens `Sheet` with same fields as Create, pre-filled. Slug field is **read-only** (disabled `Input` with lock icon and `Tooltip`: "Slug cannot be changed after creation to preserve learner data").
- **On submit:** PATCH `/api/admin/paths/:id` → `Sonner` toast "Path updated".

#### Deactivate Path

Click "Deactivate" → `AlertDialog`:
- Title: "Deactivate [Path Name]?"
- Body: "[N] learners are currently enrolled in this path. Deactivating prevents new enrollments but does not remove existing learner progress."
- Confirm requires typing the path name exactly in an `Input` field.
- Confirm `Button` (destructive) is disabled until name matches.
- **On confirm:** PATCH `/api/admin/paths/:id` with `{ is_active: false }` → `Sonner` toast "Path deactivated" → log `path_deactivated`.

#### Delete Path (Super Only)

Only visible for super admins. Only enabled when 0 learners are enrolled.
- If learners exist → `AlertDialog`: "Cannot delete — [N] learners are on this path. Deactivate instead."
- If 0 learners → `AlertDialog`: "This will permanently delete [Path Name] and all its stages ([X]), topics ([Y]), and resources ([Z]). This cannot be undone." + type name to confirm.
- **On confirm:** DELETE `/api/admin/paths/:id` → `Sonner` toast "Path deleted" → log `path_deleted`.

#### Stages (Inline Expansion)

Clicking a path row expands it inline to show stages for that path. Not a page navigation.

**Stages table within expanded path:**

| Column          | Type          | Notes                              |
|-----------------|---------------|------------------------------------|
| Order           | Number (Mono) | `order_index`, draggable handle    |
| Stage Title     | Text          |                                    |
| Difficulty      | `Badge`       | Beginner/Intermediate/Advanced     |
| Topics          | Number (Mono) | Count                              |
| Learners        | Number (Mono) | Learners with progress in stage    |
| Actions         | Buttons       | Edit · Delete (super only)         |

**Drag-to-reorder:**
- Drag handle on the Order column.
- On drop: PATCH `/api/admin/stages/reorder` with full `{ path_id, stage_ids: [...] }` array.
- **Atomic:** if the request fails → revert to previous order visually + `Sonner` toast (error): "Reorder failed. Please try again."
- Reordering does NOT affect learner progress (progress is stored per `topic_id`).

**Create Stage:** `+ Add Stage` button → `Sheet` with: title, description, difficulty (`Select`), order (auto-appended).
- **On submit:** POST `/api/admin/stages` → `Sonner` toast "Stage created".

**Edit Stage:** `Sheet` with same fields, pre-filled. PATCH `/api/admin/stages/:id`.

**Delete Stage (Super Only):**
- If `user_progress` exists for any topic in this stage → `AlertDialog`: "Cannot delete — [N] learners have progress in this stage."
- If no progress → `AlertDialog` with cascade warning: "This will also delete [X] topics and [Y] resources." + type name to confirm.

---

### 10.2 Topics & Resources (`/{ADMIN_PANEL_PATH}/content/topics`)

#### Page Layout
- Breadcrumb: `All Paths / [Path Name] / [Stage Title] / Topics`
- Path `Select` dropdown → Stage `Select` dropdown (filtered by path) → Topics table
- `+ Add Topic` button (top right, appears after stage is selected)

**Initial state:** Path dropdown is pre-selected if navigated from Dashboard quick action. Otherwise, prompt: "Select a path and stage to manage topics."

#### Topics Table

| Column     | Type          | Notes                              |
|------------|---------------|------------------------------------|
| Order      | Number (Mono) | Draggable handle                   |
| Title      | Text          |                                    |
| Type       | `Badge`       | lesson, concept, project_milestone, etc. |
| Time (min) | Number (Mono) | `estimated_time_min`               |
| Difficulty | `Badge`       |                                    |
| Mandatory  | `Badge`       | Green "Yes" / Muted "No"          |
| Actions    | Buttons       | Edit · Delete (super only)         |

**Drag-to-reorder:** Same atomic behavior as stages.
**Empty state:** "No topics in this stage yet." + `+ Add Topic` button.
**Search:** `Input` (search icon) above table — filters by topic title (client-side for <100 topics per stage).

#### Topic Edit / Create Drawer

`Sheet` (right, 480px). Scrollable content for long forms.

**Section 1 — Core Fields:**
- Title (`Input`, required)
- Summary (`Textarea`, max 500 chars, character counter shown)
- Estimated Time (`Input` number, minutes)
- Difficulty (`Select`: Beginner / Intermediate / Advanced)
- Topic Type (`Select`, required):

| Value             | Label              | Notes                                              |
|-------------------|--------------------|-----------------------------------------------------|
| `lesson`          | Lesson             | Standard learning topic                              |
| `lesson_practice` | Lesson + Practice  | Lesson with embedded hands-on exercise               |
| `lesson_lab`      | Lesson + Lab       | Cybersecurity path — produces a private write-up     |
| `concept`         | Concept            | Theory/conceptual, no hands-on                       |
| `concept_practice`| Concept + Practice | Concept with short exercise                          |
| `project_milestone`| Project (Milestone)| Gates next stage. Triggers `user_projects` on completion. |
| `project_capstone`| Project (Capstone) | Final graduation project. Unlocks graduate badge.    |

- Is Mandatory (`Switch` — OFF = doesn't count toward stage completion %)
- Order Index (auto-managed, read-only display)

**Section 2 — Resources (inside same drawer):**

Separator + "Resources" sub-heading + `+ Add Resource` button.

Resources listed as compact rows:

| Order | Type Badge | Title              | Preview/URL                 | Actions       |
|-------|------------|--------------------|-----------------------------|---------------|
| 1     | TEXT       | Intro to Variables | "In JavaScript, var…"       | Edit · Delete |
| 2     | VIDEO      | Fireship – JS Vars | youtube.com/...             | Edit · Delete |
| 3     | ARTICLE    | MDN – let, const   | developer.mozilla.org/...   | Edit · Delete |
| 4     | CERT       | CompTIA Security+  | comptia.org/... · Paid      | Edit · Delete |

**Add Resource (inline form expands below list):**
- Type (`Select`: INTERNAL_TEXT / VIDEO / ARTICLE / CERT)
- Title (`Input`)
- URL (`Input` — shown for VIDEO/ARTICLE/CERT) or Content (`Textarea` — shown for INTERNAL_TEXT)
- **CERT-only fields (shown conditionally when type = CERT):**
  - Provider (`Input`, e.g. "CompTIA", "Google")
  - Cost Type (`Select`: free / paid / discounted)
  - Cost Note (`Input`, e.g. "~$330 — voucher available via path completion")
- "Add" `Button` → POST `/api/admin/topics/:id/resources` → `Sonner` toast "Resource added" → resource appears in list.
- CERT resources render last in the learner's Topic Viewer regardless of order here.

**Edit Resource:** Click Edit → row becomes editable inline. "Save" / "Cancel" buttons appear.
**Delete Resource:** `AlertDialog` (simple confirm — resources aren't progress-tracked).

**Section 3 — Linked Skills (inside same drawer):**

Separator + "Skills" sub-heading.

- Searchable multi-select using `Command` component (searches verified skills only).
- Selected skills shown as `Badge` tags with `×` remove button: `React ×` `JavaScript ×` `DOM API ×`
- Skills are linked via `topic_skills` (just `topic_id` + `skill_id` — no `importance_level`).
- The Opportunity Analyzer uses `skills.category` to prioritize which gaps are urgent.

**Drawer footer:** "Save Topic" `Button` (primary) + "Cancel" `Button` (ghost).
- **On save:** Creates/updates topic + resources + skill links in a single transaction.
- `Sonner` toast: "Topic created" or "Topic updated".
- Drawer closes, table refreshes.

---

### 10.3 Skills Catalog (`/{ADMIN_PANEL_PATH}/content/skills`)

#### Page Layout
- Page title: "Skills Catalog"
- Filters row: Category (`Select`) + Status (`Select`: All / Verified / Pending)
- Search: `Input` (search icon) — filters by skill name
- `+ Add Skill` button (top right)
- Skills table below
- Bulk action bar (sticky, appears when pending skills are selected)

#### Skills Table

| Column      | Type          | Notes                                  |
|-------------|---------------|----------------------------------------|
| Checkbox    | Checkbox      | Only on Pending rows                   |
| Skill Name  | Text          |                                        |
| Category    | `Badge`       | framework_library, tool, etc.          |
| Status      | `Badge`       | Green "Verified" / Amber "Pending"     |
| In Topics   | Number (Mono) | Clickable → filtered view              |
| In Projects | Number (Mono) | Clickable → filtered view              |
| Actions     | Buttons       | Varies by status (see below)           |

**Actions by status:**
- Verified: Edit (+ Delete for super if 0 references)
- Pending: Verify · Reject · Edit

**Verify:** PATCH `/api/admin/skills/:id` with `{ is_verified: true }` → `Sonner` toast "Skill verified" → badge changes to green.

**Reject:** `AlertDialog`: "Reject skill '[Name]'? This will permanently delete it." → DELETE `/api/admin/skills/:id` → `Sonner` toast "Skill rejected".

**Bulk actions (pending skills):**
- Select checkboxes on pending rows.
- Sticky bar appears above table: "[N] selected" + "Verify Selected" `Button` + "Reject Selected" `Button` (destructive).
- Verify Selected → PATCH each selected → `Sonner` toast "[N] skills verified".
- Reject Selected → `AlertDialog` confirm → DELETE each → `Sonner` toast "[N] skills rejected".

**Create Skill (`+ Add Skill`):** `Sheet` with:
- Name (`Input`, required)
- Category (`Select`: fundamentals / language / framework_library / tool / platform_service / practice / other)
- Description (`Textarea`, optional)
- `is_verified = true` by default (admin-created).
- POST `/api/admin/skills` → `Sonner` toast "Skill created".
- **Duplicate check:** if name already exists → inline error "A skill named [X] already exists."

**Edit Skill:** `Sheet` with same fields. `skill_id` shown as read-only (JetBrains Mono, muted).

**Delete Skill (Super Only):**
- If referenced in `topic_skills` or `project_skills` → `AlertDialog`: "Cannot delete — this skill is used in [N] topics and [M] projects." Lists them.
- If 0 references → `AlertDialog` with confirm.

**Loading:** `Skeleton` rows.
**Empty state:** "No skills in the catalog yet." + `+ Add Skill` button.

---

## 11. Projects Management (`/{ADMIN_PANEL_PATH}/projects`)

#### Page Layout
- Page title: "Projects"
- Filters row: Path (`Select`) · Difficulty (`Select`) · Status (`Select`: Active / Inactive) · Source (`Select`: Platform / Learner-Created)
- Search: `Input` — filters by project title
- `+ Add Project` button (top right)
- Projects table

#### Projects Table

| Column     | Type          | Notes                                  |
|------------|---------------|----------------------------------------|
| Title      | Text          |                                        |
| Difficulty | `Badge`       |                                        |
| Path/Stage | Text          | "Frontend / Stage 1"                  |
| Source     | `Badge`       | Muted "Platform" or "Learner-Created"  |
| Active     | `Badge`       | Green "Yes" / Muted "No"              |
| Skills     | Number (Mono) | Count of linked skills                 |
| Actions    | Buttons       | Edit · Deactivate (Platform only)      |

- **Learner-Created rows** (`source = 'UserCustom'`): read-only. No Edit or Deactivate buttons. Muted `Badge`: "Learner-created" in the Source column.
- **Platform rows** (`source = 'Platform'`): full edit + deactivate.

**Create Project (`+ Add Project`):** `Sheet` with:
- Title (`Input`, required)
- Description (`Textarea`, max 500 chars)
- Difficulty (`Select`: Beginner / Intermediate / Advanced)
- Linked Path (`Select` — lists all active paths)
- Linked Stage (`Select` — **filtered by selected path**, resets when path changes)
- Active (`Switch`, default ON)
- Portfolio Visibility Default (`Switch` `is_public_default`, default ON)
  - Label: "Show on learner portfolio by default"
  - Helper text: "Turn OFF for cybersecurity labs and pentest projects."
- **Skills section:**
  - Searchable multi-select (`Command` component, verified skills only)
  - Selected as `Badge` tags with `×`
  - Linked via `project_skills` (just `project_id` + `skill_id` — no `importance_level`)
- POST `/api/admin/projects` → `Sonner` toast "Project created".

**Edit Project:** Same drawer, pre-filled. PATCH `/api/admin/projects/:id`.

**Deactivate Project:** `AlertDialog`: "Deactivating removes this project from future roadmap appearances. [N] learners have already completed it — their records are preserved." → PATCH with `{ is_active: false }` → `Sonner` toast "Project deactivated".

**Loading:** `Skeleton` rows.
**Empty state:** "No projects yet." + `+ Add Project` button.

---

## 12. Jobs Monitor (`/{ADMIN_PANEL_PATH}/jobs`)

**Entirely read-only.** Jobs are fetched, published, and expired automatically by a weekly cron job. No admin actions.

### 12.1 Jobs Dashboard Cards

4 `.glass` `Card` components — one per path:

| Card           | Content                                          |
|----------------|--------------------------------------------------|
| Frontend       | `[N]` live jobs · Last fetched: [date] · Next: Monday |
| Full-Stack     | `[N]` live jobs · Last fetched: [date]           |
| Cybersecurity  | `[N]` live jobs · Last fetched: [date]           |
| Data Science   | `[N]` live jobs · Last fetched: [date]           |

Values in JetBrains Mono. Dates in relative format ("3 days ago").

**Stale fetch warning:** If any path's last fetch > 8 days ago → `Alert` (warning): "Job fetch for [Path] appears delayed. Check server logs."

### 12.2 Jobs Table

Filters: Path (`Select`) · Status (`Select`: Published / Expired)

| Column           | Type          | Notes                              |
|------------------|---------------|------------------------------------|
| Title            | Text          | Job title                          |
| Company          | Text          |                                    |
| Location         | Text          |                                    |
| Path             | `Badge`       | Which path this job maps to        |
| Skills Extracted | `Badge` list  | Small badges per skill             |
| Published        | Date (Mono)   |                                    |
| Expires          | Date (Mono)   |                                    |

No action buttons. This is monitoring only.

**Loading:** `Skeleton` rows.
**Empty state:** "No job listings yet. The weekly fetch runs every Monday."

---

## 13. Learners View (`/{ADMIN_PANEL_PATH}/learners`)

Read-only view for platform health and support. Only write action: block/unblock.

### 13.1 Learners Table

**Filters:** Path (`Select`) · Status (`Select`: Active / Blocked) · Onboarding (`Select`: Complete / Incomplete) · Search (`Input` — by name or email)

**Server-side pagination:** 25 rows per page. `Pagination` component at bottom.

| Column      | Type          | Notes                                  |
|-------------|---------------|----------------------------------------|
| Name        | Text          | `first_name last_name`                 |
| Email       | Text          | JetBrains Mono                         |
| Path        | Text          | "—" if no path assigned                |
| Progress    | Text (Mono)   | "—" if onboarding incomplete           |
| Last Active | Text (Mono)   | Relative ("Today", "5 days ago")       |
| Status      | `Badge`       | Green "Active" / Red "Blocked"         |
| Actions     | Buttons       | View · Block/Unblock                   |

**Loading:** `Skeleton` rows.
**Empty state:** "No learners registered yet."

### 13.2 Learner Detail (`Sheet` side drawer, read-only)

Opened by clicking "View" on a learner row.

**Displayed fields:**
- Full name (heading)
- Email (JetBrains Mono) + `Badge` for email_verified status
- Account status `Badge` (Active/Blocked)
- Registration date (JetBrains Mono)
- Last login (JetBrains Mono, relative)
- Onboarding complete: `Badge` (Yes/No)
- Current path (or "Not assigned" muted)
- Current stage
- Path progress % (small progress bar, value in Mono)
- Skills unlocked: count
- Projects completed: count

**Not shown (privacy boundary):** resume content, portfolio details, chat history, onboarding answers, AI data.

**No edit controls in this drawer** — admins cannot change learner data. Path changes are learner-only (via Profile Settings).

### 13.3 Block / Unblock

**Block:** Click "Block" → `AlertDialog`: "Block [Name]? They will be unable to log in and will see: 'Your account has been blocked. Contact support.'" → Confirm (destructive) → PATCH `/api/admin/learners/:id/status` with `{ status: 'blocked' }` → `Sonner` toast "[Name] blocked" → log `learner_blocked`.

**Unblock:** Click "Unblock" → `AlertDialog`: "Unblock [Name]? They will be able to log in again." → Confirm → PATCH with `{ status: 'active' }` → `Sonner` toast "[Name] unblocked" → log `learner_unblocked`.

---

## 14. Audit Log (`/{ADMIN_PANEL_PATH}/audit-log`) — Super Only

Append-only record of every admin action. No edit or delete controls anywhere.

### 14.1 Access Control

- Sidebar item hidden for `normal` admins.
- Direct URL access by `normal` admin → 403 page.

### 14.2 Audit Log Table

**Filters:** Admin email (`Input` search) · Event type (`Select`) · Date range (date picker with start/end)

**Server-side pagination:** 25 rows per page, newest first.

| Column     | Type          | Notes                              |
|------------|---------------|------------------------------------|
| Timestamp  | Date (Mono)   | Full datetime, server time         |
| Admin      | Text          | Email, highlighted                 |
| Event      | `Badge`       | Color-coded by event category      |
| Description| Text          | Full human-readable description    |

**Event badge colors:**
- Login events: Info (blue)
- Create events: Success (green)
- Edit events: Warning (amber)
- Delete/deactivate/block events: Destructive (red)
- Invite events: Info (blue)

**What is logged (complete list):**

| Event Type              | Description Pattern                                                      |
|-------------------------|--------------------------------------------------------------------------|
| `admin_login`           | Admin [email] logged in from IP [x.x.x.x]                               |
| `admin_login_failed`    | Failed admin login attempt for email [email] from IP [x.x.x.x]          |
| `admin_invited`         | Super admin sent invite to [email] (level: [level])                      |
| `admin_invite_accepted` | Admin [email] accepted invite and set password                           |
| `admin_invite_expired`  | Invite for [email] expired (not accepted within 48 hours)                |
| `admin_invite_revoked`  | Super admin revoked invite for [email]                                   |
| `admin_invite_resent`   | Super admin resent invite to [email]                                     |
| `admin_deactivated`     | Super admin deactivated admin account: [email]                           |
| `path_created`          | Admin [email] created Path: [name] (slug: [slug])                        |
| `path_edited`           | Admin [email] edited Path: [name] — updated [fields]                     |
| `path_deactivated`      | Admin [email] deactivated Path: [name] ([N] learners enrolled)           |
| `path_deleted`          | Admin [email] deleted Path: [name] (cascade: [N] stages, [N] topics)    |
| `stage_created`         | Admin [email] created Stage: [title] in [path] (order: [N])             |
| `stage_edited`          | Admin [email] edited Stage: [title] — updated [fields]                   |
| `stage_deleted`         | Admin [email] deleted Stage: [title] in [path]                           |
| `stage_reordered`       | Admin [email] reordered stages in [path]                                 |
| `topic_created`         | Admin [email] created Topic: [title] in Stage [N] ([path])              |
| `topic_edited`          | Admin [email] edited Topic: [title] — updated [fields]                   |
| `topic_deleted`         | Admin [email] deleted Topic: [title]                                     |
| `topic_reordered`       | Admin [email] reordered topics in Stage [N] ([path])                     |
| `resource_added`        | Admin [email] added [TYPE] resource to Topic: [title]                    |
| `resource_edited`       | Admin [email] edited [TYPE] resource in Topic: [title]                   |
| `resource_deleted`      | Admin [email] deleted [TYPE] resource from Topic: [title]                |
| `skill_created`         | Admin [email] created skill: [name] ([category])                         |
| `skill_edited`          | Admin [email] edited skill: [name]                                       |
| `skill_verified`        | Admin [email] verified learner-submitted skill: [name]                   |
| `skill_rejected`        | Admin [email] rejected learner-submitted skill: [name]                   |
| `skill_deleted`         | Admin [email] deleted skill: [name]                                      |
| `project_created`       | Admin [email] created Project: [title] ([path] / Stage [N])             |
| `project_edited`        | Admin [email] edited Project: [title]                                    |
| `project_deactivated`   | Admin [email] deactivated Project: [title]                               |
| `learner_blocked`       | Admin [email] blocked learner: [learner_email] (user_id: [id])          |
| `learner_unblocked`     | Admin [email] unblocked learner: [learner_email] (user_id: [id])        |
| `jobs_fetched`          | Cron job fetched [N] jobs for [path] (automated)                         |
| `jobs_expired`          | [N] jobs expired automatically for [path] (automated)                    |
| `job_fetch_failed`      | Cron job failed to fetch jobs for [path] — see logs (automated)          |

### 14.3 Export

`Export CSV` `Button` (outline) in the top right. Exports the **current filtered view** (respects active filters). Download triggers immediately as a `.csv` file.

**Retention:** Minimum 90 days. Older entries may be archived but not deleted.

---

## 15. Settings (`/{ADMIN_PANEL_PATH}/settings`) — Super Only

### 15.1 Access Control

Same as Audit Log — hidden sidebar item for `normal`, 403 on direct URL.

### 15.2 Admin Account Management

**Page layout:** Admin accounts table + `+ Invite Admin` button (top right).

#### Admin Accounts Table

| Column     | Type          | Notes                                  |
|------------|---------------|----------------------------------------|
| Name       | Text          | Display name                           |
| Email      | Text (Mono)   |                                        |
| Level      | `Badge`       | Orange "SUPER" / Muted "NORMAL"        |
| Status     | `Badge`       | Green "Active" / Amber "Invited" / Red "Blocked" / Muted "Expired" |
| Last Login | Text (Mono)   | "—" for never-logged-in / invited      |
| Actions    | Buttons       | Varies (see below)                     |

**Actions by row state:**

| Row State            | Actions Available                                |
|----------------------|--------------------------------------------------|
| Active admin (not you)| Deactivate                                      |
| Active admin (you)   | — (no actions on your own row)                   |
| Last active super    | Deactivate (disabled) + `Tooltip`                |
| Invited (pending)    | Revoke Invite                                    |
| Expired invite       | Resend Invite                                    |
| Blocked admin        | — (remains in table for audit trail)             |

#### Invite Admin (`+ Invite Admin`)

`Sheet` with:
- Email (`Input`, required)
- Display Name (`Input`, required)
- Admin Level (`Select`: normal / super)
- "Send Invite" `Button` (primary)

**On submit:**
1. POST `/api/admin/settings/admins/invite`
2. Backend creates `users` row (`role = 'admin'`, `status = 'active'`), `admins` row, generates invite token (48h expiry), stores hash in `admin_invites`, sends invite email.
3. `Sonner` toast: "Invite sent to [email]"
4. Log `admin_invited`.
5. New row appears in table with "Invited" status.

**The invite email contains:**
- A link: `mallah.app/{ADMIN_PANEL_PATH}/setup?token=...`
- This leads to the Set Password page (Section 7.2).
- No temporary password is ever generated.

#### Deactivate Admin

- Click "Deactivate" → `AlertDialog`: "Deactivate [Name]'s admin account? They will no longer be able to log in."
- Confirm (destructive) → PATCH `/api/admin/settings/admins/:id` → `Sonner` toast "[Name] deactivated" → log `admin_deactivated`.
- Row remains in table with "Blocked" status (never hard-deleted — preserves audit log references).

**Cannot deactivate yourself:** Deactivate button is hidden on your own row.

**Cannot deactivate last super admin:** Deactivate button is **visible but disabled** (grayed out). `Tooltip` on hover: "Cannot deactivate — this is the last active super admin. Promote another admin to super first."

#### Revoke Invite

- Click "Revoke Invite" → `AlertDialog`: "Revoke invite for [email]? They will not be able to use the invite link."
- Confirm → DELETE `/api/admin/settings/invites/:id` → marks invite `status = 'revoked'`, sets `users.status = 'blocked'`.
- `Sonner` toast: "Invite revoked" → log `admin_invite_revoked`.

#### Resend Invite

- Click "Resend Invite" → generates new token (fresh 48h), sends new email, old token invalidated.
- `Sonner` toast: "Invite resent to [email]" → log `admin_invite_resent`.

### 15.3 Environment Reference

Below the admin table. Read-only `.glass` `Card`.

| Variable                    | Value                | Purpose                            |
|-----------------------------|----------------------|------------------------------------|
| `ADMIN_PANEL_PATH`          | `manage-c7x2k`      | Admin panel URL slug               |
| `ADMIN_SESSION_TTL`         | `7200`               | Session timeout (seconds)          |
| `AUDIT_LOG_RETENTION_DAYS`  | `90`                 | Audit log retention period         |

Values in JetBrains Mono. Labels in Inter. Not editable — values come from `process.env`.

---

## 16. Safe Deletion & Deactivation Rules

Every destructive action shows impact before proceeding via `AlertDialog`.

| Action          | Condition                                    | Result                                                                    |
|-----------------|----------------------------------------------|---------------------------------------------------------------------------|
| Delete Path     | Learners enrolled (`current_path_id`)        | **Blocked.** "[N] learners are on this path. Deactivate instead."         |
| Delete Path     | 0 learners                                   | **Allowed** (super). Cascades: stages + topics + resources.               |
| Delete Stage    | `user_progress` exists in stage topics       | **Blocked.** "[N] learners have progress here."                           |
| Delete Stage    | No progress                                  | **Allowed** (super). Cascades: topics + resources.                        |
| Delete Topic    | `user_progress` exists                       | **Blocked.** "[N] learners have accessed this topic."                     |
| Delete Topic    | No progress                                  | **Allowed** (super).                                                      |
| Delete Resource | Always                                       | **Allowed** (any admin). Not progress-tracked.                            |
| Delete Skill    | Referenced in `topic_skills`/`project_skills` | **Blocked.** Shows which topics/projects reference it.                    |
| Delete Skill    | 0 references                                 | **Allowed** (super).                                                      |
| Deactivate Path | Always                                       | **Allowed.** Shows learner count. Progress preserved.                     |
| Deactivate Proj | Always                                       | **Allowed.** Completed records preserved.                                 |

Cascade deletions state exact counts: "This will permanently delete [X] stages, [Y] topics, and [Z] resources."
Confirm button is destructive + requires typing the entity name.

---

## 17. States & Edge Cases

| Scenario                                         | Behavior                                                                               |
|--------------------------------------------------|----------------------------------------------------------------------------------------|
| Admin session expires mid-work                   | Next API call → 401 → redirect to login. Unsaved data lost. No auto-save in v1.       |
| Normal admin accesses super-only route           | 403 page: centered "You don't have permission to view this page." + "Back to Dashboard" button. |
| Two admins edit same record                      | Last write wins. No conflict resolution in v1. Both logged in audit log.               |
| Path with 0 stages                               | Shown in table with `Stages: 0`. Dashboard content warning.                            |
| Stage with 0 topics                              | Shown with `Topics: 0`. Dashboard content warning.                                     |
| Topic with 0 resources                           | Allowed. Topic Viewer shows summary + AI Tutor fallback.                               |
| Duplicate skill name                             | Backend rejects. Inline error: "A skill named [X] already exists."                     |
| Reorder fails (network error)                    | Revert visually. `Sonner` toast (error): "Reorder failed. Please try again."           |
| Last super admin deactivation                    | Button disabled + `Tooltip` explanation.                                               |
| Edit a UserCustom project                        | Edit/Deactivate hidden. `Badge`: "Learner-created project."                            |
| Invite link after 48 hours                       | "This invite link has expired. Contact a super admin."                                 |
| Invite link already used                         | "This invite has already been used. You can sign in." + login link.                    |
| Admin's own Settings row                         | Deactivate hidden. Cannot demote yourself.                                             |
| Activity feed entry → deleted record             | `Sonner` toast: "This record no longer exists."                                        |
| API returns 500                                  | `Sonner` toast (error): "Something went wrong. Please try again."                      |
| Empty table after filters applied                | "No results match your filters." + "Clear filters" button.                             |

---

## 18. Data Model — Admin-Specific Tables

The admin panel reads/writes core content tables (`paths`, `stages`, `topics`, `topic_resources`,
`skills`, `topic_skills`, `projects`, `project_skills`) defined in the Roadmap & Topic Viewer spec.

**Important: `topic_skills` and `project_skills` are simple join tables** with only `topic_id` + `skill_id`
(or `project_id` + `skill_id`). There is no `importance_level` field. The Opportunity Analyzer uses
`skills.category` to prioritize gaps — this is set once on the skill itself, not per-link.

Three tables are admin-specific:

### `admins` table
Defined in Auth spec: `user_id` (FK → users), `display_name`, `admin_level` (normal / super).

### `admin_invites` table

| Field          | Type      | Notes                                                        |
|----------------|-----------|--------------------------------------------------------------|
| `invite_id`    | UUID (PK) |                                                              |
| `user_id`      | UUID (FK) | The invited admin's user record                              |
| `token_hash`   | VARCHAR   | Hashed invite token (raw token never stored)                 |
| `invited_by`   | UUID (FK) | The super admin who created the invite                       |
| `status`       | ENUM      | `pending` / `accepted` / `expired` / `revoked`               |
| `expires_at`   | TIMESTAMP | 48 hours from creation                                       |
| `accepted_at`  | TIMESTAMP | NULL until accepted                                          |
| `created_at`   | TIMESTAMP |                                                              |

Expiry is checked lazily on access or by scheduled job. On resend: old token revoked, new row created.

### `admin_audit_log` table

| Field          | Type      | Notes                                                       |
|----------------|-----------|-------------------------------------------------------------|
| `log_id`       | UUID (PK) |                                                             |
| `admin_id`     | UUID (FK) | Acting admin (NULL for automated events like cron jobs)     |
| `event_type`   | VARCHAR   | Snake_case: `topic_created`, `learner_blocked`              |
| `description`  | TEXT      | Human-readable full description                             |
| `entity_type`  | VARCHAR   | `path`/`stage`/`topic`/`resource`/`skill`/`project`/`user`/`admin`/`invite`/`job` |
| `entity_id`    | UUID      | Record acted upon (nullable for login/job events)           |
| `ip_address`   | VARCHAR   |                                                             |
| `created_at`   | TIMESTAMP | Server time, never client time                              |

**No UPDATE or DELETE permitted** on this table at the application level.

---

## 19. API Routes

All prefixed `/api/admin/`. Every route re-validates session + `admin_level` server-side.

### Auth (Public)

| Method | Route                           | Action                          |
|--------|----------------------------------|---------------------------------|
| POST   | `/api/admin/auth/login`          | Admin login                     |
| POST   | `/api/admin/auth/logout`         | Logout + invalidate session     |
| POST   | `/api/admin/auth/setup`          | Set password from invite        |
| GET    | `/api/admin/auth/invite/:token`  | Validate invite token           |

### Dashboard

| Method | Route                    | Action                              | Level  |
|--------|--------------------------|-------------------------------------|--------|
| GET    | `/api/admin/dashboard`   | Stats + warnings + activity feed    | normal |

### Paths & Stages

| Method | Route                            | Action                          | Level  |
|--------|-----------------------------------|---------------------------------|--------|
| GET    | `/api/admin/paths`                | List all paths                  | normal |
| POST   | `/api/admin/paths`                | Create path                     | normal |
| PATCH  | `/api/admin/paths/:id`            | Edit path                       | normal |
| DELETE | `/api/admin/paths/:id`            | Delete path (if safe)           | super  |
| GET    | `/api/admin/paths/:id/stages`     | List stages for path            | normal |
| POST   | `/api/admin/stages`               | Create stage                    | normal |
| PATCH  | `/api/admin/stages/:id`           | Edit stage                      | normal |
| PATCH  | `/api/admin/stages/reorder`       | Atomic reorder (full array)     | normal |
| DELETE | `/api/admin/stages/:id`           | Delete stage (if safe)          | super  |

### Topics & Resources

| Method | Route                            | Action                          | Level  |
|--------|-----------------------------------|---------------------------------|--------|
| GET    | `/api/admin/stages/:id/topics`    | List topics for stage           | normal |
| POST   | `/api/admin/topics`               | Create topic                    | normal |
| PATCH  | `/api/admin/topics/:id`           | Edit topic                      | normal |
| PATCH  | `/api/admin/topics/reorder`       | Atomic reorder (full array)     | normal |
| DELETE | `/api/admin/topics/:id`           | Delete topic (if safe)          | super  |
| GET    | `/api/admin/topics/:id/resources` | List resources for topic        | normal |
| POST   | `/api/admin/topics/:id/resources` | Add resource                    | normal |
| PATCH  | `/api/admin/resources/:id`        | Edit resource                   | normal |
| DELETE | `/api/admin/resources/:id`        | Delete resource                 | normal |
| PATCH  | `/api/admin/topics/:id/skills`    | Set skill links for topic       | normal |

### Skills

| Method | Route                     | Action                    | Level  |
|--------|---------------------------|---------------------------|--------|
| GET    | `/api/admin/skills`       | List (filterable, search) | normal |
| POST   | `/api/admin/skills`       | Create skill              | normal |
| PATCH  | `/api/admin/skills/:id`   | Edit or verify            | normal |
| DELETE | `/api/admin/skills/:id`   | Delete (if safe)          | super  |

### Projects

| Method | Route                              | Action                          | Level  |
|--------|-------------------------------------|---------------------------------|--------|
| GET    | `/api/admin/projects`               | List (filterable, search)       | normal |
| POST   | `/api/admin/projects`               | Create project                  | normal |
| PATCH  | `/api/admin/projects/:id`           | Edit project                    | normal |
| PATCH  | `/api/admin/projects/:id/skills`    | Set skill links for project     | normal |

### Jobs

| Method | Route                | Action                   | Level  |
|--------|----------------------|--------------------------|--------|
| GET    | `/api/admin/jobs`    | List (filterable, read-only) | normal |

### Learners

| Method | Route                              | Action                    | Level  |
|--------|-------------------------------------|---------------------------|--------|
| GET    | `/api/admin/learners`               | List (paginated, filtered, searchable) | normal |
| GET    | `/api/admin/learners/:id`           | Learner detail (read-only)| normal |
| PATCH  | `/api/admin/learners/:id/status`    | Block or unblock          | normal |

### Audit Log (Super Only)

| Method | Route                        | Action                    | Level  |
|--------|------------------------------|---------------------------|--------|
| GET    | `/api/admin/audit-log`       | List (paginated, filtered)| super  |
| GET    | `/api/admin/audit-log/export`| Export CSV                 | super  |

### Settings (Super Only)

| Method | Route                                   | Action                    | Level  |
|--------|-----------------------------------------|---------------------------|--------|
| GET    | `/api/admin/settings/admins`            | List admins + invites     | super  |
| POST   | `/api/admin/settings/admins/invite`     | Send invite               | super  |
| POST   | `/api/admin/settings/admins/:id/resend` | Resend expired invite     | super  |
| PATCH  | `/api/admin/settings/admins/:id`        | Deactivate admin          | super  |
| DELETE | `/api/admin/settings/invites/:id`       | Revoke invite             | super  |

---

## 20. Integration Points

- **Auth module** — admin login uses the same `users` table but separate endpoint, controller,
  and session scope. Admin and learner sessions are never mixed. Invite flow creates `users`
  rows with `role = 'admin'`.
- **Roadmap & Topic Viewer** — all content created by admins is consumed directly. Changes
  take effect on learners' next page load. `topic_skills` links (no `importance_level`) drive
  skill unlocks on topic completion.
- **Portfolio Hub** — learner-submitted skills (`is_verified = false`) surface in Skills Catalog
  for admin review. Verified skills become available in all learner-facing dropdowns.
- **Opportunity Analyzer** — uses `skills.category` (set once on the skill by admins) to
  prioritize which skill gaps are most urgent. Jobs Monitor provides visibility into the
  automated `job_listings` feed.
- **Resume Builder** — `project_skills` links set by admins feed into the Resume Builder's
  path-specific ATS keyword scoring.
- **Dashboard (learner)** — admin dashboard aggregates from the same `user_progress`,
  `user_skills`, and `learners` tables the learner dashboard reads individually.
