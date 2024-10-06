import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
app.use(store);

app.use(Toast, {
  position: POSITION.TOP_RIGHT, // Позиция для всплывающих уведомлений
  timeout: 5000, // Время показа уведомления
});

app.mount("#app");
