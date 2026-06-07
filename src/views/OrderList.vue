<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import OrderServices from "../services/OrderServices";
import { PAYMENT_METHODS } from "../config/constants";
import formatPrice from "../utils/formatPrice";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes";

const orders = ref([]);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getUserOrders();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getUserOrders() {
  await OrderServices.getOrdersByCurrentUser()
    .then((response) => {
      orders.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5 mt-8">
        <v-card-title
          ><v-row align="center">
            <v-col cols="10"
              ><v-card-title class="headline">Your Orders</v-card-title>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">Event</th>
                <th class="text-left">Slot</th>
                <th class="text-left">Seats</th>
                <th class="text-left">Price</th>
                <th class="text-left">Payment Type</th>
                <th class="text-left justify-end d-flex align-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>
                  <v-chip
                    color="primary"
                    variant="tonal"
                    :to="{
                      name: 'adminEditEvent',
                      params: { id: order.tickets[0].slot.event?.id },
                    }"
                    >{{ order.tickets[0].slot.event?.name }}</v-chip
                  >
                </td>
                <td>
                  <v-chip
                    color="primary"
                    variant="tonal"
                    :to="{
                      name: 'adminManageTimeSlot',
                      params: {
                        eventId: order.tickets[0].slot.event?.id,
                        slotId: order.tickets[0].slot.id,
                      },
                    }"
                    >{{
                      formatShowingDateTime(order.tickets[0].slot.datetime)
                    }}</v-chip
                  >
                </td>
                <td>
                  {{ order?.tickets.length }} seat{{
                    order?.tickets.length > 1 ? "s" : ""
                  }}
                </td>
                <td>
                  {{ formatPrice(order.payment.amount) }}
                </td>
                <td>
                  {{
                    PAYMENT_METHODS.find(
                      (m) => m.key === order.payment.paymentMethod,
                    ).label
                  }}
                </td>
                <td class="justify-end d-flex align-center">
                  <v-btn
                    color="primary"
                    :to="{
                      name: 'orderDetails',
                      params: {
                        id: order.id,
                      },
                    }"
                  >
                    <v-icon start icon="mdi-ticket"></v-icon>
                    View
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

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
