interface ErrorStateProps {
  /** User-friendly explanation of what went wrong. */
  message: string;
  /** Shows a "Try again" button when provided. */
  onRetry?: () => void;
}

/** Error message on the page, marked with the margin red, with an optional retry. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="paper-sheet border-l-4 border-margin p-6">
      <p className="font-medium">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
        >
          Try again
        </button>
      )}
    </div>
  );
}