import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ApiError } from "../shared/api/ApiError.ts";

/** Maximum automatic retries for a failed query. */
const MAX_RETRIES = 1;

/**
 * Retry only failures that might succeed on a second attempt (network errors,
 * 5xx). A 4xx such as 404 Not Found would fail again, so it is shown at once.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  const isClientError = error instanceof ApiError && error.status >= 400 && error.status < 500;
  return !isClientError && failureCount < MAX_RETRIES;
}

/**
 * App-wide context providers.
 *
 * The QueryClient lives in state so it is created once per app instance
 * and survives re-renders.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Todos change only through this app, so a short stale time is enough
            // to avoid refetching on every navigation between list and detail.
            staleTime: 30_000,
            retry: shouldRetry,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}