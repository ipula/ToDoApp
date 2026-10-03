/** Todos shown per page. */
export const PAGE_SIZE = 10;

/**
 * Reads the page number from the URL's ?page= value.
 * Missing, non-numeric, or out-of-range values fall back to page 1,
 * so a mistyped URL still shows the list instead of an error.
 */
export function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/** Number of pages needed to show `total` todos (at least 1, for the empty list). */
export function pageCount(total: number, pageSize: number = PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** URL search string for a page. Page 1 uses the clean /todos URL. */
export function pageSearch(page: number): string {
  return page === 1 ? "" : `?page=${page}`;
}