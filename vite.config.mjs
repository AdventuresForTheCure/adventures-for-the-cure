import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    copyPublicDir: false
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3030'
    }
  },
  test: {
    environment: 'jsdom',
    restoreMocks: true,
    include: ['src/**/*.test.{js,jsx}']
  }
});
