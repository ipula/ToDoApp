import { Link, Outlet } from "react-router";

/** Page shell shared by every route: a slim header above the active page. */
export function RootLayout() {
  return (
    <div className="min-h-dvh">
      <header className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
        <Link to="/todos" viewTransition className="text-lg font-bold tracking-tight">
          Todos
        </Link>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}