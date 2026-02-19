# Mallah – Projects & Skills Hub

## 1. Purpose

Single page that shows:

- All **skills** the learner has acquired.
- All **projects** the learner is working on or finished.

Each item is clearly marked as:

- Platform-derived (from Roadmap/Projects) vs
- Manually added by user.

---

## 2. Scope & Dependencies

- Entry points:
  - From Dashboard quick link: “Projects & Skills Hub”
  - From nav sidebar
- Depends on: `skills`, `user_skills`, `projects`, `project_skills`, `user_projects`, `user_progress`
- No mandatory AI in v1 (AI may be added later to suggest improvements).

---

## 3. UI Structure

1. **Page Header**
   - Title: “Projects & Skills Hub”
   - Subtitle: “Everything you’ve learned and built in one place”
   - Quick stats:
     - “Skills: N”
     - “Projects: M”

2. **View Switcher**
   - Tabs:
     - “Skills”
     - “Projects”

3. **Skills View**
   - Filters:
     - Category filter (Technical / ToolPlatform / FrameworkLibrary / SoftSkill)
     - Level filter (Beginner / Intermediate / Advanced)
   - Skills grid/list:
     - Each item shows:
       - Skill name
       - Level badge (Beginner/Intermediate/Advanced)
       - Source icon:
         - “Roadmap” (auto)
         - “Project” (auto)
         - “Manual” (user-added)
       - Date acquired
   - Button:
     - “Add External Skill”:
       - Opens modal:
         - Skill name (text or dropdown from `skills`)
         - Level selection
         - Source = Manual

4. **Projects View**
   - Filters:
     - Status filter (Available / In Progress / Completed)
     - Difficulty filter (Beginner / Intermediate / Advanced)
   - Project cards:
     - Title
     - Short description
     - Difficulty level
     - Status badge
     - Skills involved (badges from `project_skills`)
     - Optional GitHub link (if learner completed it and provided URL)
     - “Edit” and “Delete” only for user-owned data (UserCustom or user link)
   - Button:
     - “Add External Project”:
       - Title, description, difficulty, tech/skills tags, optional GitHub URL

---

## 4. Core Flows

### 4.1 Load Skills View

**Input:**
- `user_id` from session

**Process:**
- Query `user_skills` joined with `skills`:
  - `user_skills.user_id = current user`
- Group or filter by category and level

**Output:**
- Render skills list with:
  - name, level, category, source, acquired_at

---

### 4.2 Load Projects View

**Input:**
- `user_id`

**Process:**
- Get available platform projects for this path (optional):
  - `projects` where `is_active = 1`
- Get user-specific data:
  - `user_projects` where `user_id = current user`
- Join to show status per project

**Output:**
- Project list:
  - For each project:
    - Core metadata from `projects`
    - Status and GitHub URL from `user_projects` (if exists)

---

### 4.3 Add External Skill

**Input:**
- Skill name (select from existing or free text)
- Level
- Source = Manual

**Process:**
- If skill name exists in `skills`, link it
- Else:
  - Optionally create new `skills` row (`category` = Technical or SoftSkill)
- Insert `user_skills` row with:
  - `source = 'Manual'`
  - `acquired_at = NOW()`

---

### 4.4 Add External Project

**Input:**
- Title, description
- Difficulty level
- Skills/tech tags (select from catalog or text)
- Optional GitHub URL

**Process:**
- Create `projects` row if `source_type = 'UserCustom'`
- Create `user_projects` row with:
  - `status = Completed` (if user already finished it)
  - `github_url` if provided

**Output:**
- Project appears under Projects View as user project

---

## 5. States & Edge Cases

- No skills:
  - Show empty state: “Start learning from your Roadmap to unlock skills.”
- No projects:
  - Show suggestion: “Try your first project from your roadmap or add a project you already did.”
- Manual deletions:
  - If user deletes a UserCustom project:
    - Remove from `user_projects` and optionally from `projects` if no other users use it.
- Consistency:
  - Skills from Roadmap/Projects should **not** be editable for level/source (only view).
  - Manual items can be edited/deleted by the user.

---
