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