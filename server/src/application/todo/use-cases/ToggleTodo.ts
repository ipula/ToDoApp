import type { TodoRepository } from "../../../domain/todo/TodoRepository.ts";
import { findTodoOrThrow } from "../findTodoOrThrow.ts";
import type { TodoDTO } from "../todo.dto.ts";
import { toTodoDTO } from "../toTodoDTO.ts";

/** Flips a todo's done status. */
export class ToggleTodo {
  constructor(private readonly todos: TodoRepository) {}

  async execute(id: string): Promise<TodoDTO> {
    const todo = await findTodoOrThrow(this.todos, id);
    todo.toggleDone();
    await this.todos.save(todo);
    return toTodoDTO(todo);
  }
}
