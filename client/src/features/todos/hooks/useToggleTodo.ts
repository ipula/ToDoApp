import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { TodoPage } from "../types.ts";

/**
 * Flips a todo's done status.
 *
 * On success, every cached page is updated in place: the todo is swapped
 * for the server's version, and the "remaining" count (which covers the
 * whole list) moves by one. No refetch is needed.
 */
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.toggleDone,
    onSuccess: (updated) => {
      queryClient.setQueriesData<TodoPage>({ queryKey: todoKeys.lists() }, (page) =>
        page
          ? {
              ...page,
              todos: page.todos.map((todo) => (todo._id === updated._id ? updated : todo)),
              remaining: page.remaining + (updated.done ? -1 : 1),
            }
          : page,
      );
      queryClient.setQueryData(todoKeys.detail(updated._id), updated);
    },
  });
}