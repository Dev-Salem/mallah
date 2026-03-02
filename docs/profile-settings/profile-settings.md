# Mallah – Profile & Settings

## 1. Overview

The Profile & Settings module lets the learner view and update their personal information,
learning preferences, and AI preferences, and manage account-level options such as password
change and account deletion. It reads and writes directly to the `users` and `learners` tables.

All fields in this module were first collected during the Onboarding Wizard. This module is
the only place a learner can update those values after onboarding is complete.

**URL:** `/settings`
**Access point:** Accessible from the app shell header (avatar/account menu). Not embedded inside the Dashboard content area — it is a separate full page. Requires `learners.onboarding_completed = true`. Learners who have not completed onboarding are redirected to `/onboard` before reaching this page.

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
- Email → `users.email` — immutable in v1. Display with a note: "Contact support to change your email."
  - If `users.email_verified = false`: show an inline **"Unverified"** badge next to the email address with a "Resend verification email" link. Clicking it sends a new verification email and shows inline feedback: "Verification email sent." The link is disabled for 60 seconds after each click to prevent spam.
  - If `users.email_verified = true`: show a subtle **"Verified"** badge. No action needed.
- Current path → `learners.current_path_id` displayed as the full path name (e.g. "Frontend Development"). Read-only. Path changes are not self-service in v1 (see Section 5).

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
| Exploring                  | `exploring`   |

**Side effect:** changing `primary_goal` affects which sections appear on the Dashboard. The Opportunity Analyzer prompt is only shown when `primary_goal` is `job` or `freelance`. The AI Micro-Coach framing angle also changes per goal. These changes take effect automatically on the next Dashboard load.

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

These values control the behavior of all AI features in v1: Topic Tutor, Resume AI, and Opportunity Analyzer. *(AI Career Advisor is planned for a future version.)*

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
- Update `users.password_hash` with the new bcrypt hash (cost factor ≥ 12).
- Invalidate all active refresh tokens for this user **except the current session** — other devices are logged out, but the learner stays logged in on the device they used to change the password.
- Show confirmation: "Password updated successfully."

**On failure:**
- "Current password is incorrect."
- "New password is too short — minimum 8 characters."
- "Passwords do not match."

---

### 4.5 Danger Zone

Visually separated section at the bottom of the page. Subtle destructive styling (e.g. muted red border or increased top margin). Both actions require explicit confirmation before executing.

---

#### Reset Onboarding

**Button:** "Reset Onboarding"

**What it does:** clears all onboarding-set fields in the `learners` table and redirects the learner back to the Onboarding Wizard so they can reconfigure their path, goal, and preferences from scratch.

**Use case:** the learner chose the wrong path, has a significantly different goal, or wants to start fresh with updated preferences.

**Confirmation dialog:**
- Warning: "This will reset your path selection, goals, and preferences. Your progress, projects, and portfolio are not deleted — but your roadmap will be re-scaffolded once you complete onboarding again. This cannot be undone."
- Confirm button + Cancel button.

**On confirmation — backend steps:**
1. Set the following `learners` fields back to `NULL`:
   - `current_path_id`
   - `background_type`
   - `primary_goal`
   - `weekly_hours_category`
   - `learning_velocity`
   - `ai_language_pref`
   - `ai_detail_level`
   - `readiness_level`
2. Set `learners.onboarding_completed = false`.
3. Do **not** delete `user_progress`, `user_skills`, `user_projects`, or any portfolio data — these are preserved.
4. Redirect → `/onboard` (Onboarding Wizard, Step 0).

**Important:** Because `onboarding_completed` is now `false`, the auth routing rules (from the Auth spec) will enforce a redirect to `/onboard` on any attempt to access learner pages until onboarding is re-completed.

---

#### Delete Account

**Button:** "Delete My Account"

**Confirmation dialog:**
- Warning: "This will permanently delete your account, progress, and all data. This cannot be undone."
- Requires the learner to type their email address to confirm.
- Confirm button + Cancel button.

**On confirmation — backend steps:**
1. Verify `confirm_email` matches `users.email`.
2. Set `users.status = 'deleted'` — soft delete. Do not hard-delete rows in v1.
3. Invalidate **all** active refresh tokens immediately, including the current session.
4. Redirect → `/login` with message: "Your account has been deleted."

**Post-deletion login behavior:** if a `status = 'deleted'` user attempts to log in, return the generic message: "Your account has been deactivated. Contact support." — do not reveal the soft-delete mechanism or distinguish from `blocked`.

Soft delete is used in v1 so data can be recovered if needed and analytics are not broken by missing rows. Valid `users.status` values: `active` / `blocked` / `deleted`.

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

| Field                    | Table      | Section That Edits It              |
|--------------------------|------------|------------------------------------|
| `first_name`             | `learners` | Profile                            |
| `last_name`              | `learners` | Profile                            |
| `background_type`        | `learners` | Profile / Reset Onboarding (→NULL) |
| `primary_goal`           | `learners` | Profile / Reset Onboarding (→NULL) |
| `weekly_hours_category`  | `learners` | Learning Preferences / Reset (→NULL) |
| `learning_velocity`      | `learners` | Auto-derived on save / Reset (→NULL) |
| `ai_language_pref`       | `learners` | AI Assistant Preferences / Reset (→NULL) |
| `ai_detail_level`        | `learners` | AI Assistant Preferences / Reset (→NULL) |
| `readiness_level`        | `learners` | Reset Onboarding (→NULL)           |
| `current_path_id`        | `learners` | Reset Onboarding (→NULL)           |
| `onboarding_completed`   | `learners` | Reset Onboarding (→false)          |
| `password_hash`          | `users`    | Account Security                   |
| `status`                 | `users`    | Danger Zone — Delete Account       |

### Read-only Fields (Displayed, Not Editable)

| Field                  | Table      | Notes                                                                 |
|------------------------|------------|-----------------------------------------------------------------------|
| `email`                | `users`    | Immutable in v1. Shown with Verified/Unverified badge + resend action |
| `email_verified`       | `users`    | Drives badge state and resend visibility next to email field          |
| `current_path_id`      | `learners` | Displayed as path display name — not editable in v1                   |
| `onboarding_completed` | `learners` | Not exposed in UI (drives redirect logic only)                        |

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

`learning_velocity` is always returned in the response when `weekly_hours_category` is updated, so the frontend can reflect the new pace immediately without a page reload.

---

### Resend Verification Email

```
POST /api/profile/resend-verification
```

No request body required — acts on the authenticated user's email.

Response:

```json
{
  "success": true,
  "message": "Verification email sent."
}
```

Rate-limited to 1 request per 60 seconds per user.

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

### Reset Onboarding

```
POST /api/profile/reset-onboarding
```

No request body required — acts on the authenticated user.

Response:

```json
{
  "success": true,
  "redirect": "/onboard"
}
```

Backend clears all onboarding-set fields and sets `onboarding_completed = false`. Frontend redirects to `/onboard` on success.

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

Backend verifies `confirm_email` matches `users.email` before proceeding. Sets `users.status = 'deleted'` and invalidates all sessions.

Response:

```json
{
  "success": true,
  "message": "Your account has been deleted."
}
```

---

## 8. UX Notes

- Group fields under clear section headings: **Profile**, **Learning Preferences**, **AI Assistant**, **Security**, **Danger Zone**.
- Use dropdowns or radio buttons for all ENUM fields — never free-text input for these values.
- **Save button behavior:** one "Save Changes" button per section, not a single global save for the whole page. This prevents unintentional overwrites and makes the save scope obvious.
- After saving: show a non-intrusive inline success message at the top of the section — "Saved successfully." Auto-dismisses after 3 seconds.
- Error messages use plain language: "Password is too short — minimum 8 characters" not "Validation failed on field password_hash."
- **Danger Zone:** visually separated from the rest of the page (e.g. subtle red-tinted border, increased top margin). Contains two distinct actions — **Reset Onboarding** and **Delete Account** — each with its own confirmation dialog. Never group them into a single confirm step.
- The **Reset Onboarding** confirmation dialog must make it clear that progress and portfolio data are preserved. Learners should not fear they are losing their work.
- The **Delete Account** confirmation requires typing the email address — this is intentional friction to prevent accidental deletion.
- On mobile, each section collapses into an accordion to keep the page manageable. The Danger Zone is always expanded (never collapsed) to ensure visibility.
