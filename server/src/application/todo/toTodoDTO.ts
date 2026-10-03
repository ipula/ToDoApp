import type { Todo } from "../../domain/todo/Todo.ts";
import type { TodoDTO } from "./todo.dto.ts";

/**
 * Converts a Todo entity into the JSON shape the API returns.
 * Keeps the entity's internals (value objects, Date objects) out of responses.
 */
export function toTodoDTO(todo: Todo): TodoDTO {
  const { id, title, description, done, createdAt, updatedAt } = todo.toSnapshot();

  return {
    _id: id,
    title,
    // Omit the field entirely when empty, matching "description (optional)".
    ...(description ? { description } : {}),
    done,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}
