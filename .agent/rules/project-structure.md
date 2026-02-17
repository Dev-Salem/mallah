---
trigger: always_on
---

---
trigger: always_on
---

---
project id on supabase is: ``
# 🧠 Comprehensive Cursor Rules for Next.js + Supabase

These rules define a **modular monolith** architecture, prioritizing the **Feature-Sliced Design** philosophy. We aim for a "Plug-and-Play" developer experience where features are self-contained, typed, and localized.

## 📁 1. The "Feature-First" File Structure

We avoid "folder-by-type" (putting all hooks in one folder) because it doesn't scale. Instead, we use **Feature-Based Organization**.

```text
src/
 ├─ app/                     # Next.js App Router (Routing & Layout only)
 │  ├─ (auth)/               # Route groups for logical separation
 │  ├─ (dashboard)/
 │  │  ├─ projects/
 │  │  │  └─ page.tsx        # Only calls Feature Components
 │  └─ layout.tsx
 │
 ├─ features/                # The heart of the application
 │  ├─ <feature-name>/       # e.g., "project-management"
 │  │  ├─ components/        # Feature-specific UI (ProjectCard, ProjectList)
 │  │  ├─ hooks/             # Custom hooks for this feature (useProjectLogic)
 │  │  ├─ services/          # Supabase queries & data logic
 │  │  ├─ actions/           # Next.js Server Actions (Mutations)
 │  │  ├─ types.ts           # Feature-specific TypeScript interfaces
 │  │  └─ index.ts           # Public API for the feature
 │
 ├─ lib/                     # Shared logic and configurations
 │  ├─ supabase/             # Client/Server/Admin initializers
 │  ├─ i18n/                 # Localization config and JSONs
 │  └─ utils.ts              # Global helper functions (cn, formatDate)
 │
 ├─ components/              # Shared UI components
 │  ├─ ui/                   # ShadCN primitives (unmodified)
 │  └─ shared/               # Cross-feature components (Navbar, Footer)
 │
 └─ providers/               # React Context Providers (Theme, Query, Auth)

```

### Rationale:

* **Scalability**: New developers can find everything related to "Billing" in one folder.
* **Refactoring**: Deleting a feature is as simple as deleting its folder.
* **Encapsulation**: Features should only export what is necessary via `index.ts`.

---

## 🔄 2. Data Fetching & Mutation Strategy

We utilize a **Hybrid Data Flow**. We leverage Server Components for the initial load to improve SEO and LCP (Largest Contentful Paint), then hand off to React Query for client-side interactivity.

### ✅ The Golden Rules of Data

1. **Server Components**: Use for fetching data that is static or required for the initial render. Use the `supabase/server.ts` client.
2. **Server Actions**: All mutations (POST, PATCH, DELETE) **must** be Server Actions. No API routes for internal CRUD.
3. **React Query**: Use for client-side state, caching, and optimistic updates. Wrap Server Actions inside `queryFn` or `mutationFn`.
4. **No `useEffect` for Fetching**: `useEffect` should be used for browser APIs or third-party sync, never for data fetching.

### 🏗️ Architectural Flow

1. **Server Page** fetches `initialData`.
2. **Client Component** receives `initialData` as a prop.
3. **React Query** uses `initialData` for its cache and manages updates/refetching.

```tsx
// Example: Correct Implementation
// features/projects/actions/project-actions.ts
"use server";
export async function getProjectsAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw new Error(error.message);
  return data;
}

// app/projects/page.tsx
export default async function Page() {
  const initialData = await getProjectsAction();
  return <ProjectDashboard initialData={initialData} />;
}

```

---

## 🔐 3. Supabase Client & Security Patterns

Security is handled via **Row Level Security (RLS)** in the database, but our code must interact with it correctly to avoid silent failures.

### The Two-Client System

We maintain a strict distinction between the "User Client" and the "Admin Client."

| Client Type | Location | Usage | RLS Context |
| --- | --- | --- | --- |
| **User Client** | `lib/supabase/server.ts` | Auth checks, User Reads | **Enabled** (Respects JWT) |
| **Admin Client** | `lib/supabase/admin.ts` | Mutations, System Tasks | **Bypassed** (Service Role) |

### **CRITICAL**: The Authorization Pattern

Never trust the client. Always verify permissions using a Database RPC before performing a mutation with the Admin Client. (ONLY FOR ADMIN RULES, for the rest JUST USE RLS)

```typescript
// ✅ CORRECT: The "Authorize then Execute" Pattern
export const deletePost = async (postId: string) => {
  const supabase = await createClient(); // User Client
  
  // 1. Authorization Check (via RPC)
  const { data: isOwner } = await supabase.rpc("check_post_ownership", { post_id: postId });
  
  if (!isOwner) throw new Error("Unauthorized access attempt logged.");

  // 2. Execution (via Admin Client for reliability)
  const { error } = await supabaseAdmin.from("posts").delete().eq("id", postId);
  
  if (error) handleDatabaseError(error);
  revalidatePath("/posts");
};

```

---

## 🌍 4. Localization (i18n) Protocol

We use `next-intl` for localization. It is non-negotiable that **no hardcoded strings** exist in the UI.

### Translation Management

* **Namespacing**: Organize JSON files by feature (e.g., `projects.json`, `auth.json`).
* **Direct Access**: Use the `useTranslations` hook directly. Avoid passing translated strings as props unless necessary for generic components.

### Implementation Guide:

```tsx
// ✅ DO
const t = useTranslations('Dashboard.Projects');
return <h1>{t('title', { count: projects.length })}</h1>;

// ❌ DON'T
const title = "Your Projects"; // Hardcoded
return <h1>{title}</h1>;

```

---

## 🎨 5. Component & Theming Guidelines

We use **ShadCN UI** + **Tailwind CSS**. To maintain a clean codebase, we follow these styling constraints:

### Styling Principles:

* **Atomic Design**: Keep `components/ui` for ShadCN primitives. Don't touch them unless global changes are needed.
* **Zero Inline Styles**: Use Tailwind classes. For complex logic, use `clsx` or `tailwind-merge` (via the `cn()` utility).
* **Design Tokens**: Use CSS variables for colors (e.g., `bg-primary`, `text-muted-foreground`) to ensure Dark Mode support works out of the box.

### Compound Component Pattern:

For complex UI elements (like Modals or Custom Tables), use the Compound Component pattern to keep the API declarative.

```tsx
// ✅ Standardized UI Pattern
<DataTable>
  <DataTable.Header title={t('table_title')} />
  <DataTable.Body data={data} renderRow={(item) => <ProjectRow item={item} />} />
</DataTable>

```

---

## 🚀 6. Step-by-Step Feature Workflow

When Cursor is asked to "add a new feature," it must follow these steps in order:

1. **Define Schema**: Check the database schema. Update `src/lib/supabase/types.ts` using the Supabase CLI.
2. **Create Service Layer**: Write the Supabase queries in `features/<feature>/services/`.
3. **Write Server Actions**: Create the mutations in `features/<feature>/actions/` with Zod validation.
4. **Add Localization**: Add the necessary keys to `en.json` and `ar.json`.
5. **Build Components**: Create the UI in `features/<feature>/components/` using ShadCN.
6. **Assemble Page**: Create the route in `app/` and connect the pieces.
7. **Error Handling**: Wrap the logic in `withErrorHandling` middleware to ensure consistent Toast notifications.

---

## ⚡ 7. Performance & Optimization

* **Image Optimization**: Use `next/image`. Always provide `width`, `height`, and `alt` tags.
* **Code Splitting**: Use `dynamic()` imports for heavy client-side components (like Charts or Rich Text Editors).
* **Streaming**: Use `loading.tsx` and React `Suspense` for granular loading states.
* **Query Keys**: Maintain a global query key factory to prevent cache invalidation bugs.

---

## 🛠️ 8. Tech Stack Summary Table

| Layer | Technology | Rule |
| --- | --- | --- |
| **Framework** | Next.js 15 (App Router) | Favor Server Components |
| **Database** | Supabase | RLS always ON |
| **Validation** | Zod | All Server Action inputs must be validated |
| **State** | React Query | Cache for 5 mins by default |
| **Forms** | React Hook Form | Use with `@hookform/resolvers/zod` |
| **Icons** | Lucide React | Use consistent stroke widths |

---

## 🧠 Philosophy: The "Plug-in" Mindset

Every feature should feel like a plug-in. If we need to remove the "User Analytics" feature, we should only have to delete the `features/analytics` folder and remove its reference in the `app/` router.

**"We don't write code; we build a system of interconnected, type-safe modules."**

---