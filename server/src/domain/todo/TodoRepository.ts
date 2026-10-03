import type { Todo } from "./Todo.ts";
import type { TodoId } from "./TodoId.ts";

/** A slice of the newest-first list: skip `offset` todos, then take up to `limit`. */
export interface PageRequest {
  offset: number;
  limit: number;
}

/** Optional conditions for counting todos. */
export interface TodoCountCriteria {
  done?: boolean;
}

/**
 * Port for todo persistence.
 *
 * Defined in the domain, implemented in infrastructure (MongoTodoRepository),
 * so the domain and use cases never depend on MongoDB directly.
 */
export interface TodoRepository {
  /** Returns todos newest first: all of them, or one page when `page` is given. */
  findAll(page?: PageRequest): Promise<Todo[]>;

  /** Counts todos, optionally only those matching the criteria. */
  count(criteria?: TodoCountCriteria): Promise<number>;

  /** Returns the todo, or null if it does not exist. */
  findById(id: TodoId): Promise<Todo | null>;

  /** Inserts the todo if new, otherwise replaces the stored version. */
  save(todo: Todo): Promise<void>;

  /** Deletes the todo. Returns false if it did not exist. */
  delete(id: TodoId): Promise<boolean>;
}