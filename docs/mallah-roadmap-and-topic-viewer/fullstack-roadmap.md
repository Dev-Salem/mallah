# Mallah — Full-Stack Web Development Path
## Full Roadmap Specification (with Resources & Certificates)

**Path ID:** `fullstack`
**Estimated Duration:** 7–10 months (at 1–2 hrs/day)
**Difficulty:** Beginner → Advanced
**Philosophy:** Build complete, working products end-to-end. Every stage adds a new layer to the same kind of app — frontend, then backend, then database, then auth, then deployment. By the end, the learner can take a product idea from zero to a live, production URL.

**Stack:** React · Next.js · TypeScript · Tailwind · Node.js · Express · PostgreSQL · Prisma · JWT · Docker · GitHub Actions

---

## Resource Format Guide (for agent parsing)

```
- [VIDEO] Title — Channel/Author — URL
- [ARTICLE] Title — Source — URL
- [INTERNAL_TEXT] Short inline explanation (no URL — rendered inline in Topic Viewer)
```

Certificate block format:
```
- [CERT] Title — Provider — URL — cost_type — cost_note
```

---

## Path Overview

| Stage | Title | Topics | Project |
|-------|-------|---------|---------|
| 1 | Web Foundations + JS | 7 | Static Portfolio Page |
| 2 | React & Frontend Fundamentals | 7 | Frontend-Only SPA |
| 3 | Node.js & Backend Basics | 7 | REST API Server |
| 4 | Databases with PostgreSQL & Prisma | 6 | Database-Backed API |
| 5 | Authentication & Security | 5 | Auth System |
| 6 | Full-Stack Integration | 6 | Full-Stack App v1 |
| 7 | DevOps, Deployment & CI/CD | 5 | Production-Ready App |
| 8 | Advanced Patterns & Capstone | 6 | Capstone Full-Stack Product |

**Total:** 49 topics · 8 projects · 30 skills unlocked

---

## Stage 1 — Web Foundations + JavaScript
**Tagline:** The language of the web — build something real on day one.
**Duration:** ~3 weeks
**Note:** This stage is a condensed version of the Frontend path's Stages 1–3. Learners who already have HTML/CSS/JS knowledge can skip directly to Stage 2 after a self-assessment.

---

### Topic 1.1 — How the Web Works + Dev Environment Setup
**Type:** Concept + Setup
**Estimated Time:** 1 hr
**Difficulty:** Beginner

**Description:** How browsers, servers, and HTTP work. Install VS Code, Node.js, Git. Set up a project folder. Understand what full-stack means — frontend (browser), backend (server), database.

**Practical Output:** Set up your dev environment from scratch. Create a folder, open it in VS Code, run your first Node.js script (`node index.js` that prints "Hello World"), push it to GitHub.

**Skills Unlocked:**
- Web fundamentals (`fundamentals`) — `beginner`
- HTTP basics (`fundamentals`) — `beginner`
- Node.js (`platform_service`) — `beginner`
- Git (`tool`) — `beginner`

**Resources:**
- [VIDEO] How The Web Works — Traversy Media — https://www.youtube.com/watch?v=hJHvdBlSxug
- [ARTICLE] How the Web works — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works
- [INTERNAL_TEXT] Full-stack development means you own the entire request-response cycle: you build what users see (frontend), the logic that processes their actions (backend), and the storage that persists their data (database). Understanding how these three layers communicate is the single most important mental model in this path. Everything you build from here reinforces this cycle.

---

### Topic 1.2 — HTML & Semantic Markup
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Beginner

**Description:** HTML structure, semantic tags (nav, section, article, footer), forms, tables. Build meaningful markup — not div soup.

**Practical Output:** Build a structured HTML bio page with a nav, about section, skills list, and contact form. No CSS yet.

**Skills Unlocked:**
- HTML (`language`) — `beginner`

**Resources:**
- [VIDEO] HTML Crash Course — Traversy Media — https://www.youtube.com/watch?v=UB1O30fR-EE
- [ARTICLE] HTML basics — MDN — https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website/Creating_the_content
- [INTERNAL_TEXT] In full-stack development, HTML is usually generated dynamically by a template engine or a frontend framework — but you must understand its structure first. Every form input, every link, every button you build on the backend will eventually render as HTML. Get the semantics right from day one.

---

### Topic 1.3 — CSS, Flexbox & Tailwind
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Beginner

**Description:** CSS selectors, box model, Flexbox, responsive basics. Then Tailwind CSS: utility-first approach. Build layouts fast with Tailwind.

**Practical Output:** Style your bio page using Tailwind. Add a responsive navbar, a card layout, and a hero section. Make it work on mobile.

**Skills Unlocked:**
- CSS (`language`) — `intermediate`
- Tailwind CSS (`framework_library`) — `beginner`
- Responsive Design (`practice`) — `beginner`

**Resources:**
- [VIDEO] Tailwind CSS Crash Course — Traversy Media — https://www.youtube.com/watch?v=dFgzHOX84xQ
- [ARTICLE] Tailwind CSS Docs — https://tailwindcss.com/docs/installation
- [INTERNAL_TEXT] Full-stack developers don't need to master every CSS nuance — but you need to be fast enough with Tailwind to build clean UIs without a designer handing you code. The goal here is fluency, not perfection. Tailwind's utility classes map directly to CSS properties — once you internalize `p-4 = padding: 1rem`, it becomes muscle memory.

---

### Topic 1.4 — JavaScript Core: Variables, Functions, Arrays & Objects
**Type:** Lesson + Practice
**Estimated Time:** 3 hrs
**Difficulty:** Beginner

**Description:** Variables (`let`, `const`), data types, conditionals, loops, functions (declarations, expressions, arrow functions), arrays and their key methods (`map`, `filter`, `reduce`), objects and destructuring.

**Practical Output:** Build a product filtering system in the browser — an array of 10 product objects, rendered as cards, filterable by category. Pure JS, no framework.

**Skills Unlocked:**
- JavaScript (`language`) — `intermediate`

**Resources:**
- [VIDEO] JavaScript Crash Course — Traversy Media — https://www.youtube.com/watch?v=hdI2bqOjy3c
- [ARTICLE] JavaScript — javascript.info (Chapters 1–5) — https://javascript.info/
- [INTERNAL_TEXT] JavaScript runs on both sides of the stack. In the browser it powers your UI — in Node.js it powers your server. Learning it deeply now means you'll write the same language everywhere. Focus especially on array methods (`map`, `filter`, `reduce`) — they're the backbone of every data transformation you'll do on both frontend and backend.

---

### Topic 1.5 — Async JavaScript: Promises, Fetch & async/await
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Synchronous vs asynchronous execution. Callbacks problem. Promises. `async/await`. Fetch API. Error handling with `try/catch`. This is the foundation of every API call you'll ever make.

**Practical Output:** Build a weather dashboard that fetches from Open-Meteo API (free, no key), displays city weather, and shows a proper loading and error state.

**Skills Unlocked:**
- JavaScript (`language`) — `intermediate`
- REST API consumption (`practice`) — `beginner`

**Resources:**
- [VIDEO] Async JS, Promises, Fetch — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9jAhrjtZ9U93UMIhnCc44MH
- [ARTICLE] Async/await — javascript.info — https://javascript.info/async-await
- [INTERNAL_TEXT] Async code is everywhere in full-stack development: reading from a database, calling an external API, writing a file. `async/await` is just syntactic sugar over Promises — it makes async code read like synchronous code. The pattern `try { const data = await someAsyncThing() } catch (err) { handleError(err) }` is something you will write hundreds of times across frontend and backend. Internalize it now.

---

### Topic 1.6 — Git & GitHub Professional Workflow
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Beginner

**Description:** `git init`, `add`, `commit`, `push`, branching, merging, pull requests. Feature branch workflow. Writing good commit messages. `.gitignore` — especially for `.env` files.

**Practical Output:** Set up a proper Git repo for your bio page project. Create 5+ descriptive commits. Use a feature branch to add a new section. Open and merge a PR on GitHub. Add a `.gitignore` that excludes `node_modules` and `.env`.

**Skills Unlocked:**
- Git (`tool`) — `intermediate`
- GitHub (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Git & GitHub Crash Course — Traversy Media — https://www.youtube.com/watch?v=SWYqp7iY_Tc
- [ARTICLE] Git — the simple guide — https://rogerdudler.github.io/git-guide/
- [INTERNAL_TEXT] Never commit `.env` files. This is the single most important Git habit for full-stack developers — `.env` files contain database passwords and API secrets. If they end up on GitHub (even privately), they're compromised. Add `.env` to `.gitignore` on every project before the first commit. Use `.env.example` to document which variables are needed without exposing their values.

---

### Topic 1.7 — PROJECT: Static Portfolio Page
**Type:** Project (Milestone)
**Difficulty:** Beginner
**Estimated Time:** 4–6 hrs

**Description:** Build and deploy a personal portfolio page using HTML, Tailwind CSS, and vanilla JavaScript. Every full-stack developer starts somewhere. This is your starting point — a real URL, a real GitHub repo, and a page that fetches real data. It's deliberately simple so you can focus on the process: write → commit → deploy → iterate.

**Learning Objectives:**
- Build a structured, responsive HTML page styled with Tailwind utility classes
- Fetch and display live data from a public API using the Fetch API
- Establish a proper Git commit workflow from day one
- Deploy a site to a live URL through a CI/CD-connected platform

**Requirements:**
- Semantic HTML throughout
- Tailwind CSS for all styling
- Responsive on mobile and desktop
- A projects section (placeholder cards for now — you'll fill it as you build)
- A working contact form using Formspree (no backend yet)
- Fetches and displays data from one public API (e.g. GitHub profile stats via GitHub API)
- Clean Git history (5+ commits) on GitHub
- Deployed live on Vercel or Netlify

**Evaluation Criteria:**
- HTML uses semantic elements correctly — no `<div>` where semantic alternatives exist
- Tailwind used for all styling — no separate CSS file unless necessary for global resets
- API fetch works and displays real data (not hardcoded mock)
- Git history shows at least 5 meaningful commits — not a single "initial commit"
- Deployed URL is live and loads correctly
- Form submits without error (Formspree confirmation received)

**Stretch Goals:**
- Add a skills section with animated progress bars (CSS only)
- Pull your latest GitHub repos via the GitHub API and render them as project cards
- Add a theme toggle (dark/light) that persists in localStorage

**Employer Signal:** A public GitHub repo with clean commits and a live deployed URL tells a hiring team you understand the basics of professional software delivery — version control, deployment, and working with external APIs.

**Skills Demonstrated:**
- HTML (`language`) — `beginner`
- CSS (`language`) — `intermediate`
- Tailwind CSS (`framework_library`) — `beginner`
- JavaScript (`language`) — `intermediate`
- Git (`tool`) — `intermediate`
- Vercel (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Build a Portfolio Website — Traversy Media — https://www.youtube.com/watch?v=xV7S8BhIeBo
- [ARTICLE] Formspree — free HTML form backend — https://formspree.io
- [INTERNAL_TEXT] This portfolio will grow throughout the entire path. Every project you build gets added here. By Stage 8, it will be a real, full-stack portfolio app — but it starts here as a simple static page. Ship it now, improve it later.

---

## Stage 2 — React & Frontend Fundamentals
**Tagline:** Build component-driven UIs — the way every modern frontend team works.
**Duration:** ~3 weeks

---

### Topic 2.1 — React: Components, Props & JSX
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Why React? Component-based architecture. JSX. Create a React app with Vite. Reusable components. Props: passing and receiving data down the tree.

**Practical Output:** Rebuild your portfolio page as a React app. Break it into components: `<Navbar>`, `<Hero>`, `<ProjectCard>`, `<Footer>`. Make `<ProjectCard>` data-driven via props.

**Skills Unlocked:**
- React (`framework_library`) — `beginner`
- Vite (`tool`) — `beginner`

**Resources:**
- [VIDEO] React Crash Course — Traversy Media — https://www.youtube.com/watch?v=w7ejDZ8SWv8
- [ARTICLE] Your first component — React Docs — https://react.dev/learn/your-first-component
- [INTERNAL_TEXT] React's mental model: UI is a function of data. Instead of imperatively manipulating the DOM (`document.querySelector('.card').textContent = 'new'`), you declare what the UI should look like given some data, and React handles the DOM updates. This is the shift from imperative to declarative programming — and it's the biggest conceptual jump in this path.

---

### Topic 2.2 — State, useState & useEffect
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** `useState` for local component state. Re-render cycle. Controlled inputs. `useEffect` for side effects and data fetching. Dependency array. Loading and error states.

**Practical Output:** Build a GitHub profile viewer in React — search a username, fetch from the GitHub API with `useEffect`, show avatar, name, bio, repo count. Handle loading and not-found states.

**Skills Unlocked:**
- React (`framework_library`) — `beginner` → `intermediate`
- REST API consumption (`practice`) — `intermediate`

**Resources:**
- [VIDEO] useState & useEffect — Web Dev Simplified — https://www.youtube.com/watch?v=O6P86uwfdR0
- [ARTICLE] State: a component's memory — React Docs — https://react.dev/learn/state-a-components-memory
- [INTERNAL_TEXT] `useState` and `useEffect` are the two most important hooks. 90% of React apps are built with just these two. The pattern: `useState` holds data that changes, `useEffect` runs side effects (fetching, timers, subscriptions) after render. Master these before touching any other hooks.

---

### Topic 2.3 — React Router & Multi-Page Apps
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** React Router v6. `<Routes>`, `<Route>`, `<Link>`, `useNavigate`, `useParams`. Dynamic routes. Nested routing.

**Practical Output:** Add pages to your GitHub viewer: a home `/` search page and a `/user/:username` detail page. Clicking a user card navigates to their full profile.

**Skills Unlocked:**
- React (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] React Router v6 — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9iVKmtNuCeIswnQ97in2GGf
- [ARTICLE] React Router Tutorial — https://reactrouter.com/en/main/start/tutorial
- [INTERNAL_TEXT] React Router makes single-page apps behave like multi-page ones — the browser URL changes and the browser back/forward buttons work, but the page never fully reloads. `useParams` extracts dynamic route segments (e.g. `/user/torvalds` → `{ username: 'torvalds' }`). This hook pattern is exactly how full-stack apps pass IDs between frontend routes and backend API calls.

---

### Topic 2.4 — TypeScript for React
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** TypeScript basics: types, interfaces, generics. Typing React props, state, and API responses. Converting a JavaScript React project to TypeScript. No `any`.

**Practical Output:** Convert your GitHub viewer to TypeScript. Define interfaces for the GitHub API response. Every component should have typed props. Compile with 0 errors.

**Skills Unlocked:**
- TypeScript (`language`) — `beginner`

**Resources:**
- [VIDEO] TypeScript Crash Course — Traversy Media — https://www.youtube.com/watch?v=BCg4U1FzODs
- [ARTICLE] TypeScript Handbook — https://www.typescriptlang.org/docs/handbook/intro.html
- [INTERNAL_TEXT] TypeScript is non-negotiable in 2026 for full-stack development. The main benefit: type errors catch bugs at development time rather than at runtime in production. For full-stack devs, TypeScript is doubly valuable because you can share types between frontend and backend — define a `User` type once, use it in your React component AND your Express route handler.

---

### Topic 2.5 — Forms, Validation & Context API
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Controlled forms in React. React Hook Form for complex validation. Context API for global state (theme, auth). localStorage persistence.

**Practical Output:** Build a multi-step job application form with validation (React Hook Form). Add a dark/light mode toggle using Context that persists in localStorage.

**Skills Unlocked:**
- React (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] React Hook Form — Web Dev Simplified — https://www.youtube.com/watch?v=R_Pj593TH_Q
- [ARTICLE] React Hook Form Docs — https://react-hook-form.com/get-started
- [INTERNAL_TEXT] Form handling is where frontend and backend meet — every form submission eventually becomes an HTTP request to your server. Getting form validation right on the frontend (before the server even sees the data) is both a better UX and a security principle called defence in depth. Your backend should still validate everything — but good frontend validation catches obvious errors instantly without a round trip.

---

### Topic 2.6 — Next.js: SSR, App Router & API Routes
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** Next.js App Router. Server Components vs Client Components. File-based routing. `fetch` with caching. Dynamic routes. Next.js API routes as a simple backend. SEO with `metadata`.

**Practical Output:** Rebuild your GitHub viewer in Next.js — data fetched server-side (better SEO), dynamic route `/user/[username]`, and a simple API route `/api/users/[username]` that fetches from GitHub and returns cleaned data.

**Skills Unlocked:**
- Next.js (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] Next.js 14 Crash Course — Traversy Media — https://www.youtube.com/watch?v=ZVnjOPwW4ZA
- [ARTICLE] Next.js — Getting Started — https://nextjs.org/docs/getting-started/installation
- [INTERNAL_TEXT] Next.js bridges the frontend/backend divide beautifully. Its API routes (`app/api/...`) let you write server-side logic — database queries, external API calls with hidden keys, server actions — inside the same codebase as your React components. For many small full-stack apps, Next.js alone replaces a separate Express server. You'll learn Express separately in Stage 3 because understanding the fundamentals of a web server matters — but in practice, many teams use Next.js for everything.

---

### Topic 2.7 — PROJECT: Frontend-Only SPA
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–10 hrs

**Description:** Build a fully-featured, multi-page single-page application in Next.js with TypeScript and Tailwind. This is your last purely frontend project — from Stage 3 onward, everything has a backend. Make it count: a finished, deployed app with a real use case you'd actually open again.

**Suggested Ideas (learner picks one):**
- Movie discovery app (TMDB API)
- Recipe finder (Spoonacular API)
- Crypto dashboard (CoinGecko API — free)
- Tech news aggregator (NewsAPI)

**Learning Objectives:**
- Build a multi-page Next.js app with dynamic routing and real API data
- Write TypeScript across an entire project — not just in isolated examples
- Protect an API key by routing requests through a Next.js API route
- Handle loading, error, and empty states on all async data fetches

**Requirements:**
- Next.js with App Router + TypeScript (0 `any`)
- Tailwind CSS throughout
- At least 3 pages with dynamic routing
- One Next.js API route (to hide an API key server-side)
- Search, filter, or sort functionality
- Loading and error states on all data fetches
- Responsive + accessible (>85 Lighthouse accessibility score)
- Deployed on Vercel with a clean README

**Evaluation Criteria:**
- TypeScript used correctly throughout — no `any`, API responses are typed
- API key is server-side only — not visible in client-side code or the public repo
- Dynamic routes work via direct URL access (not just internal navigation)
- Loading state shown while fetch is in progress, error state shown on failure
- Search/filter/sort is functional and doesn't break on edge cases (empty results, special characters)
- Lighthouse accessibility score >85 on deployed URL

**Stretch Goals:**
- Add a favorites system with localStorage persistence
- Add infinite scroll or pagination on a data-heavy page
- Write at least 3 unit tests for utility functions using Vitest

**Employer Signal:** A deployed Next.js app with TypeScript, protected API keys, and proper async state handling shows you understand the client-server boundary — the core concept every full-stack developer must internalize.

**Skills Demonstrated:**
- React (`framework_library`) — `advanced`
- Next.js (`framework_library`) — `intermediate`
- TypeScript (`language`) — `beginner`
- Tailwind CSS (`framework_library`) — `beginner`
- REST API consumption (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Build a Full Next.js App — Traversy Media — https://www.youtube.com/watch?v=wm5gMKuwSYk
- [ARTICLE] Next.js App Router Guide — https://nextjs.org/docs/app/building-your-application
- [INTERNAL_TEXT] This is the last purely frontend project you'll build. From Stage 3 onward, everything has a backend. Notice as you build this: where does it feel fragile? Where do you wish you controlled the data instead of depending on a third-party API? Those are exactly the problems your own backend will solve.

---

## Stage 3 — Node.js & Backend Basics
**Tagline:** Build the server. Understand what happens on the other side of every API call.
**Duration:** ~3 weeks

---

### Topic 3.1 — Node.js Fundamentals
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** What is Node.js? The event loop and non-blocking I/O. Running JS on the server. Node's built-in modules: `fs`, `path`, `os`, `http`. `npm` and `package.json`. `nodemon` for auto-restart.

**Practical Output:** Build a CLI tool in Node.js that reads a directory, lists all `.js` files with their sizes, and writes a report to a `report.txt` file. No frameworks — just Node's built-in modules.

**Skills Unlocked:**
- Node.js (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Node.js Crash Course — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9jszkrzs8tLD_WEEQBpKmqN
- [ARTICLE] Introduction to Node.js — Node.js Docs — https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
- [INTERNAL_TEXT] Node.js is JavaScript running outside the browser — on a server, a machine, or the command line. It uses the same language you already know, but with access to the file system, network sockets, and system resources. The key concept: Node is single-threaded but non-blocking. It handles thousands of concurrent connections by delegating I/O to the operating system and continuing to run other code while waiting. This is why Node.js powers high-traffic APIs at Netflix, LinkedIn, and Uber.

---

### Topic 3.2 — Express.js: Routing & Middleware
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** Express.js setup. Routes: `GET`, `POST`, `PUT`, `DELETE`. Route parameters and query strings. Middleware: what it is, how it chains. Built-in middleware: `express.json()`, `express.static()`. Custom middleware (logger, error handler).

**Practical Output:** Build a simple Express server with 5 routes: get all items, get one by ID, create, update, delete. Data stored in memory (no database yet). Test every route with Thunder Client or Postman.

**Skills Unlocked:**
- Express.js (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] Express.js Crash Course — Traversy Media — https://www.youtube.com/watch?v=L72fhGm1tfE
- [ARTICLE] Express.js — Getting Started — https://expressjs.com/en/starter/installing.html
- [INTERNAL_TEXT] Express is minimal by design — it gives you routing and middleware, nothing else. Every other feature (database access, authentication, validation, logging) you add yourself or via npm packages. This makes it flexible but requires you to make decisions. Middleware is the key concept: a middleware function runs between receiving a request and sending a response. Authentication, logging, body parsing, error handling — all of these are middleware functions that run in sequence.

---

### Topic 3.3 — REST API Design Principles
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** REST constraints and conventions. Resource naming (nouns, plural). HTTP methods mapped to CRUD. Status codes (200, 201, 400, 401, 403, 404, 409, 500). Request/response structure. API versioning basics.

**Practical Output:** Refactor your Express server from Topic 3.2 to follow REST conventions properly: correct HTTP methods, proper status codes for every response, consistent JSON response structure (`{ data: ..., error: null }` or `{ data: null, error: 'message' }`).

**Skills Unlocked:**
- REST API design (`practice`) — `beginner`
- Express.js (`framework_library`) — `beginner`

**Resources:**
- [VIDEO] REST API Design Best Practices — Web Dev Simplified — https://www.youtube.com/watch?v=-MTSQjw5DrM
- [ARTICLE] RESTful API Design — restfulapi.net — https://restfulapi.net/
- [INTERNAL_TEXT] REST is a set of conventions, not a strict protocol. The most important ones: use nouns in URLs (not verbs) — `/users`, not `/getUsers`. Use HTTP methods for the action — `GET /users` lists, `POST /users` creates, `PUT /users/1` updates, `DELETE /users/1` deletes. Always return consistent JSON structure. Always use correct status codes — a `200` response with `{ error: 'not found' }` is worse than a `404`. Your frontend code depends on these contracts being reliable.

---

### Topic 3.4 — Input Validation & Error Handling
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Why validate on the server (never trust client input). Zod for TypeScript-first schema validation. Validating request body, params, and query. Global error handling middleware in Express. Distinguishing operational errors from programmer errors.

**Practical Output:** Add Zod validation to every route in your Express server. Add a global error handler middleware. Test with invalid inputs — confirm you get structured `400` errors, not crashes or leaked stack traces.

**Skills Unlocked:**
- Express.js (`framework_library`) — `intermediate`
- REST API design (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Zod Validation Tutorial — Web Dev Simplified — https://www.youtube.com/watch?v=L6BE-U3oy80
- [ARTICLE] Zod Documentation — https://zod.dev/
- [INTERNAL_TEXT] Never trust data from the client. Ever. A user can send any JSON they want to your API — wrong types, missing fields, SQL injection strings, excessively long strings. Zod lets you define the exact shape of valid input and throws a structured error when anything doesn't match. The global error handler catches those errors and sends a `400` response before the bad data reaches your database. This is your first line of defence in backend security.

---

### Topic 3.5 — TypeScript on the Backend
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Set up TypeScript in an Express project. Type Express request/response objects. Type middleware. Share types between frontend and backend. `tsconfig.json` for Node.js.

**Practical Output:** Migrate your Express server to TypeScript. Type every route handler, middleware, and request/response. Fix all type errors.

**Skills Unlocked:**
- TypeScript (`language`) — `beginner` → `intermediate`
- Express.js (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] TypeScript with Express — Traversy Media — https://www.youtube.com/watch?v=qy8PxD3alWw
- [ARTICLE] TypeScript + Node.js — Node.js Docs — https://nodejs.org/en/learn/getting-started/nodejs-with-typescript
- [INTERNAL_TEXT] TypeScript on the backend gives you the same benefits as on the frontend — type safety, autocomplete, refactoring confidence — but the Node.js setup is slightly different. You need `ts-node` (or `tsx`) to run `.ts` files directly, and a `tsconfig.json` configured for Node (not the browser). The biggest win of full-stack TypeScript: define your types once in a shared package or file and import them in both your frontend and backend. When your API changes shape, TypeScript tells you everywhere that breaks.

---

### Topic 3.6 — Environment Variables & Configuration
**Type:** Lesson + Practice
**Estimated Time:** 1 hr
**Difficulty:** Beginner

**Description:** `.env` files and `dotenv`. Environment-specific config (development vs production). What goes in `.env` vs hardcoded config. `process.env` access patterns. Validating required env vars on startup.

**Practical Output:** Add proper environment variable management to your Express server — a `config.ts` file that reads and validates all required env vars on startup. The app should crash with a clear error if a required variable is missing, not fail silently at request time.

**Skills Unlocked:**
- Node.js (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] dotenv & Environment Variables — Web Dev Simplified — https://www.youtube.com/watch?v=17UVejOw3zA
- [ARTICLE] dotenv — npm — https://www.npmjs.com/package/dotenv
- [INTERNAL_TEXT] Environment variables are how you configure an application without hardcoding secrets. Database URL, JWT secret, API keys, port number — all of these change between environments (your laptop vs a production server). Never commit a `.env` file. Validate env vars on startup so the app fails fast with a clear error rather than crashing later on first use. A common pattern: use Zod to parse and validate `process.env` into a typed config object.

---

### Topic 3.7 — PROJECT: REST API Server
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–12 hrs

**Description:** Build a complete, well-structured REST API server in Node.js + Express + TypeScript. Data stored in memory (arrays) — database comes in Stage 4. This project is about server architecture, not data persistence. By keeping the storage simple, you stay focused on what matters: correct REST design, input validation, and error handling.

**Learning Objectives:**
- Design a RESTful API with proper resource naming, HTTP methods, and status codes
- Validate all incoming request data with Zod before it touches any business logic
- Build a global error handling middleware that catches and formats all errors consistently
- Document an API clearly enough that someone else could use it from the README alone

**Requirements (pick a domain — e.g. a blog, a job board, or an inventory system):**
- At least 3 resources (e.g. Users, Posts, Comments) with full CRUD
- Proper REST conventions: correct HTTP methods, status codes, resource URLs
- Request validation with Zod on every route
- TypeScript throughout (0 `any`)
- Global error handler middleware
- Environment variables via `.env` + `dotenv`
- Tested manually — all routes verified in Thunder Client or Postman with a saved collection
- GitHub repo with clean commits and a README documenting every endpoint

**Evaluation Criteria:**
- REST conventions are correct: `GET /posts`, `POST /posts`, `GET /posts/:id`, `PUT /posts/:id`, `DELETE /posts/:id` — no verb-in-URL patterns
- Every route has Zod validation — no unvalidated user input reaches business logic
- HTTP status codes are correct: 200 vs 201 vs 204, 400 vs 404 vs 409 vs 500
- Global error handler catches all thrown errors — no unhandled promise rejections
- TypeScript is used correctly across all route handlers and middleware
- README documents all endpoints: method, URL, request body schema, response shape, and status codes

**Stretch Goals:**
- Add request logging middleware (log method, URL, status, response time on every request)
- Add rate limiting on POST routes using `express-rate-limit`
- Add a Postman collection JSON file to the repo so evaluators can import and test instantly

**Employer Signal:** A well-documented REST API with correct HTTP conventions, Zod validation, and a global error handler shows you understand server-side architecture fundamentals — not just "Express exists."

**Skills Demonstrated:**
- Node.js (`platform_service`) — `beginner`
- Express.js (`framework_library`) — `intermediate`
- REST API design (`practice`) — `intermediate`
- TypeScript (`language`) — `intermediate`

**Resources:**
- [VIDEO] Build a REST API with Node.js — Traversy Media — https://www.youtube.com/watch?v=BDo1lgaZuII
- [ARTICLE] Express routing guide — https://expressjs.com/en/guide/routing.html
- [INTERNAL_TEXT] This server has no database yet — all data lives in memory and disappears when the server restarts. That's intentional. Building the API logic first, without database complexity, forces you to focus on route design, validation, and error handling. In Stage 4 you swap the in-memory arrays for real database calls — the route handlers barely change.

---

## Stage 4 — Databases with PostgreSQL & Prisma
**Tagline:** Make data permanent. Learn to model, query, and manage a real database.
**Duration:** ~3 weeks

---

### Topic 4.1 — Relational Databases & SQL Basics
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** What is a relational database? Tables, columns, rows, primary keys, foreign keys. SQL basics: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `WHERE`, `ORDER BY`, `LIMIT`. Joins: `INNER JOIN`, `LEFT JOIN`. Install PostgreSQL locally. Use pgAdmin or TablePlus.

**Practical Output:** Design a schema for a blog (users, posts, comments). Create the tables in PostgreSQL. Insert 10 rows of seed data. Write 5 SQL queries: get all posts by a user, get post with comments count, find posts published in the last 7 days.

**Skills Unlocked:**
- SQL (`language`) — `beginner`
- PostgreSQL (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] SQL & PostgreSQL for Beginners — freeCodeCamp — https://www.youtube.com/watch?v=qw--VYLpxG4
- [ARTICLE] PostgreSQL Tutorial — https://www.postgresqltutorial.com/
- [INTERNAL_TEXT] SQL is the most durable skill in this entire path. JavaScript frameworks come and go, but SQL has been the standard for relational databases since the 1970s and remains dominant today. Every company with real data uses SQL. Understanding joins is the critical skill — a `LEFT JOIN` between users and their posts, including users with no posts, is the kind of query you'll write every day in production.

---

### Topic 4.2 — Prisma ORM: Schema & Migrations
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** What is an ORM? Prisma setup with PostgreSQL. `schema.prisma`: models, field types, relations. `prisma migrate dev` to create and manage migrations. Prisma Studio for visual data inspection.

**Practical Output:** Translate your blog schema from Topic 4.1 into a `schema.prisma` file with proper relations (User → Posts → Comments). Run your first migration. Open Prisma Studio and verify the tables were created correctly.

**Skills Unlocked:**
- Prisma (`framework_library`) — `beginner`
- PostgreSQL (`platform_service`) — `beginner`

**Resources:**
- [VIDEO] Prisma Crash Course — Traversy Media — https://www.youtube.com/watch?v=CYH04BJzamo
- [ARTICLE] Prisma — Getting Started — https://www.prisma.io/docs/getting-started
- [INTERNAL_TEXT] Prisma replaces raw SQL in your Node.js code with a type-safe API. Instead of writing `SELECT * FROM users WHERE id = $1`, you write `prisma.user.findUnique({ where: { id } })`. Prisma generates TypeScript types directly from your schema — so if you query a `User`, you get autocomplete for every field. Migrations track schema changes over time, like Git for your database — critical for teams and production deployments.

---

### Topic 4.3 — CRUD Operations with Prisma Client
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Prisma Client: `findMany`, `findUnique`, `create`, `update`, `delete`. Filtering with `where`. Selecting specific fields. Including related data (`include`). Pagination with `take` and `skip`.

**Practical Output:** Replace all in-memory array operations in your REST API (from Stage 3) with Prisma queries to your PostgreSQL database. Test each endpoint — data should now persist between server restarts.

**Skills Unlocked:**
- Prisma (`framework_library`) — `beginner` → `intermediate`
- PostgreSQL (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] Prisma CRUD Tutorial — The Net Ninja — https://www.youtube.com/playlist?list=PL4cUxeGkcC9jczav-YzFChkiUKQ9sNSb4
- [ARTICLE] Prisma CRUD — https://www.prisma.io/docs/orm/prisma-client/queries/crud
- [INTERNAL_TEXT] This is a pivotal moment: your API now persists data. The route handlers barely changed — you replaced `array.push(item)` with `await prisma.post.create({ data: item })`. This is the power of a clean API layer between your routes and your data source. The route doesn't care whether data comes from an array, a database, or a cache — it just calls a function and gets data back.

---

### Topic 4.4 — Database Relations & Advanced Queries
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** One-to-many and many-to-many relations in Prisma. `include` for eager loading. Nested writes (`create` with related data in one query). Transactions for multi-step operations. Filtering on related models.

**Practical Output:** Add a `tags` system to your blog — posts can have many tags, tags can belong to many posts (many-to-many). Implement `POST /posts` that creates a post AND connects tags in a single Prisma transaction. Add `GET /posts?tag=javascript` filtering.

**Skills Unlocked:**
- Prisma (`framework_library`) — `intermediate`
- SQL (`language`) — `intermediate`

**Resources:**
- [VIDEO] Prisma Relations — Web Dev Simplified — https://www.youtube.com/watch?v=RebA5J-rlwg
- [ARTICLE] Prisma Relations — https://www.prisma.io/docs/orm/prisma-schema/data-model/relations
- [INTERNAL_TEXT] Real-world data is relational. A post has an author, comments, and tags. Getting a post with its author name and comment count in a single query is standard in production. Without proper relation handling, you'd make 3 separate queries for what Prisma does in one. Understanding when to use `include` (eager load — get everything now) vs separate queries (lazy load — fetch only when needed) is a performance decision you'll make constantly.

---

### Topic 4.5 — Database Seeding & Migrations in Production
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Writing a Prisma seed script. Running seeds in development. Migration strategies for production (never `prisma migrate dev` in prod). Using `prisma migrate deploy`. Managing migration history.

**Practical Output:** Write a seed script that populates your database with realistic fake data using Faker.js (3 users, 10 posts each, 30 comments). Document the migration and seeding workflow in your README.

**Skills Unlocked:**
- Prisma (`framework_library`) — `intermediate`
- PostgreSQL (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] Prisma Seed Data — Traversy Media — https://www.youtube.com/watch?v=7dpNJEkAo0Q
- [ARTICLE] Prisma Seeding — https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
- [INTERNAL_TEXT] Seed scripts are your database's "factory reset" — they populate a fresh database with enough realistic data to develop and test against. Without seeds, every new dev on your team has to manually create test data. Migrations track every schema change in version control. The rule: `prisma migrate dev` creates migrations and applies them in development; `prisma migrate deploy` applies pre-created migrations in production — never generate new migrations in prod.

---

### Topic 4.6 — PROJECT: Database-Backed API
**Type:** Project (Milestone)
**Difficulty:** Intermediate
**Estimated Time:** 8–12 hrs

**Description:** Extend your Stage 3 REST API with a real PostgreSQL database via Prisma. This is where the API becomes real — not because it's more complex, but because the data actually persists. You'll also encounter the messiness that a real database introduces: migrations, relations, seed data, and pagination.

**Learning Objectives:**
- Design a relational database schema with multiple models and meaningful relations
- Use Prisma to perform all CRUD operations including filtering, including relations, and pagination
- Write and run database migrations that are safe to commit and deploy
- Seed a database with realistic fake data using Faker.js

**Requirements:**
- PostgreSQL + Prisma with at least 3 models and 2 relations
- Full CRUD for all resources, all backed by real database queries
- At least one many-to-many relation with filtering
- Seed script with realistic fake data (Faker.js)
- Input validation with Zod
- TypeScript throughout
- Pagination on all list endpoints (`?page=1&limit=10`)
- Database migrations committed to the repo

**Evaluation Criteria:**
- Prisma schema defines relations correctly — foreign keys, `@relation` attributes, join tables for many-to-many
- Seed script populates all models with realistic data and runs cleanly from `prisma db seed`
- All list endpoints support pagination (`page` + `limit` query params) and return total count
- Many-to-many filtering works correctly (e.g. filter posts by tag, filter users by role)
- Zod schemas match the Prisma model shapes — no fields validated that don't exist in DB
- Migrations are committed and migration history is clean

**Stretch Goals:**
- Add a search endpoint with PostgreSQL full-text search (`pg_trgm` extension or Prisma `contains`)
- Add soft delete (`deletedAt` timestamp) instead of hard delete on at least one model
- Add a migration that alters an existing table (add a column, change a constraint)

**Employer Signal:** Database modeling and ORM proficiency is the #1 differentiator between frontend developers who "also do some backend" and actual full-stack developers. A clean Prisma schema with proper relations, migrations, and seed data shows you understand data architecture.
- All endpoints documented in README
- Deployed on Railway or Render (free tier) with a hosted PostgreSQL instance

**Skills Demonstrated:**
- Prisma (`framework_library`) — `intermediate`
- PostgreSQL (`platform_service`) — `intermediate`
- SQL (`language`) — `intermediate`
- Express.js (`framework_library`) — `intermediate`
- REST API design (`practice`) — `intermediate`

**Resources:**
- [VIDEO] Deploy Node.js + PostgreSQL to Railway — Traversy Media — https://www.youtube.com/watch?v=QXxy8Uv1LnQ
- [ARTICLE] Railway — Deploy a PostgreSQL app — https://docs.railway.app/guides/postgresql
- [INTERNAL_TEXT] Railway and Render both offer free PostgreSQL databases — they're the fastest way to get a real hosted database without touching AWS. The production URL will look like `postgresql://user:pass@host:port/dbname`. Store it in your Railway environment variables, never in code. This is your first live backend API — share the URL with someone and have them make real requests.

---

## Stage 5 — Authentication & Security
**Tagline:** Build the system that protects your users. Understand auth from the ground up.
**Duration:** ~2.5 weeks

---

### Topic 5.1 — Authentication vs Authorization & Password Hashing
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Authentication (who are you?) vs authorization (what can you do?). Password storage: why plain text is catastrophic, what hashing is, why salting matters. Implement `bcrypt` for password hashing.

**Practical Output:** Add a `User` model to your Prisma schema. Build `POST /auth/register` — accept email + password, hash the password with bcrypt (10 salt rounds), store the hash. Never store or return the plain password. Test that the stored value looks nothing like the original.

**Skills Unlocked:**
- Authentication (`practice`) — `beginner`
- Node.js (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] Password Hashing with bcrypt — Web Dev Simplified — https://www.youtube.com/watch?v=AzA_LTDoFqY
- [ARTICLE] How bcrypt works — Auth0 Blog — https://auth0.com/blog/hashing-in-action-understanding-bcrypt/
- [INTERNAL_TEXT] Passwords must never be stored in plain text. Even in encrypted form. The reason: if your database is breached, you want an attacker to have useless hashes rather than real passwords. Bcrypt is a one-way hashing function with a configurable work factor — as computers get faster, you increase the work factor to keep brute-forcing expensive. 10 salt rounds is the minimum for new projects in 2026; 12 is better for sensitive applications.

---

### Topic 5.2 — JWT Authentication: Login & Protected Routes
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** How JWT works: header, payload, signature. Signing a token on login. Verifying a token on protected routes. Auth middleware. Access tokens and refresh tokens. Token expiry.

**Practical Output:** Build `POST /auth/login` — verify credentials, sign a JWT containing `userId`. Build an auth middleware that reads the `Authorization: Bearer <token>` header, verifies the JWT, and attaches `req.user` to the request. Protect `GET /me` with this middleware.

**Skills Unlocked:**
- Authentication (`practice`) — `intermediate`
- Express.js (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] JWT Authentication — Web Dev Simplified — https://www.youtube.com/watch?v=mbsmsi7l3r4
- [ARTICLE] JWT Introduction — https://jwt.io/introduction
- [INTERNAL_TEXT] A JWT is three Base64-encoded JSON objects joined by dots: `header.payload.signature`. The server signs the token with a secret key — if anyone tampers with the payload, the signature won't match and verification fails. JWTs are stateless: the server doesn't store them. This means you can't invalidate a single token without a blocklist — which is why short expiry times (15 minutes for access tokens, 7 days for refresh tokens) are important.

---

### Topic 5.3 — Refresh Tokens & Secure Token Storage
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** Access token vs refresh token pattern. Storing refresh tokens in the database. Rotating refresh tokens on each use. `POST /auth/refresh`. Secure cookie storage (HttpOnly, Secure, SameSite). Logout: invalidating refresh tokens.

**Practical Output:** Implement the full access + refresh token flow. Access tokens expire in 15 minutes. Refresh tokens are stored hashed in the database. `POST /auth/refresh` returns a new access token (and rotates the refresh token). `POST /auth/logout` deletes the refresh token from the database.

**Skills Unlocked:**
- Authentication (`practice`) — `intermediate` → `advanced`

**Resources:**
- [VIDEO] Refresh Token Implementation — Web Dev Simplified — https://www.youtube.com/watch?v=s-4k5TcGKHg
- [ARTICLE] JWT Refresh Tokens — Best Practices — https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/
- [INTERNAL_TEXT] The access/refresh token pattern exists because short-lived access tokens are more secure (less damage if leaked) but require refresh tokens for a good UX (so users aren't logged out every 15 minutes). The refresh token is stored hashed in the database — only the hash, never the raw token. When `POST /auth/refresh` is called, you hash the incoming token and compare it to the stored hash, just like password verification. Token rotation on refresh means a stolen refresh token can only be used once before it's invalidated.

---

### Topic 5.4 — Role-Based Authorization (RBAC)
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** User roles (admin, user, moderator). Role field in the User model. Authorization middleware that checks roles. Protecting routes by role. Returning `403 Forbidden` vs `401 Unauthorized`.

**Practical Output:** Add a `role` field (ENUM: `user` | `admin`) to the User model. Add a `requireRole('admin')` middleware. Protect admin-only routes (e.g. `DELETE /users/:id`, `GET /admin/stats`) with it. Test that a regular user gets a `403`, not a `401`.

**Skills Unlocked:**
- Authentication (`practice`) — `advanced`

**Resources:**
- [VIDEO] Role-Based Access Control — Web Dev Simplified — https://www.youtube.com/watch?v=jI4K7L-LI58
- [ARTICLE] RBAC — Auth0 Docs — https://auth0.com/docs/manage-users/access-control/rbac
- [INTERNAL_TEXT] 401 Unauthorized means "you're not logged in." 403 Forbidden means "you're logged in but you don't have permission." Using the wrong code confuses clients and leaks information about your system. RBAC (Role-Based Access Control) is the most common authorization pattern: every user has a role, and roles grant access to resources. Keep roles simple at first — `user` and `admin` covers most apps. Avoid the temptation to create roles for every possible permission level.

---

### Topic 5.5 — PROJECT: Auth System
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 8–12 hrs

**Description:** Build a complete, production-grade authentication system and integrate it into your Stage 4 API. Authentication is the most security-critical code you'll write in this path. A bug here doesn't break a feature — it exposes every user's account. This project is deliberately strict about implementation quality.

**Learning Objectives:**
- Implement the full access + refresh token lifecycle: issue, verify, rotate, and invalidate
- Store passwords and refresh tokens as hashes — never as plain text or reversible values
- Write auth middleware that cleanly separates authentication from authorization
- Document an auth flow clearly enough that a frontend developer can integrate it from the README alone

**Requirements:**
- `POST /auth/register` — email + password, hashed with bcrypt
- `POST /auth/login` — returns access token (15 min) + refresh token (7 days, stored in DB as hash)
- `POST /auth/refresh` — issues new access token, rotates refresh token
- `POST /auth/logout` — invalidates refresh token in DB
- `GET /me` — returns current user (auth required)
- Auth middleware applied to all routes that need it
- Role-based access (`user` and `admin` roles) on at least 2 admin-only routes
- Input validation with Zod on all auth routes
- All tokens use environment variable secrets (not hardcoded)
- README documents the full auth flow with example requests

**Evaluation Criteria:**
- Passwords are hashed with bcrypt (work factor ≥10) — no plain text storage anywhere
- Refresh tokens are stored as hashed values in the DB — the raw token is never persisted
- Token rotation is implemented: using a refresh token invalidates it and issues a new one
- Auth middleware attaches `req.user` and returns 401 if token is missing or invalid
- RBAC middleware returns 403 (not 401) for authenticated users who lack the required role
- No secrets, API keys, or tokens appear in the GitHub repo (checked via `.env.example` pattern)

**Stretch Goals:**
- Add email verification on register (use Resend or Nodemailer with Mailtrap for testing)
- Add rate limiting on auth routes (max 5 login attempts per IP per minute)
- Add a `GET /admin/users` endpoint with pagination that only admins can access

**Employer Signal:** A correctly implemented JWT auth system with bcrypt, token rotation, and RBAC is the standard authentication pattern at most companies. Demonstrating you can build it securely — not just functionally — is the difference between a junior and a developer who can be trusted with user data.

**Skills Demonstrated:**
- Authentication (`practice`) — `advanced`
- Express.js (`framework_library`) — `intermediate`
- Prisma (`framework_library`) — `intermediate`
- Node.js (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] Full Auth System — Node.js + Express + JWT — Traversy Media — https://www.youtube.com/watch?v=enopDSs3DRw
- [ARTICLE] OWASP Authentication Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- [INTERNAL_TEXT] Authentication is the most security-critical code you'll ever write. A bug here doesn't just break a feature — it exposes every user's account. Read the OWASP Authentication Cheat Sheet. It's not long. Every point on it represents a real breach pattern. The fundamentals: hash passwords, use short-lived tokens, validate all input, never log passwords or tokens, use HTTPS in production.

---

## Stage 6 — Full-Stack Integration
**Tagline:** Connect the frontend to the backend. Build your first complete product.
**Duration:** ~3 weeks

---

### Topic 6.1 — Connecting React to Your API
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** CORS configuration in Express. Axios vs fetch in React. Axios interceptors for attaching auth tokens to requests. Handling 401 responses (auto-redirect to login). Environment variables in Next.js for API URLs.

**Practical Output:** Connect your Stage 2 Next.js frontend to your Stage 4 API. Fetch real posts from your database and display them. Add CORS headers to your Express server so the frontend can call it.

**Skills Unlocked:**
- REST API consumption (`practice`) — `advanced`
- Express.js (`framework_library`) — `intermediate`

**Resources:**
- [VIDEO] Axios & CORS — Traversy Media — https://www.youtube.com/watch?v=6LyagkoRWYA
- [ARTICLE] CORS — MDN — https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
- [INTERNAL_TEXT] CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks your frontend from calling an API on a different domain by default. Your backend must explicitly allow requests from your frontend's domain. In development: `cors({ origin: 'http://localhost:3000' })`. In production: `cors({ origin: process.env.FRONTEND_URL })`. Never use `cors({ origin: '*' })` on an API that has authentication — it defeats the purpose.

---

### Topic 6.2 — Auth State in the Frontend
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Storing access tokens in memory (not localStorage). Storing refresh tokens in HttpOnly cookies. Auth Context in React. Persisting auth across page refresh (silent refresh). Protected routes in React Router.

**Practical Output:** Build a full login flow in your Next.js app — login form, store access token in memory, use it for API calls, silent refresh on page load, protected routes redirect unauthenticated users to `/login`.

**Skills Unlocked:**
- React (`framework_library`) — `advanced`
- Authentication (`practice`) — `advanced`

**Resources:**
- [VIDEO] React Auth — Access Tokens + Refresh Tokens — Dave Gray — https://www.youtube.com/watch?v=nI8PYZNFtac
- [ARTICLE] Where to store JWT — Hasura Blog — https://hasura.io/blog/best-practices-of-using-jwt-with-hasura-graphql-engine/
- [INTERNAL_TEXT] The safest place to store an access token is in JavaScript memory — not localStorage (vulnerable to XSS), not a cookie (accessible to JS). The refresh token goes in an HttpOnly cookie — JavaScript can't read it, so XSS can't steal it. On page load or token expiry, make a silent call to `POST /auth/refresh` to get a fresh access token. This pattern is used by major applications including GitHub and Google and is considered best practice in 2026.

---

### Topic 6.3 — File Uploads & Storage
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** Handling file uploads with Multer in Express. Storing files on Cloudinary (free tier). Returning a public URL. Frontend file input and preview. Updating a user's avatar.

**Practical Output:** Add avatar upload to your auth system — `PUT /users/me/avatar` accepts a file, uploads it to Cloudinary, saves the URL in the database. The frontend profile page shows the avatar with a "Change Photo" button.

**Skills Unlocked:**
- Express.js (`framework_library`) — `advanced`
- Node.js (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] File Uploads with Multer & Cloudinary — Traversy Media — https://www.youtube.com/watch?v=ZRCEzDk_MeA
- [ARTICLE] Cloudinary Node.js SDK — https://cloudinary.com/documentation/node_integration
- [INTERNAL_TEXT] Never store uploaded files in your Node.js server's filesystem — servers are ephemeral in production (they restart, scale, and replace themselves). Always store files in a dedicated file storage service: Cloudinary for images/video, AWS S3 for general files. The pattern: receive file in Express (Multer buffers it in memory), upload buffer to Cloudinary, get back a public URL, store that URL in your database. The frontend loads images directly from Cloudinary's CDN — your server is never in the image-serving path.

---

### Topic 6.4 — Real-Time Features with WebSockets
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** HTTP polling vs WebSockets vs Server-Sent Events. Socket.io setup on Express. Emitting and receiving events. Broadcasting to rooms. When to use WebSockets vs REST.

**Practical Output:** Add real-time notifications to your app — when a new comment is posted, connected users see it appear without refreshing. Use Socket.io rooms (one room per post).

**Skills Unlocked:**
- WebSockets (`practice`) — `beginner`
- Node.js (`platform_service`) — `intermediate`

**Resources:**
- [VIDEO] Socket.io Crash Course — Traversy Media — https://www.youtube.com/watch?v=jD7FnbI76Hg
- [ARTICLE] Socket.io Documentation — https://socket.io/docs/v4/
- [INTERNAL_TEXT] WebSockets maintain a persistent connection between client and server — data flows in both directions at any time without the overhead of a new HTTP request. Use WebSockets for: chat, live notifications, collaborative editing, real-time dashboards. Use REST for everything else. Socket.io adds rooms (grouping connections), namespaces (separating concerns), and reconnection logic on top of the raw WebSocket protocol.

---

### Topic 6.5 — Search, Filtering & Pagination
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Full-text search with Prisma (`contains`, `mode: 'insensitive'`). Cursor-based vs offset pagination. Compound filtering (multiple `where` conditions). Sorting. Building a reusable query builder.

**Practical Output:** Add a search endpoint `GET /posts/search?q=javascript&tag=tutorial&page=1&limit=10&sort=newest` to your API. Implement it with Prisma. Build a search bar in your frontend that debounces input and shows paginated results.

**Skills Unlocked:**
- Prisma (`framework_library`) — `advanced`
- REST API design (`practice`) — `advanced`

**Resources:**
- [VIDEO] Pagination & Filtering with Prisma — Web Dev Simplified — https://www.youtube.com/watch?v=oNlMrpnUSFE
- [ARTICLE] Prisma Filtering — https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting
- [INTERNAL_TEXT] Every production API needs search and pagination. Returning all 100,000 posts from `GET /posts` works in development and crashes in production. Offset pagination (`skip` + `take`) is simple but slow on large datasets (the database must scan all skipped rows). Cursor-based pagination is faster for deep pages but harder to implement. Start with offset — switch to cursor when you have performance data showing it matters.

---

### Topic 6.6 — PROJECT: Full-Stack App v1
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 14–20 hrs

**Description:** Build the first version of a complete full-stack application: a Next.js frontend connected to an Express + PostgreSQL backend, with auth, real data, and deployment. Two deployed services, one real product. This is the first project in the path where someone who doesn't know you're a learner can sign up and use what you built.

**Suggested Domain (learner picks one):**
- Blog platform (posts, comments, users, tags)
- Job board (companies, listings, applications)
- Project management tool (boards, tasks, users)
- E-commerce catalog (products, categories, carts)

**Learning Objectives:**
- Connect a Next.js frontend to an Express backend with correct CORS configuration and auth token handling
- Integrate the full JWT auth flow on the frontend: login, token storage, protected routes, silent refresh
- Deploy two separate services (frontend on Vercel, backend on Railway/Render) and make them communicate correctly in production
- Write a monorepo README that links everything together and explains how to run the project locally

**Requirements:**
- Next.js frontend + Express + TypeScript backend as separate projects in a monorepo
- PostgreSQL + Prisma with at least 4 models and meaningful relations
- Full JWT auth (register, login, refresh, logout, protected routes)
- File upload (avatars or images via Cloudinary)
- Search + pagination on at least one resource
- CORS configured correctly
- Auth context in the frontend with protected routes
- Both services deployed (frontend on Vercel, backend on Railway/Render)
- Single README at monorepo root linking to both live URLs

**Evaluation Criteria:**
- Both frontend and backend URLs are live and the app is fully functional end-to-end (registration, login, CRUD operations all work on the deployed version)
- Access token is stored in memory (not localStorage), refresh token in HttpOnly cookie
- CORS is configured to allow only the frontend's domain — not `*`
- File uploads work in production (Cloudinary URL returned and displayed)
- Search and pagination work on the deployed API — not just locally
- README documents: what the app does, how to run it locally, environment variables needed, live URLs

**Stretch Goals:**
- Add real-time features with WebSockets (Socket.io) — notifications, live comment counts
- Add an admin dashboard page with user management (admin role required)
- Write integration tests for at least 3 API endpoints using Supertest

**Employer Signal:** A live full-stack app with two deployed services, JWT auth, file uploads, and a clean monorepo structure is the exact portfolio entry that senior engineers look for when reviewing a junior candidate. It proves you can ship something complete, not just build isolated components.

**Skills Demonstrated:**
- React (`framework_library`) — `advanced`
- Next.js (`framework_library`) — `intermediate`
- Express.js (`framework_library`) — `advanced`
- Prisma (`framework_library`) — `advanced`
- PostgreSQL (`platform_service`) — `intermediate`
- Authentication (`practice`) — `advanced`
- REST API design (`practice`) — `advanced`

**Resources:**
- [VIDEO] Full Stack MERN Project — Traversy Media — https://www.youtube.com/watch?v=7CqJlxBYj-M
- [ARTICLE] Monorepo with npm workspaces — https://docs.npmjs.com/cli/v10/using-npm/workspaces
- [INTERNAL_TEXT] This is a real product. It has a real URL, real users can sign up, and real data persists. The fact that it's a "learning project" doesn't change what it is technically. Ship it, share the URL, and get feedback from real users. Finding out that something doesn't work as expected for a real person is worth more than 10 more hours of tutorial watching.

---

## Stage 7 — DevOps, Deployment & CI/CD
**Tagline:** Ship with confidence. Learn to deploy, monitor, and automate like a professional team.
**Duration:** ~2.5 weeks

---

### Topic 7.1 — Docker: Containerising Your App
**Type:** Lesson + Practice
**Estimated Time:** 2.5 hrs
**Difficulty:** Intermediate

**Description:** What Docker solves ("it works on my machine"). Images vs containers. `Dockerfile` for Node.js. `docker-compose.yml` for multi-service local setup (Node + PostgreSQL). Building and running containers. `.dockerignore`.

**Practical Output:** Write a `Dockerfile` for your Express API. Write a `docker-compose.yml` that starts your API + a PostgreSQL container together. Verify that `docker compose up` starts a fully working local stack with no manual database setup.

**Skills Unlocked:**
- Docker (`tool`) — `beginner`

**Resources:**
- [VIDEO] Docker Crash Course for Beginners — TechWorld with Nana — https://www.youtube.com/watch?v=pg19Z8LL06w
- [ARTICLE] Dockerize a Node.js app — Docker Docs — https://docs.docker.com/guides/nodejs/
- [INTERNAL_TEXT] Docker solves the "works on my machine" problem by packaging your app and all its dependencies into a container — a self-contained, reproducible environment. A new developer can clone your repo, run `docker compose up`, and have a fully working app in minutes with no manual setup. Docker is standard in every company that deploys backend services. Understanding it is non-negotiable for full-stack developers in 2026.

---

### Topic 7.2 — GitHub Actions: CI/CD Pipelines
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Intermediate

**Description:** What is CI/CD? GitHub Actions: workflows, jobs, steps, runners. Build a pipeline that: runs tests, lints code, and blocks merge if checks fail. Deployment pipeline: auto-deploy to Railway/Render on push to `main`.

**Practical Output:** Create a `.github/workflows/ci.yml` that runs on every PR: installs dependencies, runs TypeScript type check, runs linter. Create a `.github/workflows/deploy.yml` that deploys to Railway on push to `main`. Break the CI intentionally with a type error — confirm the PR is blocked.

**Skills Unlocked:**
- GitHub Actions (`tool`) — `beginner`
- CI/CD (`practice`) — `beginner`

**Resources:**
- [VIDEO] GitHub Actions CI/CD Tutorial — TechWorld with Nana — https://www.youtube.com/watch?v=R8_veQiYBjI
- [ARTICLE] GitHub Actions Quickstart — https://docs.github.com/en/actions/quickstart
- [INTERNAL_TEXT] CI/CD (Continuous Integration / Continuous Deployment) means every code change automatically goes through a quality gate (tests, type checking, linting) before it can be merged. This prevents "it works on my machine" from becoming "it's broken in production." GitHub Actions is free for public repos and generous for private ones. A good CI pipeline is one of the biggest professional signals in a portfolio project — it shows you think about code quality, not just shipping.

---

### Topic 7.3 — Monitoring, Logging & Error Tracking
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Structured logging with `pino` or `winston`. Log levels (error, warn, info, debug). Request logging middleware. Error tracking with Sentry (free tier). Health check endpoint `GET /health`. Uptime monitoring basics.

**Practical Output:** Add structured request logging to your Express API (log method, path, status, duration for every request). Integrate Sentry — catch and report unhandled errors. Add a `GET /health` endpoint that returns server status and database connection status.

**Skills Unlocked:**
- Node.js (`platform_service`) — `advanced`
- CI/CD (`practice`) — `beginner`

**Resources:**
- [VIDEO] Node.js Logging with Pino — LogRocket — https://www.youtube.com/watch?v=68rscMwPgTc
- [ARTICLE] Sentry for Node.js — https://docs.sentry.io/platforms/node/
- [INTERNAL_TEXT] In production, you can't add `console.log` and refresh. You need structured logs that are queryable — fields like `{ timestamp, level, method, path, statusCode, duration, userId }`. Sentry captures exceptions with full stack traces and context, sends you an alert when something breaks, and shows you exactly which users were affected. A `GET /health` endpoint lets load balancers, uptime monitors, and automated deployment systems check if your app is alive and connected to its database.

---

### Topic 7.4 — Performance: Caching & Query Optimization
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** Database indexes and when to add them. The N+1 query problem and how to fix it with Prisma. HTTP caching headers. Redis for application-level caching (basic). Analyzing slow queries.

**Practical Output:** Identify the N+1 query problem in your API (e.g. loading 20 posts then fetching each author separately = 21 queries). Fix it with Prisma `include`. Add a database index on `posts.authorId`. Cache the `GET /posts` response in Redis for 60 seconds.

**Skills Unlocked:**
- PostgreSQL (`platform_service`) — `advanced`
- Prisma (`framework_library`) — `advanced`

**Resources:**
- [VIDEO] N+1 Problem with Prisma — Web Dev Simplified — https://www.youtube.com/watch?v=7S_tz1z_5bA
- [ARTICLE] Database indexes explained — use-the-index-luke.com — https://use-the-index-luke.com/
- [INTERNAL_TEXT] The N+1 problem is the most common performance mistake in ORM-heavy backends: you fetch 20 posts (1 query), then for each post you fetch the author (20 queries) = 21 total queries for what should be 1. Prisma's `include` solves this with a single JOIN. Database indexes are the next biggest win: without an index on `posts.authorId`, every query that filters by author scans the entire table. Adding the index makes it O(log n). These two fixes alone can make an API 10–100x faster.

---

### Topic 7.5 — PROJECT: Production-Ready App
**Type:** Project (Milestone)
**Difficulty:** Advanced
**Estimated Time:** 8–12 hrs

**Description:** Take your Stage 6 full-stack app and make it production-ready. The app already works — this project is about making it reliable, observable, and automatically deployable. These are the operational skills that separate developers who build things from developers who run things.

**Learning Objectives:**
- Containerize a Node.js + PostgreSQL stack with Docker and docker-compose
- Set up a GitHub Actions CI/CD pipeline that automatically runs checks on PRs and deploys on merge
- Integrate Sentry and structured logging so you're alerted when things break in production
- Identify and fix N+1 query patterns and add database indexes that speed up real queries

**Requirements:**
- Docker + docker-compose for local development
- GitHub Actions CI pipeline (type check + lint on every PR)
- GitHub Actions CD pipeline (auto-deploy on push to `main`)
- Sentry error tracking integrated on the backend
- Structured request logging (pino or winston)
- `GET /health` endpoint
- At least 2 database indexes on commonly-filtered columns
- N+1 queries identified and fixed
- All environment variables documented in `.env.example`
- Performance: API responds in under 200ms for typical endpoints (measured with Thunder Client or a script)

**Evaluation Criteria:**
- `docker compose up` starts the full stack (API + DB) with no manual steps beyond creating a `.env`
- GitHub Actions CI workflow runs on pull requests and blocks merge on type check or lint failures
- Sentry is integrated — a test error thrown manually appears in the Sentry dashboard
- `GET /health` returns `200` with database connection status
- At least 2 meaningful indexes exist in the Prisma schema (not just on primary keys that are auto-indexed)
- N+1 patterns are resolved — Prisma `include` used where previously there were loops of queries

**Stretch Goals:**
- Add Redis caching on one high-traffic endpoint and measure the latency improvement
- Write a `load-test.js` script using k6 or autocannon and document the results in the README
- Add a GitHub Actions workflow that runs integration tests against a test database before deploying

**Employer Signal:** CI/CD, containerization, error tracking, and query optimization are table stakes at any engineering team that operates at scale. A portfolio project with these configured — not just mentioned — demonstrates you can operate in a real engineering environment from day one.

**Skills Demonstrated:**
- Docker (`tool`) — `beginner`
- GitHub Actions (`tool`) — `beginner`
- CI/CD (`practice`) — `beginner`
- Node.js (`platform_service`) — `advanced`
- PostgreSQL (`platform_service`) — `advanced`

**Resources:**
- [VIDEO] Full-Stack Deployment with Docker & GitHub Actions — TechWorld with Nana — https://www.youtube.com/watch?v=eIkMRMUzFPc
- [ARTICLE] Node.js Production Best Practices — https://expressjs.com/en/advanced/best-practice-performance.html
- [INTERNAL_TEXT] "Production-ready" is a mindset, not a checklist. It means: when something breaks (and it will), you know about it immediately (Sentry + logging). When you deploy (and you will), the process is automatic and repeatable (CI/CD). When traffic grows (and it might), your queries are efficient (indexes, no N+1). A portfolio project with Docker, CI/CD, and monitoring is a rare and impressive signal to employers — it shows you think like an engineer, not just a coder.

---

## Stage 8 — Advanced Patterns & Capstone
**Tagline:** Build your best work. A complete product, production-ready, that you're proud to show anyone.
**Duration:** ~4 weeks

---

### Topic 8.1 — API Testing with Vitest & Supertest
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** Why test APIs? Integration testing with Supertest. Setting up a test database (separate from dev). Testing auth routes, CRUD routes, validation errors. Test coverage basics.

**Practical Output:** Write 10+ integration tests for your API: test registration, login, creating a resource, reading it, updating, deleting, and unauthorized access. Use a separate test PostgreSQL database. All tests should pass in CI.

**Skills Unlocked:**
- Backend Testing (`practice`) — `beginner`

**Resources:**
- [VIDEO] API Testing with Supertest — Web Dev Simplified — https://www.youtube.com/watch?v=FKnzS_icp20
- [ARTICLE] Supertest — npm — https://www.npmjs.com/package/supertest
- [INTERNAL_TEXT] Integration tests test your API end-to-end — they make real HTTP requests to a real Express server connected to a real (test) database. Unlike unit tests, they catch bugs that span multiple layers. The key: always use a separate test database, never your dev or production database. Run `prisma migrate dev` against the test DB in CI setup. A passing test suite is a deployability signal — if tests pass, it's safe to deploy.

---

### Topic 8.2 — Advanced TypeScript: Generics & Utility Types
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Advanced

**Description:** Generic functions and types. TypeScript utility types: `Partial`, `Required`, `Pick`, `Omit`, `Record`. Discriminated unions. Type guards. Using generics to write reusable API response wrappers.

**Practical Output:** Refactor your API's response structure using a generic `ApiResponse<T>` type. Refactor validation with a generic `validate<T>(schema: ZodSchema<T>, data: unknown): T` helper.

**Skills Unlocked:**
- TypeScript (`language`) — `advanced`

**Resources:**
- [VIDEO] TypeScript Generics — Web Dev Simplified — https://www.youtube.com/watch?v=EcCTIExsqmI
- [ARTICLE] TypeScript Utility Types — https://www.typescriptlang.org/docs/handbook/utility-types.html
- [INTERNAL_TEXT] Generics are TypeScript's way of writing code that works with multiple types while still being type-safe — like a typed function parameter for types. `ApiResponse<User>` is a response that wraps a User; `ApiResponse<Post[]>` wraps a list of Posts. The same generic handles both. Utility types like `Omit<User, 'password'>` are how you create "safe" versions of types that exclude sensitive fields — a pattern used in nearly every production API.

---

### Topic 8.3 — Rate Limiting, Security Headers & OWASP Basics
**Type:** Lesson + Practice
**Estimated Time:** 1.5 hrs
**Difficulty:** Intermediate

**Description:** Rate limiting with `express-rate-limit`. Security headers with `helmet`. Input sanitisation. OWASP Top 10 overview: injection, broken auth, sensitive data exposure, security misconfiguration. Practical checklist.

**Practical Output:** Add rate limiting to auth routes (5 attempts per 15 minutes). Add `helmet` to your Express app. Add input sanitisation with `xss`. Run your API against the OWASP checklist and fix any obvious issues.

**Skills Unlocked:**
- Web Security (`practice`) — `beginner`

**Resources:**
- [VIDEO] Express Security Best Practices — Web Dev Simplified — https://www.youtube.com/watch?v=igehB5dPidI
- [ARTICLE] OWASP Top 10 — https://owasp.org/www-project-top-ten/
- [INTERNAL_TEXT] Security is not a feature you add at the end — it's a practice you maintain throughout. `helmet` adds dozens of security headers in one line. Rate limiting on auth routes prevents brute-force attacks. Input sanitisation prevents XSS. The OWASP Top 10 is the industry standard list of the most critical security risks — every developer should read it at least once. These mitigations aren't optional for anything real users will use.

---

### Topic 8.4 — Emails, Background Jobs & Queues
**Type:** Lesson + Practice
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** Sending transactional emails with Resend (free tier). Email verification on registration. Password reset flow. Background job concepts — why long tasks shouldn't block HTTP responses. Introduction to BullMQ for job queues (optional).

**Practical Output:** Add email verification to your auth system — `POST /auth/register` sends a verification email with a time-limited token. `GET /auth/verify/:token` activates the account. Implement a password reset flow (forgot password email with reset link).

**Skills Unlocked:**
- Node.js (`platform_service`) — `advanced`

**Resources:**
- [VIDEO] Send Emails with Resend & Node.js — Traversy Media — https://www.youtube.com/watch?v=P3MlSFJWMqo
- [ARTICLE] Resend Node.js SDK — https://resend.com/docs/send-with-nodejs
- [INTERNAL_TEXT] Email verification protects your database from fake accounts and ensures you can reach users. Resend is the cleanest transactional email API for developers — the free tier sends 3,000 emails/month. The email verification token should be a random string (not a JWT) stored hashed in the database with an expiry timestamp. Never send the token in plain text in a URL and store it plain — always hash it, just like passwords.

---

### Topic 8.5 — Capstone Planning & Architecture
**Type:** Lesson + Workshop
**Estimated Time:** 2 hrs
**Difficulty:** Advanced

**Description:** How to plan a full-stack product: requirements, ERD (entity-relationship diagram), API design, component tree, tech decisions. Monorepo structure. Writing a technical specification.

**Practical Output:** Write a full technical specification for your capstone project: problem statement, user stories, ERD with all tables and relations, API endpoint list with request/response shapes, frontend pages with wireframes (can be hand-drawn), and a deployment plan.

**Skills Unlocked:**
- System Design (`practice`) — `beginner`

**Resources:**
- [VIDEO] How to Plan a Full-Stack Project — Traversy Media — https://www.youtube.com/watch?v=0pThnRneDjw
- [ARTICLE] Writing a Technical Spec — Basecamp — https://basecamp.com/shapeup/1.5-chapter-06
- [INTERNAL_TEXT] Professional developers don't open their code editor first — they think first. A technical spec forces you to make decisions on paper (cheap) rather than in code (expensive to change). Your ERD will expose missing relations. Your API list will reveal inconsistencies. Your component tree will catch missing pages. Spending 2 hours planning saves 20 hours of refactoring.

---

### Topic 8.6 — PROJECT: Capstone Full-Stack Product
**Type:** Project (Milestone — Capstone)
**Difficulty:** Advanced
**Estimated Time:** 30–50 hrs
**Note:** This is the graduation project. It represents the full capability of a junior full-stack developer.

**Description:** Build a complete, original, full-stack web application from your technical spec. The domain should be something you genuinely care about — it will show. This is what employers will actually look at. Not your certificates, not your course completion. When a hiring manager searches your name, this is what should come up. Build it like you're proud to demo it in a 30-minute interview.

**Learning Objectives:**
- Design, plan, and build a full-stack product end-to-end from a self-written technical spec
- Apply every production pattern from the path — auth, testing, CI/CD, monitoring, security — in a single coherent codebase
- Write a README so complete that a developer who's never met you can clone, run, and understand the project
- Make and justify architectural decisions independently — not by following a tutorial

**Requirements:**
- Original idea — not a tutorial clone, not "another todo app"
- Next.js frontend with TypeScript (0 `any`)
- Express + Node.js backend with TypeScript
- PostgreSQL + Prisma with a thoughtful schema (4+ models, meaningful relations)
- Full JWT auth with email verification
- Role-based access control
- File uploads (Cloudinary)
- Search + pagination
- Email notifications (at least on signup and one key action)
- Docker + docker-compose
- GitHub Actions CI/CD
- Integration tests (10+ tests covering auth and main CRUD flows)
- Sentry error tracking
- Rate limiting + security headers
- Both services deployed and live
- Comprehensive README with: architecture diagram, setup instructions, environment variables documented, API reference, live URLs, screenshots

**Evaluation Criteria:**
- App is live — both frontend and backend URLs are deployed and functional
- Original idea — not a tutorial clone or a copy of another project in the suggestions list
- README includes: architecture diagram, all environment variables, API reference (at least for auth + main CRUD), setup instructions that work, live URLs, and screenshots
- Test suite passes cleanly (`npm test` with 10+ meaningful integration tests)
- GitHub Actions CI workflow is green on the main branch
- Security checklist: Helmet, rate limiting on auth routes, input validation on all endpoints, no secrets in the repo

**Stretch Goals:**
- Build and launch a product landing page for your capstone (separate from the app itself)
- Add analytics and write a post-launch retrospective ("what I built, what broke, what I'd do differently")
- Open-source the project with a contributing guide and accept a real PR from another developer

**Employer Signal:** A capstone with an architecture diagram, passing tests, CI/CD, monitoring, and a live URL is the strongest possible portfolio signal a junior full-stack developer can send. It tells every part of the hiring team — engineering, product, and management — that you can own a project from idea to production.

**Skills Demonstrated:**
- All path skills — at their maximum level

**Resources:**
- [ARTICLE] Readme Driven Development — Tom Preston-Werner — https://tom.preston-werner.com/2010/08/23/readme-driven-development.html
- [INTERNAL_TEXT] Your capstone is what employers will actually look at. Not your certificates, not your course completion, not your freeCodeCamp badge. When a hiring manager Googles your name, this project should come up. Make it something you're proud to demo in a 30-minute interview. The README should be so good that a developer you've never met could clone it, run it, and understand exactly what it does and why every decision was made.

---

## Full Skills Catalog for This Path

| Skill | Category | Max Level |
|-------|----------|-----------|
| Web fundamentals | `fundamentals` | `beginner` |
| HTTP basics | `fundamentals` | `beginner` |
| HTML | `language` | `beginner` |
| CSS | `language` | `intermediate` |
| JavaScript | `language` | `intermediate` |
| TypeScript | `language` | `advanced` |
| SQL | `language` | `intermediate` |
| React | `framework_library` | `advanced` |
| Next.js | `framework_library` | `intermediate` |
| Express.js | `framework_library` | `advanced` |
| Prisma | `framework_library` | `advanced` |
| Tailwind CSS | `framework_library` | `beginner` |
| Git | `tool` | `intermediate` |
| Vite | `tool` | `beginner` |
| Docker | `tool` | `beginner` |
| GitHub Actions | `tool` | `beginner` |
| GitHub | `platform_service` | `beginner` |
| Node.js | `platform_service` | `advanced` |
| PostgreSQL | `platform_service` | `advanced` |
| Vercel | `platform_service` | `beginner` |
| Responsive Design | `practice` | `beginner` |
| REST API consumption | `practice` | `advanced` |
| REST API design | `practice` | `advanced` |
| Authentication | `practice` | `advanced` |
| Web Security | `practice` | `beginner` |
| CI/CD | `practice` | `beginner` |
| WebSockets | `practice` | `beginner` |
| Backend Testing | `practice` | `beginner` |
| System Design | `practice` | `beginner` |

**Total: 29 skills**

---

## Certificate Suggestions

### Stage 2 Certificate Suggestion
*(After: Frontend-Only SPA project)*

**Certificate:** freeCodeCamp — JavaScript Certification
**Provider:** freeCodeCamp
**URL:** https://www.freecodecamp.org/learn/javascript-v9/
**Cost:** `free`
**cost_note:** Completely free — no credit card required, certificate shareable on LinkedIn
**Trigger:** `on_stage_complete`
**Why now:** You've built a full React + TypeScript app — your JavaScript and frontend fundamentals are solid. The freeCodeCamp JS certification validates this with a real exam and 5 graded projects. Stack it next to your live SPA on LinkedIn and the combination is strong.

---

### Stage 3 Certificate Suggestion
*(After: REST API Server project)*

**Certificate:** HackerRank — Node.js (Basic) Skill Certificate
**Provider:** HackerRank
**URL:** https://www.hackerrank.com/skills-verification/nodejs_basic
**Cost:** `free`
**cost_note:** Free assessment, shareable badge, employer-facing on HackerRank platform
**Trigger:** `on_stage_complete`
**Why now:** You've built a full Express REST API in Node.js with TypeScript. The HackerRank Node.js Basic cert tests exactly what you just learned: async patterns, fs module, HTTP, and Express routing. It takes 90 minutes and results in a badge recruiters actively look for.

---

### Stage 5 Certificate Suggestion
*(After: Auth System project)*

**Certificate:** HackerRank — Rest API (Intermediate) Skill Certificate
**Provider:** HackerRank
**URL:** https://www.hackerrank.com/skills-verification/rest_api_intermediate
**Cost:** `free`
**cost_note:** Free assessment, shareable badge
**Trigger:** `on_stage_complete`
**Why now:** You've designed, built, and secured a full REST API with authentication and role-based access. The HackerRank REST API Intermediate cert tests API design, status codes, error handling, and auth — all things you now know deeply. This cert is specifically sought after for backend roles.

---

### Stage 6 Certificate Suggestion
*(After: Full-Stack App v1 project)*

**Certificate:** freeCodeCamp — Back End Development and APIs Certification
**Provider:** freeCodeCamp
**URL:** https://www.freecodecamp.org/learn/back-end-development-and-apis/
**Cost:** `free`
**cost_note:** Completely free — certificate shareable on LinkedIn
**Trigger:** `on_stage_complete`
**Why now:** The freeCodeCamp Back End Development cert covers Node.js, Express, APIs, and databases — exactly what you've now mastered across 4 stages. The projects in this cert are simpler than what you've built, so you can complete them quickly. Adding this cert + your live full-stack app creates a powerful LinkedIn profile combination.

---

### Stage 8 Certificate Suggestion
*(After: Capstone Full-Stack Product)*

**Certificate:** Meta Back-End Developer Professional Certificate
**Provider:** Meta / Coursera
**URL:** https://www.coursera.org/professional-certificates/meta-back-end-developer
**Cost:** `free_audit`
**cost_note:** Free to audit all videos. ~$50/month to earn the graded certificate. Financial aid available at no cost.
**Trigger:** `on_stage_complete`
**Why now:** After completing the full path and building a production capstone, you're technically beyond what this certificate teaches. But the Meta brand carries real weight with employers, and completing it validates your knowledge against an industry-recognised standard. It also gives you access to Meta's exclusive job board connecting completers to 200+ hiring companies. If budget allows, this is the highest-ROI paid certification for backend/full-stack developers.

---

## Certificate Summary Table

| After Stage | Certificate | Provider | Cost | LinkedIn-addable |
|-------------|-------------|----------|------|-----------------|
| Stage 2 | JavaScript Certification | freeCodeCamp | Free | ✓ |
| Stage 3 | Node.js (Basic) Skill | HackerRank | Free | ✓ |
| Stage 5 | REST API (Intermediate) Skill | HackerRank | Free | ✓ |
| Stage 6 | Back End Development & APIs | freeCodeCamp | Free | ✓ |
| Stage 8 | Meta Back-End Developer | Meta / Coursera | Free audit / ~$50/mo cert | ✓ |

---

## Opportunity Analyzer Tags

Skills that map directly to full-stack job postings (based on LinkedIn/Indeed analysis, 2025–2026):

**High demand (>70% of full-stack postings):**
React, Node.js, TypeScript, PostgreSQL, REST API design, Git, Authentication

**Medium demand (40–70%):**
Express.js, Next.js, Prisma, SQL, Docker, GitHub Actions, REST API consumption

**Good to have (<40%):**
WebSockets, CI/CD, Backend Testing, Redis, Web Security, System Design

---

## Progression Rules

- Stages 1–5 are sequential and mandatory — no skipping.
- Learners with prior frontend experience can take a self-assessment to skip Stage 1 and begin at Stage 2.
- Each stage requires the milestone project to be submitted before the next stage unlocks.
- Topics within a stage can be completed in any order.
- Every completed project immediately appears in the learner's Portfolio Hub.
- The Capstone (Stage 8, Topic 8.6) is the path's graduation project — completing it unlocks a "Full-Stack Graduate" badge on the learner's profile.
