import { Link } from "react-router";
import { pageSearch } from "../pagination.ts";

interface PaginationProps {
  page: number;
  totalPages: number;
}

const linkClass = "rounded-md px-3 py-1.5 font-medium hover:bg-paper";
const disabledClass = "px-3 py-1.5 text-ink-soft/50";

/**
 * Previous / next links between pages of the list.
 * They change the URL's ?page= value, so back, refresh, and sharing all work.
 */
export function Pagination({ page, totalPages }: PaginationProps) {
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav aria-label="Pages" className="mt-4 flex items-center justify-between text-sm">
      {hasPrevious ? (
        <Link to={{ search: pageSearch(page - 1) }} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span aria-hidden="true" className={disabledClass}>
          Previous
        </span>
      )}

      <p aria-current="page" className="text-ink-soft tabular-nums">
        Page {page} of {totalPages}
      </p>

      {hasNext ? (
        <Link to={{ search: pageSearch(page + 1) }} className={linkClass}>
          Next
        </Link>
      ) : (
        <span aria-hidden="true" className={disabledClass}>
          Next
        </span>
      )}
    </nav>
  );
}