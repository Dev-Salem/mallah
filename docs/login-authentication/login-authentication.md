# Mallah – Authentication & Account Management v3 (Functional Contract)

## 1. Purpose

Authentication is the access control layer of Mallah.

It owns:
- Account creation
- Login
- Session management
- Role enforcement
- Password reset
- Email verification
- Route protection

It does not own onboarding logic, roadmap logic, or dashboard behavior. It only determines identity, role, and session validity.

---

## 2. Actors

- Learner
- Admin
- Backend API
- Database
- Email Service

AI is not involved in this module.

---

## 3. Data Model

### 3.1 User (Base Account)

Fields:
- user_id (UUID, PK)
- email (unique, required)
- password_hash (bcrypt ≥12 cost or argon2id)
- role (enum: learner | admin)
- status (enum: active | blocked)
- email_verified (boolean, default false)
- failed_login_attempts (int, default 0)
- lockout_until (timestamp, nullable)
- created_at
- last_login_at

Role is authoritative. Never inferred from subtype tables.

---

### 3.2 Learner (Subtype)

Fields:
- user_id (PK, FK → users)
- first_name
- last_name
- onboarding_completed (boolean, default false)
- current_path_id (nullable)
- background_type (nullable)
- primary_goal (nullable)
- learning_velocity (nullable)
- weekly_hours_category (nullable)
- ai_language_pref (nullable)
- ai_detail_level (nullable)
- readiness_level (nullable)

All onboarding-related fields are NULL at registration.

---

### 3.3 Admin (Subtype)

Fields:
- user_id (PK, FK → users)
- display_name
- admin_level (enum: normal | super)

---

## 4. Registration

Endpoint:
POST /api/auth/register

Input:
- first_name
- last_name
- email
- password
- confirm_password

Validation:
- Email format valid
- Email not already registered
- Password ≥ 8 chars, includes letter + number
- Passwords match

Process:
1. Insert into users:
   - role = learner
   - status = active
   - email_verified = false
2. Insert into learners:
   - onboarding_completed = false
   - other fields NULL
3. Send email verification token (24h expiry)
4. Issue access + refresh tokens

Output:
- Authenticated session
- Redirect target = Onboarding

No onboarding logic executed here.

---

## 5. Login

Endpoint:
POST /api/auth/login

Input:
- email
- password
- remember_me (boolean)

Process:
1. Lookup user by email.
2. If not found → generic error.
3. If status = blocked → return blocked message.
4. If lockout_until > now → reject.
5. Verify password.
6. On failure:
   - increment failed_login_attempts
   - if ≥5 → set lockout_until = now + 15 min
   - return generic error.
7. On success:
   - reset failed_login_attempts
   - clear lockout_until
   - update last_login_at
   - issue tokens

Redirect logic:
- role = admin → Admin Dashboard
- role = learner AND onboarding_completed = false → Onboarding
- role = learner AND onboarding_completed = true → Dashboard

---

## 6. Email Verification

Endpoint:
GET /api/auth/verify-email?token=...

Rules:
- Token must be valid, unexpired, unused.
- On success:
  - users.email_verified = true
- Verification does not gate platform usage.
- Verification required for password reset.

---

## 7. Forgot Password

### Step 1 – Request Reset

POST /api/auth/forgot-password

Input:
- email

Response:
- Always return neutral success message.

If account exists AND email_verified = true:
- Generate reset token (1h expiry)
- Send email.

If email not verified:
- Require verification before reset.

---

### Step 2 – Reset Password

POST /api/auth/reset-password

Input:
- token
- new_password
- confirm_password

Validation:
- Token valid and unused
- Password meets strength rules

Process:
- Update password_hash
- Invalidate reset token
- Invalidate all refresh tokens for that user

Redirect:
- Login page

---

## 8. Token Strategy

Two-token model:

Access Token:
- Stored in memory
- 15 min expiry

Refresh Token:
- HTTP-only, Secure, SameSite=Strict cookie
- 7 days default
- 30 days if remember_me = true

Refresh Flow:
POST /api/auth/refresh
- Validate refresh token
- Issue new access token
- Optionally rotate refresh token

Logout:
POST /api/auth/logout
- Invalidate refresh token
- Clear access token client-side

---

## 9. Route Protection Rules

Public:
- Login
- Register
- Forgot Password
- Reset Password

Learner-only:
- Onboarding
- Dashboard
- Roadmap
- Projects & Skills
- Resume
- Opportunity Analyzer
- AI Career Advisor

Admin-only:
- Admin Dashboard
- Content management

Enforcement:
- No token → redirect to Login.
- Learner with onboarding_completed = false → redirect to Onboarding for any learner route.
- Learner cannot access admin routes.
- Admin cannot access learner routes.
- Role always validated server-side.

---

## 10. Rate Limiting

- Login: 5 failed attempts → 15 min lockout per email.
- Register: 10 requests per IP per hour.
- Forgot password: 3 per email per hour.
- Refresh: 30 per user per hour.

All limits enforced server-side.

---

## 11. Security Requirements

- Password hashing: bcrypt (≥12 cost) or argon2id.
- No plaintext password storage.
- Access token never stored in localStorage.
- Refresh token never accessible to JS.
- All tokens single-use where applicable (verification/reset).
- HTTPS required.
- Role read from database per request.
- Lockout tracked per user (not only IP-based).

---

## 12. Outputs to System

Authentication guarantees:

- Valid user_id
- Valid role
- Valid session tokens
- For new learner:
  - learners.onboarding_completed = false

All other modules require:
- Authenticated session
- For learners: onboarding_completed = true

Authentication is the gatekeeper layer. It does not implement business logic beyond identity and access control.