# Mallah – Admin Panel

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
- **Data density over decoration.** Tables, inline filters, and side-drawer editing over cards
  and full-page transitions. Admins work with data — the UI should feel like a tool, not a product.
- **Safe destructive actions.** Deleting or deactivating content that learners depend on requires
  a confirmation step that shows the real impact before proceeding.
- **Audit everything.** Every content change, login, and account action is logged with who, what,
  when, and from where.
- **Complete invisibility to learners.** No learner-facing page, API response, sitemap entry,
  or error message ever references the admin URL or login.

---

## 3. Access & Security

### 3.1 Admin URL — Obscured Entry Point

The admin panel does not live at `/admin`. It lives at a randomized path set at deployment:

```
mallah.app/{ADMIN_PANEL_PATH}
```

`ADMIN_PANEL_PATH` is an environment variable (e.g. `manage-c7x2k`) set once at deployment
and never committed to source control or exposed in any response. Example full URLs:

```
mallah.app/manage-c7x2k
mallah.app/manage-c7x2k/login
mallah.app/manage-c7x2k/dashboard
```

**Rules:**
- The path is never hardcoded in any file — always read from `process.env.ADMIN_PANEL_PATH`.
- If a request hits `/admin` or `/administrator` → return a standard 404. Do not redirect.
- If a learner navigates to the correct admin URL without an admin session → return 404.
  Never confirm the path exists with a login redirect.
- The admin URL is excluded from the public sitemap and `robots.txt`.

This is an additional barrier against automated scanners, not a substitute for authentication.

### 3.2 Separate Admin Login Page

The admin login page lives at `mallah.app/{ADMIN_PANEL_PATH}/login`. It shares nothing
with the learner login page — separate route, separate controller, separate UI.

**Admin login page characteristics:**
- Minimal styling — no Mallah learner branding, no marketing copy.
- Email field, password field, and a "Sign In" button only.
- No "Register", "Forgot Password", or "Back to home" links visible.

**Admin login process:**
1. Admin enters email + password.
2. Backend checks `users.email` match.
3. Backend verifies `users.role = 'admin'` — if not, return generic error immediately.
4. Backend verifies matching row in `admins` table.
5. Backend verifies `users.status = 'active'` — blocked admins cannot log in.
6. Verify password against `users.password_hash`.
7. If all pass: issue a separate admin session token (scoped, not shared with learner sessions).
8. Log successful login to `admin_audit_log`.
9. Redirect to `/{ADMIN_PANEL_PATH}/dashboard`.

**On any failure:** return a single generic message — "Invalid credentials." Never reveal
which step failed. Never reveal that a learner account was found at this email.

**Admin session rules:**
- Sessions expire after **2 hours of inactivity** (shorter than learner sessions).
- No "Remember Me" option.
- Every request to any `/api/admin/*` route re-validates the session and role server-side.

### 3.3 Two Admin Levels

| Level    | Permissions                                                                           |
|----------|---------------------------------------------------------------------------------------|
| `normal` | Create, edit, and deactivate content. View stats and learner list.                    |
| `super`  | Everything `normal` can do, plus: delete content, manage admin accounts, view audit log, access Settings. |

Only a `super` admin can create or deactivate other admin accounts. The first `super` admin
account must be seeded directly in the database at deployment — it cannot be created through
the UI (bootstrapping protection).

---

## 4. Admin Sidebar Navigation

Fixed left sidebar. Icon + label. No deep nesting.

```
📊  Dashboard
📚  Content
    ├── Paths & Stages
    ├── Topics & Resources
    └── Skills Catalog
🗂  Projects
💼  Jobs                    ← new — weekly job feed management
👥  Learners
📋  Audit Log              ← super admin only
⚙️  Settings               ← super admin only
```

- Content section is collapsible. Expanded by default.
- Active page is visually highlighted.
- Admin's display name and level shown at the bottom of the sidebar.
- "Sign Out" button at the very bottom.

---

## 5. Admin Dashboard

The first screen after login. Purpose: answer "Is everything healthy? What needs attention?"

### 5.1 Platform Health Metrics (4 stat cards, top row)

| Card                        | Value Source                                                       |
|-----------------------------|--------------------------------------------------------------------|
| Total Learners              | COUNT of `users` where `role = 'learner'` and `status = 'active'` |
| Active This Week            | COUNT of distinct `user_id` with `last_accessed_at` in last 7 days (from `user_progress`) |
| Topics Completed (30 days)  | COUNT of `user_progress` where `status = 'completed'` and `completed_at` in last 30 days |
| Pending Skill Reviews       | COUNT of `skills` where `is_verified = false`                      |

"Pending Skill Reviews" card links directly to Skills Catalog filtered to unverified.

### 5.2 Path Overview Table

| Path Name                       | Learners | Avg Completion % | Active This Week |
|---------------------------------|----------|------------------|------------------|
| Frontend Development            | 412      | 34%              | 87               |
| Full-Stack Web Development      | 231      | 28%              | 54               |
| Cybersecurity & Ethical Hacking | 189      | 41%              | 43               |
| Data Science & Machine Learning | 156      | 22%              | 38               |

Avg Completion % = average of all learners' path completion percentages for that path,
computed from `user_progress` and `topics`.

### 5.3 Quick Action Buttons

- `+ Add Topic` → navigates to Topics & Resources with creation drawer pre-opened
- `+ Add Skill` → navigates to Skills Catalog with creation form pre-opened
- `Review Pending Skills` → navigates to Skills Catalog filtered to `is_verified = false`
- `View Audit Log` *(super admin only)*

### 5.4 Content Health Warnings

Below the stats, show automatic warnings for content issues:

- Any path with 0 stages → "Frontend Development has no stages."
- Any stage with 0 topics → "Stage: Advanced Topics (Cybersecurity) has no topics."
- Any topic with 0 resources → "Topic: SQL Basics has no resources attached."

These are orange warning banners with a direct link to fix each one.

### 5.5 Recent Admin Activity Feed

Last 10 entries from `admin_audit_log`, newest first:

> Admin **sara@admin.com** deactivated Path: Backend Development — 2 hours ago
> Admin **omar@admin.com** added Topic: React Hooks to Stage 3 (Frontend) — 5 hours ago

Clicking any entry opens the relevant record (if it still exists).

---

## 6. Content Management

### 6.1 Paths & Stages

#### Paths List

Table of all paths (active and inactive):

| Name                            | Status     | Stages | Learners | Actions             |
|---------------------------------|------------|--------|----------|---------------------|
| Frontend Development            | Active     | 5      | 412      | Edit · Deactivate   |
| Full-Stack Web Development      | Active     | 6      | 231      | Edit · Deactivate   |
| Cybersecurity & Ethical Hacking | Active     | 6      | 189      | Edit · Deactivate   |
| Data Science & Machine Learning | Active     | 6      | 156      | Edit · Deactivate   |

- `Edit` → side drawer: name, short description, `path_id` slug (read-only after creation), `is_active` toggle.
- `Deactivate` → impact modal before proceeding:
  > "412 learners are currently enrolled in this path. Deactivating prevents new enrollments
  > but does not remove existing learner progress. Type the path name to confirm."
- `+ New Path` button → side drawer: name, description, `path_id` slug (auto-generated from
  name, editable before first save), `is_active` (default true).

**Note on path slugs:** The four current path slugs (`frontend`, `fullstack`, `cybersecurity`,
`datascience`) are referenced throughout the system. Do not rename them after learners have
enrolled. The slug field is read-only in the edit drawer after creation.

#### Stages Management (inside a Path)

Clicking a path row opens its stage list in the same page:

| Order | Stage Title              | Difficulty   | Topics | Learners in Stage | Actions                  |
|-------|--------------------------|--------------|--------|-------------------|--------------------------|
| 1     | Web Foundations          | Beginner     | 8      | 287               | Edit · Reorder · Delete  |
| 2     | JavaScript Core          | Beginner     | 10     | 143               | Edit · Reorder · Delete  |
| 3     | Git & Developer Tools    | Beginner     | 4      | 98                | Edit · Reorder · Delete  |

- Drag-to-reorder → sends a single `PATCH /api/admin/stages/reorder` with the full new
  `order_index` array. Applied atomically — partial reorders are not allowed.
- **Reordering stages does not affect learner progress.** Progress is stored per `topic_id`,
  not by position. Learners mid-stage are unaffected.
- `Edit` → side drawer: title, description, difficulty, order_index.
- `Delete` → blocked if any `user_progress` row exists for topics in this stage. Error:
  "Cannot delete — [N] learners have progress in this stage. Deactivate the stage instead."
- `+ Add Stage` → side drawer: title, description, difficulty, order (auto-appended to end).

---

### 6.2 Topics & Resources

**Navigation:** Content → Topics & Resources → select Path → select Stage → topic list.

Breadcrumb always visible: `Frontend Development / Stage 2 – JavaScript Core / Topics`

#### Topics Table (within selected Stage)

| Order | Title                        | Time (min) | Difficulty   | Mandatory | Actions                  |
|-------|------------------------------|------------|--------------|-----------|--------------------------|
| 1     | Variables & Data Types       | 30         | Beginner     | Yes       | Edit · Reorder · Delete  |
| 2     | Functions & Scope            | 45         | Beginner     | Yes       | Edit · Reorder · Delete  |
| 3     | DOM Manipulation             | 60         | Beginner     | Yes       | Edit · Reorder · Delete  |

- Same reorder rules as stages — atomic PATCH, does not affect learner progress.
- `Delete` → blocked if any `user_progress` row exists for this topic.
- `+ Add Topic` → opens the topic side drawer (below).

#### Topic Edit / Create Drawer

A right-side drawer that slides in without leaving the topics list.

**Core fields:**
- Title (required)
- Summary (textarea, max 500 chars)
- Estimated time in minutes
- Difficulty: Beginner / Intermediate / Advanced
- Topic Type (required dropdown):

| Value | Label shown to admin | Notes |
|---|---|---|
| `lesson` | Lesson | Standard learning topic |
| `lesson_practice` | Lesson + Practice | Lesson with embedded hands-on exercise |
| `lesson_lab` | Lesson + Lab | Cybersecurity path — produces a private write-up |
| `concept` | Concept | Theory/conceptual, no hands-on |
| `concept_practice` | Concept + Practice | Concept with short exercise |
| `project_milestone` | Project (Milestone) | Gates next stage. Triggers `user_projects` write on completion. |
| `project_capstone` | Project (Capstone) | Final graduation project. Same as milestone but also unlocks graduate badge. |

- Is Mandatory (toggle — non-mandatory topics don't count toward stage completion %)
- Order index (auto-managed, adjustable)

**Resources sub-section (inside the same drawer):**

Ordered list of this topic's learning assets. Four resource types are supported: `INTERNAL_TEXT`, `VIDEO`, `ARTICLE`, `CERT`.

| Order | Type            | Title                          | Preview                     | Actions        |
|-------|-----------------|--------------------------------|-----------------------------|----------------|
| 1     | INTERNAL_TEXT   | Introduction to Variables      | "In JavaScript, variables…" | Edit · Delete  |
| 2     | VIDEO           | Fireship – JS Variables        | youtube.com/...             | Edit · Delete  |
| 3     | ARTICLE         | MDN – var, let, const          | developer.mozilla.org/...   | Edit · Delete  |
| 4     | CERT            | CompTIA Security+              | comptia.org/... · Paid      | Edit · Delete  |

- Resources are drag-to-reorder within the topic. **Exception: CERT resources always render last in the Topic Viewer regardless of their `order_index` here.**
- `+ Add Resource` → inline form below the list:
  - Type: `INTERNAL_TEXT` / `VIDEO` / `ARTICLE` / `CERT`
  - Title
  - URL (for VIDEO / ARTICLE / CERT) or Content textarea (for INTERNAL_TEXT)
  - **CERT-only additional fields:** Provider (e.g. "CompTIA", "Google"), Cost Type (`free` / `paid` / `discounted`), Cost Note (free text, e.g. "~$330 — voucher available via path completion")
  - Order (auto-appended, CERT resources always render last in the Topic Viewer regardless of order_index)
- `Edit` → inline in the same row.
- `Delete` → single confirmation. Resources are not individually progress-tracked so
  deletion is always safe.

**Skills linked to this topic (inside the same drawer):**

Controls which skills are unlocked when this topic is completed, and which topics the
Opportunity Analyzer links to for missing skills.

- Multi-select from `skills` catalog (verified skills only, searchable dropdown)
- Set `importance_level` per skill: Low / Medium / High
- `importance_level = High` → Opportunity Analyzer prioritizes this topic when that skill
  is missing from a learner's profile
- Displayed as a tag list: `React [High] ×` `JavaScript [High] ×` `DOM API [Medium] ×`

---

### 6.3 Skills Catalog

#### Skills Table

| Skill Name         | Category               | Verified     | In Topics | In Projects | Actions           |
|--------------------|------------------------|--------------|-----------|-------------|-------------------|
| React              | framework_library      | ✅ Verified   | 4         | 3           | Edit              |
| PostgreSQL         | tool                   | ✅ Verified   | 3         | 2           | Edit              |
| Burp Suite         | tool                   | ✅ Verified   | 2         | 1           | Edit              |
| My Custom Skill    | other                  | ⏳ Pending    | 0         | 0           | Verify · Reject   |

- "In Topics" / "In Projects" are usage counts — clicking opens a filtered view showing
  which records reference this skill. Useful before renaming or deleting.
- `Pending` = learner-submitted from the Portfolio Hub.
- `Verify` → sets `is_verified = true`. Skill becomes available in all learner-facing dropdowns.
- `Reject` → deletes the skill row. Safe because pending skills have 0 references by definition.
- `Edit` → side drawer: name, category, description. `skill_id` is read-only.

**Bulk actions for pending skills:**
- Select multiple → "Verify Selected" or "Reject Selected"

**Filters:**
- Category: All / `fundamentals` / `language` / `framework_library` / `tool` / `platform_service` / `practice` / `other`
- Status: All / Verified / Pending

**`+ Add Skill` button:**
- Side drawer: name, category (dropdown: `fundamentals` / `language` / `framework_library` / `tool` / `platform_service` / `practice` / `other`), description (optional)
- `is_verified = true` by default for admin-created skills

---

## 7. Projects Management

Accessed via "Projects" in the sidebar. Manages platform-defined project templates that
appear in learner roadmaps.

#### Projects Table

| Title                        | Difficulty   | Stage                   | Active | Skills | Actions             |
|------------------------------|--------------|-------------------------|--------|--------|---------------------|
| Personal Portfolio Page      | Beginner     | Frontend / Stage 1      | Yes    | 3      | Edit · Deactivate   |
| REST API Blog Backend        | Intermediate | Full-Stack / Stage 3    | Yes    | 5      | Edit · Deactivate   |
| Network Recon Lab            | Beginner     | Cybersecurity / Stage 1 | Yes    | 4      | Edit · Deactivate   |

**Filters:** Path · Difficulty · Active status · Source (Platform / UserCustom)

- `Source = Platform` → admin-created, appears in learner roadmaps.
- `Source = UserCustom` → learner-created. Visible as read-only rows for admin awareness.
  Cannot be edited by admins.
- `Deactivate` → removes project from future roadmap appearances. Learners who already
  completed it keep their record.
- `+ Add Project` → side drawer (same as edit).

#### Project Edit / Create Drawer

- Title (required)
- Description (textarea, max 500 chars)
- Difficulty: Beginner / Intermediate / Advanced
- Linked Path (dropdown)
- Linked Stage (dropdown, filtered by selected path)
- `is_active` toggle
- **Portfolio visibility default** (`is_public_default` toggle, default ON): Controls whether completed projects appear publicly on the learner's Portfolio Hub by default. Turn OFF for cybersecurity lab/pentest projects — learners' security write-ups should be private by default. Learners can always change their own visibility after completion.

**Skills section:**
- Multi-select from verified skills catalog
- Set `importance_level` per skill (Low / Medium / High)
- Saves to `project_skills`
- These skills are unlocked in `user_skills` when a learner completes this project

---

## 8. Jobs Monitor

Accessed via "Jobs" in the sidebar. Read-only view for monitoring the automated weekly job feed. No publish/reject actions — jobs are fetched, published, and expired fully automatically.

### 8.1 Jobs Dashboard

4 stat cards — one per path:

| Card | Value |
|---|---|
| Frontend | N live jobs · Last fetched [date] · Next fetch Monday |
| Full-Stack | N live jobs · Last fetched [date] |
| Cybersecurity | N live jobs · Last fetched [date] |
| Data Science | N live jobs · Last fetched [date] |

An amber `Alert` appears if any path's last fetch was more than 8 days ago (indicating the cron job may have failed): "Job fetch for [path] appears delayed. Check server logs."

### 8.2 Jobs Table (Read-Only)

Filterable by: Path · Status (published / expired)

| Title | Company | Location | Path | Skills Extracted | Published | Expires |
|---|---|---|---|---|---|---|
| Frontend Developer | Noon | Riyadh | Frontend | React, TypeScript, Git | Mon 3 Apr | Mon 10 Apr |
| React Engineer | STC | Remote (SA) | Frontend | React, Node.js | Mon 3 Apr | Mon 10 Apr |

No action buttons. Admins can see what's live, verify skill extraction quality, and spot any anomalies.

### 8.3 Audit Log Events for Jobs

| Event | Description |
|---|---|
| `jobs_fetched` | Cron job fetched [N] jobs for [path] (automated) |
| `jobs_expired` | [N] jobs expired automatically for [path] (automated) |
| `job_fetch_failed` | Cron job failed to fetch jobs for [path] — see logs (automated) |

---

## 9. Learners View

Read-only. Admins can view learner data for platform health and support. The only write
action available is block/unblock.

**Filters:** Path · Status (active / blocked) · Onboarding complete (yes / no) · Last active

#### Learners Table

| Name           | Email                | Path                  | Progress | Last Active  | Status  | Actions        |
|----------------|----------------------|-----------------------|----------|--------------|---------|----------------|
| Sara Ahmad     | sara@example.com     | Frontend Development  | 34%      | Today        | Active  | View · Block   |
| Omar Khalil    | omar@example.com     | Data Science & ML     | 12%      | 5 days ago   | Active  | View · Block   |
| Layla Hassan   | layla@example.com    | —                     | —        | 3 days ago   | Active  | View · Block   |

Layla Hassan shows `—` for path and progress because `onboarding_completed = false`.

#### Learner Detail View (read-only side drawer)

- Full name, email, `email_verified` status
- Account status, registration date, last login date
- Onboarding complete: Yes / No
- Current path name (or "Not assigned")
- Current stage title
- Path progress %
- Skills unlocked count, projects completed count

**Not accessible to admins:** resume content, portfolio item details, chat/tutor history,
raw onboarding answers, or AI recommendation data.

#### Block / Unblock

- `Block` → confirmation modal → sets `users.status = 'blocked'` → logged in audit log.
- `Unblock` → confirmation modal → sets `users.status = 'active'` → logged in audit log.
- Blocked learners cannot log in and see: "Your account has been blocked. Contact support."

---

## 10. Audit Log (Super Admin Only)

Every action taken by any admin is recorded in `admin_audit_log`. The log is append-only —
no admin, including super, can edit or delete entries.

#### What Is Logged

| Event Type              | Example Description                                                          |
|-------------------------|------------------------------------------------------------------------------|
| `admin_login`           | Admin sara@admin.com logged in from IP 41.x.x.x                             |
| `admin_login_failed`    | Failed admin login attempt for email unknown@test.com from IP 41.x.x.x      |
| `admin_created`         | Super admin created new admin account: omar@admin.com (level: normal)        |
| `admin_deactivated`     | Super admin deactivated admin account: omar@admin.com                        |
| `path_created`          | Admin sara created Path: Mobile Development (slug: mobile)                  |
| `path_edited`           | Admin omar edited Path: Data Science — updated description                   |
| `path_deactivated`      | Admin sara deactivated Path: Backend Development (47 learners enrolled)      |
| `stage_created`         | Admin sara created Stage: Advanced React in Frontend path (order: 4)         |
| `stage_deleted`         | Admin omar deleted Stage: Deprecated Module in Cybersecurity path            |
| `topic_created`         | Admin sara created Topic: React Hooks in Stage 3 (Frontend)                  |
| `topic_edited`          | Admin omar edited Topic: CSS Flexbox — updated estimated_time_min to 60      |
| `topic_deleted`         | Admin sara deleted Topic: Old HTML Basics                                    |
| `resource_added`        | Admin sara added VIDEO resource to Topic: React Hooks                        |
| `resource_deleted`      | Admin omar deleted ARTICLE resource from Topic: Git Basics                   |
| `skill_created`         | Admin omar created skill: LangChain (framework_library)                      |
| `skill_verified`        | Admin sara verified learner-submitted skill: Tailwind CSS                    |
| `skill_rejected`        | Admin omar rejected learner-submitted skill: "Cooding"                       |
| `project_created`       | Admin sara created Project: REST API Blog Backend (Full-Stack / Stage 3)     |
| `project_deactivated`   | Admin omar deactivated Project: Old Todo App                                 |
| `learner_blocked`       | Admin sara blocked learner: omar@example.com (user_id: abc123)               |
| `learner_unblocked`     | Admin sara unblocked learner: omar@example.com (user_id: abc123)             |

#### Audit Log UI

- Paginated table, 25 rows per page, newest first
- Filters: admin email · event type · date range
- Append-only — no edit or delete controls anywhere in the UI
- Retained for minimum 90 days
- `Export CSV` button (super admin only) — exports current filtered view

---

## 11. Settings (Super Admin Only)

### 10.1 Admin Account Management

| Name           | Email               | Level   | Status   | Last Login   | Actions     |
|----------------|---------------------|---------|----------|--------------|-------------|
| Sara Ahmad     | sara@admin.com      | super   | Active   | Today        | —           |
| Omar Khalil    | omar@admin.com      | normal  | Active   | 2 days ago   | Deactivate  |

- `+ Add Admin` → form: email, display name, admin level (normal / super).
  Creates a `users` row (`role = 'admin'`) and `admins` row.
  Sends a setup email to the new admin with a temporary password and login instructions.
- `Deactivate` → sets `users.status = 'blocked'` for that admin.
  - Cannot deactivate your own account.
  - Cannot deactivate the last remaining active super admin.
  - Deactivated admins remain in the table with "Blocked" status — never hard-deleted
    (preserves audit log `admin_id` references).

### 10.2 Environment Reference (Read-only display)

Displayed as a read-only info panel for super admins. Values come from server environment,
cannot be changed from the UI.

| Variable                    | Purpose                                                    |
|-----------------------------|------------------------------------------------------------|
| `ADMIN_PANEL_PATH`          | The URL slug for the admin panel (e.g. `manage-c7x2k`)    |
| `ADMIN_SESSION_TTL`         | Admin session inactivity timeout in seconds (default: 7200)|
| `AUDIT_LOG_RETENTION_DAYS`  | How long audit log entries are retained (default: 90)      |

---

## 12. Safe Deletion & Deactivation Rules

The system never silently deletes content that learners depend on. Every destructive action
shows a human-readable impact count before proceeding.

| Action               | Condition                                                         | Result                                                                         |
|----------------------|-------------------------------------------------------------------|--------------------------------------------------------------------------------|
| Delete Path          | Any learner has `current_path_id = this path`                     | **Blocked.** "N learners are on this path. Deactivate instead."                |
| Delete Path          | No learners on this path                                          | **Allowed** (super only). Cascades: deletes all stages, topics, resources.     |
| Delete Stage         | Any `user_progress` row exists for topics in this stage           | **Blocked.** "N learners have progress here."                                  |
| Delete Stage         | No learner progress in stage                                      | **Allowed** (super only). Cascades: deletes topics and resources.              |
| Delete Topic         | Any `user_progress` row exists for this topic                     | **Blocked.** "N learners have accessed this topic."                            |
| Delete Topic         | No learner progress for this topic                                | **Allowed** (super only).                                                      |
| Delete Resource      | Always                                                            | **Allowed** (normal admin). Resources are not progress-tracked.                |
| Delete Skill         | Referenced in `topic_skills` or `project_skills`                  | **Blocked.** Shows which topics/projects reference it.                         |
| Delete Skill         | No references anywhere                                            | **Allowed** (super only).                                                      |
| Deactivate Path      | Always                                                            | **Allowed.** Shows impact count. Existing progress preserved.                  |
| Deactivate Project   | Always                                                            | **Allowed.** Learners who completed it keep their record.                      |

Cascade deletions must be explicit in the confirmation modal:
> "This will also permanently delete 5 stages, 34 topics, and 87 resources. This cannot be undone."

---

## 13. States & Edge Cases

| Scenario                                         | Behavior                                                                               |
|--------------------------------------------------|----------------------------------------------------------------------------------------|
| Admin session expires mid-work                   | On next action, redirect to admin login. Unsaved form data is lost — no auto-save in v1. |
| Normal admin accesses a super-only route         | Return 403. Show: "You don't have permission to view this."                            |
| Two admins edit the same record simultaneously   | Last write wins. No conflict resolution in v1. Both edits appear in audit log.         |
| Path has 0 stages                                | Shown in path list with `Stages: 0`. Dashboard flags it as a content warning.          |
| Stage has 0 topics                               | Shown in stage list with `Topics: 0`. Flagged as incomplete.                           |
| Topic has 0 resources                            | Allowed. Topic Viewer handles it with its defined fallback (summary + AI Tutor only).  |
| Admin creates duplicate skill name               | Backend rejects: "A skill named [X] already exists."                                   |
| Reorder fails mid-save (network error)           | Show error. Revert to previous order visually. Do not apply partial reorders.          |
| All super admins are deactivated                 | Prevented by the "cannot deactivate last super admin" rule.                            |
| Admin tries to edit a `UserCustom` project       | Edit controls are hidden. Row is read-only with a label: "Learner-created project."    |

---

## 14. Data Model — Admin-Specific Tables

The admin panel reads and writes core content tables (`paths`, `stages`, `topics`,
`topic_resources`, `skills`, `topic_skills`, `projects`, `project_skills`) defined in the
Roadmap & Topic Viewer spec. Two tables are admin-specific:

### `admins` table
Defined in the Auth spec. Fields: `user_id` (FK → users), `display_name`, `admin_level` (normal / super).

### `admin_audit_log` table

| Field          | Type      | Notes                                                       |
|----------------|-----------|-------------------------------------------------------------|
| `log_id`       | UUID (PK) |                                                             |
| `admin_id`     | UUID (FK) | References `users.user_id` of the acting admin              |
| `event_type`   | VARCHAR   | Snake_case identifier: `topic_created`, `learner_blocked`   |
| `description`  | TEXT      | Human-readable full description of the action               |
| `entity_type`  | VARCHAR   | `path` / `stage` / `topic` / `skill` / `project` / `user` / `admin` |
| `entity_id`    | UUID      | ID of the record acted upon (nullable for login events)     |
| `ip_address`   | VARCHAR   |                                                             |
| `created_at`   | TIMESTAMP | Server time, never client time                              |

No `UPDATE` or `DELETE` is permitted on this table at the application level.

---

## 15. API Routes

All routes are prefixed `/api/admin/`. Every route verifies `users.role = 'admin'` and the
required `admin_level` server-side on every request — never trusted from the token alone.

| Method | Route                                   | Action                                      | Level    |
|--------|-----------------------------------------|---------------------------------------------|----------|
| POST   | `/api/admin/auth/login`                 | Admin login                                 | public   |
| POST   | `/api/admin/auth/logout`                | Admin logout + invalidate session           | normal   |
| GET    | `/api/admin/dashboard`                  | Dashboard stats + content warnings          | normal   |
| GET    | `/api/admin/paths`                      | List all paths                              | normal   |
| POST   | `/api/admin/paths`                      | Create path                                 | normal   |
| PATCH  | `/api/admin/paths/:id`                  | Edit path                                   | normal   |
| DELETE | `/api/admin/paths/:id`                  | Delete path (if safe)                       | super    |
| GET    | `/api/admin/paths/:id/stages`           | List stages for a path                      | normal   |
| POST   | `/api/admin/stages`                     | Create stage                                | normal   |
| PATCH  | `/api/admin/stages/:id`                 | Edit stage                                  | normal   |
| PATCH  | `/api/admin/stages/reorder`             | Reorder all stages in a path (atomic)       | normal   |
| DELETE | `/api/admin/stages/:id`                 | Delete stage (if safe)                      | super    |
| GET    | `/api/admin/stages/:id/topics`          | List topics for a stage                     | normal   |
| POST   | `/api/admin/topics`                     | Create topic                                | normal   |
| PATCH  | `/api/admin/topics/:id`                 | Edit topic                                  | normal   |
| PATCH  | `/api/admin/topics/reorder`             | Reorder all topics in a stage (atomic)      | normal   |
| DELETE | `/api/admin/topics/:id`                 | Delete topic (if safe)                      | super    |
| GET    | `/api/admin/topics/:id/resources`       | List resources for a topic                  | normal   |
| POST   | `/api/admin/topics/:id/resources`       | Add resource to topic                       | normal   |
| PATCH  | `/api/admin/resources/:id`              | Edit resource                               | normal   |
| DELETE | `/api/admin/resources/:id`              | Delete resource                             | normal   |
| PATCH  | `/api/admin/topics/:id/skills`          | Set skill links + importance for a topic    | normal   |
| GET    | `/api/admin/skills`                     | List all skills (filterable)                | normal   |
| POST   | `/api/admin/skills`                     | Create skill                                | normal   |
| PATCH  | `/api/admin/skills/:id`                 | Edit or verify skill                        | normal   |
| DELETE | `/api/admin/skills/:id`                 | Delete skill (if safe)                      | super    |
| GET    | `/api/admin/projects`                   | List all projects (filterable)              | normal   |
| POST   | `/api/admin/projects`                   | Create project                              | normal   |
| PATCH  | `/api/admin/projects/:id`               | Edit project                                | normal   |
| PATCH  | `/api/admin/projects/:id/skills`        | Set skill links + importance for a project  | normal   |
| GET    | `/api/admin/jobs`                       | List all job listings (filterable, read-only) | normal   |
| GET    | `/api/admin/learners/:id`               | Learner detail (read-only)                  | normal   |
| PATCH  | `/api/admin/learners/:id/status`        | Block or unblock learner                    | normal   |
| GET    | `/api/admin/audit-log`                  | View audit log (paginated, filterable)      | super    |
| GET    | `/api/admin/audit-log/export`           | Export audit log as CSV                     | super    |
| GET    | `/api/admin/settings/admins`            | List admin accounts                         | super    |
| POST   | `/api/admin/settings/admins`            | Create admin account                        | super    |
| PATCH  | `/api/admin/settings/admins/:id`        | Deactivate admin account                    | super    |

---

## 16. Integration Points

- **Auth module** — admin login uses the same `users` table but a completely separate
  endpoint, controller, and session scope. Admin and learner sessions are never mixed.
- **Roadmap & Topic Viewer** — all content created by admins (paths, stages, topics,
  resources, `topic_skills`) is consumed directly. Changes take effect immediately on
  learners' next page load.
- **Portfolio Hub** — learner-submitted skills (`is_verified = false`) surface in the
  Skills Catalog for admin review. Verified skills become available in all learner dropdowns.
- **Opportunity Analyzer** — `topic_skills.importance_level` set by admins directly controls which topics the Opportunity Analyzer prioritizes when a learner is missing a skill. The Jobs Monitor provides visibility into the automated `job_listings` feed that powers the Opportunity Analyzer's weekly job board.
- **Resume Builder** — `project_skills` set by admins feeds into the Resume Builder's
  path-specific ATS keyword scoring system.
- **Dashboard (learner)** — the admin dashboard aggregates from the same `user_progress`,
  `user_skills`, and `learners` tables that the learner dashboard reads individually.
