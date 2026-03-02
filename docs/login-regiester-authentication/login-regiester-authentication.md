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

- Provide a simple, secure login/register flow.
- Ensure each user is correctly mapped to a **User** base account and a **Learner** or **Admin** subtype.
- Guarantee that users who did not finish onboarding are redirected to the Onboarding Wizard.
- Guarantee that users who finished onboarding go directly to the Dashboard.
- Protect all routes from unauthenticated and unauthorized access.

---

## 3. Actors

- **Learner** — registers and logs in via email + password. Accesses Onboarding, Dashboard, and all learner features.
- **Admin** — logs in via email + password. Accesses Admin Panel only.
- **Backend API** — validates credentials, creates users, issues and refreshes tokens.
- **Database** — stores user accounts, roles, sessions, and status.
- **Email Service** — sends email verification and password reset links.
- **AI Engine** — not involved in this module.

---

## 4. Data Model

### 4.1 User (Base Account)

| Field            | Type      | Notes                                      |
|------------------|-----------|--------------------------------------------|
| `user_id`        | UUID (PK) |                                            |
| `email`          | VARCHAR   | Unique                                     |
| `password_hash`  | VARCHAR   | bcrypt or argon2, never plain text         |
| `role`           | ENUM      | `learner` / `admin`                        |
| `status`         | ENUM      | `active` / `blocked`                       |
| `email_verified` | BOOLEAN   | Default `false`, set to `true` on verification |
| `created_at`     | TIMESTAMP |                                            |
| `last_login_at`  | TIMESTAMP | Updated on every successful login          |

**Role strategy:** `role` is an explicit column on the `User` table. It is set at registration (`learner`) or by a super admin (`admin`). Role is not inferred by checking subtype tables at runtime — it is read directly from `users.role`.

### 4.2 Learner (Subtype of User)

| Field                   | Type                 | Notes                                                        |
|-------------------------|----------------------|--------------------------------------------------------------|
| `user_id`               | UUID (PK, FK → User) |                                                              |
| `first_name`            | VARCHAR              |                                                              |
| `last_name`             | VARCHAR              |                                                              |
| `onboarding_completed`  | BOOLEAN              | Default `false`                                              |
| `current_path_id`       | VARCHAR              | NULL until onboarding complete. Valid values: `frontend`, `fullstack`, `cybersecurity`, `datascience` |
| `background_type`       | ENUM                 | NULL until set by onboarding                                 |
| `primary_goal`          | ENUM                 | NULL until set by onboarding                                 |
| `learning_velocity`     | ENUM                 | NULL until set by onboarding (`slow` / `normal` / `fast`)    |
| `weekly_hours_category` | ENUM                 | NULL until set by onboarding                                 |
| `ai_language_pref`      | ENUM                 | NULL until set by onboarding (`arabic` / `english` / `mix`)  |
| `ai_detail_level`       | ENUM                 | NULL until set by onboarding (`short` / `balanced` / `detailed`) |
| `readiness_level`       | INT                  | NULL until set by onboarding (0–3)                           |

All onboarding fields are initialized as NULL at registration. They are populated during the Onboarding Wizard. The dashboard and roadmap modules treat NULL values in these fields as "onboarding not yet complete."

### 4.3 Admin (Subtype of User)

| Field          | Type                 | Notes                  |
|----------------|----------------------|------------------------|
| `user_id`      | UUID (PK, FK → User) |                        |
| `display_name` | VARCHAR              |                        |
| `admin_level`  | ENUM                 | `normal` / `super`     |

---

## 5. Features & Flows

### 5.1 Registration

**Goal:** create a new Learner account and redirect to the Onboarding Wizard.

**Input fields:**
- First Name
- Last Name
- Email
- Password
- Confirm Password

**Backend steps:**

1. Validate email format (standard pattern check).
2. Check for duplicate email — if a `User` row already exists with this email, return error. Do not reveal whether the account is active or blocked.
3. Validate password strength — minimum 8 characters, at least one letter and one number.
4. Confirm password fields match.
5. Insert into `users`:
   - `email`, `password_hash` (bcrypt/argon2), `role = 'learner'`, `status = 'active'`, `email_verified = false`
6. Insert into `learners`:
   - `user_id`, `first_name`, `last_name`, `onboarding_completed = false`, all other fields NULL
7. Send verification email:
   - Generate a time-limited token (expires in 24 hours).
   - Send link: `https://mallah.app/verify-email?token=...`
   - Email verification does not block access — the learner proceeds to onboarding immediately.
8. Issue access token + refresh token (see Section 5.5).
9. Redirect → Onboarding Wizard (Step 0).

**UI feedback:**
- On success: brief welcome message ("Welcome to Mallah — let's set up your path"), auto-redirect to onboarding.
- On failure: highlight the specific invalid field with a clear message. Never show a generic "something went wrong."

---

### 5.2 Email Verification

**Goal:** confirm the learner owns the email address they registered with.

**Flow:**
1. User receives email with a verification link containing a one-time token.
2. User clicks the link → backend validates the token (not expired, not already used).
3. On success: set `users.email_verified = true`. Show confirmation message. Redirect to Dashboard or current page.
4. On failure (expired or invalid token): show message with a "Resend verification email" option.

**Access rules:**
- Email verification is **not required** to use Mallah. Learners can complete onboarding and use the platform with an unverified email.
- Email verification **is required** to use Forgot Password (see Section 5.4).
- A persistent but dismissable banner is shown on the dashboard while `email_verified = false`: "Please verify your email address. Resend email →"

---

### 5.3 Login

**Goal:** authenticate a user and route them to the correct destination.

**Input fields:**
- Email
- Password
- "Remember Me" checkbox (optional)

**Backend steps:**

1. Find `User` by email. If not found → return generic error ("Invalid email or password").
2. Check `status`. If `blocked` → return specific message ("Your account has been blocked. Contact support.").
3. Verify password against `password_hash`. If mismatch → return generic error ("Invalid email or password"). Increment failed attempt counter.
4. If failed attempts exceed threshold (e.g. 5 attempts) → apply temporary lockout (e.g. 15 minutes). Return message: "Too many failed attempts. Try again in 15 minutes."
5. On successful password match: reset failed attempt counter.
6. Update `users.last_login_at = NOW()`.
7. Read `users.role` directly.
8. Issue access token + refresh token. If "Remember Me" checked → set longer refresh token expiry (e.g. 30 days vs default 7 days).
9. Redirect:
   - `role = 'admin'` → Admin Dashboard
   - `role = 'learner'` AND `onboarding_completed = false` → Onboarding Wizard
   - `role = 'learner'` AND `onboarding_completed = true` → Dashboard

**UI feedback:**
- On success: no delay, immediate redirect.
- On failure: generic message only. Never indicate which field (email or password) was wrong.

---

### 5.4 Forgot Password

**Goal:** allow a user to securely reset their password. Required for v1.

**Step 1 — Request reset:**
- User enters their email on the Forgot Password screen.
- Backend looks up the email. Whether or not a matching account exists, always show: "If this email is registered, you'll receive a reset link shortly." Never confirm or deny that an account exists.
- If account exists AND `email_verified = true`: generate a one-time reset token (expires in 1 hour) and send reset email.
- If account exists but `email_verified = false`: prompt user to verify their email first before resetting password.

**Step 2 — Reset password:**
- User clicks link in email → directed to Reset Password screen.
- Backend validates token (exists, not expired, not already used).
- User enters new password + confirm password.
- On success: update `password_hash`, invalidate the reset token, invalidate all existing sessions for this user (force re-login everywhere).
- Redirect → Login page with message: "Password updated. Please log in."

---

### 5.5 Token Strategy (Access + Refresh)

All authenticated sessions use two tokens:

| Token          | Storage            | Expiry (default) | Expiry (Remember Me) |
|----------------|--------------------|------------------|----------------------|
| Access token   | Memory (JS)        | 15 minutes       | 15 minutes           |
| Refresh token  | HTTP-only cookie   | 7 days           | 30 days              |

**Flow:**
- Every API request includes the access token in the `Authorization` header.
- When the access token expires, the frontend silently calls `POST /api/auth/refresh` using the refresh token cookie.
- Backend validates the refresh token, issues a new access token (and optionally rotates the refresh token).
- If the refresh token is expired or invalid → clear session, redirect to Login.
- The user never sees a logout or interruption during normal usage as long as their refresh token is valid.

**Logout:**
1. Frontend calls `POST /api/auth/logout`.
2. Backend invalidates the refresh token (server-side blacklist or delete from DB).
3. Frontend clears access token from memory.
4. Redirect → Login page.

---

### 5.6 Rate Limiting

Applied server-side, not frontend-only:

| Endpoint                          | Limit                                        |
|-----------------------------------|----------------------------------------------|
| `POST /api/auth/login`            | 5 failed attempts → 15 min lockout per email |
| `POST /api/auth/register`         | 10 requests per IP per hour                  |
| `POST /api/auth/forgot-password`  | 3 requests per email per hour                |
| `POST /api/auth/refresh`          | 30 requests per user per hour                |

---

## 6. Access Control

### 6.1 Page Categories

**Public (no auth required):**
- Login
- Register
- Forgot Password / Reset Password
- Landing / Marketing page

**Learner-only:**
- Onboarding Wizard
- Dashboard
- Learning Roadmap & Topic Viewer
- Skills & Projects Hub
- Resume Builder
- Opportunity Analyzer
- AI Career Advisor

**Admin-only:**
- Admin Dashboard
- Content management (Paths, Stages, Topics, Skills, Project templates)
- Platform analytics

### 6.2 Routing Rules

- **Not authenticated** → any protected URL → redirect to Login.
- **Authenticated as Learner, `onboarding_completed = false`** → any learner page → redirect to Onboarding Wizard. The only exception is the Onboarding Wizard itself.
- **Authenticated as Learner, `onboarding_completed = true`** → full access to all learner pages.
- **Authenticated as Admin** → access to Admin area only. Admins cannot access learner features.
- **Authenticated as Learner trying to access Admin URL** → redirect to Dashboard.
- **Authenticated as Admin trying to access Learner URL** → redirect to Admin Dashboard.

---

## 7. Security Requirements

- Passwords are never stored in plain text. Use bcrypt (cost factor ≥ 12) or argon2id.
- Access tokens are stored in memory only, never in localStorage.
- Refresh tokens are stored in HTTP-only, Secure, SameSite=Strict cookies.
- All auth endpoints are served over HTTPS only.
- Password reset and email verification tokens are single-use and time-limited.
- After a successful password reset, all active sessions for that user are invalidated.
- Role is read from `users.role` on every protected request — never trusted from the client.
- Failed login attempts are counted and locked per email address server-side, not per IP only (IP-based limits apply separately at registration).

---

## 8. How This Connects to the Rest of Mallah

**Outputs of this module:**
- A valid authenticated session (`user_id`, `role`, access + refresh tokens)
- A `learners` row with `onboarding_completed = false` and all profile fields NULL (for new users)

**What happens next:**
- New learner → Onboarding Wizard populates all NULL fields in `learners` and sets `onboarding_completed = true`
- Returning learner → Dashboard reads `learners` fields directly (`current_path_id`, `learning_velocity`, `ai_language_pref`, etc.)

All other modules — Roadmap, Topic Viewer, Dashboard, Skills Hub, Resume Builder, Opportunity Analyzer, AI Career Advisor — require a valid authenticated session and `onboarding_completed = true` to function. Authentication is the gatekeeper of the entire Mallah journey.
