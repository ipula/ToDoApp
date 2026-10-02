import { request } from "../../../shared/api/httpClient.ts";
import type { CreateTodoInput, Todo, UpdateTodoInput } from "../types.ts";

/** One function per API endpoint. Components use these through the hooks, not directly. */
export const todosApi = {
  list: () => request<Todo[]>("/api/todos"),

  get: (id: string) => request<Todo>(`/api/todos/${encodeURIComponent(id)}`),

  create: (input: CreateTodoInput) => request<Todo>("/api/todos", { method: "POST", body: input }),

  update: (id: string, input: UpdateTodoInput) =>
    request<Todo>(`/api/todos/${encodeURIComponent(id)}`, { method: "PUT", body: input }),

  toggleDone: (id: string) =>
    request<Todo>(`/api/todos/${encodeURIComponent(id)}/done`, { method: "PATCH" }),

  remove: (id: string) =>
    request<undefined>(`/api/todos/${encodeURIComponent(id)}`, { method: "DELETE" }),
};