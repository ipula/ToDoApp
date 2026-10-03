import { useMutation, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { TodoPage, UpdateTodoInput } from "../types.ts";

/**
 * Updates a todo's title and/or description.
 * On success, the server's version replaces the old one on whichever
 * cached page holds it. Counts don't change, so no refetch is needed.
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      todosApi.update(id, input),
    onSuccess: (updated) => {
      queryClient.setQueriesData<TodoPage>({ queryKey: todoKeys.lists() }, (page) =>
        page
          ? {
              ...page,
              todos: page.todos.map((todo) => (todo._id === updated._id ? updated : todo)),
            }
          : page,
      );
      queryClient.setQueryData(todoKeys.detail(updated._id), updated);
    },
  });
}