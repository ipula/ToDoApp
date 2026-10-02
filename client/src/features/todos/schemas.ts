import { z } from "zod";

/** Same limits as the server's TodoTitle and TodoDescription value objects. */
export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

/**
 * Validation for the create and edit forms.
 *
 * Mirrors the server's business rules so users get instant feedback.
 * The server still validates everything: this is for UX, not security.
 */
export const todoFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(TITLE_MAX_LENGTH, `Title must be at most ${TITLE_MAX_LENGTH} characters`),
  description: z
    .string()
    .trim()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters`,
    ),
});

/** Values as typed into the form. */
export type TodoFormInput = z.input<typeof todoFormSchema>;
/** Values after validation (trimmed), passed to onSubmit. */
export type TodoFormValues = z.output<typeof todoFormSchema>;