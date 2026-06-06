<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import EventServices from "../services/EventServices.js";

const route = useRoute();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const event = ref({
  name: null,
  price: null,
  description: null,
});

async function createEvent() {
  console.log(event.value);
  await EventServices.addEvent(event.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${event.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.message;
    });
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Create Event
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row rows="10">
              <v-col>
                <v-text-field
                  v-model="event.name"
                  label="Name"
                  required
                ></v-text-field>                
                <v-text-field
                  v-model.number="event.price"
                  label="Price"
                  type="number"
                  required
                ></v-text-field>
                <v-textarea
                  v-model.number="event.description"
                  label="Description"
                  rows="5"
                  required
                ></v-textarea>
                <v-switch
                  label="Recurring event"
                  color="primary"
                ></v-switch>
              </v-col>
              <v-col>
              <!--THIS IS A PLACEHOLDER-->
                <v-textarea
                  rows="10"
                  label="Placeholder"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <!-- THIS IS A PLACEHOLDER AND MUST BE CHANGED WHEN A BETTER ADMIN PAGE IS MADE-->
              <v-btn
              variant="flat"
              color="secondary"
              @click="location.href='./views/RecipeList.vue'"
              >Close</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="createEvent()"
              >Create Event</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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
  </v-container>
</template>
