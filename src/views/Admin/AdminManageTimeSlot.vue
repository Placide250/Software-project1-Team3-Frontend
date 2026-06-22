<script setup>
import { onMounted, ref, watchEffect, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  STARTING_STANDARD_TICKETS,
  STARTING_WHEELCHAIR_TICKETS,
  TIME_OPTIONS,
} from "../../config/constants.js";
import Seatmap from "../../components/Seatmap.vue";
import {
  buildDatetime,
  formatShowingDateTime,
  formatShowingTime,
} from "../../utils/formatDatesAndTimes.js";
import TimeSlotServices from "../../services/TimeSlotServices.js";
import formatPrice from "../../utils/formatPrice.js";

const route = useRoute();
const router = useRouter();

const eventId = route.params.eventId;
const slotId = route.params.slotId;
const timeSlot = ref({});

const editTimeSlotDate = ref(null);
const editTimeSlotTime = ref(null);

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
      editTimeSlotDate.value = new Date(timeSlot.value.datetime);
      editTimeSlotTime.value = formatShowingTime(timeSlot.value.datetime);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function updateTimeSlot() {
  const datetime = buildDatetime(
    editTimeSlotDate.value,
    editTimeSlotTime.value,
  );

  await TimeSlotServices.updateSlot(timeSlot.value.id, { datetime })
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Time slot updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTimeSlot();
}

async function deleteTimeSlot() {
  await TimeSlotServices.deleteSlot(timeSlot.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Time slot deleted successfully!`;
      router.push({ name: "adminEditEvent", params: { id: eventId } });
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
    <v-row class="d-flex mb-4">
      <v-btn
        variant="flat"
        color="secondary"
        :to="{ name: 'adminEditEvent', params: { id: eventId } }"
        class="my-4"
      >
        <v-icon start icon="mdi-arrow-left"></v-icon>
        Back to Event
      </v-btn>
    </v-row>

    <v-card-title class="pl-0 text-h4 font-weight-bold">{{
      timeSlot.event?.name
    }}</v-card-title>
    <p class="text-body-1">{{ timeSlot.event?.description }}</p>
    <div class="d-flex justify-start mb-4">
      <v-chip class="ma-2" color="accent" label>
        <v-icon start icon="mdi-calendar-range"></v-icon>
        {{ formatShowingDateTime(timeSlot.datetime) }}
      </v-chip>
      <v-chip class="ma-2" color="primary" label>
        <v-icon start icon="mdi-cash-multiple"></v-icon>
        {{ formatPrice(timeSlot.event?.price) }}
      </v-chip>
      <v-chip class="ma-2" color="green" label>
        <v-icon start icon="mdi-seat"></v-icon>
        {{ standardSeatsLeft }} standard seats left
      </v-chip>
      <v-chip class="ma-2" color="blue" label>
        <v-icon start icon="mdi-wheelchair-accessibility"></v-icon>
        {{ wheelchairSeatsLeft }} wheelchair seats left
      </v-chip>
    </div>

    <v-card class="rounded-lg elevation-5 mb-8">
      <v-card-title class="headline mb-2">Edit Time Slot</v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-date-input
              v-model="editTimeSlotDate"
              label="Date"
              required
            ></v-date-input>
          </v-col>

          <v-col>
            <v-select
              v-model="editTimeSlotTime"
              :items="TIME_OPTIONS"
              label="Time"
              required
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="flat"
          color="secondary"
          @click="deleteTimeSlot(editTimeSlotId)"
        >
          <v-icon start icon="mdi-delete"></v-icon>
          Delete Slot</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn variant="flat" color="primary" @click="updateTimeSlot()"
          >Update Time Slot</v-btn
        >
      </v-card-actions>
    </v-card>

    <seatmap
      :selected-seats="selectedSeats"
      :reserved-tickets="timeSlot.tickets"
    />

    <v-card class="rounded-lg elevation-5 mt-8">
      <v-card-title
        ><v-row align="center">
          <v-col cols="10"
            ><v-card-title class="headline">Tickets</v-card-title>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-table class="mt-4">
          <thead>
            <tr>
              <th class="text-left">Customer</th>
              <th class="text-left">Seat</th>
              <th class="text-left">Type</th>
              <th class="text-left justify-end d-flex align-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ticket in timeSlot.tickets" :key="ticket.id">
              <td>
                <v-chip
                  prepend-icon="mdi-account-circle"
                  :color="ticket?.order?.user ? 'primary' : 'default'"
                >
                  {{
                    ticket?.order?.user
                      ? `${ticket?.order?.user?.firstName} ${ticket?.order?.user?.lastName} (${ticket?.order?.user?.email})`
                      : ticket?.order?.guestEmail
                  }}
                </v-chip>
                <v-chip
                  v-if="!ticket?.order?.user"
                  class="ml-2"
                  color="warning"
                  size="small"
                >
                  Guest
                </v-chip>
              </td>
              <td>
                {{ ticket.seat }}
              </td>
              <td>{{ ticket.isWheelchair ? "Wheelchair" : "Standard" }}</td>
              <td class="justify-end d-flex align-center">
                <v-btn
                  color="primary"
                  :to="{
                    name: 'adminOrderDetails',
                    params: { id: ticket.order.id },
                  }"
                >
                  <v-icon start icon="mdi-ticket"></v-icon>
                  View Order
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
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
