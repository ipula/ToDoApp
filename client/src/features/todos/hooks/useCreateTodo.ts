import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";

/**
 * Creates a todo.
 *
 * A new todo goes to the top of page 1 and pushes one todo onto each
 * following page, so every cached page is refreshed rather than patched.
 */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: (created) => {
      queryClient.setQueryData(todoKeys.detail(created._id), created);
      return queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
  });
}