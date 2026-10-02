import { useQuery, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { Todo } from "../types.ts";

/**
 * A single todo.
 *
 * If the list is already cached (e.g. the user clicked through from the
 * list page), that copy is shown immediately while a fresh one loads.
 */
export function useTodo(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todosApi.get(id),
    placeholderData: () =>
      queryClient.getQueryData<Todo[]>(todoKeys.list())?.find((todo) => todo._id === id),
  });
}