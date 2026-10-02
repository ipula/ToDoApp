# Todos (client)

The web app for Todos, built with **React 19**, **TypeScript**, **Vite**, **React Router**, **TanStack Query**, and **Tailwind CSS**. It talks to the [Todos API](../server/README.md) over HTTP.

You can view your todos page by page, add one with a title and optional description, edit it, tick it off (an ink line crosses it out), and delete it.

## Setup and running

**Prerequisites:** Node.js 22.22 or newer (required by React Router 8), npm, and the API running (see the [server README](../server/README.md)).

This app is part of an npm-workspaces monorepo, so **run all commands from the repo root**.

```bash
# 1. Install dependencies (from the repo root)
npm install

# 2. Start the API and the client together
npm run dev

#    ...or only the client, if the API is already running
npm run dev -w client
```

Open **http://localhost:5173**.

### How the client reaches the API

In development, the client calls relative URLs such as `/api/todos`, and Vite's dev server forwards them to `http://localhost:4000` (see `vite.config.ts`). Because the browser only ever talks to one origin, no CORS setup is needed while developing.

For a production build served from a different origin than the API, set the API's address at build time:

```bash
VITE_API_URL=https://api.example.com npm run build -w client
```

The output goes to `client/dist/`, a static site any web server can host. Also set the server's `CORS_ORIGIN` to the site's origin.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | empty (same origin, via the dev proxy) | Base URL of the API, read at build time |

### Scripts

Run them from the repo root with `-w client`, for example `npm test -w client`.

| Command | What it does |
|---|---|
| `dev` | Starts the Vite dev server on port 5173 |
| `build` | Type-checks, then builds for production into `dist/` |
| `preview` | Serves the production build locally |
| `typecheck` | Type-checks without building |
| `test` | Runs the Vitest suite |

## Pages

| URL | Page |
|---|---|
| `/` | Redirects to `/todos` |
| `/todos` | The list, 10 per page. `?page=2` selects a page |
| `/todos/new` | Add a todo |
| `/todos/:id/edit` | Edit a todo |
| any other URL | "Page not found", with a link back to the list |

Page numbers live in the URL, so refresh, the back button, and shared links all keep your place. An out-of-range page sends you to the last page.

## Project structure

Code is grouped by feature, so everything about todos sits together:

```
src/
├── app/                  App-wide setup
│   ├── App.tsx
│   ├── providers.tsx     TanStack Query client, toast container
│   ├── router.tsx        Route table
│   └── layouts/          Page shell (header + centered column)
├── features/todos/
│   ├── api/              One function per endpoint, query keys
│   ├── hooks/            useTodos, useTodo, useCreateTodo, useUpdateTodo,
│   │                     useToggleTodo, useDeleteTodo
│   ├── components/       TodoList, TodoItem, TodoForm, Pagination
│   ├── pages/            TodoListPage, TodoCreatePage, TodoEditPage
│   ├── pagination.ts     Page parsing and counting helpers
│   ├── schemas.ts        Form validation (zod)
│   └── types.ts          Todo types (mirror the API)
├── shared/
│   ├── api/              Typed fetch wrapper and ApiError
│   └── components/       Loading, error, and empty states
├── index.css             Design tokens and custom styles
└── main.tsx
```

Data flows one way: **page → hook → API function → HTTP client → fetch**. Components never call `fetch` or know a URL.

## Key decisions

**Server state with TanStack Query.** It handles caching, loading and error states, retries, and background refetching, so components contain no hand-written fetching logic. Failed requests are retried once, except 4xx errors such as 404, which would only fail again.

**Optimistic updates for toggle and delete.** The screen changes the moment you click. If the server then fails, the change is undone and a toast names the todo and explains what went wrong. A toast is used because a deleted row no longer exists to show the error on. When several toggles are in flight, only the last one to finish refetches, so the list never flickers through stale states. Create and edit are deliberately not optimistic: both return to the list after saving, and a failure appearing after you've left the form would be confusing. Instead, the form keeps your input and shows the error in place.

**One error type for the whole UI.** The HTTP client turns every failure (server unreachable, an API error, a non-JSON error page) into an `ApiError` with a user-friendly message. Users never see stack traces or raw status codes.

**Forms with react-hook-form and zod.** The schema mirrors the server's rules (title 1–100 characters, description up to 500), so mistakes are caught instantly. If the server still rejects something, its message appears on the same field, so both kinds of error look identical. The same form component is used for creating and editing.

**Accessibility.** Native checkboxes (restyled, so keyboards and screen readers work unchanged), real labels, a visible focus outline everywhere, `aria-invalid` and error descriptions on form fields, and announced loading and error states. Edit and Delete buttons name their todo for screen readers.

### Design

The list is a page from a ruled notebook: todos sit on one sheet separated by ruled lines, checkboxes sit in a red margin, and form fields are written on lines. The one animation that matters is crossing a todo off, when an ink line is drawn through its title, wrapping across lines if needed. Otherwise motion is limited to responses to your actions (the tick, page cross-fades via the View Transitions API), and all of it turns off when your system asks for reduced motion.

All colours and the typeface are defined once as Tailwind theme tokens in `src/index.css`. The font (Bricolage Grotesque) is bundled with the app instead of loaded from Google Fonts, so it works offline and makes no third-party requests.

On touch screens, Edit and Delete are always visible and sit under each todo's text. With a mouse, they appear on hover or keyboard focus.

## Testing

```bash
npm test -w client
```

The tests cover the logic most likely to break: the HTTP client's error handling (with a mocked `fetch`), the pagination helpers, and the pure cache-update functions behind the optimistic updates. Components aren't tested with a DOM; the full flows were checked in a real browser, including slow and failing server responses.

## Assumptions and limitations

- **The API types are copied by hand** from the server (`features/todos/types.ts`). There's deliberately no shared types package, so the two must be kept in sync manually.
- **Responses are trusted, not validated.** The client casts API responses to its types instead of checking them at runtime.
- **The validation limits (100 and 500 characters) are duplicated** from the server. If the server's limits change, `schemas.ts` must change too. The server remains the authority either way.
- **Page cross-fades need View Transitions support** (Chromium-based browsers and Safari). Elsewhere, pages switch instantly.
- **After editing, you return to page 1** of the list, not the page you came from.
- **No offline support.** Changes made without a connection are rolled back with a toast, not queued.
- **No component (DOM) tests**, as described under Testing.