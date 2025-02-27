import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
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
    define: {
      // This makes process.env available in the browser
      'process.env': env
 /*     {
        VITE_API_URL: JSON.stringify(env.VITE_API_URL),
        VITE_WP_USERNAME: JSON.stringify(env.VITE_WP_USERNAME),
        VITE_WP_PASSWORD: JSON.stringify(env.VITE_WP_PASSWORD)
      }
 */
    }
  }
})