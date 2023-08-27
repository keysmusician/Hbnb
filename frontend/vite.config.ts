import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxImportSource: "@emotion/react",
  })],
  server: {
    port: 5173,
  },
  build: {
    // generate manifest.json in outDir
    manifest: true,
    rollupOptions: {
      // overwrite default .html entry
      input: './source/index.tsx',
      output: {
        entryFileNames: 'static/scripts/[name].js',
        assetFileNames: (asset) => {
          if (asset.name.endsWith('.css')) {
            return `static/styles/[name][extname]`
          } else if (asset.name.endsWith('.tsx')) {
            return `static/scripts/[name][extname]`
          } else {
            return `static/assets/[name][extname]`
          }
        },
      }
    },
    outDir: '.',
  },
})
