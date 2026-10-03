import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { todoKeys } from "../api/queryKeys.ts";
import { todosApi } from "../api/todosApi.ts";
import { PAGE_SIZE } from "../pagination.ts";

/**
 * One page of todos, newest first.
 *
 * keepPreviousData keeps the current page on screen while the next one
 * loads, so changing pages doesn't flash a loading spinner.
 */
export function useTodos(page: number) {
  return useQuery({
    queryKey: todoKeys.list(page),
    queryFn: () => todosApi.list(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  });
}