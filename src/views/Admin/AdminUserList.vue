<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import EventCard from "../../components/EventCardComponent.vue";
import UserServices from "../../services/UserServices.js";
import { formatShowingDateTime } from "../../utils/formatDatesAndTimes.js";
import formatPrice from "../../utils/formatPrice.js";
import { PAYMENT_METHODS } from "../../config/constants.js";

const users = ref([]);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getUsers();
});

async function getUsers() {
  await UserServices.getUsers()
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.message;
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5 mt-8">
        <v-card-title
          ><v-row align="center">
            <v-col cols="10"
              ><v-card-title class="headline">Admin - Users</v-card-title>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">First Name</th>
                <th class="text-left">Last Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Is Admin</th>
                <th class="text-left justify-end d-flex align-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  {{ user.firstName }}
                </td>
                <td>
                  {{ user.lastName }}
                </td>
                <td>
                  {{ user.email }}
                </td>
                <td>
                  <v-chip
                    v-if="user.isAdmin"
                    color="primary"
                    variant="tonal"
                    label
                  >
                    <v-icon start icon="mdi-shield-check"></v-icon>
                    Admin
                  </v-chip>
                </td>
                <td class="justify-end d-flex align-center">
                  <v-btn
                    color="primary"
                    :to="{
                      name: 'adminEditUser',
                      params: {
                        id: user.id,
                      },
                    }"
                  >
                    <v-icon start icon="mdi-pencil"></v-icon>
                    Edit
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

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
