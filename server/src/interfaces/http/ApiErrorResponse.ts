/** A single field-level problem, e.g. { field: "title", message: "Title is required" }. */
export interface FieldError {
  field: string;
  message: string;
}

/** Shape of every error response from the API. */
export interface ApiErrorResponse {
  error: {
    /** Stable machine-readable code, e.g. "VALIDATION_ERROR" or "TODO_NOT_FOUND". */
    code: string;
    /** Human-readable message, safe to show to users. */
    message: string;
    /** Present for validation errors. */
    details?: FieldError[];
  };
}
