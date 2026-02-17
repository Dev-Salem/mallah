# Mallah – Authentication, Login & Registration

## 1. Overview

The **Authentication & Account Management** feature is the entry point to Mallah.  
It handles:

- **Account creation** (Register)
- **User login** (email + password)
- **Role-based access** (Learner vs Admin)
- **Session handling** (who is logged in, and where to send them next)

This module always runs **before Onboarding** and decides:

- Is this a **new user**? → send to **Onboarding Wizard**  
- Is this a **returning user**? → send to **Dashboard** (or Admin Panel)

---

## 2. Goals

- Provide a **simple, secure login/register flow**.
- Ensure each user is correctly mapped to:
  - **User** (base account)
  - **Learner** or **Admin** subtype
- Guarantee that:
  - Users who **didn’t finish onboarding** are redirected to the **Onboarding Wizard**.
  - Users who **finished onboarding** go directly to the **Dashboard**.

---

## 3. Actors

- **Learner**
  - Registers and logs in using email + password.
  - Accesses Onboarding, Dashboard, and all learner features.
- **Admin**
  - Logs in using email + password.
  - Accesses Admin Panel (content management, statistics).
- **Backend API**
  - Validates credentials, creates users, generates tokens/sessions.
- **Database**
  - Stores user accounts, roles, and status.
- **(Optional) AI Engine**
  - **Not used in this module.** No AI is involved in auth.

---

## 4. Data Model (Relevant Parts)

### 4.1 User (Base Account)

- `user_id` (PK)
- `email` (unique)
- `password_hash`
- `status` (`active` / `blocked`)
- `created_at`
- `last_login_at`
- `role` (implementation choice: explicit column or subtype logic)

### 4.2 Learner (Subtype of User)

- `user_id` (PK, FK → User)
- `first_name`
- `last_name`
- `background_type` (from onboarding later)
- `primary_goal` (from onboarding later)
- `onboarding_completed` (`Yes` / `No`)
- `current_path_id` (set after onboarding)

### 4.3 Admin (Subtype of User)

- `user_id` (PK, FK → User)
- `display_name`
- `admin_level` (e.g., `normal` / `super`) – optional for v1

---

## 5. Features & Flows

### 5.1 Registration (Create Account)

**Goal:** create a new Learner account and send them directly to Onboarding.

**Input (UI fields):**

- First Name
- Last Name
- Email
- Password
- Confirm Password

**Backend steps:**

1. **Validate Email Format**
   - Must be a valid email pattern.
2. **Check for Duplicate Email**
   - If `email` already exists in `User` with `status != deleted` → return error.
3. **Validate Password Strength**
   - Minimum length (e.g. ≥ 8 characters).
   - At least one letter and one number (configurable).
4. **Create User Record**
   - Insert into `User`:
     - `email`
     - `password_hash` (bcrypt/argon2)
     - `status = active`
     - `created_at = now`
5. **Create Learner Record**
   - Insert into `Learner`:
     - `user_id` (same as `User`)
     - `first_name`, `last_name`
     - `onboarding_completed = No`
     - `current_path_id = NULL` (not assigned yet)
6. **Issue Session / Token**
   - Create session/JWT and associate with `user_id`.
7. **Redirect Decision**
   - Because `onboarding_completed = No`:
     - Redirect → **Onboarding Wizard (Step 1)**.

**UI Feedback:**

- On success:
  - Show a short welcome message (e.g., “Welcome to Mallah, let’s set up your path”).
  - Auto-redirect to Onboarding.
- On failure:
  - Highlight invalid fields (email taken, weak password, etc.) with clear messages.

---

### 5.2 Login (Existing Account)

**Goal:** authenticate a user and route them correctly (Onboarding vs Dashboard vs Admin Panel).

**Input (UI fields):**

- Email
- Password
- (Optional) “Remember Me” checkbox

**Backend steps:**

1. **Find User by Email**
   - If no `User` found → error (“Invalid email or password”).
2. **Check Status**
   - If `status = blocked` → show specific message (“Account blocked, contact support”).
3. **Verify Password**
   - Compare input password with `password_hash`.
   - If mismatch → error (“Invalid email or password”).
4. **Update Last Login**
   - Set `last_login_at = now`.
5. **Load Role**
   - If user has matching row in `Admin`:
     - Role = `admin`.
   - Else if user has matching row in `Learner`:
     - Role = `learner`.
6. **Issue Session / Token**
   - Create session/JWT and attach:
     - `user_id`
     - `role`
   - Respect “Remember Me” for longer token expiry (if implemented).
7. **Redirect Decision**
   - If Role = `admin`:
     - Redirect → **Admin Dashboard**.
   - Else (Role = `learner`):
     - Check `onboarding_completed` in `Learner`:
       - If `No` → redirect to **Onboarding Wizard**.
       - If `Yes` → redirect to **Dashboard**.

**UI Feedback:**

- On success:
  - Quick “Welcome back, [First Name]” message.
- On failure:
  - Generic error (do not reveal whether email or password is wrong).

---

### 5.3 Logout

**Goal:** end the user session safely.

**Trigger:**

- User clicks “Logout” from any page (Dashboard, Admin Panel, etc.).

**Backend steps:**

1. Invalidate session / token (server-side or via token blacklist).
2. Clear cookies/local storage (frontend responsibility).
3. Redirect to **Login Page** (or Landing).

---

### 5.4 Forgot Password (Optional v1, but recommended)

**Goal:** allow users to reset their password securely.

**Simple version:**

- Step 1:
  - User enters email in “Forgot Password”.
- Step 2:
  - Backend generates a **one-time token** and sends reset link via email.
- Step 3:
  - User opens the reset link → sees “New Password” form.
- Step 4:
  - Backend validates token + updates `password_hash`.

This can be implemented later; for v1 report you can still document it as planned functionality.

---

## 6. Access Control Logic (High-Level)

- **Public pages**:
  - Login
  - Register
  - (Optionally Landing/Marketing page)
- **Learner-only pages**:
  - Onboarding Wizard
  - Dashboard
  - Roadmap & Topic Viewer
  - Skills & Projects Hub
  - Resume Builder
  - Opportunity Analyzer
  - AI Career Advisor
- **Admin-only pages**:
  - Admin Dashboard
  - Content management screens (Paths, Stages, Topics, Skills, Project templates)

Routing rules (simplified):

- If **not authenticated**:
  - Any protected URL → redirect to **Login**.
- If **authenticated as Learner**:
  - If `onboarding_completed = No`:
    - Any learner feature request → redirect to **Onboarding first**.
- If **authenticated as Admin**:
  - Only allow access to Admin area and optionally read-only analytics.

---

## 7. Security & UX Notes (for Report)

### 7.1 Security (Core Points)

- Passwords are **never stored in plain text**; only secure hashes.
- Login checks:
  - Lockout or throttling can be added after multiple failed attempts.
- Sessions / tokens:
  - Use secure cookies (HTTP-only) or JWT with expiry.
- Role checking:
  - Every protected route checks `role` before granting access.

### 7.2 UX Design Notes

- Keep Login/Register forms **minimal, clean, and consistent** with Mallah’s branding.
- Clear entry points:
  - “Already have an account? Log in”
  - “New here? Create account”
- After registration, go **directly to Onboarding**, not Dashboard.
- The user must **never** reach Dashboard without:

  - Valid auth
  - At least one path selected from onboarding (or default path assigned)

---

## 8. How This Connects to Onboarding & Rest of System

- **Outputs of Authentication Module:**
  - A valid `user_id`
  - Role: `learner` or `admin`
  - For learner, `onboarding_completed` flag

- **Next Step After Auth:**
  - New user → Onboarding Wizard (to fill background, goals, and choose a path)
  - Returning user:
    - If onboarding done → Dashboard
    - If not done → Onboarding again

From that point, all other modules (Roadmap, Skills & Projects, Resume Builder, Opportunity Analyzer, AI Career Advisor, Admin Panel) rely on:

- `user_id`
- role (Learner/Admin)
- `current_path_id` (set by Onboarding)

Authentication is the **gatekeeper** of the whole Mallah journey.
