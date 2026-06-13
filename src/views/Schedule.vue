<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import EventCard from "../components/EventCardComponent.vue";
import EventServices from "../services/EventServices.js";
import TimeSlotServices from "../services/TimeSlotServices.js";
import formatPrice from "../utils/formatPrice.js";
import {
  formatShowingDate,
  formatShowingTime,
} from "../utils/formatDatesAndTimes.js";
import {
  STARTING_STANDARD_TICKETS,
  STARTING_WHEELCHAIR_TICKETS,
} from "../config/constants.js";

const events = ref([]);
const timeslots = ref([]);
const user = ref(null);
const route = useRoute();
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getEvents();
  await getTimeSlots();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getEvents() {
  await EventServices.getEvents()
    .then((response) => {
      events.value = response.data;
      console.log(events.value[0].name);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.message;
    });
}

function getEventName(id) {
    for (let i = 0; i < events.value.length; i++) {
      if (events.value[i].id == id) {
        return events.value[i].name;
      }
    }
    console.log(events.value);
}

async function getTimeSlots() {
  await TimeSlotServices.getSlotByDate(new Date())
    .then((response) => {
      timeslots.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.message;
    });
}

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

function viewEvent(slot) {
  router.push({
    name: "eventDetails",
    params: { id: slot.eventId,},
  });
}

function buyTicket(slot) {
  router.push({
    name: "timeSlotDetails",
    params: { eventId: slot.eventId, slotId: slot.id },
  });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Schedule
          </v-card-title>
        </v-col>
      </v-row>
<v-table class="mt-4">
      <thead>
        <tr>
          <th class="text-left">Event</th>
          <th class="text-left">Details</th>
          <th class="text-left">Date</th>
          <th class="text-left">Time</th>
          <th class="text-left">Standard Seats Left</th>
          <th class="text-left">Wheelchair Seats Left</th>
          <th class="text-left">Tickets</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="slot in timeslots" :key="slot.id">
          <td>{{ getEventName(slot.eventId)}}</td>
          <td>
            <v-btn color="primary" @click="viewEvent(slot)">
              Details
            </v-btn>
          </td>
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
