import { Link, Navigate, useSearchParams } from "react-router";
import { getErrorMessage } from "../../../shared/api/ApiError.ts";
import { EmptyState } from "../../../shared/components/EmptyState.tsx";
import { ErrorState } from "../../../shared/components/ErrorState.tsx";
import { LoadingState } from "../../../shared/components/LoadingState.tsx";
import { Pagination } from "../components/Pagination.tsx";
import { TodoList } from "../components/TodoList.tsx";
import { useTodos } from "../hooks/useTodos.ts";
import { pageCount, pageSearch, parsePage } from "../pagination.ts";

/** Heading that states, in plain words, how much is left. */
function remainingHeading(remaining: number): string {
  if (remaining === 0) return "Everything's done";
  if (remaining === 1) return "1 thing left to do";
  return `${remaining} things left to do`;
}

/**
 * Lists todos one page at a time; the page number lives in the URL (?page=).
 * Handles every state the data can be in: loading, failed, empty, and loaded.
 */
export function TodoListPage() {
  const [searchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useTodos(page);

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

  const { todos, total, remaining } = data;

  if (total === 0) {
    return (
      <EmptyState
        title="Nothing on the list yet"
        description="Write down the first thing you need to do."
        action={<NewTodoLink />}
      />
    );
  }

  // Past the last page, e.g. after deleting the only todo on the last page,
  // or from an old link. Go to the last page that has todos.
  const totalPages = pageCount(total);
  if (todos.length === 0 && !isPlaceholderData) {
    return <Navigate to={{ search: pageSearch(totalPages) }} replace />;
  }

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          {remainingHeading(remaining)}
        </h1>
        <NewTodoLink />
      </div>

      {/* While the next page loads, the current one stays visible but dimmed. */}
      <div
        aria-busy={isPlaceholderData}
        className={`transition-opacity ${isPlaceholderData ? "opacity-60" : ""}`}
      >
        <TodoList todos={todos} />
      </div>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
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
      New Todo
    </Link>
  );
}