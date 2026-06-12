<script setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Seatmap from "../components/Seatmap.vue";
import formatPrice from "../utils/formatPrice.js";
import { formatShowingDateTime } from "../utils/formatDatesAndTimes.js";
import TimeSlotServices from "../services/TimeSlotServices.js";
import OrderSummary from "../components/OrderSummary.vue";
import PaymentForm from "../components/PaymentForm.vue";
import OrderServices from "../services/OrderServices.js";

const route = useRoute();
const router = useRouter();

const savedData = route.query.data ? JSON.parse(route.query.data) : {};

const eventId = route.params.eventId;
const slotId = route.params.slotId;
const timeSlot = ref({});
const user = ref(null);

const selectedSeats = ref(savedData.selectedSeats ?? []);
const childCount = ref(savedData.childCount ?? 0);
const guestEmail = ref(savedData.guestEmail ?? "");
const ticketCount = ref(savedData.ticketCount ?? 0);
const estimatedTotal = ref(savedData.estimatedTotal ?? 0);

const selectedPaymentMethod = ref(null);
const paymentMethods = [
  { key: "credit-card", label: "Credit Card", icon: "mdi-credit-card" },
  { key: "apple-pay", label: "Apple Pay", icon: "mdi-apple" },
  { key: "google-pay", label: "Google Pay", icon: "mdi-google" },
];
const cardNumber = ref("");
const cardExpiry = ref("");
const cardCvv = ref("");
const cardName = ref("");

watchEffect(() => {
  router.replace({
    query: {
      data: JSON.stringify({
        selectedSeats: selectedSeats.value,
        childCount: childCount.value,
        guestEmail: guestEmail.value,
      }),
    },
  });
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

async function checkout(paymentData) {
  const data = {
    selectedSeats: selectedSeats.value,
    childCount: childCount.value,
    guestEmail: guestEmail.value,
    paymentMethod: paymentData.paymentMethod,
    paymentToken:
      paymentData.paymentMethod === "credit-card"
        ? null
        : Math.random().toString(36).substring(2), // random string to simulate 3rd party payment token
    cardName: paymentData.cardName,
    cardNumber: paymentData.cardNumber,
    expirationMonth: paymentData.cardExpiration.substring(0, 2),
    expirationYear: paymentData.cardExpiration.substring(3, 5),
    cardSecurityCode: paymentData.cardSecurityCode,
  };

  await OrderServices.addOrder(eventId, slotId, data)
    .then((res) => {
      console.log(res);
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Order created successfully!`;
      router.push({
        name: "orderDetails",
        params: { id: res.data.order.id },
      });
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
    <v-btn
      variant="flat"
      color="secondary"
      :to="{
        name: 'timeSlotDetails',
        params: { eventId: eventId, slotId: slotId },
        query: { data: JSON.stringify(savedData) },
      }"
      class="my-4"
    >
      <v-icon start icon="mdi-arrow-left"></v-icon>
      Edit Order
    </v-btn>

    <v-row align="center">
      <v-col cols="8">
        <v-card-title class="pl-0 text-h4 font-weight-bold"
          >Checkout</v-card-title
        >
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <payment-form @checkout="checkout" />
      </v-col>
      <v-col cols="6">
        <order-summary
          v-model:child-count="childCount"
          v-model:guest-email="guestEmail"
          :selected-seats="selectedSeats"
          :time-slot="timeSlot"
          :read-only="true"
        />
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
