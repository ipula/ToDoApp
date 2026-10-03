import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Forward API calls to the Express server during development, so the
    // client can use relative URLs like /api/todos and no CORS is involved.
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});