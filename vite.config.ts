import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const normalizeModulePath = (id: string) => id.replaceAll('\\', '/');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },

  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = normalizeModulePath(id);

          if (!normalizedId.includes('/node_modules/')) {
            return undefined;
          }

          if (
            normalizedId.includes('/node_modules/react/') ||
            normalizedId.includes('/node_modules/react-dom/') ||
            normalizedId.includes('/node_modules/react-router') ||
            normalizedId.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }

          if (
            normalizedId.includes('/node_modules/@hey-api/') ||
            normalizedId.includes('/node_modules/@hey-api/client-fetch/')
          ) {
            return 'vendor-api';
          }

          if (
            normalizedId.includes('/node_modules/antd/') ||
            normalizedId.includes('/node_modules/@ant-design/') ||
            normalizedId.includes('/node_modules/rc-') ||
            normalizedId.includes('/node_modules/@rc-component/') ||
            normalizedId.includes('/node_modules/dayjs/')
          ) {
            return 'vendor-antd';
          }

          return 'vendor';
        },
      },
    },
  },
});
