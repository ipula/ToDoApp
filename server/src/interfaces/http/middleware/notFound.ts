import type { RequestHandler } from "express";
import type { ApiErrorResponse } from "../ApiErrorResponse.ts";

/** Catches requests that matched no route. Registered after all routes. */
export const notFound: RequestHandler = (req, res) => {
  const body: ApiErrorResponse = {
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  };
  res.status(404).json(body);
};