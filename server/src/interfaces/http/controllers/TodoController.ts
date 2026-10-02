import type { Request, Response } from "express";
import type { CreateTodo } from "../../../application/todo/use-cases/CreateTodo.ts";
import type { DeleteTodo } from "../../../application/todo/use-cases/DeleteTodo.ts";
import type { GetTodo } from "../../../application/todo/use-cases/GetTodo.ts";
import type { ListTodos } from "../../../application/todo/use-cases/ListTodos.ts";
import type { ToggleTodo } from "../../../application/todo/use-cases/ToggleTodo.ts";
import type { UpdateTodo } from "../../../application/todo/use-cases/UpdateTodo.ts";
import { createTodoBodySchema, updateTodoBodySchema } from "../validation/todo.schemas.ts";

/** The use cases the controller delegates to, injected by the container. */
export interface TodoUseCases {
  listTodos: ListTodos;
  getTodo: GetTodo;
  createTodo: CreateTodo;
  updateTodo: UpdateTodo;
  toggleTodo: ToggleTodo;
  deleteTodo: DeleteTodo;
}

/** Route params for `/:id` routes. */
interface IdParams {
  id: string;
}

/**
 * Translates HTTP requests into use case calls and results into HTTP responses.
 *
 * Contains no business logic. Handlers are arrow-function properties so they
 * keep `this` when passed to the router (`router.get("/", controller.list)`).
 * Errors are not caught here: Express 5 forwards rejected promises to the
 * error handler automatically.
 */
export class TodoController {
  constructor(private readonly useCases: TodoUseCases) {}

  /** GET /api/todos */
  list = async (_req: Request, res: Response): Promise<void> => {
    const todos = await this.useCases.listTodos.execute();
    res.json(todos);
  };

  /** GET /api/todos/:id */
  get = async (req: Request<IdParams>, res: Response): Promise<void> => {
    const todo = await this.useCases.getTodo.execute(req.params.id);
    res.json(todo);
  };

  /** POST /api/todos */
  create = async (req: Request, res: Response): Promise<void> => {
    const input = createTodoBodySchema.parse(req.body);
    const todo = await this.useCases.createTodo.execute(input);
    res.status(201).json(todo);
  };

  /** PUT /api/todos/:id */
  update = async (req: Request<IdParams>, res: Response): Promise<void> => {
    const input = updateTodoBodySchema.parse(req.body);
    const todo = await this.useCases.updateTodo.execute(req.params.id, input);
    res.json(todo);
  };

  /** PATCH /api/todos/:id/done */
  toggle = async (req: Request<IdParams>, res: Response): Promise<void> => {
    const todo = await this.useCases.toggleTodo.execute(req.params.id);
    res.json(todo);
  };

  /** DELETE /api/todos/:id */
  remove = async (req: Request<IdParams>, res: Response): Promise<void> => {
    await this.useCases.deleteTodo.execute(req.params.id);
    res.status(204).end();
  };
}