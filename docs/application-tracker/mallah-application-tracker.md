# Mallah – Application Tracker

## 1. Purpose

The Application Tracker is where learners manage their job search pipeline after discovery.
It provides a structured, minimal, single-page view of every job application a learner is
actively pursuing — from initial interest through to a final outcome.

The Opportunity Analyzer tells learners *which* jobs to pursue. The Application Tracker
tells them *where they stand* across all of them.

It lives as its own page in the sidebar — a peer to the Opportunity Analyzer, not a
sub-feature of it. The two features share a voluntary data bridge: a learner can promote a
saved analysis into the tracker with one click, but is never pushed to do so automatically.

---

## 2. Core Design Philosophy

- **Minimal by default.** Each application card shows exactly what matters: company, role,
  stage, and date. Nothing is shown unless it earns its place.
- **Status is king.** Color-coded stage badges are the dominant visual element. A learner
  should be able to scan their entire pipeline and understand its shape at a glance.
- **Filters over clutter.** Instead of trying to surface everything at once, the tracker
  relies on simple stage filters to give context. Learners navigate by filtering, not
  scrolling through noise.
- **Manual-first, analyzer-aware.** The primary add flow is a simple drawer form. The
  Opportunity Analyzer is a data source, not a dependency.
- **No noise.** No AI insights, no charts, no dashboards inside the tracker. One job, one
  card, one status.

---

## 3. Scope & Dependencies

**Entry points:**
- Sidebar navigation → "Application Tracker" (new item, below Opportunity Analyzer)
- Opportunity Analyzer → Saved tab → "Add to Tracker →" button per saved analysis

**Depends on:**
- `application_tracker` *(new table — defined in Section 9)*
- `opportunity_analyses` *(read-only — used for the optional import bridge)*
- `users`, `learners`
- AI Engine: light usage only — pre-filling company/role from a saved analysis

**Does not depend on:**
- Calendar or scheduling systems
- Email or communication integrations
- Resume Builder (no deep-link in v1)
- External job boards

---

## 4. Sidebar Navigation Entry

**Label:** Application Tracker  
**Icon:** `ClipboardList` (Lucide)  
**Position:** Below "Opportunity Analyzer" in the sidebar nav  
**Active state:** Filled icon + 2–3px left-side accent border (Primary Orange)  
**Indicator dot:** An amber dot appears when `application_tracker` has one or more rows
with `stage = 'interviewing'` or `stage = 'offer'` — surfacing active high-priority
applications passively. Dot disappears once those rows move to a terminal stage
(`accepted`, `rejected`, `withdrawn`).

**Mobile bottom tab bar:** Application Tracker is added to the "More" bottom sheet
(alongside Opportunity Analyzer and Settings), not promoted to the primary 5-tab bar.

---

## 5. Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Application Tracker                          [+ Add Application]│
│                                                                  │
│  ── Filters ──────────────────────────────────────────────────── │
│  [All] [Saved] [Applied] [In Review] [Interviewing]              │
│  [Offer] [Accepted] [Rejected] [Withdrawn]                       │
│                                                                  │
│  [🔍 Search by company or role...] [Sort: Newest ▾]              │
│                                                                  │
│  ── Applications ─────────────────────────────────────────────── │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ● APPLIED          Noon                                  │   │
│  │                    Frontend Developer · Riyadh           │   │
│  │                    Applied Apr 28, 2026  [View Analysis] │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ● INTERVIEWING     STC                                   │   │
│  │                    React Engineer · Remote (SA)          │   │
│  │                    Applied Apr 20, 2026                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ● SAVED            Tamara                                │   │
│  │                    Junior Frontend Dev · Jeddah          │   │
│  │                    Saved Apr 15, 2026  [View Analysis]   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Header:** Page title left-aligned. `+ Add Application` button right-aligned (Primary
Orange, default variant).

**Filter row:** Horizontal scrollable pill row. "All" is selected by default. Only one
filter is active at a time. Pills use the same color token as the stage badge they represent
when active.

**Search + Sort bar:** Below the filter row. Search filters the visible list client-side by
`company_name` or `role_title`. Sort dropdown: "Newest first" (default) / "Oldest first" /
"Stage (A→Z)".

**Application list:** Single-column card list. Cards render below the search/sort bar with
8px gap between them. No pagination in v1 — full list rendered with a soft scroll.

**Empty state:** If zero applications exist, render a centered empty state:
- Icon: `ClipboardList` (muted, large)
- Title: "No applications yet"
- Subtext: "Add your first application manually, or import from a saved analysis."
- CTA: `+ Add Application` button

If a filter is active and returns zero results:
- Title: "No {stage} applications"
- Subtext: "Try a different filter or add a new application."
- No CTA button — filter is still visible for easy switching.

---

## 6. Application Card

Each card is a horizontal row divided into three zones: **stage indicator**, **company +
role block**, and **meta block**.

```
┌────────────────────────────────────────────────────────────────────┐
│ [●Stage Badge]  [Company Name]                    [Date]           │
│                 [Role Title · Location]            [View Analysis] │
│                 [Notes preview — 1 line, muted]                    │
└────────────────────────────────────────────────────────────────────┘
```

**Stage badge:** Color-coded pill on the left edge. Uses `JetBrains Mono` for the label
text — consistent with Mallah's data/status typography token. Badge color follows the
stage color system defined in Section 7.

**Company name:** Bold, `Inter`, full size. Primary foreground color.

**Role title + Location:** Subdued line below company. `Inter`, muted color token. Bullet
separator between role and location.

**Date:** Right-aligned. Shows `Applied [date]` for most stages. Shows `Saved [date]` for
`stage = 'saved'`. Format: `MMM DD, YYYY`. Uses `JetBrains Mono` — date as a data
coordinate.

**"View Analysis" chip:** Rendered only if `analysis_id` is not null. A small ghost-style
button/chip: `View Analysis ↗`. Clicking navigates to the linked saved analysis in the
Opportunity Analyzer (Saved tab, scrolled to that entry). Renders on the same line as the
date, below it if space is constrained.

**Notes preview:** If `notes` is not null and not empty, show the first line (max 80 chars,
truncated with `…`) in muted text below the role line. Does not render if notes are empty.

**Card interaction:**

| Action | Result |
|---|---|
| Click anywhere on card | Opens the Edit Drawer (pre-filled with this application's data) |
| Click "View Analysis" chip | Navigates to linked analysis — does not open drawer |

**No hover tooltip needed.** The card is self-explanatory. Edit is always one click.

---

## 7. Stage System

Eight stages. Ordered by typical pipeline progression. Terminal stages are `accepted`,
`rejected`, and `withdrawn`.

| Stage Key | Display Label | Color Token | Badge Color | Notes |
|---|---|---|---|---|
| `saved` | Saved | Muted/Steel | `oklch(0.70 0.01 106)` | Pre-application interest |
| `applied` | Applied | Info Blue | `oklch(0.63 0.10 245)` | Submitted application |
| `in_review` | In Review | Warning Amber | `oklch(0.78 0.13 70)` | Confirmation received; under review |
| `interviewing` | Interviewing | Primary Orange | `oklch(0.68 0.13 38.8)` | Any interview stage active |
| `offer` | Offer Received | Success Emerald | `oklch(0.65 0.12 153)` | Offer extended |
| `accepted` | Accepted ✓ | Success Emerald (solid) | `oklch(0.65 0.12 153)` | Terminal — positive |
| `rejected` | Rejected | Destructive Red | `oklch(0.55 0.18 25)` | Terminal — negative |
| `withdrawn` | Withdrawn | Muted/Steel | `oklch(0.70 0.01 106)` | Terminal — learner withdrew |

**Stage rules:**
- All stages are manually set by the learner. No automatic stage transitions.
- Terminal stages (`accepted`, `rejected`, `withdrawn`) render with reduced card opacity
  (0.6) to visually de-emphasize closed applications without hiding them.
- The filter pill for `accepted` uses a green background. `rejected` uses red. `withdrawn`
  and `saved` use muted steel. All others use the token color at 15% opacity background
  with full-opacity text and dot.
- The stage badge uses a filled circle dot (`●`) before the label, matching the color of
  the stage.

---

## 8. Add / Edit Drawer

A slide-over drawer from the right side. Used for both adding a new application and editing
an existing one. Width: 420px on desktop. Full-width bottom sheet on mobile.

### 8.1 Drawer Header

- **Add mode:** "Add Application" title + `✕` close button
- **Edit mode:** "Edit Application" title + `✕` close button + a destructive
  `Delete Application` text button (bottom of drawer, below the save button)

### 8.2 Form Fields

| Field | Type | Required | Default | Notes |
|---|---|---|---|---|
| Company Name | Text input | Yes | — | Auto-filled if imported from analyzer |
| Role / Job Title | Text input | Yes | — | Auto-filled if imported from analyzer |
| Location | Text input | No | — | Auto-filled if imported from analyzer |
| Stage | Select dropdown | Yes | `applied` | Full stage list from Section 7 |
| Date | Date picker | Yes | Today | Label changes: "Applied Date" unless stage is `saved`, then "Saved Date" |
| Job Posting Link | Text input (URL) | No | — | Stored as `posting_url`. Not validated strictly — just stored. |
| Notes | Textarea | No | — | Min 3 rows. Max 500 chars. Placeholder: "Interview notes, contact name, next steps…" |

**Field label for date:** Updates reactively based on selected stage:
- `saved` → "Date Saved"
- `applied` → "Date Applied"
- All others → "Date"

### 8.3 Import from Analyzer (Add Mode Only)

A secondary CTA below the form fields, only shown in **Add mode**:

```
┌─────────────────────────────────────────────────┐
│ 📎 Import from a saved analysis                 │
│    Auto-fill company and role from the          │
│    Opportunity Analyzer.                 [Browse]│
└─────────────────────────────────────────────────┘
```

Clicking **Browse** opens a compact inline panel (not a new drawer) listing the learner's
saved analyses from `opportunity_analyses`. Each row shows:
- Company name + role title
- Analysis date

Selecting one pre-fills **Company Name**, **Role / Job Title**, and **Location** from the
stored analysis data. It also sets `analysis_id` on the record, enabling the "View
Analysis" chip on the card. The learner can override any pre-filled field before saving.

If the learner has no saved analyses: the "Browse" button is replaced with a muted label:
"No saved analyses yet. Analyze a job in the Opportunity Analyzer first."

### 8.4 Drawer Footer

- `Save Application` button (Primary Orange, full width) — disabled until Company Name and
  Role are filled.
- Edit mode only: `Delete Application` text button below the Save button, destructive red.
  Triggers an inline confirmation: "Delete this application? This cannot be undone." with
  `Confirm Delete` and `Cancel` options inline — no modal.

---

## 9. Opportunity Analyzer Integration

### 9.1 "Add to Tracker" Button (Opportunity Analyzer Side)

In the Opportunity Analyzer → **Saved tab**, each saved analysis card gains a new
secondary action button:

```
┌─────────────────────────────────────────┐
│ Frontend Developer — Noon               │
│ Analyzed Apr 28, 2026                   │
│ Match score: 88%                        │
│                                         │
│ [View Analysis]  [Add to Tracker →]     │
└─────────────────────────────────────────┘
```

**"Add to Tracker →"** button behavior:
- Opens the Application Tracker's Add Drawer pre-filled with company, role, and location
  from the saved analysis.
- `analysis_id` is pre-set (hidden — not a visible form field).
- Stage defaults to `saved` (since the learner may not have applied yet).
- Learner reviews and saves.

**Already-tracked indicator:** If an `application_tracker` row already exists with
`analysis_id = this analysis`, the button is replaced with a muted chip: `✓ In Tracker`.
Clicking the chip navigates to the Application Tracker page filtered to that application.

### 9.2 Data Flow Summary

```
opportunity_analyses (saved analysis)
         │
         │  [Add to Tracker →] — optional, manual
         ▼
application_tracker
  analysis_id ──────────────────────────────────────▶ [View Analysis] chip on card
```

No data flows in the reverse direction. Deleting an application tracker entry does not
affect the saved analysis. Deleting a saved analysis sets `application_tracker.analysis_id`
to `NULL` (the application record is preserved, the chip disappears).

---

## 10. Filtering Behavior

**Stage filter pills:** Horizontal scrollable row. "All" is the default active state. One
pill active at a time. Clicking an active pill deactivates it (returns to "All").

**Active pill style:** Filled background using the stage color token. Inactive pills use
outline style with muted text.

**Filter + search interaction:** Both apply simultaneously. A learner can filter by
"Interviewing" and search "STC" — only Interviewing applications from STC appear.

**Sort options (dropdown):**

| Option | Behavior |
|---|---|
| Newest first (default) | Sorts by `date` DESC |
| Oldest first | Sorts by `date` ASC |
| Stage (A → Z) | Sorts by stage key alphabetically |

Terminal-stage applications (`accepted`, `rejected`, `withdrawn`) are not hidden by default
— they appear in "All" and in their respective filter. Learners who want to hide them can
use the specific active-stage filters.

---

## 11. Data Model

### `application_tracker` table

| Field | Type | Notes |
|---|---|---|
| `application_id` | UUID (PK) | |
| `user_id` | UUID (FK → users) | Scoped per learner |
| `analysis_id` | UUID (FK → opportunity_analyses) | Nullable. Set if imported from analyzer. |
| `company_name` | VARCHAR | Required |
| `role_title` | VARCHAR | Required |
| `location` | VARCHAR | Nullable |
| `stage` | ENUM | `saved` / `applied` / `in_review` / `interviewing` / `offer` / `accepted` / `rejected` / `withdrawn` |
| `date` | DATE | Required. Semantics depend on stage (applied date, saved date, etc.) |
| `posting_url` | VARCHAR | Nullable. URL to original job posting. |
| `notes` | TEXT | Nullable. Max 500 chars enforced at application level. |
| `created_at` | TIMESTAMP | Server time |
| `updated_at` | TIMESTAMP | Server time, updated on every write |

**Indexes:**
- `(user_id, stage)` — supports stage filter queries
- `(user_id, date DESC)` — supports default sort
- `(analysis_id)` — supports the "already tracked" check in the Opportunity Analyzer

**Cascade rule:** If `opportunity_analyses` row is deleted, set `application_tracker.analysis_id = NULL`
(SET NULL, not CASCADE DELETE).

---

## 12. API Routes

All routes are prefixed `/api/tracker/`. Every route requires a valid learner session.
Results are always scoped to the authenticated `user_id` — never cross-user.

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/tracker/` | List all applications for the learner. Supports `?stage=`, `?search=`, `?sort=` query params. |
| `POST` | `/api/tracker/` | Create a new application. Body: all non-computed fields. |
| `PATCH` | `/api/tracker/:id` | Update an existing application. Partial update — only send changed fields. |
| `DELETE` | `/api/tracker/:id` | Delete an application. Returns 204. |
| `GET` | `/api/tracker/check/:analysis_id` | Returns `{ tracked: boolean, application_id?: string }`. Used by the Opportunity Analyzer to check if an analysis is already in the tracker. |

**`GET /api/tracker/` query parameters:**

| Param | Values | Default |
|---|---|---|
| `stage` | Any valid stage key, or omit for all | All |
| `search` | Free-text string — matched against `company_name` and `role_title` | None |
| `sort` | `newest` / `oldest` / `stage_az` | `newest` |

Search is case-insensitive `ILIKE` on the backend, not client-side, to keep it consistent
with any future pagination.

---

## 13. UI Components

All components use shadcn/ui on Tailwind CSS, consistent with the rest of Mallah's UI.

| Element | Component | Notes |
|---|---|---|
| Page header | `Text` (h1) + `Button` | Title left, "+ Add Application" right |
| Stage filter pills | Custom `Button` array (toggle group) | Horizontally scrollable on mobile |
| Search input | `Input` with search icon | Client-side triggers backend query on debounce (300ms) |
| Sort dropdown | `Select` | 3 options |
| Application card | `Card` with flex layout | See Section 6 |
| Stage badge | Custom `Badge` + colored dot | Uses `JetBrains Mono` for label |
| "View Analysis" chip | `Button` (ghost, xs) | External link style |
| Add/Edit drawer | `Sheet` (shadcn) | Right-side slide-over |
| Form fields | `Input`, `Select`, `Textarea`, `DatePicker` | Standard shadcn inputs |
| Import panel | Inline collapsible panel inside drawer | Not a second sheet |
| Delete confirmation | Inline text within drawer | Not a modal |
| Empty state | Custom centered layout | Icon + title + subtext + optional CTA |

---

## 14. Edge Cases

| Scenario | Behavior |
|---|---|
| Learner has no saved analyses and opens Import panel | Shows muted message: "No saved analyses yet." Browse button disabled. |
| Learner imports an analysis already in the tracker | "Add to Tracker →" replaced with `✓ In Tracker` chip in the Analyzer. |
| Saved analysis is deleted after being linked | `analysis_id` set to NULL. Card renders without "View Analysis" chip. No error shown. |
| All applications filtered out by active stage pill | Empty state specific to that filter (no CTA). |
| Notes exceed 500 chars | Character counter shown at 400+. Input blocked at 500. |
| `posting_url` is not a valid URL | Stored as-is. Not validated beyond being a non-empty string. No navigation risk — link only rendered if non-null. |
| Learner deletes an application in edit mode | Inline confirmation within drawer. On confirm, drawer closes and card is removed from list. |
| Stage changed to terminal (`accepted`, `rejected`, `withdrawn`) | Card opacity drops to 0.6 on next render. No confirmation dialog — it is reversible. |

---

## 15. Integration Points with Existing Modules

- **Opportunity Analyzer** — Saved tab surfaces the "Add to Tracker →" bridge. The
  `GET /api/tracker/check/:analysis_id` endpoint powers the "✓ In Tracker" state.
- **Dashboard** — No Application Tracker widget on the Dashboard in v1. The sidebar
  indicator dot (amber, on active high-priority stages) is the only Dashboard-adjacent
  touch point.
- **Sidebar** — New nav item added between "Opportunity Analyzer" and "Settings". Uses the
  same active state and indicator dot system as all other nav items.
- **Resume Builder** — No direct integration in v1. Future: a "Which resume did you send?"
  field on the application card could link to a resume in the Resume Builder.
- **Admin Panel** — No admin-facing view of individual application tracker entries in v1.
  Aggregate stats (total applications across platform, most common rejection stage) can be
  surfaced in a future Analytics tab.

---

## 16. What This Feature Is Not

- Not a CRM or recruiter tool — it is a personal tracker only.
- Not connected to any external job board or email inbox.
- Not an analytics dashboard — no charts, conversion rates, or AI-generated insights in v1.
- Not automatic — no application is ever created without explicit learner action.
- Not a replacement for the Opportunity Analyzer — discovery and analysis still live there.
  The tracker begins where the analyzer ends.
