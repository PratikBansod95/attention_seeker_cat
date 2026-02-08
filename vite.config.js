import { defineConfig } from 'vite';

export default defineConfig({
    // Base public path when served in production
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
    },
    server: {
        host: true, // Listen on all addresses
    }
});
