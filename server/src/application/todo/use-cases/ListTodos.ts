import type { TodoRepository } from "../../../domain/todo/TodoRepository.ts";
import type { ListTodosQuery, ListTodosResult } from "../todo.dto.ts";
import { toTodoDTO } from "../toTodoDTO.ts";

/**
 * Returns todos newest first, with counts across the whole list.
 *
 * Without a query, every todo is returned (the API's original contract).
 * With one, only the requested page is loaded from the database.
 */
export class ListTodos {
  constructor(private readonly todos: TodoRepository) {}

  async execute(query?: ListTodosQuery): Promise<ListTodosResult> {
    const page = query && { offset: (query.page - 1) * query.limit, limit: query.limit };

    // The three reads are independent, so they run in parallel.
    const [todos, total, remaining] = await Promise.all([
      this.todos.findAll(page),
      this.todos.count(),
      this.todos.count({ done: false }),
    ]);

    return { todos: todos.map(toTodoDTO), total, remaining };
  }
}