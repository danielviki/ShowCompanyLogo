import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible'

export default defineConfig({
    root: 'frontend',
    envDir: '../',
    plugins: [
        react({
            // 使用新的 JSX transform
            jsxRuntime: 'automatic',
            jsxImportSource: 'react'
        }),
        envCompatible({
            prefix: 'VITE_',
            mountedPath: 'process.env'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    server: {
        port: 5173,
        cors: true,
        proxy: {
            '/wp-json': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false
            }
        }
    }
})