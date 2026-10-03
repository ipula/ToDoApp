import { useLocation, useParams } from "react-router";

interface PlaceholderPageProps {
  /** Name of the page this route will eventually show. */
  title: string;
}

/**
 * Temporary page used while building the router.
 * Shows which route matched, plus the URL and params, so routing can be
 * checked before the real pages exist. Replaced route by route later.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  const location = useLocation();
  const params = useParams();

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <dl className="mt-4 space-y-1 text-sm text-slate-600">
        <div>
          <dt className="inline font-medium">Path: </dt>
          <dd className="inline font-mono">
            {location.pathname}
            {location.search}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium">Params: </dt>
          <dd className="inline font-mono">{JSON.stringify(params)}</dd>
        </div>
      </dl>
    </div>
  );
}