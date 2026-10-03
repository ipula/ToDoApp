/**
 * Query keys for TanStack Query, defined in one place so reads and
 * cache updates always use the same keys.
 *
 * Hierarchical: `lists()` matches every cached page at once, which is
 * how mutations update or refresh all pages together.
 */
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (page: number) => [...todoKeys.lists(), page] as const,
  detail: (id: string) => [...todoKeys.all, "detail", id] as const,
};