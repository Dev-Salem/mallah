# Admin Feature Development Plan

## Current State

### Implemented
- **Actions**: `admin-content-actions.ts` (CRUD for paths, stages, topics, resources, skills, projects, learners)
- **Types**: `types.ts` (all admin type definitions)
- **Dashboard Components**: stats cards, quick actions, content warnings, path overview, recent activity
- **Content Components**:
  - `paths-table.tsx` - list view with inline edit drawer
  - `stage-form.tsx`, `topic-form.tsx`, `resource-form.tsx` - modal forms for child entities
  - `topics-browser.tsx` - hierarchical topic browser (read-only)
  - `skills-table.tsx` - skill management with verify/reject
- **Other Tables**: projects, learners, audit-log, admin-accounts
- **Layout**: admin-sidebar.tsx

### Missing / Incomplete
1. **PathForm component** - no separate form; functionality embedded in paths-table.tsx
2. **Inline editing in Topics Browser** - read-only, no forms integrated
3. **Stage/Topic/Resource management UI** - forms exist but not wired to UI

---

## Phase 1: Refactor & Extract Forms

### 1.1 Extract PathForm component
- Create `features/admin/components/content/forms/path-form.tsx`
- Move form logic from `paths-table.tsx` into the new component
- Keep `paths-table.tsx` as just the table, import and use PathForm

### 1.2 Integrate Forms into Topics Browser
- Update `topics-browser.tsx` to support:
  - Add/Edit/Delete buttons for stages
  - Add/Edit/Delete buttons for topics
  - Add/Edit/Delete buttons for resources
- Import and render `StageForm`, `TopicForm`, `ResourceForm` modals
- Add state for managing which form is open and what entity is being edited

---

## Phase 2: UI Improvements

### 2.1 Stage Expansion UI
- Replace plain `<select>` for stages with an expandable/collapsible table view
- Show stages as expandable rows with topic sub-items
- Add drag handles for reordering (optional future)

### 2.2 Breadcrumb & Navigation
- Enhance breadcrumb in topics-browser.tsx
- Add "back" navigation when drilling down

### 2.3 Empty States
- Add empty state illustrations/messages for:
  - No paths
  - No stages
  - No topics
  - No resources

### 2.4 Loading States
- Add skeleton loaders for tables

---

## Phase 3: Validation & Error Handling

### 3.1 Form Validation
- Add required field validation
- Show inline errors for slug uniqueness
- Validate URLs for resources

### 3.2 Optimistic Updates
- Consider optimistic UI updates for better UX

### 3.3 Conflict Handling
- Handle deletion conflicts (e.g., learners have progress)

---

## Phase 4: Polish

### 4.1 Responsive Design
- Ensure tables are scrollable on mobile
- Stack form fields properly on small screens

### 4.2 Accessibility
- Add aria-labels to form fields
- Ensure keyboard navigation works

### 4.3 Performance
- Lazy load stages/topics only when parent is selected
- Consider pagination for large lists

---

## Phase 5: Testing & Documentation

### 5.1 Testing
- Add unit tests for server actions
- Add integration tests for forms
- Test edge cases (deletion with progress, duplicate slugs, etc.)

### 5.2 Documentation
- Document API/DB schema
- Add inline comments for complex logic

---

## File Structure (Target)

```
features/admin/
├── actions/
│   └── admin-content-actions.ts
├── components/
│   ├── dashboard/
│   │   ├── dashboard-stats-cards.tsx
│   │   ├── quick-actions.tsx
│   │   ├── content-warnings.tsx
│   │   ├── path-overview-table.tsx
│   │   └── recent-activity.tsx
│   ├── content/
│   │   ├── paths-table.tsx
│   │   ├── topics-browser.tsx
│   │   ├── skills-table.tsx
│   │   └── forms/
│   │       ├── path-form.tsx
│   │       ├── stage-form.tsx
│   │       ├── topic-form.tsx
│   │       └── resource-form.tsx
│   ├── learners/
│   │   └── learners-table.tsx
│   ├── projects/
│   │   └── projects-table.tsx
│   ├── audit/
│   │   └── audit-log-table.tsx
│   ├── settings/
│   │   └── admin-accounts-table.tsx
│   └── layout/
│       └── admin-sidebar.tsx
├── types.ts
└── index.ts
```

---

## Priority Order

1. **Extract PathForm** - Clean separation of concerns
2. **Wire up forms in Topics Browser** - Enable full CRUD for content hierarchy
3. **Add empty states** - Improve UX
4. **Form validation** - Data integrity
5. **Responsive polish** - Mobile support
6. **Testing** - Reliability