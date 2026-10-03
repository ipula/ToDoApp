import { z } from "zod";

/**
 * Request body schemas.
 *
 * These check the *shape* of the request (is `title` a string? any unknown
 * fields?). Business rules such as "title must not be empty" or length
 * limits live in the domain value objects, so they are not repeated here.
 *
 * Strict objects reject unknown keys, e.g. sending `done` to PUT returns a
 * clear 400 instead of being silently ignored.
 */
export const createTodoBodySchema = z.strictObject(
  {
    title: z.string({ error: "Title is required and must be a string" }),
    description: z.string({ error: "Description must be a string" }).optional(),
  },
  { error: "Request body must be a JSON object" },
);

export const updateTodoBodySchema = z
  .strictObject(
    {
      title: z.string({ error: "Title must be a string" }).optional(),
      description: z.string({ error: "Description must be a string" }).optional(),
    },
    { error: "Request body must be a JSON object" },
  )
  .refine((body) => body.title !== undefined || body.description !== undefined, {
    error: "Provide a title and/or a description to update",
  });

  /** Page size used when `page` is given without `limit`. */
export const DEFAULT_PAGE_SIZE = 10;
/** Largest page a client may request, so one request can't load everything. */
export const MAX_PAGE_SIZE = 100;

/**
 * Query string for GET /api/todos.
 *
 * Neither `page` nor `limit` -> undefined, meaning "return all todos"
 * (the original contract). Either one -> a page, with defaults filled in.
 * Query values arrive as strings, so they are coerced to numbers.
 */
export const listTodosQuerySchema = z
  .object({
    page: z.coerce
      .number({ error: "Page must be a number" })
      .int("Page must be a whole number")
      .min(1, "Page must be 1 or more")
      .optional(),
    limit: z.coerce
      .number({ error: "Limit must be a number" })
      .int("Limit must be a whole number")
      .min(1, "Limit must be 1 or more")
      .max(MAX_PAGE_SIZE, `Limit must be at most ${MAX_PAGE_SIZE}`)
      .optional(),
  })
  .transform(({ page, limit }) =>
    page === undefined && limit === undefined
      ? undefined
      : { page: page ?? 1, limit: limit ?? DEFAULT_PAGE_SIZE },
  );