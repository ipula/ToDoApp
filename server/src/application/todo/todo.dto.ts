/**
 * A todo as returned by the API.
 * Field names match the assignment's model example (`_id`, `done`, ...).
 */
export interface TodoDTO {
  _id: string;
  title: string;
  /** Omitted when the todo has no description. */
  description?: string;
  done: boolean;
  /** ISO 8601 timestamp (JSON has no Date type). */
  createdAt: string;
  /** ISO 8601 timestamp. */
  updatedAt: string;
}

/** Input for creating a todo. */
export interface CreateTodoInput {
  title: string;
  description?: string;
}

/** Input for editing a todo. Omitted fields stay unchanged. */
export interface UpdateTodoInput {
  title?: string;
  description?: string;
}

/** Which page of the list to return. `page` starts at 1. */
export interface ListTodosQuery {
  page: number;
  limit: number;
}

/** A list of todos plus the counts the client needs for paging and headings. */
export interface ListTodosResult {
  todos: TodoDTO[];
  /** Number of todos in total, across all pages. */
  total: number;
  /** Number of todos not yet done, across all pages. */
  remaining: number;
}