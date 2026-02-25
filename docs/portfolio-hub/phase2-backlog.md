# Portfolio Hub Phase 2 Backlog

This backlog tracks schema-alignment work intentionally deferred during Phase 1 (`current DB first`).

## Deferred Schema Fields

- `learners.portfolio_slug` (unique public URL key)
- `learners.bio` (public profile summary)
- `user_projects.is_public` (project visibility toggle)
- `user_projects.demo_url` (public demo link)
- `user_projects.personal_note` (portfolio narrative note)
- `skills.is_verified` (catalog verification state)

## Deferred Routing Change

- Migrate public route from `/portfolio/[userId]` to `/portfolio/[slug]`.
- Keep backward compatibility by redirecting `/portfolio/[userId]` to slug once migration lands.

## Deferred Product Behavior

- Project-level visibility toggles in private hub.
- Public project filtering by `(status = Completed AND is_public = true)` once `is_public` exists.

