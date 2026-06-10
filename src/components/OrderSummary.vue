<script setup>
import { computed, ref, onMounted } from "vue";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import Seatmap from "./Seatmap.vue";

const props = defineProps({
  selectedSeats: { type: Array, required: true },
  childCount: { type: Number, required: true },
  guestEmail: { type: String, default: "" },
  timeSlot: { type: Object, required: true },
  readOnly: { type: Boolean, default: false },
});

const emit = defineEmits(["update:childCount", "update:guestEmail"]);

const user = ref(null);
const previewSeatmapOpen = ref(false);
const ticketCount = computed(() => props.selectedSeats.length);
const estimatedTotal = computed(() => {
  const price = props.timeSlot.event?.price ?? 0;
  return (ticketCount.value - props.childCount) * price;
});

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
const EMAIL_RULES = [
  (value) => {
    if (value) return true;
    return "E-mail is required.";
  },
  (value) => {
    if (EMAIL_REGEX.test(value)) return true;
    return "E-mail must be valid.";
  },
];

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

function openPreviewSeatmap() {
  previewSeatmapOpen.value = true;
}
</script>

<template>
  <v-card class="rounded-lg elevation-5">
    <v-card-title class="text-h6 font-weight-bold pa-4 pb-2"
      >Order Summary</v-card-title
    >
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <p class="text-subtitle-2 font-weight-bold mb-2">
        {{ timeSlot.event?.name }}
      </p>
      <p class="text-body-1 mb-2">{{ timeSlot?.event?.description }}</p>
      <div class="d-flex mt-2">
        <v-chip class="ma-2" color="accent" label>
          <v-icon start icon="mdi-calendar-range"></v-icon>
          {{ formatShowingDateTime(timeSlot.datetime) }}
        </v-chip>
        <v-chip class="ma-2" color="primary" label>
          <v-icon start icon="mdi-cash-multiple"></v-icon>
          {{ formatPrice(timeSlot.event?.price) }}
        </v-chip>
      </div>

      <v-divider class="my-4"></v-divider>

      <p class="text-subtitle-2 font-weight-bold mb-2">Selected Seats</p>
      <div
        v-if="selectedSeats.length === 0"
        class="text-body-2 text-medium-emphasis mb-4"
      >
        No seats selected. Choose seats from the map above.
      </div>
      <div v-else class="mb-4">
        <v-row>
          <v-col :cols="readOnly ? 8 : 12">
            <v-chip
              v-for="seat in selectedSeats"
              :key="seat.seat"
              :color="seat.isWheelchair ? 'blue' : 'green'"
              variant="elevated"
              label
              class="ma-1"
            >
              <v-icon
                v-if="seat.isWheelchair"
                start
                icon="mdi-wheelchair-accessibility"
              ></v-icon>
              {{ seat.seat }}
            </v-chip>
          </v-col>
          <v-col v-if="readOnly" :cols="4" class="d-flex justify-end">
            <v-btn color="secondary" @click="openPreviewSeatmap()">
              <v-icon start icon="mdi-grid-large"></v-icon>
              Seatmap
            </v-btn>
            <seatmap
              preview-only
              :reserved-tickets="timeSlot.tickets"
              v-model:is-open="previewSeatmapOpen"
              :selected-seats="selectedSeats"
            />
          </v-col>
        </v-row>
      </div>

      <v-row align="center" class="mb-2">
        <v-col cols="12" sm="6">
          <p class="text-subtitle-2 font-weight-bold mb-1">Children in Party</p>
          <p class="text-caption text-medium-emphasis">
            Children ages 8 and under are free.
          </p>
        </v-col>
        <v-col cols="12" sm="6">
          <v-select
            :model-value="childCount"
            :items="Array.from({ length: ticketCount }, (_, i) => i)"
            label="# of children"
            variant="outlined"
            density="compact"
            :disabled="ticketCount === 0 || readOnly"
            hide-details
            @update:model-value="emit('update:childCount', $event)"
          ></v-select>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <v-row align="center" class="mb-2">
        <v-col>
          <p class="text-subtitle-2 font-weight-bold">Estimated Total</p>
          <p class="text-caption text-medium-emphasis">
            {{ ticketCount - childCount }} adult ticket{{
              ticketCount - childCount !== 1 ? "s" : ""
            }}
            ×
            {{ formatPrice(timeSlot.event?.price ?? 0) }}
            <span v-if="childCount > 0"
              >({{ childCount }} child ticket{{ childCount !== 1 ? "s" : "" }})
            </span>
          </p>
        </v-col>
        <v-col class="text-right">
          <span class="text-h6 font-weight-bold">{{
            formatPrice(estimatedTotal)
          }}</span>
        </v-col>
      </v-row>

      <v-divider class="my-4"></v-divider>

      <div v-if="user || (readOnly && guestEmail != '')">
        <p class="text-subtitle-2 font-weight-bold mb-1">
          {{ user ? "Account" : "Guest Email" }}
        </p>
        <v-chip
          prepend-icon="mdi-account-circle"
          variant="tonal"
          color="primary"
        >
          {{ user ? user.email : guestEmail }}
        </v-chip>
      </div>
      <v-alert v-else type="info" variant="tonal" class="mt-2">
        You are not logged in. Enter your email so we can send you a
        confirmation, or
        <router-link :to="{ name: 'login' }">log in</router-link> if you have an
        account.
        <v-text-field
          :model-value="guestEmail"
          label="Email"
          :rules="EMAIL_RULES"
          required
          class="mt-2"
          @update:model-value="emit('update:guestEmail', $event)"
        ></v-text-field>
      </v-alert>
    </v-card-text>
    <v-card-actions class="pa-4 pt-0">
      <v-spacer></v-spacer>
      <v-btn
        v-if="readOnly"
        variant="flat"
        color="secondary"
        :to="{
          name: 'timeSlotDetails',
          params: { eventId: timeSlot.event?.id, slotId: timeSlot.id },
          query: {
            data: JSON.stringify({
              selectedSeats,
              childCount,
              guestEmail,
              ticketCount,
              estimatedTotal,
            }),
          },
        }"
      >
        <v-icon start icon="mdi-pencil"></v-icon>
        Edit Order
      </v-btn>
      <v-btn
        v-else
        variant="flat"
        color="primary"
        size="large"
        :disabled="ticketCount === 0 || (!user && guestEmail === '')"
        append-icon="mdi-arrow-right"
        :to="{
          name: 'timeSlotCheckout',
          params: { eventId: timeSlot?.event?.id, slotId: timeSlot.id },
          query: {
            data: JSON.stringify({
              selectedSeats,
              childCount,
              guestEmail,
              ticketCount,
              estimatedTotal,
            }),
          },
        }"
      >
        Continue to Checkout
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
