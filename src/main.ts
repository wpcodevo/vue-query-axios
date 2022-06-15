import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from 'vue-query';
import './index.css';
import 'mosha-vue-toastify/dist/style.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin);

app.mount('#app');
