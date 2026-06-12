<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// import EventServices from "../services/EventServices.js";
import formatPrice from "../utils/formatPrice.js";
import {
  formatShowingDate,
  formatShowingTime,
} from "../utils/formatDatesAndTimes.js";

const route = useRoute();
const router = useRouter();
const orderId = route.params.id;
const order = ref({});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  // await getEvent();
});

// async function getEvent() {
//   await EventServices.getEvent(eventId)
//     .then((response) => {
//       event.value = response.data[0];
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>
<template>
  <v-container>
    <v-row align="center">
      <v-col cols="8">
        <v-card-title class="pl-0 text-h4 font-weight-bold"
          >Order Details (TODO)</v-card-title
        >
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
