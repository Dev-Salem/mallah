# Resume Builder Refactor - Research & Plan

## Goal
Refactor the Resume Builder feature based on the new `docs/resume-builder/resume-builder.md` specification, adhering closely to the defined UX, Data Model, and Architectural principles.

## Current vs. New Specification

### 1. Resume Creation
* **Current:** Uses a Wizard (`components/wizard`) or a `JobSetupModal`.
* **New:** 
  - The Wizard is **removed entirely**. `+ New Resume` immediately creates a general resume, fully pre-populated with Mallah portfolio data, and drops the user into the editor on the Summary section.
  - Adding a job-based resume is now done by `Cloning` an existing general resume, and clicking `Personalize for a Job` in the editor.

### 2. Editor Layout & Navigation
* **Current:** Contains various nested forms and potentially an accordion/monolithic view.
* **New:** 
  - **Two-zone layout**: Left Nav (~200px width) containing section names and progress dots & full-width Right Editing Area.
  - **Edit / Preview Toggle**: A pinned Tabs component at the top right of the editing area switches between editing the active section or viewing the full A4 resume.
  - **Right-side Drawer (~380px)**: The editing pattern for structured entries (`Experience`, `Education`, `Certifications`) is now moved to a sliding right drawer.

### 3. Job-Based Resumes
* **Current:** Integrated closely with opportunity analyzer during resume creation.
* **New:** Job-Based resumes are functionally distinct inside the editor. They get three exclusive features:
  - **JD Keyword Strip**: Fixed at the top of the editing area, stating job title, skills match, and a live toggle.
  - **Live Keyword Match Panel**: Expandable under the JD Keyword Strip showing checked/unchecked required & preferred skills.
  - **Relevance Indicators**: Skills and Projects sections reorder based on JD requirements using tags like `Required`, `Preferred`, and `Relevant to this job`.

### 4. AI Improve Integration
* **Current:** Uses a separate AI Improve panel `components/ai-improve-panel.tsx`.
* **New:** 
  - Integrated directly below the `Textarea` as an **inline diff panel**.
  - Offers `Use this`, `Keep original`, and `Try again`.
  - Displayed for Summary, Projects, and Experience bullets.

### 5. ATS Scoring Model
* **New Logic**: Refined logic weighted into Keyword Coverage (35%), Summary Quality (20%), Project Descriptions (15%), Section Completeness (20%), and Formatting Compliance (10%). Job-based versions use JD keywords as the baseline.

## Refactor Scope
Based on the `features/resume-builder` folder research, the refactor will touch:

1. **Clean up & Deletion:**
   - Remove `components/wizard`
   - Rewrite or remove `job-setup-modal.tsx` (replaced by Personalization Modal in Editor).

2. **Database & Types (`features/resume-builder/types.ts` & Supabase schema):**
   - Incorporate `source_jd` JSONB structure for resumes.
   - Adjust ATS scoring interfaces and AI prompts.
   - Add the `status` enum (`not_created`, `in_progress`, `ready`) appropriately.

3. **New UI Components Needed (`components/editor`):**
   - `LeftNavigation`: Nav with completion dots.
   - `TwoZoneEditorLayout`: Core scaffolding.
   - `RightSideDrawer`: For structured experiences/education.
   - `InlineDiffPanel`: For the AI Improve inline diff.
   - `JDKeywordStrip` & `LiveKeywordMatchPanel`: Exclusive for job-based resumes.
   - `ATSDetailOverlay`: The detailed modal triggered from the ATS badge.

4. **Service Operations (`actions` & `services`):**
   - Add/Update Server Actions to perform the **Clone** feature.
   - Add Server Action for **Personalize** (parsing JD, re-writing sections via AI). 
   - Refresh the ATS Score calculation service using the new weighted algorithm.

## Next Steps
This serves as the initial research breakdown of bridging the current system to the new document. Waiting for the command `do pla` to build an exhaustive step-by-step checklist.
