import { useQuery } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";

/** All todos, newest first. */
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.list(),
    queryFn: todosApi.list,
  });
}