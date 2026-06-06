<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Seatmap from "../components/Seatmap.vue";
import EventServices from "../services/EventServices.js";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import TimeSlotServices from "../services/TimeSlotServices.js";

const route = useRoute();
const router = useRouter();
const eventId = route.params.eventId;
const slotId = route.params.slotId;
const timeSlot = ref({});

const selectedSeats = ref([]);

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
    });
}

function selectSeat(seat) {
  if (selectedSeats.value.includes(seat)) {
    selectedSeats.value = selectedSeats.value.filter((s) => s !== seat);
  } else {
    selectedSeats.value.push(seat);
  }
}

function navigateToEventDetails() {
  router.push({ name: "eventDetails", params: { id: eventId } });
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
      @click="navigateToEventDetails()"
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

    <v-card class="rounded-lg elevation-5 mt-8">
      <v-card-title
        ><v-row align="center">
          <v-col cols="10"
            ><v-card-title class="headline">Time Slots</v-card-title>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-text-field label="Name" required></v-text-field>
          </v-col>
          <v-col>
            <v-text-field label="Price" type="number"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea label="Description"></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-btn variant="flat" color="secondary">
          <v-icon start icon="mdi-delete"></v-icon>
          Delete Event
        </v-btn>
        TODO: Cancellations
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary"> Update Event</v-btn>
      </v-card-actions>
    </v-card>

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
