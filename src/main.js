import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeFromPlugin from './plugins/validation';
import { auth } from './plugins/firebase';
import './assets/tailwind.css';
import './assets/main.css';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(store);
    app.use(router);
    app.use(VeeFromPlugin);

    app.mount('#app');
  }
});
