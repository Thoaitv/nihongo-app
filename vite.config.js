import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4200,
   allowedHosts: ['https://7b5efc1fc6d6.ngrok-free.app'],
    strictPort: true
  }
});
