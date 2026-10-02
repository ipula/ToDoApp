import { useState } from "react";
import { getErrorMessage } from "../../../shared/api/ApiError.ts";
import { useDeleteTodo } from "../hooks/useDeleteTodo.ts";
import { useToggleTodo } from "../hooks/useToggleTodo.ts";
import type { Todo } from "../types.ts";

interface TodoItemProps {
  todo: Todo;
}

/**
 * A single todo row with its own toggle and delete actions.
 *
 * Each row owns its mutations, so a pending request or an error only
 * affects that row, not the whole list. Done todos are faded with a
 * strikethrough so they read as completed at a glance.
 */
export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isBusy = toggleTodo.isPending || deleteTodo.isPending;
  const error = toggleTodo.error ?? deleteTodo.error;
  const checkboxId = `todo-${todo._id}`;

  // Busy rows are dimmed and not clickable; done rows are faded.
  const rowState = isBusy ? "pointer-events-none opacity-50" : todo.done ? "opacity-60" : "";

  return (
    <li
      className={`rounded-lg border border-slate-200 bg-white p-4 transition-opacity ${rowState}`}
      aria-busy={isBusy}
    >
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          checked={todo.done}
          disabled={isBusy}
          onChange={() => {
            toggleTodo.mutate(todo._id);
          }}
          className="mt-1 size-5 shrink-0 cursor-pointer accent-blue-600"
        />

        {/* Clicking the text toggles too, via the label. */}
        <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
          <span
            className={`block font-medium break-words ${
              todo.done ? "text-slate-500 line-through" : ""
            }`}
          >
            {todo.title}
          </span>
          {todo.description && (
            <span className="mt-1 block text-sm break-words text-slate-600">
              {todo.description}
            </span>
          )}
        </label>

        <div className="flex shrink-0 items-center gap-2 text-sm">
          {isConfirmingDelete ? (
            <>
              <span className="text-slate-600">Delete?</span>
              <button
                type="button"
                onClick={() => {
                  deleteTodo.mutate(todo._id);
                }}
                className="rounded-md bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-700"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsConfirmingDelete(false);
                }}
                className="rounded-md px-3 py-1 text-slate-600 hover:bg-slate-100"
              >
                No
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsConfirmingDelete(true);
              }}
              aria-label={`Delete "${todo.title}"`}
              className="rounded-md px-3 py-1 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}
    </li>
  );
}