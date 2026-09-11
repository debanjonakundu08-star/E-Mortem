import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom entry resolver plugin ensures Rollup / Vite on Vercel (Linux)
// always locates the entry point regardless of root path, casing, or relative slash notation.
function entryResolverPlugin() {
  return {
    name: 'e-mortem-entry-resolver',
    resolveId(source) {
      // Check if source matches any common entry point pattern
      const normalized = source.replace(/^[./\\]+/, '');
      if (
        normalized.toLowerCase() === 'src/main.jsx' ||
        normalized.toLowerCase() === 'src/main.js' ||
        normalized.toLowerCase() === 'src/index.jsx' ||
        normalized.toLowerCase() === 'src/index.js'
      ) {
        const candidates = ['main.jsx', 'Main.jsx', 'index.jsx', 'Index.jsx', 'main.js', 'index.js'];
        for (const candidate of candidates) {
          const candidatePath = path.resolve(__dirname, 'src', candidate);
          if (fs.existsSync(candidatePath)) {
            return candidatePath;
          }
        }
        return path.resolve(__dirname, 'src', 'main.jsx');
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [react(), entryResolverPlugin()],
  root: __dirname,
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true
  },
  server: {
    port: 5173,
    host: '0.0.0.0'
  },
  preview: {
    port: 5173,
    host: '0.0.0.0'
  }
});
