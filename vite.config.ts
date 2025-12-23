import uni from "@dcloudio/vite-plugin-uni";
// import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig, loadEnv } from "vite";
import { netConfig } from "./src/config/net.config";
import path from "path";
import postCssPxToRem from "postcss-pxtorem";
import uniPolyfill from 'vite-plugin-uni-polyfill'

const resolve = (dir) => path.resolve(__dirname, dir);

export default defineConfig(async ({ mode }) => {
  const unocss = (await import("unocss/vite")).default;

  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    base: env.VITE_APP_BASE,
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 16,
            propList: ["*", '!line-height'], // 需要转换的属性，这里选择全部都进行转换
            selectorBlackList: ["norem", "ignore"], // 过滤掉norem-开头的class，不进行rem转换
            mediaQuery: false, // 允许在媒体查询中转换 px
          }),
        ],
      },
    },
    plugins: [
      uniPolyfill(),
      unocss(),
      uni(),
      // basicSsl()
    ],
    resolve: {
      alias: {
        "@": resolve("src"),
      },
      extensions: [".js", ".vue", ".json", ".jsx", ".ts", ".tsx"],
    },
    server: {
      // https: true,
      proxy: {
        [netConfig.baseName]: {
          target: env.VITE_APP_BASE_URL,
          ws: true,
          changeOrigin: true,
        },
        "/preview": {
          target: env.VITE_APP_BASE_URL,
          ws: false,
          changeOrigin: true,
        },
        [env.VITE_APP_PREFIX]: {
          target: env.VITE_APP_BASE_URL,
          changeOrigin: true,
          ws: true,
        }
      },
    },
  });
});
