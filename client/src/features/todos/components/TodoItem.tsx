import { useState } from "react";
import { Link } from "react-router";
import { getErrorMessage } from "../../../shared/api/ApiError.ts";
import { useDeleteTodo } from "../hooks/useDeleteTodo.ts";
import { useToggleTodo } from "../hooks/useToggleTodo.ts";
import type { Todo } from "../types.ts";

interface TodoItemProps {
  todo: Todo;
}

/**
 * One line on the sheet: checkbox in the margin, the todo, and its actions.
 *
 * Each row owns its mutations, so a pending request or an error only
 * affects that row. Checking a todo draws an ink line through its title
 * (see .todo-title in index.css).
 */
export function TodoItem({ todo }: TodoItemProps) {
  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isBusy = toggleTodo.isPending || deleteTodo.isPending;
  const error = toggleTodo.error ?? deleteTodo.error;
  const checkboxId = `todo-${todo._id}`;

  return (
    <li
      aria-busy={isBusy}
      className={`group border-b border-rule last:border-b-0 ${
        isBusy ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <div className="flex min-h-14 items-start">
        {/* Margin column */}
        <div className="flex w-12 shrink-0 justify-center pt-[1.15rem] sm:w-14">
          <input
            id={checkboxId}
            type="checkbox"
            checked={todo.done}
            disabled={isBusy}
            onChange={() => {
              toggleTodo.mutate(todo._id);
            }}
            className="todo-checkbox"
          />
        </div>

        {/*
          Text and actions: stacked on narrow screens so titles get the full
          width, side by side from the sm breakpoint up.
        */}
        <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-start">
          {/* Clicking the text toggles too, via the label. */}
          <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer py-4 pr-4 pl-4">
            <span
              data-done={todo.done}
              className="todo-title text-[1.0625rem] leading-snug font-medium break-words"
            >
              {todo.title}
            </span>
            {todo.description && (
              <span
                className={`mt-1 block text-sm leading-relaxed break-words text-ink-soft transition-opacity ${
                  todo.done ? "opacity-60" : ""
                }`}
              >
                {todo.description}
              </span>
            )}
          </label>

          {/*
            With a mouse, actions appear on hover or keyboard focus to keep the
            sheet calm; on touch screens they are always visible.
          */}
          <div
            className={`-mt-2 flex shrink-0 items-center gap-1 pb-3 pl-2 text-sm transition-opacity sm:mt-0 sm:py-3 sm:pr-3 sm:pl-0 ${
              isConfirmingDelete
                ? ""
                : "pointer-fine:opacity-0 pointer-fine:group-focus-within:opacity-100 pointer-fine:group-hover:opacity-100"
            }`}
          >
            {isConfirmingDelete ? (
              <>
                <span className="pr-1 text-ink-soft">Delete?</span>
                <button
                  type="button"
                  onClick={() => {
                    deleteTodo.mutate(todo._id);
                  }}
                  className="rounded-md bg-margin px-3 py-1 font-medium text-paper hover:bg-margin/90"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmingDelete(false);
                  }}
                  className="rounded-md px-3 py-1 text-ink-soft hover:bg-desk"
                >
                  Keep
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/todos/${todo._id}/edit`}
                  viewTransition
                  aria-label={`Edit "${todo.title}"`}
                  className="rounded-md px-3 py-1 text-ink-soft hover:bg-desk hover:text-ink"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmingDelete(true);
                  }}
                  aria-label={`Delete "${todo.title}"`}
                  className="rounded-md px-3 py-1 text-ink-soft hover:bg-margin/10 hover:text-margin"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="pb-3 pl-16 text-sm text-margin sm:pl-[4.5rem]">
          {getErrorMessage(error)}
        </p>
      )}
    </li>
  );
}