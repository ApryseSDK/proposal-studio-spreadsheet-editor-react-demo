import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Standard Vite + React config. Nothing WebViewer-specific is needed here:
// WebViewer's static files live in /public/lib/webviewer and are served as-is.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
