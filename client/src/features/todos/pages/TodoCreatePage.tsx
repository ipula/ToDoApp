import { useNavigate } from "react-router";
import { TodoForm } from "../components/TodoForm.tsx";
import { useCreateTodo } from "../hooks/useCreateTodo.ts";

/** Page for adding a new todo. Returns to the list after saving. */
export function TodoCreatePage() {
  const createTodo = useCreateTodo();
  const navigate = useNavigate();

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">New todo</h1>
      <TodoForm
        submitLabel="Add todo"
        cancelTo="/todos"
        onSubmit={async (values) => {
          await createTodo.mutateAsync({
            title: values.title,
            // Send nothing rather than an empty string when left blank.
            ...(values.description ? { description: values.description } : {}),
          });
          await navigate("/todos");
        }}
      />
    </section>
  );
}