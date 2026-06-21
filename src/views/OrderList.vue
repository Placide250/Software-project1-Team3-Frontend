<script setup>
import { onMounted, ref } from "vue";
import OrderServices from "../services/OrderServices.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import formatPrice from "../utils/formatPrice.js";

const orders = ref([]);
const user = ref(null);
const isCancel = ref(false);
const selectedOrder = ref(null);
const snackbar = ref({ value: false, color: "", text: "" });

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  await getOrders();
});

async function getOrders() {
  if (!user.value?.id) return;
  await OrderServices.getOrdersByUser(user.value.id)
    .then((response) => {
      orders.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      showSnackbar("error", error.response?.data?.message ?? error.message);
    });
}

function openCancel(order) {
  selectedOrder.value = order;
  isCancel.value = true;
}

function closeCancel() {
  isCancel.value = false;
  selectedOrder.value = null;
}

async function cancelOrder() {
  isCancel.value = false;
  await OrderServices.cancelOrder(selectedOrder.value.id)
    .then(() => {
      showSnackbar("green", `Order #${selectedOrder.value.id} cancelled successfully!`);
    })
    .catch((error) => {
      console.log(error);
      showSnackbar("error", error.response?.data?.message ?? error.message);
    });
  await getOrders();
}

function showSnackbar(color, text) {
  snackbar.value = { value: true, color, text };
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="12">
          <v-card-title class="pl-0 text-h4 font-weight-bold">
            My Tickets
          </v-card-title>
          <p class="text-subtitle-1 text-grey">
            Plan got changed? No worries! You can cancel your tickets here and
            free up your spot for someone else to enjoy the event.
          </p>
        </v-col>
      </v-row>

      <!-- No orders -->
      <v-row v-if="orders.length === 0">
        <v-col>
          <v-alert type="info" variant="tonal">
            You have no tickets to cancel.
          </v-alert>
        </v-col>
      </v-row>

      <!-- Order cards -->
      <v-row>
        <v-col
          v-for="order in orders"
          :key="order.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            class="rounded-lg elevation-3 pa-2"
            height="100%"
            :class="{ 'bg-grey-lighten-3': order.isCancelled }"
          >
            <v-card-title>
              {{ order.tickets[0]?.slot?.event?.name ?? "Event" }}
              <v-chip v-if="order.isCancelled" color="grey" size="small" class="ml-2">Cancelled</v-chip>
            </v-card-title>
            <v-card-subtitle>
              {{ formatShowingDateTime(order.tickets[0]?.slot?.datetime) }}
            </v-card-subtitle>
            <v-card-text>
              <div>
                <strong>Order #:</strong> {{ order.id }}
              </div>
              <div>
                <strong>Seats:</strong> {{ order.tickets.length }}
                seat{{ order.tickets.length > 1 ? "s" : "" }}
              </div>
              <div>
                <strong>Total:</strong> {{ formatPrice(order.payment?.amount) }}
              </div>
              <div class="mt-1">
                <v-chip
                  v-for="t in order.tickets"
                  :key="t.seat"
                  :color="t.isWheelchair ? 'blue' : 'green'"
                  size="small"
                  label
                  class="ma-1"
                >
                  <v-icon
                    v-if="t.isWheelchair"
                    start
                    icon="mdi-wheelchair-accessibility"
                  ></v-icon>
                  {{ t.seat }}
                </v-chip>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="outlined"
                color="primary"
                size="small"
                :to="{ name: 'orderDetails', params: { id: order.id } }"
              >
                View Details
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                v-if="!order.isCancelled"
                color="primary"
                variant="flat"
                size="small"
                @click="openCancel(order)"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Confirmation dialog -->
      <v-dialog persistent v-model="isCancel" width="500">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Cancel Ticket</v-card-title>
          <v-card-text>
            Are you sure you want to cancel your ticket for
            <strong>{{ selectedOrder?.tickets[0]?.slot?.event?.name }}</strong>
            on
            <strong>{{
              formatShowingDateTime(selectedOrder?.tickets[0]?.slot?.datetime)
            }}</strong>?
            This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeCancel()">
              Keep Ticket
            </v-btn>
            <v-btn variant="flat" color="primary" @click="cancelOrder()">
              Yes, Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>