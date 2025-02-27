import { defineConfig, loadEnv } from 'vite'
import envCompatible from 'vite-plugin-env-compatible'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Validate required environment variables
  const requiredVars = ['VITE_WP_USERNAME', 'VITE_WP_PASSWORD', 'VITE_API_URL']
  for (const variable of requiredVars) {
    if (!env[variable]) {
      throw new Error(`Missing required environment variable: ${variable}`)
    }
  }

  return {
    root: 'frontend',
    envDir: '../',
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
    },
    plugins: [
      envCompatible({
        prefix: 'VITE_',
        mountedPath: 'process.env' // Make variables available as process.env
      })
    ],
    // Remove define block as envCompatible handles it
  }
})