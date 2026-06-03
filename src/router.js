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
      path: "/events",
      name: "events",
      component: () => import("./views/EventList.vue"),
    },
    {
      path: "/events/:id",
      name: "editEvent",
      props: true,
      component: () => import("./views/EditEvent.vue"),
    },
    {
      path: "/ingredients",
      name: "ingredients",
      component: () => import("./views/IngredientList.vue"),
    },
{
  path: "/waitlist/:eventId",
  name: "waitlist",
  props: true,
  component: () => import("./views/Waitlist.vue"),
},
  ],
});

export default router;
