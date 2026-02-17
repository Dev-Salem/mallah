# Mallah – Profile & Settings

## 1. Overview

The Profile & Settings module lets the learner view and update their personal information,
learning preferences, and AI preferences, and manage account-level options such as password
change and (optionally) account deletion. It reads and writes directly to the shared `User` and
`Learner` entities.

## 2. Goals

- Provide a clear place to manage identity and preferences.
- Keep data consistent with what onboarding collected.
- Allow updating AI behavior (language and detail).
- Keep security-related actions (password change) straightforward.

## 3. Actors

- **Learner**
- **Backend API**
- **Database** (Users & Learners)

## 4. Main Sections (UI)

1. **Profile Summary**
   - Read-only or editable fields:
     - First name
     - Last name
     - Email (usually read-only in v1)
     - Background type (Student / Fresh Graduate / Career Shifter / No Tech Background)
     - Current path name (read-only, set by onboarding/admin)
     - Primary goal (Full-time / Freelance / Own Project)

2. **Learning Preferences**
   - `Weekly Study Time`:
     - Same categories used in onboarding (0–3, 4–7, 8–12, 13+ hours).
   - `Preferred Learning Style`:
     - `Video`, `Reading`, `Hands-on / Projects`.
   - These values update `weekly_learning_hours` and `learning_style_primary`.

3. **AI Assistant Preferences**
   - `AI Language Preference`:
     - `Arabic`, `English`, `Mix`.
   - `AI Response Detail`:
     - `Short`, `Balanced`, `Detailed`.
   - These values feed all AI features (Topic Tutor, Career Advisor, Resume AI, Job AI).

4. **Account Security**
   - Change Password form:
     - Old password.
     - New password.
     - Confirm new password.
   - Validation on backend and frontend.
   - On success: show confirmation notice and require re-login if needed.

5. **Advanced / Danger Zone (Optional)**
   - “Delete Account” button (if in scope):
     - Clear explanation and confirmation dialog.
     - Only enabled if business rules allow deletion.

## 5. Functional Requirements

- Profile page shall pre-load current learner data from DB.
- On save:
  - Validate required fields and types.
  - Persist changes atomically to `User` and `Learner`.
- Email:
  - In v1, consider it immutable (changing email complicates identity and login).
- Changing path:
  - In v1, **learner cannot change path** from Profile directly (to avoid breaking progress).
  - Path changes, if needed, should be admin-only or via a controlled future feature.

## 6. Data Integration

- **Entities**
  - `User`
    - `user_id`, `email`, `password_hash`, `status`, timestamps.
  - `Learner`
    - `user_id` (FK to User)
    - `first_name`, `last_name`
    - `background_type`
    - `primary_goal`
    - `current_path_id`
    - `onboarding_completed`
    - `ai_language_pref`
    - `ai_detail_level`
    - `weekly_learning_hours`
    - `learning_style_primary`

- **Reads**
  - Load combined User + Learner profile for the logged-in user.

- **Writes**
  - Update `Learner` fields on preference changes.
  - Update `User` password on password change, using secure hashing.

## 7. UX Notes

- Group fields into clear sections with headings: “Profile”, “Learning Preferences”, “AI Assistant”, “Security”.
- Use dropdowns / radio buttons for enumerated values to avoid invalid input.
- Keep error messages simple:
  - e.g., “Password is too short” rather than technical jargon.
- After saving:
  - Show a non-intrusive success banner (“Settings updated successfully.”).
