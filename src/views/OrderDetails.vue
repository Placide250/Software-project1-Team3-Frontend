<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import OrderReview from "../components/OrderReview.vue";
import OrderServices from "../services/OrderServices.js";

const route = useRoute();

const orderId = route.params.id;
const order = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getOrder();
});

async function getOrder() {
  await OrderServices.getOrder(orderId)
    .then((response) => {
      order.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response?.data?.message ?? error.message;
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <!-- Progress bar to prevent order is undefined errors -->
    <v-row v-if="!order" class="fill-height" align="center" justify="center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>

    <div v-if="order">
      <v-row class="d-flex mb-2">
        <v-btn
          variant="flat"
          color="secondary"
          :to="{ name: 'orders' }"
          class="my-4"
        >
          <v-icon start icon="mdi-arrow-left"></v-icon>
          Back to Orders
        </v-btn>
      </v-row>

      <OrderReview :order="order" />
    </div>

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
