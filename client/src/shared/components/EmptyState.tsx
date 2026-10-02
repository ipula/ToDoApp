import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  /** Optional call to action, e.g. a "New todo" link. */
  action?: ReactNode;
}

/** Friendly placeholder for when there is nothing to show yet. */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-1 text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}