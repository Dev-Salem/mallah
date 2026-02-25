# Mallah – Admin Panel v3 (Functional Contract)

## 1. Purpose

The Admin Panel is the internal control surface for Mallah content and platform operations.

It owns:
- Curriculum and catalog management (paths, stages, topics, resources, skills, projects).
- Operational visibility (platform health, learner activity aggregates).
- Learner account moderation (block/unblock only).
- Admin account management (super admins only).
- Append-only audit logging for admin actions.

It is not part of the learner product and must not be referenced by learner-facing UI, routing, sitemaps, or API responses.

---

## 2. Scope Boundaries

### Admin Panel CAN:
- Create/edit/deactivate curriculum content.
- Create/edit/verify skills.
- Create/edit/deactivate platform project templates.
- View learner aggregates and basic learner profile metadata.
- Block/unblock learners.
- View audit log (super).
- Manage admin accounts (super).

### Admin Panel CANNOT:
- Be discoverable from learner routes, UI, or API responses.
- Provide learner functionality (roadmap, dashboard, portfolio, resume).
- Modify learner progress records (`user_progress`) directly.
- Access or expose learner private content (resume details, portfolio item details, tutor chats, raw onboarding answers, AI recommendation payloads).

---

## 3. Access & Security

### 3.1 Obscured Admin Entry Path (Defense-in-Depth)

Admin UI base path:

- `/{ADMIN_PANEL_PATH}`

`ADMIN_PANEL_PATH` is an environment variable set at deployment and never committed.

Rules:
- Never hardcode the admin path; always read from environment configuration.
- Requests to common admin paths like `/admin`, `/administrator` must return standard 404 (no redirect).
- Requests to the correct admin URL without an admin session must also return 404 (do not reveal existence).
- Exclude admin route from sitemap and robots.

This is an additional barrier; authentication remains mandatory.

---

### 3.2 Separate Admin Login (Separate Session Scope)

Admin login endpoint and UI are separate from learner login.

Rules:
- No register link.
- No forgot password link (v1).
- No learner branding requirement (can be minimal).

Admin login validation:
1. Find users row by email.
2. Require `users.role = admin` or return generic error.
3. Require matching `admins` row.
4. Require `users.status = active`.
5. Verify password hash.
6. Issue admin session token (admin-only scope).
7. Write audit log entry.

Failure response:
- Always a single generic message: “Invalid credentials.”

Admin session rules:
- Expires after 2 hours inactivity.
- No remember-me.
- Every `/api/admin/*` request validates session + role server-side.

---

### 3.3 Admin Levels

| Level  | Permissions |
|--------|------------|
| normal | Create/edit/deactivate content, view dashboards and learners list, block/unblock learners, manage resources |
| super  | All normal permissions + delete (safe delete rules), manage admin accounts, view/export audit log, view settings |

Bootstrapping rule:
- First super admin must be seeded at deployment (not created via UI).

---

## 4. Admin Navigation (Logical Modules)

Admin modules (logical groups; UI structure is not part of this contract):
- Dashboard (health + warnings)
- Content:
  - Paths & Stages
  - Topics & Resources
  - Skills Catalog
- Projects
- Learners
- Audit Log (super)
- Settings (super)

---

## 5. Admin Dashboard (Read-only Aggregates)

Purpose:
- Surface platform health and content integrity issues.

Must include (minimum):

### 5.1 Health Metrics
- total_active_learners
- active_learners_last_7_days
- topics_completed_last_30_days
- pending_skill_reviews_count

### 5.2 Path Overview (Aggregated)
For each path:
- learners_count
- avg_path_completion_percent
- active_this_week_count

### 5.3 Content Health Warnings
Auto-detected warnings:
- Path with 0 stages
- Stage with 0 topics
- Topic with 0 resources

Warnings must include a direct reference to fix target (entity id).

### 5.4 Recent Admin Activity
- Latest N entries from audit log (read-only)

---

## 6. Content Management Contracts

### 6.1 Paths

Path fields:
- path_id (slug, immutable after creation)
- name
- description
- is_active

Rules:
- Deactivating a path prevents new enrollments but must not delete learner progress.
- path_id slugs for core system paths must not change.

Operations:
- Create (normal+)
- Edit (normal+)
- Deactivate (normal+)
- Delete (super only, safe-delete rules apply)

---

### 6.2 Stages

Stage fields:
- stage_id
- path_id
- title
- description
- difficulty_level
- order_index

Operations:
- Create (normal+)
- Edit (normal+)
- Reorder (normal+, atomic)
- Delete (super only, safe-delete rules apply)

Reorder rule:
- Reorder is atomic: send full ordered list and commit as a single transaction.
- Reordering must not break learner progress (progress is keyed by topic_id).

---

### 6.3 Topics

Topic fields:
- topic_id
- stage_id
- title
- summary
- estimated_time_min
- difficulty_level
- order_index
- is_mandatory

Operations:
- Create (normal+)
- Edit (normal+)
- Reorder (normal+, atomic)
- Delete (super only, safe-delete rules apply)

Delete blocking:
- If any `user_progress` exists for topic → delete blocked.

---

### 6.4 Topic Resources

Resource fields:
- resource_id
- topic_id
- resource_type (INTERNAL_TEXT | VIDEO | ARTICLE)
- title
- url (nullable)
- content (nullable)
- order_index

Operations:
- Create/edit/delete (normal+)
- Reorder within a topic (normal+, atomic)

Deletion is always allowed because resources are not progress-tracked.

---

### 6.5 Topic Skill Links

Owned by admin as curriculum metadata.

Fields:
- topic_id
- skill_id
- importance_level (Low | Medium | High)

Operations:
- Set/replace links for a topic (normal+)
- Uses verified skills only.

These links drive:
- user_skills unlocking (via roadmap completion)
- Opportunity Analyzer prioritization

---

### 6.6 Skills Catalog

Skill fields:
- skill_id (immutable)
- name (unique)
- category
- description
- is_verified (boolean)

Rules:
- Pending skills come from learner suggestions and must be verified or rejected.
- Reject is allowed only when no references exist (pending skills should be unreferenced by design).

Operations:
- Create (normal+)
- Edit (normal+)
- Verify/reject pending (normal+)
- Delete (super only, safe-delete rules apply)

---

## 7. Projects Management (Platform Templates)

Projects managed here are platform-defined templates that appear in learner roadmaps.

Project fields (minimum):
- project_id
- title
- description
- difficulty_level
- path_id
- stage_id
- is_active
- source_type (Platform | UserCustom)

Rules:
- Platform projects can be edited/deactivated by admins.
- UserCustom projects are visible read-only for awareness; admins cannot edit.

Project skill links:
- project_id
- skill_id
- importance_level (Low | Medium | High)

On learner completion, these links are used to upsert user_skills with source=Project (handled by portfolio/project completion logic).

---

## 8. Learners View (Read-only + Moderation)

Admin may view limited learner metadata for support and platform health:

Allowed fields:
- name
- email
- email_verified
- onboarding_completed
- current_path_id (or none)
- progress summary (aggregated)
- last_active summary
- counts: unlocked_skills_count, completed_projects_count

Forbidden access:
- Resume content details
- Portfolio item contents beyond aggregate counts
- Tutor chat history
- Raw onboarding answers
- AI recommendation payloads

Only write action:
- Block/unblock (updates users.status)

---

## 9. Audit Log (Super Only)

Audit log must be append-only.

Must log:
- admin logins (success/failure)
- content creates/edits/deletes/deactivations
- skill verify/reject
- learner block/unblock
- admin account create/deactivate

Retention:
- Minimum 90 days (configurable)

Export:
- CSV export of filtered view (super only)

No edit/delete operations.

---

## 10. Settings (Super Only)

### 10.1 Admin Accounts
Operations:
- Create admin account (role=admin + admins row)
- Deactivate admin account

Constraints:
- Cannot deactivate self.
- Cannot deactivate last active super admin.

### 10.2 Environment Reference (Read-only)
Expose read-only values:
- ADMIN_PANEL_PATH
- ADMIN_SESSION_TTL
- AUDIT_LOG_RETENTION_DAYS

---

## 11. Safe Delete & Deactivation Rules (Authoritative)

No destructive action may proceed without an impact check.

| Entity | Delete Allowed When | Result |
|--------|----------------------|--------|
| Path   | No learners enrolled AND super admin | Cascade delete stages/topics/resources |
| Stage  | No user_progress exists in its topics AND super admin | Cascade delete topics/resources |
| Topic  | No user_progress exists AND super admin | Delete allowed |
| Resource | Always (normal admin) | Delete allowed |
| Skill  | No references in topic_skills or project_skills AND super admin | Delete allowed |
| Project (Platform) | Always (normal admin) | Prefer deactivate, preserve learner records |

Deactivation:
- Allowed for normal admins.
- Must show impact counts (learners affected, enrollments, references).

Cascade deletion confirmation must explicitly list counts of child records to be removed.

---

## 12. API Routes (Contract)

All admin routes are prefixed `/api/admin/`.

All routes must validate:
- session is valid
- users.role = admin
- admin_level meets required level

Minimum routes:

Auth:
- POST /api/admin/auth/login (public)
- POST /api/admin/auth/logout (admin)

Dashboard:
- GET /api/admin/dashboard (normal+)

Paths/Stages:
- GET/POST/PATCH/DELETE /api/admin/paths (delete super)
- GET/POST/PATCH/DELETE /api/admin/stages (delete super)
- PATCH /api/admin/stages/reorder (normal+, atomic)

Topics/Resources:
- GET/POST/PATCH/DELETE /api/admin/topics (delete super)
- PATCH /api/admin/topics/reorder (normal+, atomic)
- GET/POST/PATCH/DELETE /api/admin/resources (normal+)
- PATCH /api/admin/resources/reorder (normal+, atomic per topic)

Skill Links:
- PATCH /api/admin/topics/:id/skills (normal+)
- PATCH /api/admin/projects/:id/skills (normal+)

Skills:
- GET/POST/PATCH/DELETE /api/admin/skills (delete super)
- PATCH /api/admin/skills/:id/verify (normal+)
- PATCH /api/admin/skills/:id/reject (normal+, safe only if unreferenced)

Projects:
- GET/POST/PATCH /api/admin/projects (normal+)
- PATCH /api/admin/projects/:id/deactivate (normal+)

Learners:
- GET /api/admin/learners (normal+)
- GET /api/admin/learners/:id (normal+)
- PATCH /api/admin/learners/:id/status (normal+)

Audit (super):
- GET /api/admin/audit-log
- GET /api/admin/audit-log/export

Admin accounts (super):
- GET/POST/PATCH /api/admin/settings/admins

---

## 13. Integration Points

- Auth module:
  - Shares users table but uses separate admin session scope and separate admin endpoints.
- Roadmap Engine:
  - Consumes admin-managed curriculum tables directly.
- Portfolio Hub:
  - Feeds pending skills into skills catalog review flow.
- Opportunity Analyzer:
  - Uses topic_skills.importance_level to prioritize remediation topics.
- Learner Dashboard:
  - Admin dashboard aggregates from learner data sources but never leaks admin info to learners.

---

## 14. Invariants

- Admin panel is not discoverable from learner product surfaces.
- Every admin write action is audited.
- Audit log is append-only.
- Safe-delete rules prevent deletion of content with learner progress references.
- Admin and learner sessions are never mixed.