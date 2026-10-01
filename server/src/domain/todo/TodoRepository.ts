import type { Todo } from "./Todo.ts";
import type { TodoId } from "./TodoId.ts";

/**
 * Port for todo persistence.
 *
 * Defined in the domain, implemented in infrastructure (MongoTodoRepository),
 * so the domain and use cases never depend on MongoDB directly.
 */
export interface TodoRepository {
  /** Returns all todos, newest first. */
  findAll(): Promise<Todo[]>;

  /** Returns the todo, or null if it does not exist. */
  findById(id: TodoId): Promise<Todo | null>;

  /** Inserts the todo if new, otherwise replaces the stored version. */
  save(todo: Todo): Promise<void>;

  /** Deletes the todo. Returns false if it did not exist. */
  delete(id: TodoId): Promise<boolean>;
}
