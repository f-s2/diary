import uni from '@dcloudio/vite-plugin-uni'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'
import { netConfig } from './src/config/net.config'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    basicSsl()
  ],
  server: {
    https: true,
    proxy: {
      [netConfig.baseName]: {
        target: netConfig.baseURL,
        ws: false,
        changeOrigin: true
      },
      '/v1/': {
        target: 'https://apis.map.qq.com/ws/geocoder',
        ws: false,
        changeOrigin: true
      }
    }
  }
})
