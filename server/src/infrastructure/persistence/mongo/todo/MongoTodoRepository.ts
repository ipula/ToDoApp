import type { Todo } from "../../../../domain/todo/Todo.ts";
import type { TodoId } from "../../../../domain/todo/TodoId.ts";
import type { TodoRepository } from "../../../../domain/todo/TodoRepository.ts";
import { TodoModel, type TodoRecord } from "./TodoModel.ts";
import { toTodoEntity, toTodoRecord } from "./todoRecordMapper.ts";

/**
 * MongoDB implementation of the TodoRepository port.
 *
 * The only class in the app that talks to Mongoose. Uses `.lean()` reads,
 * which return plain objects instead of Mongoose documents: faster, and
 * the domain never sees Mongoose types.
 */
export class MongoTodoRepository implements TodoRepository {
  async findAll(): Promise<Todo[]> {
    const records = await TodoModel.find().sort({ createdAt: -1 }).lean<TodoRecord[]>();
    return records.map(toTodoEntity);
  }

  async findById(id: TodoId): Promise<Todo | null> {
    const record = await TodoModel.findById(id.value).lean<TodoRecord>();
    return record ? toTodoEntity(record) : null;
  }

  /**
   * Inserts or fully replaces the document (upsert).
   * A full replace means a cleared description is removed from the
   * document, rather than lingering from the previous version.
   */
  async save(todo: Todo): Promise<void> {
    const record = toTodoRecord(todo);
    await TodoModel.replaceOne({ _id: record._id }, record, {
      upsert: true,
      runValidators: true,
    });
  }

  async delete(id: TodoId): Promise<boolean> {
    const result = await TodoModel.deleteOne({ _id: id.value });
    return result.deletedCount === 1;
  }
}
