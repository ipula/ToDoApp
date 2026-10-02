/**
 * Client-side copies of the API contract (see server/src/application/todo/todo.dto.ts).
 * Kept in sync by hand: the project deliberately has no shared types package.
 */

/** A todo as returned by the API. */
export interface Todo {
  _id: string;
  title: string;
  /** Absent when the todo has no description. */
  description?: string;
  done: boolean;
  /** ISO 8601 timestamp. */
  createdAt: string;
  /** ISO 8601 timestamp. */
  updatedAt: string;
}

/** Body of POST /api/todos. */
export interface CreateTodoInput {
  title: string;
  description?: string;
}

/** Body of PUT /api/todos/:id. Omitted fields stay unchanged. */
export interface UpdateTodoInput {
  title?: string;
  description?: string;
}