import type { Todo } from "../../domain/todo/Todo.ts";
import { TodoId } from "../../domain/todo/TodoId.ts";
import type { TodoRepository } from "../../domain/todo/TodoRepository.ts";
import { TodoNotFoundError } from "../../domain/todo/errors.ts";

/**
 * Loads a todo by its raw id, or throws.
 *
 * Shared by every use case that works on an existing todo:
 * - malformed id  -> ValidationError (400)
 * - unknown id    -> TodoNotFoundError (404)
 */
export async function findTodoOrThrow(todos: TodoRepository, rawId: string): Promise<Todo> {
  const todo = await todos.findById(TodoId.from(rawId));

  if (!todo) {
    throw new TodoNotFoundError(rawId);
  }
  return todo;
}
