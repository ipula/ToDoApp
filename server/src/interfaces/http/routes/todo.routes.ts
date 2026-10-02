import { Router } from "express";
import type { TodoController } from "../controllers/TodoController.ts";

/** Maps the todo endpoints to controller handlers. Mounted at /api/todos. */
export function createTodoRouter(controller: TodoController): Router {
  const router = Router();

  router.get("/", controller.list);
  router.post("/", controller.create);
  router.get("/:id", controller.get);
  router.put("/:id", controller.update);
  router.patch("/:id/done", controller.toggle);
  router.delete("/:id", controller.remove);

  return router;
}