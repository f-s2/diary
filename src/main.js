import StatusTag from '@/components/StatusTag.vue';
import UEmpty from '@/components/UEmpty.vue';
import UPopup from '@/components/UPopup.vue';
import ULoading from '@/components/zero-loading/index.vue';
import uvUI from '@climblee/uv-ui';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import {
	createSSRApp
} from "vue";
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	const store = createPinia().use(piniaPluginPersistedstate)
	app.use(store)
	app.use(uvUI)
	app.component('ULoading', ULoading)
	app.component('UEmpty', UEmpty)
	app.component('UPopup', UPopup)
	app.component('StatusTag', StatusTag)
	return {
		app,
	};
}
