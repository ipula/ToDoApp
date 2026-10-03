import { ApiError, type ApiErrorResponse } from "./ApiError.ts";

/** Empty in development: requests go to /api/... and Vite proxies them. */
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** Serialized as JSON when present. */
  body?: unknown;
}

/** Parsed response body together with the response headers. */
export interface ApiResponse<T> {
  data: T;
  headers: Headers;
}

/**
 * Sends a request to the API and returns the parsed JSON body plus headers.
 * Use this when the response carries information in headers (e.g. paging counts).
 *
 * Every failure is converted into an ApiError, so callers never need to
 * check `response.ok` or handle raw fetch errors themselves:
 * - server unreachable          -> ApiError(status 0, "NETWORK_ERROR")
 * - error response from the API -> ApiError with the API's code and message
 */
export async function requestWithHeaders<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { method = "GET", body } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Can't reach the server. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  // 204 No Content (e.g. DELETE) has no body to parse.
  const data: unknown = response.status === 204 ? undefined : await response.json();
  return { data: data as T, headers: response.headers };
}

/** Sends a request to the API and returns just the parsed JSON body. */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data } = await requestWithHeaders<T>(path, options);
  return data;
}

/** Reads the API's error body, falling back to a generic error if it isn't JSON. */
async function toApiError(response: Response): Promise<ApiError> {
  try {
    const { error } = (await response.json()) as ApiErrorResponse;
    return new ApiError(response.status, error.code, error.message, error.details);
  } catch {
    return new ApiError(
      response.status,
      "UNKNOWN_ERROR",
      "Something went wrong. Please try again.",
    );
  }
}