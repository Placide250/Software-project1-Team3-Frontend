<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import Seatmap from "../../components/Seatmap.vue";
import formatPrice from "../../utils/formatPrice.js";
import { formatShowingDateTime } from "../../utils/formatDatesAndTimes.js";
import { PAYMENT_METHODS } from "../../config/constants.js";
import OrderServices from "../../services/OrderServices.js";

const route = useRoute();

const orderId = route.params.id;
const order = ref(null);
const previewSeatmapOpen = ref(false);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const slot = computed(() => order.value?.tickets?.[0]?.slot ?? {});
const event = computed(() => slot.value?.event ?? {});
const tickets = computed(() => order.value?.tickets ?? []);
const selectedSeats = computed(() =>
  tickets.value.map((t) => ({ seat: t.seat, isWheelchair: t.isWheelchair })),
);
const paymentMethod = computed(() =>
  PAYMENT_METHODS.find((m) => m.key === order.value?.payment?.paymentMethod),
);
const childCount = computed(() => order.value?.childCount ?? 0);
const adultCount = computed(() => tickets.value.length - childCount.value);

onMounted(async () => {
  await getOrder();
});

async function getOrder() {
  await OrderServices.getOrder(orderId)
    .then((response) => {
      order.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message ?? error.message;
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <!-- loader to prevent order is undefined errors -->
    <v-row v-if="!order" class="fill-height" align="center" justify="center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <div v-if="order">
      <v-row class="d-flex">
        <v-btn
          variant="flat"
          color="secondary"
          :to="{ name: 'adminOrders' }"
          class="my-4"
        >
          <v-icon start icon="mdi-arrow-left"></v-icon>
          Back to Orders
        </v-btn>
      </v-row>

      <v-row>
        <v-col cols="7">
          <v-card class="rounded-lg elevation-5 mb-4">
            <div class="pa-4 pb-2">
              <v-card-title class="text-h6 font-weight-bold" style="padding: 0">
                Order #{{ order.id }}
              </v-card-title>
              <p class="text-body-2 text-medium-emphasis">
                Created At: {{ formatShowingDateTime(order.createdAt) }}
              </p>
            </div>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <div class="d-flex flex-wrap mb-2">
                <v-chip
                  class="ma-1"
                  color="accent"
                  label
                  :to="{ name: 'adminEditEvent', params: { id: event.id } }"
                >
                  <v-icon start icon="mdi-calendar-star"></v-icon>
                  {{ event.name }}
                </v-chip>
                <v-chip
                  class="ma-1"
                  color="primary"
                  label
                  :to="{
                    name: 'adminManageTimeSlot',
                    params: { eventId: event.id, slotId: slot.id },
                  }"
                >
                  <v-icon start icon="mdi-calendar-range"></v-icon>
                  {{ formatShowingDateTime(slot.datetime) }}
                </v-chip>
                <v-chip class="ma-1" color="secondary" label variant="flat">
                  <v-icon start icon="mdi-cash-multiple"></v-icon>
                  {{ formatPrice(tickets[0].archivedPrice) }}
                </v-chip>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="d-flex align-center justify-space-between mb-2">
                <p class="text-subtitle-2 font-weight-bold">
                  Seats ({{ tickets.length }})
                </p>
                <Seatmap
                  preview-only
                  :reserved-tickets="slot.tickets ?? []"
                  :owned-tickets="tickets ?? []"
                  :selected-seats="selectedSeats"
                  v-model:is-open="previewSeatmapOpen"
                />
                <v-btn
                  size="small"
                  color="secondary"
                  @click="previewSeatmapOpen = true"
                >
                  <v-icon start icon="mdi-grid-large"></v-icon>
                  Seatmap
                </v-btn>
              </div>
              <div class="mb-2">
                <v-chip
                  v-for="t in selectedSeats"
                  :key="t.seat"
                  :color="t.isWheelchair ? 'blue' : 'green'"
                  variant="elevated"
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

              <v-divider class="my-4"></v-divider>

              <v-row align="center" class="mb-2">
                <v-col>
                  <p class="text-subtitle-2 font-weight-bold">Total Charged</p>
                  <p class="text-caption text-medium-emphasis">
                    {{ adultCount }} adult ticket{{
                      adultCount !== 1 ? "s" : ""
                    }}
                    × {{ formatPrice(tickets[0].archivedPrice ?? 0) }}
                    <span v-if="childCount > 0">
                      ({{ childCount }} child ticket{{
                        childCount !== 1 ? "s" : ""
                      }}
                      free)
                    </span>
                  </p>
                </v-col>
                <v-col class="text-right">
                  <span class="text-h6 font-weight-bold">
                    {{ formatPrice(order.payment?.amount) }}
                  </span>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <p class="text-subtitle-2 font-weight-bold mb-2">Customer</p>
              <v-chip
                prepend-icon="mdi-account-circle"
                :color="order.user ? 'primary' : 'default'"
              >
                {{
                  order.user
                    ? `${order.user.firstName} ${order.user.lastName} (${order.user.email})`
                    : order.guestEmail
                }}
              </v-chip>
              <v-chip
                v-if="!order.user"
                class="ml-2"
                color="warning"
                size="small"
              >
                Guest
              </v-chip>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card class="rounded-lg elevation-5">
            <v-card-title class="text-h6 font-weight-bold pa-4 pb-2">
              Payment
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-row align="center" class="mb-3">
                <v-col>
                  <p class="text-subtitle-2 font-weight-bold mb-1">Method</p>
                  <v-chip
                    v-if="paymentMethod"
                    :prepend-icon="paymentMethod.icon"
                    color="primary"
                  >
                    {{ paymentMethod.label }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-divider class="my-3"></v-divider>
              <v-row align="center">
                <v-col>
                  <p class="text-subtitle-2 font-weight-bold">Amount Charged</p>
                </v-col>
                <v-col class="text-right">
                  <span class="text-h5 font-weight-bold">
                    {{ formatPrice(order.payment?.amount) }}
                  </span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
