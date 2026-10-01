/**
 * Base class for all errors raised by the domain.
 *
 * Each subclass has a stable `code` so the HTTP layer can map errors
 * to status codes without the domain knowing anything about HTTP.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    // Use the concrete subclass name (e.g. "TodoNotFoundError") in logs.
    this.name = new.target.name;
  }
}
