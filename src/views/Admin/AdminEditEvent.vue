<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TimeSlotServices from "../../services/TimeSlotServices.js";
import EventServices from "../../services/EventServices.js";
import {
  buildDatetime,
  formatShowingDate,
  formatShowingTime,
  toLocalDateString,
  to24Hour,
} from "../../utils/formatDatesAndTimes.js";

const route = useRoute();
const router = useRouter();

const event = ref({});

const timeSlotAddModalOpen = ref(false);
const newTimeSlotDate = ref(null);
const newTimeSlotTime = ref(null);

const timeSlotRecurringAddModalOpen = ref(false);
const newTimeSlotRecurringStartDate = ref(null);
const newTimeSlotRecurringEndDate = ref(null);
const newTimeSlotRecurringFrequency = ref("");
const newTimeSlotRecurringTimes = ref([]);

const timeSlotEditModalOpen = ref(false);
const editTimeSlotId = ref(null);
const editTimeSlotDate = ref(null);
const editTimeSlotTime = ref(null);

const FREQUENCY_OPTIONS = ["Daily", "Weekly", "Biweekly", "Monthly"];

const TIME_OPTIONS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getEvent();
});

async function getEvent() {
  await EventServices.getEvent(route.params.id)
    .then((response) => {
      event.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateEvent() {
  await EventServices.updateEvent(event.value.id, event.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${event.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvent();
}

async function deleteEvent() {
  await EventServices.deleteEvent(event.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Event deleted successfully!`;
      router.push({ name: "adminEvents" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addTimeSlot() {
  const datetime = buildDatetime(newTimeSlotDate.value, newTimeSlotTime.value);

  await TimeSlotServices.addSlot(event.value.id, { datetime })
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Time slot added successfully!`;
      timeSlotAddModalOpen.value = false;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvent();
}

async function addRecurringTimeSlot() {
  const recurringData = {
    startDate: toLocalDateString(newTimeSlotRecurringStartDate.value),
    endDate: toLocalDateString(newTimeSlotRecurringEndDate.value),
    frequency: newTimeSlotRecurringFrequency.value.toLowerCase(),
    times: newTimeSlotRecurringTimes.value.map(to24Hour),
  };

  await TimeSlotServices.addRecurringSlots(event.value.id, recurringData)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Recurring time slots added successfully!`;
      timeSlotRecurringAddModalOpen.value = false;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvent();
}

async function updateTimeSlot() {
  const datetime = buildDatetime(
    editTimeSlotDate.value,
    editTimeSlotTime.value,
  );

  await TimeSlotServices.updateSlot(editTimeSlotId.value, { datetime })
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Time slot updated successfully!`;
      timeSlotEditModalOpen.value = false;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvent();
}

async function deleteTimeSlot(editTimeSlotId) {
  await TimeSlotServices.deleteSlot(editTimeSlotId)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Time slot deleted successfully!`;
      timeSlotEditModalOpen.value = false;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getEvent();
}

function openAddTimeSlot() {
  newTimeSlotDate.value = null;
  newTimeSlotTime.value = null;
  timeSlotAddModalOpen.value = true;
}

function openAddTimeSlotRecurring() {
  newTimeSlotRecurringStartDate.value = null;
  newTimeSlotRecurringEndDate.value = null;
  newTimeSlotRecurringFrequency.value = "";
  newTimeSlotRecurringTimes.value = [];
  timeSlotRecurringAddModalOpen.value = true;
}

function openEditTimeSlot(slot) {
  editTimeSlotId.value = slot.id;
  editTimeSlotDate.value = new Date(slot.datetime);
  editTimeSlotTime.value = formatShowingTime(slot.datetime);
  timeSlotEditModalOpen.value = true;
}

function closeAddTimeSlotModal() {
  timeSlotAddModalOpen.value = false;
}

function closeAddTimeSlotRecurringModal() {
  timeSlotRecurringAddModalOpen.value = false;
}

function closeEditTimeSlotModal() {
  timeSlotEditModalOpen.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Admin - Edit Event
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="event.name"
                  label="Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model.number="event.price"
                  label="Price"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="event.description"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="secondary" @click="deleteEvent()">
              <v-icon start icon="mdi-delete"></v-icon>
              Delete Event
            </v-btn>
            TODO: Cancellations, Logos
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="updateEvent()"
              >Update Event</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Time Slots</v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" class="me-2" @click="openAddTimeSlot()"
                  >Add</v-btn
                >
                <v-btn color="accent" @click="openAddTimeSlotRecurring()"
                  >Add Recurring</v-btn
                >
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-table class="mt-4">
              <thead>
                <tr>
                  <th class="text-left">Date</th>
                  <th class="text-left">Time</th>
                  <th class="text-left justify-end d-flex">Actions</th>
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
                  <td class="justify-end d-flex align-center">
                    <v-btn color="primary" @click="openEditTimeSlot(slot)">
                      <v-icon start icon="mdi-pencil"></v-icon>
                      Edit
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog persistent :model-value="timeSlotAddModalOpen" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Add Time Slot</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-date-input v-model="newTimeSlotDate" label="Date" required>
              </v-date-input>
            </v-col>

            <v-col>
              <v-select
                v-model="newTimeSlotTime"
                :items="TIME_OPTIONS"
                label="Time"
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeAddTimeSlotModal()"
            >Close</v-btn
          >
          <v-btn variant="flat" color="primary" @click="addTimeSlot()"
            >Add Time Slot</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      persistent
      :model-value="timeSlotRecurringAddModalOpen"
      width="1000"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2"
          >Add Recurring Time Slot</v-card-title
        >
        <v-card-text>
          <v-row>
            <v-col>
              <v-date-input
                v-model="newTimeSlotRecurringStartDate"
                label="Start"
              ></v-date-input>
            </v-col>
            <v-col>
              <v-date-input
                v-model="newTimeSlotRecurringEndDate"
                label="End"
              ></v-date-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                v-model="newTimeSlotRecurringFrequency"
                :items="FREQUENCY_OPTIONS"
                label="Frequency"
                required
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                v-model="newTimeSlotRecurringTimes"
                :items="TIME_OPTIONS"
                label="Times"
                multiple
                chips
                required
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeAddTimeSlotRecurringModal()"
            >Close</v-btn
          >
          <v-btn variant="flat" color="primary" @click="addRecurringTimeSlot()"
            >Add Time Slots</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="timeSlotEditModalOpen" width="800">
      <v-card class="rounded-lg elevation-5">
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
          TODO: Cancellations
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeEditTimeSlotModal()"
            >Close</v-btn
          >
          <v-btn variant="flat" color="primary" @click="updateTimeSlot()"
            >Update Time Slot</v-btn
          >
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
  </v-container>
</template>
