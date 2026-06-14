<script setup>
import { onMounted, ref, watch } from "vue";
import EventCard from "../components/EventCardComponent.vue";
import EventServices from "../services/EventServices.js";

const events = ref([]);
const user = ref(null);
const showPastEvents = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getEvents();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getEvents() {
  await EventServices.getEvents()
    .then((response) => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      user.value = storedUser;
      console.log("USER:", storedUser);
      console.log("IS ADMIN:", storedUser?.isAdmin);

      const showPastEventsFromStorage =
        localStorage.getItem("showPastEvents") === "true";

      if (showPastEventsFromStorage) {
        // ADMIN MODE → show ALL events
        events.value = response.data;
      } else {
        // CUSTOMER MODE → only future events
        events.value = response.data.filter((event) =>
          event.slots?.some(
            (slot) => new Date(slot.datetime) >= new Date()
          )
        );
      }
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.message;
    });
}

watch(showPastEvents, (newValue) => {
  localStorage.setItem("showPastEvents", newValue);
  getEvents(); 
});

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
            >Events
          </v-card-title>
        </v-col>
        <v-col cols="4" class="d-flex justify-end">
          <v-switch
            v-if="user?.isAdmin"
            v-model="showPastEvents"
            label="Show Past Events"
            hide-details
          ></v-switch>
        </v-col>
      </v-row>

      <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        @deletedEvent="getEvents()"
      />

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
