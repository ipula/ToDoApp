interface EmptyStateProps {
  title: string;
  description: string;
}

/** Friendly placeholder for when there is nothing to show yet. */
export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-1 text-slate-500">{description}</p>
    </div>
  );
}