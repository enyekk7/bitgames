import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://your-app.vercel.app/api'),
    'process.env.VITE_STACKS_NETWORK': JSON.stringify(process.env.VITE_STACKS_NETWORK || 'testnet'),
    'process.env.VITE_STACKS_API_URL': JSON.stringify(process.env.VITE_STACKS_API_URL || 'https://api.testnet.hiro.so')
  }
});




