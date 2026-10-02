import type { Todo } from "../types.ts";

interface TodoItemProps {
  todo: Todo;
}

/**
 * A single todo row.
 * Done todos are faded with a strikethrough so they read as completed at a glance.
 */
export function TodoItem({ todo }: TodoItemProps) {
  return (
    <li
      className={`rounded-lg border border-slate-200 bg-white p-4 transition-opacity ${
        todo.done ? "opacity-60" : ""
      }`}
    >
      <p className={`font-medium ${todo.done ? "text-slate-500 line-through" : ""}`}>
        {todo.title}
      </p>
      {todo.description && <p className="mt-1 text-sm text-slate-600">{todo.description}</p>}
    </li>
  );
}