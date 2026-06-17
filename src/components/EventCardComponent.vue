<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import formatPrice from "../utils/formatPrice.js";
import { isFutureSlot } from "../utils/dateFilters";

const router = useRouter();
const user = ref(null);

const props = defineProps({
  event: {
    required: true,
  },
  isAdmin: {
    required: false,
    default: false,
  },
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

function navigateToEventDetails() {
  if (!props.isAdmin) {
    router.push({ name: "eventDetails", params: { id: props.event.id } });
  } else {
    router.push({ name: "adminEditEvent", params: { id: props.event.id } });
  }
}
</script>

<template>
  <v-card class="rounded-lg elevation-5 mb-8" @click="navigateToEventDetails()">
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ event.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-cash-multiple"></v-icon>
            {{ formatPrice(event.price) }}
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-calendar-month"></v-icon>
            {{
              event.slots?.filter(isFutureSlot).length
            }} showings
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ event.description }}
    </v-card-text>
  </v-card>
</template>