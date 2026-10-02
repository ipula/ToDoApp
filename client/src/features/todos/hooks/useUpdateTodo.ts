import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { Todo, UpdateTodoInput } from "../types.ts";

/**
 * Updates a todo's title and/or description.
 * On success, the updated todo from the server replaces the old one in the
 * cache, so the list shows the change without refetching everything.
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todosApi.update(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData<Todo[]>(todoKeys.list(), (todos) =>
        todos?.map((todo) => (todo._id === updated._id ? updated : todo)),
      );
      queryClient.setQueryData(todoKeys.detail(updated._id), updated);
    },
  });
}