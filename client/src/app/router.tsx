import { createBrowserRouter, Navigate } from "react-router";
import { TodoListPage } from "../features/todos/pages/TodoListPage.tsx";
import { PlaceholderPage } from "../shared/pages/PlaceholderPage.tsx";

/**
 * Route table. Pages are added one at a time; anything not built yet
 * falls through to the common placeholder page.
 */
export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/todos" replace /> },
  { path: "/todos", element: <TodoListPage /> },
  { path: "*", element: <PlaceholderPage title="Common page" /> },
]);