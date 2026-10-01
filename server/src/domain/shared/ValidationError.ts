import { DomainError } from "./DomainError.ts";

/**
 * Raised when input breaks a business rule (e.g. an empty title).
 * `field` lets the client show the message next to the right input.
 */
export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR";

  constructor(
    readonly field: string,
    message: string,
  ) {
    super(message);
  }
}
