<script setup>
import { computed, ref } from "vue";
import Seatmap from "./Seatmap.vue";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import { PAYMENT_METHODS } from "../config/constants.js";

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

const previewSeatmapOpen = ref(false);

const slot = computed(() => props.order?.tickets?.[0]?.slot ?? {});
const event = computed(() => slot.value?.event ?? {});
const tickets = computed(() => props.order?.tickets ?? []);
const selectedSeats = computed(() =>
  tickets.value.map((t) => ({ seat: t.seat, isWheelchair: t.isWheelchair })),
);
const paymentMethod = computed(() =>
  PAYMENT_METHODS.find((m) => m.key === props.order?.payment?.paymentMethod),
);
const childCount = computed(() => props.order?.childCount ?? 0);
const adultCount = computed(() => tickets.value.length - childCount.value);
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
      <v-btn variant="flat" color="primary" @click="close()">{{
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
    <v-card-text class="pa-4"> </v-card-text>
  </v-card>
</template>
