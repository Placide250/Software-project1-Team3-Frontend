<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
// import EventCard from "../components/EventCardComponent.vue";
// import EventServices from "../services/EventServices.js";

const orders = ref([]);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  // await getEvents();
  user.value = JSON.parse(localStorage.getItem("user"));
});

// async function getEvents() {
//   await EventServices.getEvents()
//     .then((response) => {
//       events.value = response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       snackbar.value.value = true;
//       snackbar.value.color = "error";
//       snackbar.value.text = error.message;
//     });
// }

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
            >Your Orders (TODO)
          </v-card-title>
        </v-col>
      </v-row>

      <!-- <EventCard
        v-for="event in events"
        :key="event.id"
        :event="event"
        @deletedEvent="getEvents()"
      /> -->

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
