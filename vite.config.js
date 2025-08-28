import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'
  
  return {
    plugins: [
      // 将未被打包引用的静态资源直接复制到 dist
      viteStaticCopy({
        targets: [
          { src: 'assets/**/*', dest: 'assets' },
          { src: 'css/**/*', dest: 'css' },
          { src: 'js/**/*', dest: 'js' },
        ]
      })
    ],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:18080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    },
    define: {
      // 根据环境使用不同的API地址
      __API_BASE__: isDev ? '"/api"' : '"https://api2.nnnnn.fun"'
    }
  }
})
