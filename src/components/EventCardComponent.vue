<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import formatPrice from "../utils/formatPrice.js";

const router = useRouter();

const showDetails = ref(false);
const user = ref(null);

const props = defineProps({
  event: {
    required: true,
  },
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

function navigateToEdit() {
  router.push({ name: "editEvent", params: { id: props.event.id } });
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ event.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-cash-multiple"></v-icon>
            {{ formatPrice(event.price) }}
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-calendar-check"></v-icon>
            12 upcoming time slots (hard-coded, update once we have that)
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ event.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>
          Add time slots here once we have those (use table like for recipes)
        </h3>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
