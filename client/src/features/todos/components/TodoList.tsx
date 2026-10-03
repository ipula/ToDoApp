import type { Todo } from "../types.ts";
import { TodoItem } from "./TodoItem.tsx";

interface TodoListProps {
  todos: Todo[];
}

/**
 * The todos written on one ruled sheet (newest first, as the API returns them).
 * The red margin line runs down the left, with the checkboxes sitting in it.
 */
export function TodoList({ todos }: TodoListProps) {
  return (
    <ul className="paper-sheet relative overflow-hidden before:absolute before:inset-y-0 before:left-12 before:w-px before:bg-margin/70 sm:before:left-14">
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </ul>
  );
}