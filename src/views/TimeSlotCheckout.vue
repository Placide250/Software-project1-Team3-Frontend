<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Seatmap from "../components/Seatmap.vue";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import TimeSlotServices from "../services/TimeSlotServices.js";

const route = useRoute();
const router = useRouter();
const eventId = route.params.eventId;
const slotId = route.params.slotId;
const timeSlot = ref({});
const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
const EMAIL_RULES = [
  (value) => {
    if (value) return true;

    return "E-mail is required.";
  },
  (value) => {
    if (EMAIL_REGEX.test(value)) return true;

    return "E-mail must be valid.";
  },
];

const selectedSeats = ref([]);
const childCount = ref(0);
const user = ref(null);
const guestEmail = ref("");

const ticketCount = computed(() => selectedSeats.value.length);
const estimatedTotal = computed(() => {
  const price = timeSlot.value.event?.price ?? 0;
  return (ticketCount.value - childCount.value) * price;
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getTimeSlot();
  user.value = JSON.parse(localStorage.getItem("user"));
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

function checkout() {
  snackbar.value.value = true;
  snackbar.value.color = "green";
  snackbar.value.text = "TODO: Implement Checkout";
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

    <v-card class="rounded-lg elevation-5 mt-8">
      <v-card-title class="text-h6 font-weight-bold pa-4 pb-2"
        >Order Summary</v-card-title
      >
      <v-divider></v-divider>
      <v-card-text class="pa-4">
        <p class="text-subtitle-2 font-weight-bold mb-2">Selected Seats</p>
        <div
          v-if="selectedSeats.length === 0"
          class="text-body-2 text-medium-emphasis mb-4"
        >
          No seats selected. Choose seats from the map above.
        </div>
        <div v-else class="mb-4">
          <v-chip
            v-for="seat in selectedSeats"
            :key="seat.seat"
            :color="seat.isWheelchair ? 'blue' : 'green'"
            variant="elevated"
            label
            class="ma-1"
          >
            <v-icon
              v-if="seat.isWheelchair"
              start
              icon="mdi-wheelchair-accessibility"
            ></v-icon>
            {{ seat.seat }}
          </v-chip>
        </div>

        <v-row align="center" class="mb-2">
          <v-col cols="12" sm="6">
            <p class="text-subtitle-2 font-weight-bold mb-1">
              Children in Party
            </p>
            <p class="text-caption text-medium-emphasis">
              Children ages 8 and under are free.
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="childCount"
              :items="
                Array.from(
                  { length: ticketCount }, // require at least one adult per party
                  (_, i) => i,
                )
              "
              label="# of children"
              variant="outlined"
              density="compact"
              :disabled="ticketCount === 0"
              hide-details
            ></v-select>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <v-row align="center" class="mb-2">
          <v-col>
            <p class="text-subtitle-2 font-weight-bold">Estimated Total</p>
            <p class="text-caption text-medium-emphasis">
              {{ ticketCount }} ticket{{ ticketCount !== 1 ? "s" : "" }}
              ×
              {{ formatPrice(timeSlot.event?.price ?? 0) }}
            </p>
          </v-col>
          <v-col class="text-right">
            <span class="text-h6 font-weight-bold">{{
              formatPrice(estimatedTotal)
            }}</span>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div v-if="user">
          <p class="text-subtitle-2 font-weight-bold mb-1">Account</p>
          <v-chip
            prepend-icon="mdi-account-circle"
            variant="tonal"
            color="primary"
          >
            {{ user.email }}
          </v-chip>
        </div>
        <v-alert v-else type="info" variant="tonal" class="mt-2">
          You are not logged in. Enter your email so we can send you a
          confirmation, or
          <router-link :to="{ name: 'login' }">log in</router-link> if you have
          an account.
          <v-text-field
            v-model="guestEmail"
            label="Email"
            :rules="EMAIL_RULES"
            required
            class="mt-2"
          ></v-text-field>
        </v-alert>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          color="primary"
          size="large"
          :disabled="ticketCount === 0 || (!user && guestEmail === '')"
          append-icon="mdi-arrow-right"
          @click="checkout()"
        >
          Continue to Checkout
        </v-btn>
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
