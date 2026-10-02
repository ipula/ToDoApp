import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { Todo } from "../types.ts";

/**
 * Deletes a todo.
 * On success, it is removed from the cached list and its detail entry is
 * dropped, so the list updates without refetching everything.
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.remove,
    onSuccess: (_data, id) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (todos) =>
        todos?.filter((todo) => todo._id !== id),
      );
      queryClient.removeQueries({ queryKey: todoKeys.detail(id) });
    },
  });
}