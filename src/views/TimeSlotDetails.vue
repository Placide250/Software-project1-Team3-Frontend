<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Seatmap from "../components/Seatmap.vue";
import OrderSummary from "../components/OrderSummary.vue";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import TimeSlotServices from "../services/TimeSlotServices.js";

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
    <v-btn
      variant="flat"
      color="secondary"
      :to="{ name: 'eventDetails', params: { id: eventId } }"
      class="my-4"
    >
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Back to Event
    </v-btn>

    <v-row align="center" class="mb-4">
      <v-col cols="8">
        <v-card-title class="pl-0 text-h4 font-weight-bold">{{
          timeSlot.event?.name
        }}</v-card-title>
        <p class="text-body-1">{{ timeSlot.event?.description }}</p>
      </v-col>
      <v-col class="d-flex justify-end" cols="4">
        <v-chip class="ma-2" color="accent" label>
          <v-icon start icon="mdi-calendar-range"></v-icon>
          {{ formatShowingDateTime(timeSlot.datetime) }}
        </v-chip>
        <v-chip class="ma-2" color="primary" label>
          <v-icon start icon="mdi-cash-multiple"></v-icon>
          {{ formatPrice(timeSlot.event?.price) }}
        </v-chip>
      </v-col>
    </v-row>

    <seatmap :selected-seats="selectedSeats" @select-seat="selectSeat" />

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
