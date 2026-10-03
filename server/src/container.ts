import { CreateTodo } from "./application/todo/use-cases/CreateTodo.ts";
import { DeleteTodo } from "./application/todo/use-cases/DeleteTodo.ts";
import { GetTodo } from "./application/todo/use-cases/GetTodo.ts";
import { ListTodos } from "./application/todo/use-cases/ListTodos.ts";
import { ToggleTodo } from "./application/todo/use-cases/ToggleTodo.ts";
import { UpdateTodo } from "./application/todo/use-cases/UpdateTodo.ts";
import type { TodoRepository } from "./domain/todo/TodoRepository.ts";
import { TodoController } from "./interfaces/http/controllers/TodoController.ts";

/**
 * Composition root: the one place where concrete classes are created and
 * connected. Everything else depends on interfaces and receives its
 * dependencies through constructors.
 *
 * The repository is a parameter, so production passes MongoTodoRepository
 * and tests pass InMemoryTodoRepository, with the rest of the wiring shared.
 */
export function createContainer(todoRepository: TodoRepository) {
  const todoController = new TodoController({
    listTodos: new ListTodos(todoRepository),
    getTodo: new GetTodo(todoRepository),
    createTodo: new CreateTodo(todoRepository),
    updateTodo: new UpdateTodo(todoRepository),
    toggleTodo: new ToggleTodo(todoRepository),
    deleteTodo: new DeleteTodo(todoRepository),
  });

  return { todoController };
}