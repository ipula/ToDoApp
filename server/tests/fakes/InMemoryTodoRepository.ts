import { Todo, type TodoSnapshot } from "../../src/domain/todo/Todo.ts";
import type { TodoId } from "../../src/domain/todo/TodoId.ts";
import type {
  PageRequest,
  TodoCountCriteria,
  TodoRepository,
} from "../../src/domain/todo/TodoRepository.ts";

/**
 * In-memory implementation of the repository port, used in unit tests.
 *
 * Stores snapshots rather than entity instances, so a test can't pass by
 * accidentally mutating a stored object; changes only stick via save(),
 * just like with a real database.
 *
 * Methods return Promise.resolve(...) instead of being `async`: there is
 * nothing to await in memory, but the port's contract is asynchronous.
 */
export class InMemoryTodoRepository implements TodoRepository {
  private readonly store = new Map<string, TodoSnapshot>();

  findAll(page?: PageRequest): Promise<Todo[]> {
    // Same order as MongoTodoRepository: newest first, id as tie-breaker.
    const sorted = [...this.store.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || b.id.localeCompare(a.id),
    );
    const slice = page ? sorted.slice(page.offset, page.offset + page.limit) : sorted;
    return Promise.resolve(slice.map((snapshot) => Todo.restore(snapshot)));
  }

  count(criteria: TodoCountCriteria = {}): Promise<number> {
    const { done } = criteria;
    const matching = [...this.store.values()].filter(
      (snapshot) => done === undefined || snapshot.done === done,
    );
    return Promise.resolve(matching.length);
  }

  findById(id: TodoId): Promise<Todo | null> {
    const snapshot = this.store.get(id.value);
    return Promise.resolve(snapshot ? Todo.restore(snapshot) : null);
  }

  save(todo: Todo): Promise<void> {
    const snapshot = todo.toSnapshot();
    this.store.set(snapshot.id, snapshot);
    return Promise.resolve();
  }

  delete(id: TodoId): Promise<boolean> {
    return Promise.resolve(this.store.delete(id.value));
  }
}