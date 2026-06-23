import { createRouter, createWebHistory } from "vue-router";

const isLoggedOut = () => {
  if (localStorage.getItem("user") !== null) {
    return { name: "events" };
  }

  return true;
};

const isLoggedIn = () => {
  if (localStorage.getItem("user") === null) {
    return { name: "login" };
  }

  return true;
};

const isAdmin = () => {
  if (!isLoggedIn() || !JSON.parse(localStorage.getItem("user"))?.isAdmin) {
    return { name: "events" };
  }

  return true;
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // AUTHENTICATION
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
      beforeEnter: isLoggedOut,
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./views/Register.vue"),
      beforeEnter: isLoggedOut,
    },

    // CUSTOMER ROUTES
    {
      path: "/events",
      name: "events",
      component: () => import("./views/EventList.vue"),
    },
    {
      path: "/schedule",
      name: "schedule",
      component: () => import("./views/Schedule.vue"),
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
      beforeEnter: isLoggedIn,
    },
    {
      path: "/orders/:id",
      name: "orderDetails",
      component: () => import("./views/OrderDetails.vue"),
      beforeEnter: isLoggedIn,
    },
    {
      path: "/waitlist/:slotId",
      name: "waitlist",
      props: true,
      component: () => import("./views/Waitlist.vue"),
    },
    {
      path: "/orders/:id",
      name: "orderDetails",
      component: () => import("./views/OrderDetails.vue"),
    },

    // ADMIN
    {
      path: "/admin/events",
      name: "adminEvents",
      component: () => import("./views/Admin/AdminEventList.vue"),
      beforeEnter: isAdmin,
    },
    {
      path: "/admin/events/create",
      name: "adminCreateEvent",
      component: () => import("./views/Admin/AdminCreateEvent.vue"),
      beforeEnter: isAdmin,
    },
    {
      path: "/admin/events/:id",
      name: "adminEditEvent",
      component: () => import("./views/Admin/AdminEditEvent.vue"),
      beforeEnter: isAdmin,
    },
    {
      path: "/qr-test",
      name: "QRTest",
      component: () => import("@/views/QRTest.vue"), // lazy load like the rest
    },
    {
      path: "/admin/events/:eventId/time-slots/:slotId",
      name: "adminManageTimeSlot",
      component: () => import("./views/Admin/AdminManageTimeSlot.vue"),
      beforeEnter: isAdmin,
    },
    {
      path: "/admin/orders",
      name: "adminOrders",
      component: () => import("./views/Admin/AdminOrderList.vue"),
      beforeEnter: isAdmin,
    },
    {
      path: "/admin/orders/:id",
      name: "adminOrderDetails",
      component: () => import("./views/Admin/AdminOrderDetails.vue"),
      beforeEnter: isAdmin,
    },
    {
      path: "/admin/users",
      name: "adminUsers",
      component: () => import("./views/Admin/AdminUserList.vue"),
    },
    {
      path: "/admin/users/:id",
      name: "adminEditUser",
      component: () => import("./views/Admin/AdminEditUser.vue"),
    },
  ],
});

export default router;
