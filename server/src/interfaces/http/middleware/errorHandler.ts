import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ValidationError } from "../../../domain/shared/ValidationError.ts";
import { TodoNotFoundError } from "../../../domain/todo/errors.ts";
import type { ApiErrorResponse } from "../ApiErrorResponse.ts";

interface HttpErrorResult {
  status: number;
  body: ApiErrorResponse;
}

/**
 * Central error handler: the only place errors become HTTP responses.
 *
 * Maps known errors to status codes with user-friendly messages. Anything
 * unexpected becomes a generic 500, and the real error is logged rather
 * than leaked to the client.
 *
 * Express recognises error handlers by their four parameters, so `_next`
 * must stay even though it is unused.
 */
export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  const { status, body } = toHttpError(error);

  if (status >= 500) {
    console.error(error);
  }
  res.status(status).json(body);
};

function toHttpError(error: unknown): HttpErrorResult {
  // Request body has the wrong shape (from the zod schemas).
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        error: {
          code: "VALIDATION_ERROR",
          message: "The request is invalid",
          details: error.issues.map((issue) => ({
            field: issue.path.join(".") || "body",
            message: issue.message,
          })),
        },
      },
    };
  }

  // A business rule was broken (from the domain value objects).
  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: [{ field: error.field, message: error.message }],
        },
      },
    };
  }

  if (error instanceof TodoNotFoundError) {
    return { status: 404, body: { error: { code: error.code, message: error.message } } };
  }

  // Errors raised by express.json() while reading the body.
  if (isBodyParserError(error, "entity.parse.failed")) {
    return {
      status: 400,
      body: { error: { code: "INVALID_JSON", message: "Request body is not valid JSON" } },
    };
  }
  if (isBodyParserError(error, "entity.too.large")) {
    return {
      status: 413,
      body: { error: { code: "PAYLOAD_TOO_LARGE", message: "Request body is too large" } },
    };
  }

  return {
    status: 500,
    body: { error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." } },
  };
}

/** express.json() errors carry a `type` field identifying what went wrong. */
function isBodyParserError(error: unknown, type: string): boolean {
  return error instanceof Error && "type" in error && error.type === type;
}