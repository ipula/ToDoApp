interface LoadingStateProps {
  /** What is loading, read out by screen readers and shown under the spinner. */
  label: string;
}

/** Centered spinner for content that is still loading. */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-slate-500">
      <span className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      <span>{label}</span>
    </div>
  );
}