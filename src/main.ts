import ULoading from '@/components/zero-loading/index.vue';
import uvUI from '@climblee/uv-ui';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import {
	createSSRApp,
	nextTick
} from "vue";
import App from "./App.vue";
import 'uno.css'
import '@/styles/vars.css'

import devTools from "./devTools/index.js";
import devToolsConfig from './devTools/config.js';
import mpDevBubble from './devTools/core/components/mpDevBubble.vue'
import { UvTabsDefaultConfig } from './config/theme';

// #ifdef H5
import eruda from 'eruda'
import.meta.env.VITE_APP_DEVTOOLS === 'true' && eruda.init()
// #endif

export function createApp() {
	const app = createSSRApp(App);
	const store = createPinia().use(piniaPluginPersistedstate)
	app.use(store)
	app.use(uvUI)
	app.component('ULoading', ULoading)

	 //挂载Devtools
	app.use(devTools, devToolsConfig)
	//注册小程序端专用的拖动浮标组件
	app.component("mpDevBubble", mpDevBubble)

	nextTick(() => {
		

		//@ts-ignore
	uni.$uv.setConfig({
		props: {
			tabs: UvTabsDefaultConfig
		}
	})
	})
	
	return {
		app,
	};
}
