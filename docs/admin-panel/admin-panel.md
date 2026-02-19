# Mallah – Admin Panel

## 1. Purpose

Internal interface for admins to:

- Manage learning content (Paths, Stages, Topics, Resources).
- Manage skills catalog and project templates.
- Monitor high-level platform usage (basic stats).

No multi-tenant roles or complex permissions in v1 (all admins same role).

---

## 2. Scope & Dependencies

- Entry:
  - `/admin` area (protected, only `admins`)
- Depends on:
  - `admins`, `users`
  - `paths`, `stages`, `topics`, `topic_resources`
  - `skills`
  - `projects`, `project_skills`
  - (Read-only) `user_progress`, `user_skills`, `user_projects` for stats

---

## 3. UI Structure

1. Login (Admin)
   - Admin uses same Login page as learners.
   - If `user_id` exists in `admins` → redirect to Admin Panel.

2. Admin Sidebar
   - Dashboard
   - Paths & Stages
   - Topics & Resources
   - Skills Catalog
   - Project Templates
   - Users (read-only basic info)
   - (Future) Settings

3. Admin Dashboard
   - Key metrics:
     - Number of learners
     - Active paths count
     - Popular paths (by number of learners)
     - Average completion rate (rough)
   - Quick buttons:
     - “Create New Path”
     - “Add New Skill”
     - “Add Project Template”

4. Paths & Stages Management
   - List of paths:
     - Name, active status
     - “Edit” path (name, description, is_active)
   - Clicking a path:
     - Shows its stages as list:
       - Title, difficulty, order_index
       - Actions: Add Stage, Edit, Delete

5. Topics & Resources Management
   - Pick a Path → Stage → see topics table:
     - Title, order_index, estimated_time, difficulty
     - Actions: Add Topic, Edit, Delete
   - Topic edit form:
     - Topic core fields
     - Resources section:
       - List of `topic_resources` with:
         - type, title, url/content, order
         - Add/Edit/Delete buttons

6. Skills Catalog
   - Table:
     - Skill name, category
     - Usage count (how many topics/projects use it – optional)
   - Add/Edit Skill forms

7. Project Templates
   - Table:
     - Title, difficulty_level, source_type, is_active
   - Form:
     - Title, description, difficulty, source_type
     - Link to skills:
       - Multi-select skills with `importance_level`
   - Uses `project_skills` as relation

8. Users View (Read-only)
   - Basic list:
     - Name, email, status, current path
   - Option:
     - Filter by path or status

---

## 4. Core Flows

### 4.1 Admin Login

**Input:**
- Email, password

**Process:**
- Same auth as `users`
- After sign-in:
  - Check `admins` table:
    - If exists → redirect `/admin`
    - Else → redirect `/dashboard` (normal learner)

---

### 4.2 Create / Edit Path

**Input:**
- Path form data (name, description, is_active)

**Process:**
- Insert or update row in `paths`

**Output:**
- Updated list view

---

### 4.3 Manage Stages

**Input:**
- Stage form data (path_id, title, description, difficulty_level, order_index)

**Process:**
- Insert/update `stages`
- Ensure `order_index` remains consistent for path

---

### 4.4 Manage Topics & Resources

**Input:**
- Topic form data
- Resource form data

**Process:**
- Insert/update `topics`
- Insert/update/delete `topic_resources` for each topic

---

### 4.5 Manage Skills

**Input:**
- Skill form (name, category, description)

**Process:**
- Insert/update `skills`

---

### 4.6 Manage Project Templates

**Input:**
- Project fields + selected skills with importance level

**Process:**
- Insert/update `projects`
- For each selected skill:
  - Insert/update row in `project_skills`

---

## 5. States & Edge Cases

- Deleting content:
  - If deleting a Path/Stage/Topic, system should:
    - Either prevent deletion when learners exist, or
    - Mark as inactive instead of physical delete (safer).
- Admin failures:
  - Show clear error messages (e.g., path already exists).

---
