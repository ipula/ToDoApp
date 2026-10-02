import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  /** Optional call to action, e.g. a "New todo" link. */
  action?: ReactNode;
}

/** A blank ruled page with a short prompt, for when there is nothing to show yet. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="paper-sheet relative overflow-hidden px-6 py-14 text-center">
      <p className="text-xl font-semibold">{title}</p>
      <p className="mt-1 text-ink-soft">{description}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}