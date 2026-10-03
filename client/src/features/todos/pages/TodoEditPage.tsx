import { Link, useNavigate, useParams } from "react-router";
import { ApiError, getErrorMessage } from "../../../shared/api/ApiError.ts";
import { EmptyState } from "../../../shared/components/EmptyState.tsx";
import { ErrorState } from "../../../shared/components/ErrorState.tsx";
import { LoadingState } from "../../../shared/components/LoadingState.tsx";
import { TodoForm } from "../components/TodoForm.tsx";
import { useTodo } from "../hooks/useTodo.ts";
import { useUpdateTodo } from "../hooks/useUpdateTodo.ts";

/**
 * Page for editing a todo's title and description.
 *
 * Works when opened from the list (instant, using the cached copy) and when
 * opened directly or refreshed (fetches GET /api/todos/:id).
 */
export function TodoEditPage() {
  // The route is /todos/:id/edit, so the param is always present here.
  const { id = "" } = useParams<{ id: string }>();
  const { data: todo, isPending, isError, error, refetch } = useTodo(id);
  const updateTodo = useUpdateTodo();
  const navigate = useNavigate();

  if (isPending) {
    return <LoadingState label="Loading todo…" />;
  }

  if (isError) {
    // Unknown id (404) or malformed id (400): the todo doesn't exist.
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) {
      return (
        <EmptyState
          title="Todo not found"
          description="It may have been deleted."
          action={
            <Link to="/todos" viewTransition className="font-medium underline underline-offset-4">
              Back to your todos
            </Link>
          }
        />
      );
    }
    return (
      <ErrorState
        message={getErrorMessage(error)}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Edit Todo</h1>
      <TodoForm
        // Remount with fresh values if the todo changes on the server
        // while this page is open (e.g. a background refetch).
        key={todo.updatedAt}
        defaultValues={{ title: todo.title, description: todo.description ?? "" }}
        submitLabel="Save changes"
        cancelTo="/todos"
        onSubmit={async (values) => {
          // Always send both fields: an empty description clears it.
          await updateTodo.mutateAsync({ id, input: values });
          await navigate("/todos", { viewTransition: true });
        }}
      />
    </section>
  );
}