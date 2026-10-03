import { createBrowserRouter, Navigate } from "react-router";
import { TodoCreatePage } from "../features/todos/pages/TodoCreatePage.tsx";
import { TodoEditPage } from "../features/todos/pages/TodoEditPage.tsx";
import { TodoListPage } from "../features/todos/pages/TodoListPage.tsx";
import { PlaceholderPage } from "../shared/pages/PlaceholderPage.tsx";
import { RootLayout } from "./layouts/RootLayout.tsx";

/**
 * Route table. Every page renders inside RootLayout (header + centered column).
 * Anything not built yet falls through to the common placeholder page.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Navigate to="/todos" replace /> },
      { path: "/todos", element: <TodoListPage /> },
      { path: "/todos/new", element: <TodoCreatePage /> },
      { path: "/todos/:id/edit", element: <TodoEditPage /> },
      { path: "*", element: <PlaceholderPage title="Common page" /> },
    ],
  },
]);