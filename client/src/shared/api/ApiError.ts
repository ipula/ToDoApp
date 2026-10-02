/** A single field-level problem returned by the API. */
export interface FieldError {
  field: string;
  message: string;
}

/** Shape of every error response from the API (mirrors the server). */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: FieldError[];
  };
}

/**
 * Error thrown for any failed API call, so components handle one error type.
 *
 * - `status` is the HTTP status, or 0 when the server couldn't be reached.
 * - `code` is the API's machine-readable code, e.g. "VALIDATION_ERROR".
 * - `details` holds field-level messages for validation errors.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: FieldError[];

  constructor(status: number, code: string, message: string, details: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** Message for a specific form field, if the API reported one. */
  fieldMessage(field: string): string | undefined {
    return this.details.find((detail) => detail.field === field)?.message;
  }
}

/**
 * Turns any error into a message that is safe and useful to show users.
 * Unknown errors get a generic message instead of technical details.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}