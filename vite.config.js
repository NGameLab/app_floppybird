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
      // 添加开发服务器缓存控制
      headers: {
        'Cache-Control': 'no-cache',
      },
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
      sourcemap: false,
      // 添加缓存破坏策略
      rollupOptions: {
        output: {
          manualChunks: undefined,
          // 为所有资源添加hash，确保缓存更新
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(png|jpe?g|gif|svg|ico|webp)$/i.test(assetInfo.name)) {
              return `assets/[name]-[hash].${ext}`
            }
            if (/\.(css)$/i.test(assetInfo.name)) {
              return `css/[name]-[hash].${ext}`
            }
            if (/\.(js)$/i.test(assetInfo.name)) {
              return `js/[name]-[hash].${ext}`
            }
            return `assets/[name]-[hash].${ext}`
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js'
        }
      },
      // 添加构建时的缓存控制
      assetsInlineLimit: 4096, // 4kb以下的资源内联
    },
    define: {
      // 根据环境使用不同的API地址
      __API_BASE__: isDev ? '"/api"' : '"https://api2.nnnnn.fun"'
    },
    // 添加CSS处理
    css: {
      devSourcemap: true,
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: ['jquery', 'jquery.transit', 'buzz']
    }
  }
})
