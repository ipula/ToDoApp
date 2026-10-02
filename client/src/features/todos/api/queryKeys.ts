/**
 * Query keys for TanStack Query, defined in one place so reads and
 * cache updates always use the same keys.
 *
 * Hierarchical: invalidating `todoKeys.all` also invalidates every
 * list and detail query below it.
 */
export const todoKeys = {
  all: ["todos"] as const,
  list: () => [...todoKeys.all, "list"] as const,
  detail: (id: string) => [...todoKeys.all, "detail", id] as const,
};