import { ValidationError } from "../shared/ValidationError.ts";

/**
 * A todo's optional description.
 *
 * "No description" is represented as an empty string rather than null,
 * which keeps the rest of the code free of null checks.
 */
export class TodoDescription {
  static readonly MAX_LENGTH = 500;

  private constructor(readonly value: string) {}

  static create(raw: string | undefined): TodoDescription {
    const trimmed = (raw ?? "").trim();

    if (trimmed.length > TodoDescription.MAX_LENGTH) {
      throw new ValidationError(
        "description",
        `Description must be at most ${TodoDescription.MAX_LENGTH} characters`,
      );
    }

    return new TodoDescription(trimmed);
  }

  get isEmpty(): boolean {
    return this.value.length === 0;
  }
}
