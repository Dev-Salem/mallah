# Mallah — Project Submission Form Redesign

> **Task type:** UI update to an existing component. The project submission form (Action Panel in `ProjectViewerView.tsx`) is live and working. This is a visual and field update only — do not touch submission logic, validation, or backend actions unless explicitly stated below.
>
> **Read every section before writing a single line of code.**

---

## What exists today

The current Action Panel has:

- GitHub Repository input
- Live Demo input (optional)
- Tech Stack input (comma-separated plain text)
- "Submit Project" primary button
- "Skip & Submit Later" secondary button

---

## What you are changing

### 1. Add: Project name override field

```
Label:       "Project name"   [optional badge]
Input type:  Single-line text
Placeholder: The project's default name (e.g. "Personal Profile Page")
Badge:       "default" label pinned to the right inside the input — disappears on focus/type
Hint below:  "Replaces the default name on your portfolio card."
```

**Behaviour:**
- If left blank: `user_projects.custom_name` is saved as `null` — portfolio displays `projects.title`
- If filled: value is saved to `user_projects.custom_name` — portfolio displays this value instead

**DB:** Add nullable column `custom_name TEXT DEFAULT NULL` to `user_projects` if not already present.

---

### 2. Add: Project description override field

```
Label:       "Project description"   [optional badge]
Input type:  Textarea, min-height 68px, resize: none
Placeholder: "Describe what you built, the decisions you made, and what you're proud of.
              This replaces the default description on your portfolio."
Char count:  Live counter "0 / 300" bottom-right of the textarea, max 300 chars
Hint below:  "Replaces the default description in your portfolio. Leave blank to keep the default."
```

**Behaviour:**
- If left blank: `user_projects.custom_description` is `null` — portfolio displays `projects.description`
- If filled: value is saved to `user_projects.custom_description` — portfolio displays this instead

**DB:** Add nullable column `custom_description TEXT DEFAULT NULL` to `user_projects` if not already present.

---

### 3. Replace: Tech stack field

Remove the current comma-separated plain text input. Replace with:

```
Label:       "Tech stack"
Pre-populated tags: pulled from the project's linked skills (project_skills → skills.name)
                    rendered as selectable pill tags, active (selected) by default
Tag state:   active = filled orange (#b54b00 bg, white text)
             inactive = ghost (secondary bg, secondary border, secondary text)
             clicking a tag toggles between active and inactive
Custom add:  small text input + "Add" button below the tags
             pressing Enter or clicking Add appends a new active tag
```

**Saved value:** array of the active tag labels at submission time → `user_projects.tech_stack` (already exists as the current field)

---

### 4. Keep: GitHub Repository field

No changes to this field. Keep label, placeholder, and save logic exactly as-is.

---

### 5. Keep: Live Demo field

No changes. Keep optional badge, placeholder, and save logic exactly as-is.

---

### 6. Update: Field order

Render fields in this exact top-to-bottom order:

1. Project name ← new
2. Project description ← new
3. GitHub Repository ← existing, no change
4. Live Demo ← existing, no change
5. Tech stack ← existing, redesigned

---

### 7. Update: Submit button

No logic changes. Visual update only:

```
Height:          40px
Background:      #b54b00
Text color:      white
Font size:       13px, weight 500
Icon:            checkmark SVG left of label
Label:           "Submit project"
Full width:      yes
Border radius:   var(--border-radius-md)
```

---

### 8. Replace: Skip button

**Remove** the current "Skip & Submit Later" button entirely.

**Replace** with a plain underline text link below the submit button:

```
Label:        "Skip this project"
Style:        no border, no background, text-only
Color:        var(--color-text-tertiary) default, var(--color-text-secondary) on hover
Underline:    text-decoration underline, underline-offset 3px, underline color transparent by default,
              var(--color-border-secondary) on hover
Font size:    11.5px
Full width:   yes, centered
```

**On click:** do not call the skip action immediately. Instead, reveal an inline confirmation block directly below the button (no modal, no new screen — inline within the same panel):

```
Confirmation block style:
  background:    var(--color-background-secondary)
  border:        0.5px solid var(--color-border-tertiary)
  border-radius: var(--border-radius-md)
  padding:       12px 14px
  margin-top:    10px

Message (13px, secondary color, line-height 1.5):
  "This will permanently skip the project. The next stage unlocks,
   but this project won't appear in your portfolio and no skills
   will be awarded. This can't be undone."
  "Permanently" and "can't be undone" in primary color, weight 500.

Two buttons side by side (flex row, gap 8px):
  Left:  "Go back"   — ghost style, closes the confirmation block
  Right: "Yes, skip it" — danger style:
           background: var(--color-background-danger)
           border:     var(--color-border-danger)
           color:      var(--color-text-danger)
```

**"Yes, skip it" calls** the existing skip action (`skipProject`) — no change to the action itself.

---

## Panel header

Add a header above the fields (currently missing):

```
Left:  small icon (waveform or checkmark, 32×32px, secondary bg, tertiary border, border-radius-md)
Right of icon:
  Title:    "Submit project"   (14px, weight 500, primary color)
  Subtitle: "[Project title] · Stage [N]"   (11px, secondary color)
Separator: 0.5px border-bottom below the header, margin-bottom 18px
```

Populate title and stage number from the current project data already available in the component.

---

## Styling rules

Follow the existing design system. Specific values for this form:

| Element | Style |
|---|---|
| All inputs and textarea | `background: var(--color-background-secondary)`, `border: 0.5px solid var(--color-border-tertiary)`, `border-radius: var(--border-radius-md)`, focus: `border-color: var(--color-border-primary)` |
| Field labels | `font-size: 10.5px`, `font-weight: 500`, `letter-spacing: 0.07em`, `text-transform: uppercase`, `color: var(--color-text-secondary)` |
| Optional badges | `font-size: 9.5px`, `padding: 1px 6px`, `border-radius: 99px`, secondary bg + tertiary border + tertiary text |
| Hint text | `font-size: 11px`, `color: var(--color-text-tertiary)`, `margin-top: 4px` |
| Active tag | `background: #b54b00`, `border-color: #b54b00`, `color: white` |
| Inactive tag | secondary bg, tertiary border, secondary text |
| Section spacing | `margin-bottom: 14px` between fields |
| Divider before buttons | `0.5px solid var(--color-border-tertiary)`, `margin: 16px 0` |

---

## DB changes summary

Two nullable columns to add to `user_projects` — check before adding, only add if missing:

```sql
ALTER TABLE user_projects
  ADD COLUMN IF NOT EXISTS custom_name        TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS custom_description TEXT DEFAULT NULL;
```

Update `submitProjectAction` to save these two new fields alongside the existing ones. No other logic changes.

---

## Portfolio Hub impact

When rendering a project card in Portfolio Hub:

- Display name: `user_projects.custom_name ?? projects.title`
- Display description: `user_projects.custom_description ?? projects.description`

Check all places in the Portfolio Hub that currently read `projects.title` or `projects.description` for display — update them to use this fallback pattern. Do not change any other portfolio logic.

---

## Hard constraints

| # | Constraint |
|---|---|
| 1 | Do not change `github_url` or `demo_url` field logic — visual style update only |
| 2 | Do not change `submitProjectAction` logic beyond saving the two new fields |
| 3 | Do not change `skipProject` action — only update the button UI and confirmation flow |
| 4 | Tech stack tags must be pre-populated from `project_skills → skills.name` — not hardcoded |
| 5 | Confirmation block is inline — no modal, no `position: fixed`, no overlay |
| 6 | `custom_name` and `custom_description` are always nullable — blank submission saves `null`, not empty string |
| 7 | Portfolio Hub fallback pattern applies everywhere project name/description is displayed — audit all usages |
