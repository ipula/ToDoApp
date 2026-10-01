import express, { type Express } from "express";
import cors from "cors";

/**
 * Configuration the app needs from the outside world.
 * Passed in rather than read from `env` directly so the app can be
 * built in tests without real environment variables.
 */
export interface AppOptions {
  /** Origin allowed to call the API */
  corsOrigin: string;
}

/**
 * Builds and configures the Express application.
 *
 * Intentionally does not call `listen()` or connect to the database:
 * `server.ts` handles startup, and tests can pass this app straight
 * to supertest without opening a real port.
 */
export function createApp({ corsOrigin }: AppOptions): Express {
  const app = express();

  // Don't advertise the framework in response headers.
  app.disable("x-powered-by");

  // Only allow browser requests from the configured client origin.
  app.use(cors({ origin: corsOrigin }));

  // Parse JSON bodies. A todo is small, so oversized payloads are
  // rejected early (Express responds with 413).
  app.use(express.json({ limit: "10kb" }));

  // Lightweight liveness check for local testing and container health checks.
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}