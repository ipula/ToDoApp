import { request, requestWithHeaders } from "../../../shared/api/httpClient.ts";
import type { CreateTodoInput, Todo, TodoPage, UpdateTodoInput } from "../types.ts";

/** Reads a count header, falling back if it is missing or not a number. */
function readCount(headers: Headers, name: string, fallback: number): number {
  const value = Number(headers.get(name));
  return headers.has(name) && Number.isFinite(value) ? value : fallback;
}

/** One function per API endpoint. Components use these through the hooks, not directly. */
export const todosApi = {
  /** One page of todos. Totals come from the X-Total-Count and X-Remaining-Count headers. */
  list: async (page: number, limit: number): Promise<TodoPage> => {
    const { data: todos, headers } = await requestWithHeaders<Todo[]>(
      `/api/todos?page=${page}&limit=${limit}`,
    );
    return {
      todos,
      total: readCount(headers, "X-Total-Count", todos.length),
      remaining: readCount(headers, "X-Remaining-Count", todos.filter((t) => !t.done).length),
    };
  },

  get: (id: string) => request<Todo>(`/api/todos/${encodeURIComponent(id)}`),

  create: (input: CreateTodoInput) => request<Todo>("/api/todos", { method: "POST", body: input }),

  update: (id: string, input: UpdateTodoInput) =>
    request<Todo>(`/api/todos/${encodeURIComponent(id)}`, { method: "PUT", body: input }),

  toggleDone: (id: string) =>
    request<Todo>(`/api/todos/${encodeURIComponent(id)}/done`, { method: "PATCH" }),

  remove: (id: string) =>
    request<undefined>(`/api/todos/${encodeURIComponent(id)}`, { method: "DELETE" }),
};