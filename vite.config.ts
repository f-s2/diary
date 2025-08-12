import uni from '@dcloudio/vite-plugin-uni'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig, loadEnv } from 'vite'
import { netConfig } from './src/config/net.config'

export default defineConfig(async ({mode}) => {

  const unocss = (await import('unocss/vite')).default

  return defineConfig({
    base: loadEnv(mode, process.cwd()).VITE_APP_BASE,
    plugins: [
      unocss(),
      uni(),
      // basicSsl()
    ],
    server: {
      // https: true,
      proxy: {
        [netConfig.baseName]: {
          target: netConfig.baseURL,
          ws: false,
          changeOrigin: true
        },
       '/preview': {
          target: netConfig.baseURL,
          ws: false,
          changeOrigin: true
        },

      }
    }
  })

})
