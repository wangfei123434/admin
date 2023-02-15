import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; //单文件
import vueJsx from '@vitejs/plugin-vue-jsx'; //jsx
import styleImport from 'vite-plugin-style-import'; //按需引入css
import eslintPlugin from "vite-plugin-eslint";  //eslint
import viteCompression from 'vite-plugin-compression'; // gzip
import legacy from "@vitejs/plugin-legacy"; // module 兼容性
import viteWebp from 'vite-plugin-vue-webp'; //自动引入webp
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({}),
    viteWebp({
      dirs: ['src/images'],
      extensions: ['jpg', 'jpeg', 'png', 'svg'],
      customResolvers: [],
      customSearchRegex: '([A-Z][a-zA-Z0-9]+)',
    }),
    legacy({
      targets: ['defaults'],
      polyfills: ['es/'],
      modernPolyfills: ['es/'],
    }),
    viteCompression({
      filter: /\.(js|mjs|json|css|html|png|jpg|otf|ttf)$/i,
      threshold: 10240,
    }),
    // viteCompression({
    //   filter: /\.(js|mjs|json|css|html|otf|ttf)$/i,
    //   threshold: 10240,
    //   algorithm: 'brotliCompress',
    //   ext: '.br'
    // }),
    // styleImport({
    //   libs: [{
    //     libraryName: 'element-plus',
    //     esModule: true,
    //     ensureStyleFile: true,
    //     resolveStyle: (name) => {
    //       name = name.slice(3)
    //       return `element-plus/packages/theme-chalk/src/${name}.scss`;
    //     },
    //     resolveComponent: (name) => {
    //       return `element-plus/lib/${name}`;
    //     },
    //   }]
    // }),
    eslintPlugin({
      cache: true,
      fix: true,
      include: ["./src/*.ts", "./src/**/*.ts", "./src/*.vue", "./src/**/*.vue"],
    }),
  ],
  base: '/admin/',
  build: {
    outDir: 'admin',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          app: ['vue', 'vue-router', 'qs', 'axios', 'vuex', 'nprogress'],
          element: ['element-plus'],
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import './src/style/global';\n`, //你的scss文件路径
      },
    },
  },
  resolve: {
    alias: [{ find: "/@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    port: 9009,
    open: true,
    proxy: {
      // string shorthand
      "/gateway": {
        target: "http://58.49.165.170:8084",
        // target: "http://172.16.200.101:4105",
        // target: " http://172.16.10.174:82",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/dev-api/, ""),
      },
      "/images": {
        // target: "http://172.16.10.173:81",
        target: "http://58.49.165.170:8084",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/dev-api/, ""),
      },
    },
  },
});
