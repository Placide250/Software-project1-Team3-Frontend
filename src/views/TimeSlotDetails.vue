<script setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Seatmap from "../components/Seatmap.vue";
import OrderSummary from "../components/OrderSummary.vue";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import TimeSlotServices from "../services/TimeSlotServices.js";
import {
  STARTING_STANDARD_TICKETS,
  STARTING_WHEELCHAIR_TICKETS,
} from "../config/constants.js";

const route = useRoute();
const router = useRouter();

const savedData = route.query.data ? JSON.parse(route.query.data) : {}; // so users can come back to this page and edit their order

const eventId = route.params.eventId;
const slotId = route.params.slotId;
const timeSlot = ref({});

const selectedSeats = ref(savedData.selectedSeats ?? []);
const childCount = ref(savedData.childCount ?? 0);
const guestEmail = ref(savedData.guestEmail ?? "");

// update the query string when the data changes (the one that feeds into savedData)
watchEffect(() => {
  router.replace({
    query: {
      data: JSON.stringify({
        selectedSeats: selectedSeats.value,
        childCount: childCount.value,
        guestEmail: guestEmail.value,
      }),
    },
  });
});

const standardSeatsLeft = computed(() => {
  if (!timeSlot?.value?.tickets) return STARTING_STANDARD_TICKETS;
  return (
    STARTING_STANDARD_TICKETS -
    timeSlot?.value?.tickets.filter((t) => !t.isWheelchair).length
  );
});

const wheelchairSeatsLeft = computed(() => {
  if (!timeSlot?.value?.tickets) return STARTING_WHEELCHAIR_TICKETS;
  return (
    STARTING_WHEELCHAIR_TICKETS -
    timeSlot?.value?.tickets.filter((t) => t.isWheelchair).length
  );
});

// true when standard seats are completely filled
const isSoldOut = computed(() => standardSeatsLeft.value === 0);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getTimeSlot();
});

async function getTimeSlot() {
  await TimeSlotServices.getSlot(slotId)
    .then((response) => {
      timeSlot.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function selectSeat(seat, isWheelchair) {
  if (selectedSeats.value.some((s) => s.seat === seat)) {
    selectedSeats.value = selectedSeats.value.filter((s) => s.seat !== seat);
  } else {
    selectedSeats.value.push({ isWheelchair, seat });
  }
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row class="d-flex justify-end">
      <v-btn
        variant="flat"
        color="secondary"
        :to="{ name: 'eventDetails', params: { id: eventId } }"
        class="my-4"
      >
        <v-icon start icon="mdi-arrow-left"></v-icon>
        Back to Event
      </v-btn>
    </v-row>

    <div class="d-flex justify-start">
      <v-chip class="ma-2" color="accent" label>
        <v-icon start icon="mdi-calendar-range"></v-icon>
        {{ formatShowingDateTime(timeSlot.datetime) }}
      </v-chip>
      <v-chip class="ma-2" color="primary" label>
        <v-icon start icon="mdi-cash-multiple"></v-icon>
        {{ formatPrice(timeSlot.event?.price) }}
      </v-chip>
      <v-chip class="ma-2" :color="isSoldOut ? 'error' : 'green'" label>
        <v-icon start icon="mdi-seat"></v-icon>
        {{ isSoldOut ? "Sold Out" : standardSeatsLeft + " standard seats left" }}
      </v-chip>
      <v-chip class="ma-2" color="blue" label>
        <v-icon start icon="mdi-wheelchair-accessibility"></v-icon>
        {{ wheelchairSeatsLeft }} wheelchair seats left
      </v-chip>
    </div>

    <v-card-title class="pl-0 text-h4 font-weight-bold">{{
      timeSlot.event?.name
    }}</v-card-title>
    <p class="text-body-1">{{ timeSlot.event?.description }}</p>

    <!-- Only shows when standard seats = 0 -->
    <v-card
      v-if="isSoldOut"
      class="rounded-lg elevation-3 my-4 pa-4"
      color="error"
      variant="tonal"
    >
      <v-row align="center">
        <v-col cols="8">
          <p class="text-body-1 font-weight-bold">This timeslot is sold out.</p>
          <p class="text-body-2">
            Join the waitlist and we will notify you if a spot opens up.
          </p>
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
          <v-btn
            variant="flat"
            color="primary"
            @click="router.push({ name: 'waitlist', params: { eventId: eventId } })"
          >
            Join Waitlist
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <v-divider class="my-4"></v-divider>

    <seatmap
      :selected-seats="selectedSeats"
      @select-seat="selectSeat"
      :reserved-tickets="timeSlot.tickets"
    />

    <v-divider class="my-4"></v-divider>

    <order-summary
      v-model:child-count="childCount"
      v-model:guest-email="guestEmail"
      :selected-seats="selectedSeats"
      :time-slot="timeSlot"
    />

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