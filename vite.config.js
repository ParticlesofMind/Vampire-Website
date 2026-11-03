import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Multi-page site: every HTML page is its own entry.
// Media, page data and the reader scripts live in public/ and are served as-is,
// because the reader loads them at runtime (fetch + classic <script> tags).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        reader: resolve(import.meta.dirname, 'html/comicReader.html'),
        home: resolve(import.meta.dirname, 'html/index.html'),
        shop: resolve(import.meta.dirname, 'html/shop.html'),
        login: resolve(import.meta.dirname, 'html/login.html'),
      },
    },
  },
  server: {
    open: '/html/comicReader.html',
  },
});
