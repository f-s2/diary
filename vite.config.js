import uni from '@dcloudio/vite-plugin-uni'
// import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'
import { netConfig } from './src/config/net.config'
// https://vitejs.dev/config/
const define = {}
if (!["mp-weixin", "h5", "web"].includes(process.env.UNI_PLATFORM)) {
  define['global'] = null
  define['wx'] = 'uni'
}
export default defineConfig({
  base: '/' ?? '/cmms-mobile',
  plugins: [
    uni(),
    define
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

    }
  }
})
