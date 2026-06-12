<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";

const router = useRouter();


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  isAdmin: false,
});

async function createAccount() {
  if (
    !user.value.firstName ||
    !user.value.lastName ||
    !user.value.email ||
    !user.value.password ||
    !user.value.confirmPassword
  ) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Please fill in all fields";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(user.value.email)) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Please enter a valid email address";
    return;
  }

  if (user.value.password.length < 6) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Password must be at least 6 characters";
    return;
  }

  if (user.value.password !== user.value.confirmPassword) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Passwords do not match";
    return;
  }

  try {
    await UserServices.addUser({
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        email: user.value.email,
        password: user.value.password,
        isAdmin: user.value.isAdmin
    });
    snackbar.value.value = true;
    snackbar.value.color = "green";
    snackbar.value.text = "Account created successfully";

    setTimeout(() => {
      router.push("/");
    }, 1000);
  } catch (error) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.message;
  }
}

function goToLogin() {
  router.push("/");
}
</script>

<template>
  <v-container>
    <v-card class="mx-auto mt-10" max-width="600">
      <v-card-title>Create Account</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="user.firstName"
          label="First Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.lastName"
          label="Last Name"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.email"
          label="Email"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.password"
          label="Password"
          type="password"
          required
        ></v-text-field>

        <v-text-field
          v-model="user.confirmPassword"
          label="Confirm Password"
          type="password"
          required
        ></v-text-field>

        <v-checkbox
          v-model="user.isAdmin"
          label="Admin Account"
        ></v-checkbox>
      </v-card-text>

      <v-card-actions>
        <v-btn color="secondary" @click="goToLogin">
          Back to Login
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="primary" @click="createAccount">
          Register
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar.value">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>