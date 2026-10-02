import express, { type Express } from "express";
import cors from "cors";
import type { TodoController } from "./interfaces/http/controllers/TodoController.ts";
import { errorHandler } from "./interfaces/http/middleware/errorHandler.ts";
import { notFound } from "./interfaces/http/middleware/notFound.ts";
import { createTodoRouter } from "./interfaces/http/routes/todo.routes.ts";

/**
 * Everything the app needs from the outside world.
 * Passed in rather than read from `env` or created here, so tests can build
 * the app with an in-memory repository and no environment variables.
 */
export interface AppOptions {
  /** Origin allowed to call the API (the React client in development). */
  corsOrigin: string;
  todoController: TodoController;
}

/**
 * Builds and configures the Express application.
 *
 * Intentionally does not call `listen()` or connect to the database:
 * `server.ts` handles startup, and tests can pass this app straight
 * to supertest without opening a real port.
 */
export function createApp({ corsOrigin, todoController }: AppOptions): Express {
  const app = express();

  // Don't advertise the framework in response headers.
  app.disable("x-powered-by");

  // Only allow browser requests from the configured client origin.
  app.use(cors({ origin: corsOrigin }));

  // Parse JSON bodies. A todo is small, so oversized payloads are
  // rejected early (the error handler responds with 413).
  app.use(express.json({ limit: "10kb" }));

  // Lightweight liveness check for local testing and container health checks.
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/todos", createTodoRouter(todoController));

  // Must come after all routes: Express runs middleware in registration order.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}