<script setup>
import { computed, ref } from "vue";
import Seatmap from "./Seatmap.vue";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import { PAYMENT_METHODS } from "../config/constants.js";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import { useRoute } from "vue-router";

const url = window.location.href;
const domain = new URL(url).host;

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  showCustomer: {
    type: Boolean,
    default: false,
  },
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const previewSeatmapOpen = ref(false);

const slot = computed(() => props.order?.tickets?.[0]?.slot ?? {});
const event = computed(() => slot.value?.event ?? {});
const tickets = computed(
  () =>
    props.order?.tickets.map((t) => ({
      ...t,
      qrCode: useQRCode(`https://${domain}/tickets/${t.id}/redeem`),
    })) ?? [],
);
const selectedSeats = computed(() =>
  tickets.value.map((t) => ({ seat: t.seat, isWheelchair: t.isWheelchair })),
);
const paymentMethod = computed(() =>
  PAYMENT_METHODS.find((m) => m.key === props.order?.payment?.paymentMethod),
);
const childCount = computed(() => props.order?.childCount ?? 0);
const adultCount = computed(() => tickets.value.length - childCount.value);

const qrDialogTicket = ref(null);
const qrDialogOpen = computed(() => !!qrDialogTicket.value);

function refund() {
  console.log("TODO: Refund");
  snackbar.value.value = true;
  snackbar.value.color = "green";
  snackbar.value.text = "TODO: Refunds";
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
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
          :to="{
            name: showCustomer ? 'adminEditEvent' : 'eventDetails',
            params: { id: event.id },
          }"
        >
          <v-icon start icon="mdi-calendar-star"></v-icon>
          {{ event.name }}
        </v-chip>
        <v-chip
          class="ma-1"
          color="primary"
          label
          :to="{
            name: showCustomer ? 'adminManageTimeSlot' : 'timeSlotDetails',
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
          <p class="text-subtitle-2 font-weight-bold">Payment</p>
          <p class="text-caption text-medium-emphasis">
            {{ adultCount }} adult ticket{{ adultCount !== 1 ? "s" : "" }} ×
            {{ formatPrice(tickets[0].archivedPrice ?? 0) }}
            <span v-if="childCount > 0">
              ({{ childCount }} child ticket{{ childCount !== 1 ? "s" : "" }}
              free)
            </span>
          </p>
          <v-chip
            v-if="paymentMethod"
            :prepend-icon="paymentMethod.icon"
            color="primary"
            class="mt-2"
          >
            {{ paymentMethod.label }}
          </v-chip>
        </v-col>
        <v-col class="text-right">
          <span class="text-h6 font-weight-bold">
            {{ formatPrice(order.payment?.amount) }}
          </span>
        </v-col>
      </v-row>

      <div v-if="showCustomer">
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
        <v-chip v-if="!order.user" class="ml-2" color="warning" size="small">
          Guest
        </v-chip>
      </div>
    </v-card-text>
    <v-card-actions class="pa-4 pt-0">
      <v-spacer></v-spacer>
      <v-btn variant="flat" color="primary" @click="refund()">{{
        showCustomer ? "Refund Order" : "Request Refund"
      }}</v-btn>
    </v-card-actions>
  </v-card>

  <v-card class="rounded-lg elevation-5 mb-4">
    <div class="pa-4 pb-2">
      <v-card-title class="text-h6 font-weight-bold" style="padding: 0">
        Tickets
      </v-card-title>
    </div>
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <v-row>
        <v-col v-for="t in tickets" :key="t.seat" cols="12" sm="6">
          <div class="d-flex h-100 border rounded">
            <div
              class="pa-3 flex-grow-1 d-flex flex-column justify-space-between"
            >
              <div>
                <p class="text-caption text-medium-emphasis mb-1">
                  {{ event.name }}
                </p>
                <p class="text-caption text-medium-emphasis mb-2">
                  <v-icon
                    size="12"
                    icon="mdi-calendar-range"
                    class="mr-1"
                  ></v-icon>
                  {{ formatShowingDateTime(slot.datetime) }}
                </p>
              </div>
              <div>
                <p class="font-weight-bold mb-1 text-h6">
                  {{ t.seat }}
                </p>
                <div class="d-flex align-center gap-1">
                  <span class="text-caption text-medium-emphasis">
                    {{ formatPrice(t.archivedPrice) }}
                  </span>
                  <v-chip
                    v-if="t.isWheelchair"
                    color="blue"
                    size="x-small"
                    label
                    variant="tonal"
                    class="ml-1"
                  >
                    <v-icon
                      start
                      size="10"
                      icon="mdi-wheelchair-accessibility"
                    ></v-icon>
                    Wheelchair
                  </v-chip>
                </div>
              </div>
            </div>

            <v-divider
              vertical
              class="border-dashed border-opacity-50"
            ></v-divider>

            <div
              class="d-flex align-center justify-center pa-2 cursor-pointer"
              style="width: 88px"
              @click="qrDialogTicket = t"
            >
              <div
                class="d-flex flex-column align-center justify-center rounded"
                style="width: 72px; height: 72px"
              >
                <img :src="t.qrCode.value" alt="QR Code" style="width: 56px" />
                <span
                  class="text-caption text-medium-emphasis text-grey-lighten-3"
                  >Expand</span
                >
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog v-model="qrDialogOpen" max-width="400">
    <v-card v-if="qrDialogOpen" class="pa-4 text-center">
      <v-card-title class="text-h6 font-weight-bold">
        Seat {{ qrDialogTicket.seat }}
      </v-card-title>
      <v-card-subtitle>{{ event.name }}</v-card-subtitle>
      <v-card-text class="d-flex justify-center pa-4">
        <img :src="qrDialogTicket.qrCode" alt="QR Code" style="width: 360px" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="qrDialogTicket = null">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}
    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
