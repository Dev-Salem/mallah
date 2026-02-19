# Mallah – Resume Builder

## 1. Purpose

Interactive tool to help the learner build a professional CV using:

- Data already stored in Mallah (skills, projects)
- Manual entries (experience, education, summary)
- Optional AI assistance to refine phrasing and improve ATS score.

---

## 2. Scope & Dependencies

- Entry: from Dashboard or nav (“Resume Builder”)
- Depends on:
  - `resumes`, `resume_sections`
  - `users`, `learners` (personal info)
  - `user_skills`, `skills`, `user_projects`, `projects`
  - AI Engine (for “Improve” and ATS feedback)

---

## 3. UI Structure

1. **Header**
   - Title: “Resume Builder”
   - Resume selector (if multiple resumes)
   - ATS score badge (if available) – e.g., “ATS Score: 72/100”

2. **Two-Column Layout**
   - Left: Form inputs (sections)
   - Right: Live Preview (resume layout)

3. **Sections (Left Form)**
   - Personal Info:
     - Name, email, phone, LinkedIn, GitHub
   - Summary:
     - Textarea with “AI Improve” button
   - Skills:
     - List pulled from `user_skills` (with checkboxes to show/hide)
     - Option to manually add skill text
   - Projects:
     - List from `user_projects` (Completed) + `projects`
     - Toggles to include/exclude specific projects
     - Optional description override per resume
   - Education:
     - Manual entries (degree, institution, year)
   - Experience:
     - Manual experiences (role, company, period, description)
   - Certificates & Activities:
     - Manual entries

4. **Actions**
   - “Save” button
   - “Recalculate ATS” button
   - “Download PDF” button
   - Per-field “AI Improve” icons for text sections

---

## 4. Core Flows

### 4.1 Load or Create Resume

**Input:**
- `user_id`
- optional `resume_id` in URL or “New Resume” click

**Process:**
- If `resume_id`:
  - Load from `resumes`, `resume_sections`
- Else:
  - Create new row in `resumes` with default title and language
  - Create default sections:
    - SUMMARY, SKILLS, PROJECTS, EDUCATION (min set)

**Output:**
- Form and preview populated with data (empty fields where needed)

---

### 4.2 Edit Sections & Save

**Input:**
- Section edits from form (summary text, experience list, etc.)

**Process:**
- For each section:
  - Update or insert into `resume_sections`:
    - `section_type`
    - `header` (optional)
    - `section_content`
    - `sort_order`
- Update `resumes.last_updated_at`

**Output:**
- Confirmation message
- Live preview updated

---

### 4.3 AI Improve Text

**Input:**
- Selected text (e.g., Summary, Experience description)
- Section type, language, user path/goals

**Process:**
- Backend sends prompt to AI:
  - “Rewrite this summary for a [path] junior role…”
- Replace original text with AI version if user confirms

**Output:**
- Updated text in form (with possibility to undo via browser ctrl+Z or custom undo)

---

### 4.4 Recalculate ATS

**Input:**
- Current resume content (sections text)
- Optionally job keywords or target role

**Process:**
- Backend or AI runs simple ATS evaluation:
  - Keyword coverage
  - Structure completeness
- Save `ats_score` in `resumes`

**Output:**
- Show new ATS score
- Optional hints: “Add more keywords about X,” “Improve action verbs in Experience.”

---

### 4.5 Export PDF

**Input:**
- `resume_id`

**Process:**
- Backend fetches all sections ordered by `sort_order`
- Generates PDF with predefined template (ATS-friendly)
- Returns file to user

**Output:**
- PDF download

---

## 5. States & Edge Cases

- No resume exists:
  - Auto-create one on first access.
- No skills or projects:
  - Show hint: “Complete topics and projects to auto-fill skills and projects.”
- AI unavailable:
  - Hide “AI Improve” and ATS buttons or show fallback message.

---
