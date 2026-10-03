import { Todo } from "../../../../domain/todo/Todo.ts";
import type { TodoRecord } from "./TodoModel.ts";

/** Converts a domain Todo into the document stored in MongoDB. */
export function toTodoRecord(todo: Todo): TodoRecord {
  const { id, title, description, done, createdAt, updatedAt } = todo.toSnapshot();

  return {
    _id: id,
    title,
    // Leave the field out of the document entirely when empty.
    ...(description ? { description } : {}),
    done,
    createdAt,
    updatedAt,
  };
}

/** Rebuilds a domain Todo from a stored document. */
export function toTodoEntity(record: TodoRecord): Todo {
  return Todo.restore({
    id: record._id,
    title: record.title,
    description: record.description ?? "",
    done: record.done,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}
