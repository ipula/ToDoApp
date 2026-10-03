import mongoose from "mongoose";
import { createApp } from "./app.ts";
import { env } from "./infrastructure/config/env.ts";
import { createContainer } from "./container.ts";
import { MongoTodoRepository } from "./infrastructure/persistence/mongo/todo/MongoTodoRepository.ts";

/** How long to wait for open requests to finish before forcing exit. */
const SHUTDOWN_TIMEOUT_MS = 10_000;

/**
 * Application entry point: connects to MongoDB, then starts the HTTP server.
 *
 * The database connection is established first so the API never accepts
 * requests it can't serve.
 */
async function main(): Promise<void> {
  // Fail fast on a bad connection string instead of waiting
  // for the driver's default 30-second server selection timeout.
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5_000 });
  console.log("Connected to MongoDB");

  const { todoController } = createContainer(new MongoTodoRepository());
  const app = createApp({ corsOrigin: env.CORS_ORIGIN, todoController });

  const server = app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });

  // Startup errors such as the port already being in use.
  server.on("error", (error) => {
    console.error("HTTP server error:", error);
    process.exit(1);
  });

  /**
   * Graceful shutdown: stop accepting new connections, let in-flight
   * requests finish, then close the database connection.
   * tsx watch sends SIGTERM on every restart, and Docker sends it on stop.
   */
  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`${signal} received, shutting down...`);

    // Safety net: force exit if connections don't drain in time.
    // unref() stops this timer from keeping the process alive by itself.
    setTimeout(() => {
      console.error("Shutdown timed out, forcing exit");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();

    server.close(() => {
      mongoose
        .disconnect()
        .then(() => process.exit(0))
        .catch((error: unknown) => {
          console.error("Error during MongoDB disconnect:", error);
          process.exit(1);
        });
    });
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

main().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
