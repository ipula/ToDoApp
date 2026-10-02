import { Link } from "react-router";
import { getErrorMessage } from "../../../shared/api/ApiError.ts";
import { EmptyState } from "../../../shared/components/EmptyState.tsx";
import { ErrorState } from "../../../shared/components/ErrorState.tsx";
import { LoadingState } from "../../../shared/components/LoadingState.tsx";
import { TodoList } from "../components/TodoList.tsx";
import { useTodos } from "../hooks/useTodos.ts";

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
        title="No todos yet"
        description="Add your first todo to get started."
        action={<NewTodoLink />}
      />
    );
  }

  const remaining = todos.filter((todo) => !todo.done).length;

  return (
    <section>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your todos</h1>
          <p className="text-sm text-slate-500">
            {remaining} of {todos.length} remaining
          </p>
        </div>
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
      className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
    >
      New todo
    </Link>
  );
}