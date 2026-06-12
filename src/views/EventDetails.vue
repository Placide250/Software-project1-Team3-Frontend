<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import EventServices from "../services/EventServices.js";
import formatPrice from "../utils/formatPrice.js";
import {
  formatShowingDate,
  formatShowingTime,
} from "../utils/formatDatesAndTimes.js";
import {
  STARTING_STANDARD_TICKETS,
  STARTING_WHEELCHAIR_TICKETS,
} from "../config/constants.js";

const route = useRoute();
const router = useRouter();
const eventId = route.params.id;
const event = ref({});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const standardSeatsLeft = (slot) => {
  if (!slot?.tickets) return STARTING_STANDARD_TICKETS;
  return (
    STARTING_STANDARD_TICKETS -
    slot?.tickets.filter((t) => !t.isWheelchair).length
  );
};

const wheelchairSeatsLeft = (slot) => {
  if (!slot?.tickets) return STARTING_WHEELCHAIR_TICKETS;
  return (
    STARTING_WHEELCHAIR_TICKETS -
    slot?.tickets.filter((t) => t.isWheelchair).length
  );
};

onMounted(async () => {
  await getEvent();
});

async function getEvent() {
  await EventServices.getEvent(eventId)
    .then((response) => {
      event.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

function buyTicket(slot) {
  router.push({
    name: "timeSlotDetails",
    params: { eventId: eventId, slotId: slot.id },
  });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>
<template>
  <v-container>
    <v-row align="center">
      <v-col cols="8">
        <v-card-title class="pl-0 text-h4 font-weight-bold">{{
          event.name
        }}</v-card-title>
        <p class="text-body-1">{{ event.description }}</p>
      </v-col>
      <v-col class="d-flex justify-end" cols="4">
        <v-chip class="ma-2" color="primary" label>
          <v-icon start icon="mdi-cash-multiple"></v-icon>
          {{ formatPrice(event.price) }}
        </v-chip>
        <v-chip class="ma-2" color="accent" label>
          <v-icon start icon="mdi-calendar-month"></v-icon>
          {{ event.slots?.length }} showings
        </v-chip>
      </v-col>
    </v-row>

    <v-table class="mt-4">
      <thead>
        <tr>
          <th class="text-left">Date</th>
          <th class="text-left">Time</th>
          <th class="text-left">Standard Seats Left</th>
          <th class="text-left">Wheelchair Seats Left</th>
          <th class="text-left">Tickets</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="slot in event.slots" :key="slot.id">
          <td>
            {{ formatShowingDate(slot.datetime) }}
          </td>
          <td>
            {{ formatShowingTime(slot.datetime) }}
          </td>
          <td>{{ standardSeatsLeft(slot) }}</td>
          <td>{{ wheelchairSeatsLeft(slot) }}</td>
          <td>
            <v-btn color="primary" @click="buyTicket(slot)">
              <v-icon start icon="mdi-ticket"></v-icon>
              Buy
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

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
