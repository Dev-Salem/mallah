# Mallah – Projects & Skills Hub (Portfolio)

## 1. Purpose

The Projects & Skills Hub is the learner's **interactive portfolio** — a living record of
everything they have learned and built on Mallah.

It serves two audiences simultaneously:

- **The learner** — tracks progress, manages projects, and sees their skills grow.
- **The outside world** — a shareable public URL the learner sends to employers, clients, or collaborators.

Everything in this module feeds directly into the Resume Builder.

---

## 2. The Two Views

This module has two modes controlled by who is viewing it:

| Mode            | Who sees it                         | What they can do                          |
|-----------------|-------------------------------------|-------------------------------------------|
| **Private view** | The learner (authenticated)        | Full edit, add, delete, manage visibility |
| **Public view**  | Anyone with the portfolio link     | Read-only, only sees public items         |

### Public Portfolio URL

Every learner gets a permanent public URL generated at registration:

```
mallah.app/portfolio/{username}
```

`username` is derived from `first_name + last_name` + short unique suffix (e.g. `sara-ahmad-4x2`).
Stored as `learners.portfolio_slug`.

The learner can share this link freely. It always reflects their current public portfolio state.

---

## 3. Scope & Dependencies

**Entry points:**
- Dashboard quick link → "My Portfolio"
- Sidebar navigation
- Direct URL (public)

**Depends on:**
`skills`, `user_skills`, `projects`, `project_skills`, `user_projects`, `user_progress`, `stages`, `paths`

**No AI in v1.** AI suggestions (e.g. "improve your project description") are a future addition.

---

## 4. Page Structure

### 4.1 Portfolio Header

Shown at the top of both private and public views.

- Learner name
- Current path name (e.g. "Frontend Development")
- Primary goal label (e.g. "Looking for a Full-Time Job")
- Quick stats row: `{N} Skills · {M} Projects Completed`
- **"Share Portfolio"** button (private view only) → copies public URL to clipboard
- Optional: short bio text field (free text, max 160 chars) — `learners.bio`

---

### 4.2 Skills Section

**Private view:** shows all skills with source and level. Edit/delete allowed for Manual skills only.

**Public view:** shows only skills where `user_skills.is_public = true`.

**Skills list per item:**
- Skill name
- Level badge: Beginner / Intermediate / Advanced
- Source tag: `Roadmap` / `Project` / `Manual`
- Linked projects: small chips showing which completed projects demonstrate this skill (derived from `project_skills`)

**Filters (private view only):**
- Category: Fundamentals / Language / Framework & Library / Tool / Platform & Service / Practice / Other
- Source: Roadmap / Project / Manual
- Level: Beginner / Intermediate / Advanced

**"Add Skill" button (private view only):**
- Select from existing `skills` catalog (searchable dropdown — no free text to avoid catalog pollution)
- If skill genuinely doesn't exist in catalog → learner types it, saved as pending skill with `is_verified = false` and flagged for admin review
- Set level: Beginner / Intermediate / Advanced (with short description of each shown as helper text)
- `source = 'manual'`, `is_public = true` by default

---

### 4.3 Projects Section

**Private view:** all projects with full management controls.

**Public view:** only projects where `user_projects.is_public = true` and `status = 'completed'`.

**Project card content (both views):**
- Thumbnail image (from `user_projects.thumbnail_url` → fallback to `projects.thumbnail_url` for roadmap projects → styled placeholder if neither set)
- Title
- Short description (learner-written for external projects, from `projects` table for roadmap projects — not editable)
- Difficulty badge
- Source badge: `Roadmap` / `External`
- Tech stack tags (`user_projects.tech_stack` — free-text or catalog-picked, display-only)
- Formal skill badges (from `project_skills`, shows skill name + category)
- GitHub link button (if `user_projects.github_url` is set)
- Live demo link button (if `user_projects.demo_url` is set)
- Personal note (roadmap projects only, from `user_projects.personal_note`)
- Visibility toggle (private view only): Public / Private

**"Add External Project" button (private view only):**
Opens a drawer with:
- Title (required)
- Description (required, max 300 chars)
- Difficulty: Beginner / Intermediate / Advanced
- Thumbnail: upload an image file (optional)
- Tech stack tags: free-text input + searchable skills catalog picker. Tags are stored as a flat array — they are display labels only, separate from formal `project_skills` links
- Formal skills: multi-select from verified catalog — these create `project_skills` rows and unlock `user_skills` on completion
- GitHub URL (optional)
- Live demo URL (optional)
- Status: In Progress / Completed
- `source_type = 'user_custom'`, `is_public = true` by default

**Roadmap projects** (sourced from the learner's path):
- Appear automatically in the list when their prerequisite stage topics are completed
- Status starts as `Available` → learner moves to `In Progress` → `Completed`
- Title and description come from the `projects` table — not editable by learner
- Thumbnail: admin sets a default on the project template (`projects.thumbnail_url`). Learner can upload their own to override it (`user_projects.thumbnail_url`)
- Tech stack tags: learner can add their own free-text or catalog-picked tags to describe what they used (`user_projects.tech_stack`)
- Learner can add GitHub URL, demo URL, and a personal note (max 300 chars) on or after completion

---

## 5. Visibility Control

Every skill and project has an `is_public` boolean (default `true`).

The learner can toggle any item to private from the card itself (private view only).
Private items are invisible on the public portfolio URL — they still appear in the private view with a "Private" label.

This gives learners control over what employers see without losing their internal tracking data.

---

## 6. Core Flows

### 6.1 Load Private View

1. Fetch `user_skills` JOIN `skills` for `user_id`
2. Fetch `user_projects` JOIN `projects` for `user_id`
3. Fetch `project_skills` for all user projects → used to link skills to projects
4. Render with full edit controls

### 6.2 Load Public View

Same as above but:
- Filter `user_skills` WHERE `is_public = true`
- Filter `user_projects` WHERE `is_public = true` AND `status = 'completed'`
- Resolve thumbnail: `user_projects.thumbnail_url` → fallback to `projects.thumbnail_url` → fallback to styled placeholder
- Render as cards (read-only, no edit controls, no filters)

### 6.3 Mark Project as Completed

1. Learner clicks "Mark as Complete" on a project card
2. Modal opens with optional fields:
   - GitHub URL
   - Live demo URL
   - Personal note (roadmap projects only, max 300 chars)
   - Thumbnail upload (image file, optional — overrides admin default for roadmap projects)
   - Tech stack tags (free text or catalog picker, optional)
3. Upsert `user_projects`: `status = 'completed'`, `completed_at = NOW()`, save all provided fields
4. Trigger skill unlock: for each skill in `project_skills` for this project → upsert `user_skills` with `source = 'project'`
5. Dashboard readiness tile updates on next load

### 6.4 Toggle Visibility

1. Learner clicks visibility toggle on any skill or project card
2. PATCH `user_skills.is_public` or `user_projects.is_public`
3. Change reflects immediately on public URL

---

## 7. Data Model Additions

Fields added or updated beyond the base schema:

| Table          | Field               | Type         | Default | Notes                                                                 |
|----------------|---------------------|--------------|---------|-----------------------------------------------------------------------|
| `learners`     | `portfolio_slug`    | VARCHAR      | —       | Generated at registration, unique                                     |
| `learners`     | `bio`               | VARCHAR      | NULL    | Max 160 chars, optional                                               |
| `user_skills`  | `is_public`         | BOOLEAN      | `true`  | Controls portfolio visibility                                         |
| `user_projects`| `is_public`         | BOOLEAN      | `true`  | Controls portfolio visibility                                         |
| `user_projects`| `demo_url`          | VARCHAR      | NULL    | Optional live demo link                                               |
| `user_projects`| `personal_note`     | VARCHAR      | NULL    | Max 300 chars, learner's own commentary (roadmap projects only)       |
| `user_projects`| `thumbnail_url`     | VARCHAR      | NULL    | Learner-uploaded image. Overrides `projects.thumbnail_url` if set     |
| `user_projects`| `tech_stack`        | TEXT[]       | `[]`    | Flat array of display-only tags (free text or catalog-picked labels)  |
| `projects`     | `thumbnail_url`     | VARCHAR      | NULL    | Admin-set default thumbnail for roadmap project templates             |
| `skills`       | `is_verified`       | BOOLEAN      | `true`  | `false` for learner-submitted skills pending admin review             |
| `skills`       | `category`          | ENUM         | —       | `fundamentals` / `language` / `framework_library` / `tool` / `platform_service` / `practice` / `other` |

**Removed from `topic_skills` and `project_skills`:** `importance_level` — replaced by `skills.category` which lives on the skill itself and applies everywhere automatically.

---

## 8. States & Edge Cases

| Scenario                                | Behavior                                                             |
|-----------------------------------------|----------------------------------------------------------------------|
| No skills yet (new learner)             | Empty state: "Complete topics in your roadmap to unlock skills."     |
| No completed projects                   | Empty state: "Finish a project from your roadmap to add it here."    |
| Public portfolio with everything private | Show: "This learner hasn't made their portfolio public yet."        |
| Learner deletes a Manual project        | Remove `user_projects` row. If `projects` row is `user_custom` and no other users reference it, delete it too. |
| Learner deletes a Roadmap skill         | Not allowed. Roadmap-sourced skills are read-only. Only Manual skills can be deleted. |
| Duplicate skill added manually          | If `user_skills` already has this `skill_id` for this user → show error: "You already have this skill." |
| Thumbnail upload exceeds size limit     | Reject with error before upload completes: "Image must be under 2MB." Accept JPG, PNG, WebP only. |
| No thumbnail set on roadmap project     | Show a styled placeholder card with the project title and a path-color background. Never show a broken image. |
| Tech stack tag duplicated               | Silently deduplicate on save — don't show an error, just merge. |
| Learner picks a skill from catalog as a tech stack tag | Store as the skill name string in `tech_stack` array. It does not create a `project_skills` row — that requires explicitly linking via the formal skills section. |

---

## 9. Integration Points

- **Resume Builder** — pulls `user_skills` and completed `user_projects` directly. Portfolio completeness directly determines resume quality.
- **Dashboard** — reads `completed_projects_count` and `unlocked_skills_count` for the Readiness Indicators tiles.
- **Roadmap** — project completion can be triggered from the Topic Viewer when a topic's milestone project is finished. Both modules write to `user_projects`.
- **Opportunity Analyzer** — reads `user_skills` to identify skill gaps against a job description.
