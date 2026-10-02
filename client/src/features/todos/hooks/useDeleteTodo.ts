import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";

/**
 * Deletes a todo.
 *
 * Removing one todo pulls one up from each following page, so every
 * cached page is refreshed rather than patched.
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.remove,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: todoKeys.detail(id) });
      return queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}