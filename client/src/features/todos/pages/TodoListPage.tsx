import { Link } from "react-router";
import { getErrorMessage } from "../../../shared/api/ApiError.ts";
import { EmptyState } from "../../../shared/components/EmptyState.tsx";
import { ErrorState } from "../../../shared/components/ErrorState.tsx";
import { LoadingState } from "../../../shared/components/LoadingState.tsx";
import { TodoList } from "../components/TodoList.tsx";
import { useTodos } from "../hooks/useTodos.ts";

/** Heading that states, in plain words, how much is left. */
function remainingHeading(remaining: number): string {
  if (remaining === 0) return "Everything's done";
  if (remaining === 1) return "1 thing left to do";
  return `${remaining} things left to do`;
}

/**
 * Lists all todos.
 * Handles every state the data can be in: loading, failed, empty, and loaded.
 */
export function TodoListPage() {
  const { data: todos, isPending, isError, error, refetch } = useTodos();

  if (isPending) {
    return <LoadingState label="Loading your todos…" />;
  }

  if (isError) {
    return (
      <ErrorState
        message={getErrorMessage(error)}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (todos.length === 0) {
    return (
      <EmptyState
        title="Nothing on the list yet"
        description="Write down the first thing you need to do."
        action={<NewTodoLink />}
      />
    );
  }

  const remaining = todos.filter((todo) => !todo.done).length;

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          {remainingHeading(remaining)}
        </h1>
        <NewTodoLink />
      </div>
      <TodoList todos={todos} />
    </section>
  );
}

/** Primary call to action, shown in the header and in the empty state. */
function NewTodoLink() {
  return (
    <Link
      to="/todos/new"
      viewTransition
      className="shrink-0 rounded-md bg-ink px-4 py-2 font-medium text-paper hover:bg-ink/90"
    >
      New todo
    </Link>
  );
}