<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import UserServices from "../../services/UserServices.js";
import OrderList from "../OrderList.vue";

const route = useRoute();
const router = useRouter();

const userId = route.params.id;
const user = ref({});
const activeUser = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getUser();
  activeUser.value = JSON.parse(localStorage.getItem("user"));
});

async function getUser() {
  await UserServices.getUser(userId)
    .then((response) => {
      user.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateUser() {
  await UserServices.updateUser(user.value.id, user.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${user.value.firstName} ${user.value.lastName} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getUser();
}

async function deleteUser() {
  await UserServices.deleteUser(user.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `User deleted successfully!`;
      router.push({ name: "adminUsers" });
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
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Admin - Edit User
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
                  v-model="user.firstName"
                  label="First Name"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="user.lastName"
                  label="Last Name"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="user.email"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-switch
                  v-model="user.isAdmin"
                  label="Admin"
                  true-icon="mdi-check"
                  false-icon="mdi-close"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn
              variant="flat"
              color="secondary"
              @click="deleteUser()"
              v-if="user?.id != activeUser?.id"
            >
              <v-icon start icon="mdi-delete"></v-icon>
              Delete User
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="updateUser()"
              >Update User</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <OrderList
    :user-id="userId ?? null"
    :username="!!user ? `${user.firstName} ${user.lastName}` : null"
    :is-admin="true"
  />

  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
