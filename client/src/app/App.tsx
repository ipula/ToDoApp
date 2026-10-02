import { RouterProvider } from "react-router/dom";
import { Providers } from "./providers.tsx";
import { router } from "./router.tsx";

/** Root component: app-wide providers wrapped around the router. */
export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}