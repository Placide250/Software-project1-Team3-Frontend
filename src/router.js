import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./views/Register.vue"),
    },
    {
      path: "/events",
      name: "events",
      component: () => import("./views/EventList.vue"),
    },
    {
      path: "/events/:id",
      name: "eventDetails",
      component: () => import("./views/EventDetails.vue"),
    },
    {
      path: "/admin/events",
      name: "adminEvents",
      component: () => import("./views/Admin/AdminEventList.vue"),
    },
    {
      path: "/admin/events/create",
      name: "adminCreateEvent",
      component: () => import("./views/Admin/AdminCreateEvent.vue"),
    },
    {
      path: "/admin/events/:id",
      name: "adminEditEvent",
      component: () => import("./views/Admin/AdminEditEvent.vue"),
    },
    {
      path: "/ingredients",
      name: "ingredients",
      component: () => import("./views/IngredientList.vue"),
    },
  ],
});

export default router;
