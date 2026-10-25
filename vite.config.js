import { defineConfig } from 'vite';

// base relativa: funciona en GitHub Pages bajo /<repo>/ y en cualquier subcarpeta.
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 900,
    assetsInlineLimit: 0,
  },
  server: { host: true },
});
