import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // AUTHENTICATION
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

    // CUSTOMER ROUTES
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
      path: "/events/:eventId/time-slots/:slotId",
      name: "timeSlotDetails",
      component: () => import("./views/TimeSlotDetails.vue"),
    },
    {
      path: "/events/:eventId/time-slots/:slotId/checkout",
      name: "timeSlotCheckout",
      component: () => import("./views/TimeSlotCheckout.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("./views/OrderList.vue"),
    },
    {
      path: "/orders/:id",
      name: "orderDetails",
      component: () => import("./views/OrderDetails.vue"),
    },
    {
      path: "/waitlist/:slotId",
      name: "waitlist",
      props: true,
      component: () => import("./views/Waitlist.vue"),
    },

    // ADMIN
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
      path: "/admin/events/:eventId/time-slots/:slotId",
      name: "adminManageTimeSlot",
      component: () => import("./views/Admin/AdminManageTimeSlot.vue"),
    },
    {
      path: "/admin/orders",
      name: "adminOrders",
      component: () => import("./views/Admin/AdminOrderList.vue"),
    },
    {
      path: "/admin/orders/:id",
      name: "adminOrderDetails",
      component: () => import("./views/Admin/AdminOrderDetails.vue"),
    },
  ],
});

export default router;