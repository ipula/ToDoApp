import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { Todo } from "../types.ts";

/**
 * Creates a todo.
 * On success, the new todo is added to the top of the cached list
 * (matching the API's newest-first order), so no refetch is needed.
 */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: (created) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (todos) =>
        todos ? [created, ...todos] : undefined,
      );
      queryClient.setQueryData(todoKeys.detail(created._id), created);
    },
  });
}