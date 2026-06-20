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
const logoFile = ref(null);

const event = ref({});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
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

async function createEvent() {
  try {
    const response = await EventServices.addEvent(event.value);
    const eventId = response.data.id;

    // upload logo only if selected
    if (logoFile.value) {
      await EventServices.uploadLogo(eventId, logoFile.value);
    }

    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = `${event.value.name} created successfully!`;

    router.push({
      name: "adminEditEvent",
      params: { id: eventId },
    });
  } catch (error) {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response?.data?.message;
  }
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
          >Admin - Create Event
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
            <v-row>
              <v-col>
                <v-file-input
                  v-model="logoFile"
                  label="Event Logo"
                  accept="image/*"
                  prepend-icon="mdi-image"
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="createEvent()"
              >Create Event</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
