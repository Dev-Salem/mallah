# Mallah – Topic Viewer & AI Lesson Tutor

## 1. Purpose

The Topic Viewer is the **lesson screen** for a single `Topic`.  
It lets the learner:

- Read/view the lesson content.
- Access learning resources (videos, articles, internal text).
- Ask AI questions about this specific topic.
- Mark the topic as completed and move to the next one.

---

## 2. Scope & Dependencies

- Entry point:  
  - From Dashboard → “Resume Learning”  
  - From Roadmap → click on an active Topic
- Depends on: `topics`, `topic_resources`, `user_progress`, `topic_skills`, `user_skills`, `chat_sessions`, `chat_messages`
- Uses AI:
  - Contextual Lesson Tutor (Topic Tutor)

---

## 3. UI Structure

1. **Header Bar**
   - Topic title
   - Stage name + Path name (small breadcrumb)
   - Progress indicator: “Topic X of Y in Stage Z”

2. **Main Content Area (Left)**
   - Topic summary (short description)
   - Core lesson content:
     - Internal text blocks (from `topic_resources` of type `INTERNAL_TEXT`)
     - Embedded video card (for VIDEO resources – external links open in new tab or embedded player)
     - Links to external articles/docs (ARTICLE resources – open in new tab)
   - Estimated time: “Estimated time: ~ N minutes”

3. **AI Tutor Panel (Right)**
   - Title: “Mallah Lesson Tutor”
   - Short subtitle: “Ask anything about this topic”
   - Chat window:
     - Message bubbles (User vs AI)
   - Input:
     - Text field
     - “Ask” button
     - Quick prompts (chips):
       - “Explain again with a simpler example”
       - “Summarize this topic”
       - “Give me a small practice task”

4. **Bottom Actions**
   - “Back to Roadmap”
   - “Mark as Complete”
   - “Next Topic” (visible when current topic is completed)

---

## 4. Core Flows

### 4.1 Open Topic

**Input:**
- `topic_id` from URL or navigation
- `user_id` from session

**Process:**
- Backend loads:
  - Topic: `topics` (title, summary, difficulty, estimated_time_min)
  - Stage + Path names via joins
  - Resources: `topic_resources` ordered by `order_index`
  - Current progress: `user_progress` row (if exists)

**Output UI:**
- Render topic content
- Show whether status is:
  - Not Started / In Progress / Completed

---

### 4.2 Ask AI Lesson Question

**Input:**
- User question text
- Current `topic_id`, `user_id`
- Learner profile (`learners` – background, goal, AI prefs)
- Topic metadata (`topics`, `topic_skills`)

**Process:**
- If no active `chat_session` for this topic and user:
  - Create new row in `chat_sessions` (`session_type = TopicTutor`, linked to `topic_id`)
- Insert user message into `chat_messages`
- Backend calls AI with:
  - Topic title + summary
  - Possibly relevant skills (`topic_skills` → `skills`)
  - User’s level (inferred from progress + skills)
  - User question
- Store AI response in `chat_messages`

**Output UI:**
- Append AI answer in chat panel
- Keep history per session

---

### 4.3 Mark Topic as Complete

**Input:**
- Button click: “Mark as Complete”
- `user_id`, `topic_id`

**Process (Backend):**
- Upsert row in `user_progress`:
  - `status = 'Completed'`
  - `completed_at = NOW()`
  - `last_accessed_at = NOW()`
- Optionally update `user_skills` for skills linked via `topic_skills`:
  - Create/upgrade levels based on rules.

**Output UI:**
- Show success notification
- Update topic status badge (Completed)
- Enable “Next Topic” button
- Roadmap progress recalculated (for Dashboard & Roadmap views)

---

## 5. States & Edge Cases

- Topic locked:
  - If previous prerequisite stage/topic not completed → show message and disable actions (except reading).
- Reopening completed topic:
  - Allowed anytime; “Mark as Complete” may change to “Completed ✔”.
- AI rate limiting:
  - If many questions in a short time, show a gentle limit message.
- Missing resources:
  - If no `topic_resources` → show fallback: “No external resources, use the lesson summary + AI Tutor”.

---
