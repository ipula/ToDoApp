import type { Todo } from "../types.ts";
import { TodoItem } from "./TodoItem.tsx";

interface TodoListProps {
  todos: Todo[];
}

/** Renders todos in the order given (the API returns newest first). */
export function TodoList({ todos }: TodoListProps) {
  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </ul>
  );
}