interface LoadingStateProps {
  /** What is loading, read out by screen readers and shown under the spinner. */
  label: string;
}

/** Centered spinner for content that is still loading. */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 py-16 text-ink-soft">
      <span className="size-7 animate-spin rounded-full border-[3px] border-rule border-t-ink" />
      <span>{label}</span>
    </div>
  );
}