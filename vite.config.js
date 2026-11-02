import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    root: 'frontend',
    envDir: '../',
    // Legacy VITE_* variables (including old passwords) are never exposed.
    envPrefix: 'PUBLIC_',
    plugins: [react()],
    resolve: { extensions: ['.js', '.jsx'] },
    server: {
        host: '127.0.0.1',
        port: 5173,
        proxy: { '/wp-json': { target: 'http://127.0.0.1:8080', changeOrigin: true } }
    }
})
