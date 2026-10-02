import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { Todo } from "../types.ts";

/**
 * Flips a todo's done status.
 * On success, the updated todo from the server replaces the old one in the
 * cache, so the list updates without refetching everything.
 */
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.toggleDone,
    onSuccess: (updated) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (todos) =>
        todos?.map((todo) => (todo._id === updated._id ? updated : todo)),
      );
      queryClient.setQueryData(todoKeys.detail(updated._id), updated);
    },
  });
}