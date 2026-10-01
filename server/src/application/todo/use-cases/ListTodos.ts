import type { TodoRepository } from "../../../domain/todo/TodoRepository.ts";
import type { TodoDTO } from "../todo.dto.ts";
import { toTodoDTO } from "../toTodoDTO.ts";

/** Returns all todos, newest first. */
export class ListTodos {
  constructor(private readonly todos: TodoRepository) {}

  async execute(): Promise<TodoDTO[]> {
    const todos = await this.todos.findAll();
    return todos.map(toTodoDTO);
  }
}
