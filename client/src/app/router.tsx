import { createBrowserRouter } from "react-router";
import { PlaceholderPage } from "../shared/pages/PlaceholderPage.tsx";

/** Minimal router: every URL shows the common placeholder page. */
export const router = createBrowserRouter([
  { path: "*", element: <PlaceholderPage title="Common page" /> },
]);