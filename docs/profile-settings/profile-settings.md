# Mallah – Profile & Settings

## 1. Overview

The Profile & Settings module lets the learner view and update their personal information,
learning preferences, and AI preferences, and manage account-level options such as password
change and account deletion. It reads and writes directly to the `users` and `learners` tables.

All fields in this module were first collected during the Onboarding Wizard. This module is
the only place a learner can update those values after onboarding is complete.

---

## 2. Goals

- Provide a clear, organized place to manage identity and preferences.
- Keep data consistent with what onboarding collected — same field names, same ENUM values.
- Allow safe updating of learning pace and AI behavior without breaking roadmap progress.
- Keep security actions (password change) straightforward and consistent with the auth module.

---

## 3. Actors

- **Learner**
- **Backend API**
- **Database** (`users`, `learners`)

---

## 4. Main Sections (UI)

### 4.1 Profile

Editable fields:
- First name → `learners.first_name`
- Last name → `learners.last_name`

Read-only fields:
- Email → `users.email` — immutable in v1. Changing email complicates identity and login flow. Display with a note: "Contact support to change your email."
- Current path → `learners.current_path_id` displayed as the full path name. Read-only. Path changes are not self-service in v1 (see Section 5).

Editable dropdown:
- Background type → `learners.background_type`

| Display Label         | DB Value          |
|-----------------------|-------------------|
| Student               | `student`         |
| Fresh Graduate        | `fresh_grad`      |
| Career Shifter        | `career_shifter`  |
| No Tech Background    | `no_tech`         |

Editable dropdown:
- Primary goal → `learners.primary_goal`

| Display Label              | DB Value      |
|----------------------------|---------------|
| Get a Full-Time Job        | `job`         |
| Freelance                  | `freelance`   |
| Build My Own Project       | `startup`     |
| Just Exploring             | `exploring`   |

---

### 4.2 Learning Preferences

Editable dropdown:
- Weekly study time → `learners.weekly_hours_category`

| Display Label        | DB Value  |
|----------------------|-----------|
| 0–3 hours/week       | `0-3`     |
| 4–7 hours/week       | `4-7`     |
| 8–12 hours/week      | `8-12`    |
| 13+ hours/week       | `13+`     |

**Important:** Updating `weekly_hours_category` must also re-derive and update `learners.learning_velocity` using the same logic defined in the Onboarding spec:

| `weekly_hours_category` | Derived `learning_velocity` |
|-------------------------|-----------------------------|
| `0-3`                   | `slow`                      |
| `4-7`                   | `normal`                    |
| `8-12`                  | `fast`                      |
| `13+`                   | `fast`                      |

This update propagates to the Dashboard forecast and pace strip automatically on next load. No manual step required.

---

### 4.3 AI Assistant Preferences

These values control the behavior of all AI features: Topic Tutor, Career Advisor, Resume AI, and Opportunity Analyzer.

Editable radio/dropdown:
- AI language preference → `learners.ai_language_pref`

| Display Label | DB Value  |
|---------------|-----------|
| Arabic        | `arabic`  |
| English       | `english` |
| Mix           | `mix`     |

- AI response detail → `learners.ai_detail_level`

| Display Label | DB Value    |
|---------------|-------------|
| Short         | `short`     |
| Balanced      | `balanced`  |
| Detailed      | `detailed`  |

Changes take effect immediately on the next AI interaction — no session restart required.

---

### 4.4 Account Security

**Change Password form:**
- Current password (required to authorize the change)
- New password
- Confirm new password

**Backend validation:**
- Verify current password against `users.password_hash`.
- New password must meet strength requirements (≥ 8 characters, at least one letter and one number).
- New password must differ from current password.

**On success:**
- Update `users.password_hash` with the new bcrypt/argon2 hash.
- Invalidate all active refresh tokens for this user except the current session (other devices are logged out).
- Show confirmation: "Password updated successfully."
- Do not force logout of the current session.

**On failure:**
- "Current password is incorrect."
- "New password is too short — minimum 8 characters."
- "Passwords do not match."

---

### 4.5 Danger Zone

**Delete Account:**
- Button: "Delete My Account"
- Clicking opens a confirmation dialog:
  - Warning: "This will permanently delete your account, progress, and all data. This cannot be undone."
  - Requires the learner to type their email to confirm.
  - Confirm button + Cancel button.
- On confirmation:
  - Set `users.status = 'deleted'` (soft delete — do not hard delete rows in v1).
  - Invalidate all sessions immediately.
  - Redirect to Login page with message: "Your account has been deleted."

Soft delete is used in v1 so data can be recovered if needed and analytics are not broken by missing rows.

---

## 5. Path Change Policy

Learners **cannot change their active path from the Profile page** in v1.

Reason: switching paths would require decisions about what happens to existing `user_progress`, `user_skills`, and `chat_sessions` — this logic is not trivial and is deferred to a future controlled feature.

If a learner genuinely needs to switch paths:
- They must contact support, or
- An admin can update `learners.current_path_id` directly from the Admin Panel.

The Profile page should display the current path as read-only with a note: "Want to change your path? Contact support."

---

## 6. Data Integration

### Fields Read and Written

| Field                    | Table      | Section That Edits It       |
|--------------------------|------------|-----------------------------|
| `first_name`             | `learners` | Profile                     |
| `last_name`              | `learners` | Profile                     |
| `background_type`        | `learners` | Profile                     |
| `primary_goal`           | `learners` | Profile                     |
| `weekly_hours_category`  | `learners` | Learning Preferences        |
| `learning_velocity`      | `learners` | Auto-derived on save        |
| `ai_language_pref`       | `learners` | AI Assistant Preferences    |
| `ai_detail_level`        | `learners` | AI Assistant Preferences    |
| `password_hash`          | `users`    | Account Security            |
| `status`                 | `users`    | Danger Zone (delete)        |

### Read-only Fields (Displayed, Not Editable)

| Field               | Table      | Notes                                       |
|---------------------|------------|---------------------------------------------|
| `email`             | `users`    | Immutable in v1                             |
| `current_path_id`   | `learners` | Displayed as path name, not editable in v1  |
| `onboarding_completed` | `learners` | Not exposed in UI                        |

---

## 7. API Contract

### Load Profile

```
GET /api/profile
```

Response:

```json
{
  "user": {
    "email": "string",
    "email_verified": true
  },
  "learner": {
    "first_name": "string",
    "last_name": "string",
    "background_type": "student | fresh_grad | career_shifter | no_tech",
    "primary_goal": "job | freelance | startup | exploring",
    "current_path_id": "frontend | fullstack | cybersecurity | datascience",
    "current_path_display_name": "string",
    "weekly_hours_category": "0-3 | 4-7 | 8-12 | 13+",
    "learning_velocity": "slow | normal | fast",
    "ai_language_pref": "arabic | english | mix",
    "ai_detail_level": "short | balanced | detailed"
  }
}
```

---

### Save Profile Changes

```
PATCH /api/profile
```

Request body (only include fields being updated):

```json
{
  "first_name": "string",
  "last_name": "string",
  "background_type": "string",
  "primary_goal": "string",
  "weekly_hours_category": "string",
  "ai_language_pref": "string",
  "ai_detail_level": "string"
}
```

Response:

```json
{
  "success": true,
  "updated_fields": ["first_name", "weekly_hours_category", "learning_velocity"],
  "learning_velocity": "normal"
}
```

`learning_velocity` is always returned in the response when `weekly_hours_category` is updated, so the frontend can reflect the new pace immediately.

---

### Change Password

```
POST /api/profile/change-password
```

Request body:

```json
{
  "current_password": "string",
  "new_password": "string"
}
```

Response:

```json
{
  "success": true,
  "message": "Password updated successfully."
}
```

---

### Delete Account

```
DELETE /api/profile
```

Request body:

```json
{
  "confirm_email": "string"
}
```

Backend verifies `confirm_email` matches `users.email` before proceeding.

---

## 8. UX Notes

- Group fields under clear section headings: "Profile", "Learning Preferences", "AI Assistant", "Security", "Danger Zone".
- Use dropdowns or radio buttons for all ENUM fields — never free-text input for these values.
- Save button behavior:
  - One "Save Changes" button per section, not one global save for the whole page. This avoids unintentional overwrites and makes the save scope clear.
- After saving: show a non-intrusive success banner at the top of the section — "Saved successfully."
- Error messages use plain language: "Password is too short" not "Validation failed on field password_hash."
- Danger Zone section should be visually separated (e.g. subtle red border or increased top margin) and placed at the very bottom of the page.
- On mobile, each section collapses into an accordion to keep the page manageable.
