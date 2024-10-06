import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Настройка уведомлений
const options = {
  position: "top-right", // Позиция для всплывающих уведомлений
  timeout: 5000, // Время показа уведомления
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

const app = createApp(App);
app.use(router);
app.use(store);
app.use(Toast, options); // Подключение toastification
app.mount("#app");
