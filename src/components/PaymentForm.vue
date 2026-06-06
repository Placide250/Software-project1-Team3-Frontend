<script setup>
import { computed, ref } from "vue";

const emit = defineEmits(["checkout"]);

const selectedPaymentMethod = ref(null);
const paymentMethods = [
  { key: "credit_card", label: "Credit Card", icon: "mdi-credit-card-outline" },
  { key: "paypal", label: "Paypal", icon: "mdi-alpha-p-box-outline" },
  { key: "apple_pay", label: "Apple Pay", icon: "mdi-apple" },
  { key: "google_pay", label: "Google Pay", icon: "mdi-google" },
];
const cardName = ref("");
const cardNumber = ref("");
const cardExpiration = ref("");
const cardSecurityCode = ref("");

const CARD_NUMBER_REGEX = /^\d[\d ]{13,17}\d$/;
const CARD_NUMBER_RULES = [
  (v) => !!v || "Card number is required",
  (v) => CARD_NUMBER_REGEX.test(v) || "Enter a valid card number",
];

const CARD_SECURITY_CODE_REGEX = /^\d{3,4}$/;
const SECURITY_CODE_RULES = [
  (v) => !!v || "Security code is required",
  (v) =>
    CARD_SECURITY_CODE_REGEX.test(v) ||
    "Enter a valid 3 or 4 digit security code",
];

const CARD_EXPIRATION_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CARD_EXPIRATION_RULES = [
  (v) => !!v || "Expiration is required",
  (v) => CARD_EXPIRATION_REGEX.test(v) || "Enter a valid expiration (MM/YY)",
  (v) => {
    const [month, year] = v.split("/");
    const exp = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
    return exp > new Date() || "Card is expired";
  },
];

const canCheckout = computed(() => {
  if (!selectedPaymentMethod.value) return false;
  if (selectedPaymentMethod.value === "credit-card") {
    return (
      cardNumber.value &&
      cardExpiration.value &&
      cardSecurityCode.value &&
      cardName.value
    );
  }
  return true;
});
</script>

<template>
  <v-card class="rounded-lg elevation-5">
    <v-card-title class="text-h6 font-weight-bold pa-4 pb-2"
      >Payment</v-card-title
    >
    <v-divider></v-divider>
    <v-card-text class="pa-4">
      <p class="text-subtitle-2 font-weight-bold mb-3 text-center">
        Express Checkout
      </p>
      <v-row dense>
        <v-col
          v-for="method in paymentMethods"
          :key="method.key"
          :cols="12 / paymentMethods.length"
        >
          <v-btn
            block
            :variant="
              selectedPaymentMethod === method.key ? 'flat' : 'outlined'
            "
            :color="
              selectedPaymentMethod === method.key ? 'primary' : 'default'
            "
            height="52"
            @click="selectedPaymentMethod = method.key"
          >
            <div class="d-flex flex-column align-center">
              <v-icon size="20">{{ method.icon }}</v-icon>
              <span class="text-caption mt-1">{{ method.label }}</span>
            </div>
          </v-btn>
        </v-col>
      </v-row>
      <div v-if="selectedPaymentMethod === 'credit_card'">
        <v-divider class="my-4"></v-divider>
        <p class="text-subtitle-2 font-weight-bold text-center">
          Card Checkout
        </p>
        <p class="text-caption text-center text-medium-emphasis mb-6">
          Your data is NOT stored securely. Not even close.
        </p>
        <div class="px-4">
          <v-row>
            <v-text-field
              v-model="cardName"
              label="Name on Card"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-account"
              class="mb-3"
              hide-details
              :disabled="selectedPaymentMethod !== 'credit-card'"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="cardNumber"
              label="Card Number"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-credit-card-outline"
              placeholder="4242 4242 4242 4242"
              class="mb-3"
              hide-details
              :rules="CARD_NUMBER_RULES"
              :disabled="selectedPaymentMethod !== 'credit-card'"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-col cols="6" style="padding: 0px">
              <v-text-field
                v-model="cardSecurityCode"
                label="Security Code"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-credit-card-lock"
                placeholder="123"
                class="mb-3"
                hide-details
                :rules="SECURITY_CODE_RULES"
                :disabled="selectedPaymentMethod !== 'credit-card'"
              ></v-text-field>
            </v-col>
            <v-col cols="6" style="padding: 0px; padding-left: 8px">
              <v-text-field
                v-model="cardExpiration"
                label="Card Expiration"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-calendar"
                placeholder="MM/YY"
                class="mb-3"
                hide-details
                :rules="CARD_EXPIRATION_RULES"
                :disabled="selectedPaymentMethod !== 'credit-card'"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="pa-4">
      <v-btn
        variant="flat"
        color="primary"
        prepend-icon="mdi-lock"
        :disabled="!canCheckout"
        class="w-100"
        @click="emit('checkout')"
      >
        Place Order
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
