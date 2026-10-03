import { useQuery, useQueryClient } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import type { TodoPage } from "../types.ts";

/**
 * A single todo.
 *
 * If it is on any cached page of the list (e.g. the user clicked through
 * from the list), that copy is shown immediately while a fresh one loads.
 */
export function useTodo(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todosApi.get(id),
    placeholderData: () =>
      queryClient
        .getQueriesData<TodoPage>({ queryKey: todoKeys.lists() })
        .flatMap(([, page]) => page?.todos ?? [])
        .find((todo) => todo._id === id),
  });
}