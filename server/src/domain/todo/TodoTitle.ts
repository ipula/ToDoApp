import { ValidationError } from "../shared/ValidationError.ts";

/**
 * A todo's title. Guaranteed non-empty, trimmed, and within the length limit,
 * so an invalid title cannot exist anywhere in the system.
 */
export class TodoTitle {
  static readonly MAX_LENGTH = 100;

  private constructor(readonly value: string) {}

  static create(raw: string): TodoTitle {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      throw new ValidationError("title", "Title is required");
    }
    if (trimmed.length > TodoTitle.MAX_LENGTH) {
      throw new ValidationError(
        "title",
        `Title must be at most ${TodoTitle.MAX_LENGTH} characters`,
      );
    }

    return new TodoTitle(trimmed);
  }
}
