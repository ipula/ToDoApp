import type { TodoRepository } from "../../../domain/todo/TodoRepository.ts";
import { findTodoOrThrow } from "../findTodoOrThrow.ts";
import type { TodoDTO } from "../todo.dto.ts";
import { toTodoDTO } from "../toTodoDTO.ts";

/**
 * Returns a single todo.
 * Not in the assignment's endpoint list; added so the client's
 * detail/edit pages work when opened directly or refreshed.
 */
export class GetTodo {
  constructor(private readonly todos: TodoRepository) {}

  async execute(id: string): Promise<TodoDTO> {
    const todo = await findTodoOrThrow(this.todos, id);
    return toTodoDTO(todo);
  }
}
