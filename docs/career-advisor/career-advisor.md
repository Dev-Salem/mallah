# Mallah – AI Career Advisor

## 1. Purpose

Global AI chat that helps the learner with:

- Career questions (what to learn next, how to position themselves).
- Guidance on job search strategy.
- High-level feedback on progress and readiness.

Separate from lesson-level AI Tutor (which is tied to a specific Topic).

---

## 2. Scope & Dependencies

- Entry:
  - From Dashboard (“Ask Career Advisor”)
  - From navigation menu
- Depends on:
  - `chat_sessions` (session_type = CareerAdvisor)
  - `chat_messages`
  - Learner data: `learners`, `user_skills`, `user_projects`, `user_progress`, `paths`

---

## 3. UI Structure

1. Header
   - Title: “AI Career Advisor”
   - Small text: “Ask anything about your tech career”

2. Context Summary Bar
   - Current path
   - Progress percentage
   - Skills count
   - Projects count

3. Chat Area
   - Conversation bubbles:
     - User messages on right
     - AI messages on left
   - Scrollable history per session

4. Input Area
   - Text box
   - “Send” button
   - Suggested quick prompts:
     - “What should I focus on this week?”
     - “Am I ready to apply for junior jobs?”
     - “How can I improve my portfolio?”

---

## 4. Core Flows

### 4.1 Start or Continue Session

**Input:**
- `user_id`

**Process:**
- Check if there is an existing open `chat_session` for `CareerAdvisor`
- If not, create new session in `chat_sessions`:
  - `session_type = 'CareerAdvisor'`
- Load last N `chat_messages` for that session

**Output:**
- Render chat history

---

### 4.2 Ask Career Question

**Input:**
- User question (text)

**Process:**
- Insert user message into `chat_messages`
- Backend builds context:
  - `learners` (background, goal)
  - Path & progress from `learners.current_path_id`, `user_progress`
  - Skills from `user_skills`
  - Projects from `user_projects`
- Call AI with:
  - User question
  - Compressed user context
- Insert AI answer into `chat_messages`

**Output:**
- Display AI reply

---

## 5. States & Edge Cases

- New user with no data:
  - Advisor should give general guidance and suggest starting with onboarding/roadmap.
- Rate limiting:
  - If user sends too many messages, show limitation notice.
- Context refresh:
  - On major changes (new path, many new skills), new sessions can re-summarize progress.

---
