import { DomainError } from "../shared/DomainError.ts";

/** Raised when no todo exists with the given id. */
export class TodoNotFoundError extends DomainError {
  readonly code = "TODO_NOT_FOUND";

  constructor(readonly todoId: string) {
    super(`Todo with id "${todoId}" was not found`);
  }
}
