import { TodoId } from "../../../domain/todo/TodoId.ts";
import type { TodoRepository } from "../../../domain/todo/TodoRepository.ts";
import { TodoNotFoundError } from "../../../domain/todo/errors.ts";

/** Deletes a todo. Throws if it does not exist, so the API can return 404. */
export class DeleteTodo {
  constructor(private readonly todos: TodoRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.todos.delete(TodoId.from(id));

    if (!deleted) {
      throw new TodoNotFoundError(id);
    }
  }
}
