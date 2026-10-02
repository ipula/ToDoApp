interface ErrorStateProps {
  /** User-friendly explanation of what went wrong. */
  message: string;
  /** Shows a "Try again" button when provided. */
  onRetry?: () => void;
}

/** Full-width error message with an optional retry action. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-800">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}