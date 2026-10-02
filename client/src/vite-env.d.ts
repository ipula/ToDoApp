/// <reference types="vite/client" />

/** Environment variables available via import.meta.env (must start with VITE_). */
interface ImportMetaEnv {
  /** Base URL of the API. Empty in development, where Vite proxies /api. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}