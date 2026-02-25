# Mallah – Profile & Settings (Functional Specification)

## 1. Overview

The Profile & Settings module allows the learner to:

- View identity and onboarding-derived attributes.
- Update selected personal and learning preferences.
- Configure AI assistant behavior.
- Perform account-level security actions (password change).
- Request account deletion (if enabled by business rules).

This module reads from and writes to the `User` and `Learner` entities.
It does not modify roadmap progress or active path directly.

---

## 2. Actors

- Learner (authenticated)
- Backend API
- Database (User, Learner, Onboarding, AI Preferences)

---

## 3. Scope Boundaries

### This module CAN:
- Update personal profile fields.
- Update learning preferences.
- Update AI configuration preferences.
- Change password.
- Trigger controlled onboarding re-evaluation (optional).

### This module CANNOT:
- Directly change `current_path_id`.
- Reset roadmap progress.
- Delete learning history without full account deletion.
- Modify onboarding raw responses directly (must go through controlled update logic).

---

## 4. Sections and Functional Behavior

### 4.1 Profile Information

Editable:
- `first_name`
- `last_name`

Read-only (v1):
- `email`
- `current_path_name`
- `onboarding_completed`

Editable (safe update):
- `background_type`
- `primary_goal`

Rules:
- Updating `background_type` or `primary_goal` does NOT change current path automatically.
- Changes are persisted immediately upon save.

---

### 4.2 Learning Preferences

Editable:

- `weekly_learning_hours` (0–3, 4–7, 8–12, 13+)
- `learning_style_primary` (video / reading / hands-on)

On change:
- Recompute `learning_velocity`.
- Update pacing configuration for future roadmap phases only.
- Completed stages remain unchanged.

No retroactive recalculation allowed.

---

### 4.3 AI Assistant Preferences

Editable:

- `ai_language_pref`
- `ai_detail_level`

Effect:
- These preferences are injected into:
  - Topic Tutor
  - Career Advisor
  - Resume AI
  - Opportunity Analyzer

Preference updates apply immediately to future AI calls.
Past AI outputs are not rewritten.

---

### 4.4 Controlled Re-Assessment (Optional Feature)

If learner edits:
- `background_type`
- `primary_goal`
- Learning hours significantly
- Interest-related preferences (if exposed later)

System may:

- Trigger re-run of OpenAI recommendation.
- Store new recommendation in `ai_recommendations`.
- NOT auto-switch active path.
- Present comparison:
  - Current path vs New recommendation.

Path switching requires explicit confirmation.

---

### 4.5 Account Security

Password Change:

Input:
- `old_password`
- `new_password`
- `confirm_password`

Backend validation:
- Verify old password hash.
- Validate new password strength.
- Hash using secure algorithm.
- Invalidate existing sessions if required.

On success:
- Return confirmation.
- Optionally force re-login.

---

### 4.6 Account Deletion (If Enabled)

Action:
- Learner requests deletion.
- Confirmation required (double confirmation).

If approved:
- Soft delete user account (`status = deleted`)
- Preserve data for audit window (if required by policy).
- Prevent login immediately.

Hard deletion policy depends on platform compliance rules.

---

## 5. Functional Requirements

1. Profile page shall load combined `User` + `Learner` data.
2. Save operation shall be atomic.
3. Enumerated fields must be validated server-side.
4. Email is immutable in v1.
5. `current_path_id` is not directly editable.
6. Changing preferences shall not corrupt roadmap state.
7. AI preferences must be injected into all AI modules dynamically.
8. Password change must use secure hashing.
9. Unauthorized access must return 401.

---

## 6. Data Model

### User Entity

- `user_id`
- `email`
- `password_hash`
- `status`
- timestamps

### Learner Entity

- `user_id`
- `first_name`
- `last_name`
- `background_type`
- `primary_goal`
- `current_path_id`
- `onboarding_completed`
- `ai_language_pref`
- `ai_detail_level`
- `weekly_learning_hours`
- `learning_velocity`
- `learning_style_primary`

---

## 7. Data Integration

### Reads
- `User`
- `Learner`

### Writes
- Update `Learner` fields on preference change.
- Update `User.password_hash` on password change.
- Optionally insert new `ai_recommendations` row on re-assessment.

---

## 8. Side Effects and Safeguards

- Preference changes must not alter completed progress records.
- Path change must never be automatic.
- Re-assessment must not overwrite previous AI recommendations.
- AI preference updates must not trigger background AI calls automatically.

---

## 9. Error Handling

| Scenario                        | Behavior |
|---------------------------------|----------|
| Invalid enum value              | Reject with validation error |
| Password mismatch               | Reject request |
| Weak password                   | Reject with reason |
| Unauthorized request            | 401 response |
| Attempt to edit path directly   | Reject request |
| DB failure                      | Rollback transaction |

---

## 10. Integration Points

- Roadmap Engine:
  - Reads `learning_velocity` for pacing.
- AI Modules:
  - Read `ai_language_pref`
  - Read `ai_detail_level`
- Onboarding:
  - May trigger re-recommendation (controlled).

---

## 11. Non-Functional Constraints

- All updates must complete < 2 seconds under normal load.
- Password hashing must use secure algorithm.
- All changes logged in audit trail (recommended).
- No UI-driven logic should override backend validation.
