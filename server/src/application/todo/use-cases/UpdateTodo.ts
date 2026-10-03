import type { TodoRepository } from "../../../domain/todo/TodoRepository.ts";
import { findTodoOrThrow } from "../findTodoOrThrow.ts";
import type { TodoDTO, UpdateTodoInput } from "../todo.dto.ts";
import { toTodoDTO } from "../toTodoDTO.ts";

/** Updates a todo's title and/or description. Does not change `done`. */
export class UpdateTodo {
  constructor(private readonly todos: TodoRepository) {}

  async execute(id: string, input: UpdateTodoInput): Promise<TodoDTO> {
    const todo = await findTodoOrThrow(this.todos, id);
    todo.edit(input);
    await this.todos.save(todo);
    return toTodoDTO(todo);
  }
}
