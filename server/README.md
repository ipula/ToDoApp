# Todos API (server)

REST API for the Todos app, built with **Express 5**, **TypeScript**, **Mongoose**, and **Zod**. It stores todos in MongoDB and is organised in layers (domain, application, infrastructure, HTTP) so that business rules don't depend on Express or MongoDB.

## Setup and running

**Prerequisites:** Node.js 22.22 or newer, npm, and a MongoDB database (see [MongoDB connection](#mongodb-connection)).

This app is part of an npm-workspaces monorepo, so **run all commands from the repo root**.

```bash
# 1. Install dependencies (from the repo root)
npm install

# 2. Create your environment file
cp server/.env.example server/.env

# 3. Start MongoDB locally (skip if you use Atlas)
docker compose up -d

# 4. Start the API in watch mode
npm run dev -w server
```

The API listens on http://localhost:4000. Check it's up:

```bash
curl http://localhost:4000/api/health
# {"status":"ok"}
```

### Environment variables

Defined in `server/.env`. They are validated at startup, so the server exits immediately with a clear message if one is missing or invalid.

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `MONGODB_URI` | Yes | none | MongoDB connection string |
| `PORT` | No | `4000` | Port the API listens on |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Browser origin allowed to call the API (the client) |
| `NODE_ENV` | No | `development` | `development`, `test`, or `production` |

### Scripts

Run them from the repo root with `-w server`, for example `npm test -w server`.

| Command | What it does |
|---|---|
| `dev` | Runs `src/server.ts` with `tsx` in watch mode |
| `build` | Compiles TypeScript to `dist/` |
| `start` | Runs the compiled build (`node --env-file=.env dist/server.js`) |
| `typecheck` | Type-checks source and tests without emitting |
| `test` / `test:watch` | Runs the Vitest suite once / in watch mode |

`start` reads `server/.env`, and Node exits if that file doesn't exist. In an environment that sets variables another way (a container platform, for example), run `node dist/server.js` directly.

## MongoDB connection

Any MongoDB 6+ database works. Set its connection string as `MONGODB_URI`.

### Option 1: local MongoDB with Docker (recommended for development)

The repo includes a `docker-compose.yml` that runs MongoDB 7 with a named volume, so data survives restarts.

```bash
docker compose up -d      # start
docker compose stop       # stop, keeping data
docker compose down -v    # stop and delete all data
```

```
MONGODB_URI=mongodb://localhost:27017/todos
```

### Option 2: MongoDB installed locally

If `mongod` is already running on your machine, use the same URI as above. The `todos` database is created on first write.

### Option 3: MongoDB Atlas (cloud)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a database user with a password.
3. Under **Network Access**, add your IP address (or `0.0.0.0/0` for quick testing only).
4. Choose **Connect → Drivers** and copy the connection string, then add the database name before the `?`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/todos?retryWrites=true&w=majority
```

If the password contains special characters such as `@`, `:` or `/`, URL-encode them (for example, `@` becomes `%40`), or the URI won't parse.

### Connection behaviour

- The server connects **before** it starts listening, so it never accepts requests it can't serve.
- If the database can't be reached within 5 seconds, startup fails with an error instead of hanging (the driver's default is 30 seconds).
- On `SIGINT`/`SIGTERM` (Ctrl+C, `docker stop`), it stops accepting connections, lets in-flight requests finish, then closes the database connection.

## API reference

Base URL: `http://localhost:4000/api`. Request and response bodies are JSON.

| Method | Endpoint | Description | Success |
|---|---|---|---|
| `GET` | `/todos` | All todos, newest first (optionally paginated) | `200` array |
| `GET` | `/todos/:id` | One todo | `200` todo |
| `POST` | `/todos` | Create a todo | `201` todo |
| `PUT` | `/todos/:id` | Update title and/or description | `200` todo |
| `PATCH` | `/todos/:id/done` | Toggle the done status | `200` todo |
| `DELETE` | `/todos/:id` | Delete a todo | `204` no body |
| `GET` | `/health` | Liveness check | `200` `{"status":"ok"}` |

### The todo shape

Field names follow the assignment's model:

```json
{
  "_id": "3f1c2b9e-7a4d-4c1e-9b2a-5d8e6f7a1b2c",
  "title": "Renew the domain name",
  "description": "Expires on the 14th",
  "done": false,
  "createdAt": "2026-10-01T09:30:00.000Z",
  "updatedAt": "2026-10-01T09:30:00.000Z"
}
```

`description` is omitted when empty. Timestamps are ISO 8601 strings in UTC.

### Request bodies

| Endpoint | Body | Rules |
|---|---|---|
| `POST /todos` | `{ "title": "…", "description": "…" }` | `title` required, 1–100 characters after trimming; `description` optional, up to 500 |
| `PUT /todos/:id` | `{ "title": "…", "description": "…" }` | At least one field. Same limits. `""` as description clears it |

Unknown fields are rejected with `400`, so for example sending `done` to `PUT` fails clearly instead of being silently ignored. Use `PATCH /todos/:id/done` to change `done`.

### Pagination (optional)

`GET /todos` without query parameters returns **every** todo, as the assignment specifies. Add `page` and/or `limit` to get one page instead:

```
GET /api/todos?page=2&limit=10
```

| Parameter | Default | Rules |
|---|---|---|
| `page` | `1` (if `limit` is given) | Whole number ≥ 1 |
| `limit` | `10` (if `page` is given) | Whole number from 1 to 100 |

The response body is **always** a plain array of todos. Counts travel in headers, so the body's shape never changes:

| Header | Meaning |
|---|---|
| `X-Total-Count` | Number of todos across all pages |
| `X-Remaining-Count` | Number of todos not yet done, across all pages |

Both headers are listed in `Access-Control-Expose-Headers`, so browser clients on another origin can read them. A page past the end returns `[]` with the counts intact.

### Errors

Every error has the same shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [{ "field": "title", "message": "Title is required" }]
  }
}
```

| Status | `code` | When |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Invalid body, unknown fields, bad paging values, or a malformed id. `details` names each field |
| `400` | `INVALID_JSON` | The body isn't valid JSON |
| `404` | `TODO_NOT_FOUND` | No todo has that id |
| `404` | `ROUTE_NOT_FOUND` | No such endpoint |
| `413` | `PAYLOAD_TOO_LARGE` | Body over 10 kB |
| `500` | `INTERNAL_ERROR` | Unexpected failure. Details are logged on the server, never sent to the client |

### Trying it with Postman

Import `server/postman/todo-api.postman_collection.json`. It has a happy-path folder that runs in order (create, read, update, toggle, delete, saving the new id automatically) and an error-cases folder. Each request checks its own status code, so **Run collection** shows pass or fail for all of them.

## Architecture

The code is organised in layers, and dependencies point inward only: the domain knows nothing about Express or MongoDB.

```
src/
├── domain/            Business rules. No framework imports.
│   ├── shared/        DomainError, ValidationError
│   └── todo/          Todo entity, value objects (TodoId, TodoTitle,
│                      TodoDescription), the TodoRepository port, errors
├── application/       One use case per class (CreateTodo, ListTodos, ...),
│   └── todo/          DTOs, and the entity → JSON mapper
├── infrastructure/    Technical details
│   ├── config/        Environment validation
│   └── persistence/   Mongoose model and MongoTodoRepository (the port's adapter)
├── interfaces/http/   Express: routes, controller, request schemas, error handling
├── container.ts       Composition root: creates and connects everything
├── app.ts             Builds the Express app (no listen, so tests can use it)
└── server.ts          Entry point: connect to MongoDB, then listen
```

How a request flows: **route → controller** (parses the request) **→ use case** (loads, calls the domain, saves) **→ domain** (enforces the rules) **→ repository** (MongoDB), and back as a DTO.

Key decisions:

- **Validation happens at two levels with separate jobs.** Zod schemas in the HTTP layer check a request's *shape* (types, unknown fields). Value objects in the domain enforce *business rules* (title not empty, length limits). Both produce the same error format.
- **Invalid states can't exist.** A `TodoTitle` can only be created through a factory that trims and validates it, and the `Todo` entity changes only through methods (`edit`, `toggleDone`), never setters.
- **The repository is an interface owned by the domain.** `MongoTodoRepository` implements it for production, and an in-memory version implements it for tests. `container.ts` is the only place that chooses.
- **IDs are UUIDs generated by the domain**, stored as strings in `_id`. A todo has its identity before it's saved, and malformed ids are rejected with `400` rather than causing a database cast error.
- **The domain owns the timestamps.** Mongoose's `timestamps` option is off, so the database never overwrites them. Tests pass a fixed time for deterministic results.
- **Express 5** forwards errors from async handlers to the central error handler automatically, so controllers contain no try/catch.

### Naming

Files are named after their main export: PascalCase for classes (`ListTodos.ts`), camelCase for functions (`toTodoDTO.ts`), and a suffix for files that only hold types (`todo.dto.ts`).

## Testing

```bash
npm test -w server
```

| Suite | Covers | Database |
|---|---|---|
| `tests/unit/domain` | Entity and value-object rules | None |
| `tests/unit/application` | Every use case, including paging and totals | In-memory repository |
| `tests/http` | Every endpoint end to end through Express: status codes, error shapes, paging headers, CORS | In-memory repository |

All tests run in well under a second and need no MongoDB. The HTTP tests reuse the production wiring from `container.ts`, swapping only the repository.

## Assumptions and limitations

- **Single user, no authentication.** Anyone who can reach the API can read and change every todo.
- **Toggling is read-modify-write.** Two toggle requests for the same todo at the same instant could both read the same state, so one flip would be lost. This is acceptable for a single user; the fix would be optimistic concurrency with a version field.
- **The automated tests don't hit a real MongoDB.** The Mongo repository was verified manually and with the Postman collection. Integration tests against a real database would be the next addition.
- **Each list request runs three queries** (the page, the total, the remaining count), in parallel. That's fine at this scale; at very large scale, the counts could be cached.
- **Pagination uses skip and limit**, which slows down on very deep pages of very large collections. Cursor-based paging would scale better but complicates the API.
- **Extensions beyond the brief:** `GET /todos/:id` (so the client's edit page works when refreshed) and optional pagination. Both keep the required endpoints' behaviour unchanged.
- **No rate limiting.** Bodies are capped at 10 kB and page size at 100.
- **TypeScript is pinned to 6.x**, because typescript-eslint doesn't support TypeScript 7 yet.