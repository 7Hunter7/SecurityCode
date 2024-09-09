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
      path: "/inventory",
      name: "Inventory",
      component: () => import("../pages/InventoryPage.vue"),
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
      path: "/edit-device",
      name: "Edit Device",
      component: () => import("../pages/EditDevicePage.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "404",
      component: () => import("../pages/NotFoundPage.vue"),
    },
  ],
});

export default router;
