import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: 'dist/server',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: 'entry-server.mjs',
        chunkFileNames: 'chunks/[name]-[hash].mjs'
      }
    }
  }
});
