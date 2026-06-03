<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import WaitlistServices from "../services/WaitlistServices.js";

const props = defineProps({
  eventId: {
    type: String,
    required: false,
    default: null,
  },
});

const router = useRouter();
const user = ref(null);
const isLoading = ref(false);
const isSubmitted = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value === null) {
    router.push({ name: "login" });
    return;
  }
  form.value.firstName = user.value.firstName || "";
  form.value.lastName = user.value.lastName || "";
  form.value.email = user.value.email || "";
});

async function submitWaitlist() {
  isLoading.value = true;
  const entry = {
    userId: user.value.id,
    eventId: props.eventId,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    email: form.value.email,
    phone: form.value.phone,
  };
  await WaitlistServices.addToWaitlist(entry)
    .then(() => {
      isSubmitted.value = true;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "You have been added to the waitlist!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.message;
    });
  isLoading.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function goBack() {
  router.push({ name: "events" });
}
</script>

<template>
  <v-container>
    <div id="body">

      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold">
            Waitlist Registration
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn variant="outlined" color="secondary" @click="goBack()">
            Back
          </v-btn>
        </v-col>
      </v-row>

      <v-alert
        type="warning"
        variant="tonal"
        class="mb-6"
        icon="mdi-ticket-off"
      >
        This event is currently <strong>sold out</strong>. Join the waitlist and we will notify you if a spot opens up.
      </v-alert>

      <!-- Success state after submission -->
      <v-card v-if="isSubmitted" class="rounded-lg elevation-5">
        <v-card-text class="text-center pa-8">
          <v-icon size="64" color="success" icon="mdi-check-circle-outline" class="mb-4"></v-icon>
          <p class="text-h6 mb-2">You're on the waitlist!</p>
          <p class="text-body-1 text-grey">
            We will notify you at <strong>{{ form.email }}</strong> if a spot becomes available.
          </p>
          <v-btn class="mt-6" variant="flat" color="primary" @click="goBack()">
            Back to Events
          </v-btn>
        </v-card-text>
      </v-card>

      
      <v-card v-else class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Your Information</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.firstName"
                label="First Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.lastName"
                label="Last Name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="form.phone"
            label="Phone Number (optional)"
            type="tel"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" color="secondary" @click="goBack()">
            Cancel
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            :loading="isLoading"
            @click="submitWaitlist()"
          >
            Join Waitlist
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

    </div>
  </v-container>
</template>