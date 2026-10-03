import { Todo } from "../../../domain/todo/Todo.ts";
import type { TodoRepository } from "../../../domain/todo/TodoRepository.ts";
import type { CreateTodoInput, TodoDTO } from "../todo.dto.ts";
import { toTodoDTO } from "../toTodoDTO.ts";

/** Creates a new todo. Validation happens inside the domain (Todo.create). */
export class CreateTodo {
  constructor(private readonly todos: TodoRepository) {}

  async execute(input: CreateTodoInput): Promise<TodoDTO> {
    const todo = Todo.create(input);
    await this.todos.save(todo);
    return toTodoDTO(todo);
  }
}
