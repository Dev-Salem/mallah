# Mallah — Frontend Development Path
## Full Roadmap Specification (with Resources)

**Path ID:** `frontend`
**Estimated Duration:** 5–7 months (at 1–2 hrs/day)
**Difficulty:** Beginner → Intermediate
**Philosophy:** Build first, explain second. Every topic produces something visible. Every stage ends with a real project.

---

## Resource Format Guide (for agent parsing)

Each topic's `Resources` block maps directly to rows in the `topic_resources` table:

```
- [VIDEO] Title — URL
- [ARTICLE] Title — URL
- [INTERNAL_TEXT] Short inline explanation (written by Mallah team — no URL)
```

Rules:
- Maximum 3 resources per topic. 1–2 is ideal.
- `VIDEO` = YouTube video or playlist link
- `ARTICLE` = MDN, official docs, or a high-quality written guide
- `INTERNAL_TEXT` = short framing paragraph written by Mallah, rendered inline above other resources
- `order_index` = the order listed below (top = 1)

---

## Path Overview

| Stage | Title | Topics | Project |
|-------|-------|---------|---------|
| 1 | Web Foundations | 7 | Personal Profile Page |
| 2 | CSS Layouts & Styling | 6 | Responsive Landing Page |
| 3 | JavaScript Core | 8 | Interactive Quiz App |
| 4 | Git, Tools & Deployment | 4 | Live Portfolio Site (v1) |
| 5 | React Fundamentals | 8 | Task Manager App |
| 6 | Modern Frontend Stack | 7 | Full-Featured Web App |
| 7 | Performance, A11y & Polish | 5 | Final Portfolio (Polished) |

**Total:** 45 topics · 7 projects · 21 skills unlocked

---

## Stage 1 — Web Foundations
**Tagline:** Learn the language of the web by building real pages from day one.
**Duration:** ~3 weeks

---

### Topic 1.1 — How the Web Works
**Type:** Concept
**Estimated Time:** 1 hr
**Difficulty:** Beginner

**Description:** Understand what happens when you type a URL. Covers browsers, servers, HTTP requests/responses, and the roles of HTML, CSS, and JavaScript.

**Practical Output:** Draw and annotate a diagram of a full request-response cycle. Write it in your own words in a Notion or text file.

**Skills Unlocked:**
- Web fundamentals (`fundamentals`) — `beginner`
- HTTP basics (`fundamentals`) — `beginner`

**Resources:**
- [VIDEO] How The Web Works — Traversy Media — https://www.youtube.com/watch?v=hJHvdBlSxug
- [ARTICLE] How the Web works — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works
- [INTERNAL_TEXT] Before writing a single line of code, it helps to understand what the browser actually does. When you visit a website, your browser sends a request to a server, the server responds with HTML/CSS/JS files, and the browser renders them into the page you see. Understanding this cycle will make every frontend concept you learn feel purposeful — not magic.

---

### Topic 1.2 — HTML Structure & Semantics
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Write proper HTML with semantic tags: headings, paragraphs, lists, images, links, nav, section, article, footer. Understand why semantic HTML matters for SEO and accessibility.

**Practical Output:** Build a structured HTML-only personal bio page. No styling — just clean, meaningful markup.

**Skills Unlocked:**
- HTML (`language`) — `beginner`

**Resources:**
- [VIDEO] HTML Tutorial for Beginners (full playlist) — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9ibZ2TSBaGGNrgh4ZgYE6Cc
- [ARTICLE] HTML basics — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content
- [INTERNAL_TEXT] Semantic HTML means using the right tag for the right job — `<nav>` for navigation, `<article>` for standalone content, `<footer>` for page footer. Search engines and screen readers use these tags to understand your page. Using `<div>` for everything is the most common beginner mistake — this topic is about breaking that habit from day one.

---

### Topic 1.3 — HTML Forms & Tables
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Build forms with inputs, labels, selects, checkboxes, radios, and buttons. Build a data table. Understand the form submission flow and input types.

**Practical Output:** Build a contact form and a comparison table (e.g. phone specs or pricing tiers) in plain HTML.

**Skills Unlocked:**
- HTML (`language`) — `beginner` → `intermediate`

**Resources:**
- [VIDEO] HTML Forms Tutorial — Web Dev Simplified — https://www.youtube.com/watch?v=fNcJuPIZ2WE
- [ARTICLE] HTML forms — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms
- [INTERNAL_TEXT] Forms are how users communicate with your app — login, signup, search, contact. Getting forms right in pure HTML (proper labels, correct input types, accessible structure) is the foundation for everything that comes later, including form handling in React.

---

### Topic 1.4 — Intro to CSS: Selectors, Colors & Typography
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Link a stylesheet to HTML. Apply colors, fonts, sizes, weight, spacing. Understand selectors: element, class, ID, pseudo-class (`:hover`, `:focus`). Understand the cascade and specificity.

**Practical Output:** Style your bio page from Topic 1.2. Make it look like a real web page — not browser defaults.

**Skills Unlocked:**
- CSS (`language`) — `beginner`

**Resources:**
- [VIDEO] CSS Tutorial for Beginners (full playlist) — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9gQeDH6xYhmO-db2mhoTSrT
- [ARTICLE] CSS first steps — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics
- [INTERNAL_TEXT] CSS can feel overwhelming at first because there are hundreds of properties. Don't try to memorize them. Focus on understanding the system: how selectors target elements, how the cascade determines which rule wins, and how properties like `color`, `font-size`, and `margin` work. Everything else is just more properties following the same rules.

---

### Topic 1.5 — The Box Model
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Deep dive into margin, padding, border, width, height, box-sizing. Use browser DevTools to inspect and debug box model issues live in the browser.

**Practical Output:** Build a card component (avatar + name + short bio) with precise spacing using only box model properties. Inspect it in DevTools and adjust live.

**Skills Unlocked:**
- CSS (`language`) — `beginner` → `intermediate`
- Chrome DevTools (`tool`) — `beginner`

**Resources:**
- [VIDEO] CSS Box Model — Web Dev Simplified — https://www.youtube.com/watch?v=rIO5326FgPE
- [ARTICLE] The box model — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model
- [INTERNAL_TEXT] Every element on a page is a box. The box model defines how that box is sized: the content area, then padding (space inside), then border, then margin (space outside). The most important setting to know: `box-sizing: border-box` — it makes width include padding and border, which matches how designers think about sizing. Set it globally on every project.

---

### Topic 1.6 — CSS Positioning & Display
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Understand static, relative, absolute, fixed, sticky positioning. Understand block vs inline vs inline-block display. Build layered UI elements and a navbar that sticks on scroll.

**Practical Output:** Build a webpage with a sticky navbar, a hero section with an overlaid text badge, and a fixed back-to-top button.

**Skills Unlocked:**
- CSS (`language`) — `intermediate`

**Resources:**
- [VIDEO] CSS Positioning Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9hudKGi5o5UiWuTAFL-guem
- [ARTICLE] CSS layout — positioning — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Positioning
- [INTERNAL_TEXT] Positioning is one of the trickiest parts of CSS because `absolute` elements are positioned relative to their nearest `relative` ancestor — not the viewport, not the page. The most common bug: forgetting to set `position: relative` on the parent. This topic will click once you build the layered hero section yourself.

---

### Topic 1.7 — PROJECT: Personal Profile Page
**Type:** Project (Milestone)
**Difficulty:** Beginner
**Estimated Time:** 4–6 hrs

**Description:** Build a complete, styled personal profile page using pure HTML and CSS — no frameworks.

**Requirements:**
- All HTML is semantic (no div soup)
- Clean typography: at least 2 font sizes, consistent color palette
- Proper box model spacing throughout
- Sticky or fixed navigation with working anchor links
- Hosted live on GitHub Pages

**Skills Demonstrated:**
- HTML (`language`) — `intermediate`
- CSS (`language`) — `intermediate`
- Chrome DevTools (`tool`) — `beginner`

**Resources:**
- [VIDEO] Build a Profile Page with HTML & CSS — Kevin Powell — https://www.youtube.com/watch?v=yn6sV3aVWYQ
- [ARTICLE] Getting started with GitHub Pages — GitHub Docs — https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- [INTERNAL_TEXT] This is your first portfolio piece. It doesn't need to be perfect — it needs to be real. Focus on clean markup, readable styling, and getting it live. Employers have seen thousands of fancy CSS clones; they respect developers who ship.

---

## Stage 2 — CSS Layouts & Styling
**Tagline:** Master modern CSS layout systems and build responsive UIs that work on any screen.
**Duration:** ~3 weeks

---

### Topic 2.1 — Flexbox
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Understand the flex container and flex items model. Learn all key properties: `display: flex`, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `gap`. Build common UI patterns with Flexbox.

**Practical Output:** Build a navigation bar, a card row, and a centered hero section — all using only Flexbox.

**Skills Unlocked:**
- CSS (`language`) — `intermediate`
- Responsive Design (`practice`) — `beginner`

**Resources:**
- [VIDEO] Flexbox Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9i3FXJSUfmsNOx8E7u6UuhG
- [ARTICLE] Flexbox — CSS-Tricks Complete Guide — https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- [INTERNAL_TEXT] Flexbox is a one-dimensional layout system — it works along a single axis (row or column). It's perfect for navbars, card rows, centering things, and aligning items within a container. Once you understand `justify-content` (main axis) and `align-items` (cross axis), 80% of Flexbox just clicks. Bookmark the CSS-Tricks guide — it's the most referenced CSS reference on the internet.

---

### Topic 2.2 — CSS Grid
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Understand grid containers, grid tracks, `grid-template-columns/rows`, `grid-area`, `gap`, and auto-placement. Know when to use Grid vs Flexbox.

**Practical Output:** Build a magazine-style article layout and a photo gallery grid from scratch.

**Skills Unlocked:**
- CSS (`language`) — `intermediate`
- Responsive Design (`practice`) — `beginner`

**Resources:**
- [VIDEO] CSS Grid Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9itC4TxYMzFy9Z2QualRLUU
- [ARTICLE] CSS Grid — CSS-Tricks Complete Guide — https://css-tricks.com/snippets/css/complete-guide-grid/
- [INTERNAL_TEXT] Grid is two-dimensional — it controls both rows and columns simultaneously. Use Grid for overall page layout and complex arrangements; use Flexbox for aligning items within a single row or column. The rule of thumb: Grid for the page structure, Flexbox for the components inside it.

---

### Topic 2.3 — Responsive Design & Media Queries
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Mobile-first design approach. Write media queries for different breakpoints. Use relative units (%, em, rem, vw, vh). Test layouts on mobile, tablet, and desktop.

**Practical Output:** Take your Stage 1 profile page and make it fully responsive — test at 375px (mobile), 768px (tablet), and 1280px (desktop) using Chrome DevTools device toolbar.

**Skills Unlocked:**
- Responsive Design (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Responsive Web Design Tutorial — Kevin Powell — https://www.youtube.com/watch?v=bn-DQznEZm0
- [ARTICLE] Responsive design — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design
- [INTERNAL_TEXT] Mobile-first means you write your base CSS for small screens, then use `@media (min-width: ...)` to add complexity as the screen gets larger. This is the opposite of what beginners instinctively do (design for desktop, then shrink down) — but it produces leaner, more maintainable code. Start with the smallest screen. Expand from there.

---

### Topic 2.4 — Tailwind CSS
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Set up Tailwind in a project. Learn utility-first CSS. Build layouts, style typography, add spacing and color using Tailwind classes. Understand why utility-first exists and when it shines.

**Practical Output:** Rebuild your card component from Topic 1.5 and a navbar using only Tailwind classes. No custom CSS file.

**Skills Unlocked:**
- Tailwind CSS (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Tailwind CSS Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HVjp8
- [ARTICLE] Tailwind CSS — Official Documentation — https://tailwindcss.com/docs/installation
- [INTERNAL_TEXT] Tailwind CSS gives you utility classes like `p-4`, `text-lg`, `flex`, and `bg-blue-500` that you apply directly in HTML. Instead of writing custom CSS, you compose styles from small, single-purpose classes. It sounds verbose at first, but it's fast in practice — no switching files, no naming things, no specificity fights. Most companies using React also use Tailwind, which is why you're learning it before React.

---

### Topic 2.5 — CSS Animations & Transitions
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** CSS transitions for hover states. `@keyframes` animations. Transform (scale, rotate, translate). Timing functions (ease, ease-in-out, cubic-bezier). Micro-interactions: spinners, button presses, fades.

**Practical Output:** Build an animated button with a press effect, a CSS loading spinner, a card hover lift effect, and a fade-in hero section using `@keyframes`.

**Skills Unlocked:**
- CSS (`language`) — `advanced`

**Resources:**
- [VIDEO] CSS Animations Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9iGYgmjWBuZSPRN9hFVRlYx
- [ARTICLE] Using CSS animations — MDN — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations
- [INTERNAL_TEXT] Animations are where CSS starts feeling like a superpower. The key distinction: `transition` handles changes between two states (hover on/off), while `@keyframes` defines a multi-step animation sequence (a spinner that rotates forever). Start with transitions — they're simpler and cover 90% of UI feedback effects. Use `@keyframes` for loading states and entrance animations.

---

### Topic 2.6 — PROJECT: Responsive Landing Page
**Type:** Project (Milestone)
**Difficulty:** Beginner
**Estimated Time:** 6–8 hrs

**Description:** Design and build a fully responsive landing page for a fictional product or service using Tailwind CSS.

**Requirements:**
- Sticky navbar with mobile hamburger menu toggle
- Hero section: headline, subheadline, CTA button
- Features section: CSS Grid, 3-column desktop / stacked mobile
- Testimonials section: Flexbox card layout
- Footer with links
- At least 3 animations/transitions (hover effects, entrance animation)
- Responsive on mobile (375px), tablet (768px), desktop (1280px)
- Deployed live on GitHub Pages or Vercel

**Skills Demonstrated:**
- CSS (`language`) — `advanced`
- Tailwind CSS (`framework_library`) — `beginner`
- Responsive Design (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Build a Responsive Landing Page with Tailwind — Traversy Media — https://www.youtube.com/watch?v=dFgzHOX84xQ
- [ARTICLE] Frontend Mentor — free designs to practice on — https://www.frontendmentor.io/challenges
- [INTERNAL_TEXT] Don't aim for pixel-perfect the first time. Start with the structure (HTML, sections), then apply Tailwind classes, then make it responsive. Frontend Mentor has free design files you can use as a reference if you want a real design spec to work from instead of inventing your own.

---

## Stage 3 — JavaScript Core
**Tagline:** Learn the language that makes the web interactive — by making things actually move.
**Duration:** ~4 weeks

---

### Topic 3.1 — JavaScript Basics
**Type:** Lesson + Practice
**Estimated Time:** 4–5 hrs
**Difficulty:** Beginner

**Description:** Variables (`let`, `const`), data types, operators, conditionals (`if/else`, ternary), loops (`for`, `while`). Write JS in a file linked to HTML — not just the console.

**Practical Output:** Build a simple age calculator and a number guessing game that runs in the browser.

**Skills Unlocked:**
- JavaScript (`language`) — `beginner`

**Resources:**
- [VIDEO] JavaScript Tutorial for Beginners — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET
- [ARTICLE] JavaScript basics — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Adding_interactivity
- [INTERNAL_TEXT] JavaScript is where your pages go from static to alive. Unlike HTML and CSS which are declarative (you describe the result), JS is imperative — you write step-by-step instructions. The most important habit to build: run your code constantly and read error messages carefully. Every error message tells you exactly what went wrong and where.

---

### Topic 3.2 — Functions & Scope
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Function declarations vs expressions vs arrow functions. Parameters, return values, default values. Call stack, local vs global scope, and closures at a basic level.

**Practical Output:** Build a tip calculator and a unit converter (km to miles, Celsius to Fahrenheit) using well-structured functions.

**Skills Unlocked:**
- JavaScript (`language`) — `beginner` → `intermediate`

**Resources:**
- [VIDEO] JavaScript Functions — Web Dev Simplified — https://www.youtube.com/watch?v=gigtS_5KOqo
- [ARTICLE] Functions — MDN — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions
- [INTERNAL_TEXT] Arrow functions (`const add = (a, b) => a + b`) are the modern standard — you'll see them everywhere in React code. They're not just shorter syntax; they also handle `this` differently, which matters later. For now, focus on understanding when a function returns a value versus when it just runs some code (a side effect). Most bugs come from forgetting a `return`.

---

### Topic 3.3 — Arrays & Objects
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Array methods: `map`, `filter`, `reduce`, `find`, `forEach`. Object creation, property access, destructuring, spread/rest operator. Work with arrays of objects — the universal data format of frontend development.

**Practical Output:** Build a filterable product list — given a JS array of 10+ product objects, render them as cards and filter by category using buttons.

**Skills Unlocked:**
- JavaScript (`language`) — `intermediate`

**Resources:**
- [VIDEO] JavaScript Array Methods — Web Dev Simplified — https://www.youtube.com/watch?v=R8rmfD9Y5-c
- [ARTICLE] Array methods — javascript.info — https://javascript.info/array-methods
- [INTERNAL_TEXT] `map`, `filter`, and `reduce` are the three most important array methods in modern JavaScript. You will use `map` to transform lists into UI elements (especially in React), `filter` to narrow down results, and `reduce` sparingly for aggregating values. Destructuring (`const { name, price } = product`) is syntax sugar you'll see constantly in real codebases — learn it here so it doesn't surprise you later.

---

### Topic 3.4 — The DOM: Selecting & Manipulating Elements
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** `querySelector`, `querySelectorAll`, `getElementById`. Change text content, innerHTML, styles. Create, insert, and remove elements dynamically. Understand the DOM tree structure.

**Practical Output:** Build a live character counter for a textarea, and a dark/light mode toggle that applies a class to the body element and changes the whole page's appearance.

**Skills Unlocked:**
- JavaScript (`language`) — `intermediate`

**Resources:**
- [VIDEO] JavaScript DOM Manipulation — Web Dev Simplified — https://www.youtube.com/watch?v=y17RuWkWdn8
- [ARTICLE] Manipulating documents — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting
- [INTERNAL_TEXT] The DOM (Document Object Model) is JavaScript's representation of your HTML. When you call `document.querySelector('.card')`, you get back a live object that you can read and mutate — and the browser immediately updates the page to reflect the change. This is where JS becomes visual: you write code, and something on screen moves.

---

### Topic 3.5 — Events & User Interaction
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** `addEventListener`, event types (click, input, keydown, submit, mouseover). Event object: `e.target`, `e.preventDefault()`. Event delegation for dynamic lists. Client-side form validation.

**Practical Output:** Build a real-time form validator: as the user types, give live feedback on email format, password strength (weak/medium/strong), and required fields. Show error messages inline, not on submit.

**Skills Unlocked:**
- JavaScript (`language`) — `intermediate`

**Resources:**
- [VIDEO] JavaScript Events — The Net Ninja — https://www.youtube.com/watch?v=XF1_MlZ5l6M
- [ARTICLE] Introduction to events — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events
- [INTERNAL_TEXT] Events are how your JS responds to the user. `addEventListener` attaches a function to an element that fires when something happens. The key insight: always call `e.preventDefault()` on form submit events, otherwise the browser will reload the page before your JS gets to run. Event delegation (listening on a parent element rather than each child) is a performance pattern used in every real codebase — learn it here.

---

### Topic 3.6 — Async JavaScript: Promises & Fetch
**Type:** Lesson + Practice
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Synchronous vs asynchronous execution. Callbacks problem. Promises: `.then()`, `.catch()`. `async/await` syntax. Fetch API to call a real REST API and display data on the page.

**Practical Output:** Build a weather card that fetches real data from the Open-Meteo API (free, no API key required) and displays temperature, wind speed, and condition for any city the user searches.

**Skills Unlocked:**
- JavaScript (`language`) — `intermediate`
- REST API consumption (`practice`) — `beginner`

**Resources:**
- [VIDEO] Async JavaScript, Fetch & Promises — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9jAhrjtZ9U93UMIhnCc44MH
- [ARTICLE] How to use Fetch API — javascript.info — https://javascript.info/fetch
- [INTERNAL_TEXT] JavaScript is single-threaded — it can only do one thing at a time. Async code solves the problem of "wait for the server to respond without freezing the entire page." `async/await` is just cleaner syntax for Promises — use it by default. The pattern is always the same: `try { const data = await fetch(url).then(r => r.json()) } catch (e) { handle error }`. Memorize this pattern. You'll write it hundreds of times.

---

### Topic 3.7 — Local Storage & State
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** `localStorage.setItem/getItem/removeItem`. `JSON.stringify/parse` to store objects. Persist UI state across page reloads. Understand what "state" means in a frontend context.

**Practical Output:** Add persistence to your filterable product list from Topic 3.3 — save the active filter to localStorage so the page remembers it on reload.

**Skills Unlocked:**
- JavaScript (`language`) — `intermediate`

**Resources:**
- [VIDEO] JavaScript localStorage — Web Dev Simplified — https://www.youtube.com/watch?v=AUOzvFzdIk4
- [ARTICLE] Window.localStorage — MDN — https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- [INTERNAL_TEXT] `localStorage` can only store strings, which is why you need `JSON.stringify()` before saving objects and `JSON.parse()` when reading them back. The concept of "state" — data that lives in memory and controls what the UI shows — is the most important idea in frontend development. React is built entirely around this concept. Learning it in vanilla JS first means React's `useState` will feel natural, not mysterious.

---

### Topic 3.8 — PROJECT: Interactive Quiz App
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–12 hrs

**Description:** Build a fully functional multi-step quiz app in vanilla JavaScript — no frameworks.

**Requirements:**
- 10+ questions from a JS array of objects (question, options, answer)
- One question at a time with transitions between questions
- Progress indicator (e.g. Question 3 of 10)
- Countdown timer per question (e.g. 15 seconds — auto-advance if time runs out)
- Score tracking and results screen at the end
- Best score stored in localStorage and shown on the start screen
- Fully responsive
- Deployed live

**Skills Demonstrated:**
- JavaScript (`language`) — `advanced`
- REST API consumption (`practice`) — `beginner`
- Responsive Design (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Build a Quiz App with HTML, CSS & JavaScript — Web Dev Simplified — https://www.youtube.com/watch?v=riDzcEQbX6k
- [INTERNAL_TEXT] This is your first real JavaScript project. Before writing code, map out the state your app needs to track: current question index, score, remaining time, quiz status (idle/active/finished). Every feature follows from updating one of these values and re-rendering the UI to match. This mental model — state drives UI — is the foundation of React.

---

## Stage 4 — Git, Tools & Deployment
**Tagline:** Work like a professional — version control, debugging, and shipping live apps.
**Duration:** ~1.5 weeks

---

### Topic 4.1 — Git & GitHub Fundamentals
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** `git init`, `add`, `commit`, `status`, `log`. Branching: `git branch`, `git switch`, `git merge`. Understand HEAD, staging area, working directory. Push to GitHub. Write descriptive commit messages.

**Practical Output:** Take any previous project, set up a proper Git repo with 5+ meaningful commits, and push to GitHub with a clean README describing the project.

**Skills Unlocked:**
- Git (`tool`) — `beginner`
- GitHub (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Git & GitHub Tutorial for Beginners — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9goXbgTDQ0n_4TBzOO0ocPR
- [ARTICLE] Git — the simple guide — https://rogerdudler.github.io/git-guide/
- [INTERNAL_TEXT] Git is the single most important tool in a developer's workflow — more important than any framework. Every company uses it. The key mental model: your project lives in three places at once — your working directory (files you're editing), the staging area (changes you've selected to commit), and the repository (committed history). `git add` moves changes to staging. `git commit` saves them to history permanently.

---

### Topic 4.2 — GitHub Workflow: Branches & Pull Requests
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Feature branch workflow. Create branches for each feature. Open a pull request (PR), write a PR description, merge it. Resolve a merge conflict deliberately (create one and fix it).

**Practical Output:** Add a new feature to your quiz app using a feature branch. Open a PR on GitHub with a proper title and description. Merge it. Simulate a conflict by editing the same line in two branches and resolve it.

**Skills Unlocked:**
- Git (`tool`) — `intermediate`
- GitHub (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Git Branching & Merging — Atlassian — https://www.youtube.com/watch?v=S2TUommS3O0
- [ARTICLE] About pull requests — GitHub Docs — https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests
- [INTERNAL_TEXT] The feature branch workflow is how virtually every professional team works: never commit directly to `main`. Create a branch for your feature, do your work, open a PR for review, then merge. Even working solo, this habit builds discipline. Merge conflicts are not emergencies — they're normal. Git tells you exactly where the conflict is. Choose the version you want (or combine them), save, and commit.

---

### Topic 4.3 — Browser DevTools Deep Dive
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Elements panel: inspect and live-edit HTML/CSS. Console: `console.log/warn/error/table`, reading error messages. Network tab: inspect fetch requests, headers, status codes. Lighthouse: run a performance and accessibility audit.

**Practical Output:** Run a full Lighthouse audit on your landing page from Stage 2. Document the scores. Fix at least 3 issues it surfaces (performance, accessibility, or SEO). Re-run and show the improvement.

**Skills Unlocked:**
- Chrome DevTools (`tool`) — `intermediate`

**Resources:**
- [VIDEO] Chrome DevTools Full Tutorial — Web Dev Simplified — https://www.youtube.com/watch?v=gTVpBbFWry8
- [ARTICLE] Chrome DevTools Overview — Chrome Developers — https://developer.chrome.com/docs/devtools/overview
- [INTERNAL_TEXT] DevTools is your debugging environment. You will spend a significant portion of your career in this panel. The Network tab alone is worth mastering — it shows every request your page makes, the response it gets, how long it took, and what the data looks like. When something doesn't work, check the Console first (errors), then the Network tab (failed requests). Most problems announce themselves loudly here.

---

### Topic 4.4 — Deployment: Vercel, Netlify & GitHub Pages
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Deploy static sites to GitHub Pages. Deploy to Vercel and Netlify via GitHub repository integration. Understand environment variables, build commands, and custom domains.

**Practical Output:** Deploy all 3 previous stage projects (profile page, landing page, quiz app) live. Each should have a public, shareable link. Set up automatic redeploy — when you push to GitHub, the site updates automatically.

**Skills Unlocked:**
- Vercel (`platform_service`) — `beginner`
- Netlify (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Deploy a Website with Netlify & Vercel — Traversy Media — https://www.youtube.com/watch?v=HCDCrjQsEhg
- [ARTICLE] Get started with Vercel — Vercel Docs — https://vercel.com/docs/getting-started-with-vercel
- [INTERNAL_TEXT] Shipping code that real people can visit is a milestone. GitHub Pages is the simplest option for static HTML/CSS/JS. Vercel and Netlify are more powerful — they support build processes (for when you use React or Next.js later) and can automatically redeploy whenever you push to GitHub. Connect your repo once, and every `git push` goes live in seconds.

---

### Topic 4.5 — PROJECT: Live Portfolio Site v1
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 6–8 hrs

**Description:** Build and deploy a personal developer portfolio website that showcases all projects built so far.

**Requirements:**
- Hero section: name, title, short intro
- Projects section: cards with live demo and GitHub links for all stage projects
- Skills section: visual representation of what you've learned
- Contact section with a working form (use Formspree — free, no backend needed)
- Fully responsive
- Clean commit history (proper feature commits — not a single initial commit)
- Deployed live on Vercel or Netlify
- README with project description and tech stack

**Skills Demonstrated:**
- Git (`tool`) — `intermediate`
- GitHub (`platform_service`) — `beginner`
- Vercel (`platform_service`) — `beginner`
- Responsive Design (`practice`) — `intermediate`
- HTML (`language`) — `intermediate`
- CSS (`language`) — `advanced`

**Resources:**
- [VIDEO] Build a Portfolio Website — Traversy Media — https://www.youtube.com/watch?v=xV7S8BhIeBo
- [ARTICLE] Formspree — HTML form backend — https://formspree.io/
- [INTERNAL_TEXT] Your portfolio is the most important project you'll build on Mallah. Every future project you complete gets added here. A clean, live portfolio with 3+ working projects is worth more than any certificate. Prioritize: everything loads and works on mobile, every link is real, it looks like you care about quality.

---

## Stage 5 — React Fundamentals
**Tagline:** Build modular, component-driven UIs — the way the industry actually works.
**Duration:** ~4 weeks

---

### Topic 5.1 — Why React? Components & JSX
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** What problems does React solve over vanilla JS? Component-based architecture. JSX syntax. Create your first React app with Vite. Build reusable components. Pass data via props.

**Practical Output:** Break a static HTML page (your profile page) into React components: Navbar, Hero, Card, Footer. Make Card accept props so it can render different content with the same component.

**Skills Unlocked:**
- React (`framework_library`) — `beginner`
- Vite (`tool`) — `beginner`

**Resources:**
- [VIDEO] React Tutorial for Beginners — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d
- [ARTICLE] Your first component — React Docs — https://react.dev/learn/your-first-component
- [INTERNAL_TEXT] React's core idea: your UI is a function of your data. Instead of manually reaching into the DOM to change things (like you did in vanilla JS), you describe what the UI should look like given the current data, and React handles the updates. Components are just functions that return JSX (which looks like HTML but is actually JavaScript). Every React app is a tree of these functions.

---

### Topic 5.2 — State & useState Hook
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Why does React need its own state system? `useState`: declare, read, update. The re-render cycle. Controlled inputs (input value driven by state). Lifting state up to a parent component.

**Practical Output:** Build a shopping cart UI — add items from a product list, remove items, show running total count and price. All driven by state.

**Skills Unlocked:**
- React (`framework_library`) — `beginner` → `intermediate`

**Resources:**
- [VIDEO] useState Hook — Web Dev Simplified — https://www.youtube.com/watch?v=O6P86uwfdR0
- [ARTICLE] State: a component's memory — React Docs — https://react.dev/learn/state-a-components-memory
- [INTERNAL_TEXT] State is data that, when it changes, causes the component to re-render. The rule: never mutate state directly. Always use the setter function. The most common beginner bug: calling a setter inside the render function (causes an infinite re-render loop). State updates are asynchronous — use the updater function pattern (`setCount(prev => prev + 1)`) when the new value depends on the old one.

---

### Topic 5.3 — useEffect & Data Fetching
**Type:** Lesson + Practice
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** `useEffect` for side effects. Dependency array: when effects run. Cleanup functions. Fetch API inside a component. Handle loading state, error state, and empty state.

**Practical Output:** Build a GitHub profile viewer — type a username, press search, fetch from the real GitHub API, and display the user's avatar, name, bio, and public repo count.

**Skills Unlocked:**
- React (`framework_library`) — `intermediate`
- REST API consumption (`practice`) — `intermediate`

**Resources:**
- [VIDEO] useEffect Hook — Web Dev Simplified — https://www.youtube.com/watch?v=0ZJgIjIuY7U
- [ARTICLE] Synchronizing with Effects — React Docs — https://react.dev/learn/synchronizing-with-effects
- [INTERNAL_TEXT] `useEffect` runs after the component renders. The dependency array controls when: `[]` = run once on mount; `[value]` = run every time `value` changes; no array = run on every render (almost never what you want). The cleanup function (returned from useEffect) runs before the next effect fires — it's used to cancel subscriptions, clear timers, or abort fetch requests.

---

### Topic 5.4 — Lists, Keys & Conditional Rendering
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Render arrays with `.map()`. Why keys matter and what makes a good key. Conditional rendering patterns: ternary, `&&` operator, early return. Avoid common rendering mistakes.

**Practical Output:** Build a filterable movie list — fetch from TMDB (free API key), render movie cards, and add filter buttons for genre or rating range.

**Skills Unlocked:**
- React (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] Rendering Lists in React — Traversy Media — https://www.youtube.com/watch?v=0sasRxl35_8
- [ARTICLE] Rendering lists — React Docs — https://react.dev/learn/rendering-lists
- [INTERNAL_TEXT] Every item in a rendered list needs a unique `key` prop. React uses keys to track which items changed, were added, or removed between renders. Never use the array index as a key for lists that can reorder or filter — it causes subtle bugs. Use a unique ID from your data. For conditional rendering: be careful with `{condition && <Component />}` when condition might be `0` — it renders the number 0, not nothing. Use a ternary or explicit boolean check.

---

### Topic 5.5 — React Router: Multi-Page Apps
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Install React Router v6. BrowserRouter, Routes, Route, Link, useNavigate, useParams. Build multi-page apps with dynamic routes.

**Practical Output:** Add a detail page to your movie app — clicking a movie card navigates to `/movie/:id` and shows full movie details fetched by ID.

**Skills Unlocked:**
- React (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] React Router v6 Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9iVKmtNuCeIswnQ97in2GGf
- [ARTICLE] React Router — Official Tutorial — https://reactrouter.com/en/main/start/tutorial
- [INTERNAL_TEXT] React Router is a library that simulates multiple pages in a single-page app. The browser never actually navigates to a new HTML file — React Router intercepts clicks, reads the URL, and renders the matching component. `useParams` gives you the dynamic segment from the URL (e.g. `/movie/123` → `{ id: '123' }`). `useNavigate` lets you redirect programmatically (e.g. after a form submit).

---

### Topic 5.6 — Forms & Validation in React
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Controlled form components in React. Multi-field forms with a single state object. Client-side validation with inline error messages. Introduction to React Hook Form for complex forms.

**Practical Output:** Build a multi-step registration form: Step 1 (name, email), Step 2 (password + confirm), Step 3 (profile details). Show real-time validation errors inline. Only advance to the next step if the current step is valid.

**Skills Unlocked:**
- React (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] React Hook Form Tutorial — Web Dev Simplified — https://www.youtube.com/watch?v=R_Pj593TH_Q
- [ARTICLE] React Hook Form — Official Docs — https://react-hook-form.com/get-started
- [INTERNAL_TEXT] Controlled inputs in React: every input's value is stored in state and the input is updated via the state setter on `onChange`. This gives you full control over the form at all times. React Hook Form is a library that reduces the amount of state you need to write by managing form state internally — use it for complex multi-field forms where writing `useState` for every field becomes tedious.

---

### Topic 5.7 — Context API & Global State
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Prop drilling problem. `createContext`, `useContext`, Provider pattern. When to use Context vs local state. Build a theme switcher and a global cart state using Context.

**Practical Output:** Add dark/light mode to your movie app using Context API. The preference should persist via localStorage so it survives page refresh.

**Skills Unlocked:**
- React (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] React Context & useContext — Web Dev Simplified — https://www.youtube.com/watch?v=5LrDIWkK_Bc
- [ARTICLE] Passing data deeply with context — React Docs — https://react.dev/learn/passing-data-deeply-with-context
- [INTERNAL_TEXT] Context solves prop drilling — when you need to pass data through many component levels that don't actually use it themselves. Good use cases: theme, authenticated user, language preference, global cart. Bad use cases: state that changes frequently at high frequency (like typing input) — Context re-renders all consumers on every change. For complex global state, you'll learn Zustand in Stage 6.

---

### Topic 5.8 — PROJECT: Task Manager App
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 10–14 hrs

**Description:** Build a fully-featured task management app in React.

**Requirements:**
- Add, edit, delete, and complete tasks
- Tasks in three columns: To Do / In Progress / Done
- Filter by status, search by title
- Due date per task with overdue highlighting
- Global state via Context API (no prop drilling)
- Dark/light mode toggle using Context, persisted in localStorage
- All tasks persisted in localStorage
- React Router: `/` dashboard and `/task/:id` detail view
- Fully responsive
- Deployed on Vercel

**Skills Demonstrated:**
- React (`framework_library`) — `advanced`
- REST API consumption (`practice`) — `intermediate`
- Responsive Design (`practice`) — `intermediate`
- Git (`tool`) — `intermediate`

**Resources:**
- [VIDEO] Build a Task Manager in React — Traversy Media — https://www.youtube.com/watch?v=XK374-KZRDA
- [INTERNAL_TEXT] Plan your component tree before writing any code: what components exist, what state they own, what props they receive. Sketch it on paper. This is the skill that separates developers who build cleanly from those who refactor constantly. Your project structure should mirror the UI structure.

---

## Stage 6 — Modern Frontend Stack
**Tagline:** Level up to the tools real companies use — TypeScript, Next.js, and production patterns.
**Duration:** ~4 weeks

---

### Topic 6.1 — TypeScript for React Developers
**Type:** Lesson + Practice
**Estimated Time:** 5–6 hrs
**Difficulty:** Intermediate

**Description:** Why TypeScript? Types, interfaces, type inference. Typing props, state, API responses, function signatures. Common TS patterns in React. No `any`.

**Practical Output:** Convert your Task Manager app's core components to TypeScript. Fix every type error. The result should compile with 0 errors.

**Skills Unlocked:**
- TypeScript (`language`) — `beginner`

**Resources:**
- [VIDEO] TypeScript for React Developers — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9gNhFQgS4edYLqP7LkZcFMN
- [ARTICLE] React TypeScript Cheatsheet — https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example
- [INTERNAL_TEXT] TypeScript is JavaScript with type annotations. It doesn't change how your code runs — it only adds a compile step that checks your code for type errors before it reaches the browser. The main benefit: when you misuse a variable (pass a string where a number is expected, access a property that doesn't exist), TypeScript tells you immediately during development instead of at runtime in front of a user. Most companies now require TypeScript for frontend roles.

---

### Topic 6.2 — Next.js: Routing, SSR & the App Router
**Type:** Lesson + Practice
**Estimated Time:** 5–6 hrs
**Difficulty:** Intermediate

**Description:** What is Next.js and why use it over bare React? App Router. File-based routing. Server Components vs Client Components. `fetch` with caching in Next.js. Dynamic routes. SEO benefits.

**Practical Output:** Rebuild your movie list as a Next.js app — movie data fetched on the server (Server Component), SEO-optimized with proper metadata. Dynamic route `/movie/[id]` with server-side data fetch.

**Skills Unlocked:**
- Next.js (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Next.js 14 Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9jClk8wl1yJcN3Zlrr8YSA1
- [ARTICLE] Next.js — Getting started — https://nextjs.org/docs/getting-started/installation
- [INTERNAL_TEXT] Next.js is React with superpowers. It adds: server-side rendering (HTML generated on the server = better SEO and initial load), file-based routing (no React Router needed), built-in image optimization, and API routes. In 2026, most new React projects start with Next.js, not bare React. The App Router is now the standard — Server Components run on the server and send pre-rendered HTML; Client Components handle interactivity in the browser.

---

### Topic 6.3 — API Routes & Server Actions
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Next.js API routes. Build simple server-side endpoints. Server Actions for form submission. Call external APIs from the server to hide API keys from the client.

**Practical Output:** Add a working contact form to your portfolio that sends real emails — API key hidden server-side using a Next.js API route + Resend (free tier).

**Skills Unlocked:**
- Next.js (`framework_library`) — `intermediate`
- REST API consumption (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Next.js API Routes — Traversy Media — https://www.youtube.com/watch?v=vrR4MlB7nBI
- [ARTICLE] Route Handlers — Next.js Docs — https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- [INTERNAL_TEXT] API routes in Next.js let you write server-side code inside your frontend project. The most important use case: never expose API keys in client-side code (they end up in the browser's source). Instead, make requests to your own `/api/...` endpoint, which runs on the server and calls the external API securely. This is called a Backend for Frontend (BFF) pattern.

---

### Topic 6.4 — Tailwind CSS at Scale & Component Libraries
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Tailwind in a Next.js project. Build reusable component abstractions with Tailwind. Introduction to shadcn/ui — install and customize components to match your design system.

**Practical Output:** Build a reusable UI kit page: Button (variants: primary, secondary, destructive), Card, Badge, Input, Modal, and Toast notification. Document each component's props.

**Skills Unlocked:**
- Tailwind CSS (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] shadcn/ui Tutorial — Josh tried coding — https://www.youtube.com/watch?v=7MKEOfSP2s4
- [ARTICLE] shadcn/ui — Official Documentation — https://ui.shadcn.com/docs
- [INTERNAL_TEXT] shadcn/ui is not a component library you install — it's a collection of copy-paste-able components built on Radix UI (accessible primitives) and styled with Tailwind. You own the code; it lives in your project. This is the current industry preference over libraries like MUI or Chakra because you have full control with no version lock-in. Companies like Vercel and Linear use this approach.

---

### Topic 6.5 — State Management with Zustand
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Problems with Context at scale. Zustand: create a store, define state and actions, use selectors to prevent unnecessary re-renders. When to use Zustand vs Context.

**Practical Output:** Refactor your Task Manager's Context-based state to a Zustand store. Verify that components only re-render when the state they subscribe to actually changes.

**Skills Unlocked:**
- React (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] Zustand State Management Tutorial — Jack Herrington — https://www.youtube.com/watch?v=AYO4qHAnLQI
- [ARTICLE] Zustand — Official GitHub Documentation — https://github.com/pmndrs/zustand
- [INTERNAL_TEXT] Zustand is a tiny state management library. You create a store with `create()`, define state and updater functions inside it, and subscribe to it from any component using a hook — no Provider required. The key advantage over Context: components only re-render when the specific slice of state they subscribe to changes, not the entire tree. This makes it far more performant for high-frequency updates.

---

### Topic 6.6 — React Query: Server State & Caching
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Client state (UI) vs server state (data from APIs). `useQuery` for fetching, `useMutation` for writes. Caching, background refetching, stale time. Why React Query replaces manual `useEffect` + `useState` for data fetching.

**Practical Output:** Add React Query to your movie app — cache search results (no refetch if you revisit the same query within 5 minutes), show stale data while refetching, and add a manual refetch button.

**Skills Unlocked:**
- React (`framework_library`) — `advanced`
- REST API consumption (`practice`) — `advanced`

**Resources:**
- [VIDEO] React Query Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9jUPIes5fRFddaqzBa3RJKZ
- [ARTICLE] TanStack Query — Official Docs — https://tanstack.com/query/latest/docs/framework/react/overview
- [INTERNAL_TEXT] Every time you write `useEffect(() => { fetch(...) }, [])`, you're reinventing what React Query does — poorly. React Query manages loading, error, and success states for you, caches responses, handles background refetching, deduplicates concurrent requests, and gives you optimistic updates. It's one of the highest-impact libraries you can add to a React project.

---

### Topic 6.7 — PROJECT: Full-Featured Web App
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 14–20 hrs

**Description:** Build a complete, real-world Next.js web app. Learner picks one idea (or proposes their own).

**Suggested Ideas:**
- Recipe finder & saver — Spoonacular API, save favorites
- Job board aggregator — filter by stack/location/remote
- Expense tracker with charts — Recharts visualization
- Real-time weather dashboard — multi-city, 7-day forecast

**Requirements:**
- Next.js with App Router
- TypeScript throughout (0 `any`)
- Tailwind CSS + at least 2 shadcn/ui components
- Zustand or React Query (use both if scope allows)
- At least 2 dynamic routes
- One API route (hide an external API key)
- Lighthouse: >80 Performance, >90 Accessibility
- Deployed on Vercel with clean README and live link

**Skills Demonstrated:**
- Next.js (`framework_library`) — `intermediate`
- TypeScript (`language`) — `beginner`
- Tailwind CSS (`framework_library`) — `intermediate`
- React (`framework_library`) — `advanced`
- REST API consumption (`practice`) — `advanced`

**Resources:**
- [VIDEO] Build a Full Stack Next.js App — Traversy Media — https://www.youtube.com/watch?v=wm5gMKuwSYk
- [ARTICLE] Next.js — Full App Router Guide — https://nextjs.org/docs/app/building-your-application
- [INTERNAL_TEXT] This is your most important portfolio project at this stage. Pick the idea you'd actually use yourself — passion shows in the details. Scope it for 2–3 weeks: a finished, polished, smaller app is worth far more than an ambitious unfinished one. Ship it, write a good README, and link it everywhere.

---

## Stage 7 — Performance, Accessibility & Polish
**Tagline:** The skills that separate juniors from seniors. Make your apps fast, accessible, and professional.
**Duration:** ~2 weeks

---

### Topic 7.1 — Web Performance Fundamentals
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Core Web Vitals: LCP, CLS, INP. Lighthouse audits in DevTools. Code splitting, lazy loading with `React.lazy` + `Suspense`, `next/image` for optimized images. Eliminate render-blocking resources.

**Practical Output:** Run a Lighthouse audit on your Stage 6 project. Bring Performance score to above 90. Document every change you made and what it improved.

**Skills Unlocked:**
- Web Performance (`practice`) — `beginner`

**Resources:**
- [VIDEO] Web Performance Fundamentals — Kevin Powell — https://www.youtube.com/watch?v=0fONene3OIA
- [ARTICLE] Web Vitals — web.dev — https://web.dev/articles/vitals
- [INTERNAL_TEXT] The three Core Web Vitals Google measures: LCP (Largest Contentful Paint) — how fast the main content loads; CLS (Cumulative Layout Shift) — how much the page jumps around while loading; INP (Interaction to Next Paint) — how fast the page responds to clicks. These metrics directly affect your Google search ranking. `next/image` automatically handles lazy loading, resizing, and modern formats — always use it instead of a raw img tag in Next.js.

---

### Topic 7.2 — Web Accessibility (a11y)
**Type:** Lesson + Practice
**Estimated Time:** 3–4 hrs
**Difficulty:** Intermediate

**Description:** Why accessibility matters (legal requirements, business case, ethics). Semantic HTML's role. ARIA labels and roles when semantics aren't enough. Keyboard navigation testing. Color contrast ratios. Test with the axe DevTools browser extension.

**Practical Output:** Run an accessibility audit on your portfolio using axe DevTools. Fix all critical violations. Verify that your site is fully keyboard-navigable (tab through every interactive element, no focus traps).

**Skills Unlocked:**
- Web Accessibility (`practice`) — `beginner`

**Resources:**
- [VIDEO] Web Accessibility Tutorial — Kevin Powell — https://www.youtube.com/watch?v=e2nkq3h1lcw
- [ARTICLE] Accessibility — MDN — https://developer.mozilla.org/en-US/docs/Web/Accessibility
- [INTERNAL_TEXT] Accessibility is not optional. In many countries (US, EU, UK), inaccessible websites are a legal liability. More importantly: 15% of the global population has a disability. ARIA attributes (aria-label, aria-describedby, role) fill in the semantic gaps where HTML tags don't communicate enough. The fastest audit tool: the axe DevTools Chrome extension. Install it. Run it on every project before you call it done.

---

### Topic 7.3 — SEO for Frontend Developers
**Type:** Lesson + Practice
**Estimated Time:** 1.5–2.5 hrs
**Difficulty:** Beginner

**Description:** Meta tags (title, description). Open Graph tags for social sharing. Dynamic metadata in Next.js using the `metadata` export and `generateMetadata`. Canonical URLs. Sitemap basics.

**Practical Output:** Add full SEO metadata to your portfolio: title, description, OG image, and Twitter card metadata. Test with opengraph.xyz — paste your URL and see how it looks when shared on LinkedIn.

**Skills Unlocked:**
- SEO (`practice`) — `beginner`

**Resources:**
- [VIDEO] SEO for Developers — Fireship — https://www.youtube.com/watch?v=-B58GgsehKQ
- [ARTICLE] Optimizing: Metadata — Next.js Docs — https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- [INTERNAL_TEXT] In Next.js App Router, metadata is exported from page files as a `metadata` object or a `generateMetadata` async function for dynamic pages. Open Graph tags control how your page looks when shared on LinkedIn, Twitter, Slack, and iMessage — the title, description, and image shown in the preview card. A site with good OG metadata looks professional when shared; without it, the preview is blank or broken.

---

### Topic 7.4 — Testing Basics: Vitest & React Testing Library
**Type:** Lesson + Practice
**Estimated Time:** 4–5 hrs
**Difficulty:** Intermediate

**Description:** Why test? Unit tests with Vitest. Component tests with React Testing Library. Query elements the way users would (by role, label, text). Write tests for a component and a utility function.

**Practical Output:** Write 5+ tests for your Task Manager: test adding a task, completing a task, filtering tasks, and a pure utility function (e.g. formatDueDate).

**Skills Unlocked:**
- Frontend Testing (`practice`) — `beginner`

**Resources:**
- [VIDEO] React Testing Library Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9gm4_-5UsNmLqMosM-dzuvQ
- [ARTICLE] React Testing Library — Official Docs — https://testing-library.com/docs/react-testing-library/intro/
- [INTERNAL_TEXT] The guiding principle of React Testing Library: test what the user sees and does, not implementation details. Query elements by their accessible role (`getByRole('button', { name: 'Add Task' })`), not by class name or internal state. This makes your tests resilient to refactoring — if you rename a CSS class but the button still says "Add Task" and still works, the test still passes.

---

### Topic 7.5 — PROJECT: Final Portfolio (Polished)
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 10–16 hrs

**Description:** Rebuild and polish your portfolio (first built in Stage 4) into a professional, public-ready developer site. This is the portfolio you send to employers.

**Requirements:**
- Rebuilt in Next.js with TypeScript
- All projects showcased: thumbnail, description, live link, GitHub link, tech stack tags
- Smooth page transitions (Next.js View Transitions or Framer Motion)
- Lighthouse: >90 Performance, >90 Accessibility, >90 SEO
- Open Graph metadata (looks great when shared on LinkedIn)
- Fully responsive — tested on a real mobile device
- Custom domain (optional but strongly encouraged)
- README includes a "How it was built" section

**Skills Demonstrated:**
- Next.js (`framework_library`) — `intermediate`
- Web Performance (`practice`) — `beginner`
- Web Accessibility (`practice`) — `beginner`
- SEO (`practice`) — `beginner`
- TypeScript (`language`) — `beginner`
- Git (`tool`) — `intermediate`

**Resources:**
- [VIDEO] Build a Developer Portfolio with Next.js 14 — Josh tried coding — https://www.youtube.com/watch?v=6ar3QefEtO8
- [ARTICLE] View Transitions API — MDN — https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- [INTERNAL_TEXT] This portfolio is your graduation project. It doesn't just showcase your work — it IS a piece of your work. Treat it with the same care you'd give a client project: clean code, meaningful commit history, no broken links, no placeholder text. This is what an employer opens before they decide whether to contact you.

---

## Full Skills Catalog for This Path

| Skill | Category | Max Level Achievable |
|-------|----------|---------------------|
| Web fundamentals | `fundamentals` | `beginner` |
| HTTP basics | `fundamentals` | `beginner` |
| HTML | `language` | `intermediate` |
| CSS | `language` | `advanced` |
| JavaScript | `language` | `advanced` |
| TypeScript | `language` | `beginner` |
| Next.js | `framework_library` | `intermediate` |
| React | `framework_library` | `advanced` |
| Tailwind CSS | `framework_library` | `intermediate` |
| Git | `tool` | `intermediate` |
| Vite | `tool` | `beginner` |
| Chrome DevTools | `tool` | `intermediate` |
| GitHub | `platform_service` | `beginner` |
| Vercel | `platform_service` | `beginner` |
| Netlify | `platform_service` | `beginner` |
| Responsive Design | `practice` | `intermediate` |
| REST API consumption | `practice` | `advanced` |
| Web Performance | `practice` | `beginner` |
| Web Accessibility | `practice` | `beginner` |
| SEO | `practice` | `beginner` |
| Frontend Testing | `practice` | `beginner` |

**Total: 21 skills**

---

## Opportunity Analyzer Tags

Skills that map directly to frontend job postings (based on LinkedIn/Indeed/Glassdoor analysis, 2025–2026):

**High demand (>70% of frontend postings):**
React, JavaScript, TypeScript, Git, Responsive Design, REST API consumption

**Medium demand (40–70%):**
Next.js, HTML, CSS, Tailwind CSS, GitHub, Web Performance

**Good to have (<40%):**
Web Accessibility, SEO, Vite, Frontend Testing

---

## Progression Rules

- Stages 1–4 are sequential and mandatory — no skipping.
- Each stage requires the milestone project to be submitted before the next stage unlocks.
- Stages 5–7 are sequential but learners can preview Stage 6 topic descriptions after completing 50% of Stage 5.
- Topics within a stage can be completed in any order.
- Every completed project immediately appears in the learner's Portfolio Hub.

---

## Certificate Suggestions

### Format Guide (for agent parsing)

Certificate suggestions are attached at the **stage level**, not the topic level. They appear in a new `stage_certificates` table in the database. The Markdown block below maps directly to that table.

```
## Stage [N] Certificate Suggestion
- [CERT] Title — Provider — URL — Cost — Trigger
```

**Fields:**
- `cert_id` — auto-generated
- `stage_id` — FK to the stage this suggestion is tied to
- `title` — display name of the cert
- `provider` — issuing organization
- `url` — direct link to the cert page
- `cost_type` — ENUM: `free` | `free_audit` | `paid`
- `cost_note` — short clarifying note shown to the user (e.g. "Free with email signup" or "~$50/mo to earn the certificate, free to audit")
- `trigger` — ENUM: `on_stage_complete` (show after milestone project is submitted)
- `why_now` — 1–2 sentence explanation of why this cert fits here, shown to the user

**UI behavior:** After the learner marks the stage milestone project as complete, a dismissible card appears: "You're ready for an external certificate. Here's what we recommend." The learner can dismiss it permanently or open the link. Dismissed state stored per learner per cert in `user_dismissed_certs`.

---

### Stage 2 Certificate Suggestion
*(After: Responsive Landing Page project)*

**Certificate:** freeCodeCamp — Responsive Web Design Certification
**Provider:** freeCodeCamp
**URL:** https://www.freecodecamp.org/learn/2022/responsive-web-design/
**Cost:** `free` — Completely free, no credit card, certificate shareable on LinkedIn
**Trigger:** `on_stage_complete`
**Why now:** You've learned HTML, CSS, Flexbox, Grid, responsive design, and Tailwind. The freeCodeCamp Responsive Web Design cert covers exactly these skills and is earned by building 5 real projects. It's project-based (not just a quiz), which means it proves you can actually build — not just answer questions. The certificate is free and LinkedIn-addable.

---

### Stage 3 Certificate Suggestion
*(After: Interactive Quiz App project)*

**Certificate 1:** freeCodeCamp — JavaScript Certification
**Provider:** freeCodeCamp
**URL:** https://www.freecodecamp.org/learn/javascript-v9/
**Cost:** `free` — Completely free, certificate shareable on LinkedIn
**Trigger:** `on_stage_complete`
**Why now:** You've covered all the core JavaScript concepts tested in this certification: variables, functions, arrays, objects, DOM, events, async, and local storage. The freeCodeCamp JS cert includes an exam and 5 graded projects — having it on LinkedIn signals to employers that your JavaScript is solid before they even look at your code.

**Certificate 2:** HackerRank — JavaScript (Basic) Skill Certificate
**Provider:** HackerRank
**URL:** https://www.hackerrank.com/skills-verification/javascript_basic
**Cost:** `free` — Free assessment, shareable certificate badge
**Trigger:** `on_stage_complete`
**Why now:** HackerRank skill certificates are employer-facing — recruiters actively filter for them on the platform. The JavaScript Basic cert tests functions, scope, closures, events, and error handling — exactly what you just learned. It takes 90 minutes and you can retake it after a cooldown. Do both this and the freeCodeCamp cert for maximum signal.

---

### Stage 5 Certificate Suggestion
*(After: Task Manager App project)*

**Certificate 1:** HackerRank — React (Basic) Skill Certificate
**Provider:** HackerRank
**URL:** https://www.hackerrank.com/skills-verification/react_basic
**Cost:** `free` — Free assessment, shareable certificate badge
**Trigger:** `on_stage_complete`
**Why now:** You've built a full React app with hooks, state, context, router, and forms. The HackerRank React Basic cert validates exactly these skills (components, props, state, hooks, event handling, form validation). It's the fastest employer-visible proof that your React is real.

**Certificate 2:** HackerRank — Front-End Developer (React) Role Certificate
**Provider:** HackerRank
**URL:** https://www.hackerrank.com/skills-verification/frontend_developer_react
**Cost:** `free` — Free assessment, role-level certificate
**Trigger:** `on_stage_complete`
**Why now:** This is a role-level certificate (not just a skill badge) — it covers React + JavaScript + CSS together and results in a "Front-End Developer" credential. It's the most employer-visible certificate HackerRank offers for frontend. After completing 5 stages of Mallah, you're more than ready for this exam.

---

### Stage 6 Certificate Suggestion
*(After: Full-Featured Web App project)*

**Certificate:** Meta Front-End Developer Professional Certificate
**Provider:** Meta / Coursera
**URL:** https://www.coursera.org/professional-certificates/meta-front-end-developer
**Cost:** `free_audit` — Free to audit (watch all videos and access materials). ~$50/month to earn the graded certificate. Financial aid available.
**Trigger:** `on_stage_complete`
**Why now:** By Stage 6 you've built everything this certificate teaches — and more. Taking it at this point means you're not learning from scratch; you're validating and filling any remaining gaps with Meta's structured content. The Meta brand carries real weight on LinkedIn and with employers, and it includes access to Meta's exclusive job board connecting completers with 200+ hiring companies. If budget allows, this is the highest-ROI paid certification available for frontend developers.

---

## Certificate Summary Table

| After Stage | Certificate | Provider | Cost | LinkedIn-addable |
|-------------|-------------|----------|------|-----------------|
| Stage 2 | Responsive Web Design | freeCodeCamp | Free | ✓ |
| Stage 3 | JavaScript Certification | freeCodeCamp | Free | ✓ |
| Stage 3 | JavaScript (Basic) Skill | HackerRank | Free | ✓ |
| Stage 5 | React (Basic) Skill | HackerRank | Free | ✓ |
| Stage 5 | Front-End Developer (React) Role | HackerRank | Free | ✓ |
| Stage 6 | Meta Front-End Developer | Meta / Coursera | Free audit / ~$50/mo for cert | ✓ |

## Database Changes Required

### New table: `stage_certificates`

| Field | Type | Notes |
|-------|------|-------|
| `cert_id` | UUID PK | Auto-generated |
| `stage_id` | FK → stages | The stage this suggestion appears after |
| `title` | VARCHAR | Display name |
| `provider` | VARCHAR | Issuing organization |
| `url` | VARCHAR | Direct link |
| `cost_type` | ENUM | `free` / `free_audit` / `paid` |
| `cost_note` | VARCHAR | Short note shown to user |
| `why_now` | TEXT | 1–2 sentence context shown in the suggestion card |
| `order_index` | INT | For stages with multiple cert suggestions (shown in order) |
| `is_active` | BOOLEAN | Admin can deactivate if cert goes offline |

### New table: `user_dismissed_certs`

| Field | Type | Notes |
|-------|------|-------|
| `user_id` | FK → users | |
| `cert_id` | FK → stage_certificates | |
| `dismissed_at` | TIMESTAMP | |

No `completed` state tracked — Mallah doesn't verify external completions. The suggestion is purely informational. Learners self-report on their profile or LinkedIn.

### Admin Panel addition

Certificate suggestions should be manageable in the Admin Panel under each Stage's edit view:
- View, add, edit, deactivate cert suggestions per stage
- Toggle `is_active` if a cert link goes dead or changes
- Add new certs without a code deploy (data-driven)
