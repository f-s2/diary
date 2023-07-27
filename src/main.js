import UEmpty from '@/components/UEmpty.vue';
import UPopup from '@/components/UPopup.vue';
import ULoading from '@/components/zero-loading/index.vue';
import { createPinia } from 'pinia';
import {
	createSSRApp
} from "vue";
import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);
	const store = createPinia()
	app.use(store)
	app.component('ULoading', ULoading)
	app.component('UEmpty', UEmpty)
	app.component('UPopup', UPopup)
	return {
		app,
	};
}
