import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
    };
  },
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
    },
    {
      path: "/history",
      name: "History",
      component: () => import("../pages/HistoryPage.vue"),
    },
    {
      path: "/security-device",
      name: "Security Device",
      component: () => import("../pages/SecurityDevicePage.vue"),
    },
    {
      path: "/add-device",
      name: "Add Device",
      component: () => import("../pages/AddDevicePage.vue"),
    },
    {
      path: "/edit-device/:id?", // Маршрут для редактирования с параметром ID
      name: "Edit Device",
      component: () => import("../pages/EditDevicePage.vue"),
      props: true, // Передаем параметры маршрута как пропсы
    },
    {
      path: "/profile", // Маршрут для редактирования с параметром ID
      name: "Profile",
      component: () => import("../pages/ProfilePage.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "404",
      component: () => import("../pages/NotFoundPage.vue"),
    },
  ],
});

export default router;
