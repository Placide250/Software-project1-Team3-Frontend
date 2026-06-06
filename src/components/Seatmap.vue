<script setup>
const props = defineProps({
  selectedSeats: {
    type: Array,
    default: () => [],
  },
  previewOnly: { type: Boolean, default: false },
  isOpen: { type: Boolean, default: false },
});

const emit = defineEmits(["select-seat", "update:isOpen"]);

function seatId(row, seat) {
  return `${row}${seat}`;
}

function isSelected(row, seat) {
  return props.selectedSeats.some((s) => s.seat === seatId(row, seat));
}

function handleSeatClick(row, seat, isWheelchair) {
  emit("select-seat", seatId(row, seat), isWheelchair);
}

/*
Row A: 11 seats
Row B: 12 seats
Row C: 12 seats
Row D: 13 seats
Row E: 13 seats
Row F: ♿ + 14 seats + ♿
*/

const SEATS = [
  { row: "A", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { row: "B", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { row: "C", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { row: "D", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { row: "E", seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  {
    row: "F",
    seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    leftWheelchair: true,
    rightWheelchair: true,
  },
];
</script>

<template>
  <v-dialog
    v-if="previewOnly"
    :model-value="isOpen"
    max-width="1000"
    @update:model-value="emit('update:isOpen', $event)"
  >
    <v-card class="rounded-lg elevation-5">
      <v-card-title class="headline text-center">Front</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="body-1">
        <div
          v-for="row in SEATS"
          :key="row.row"
          class="d-flex justify-center align-center"
        >
          <div v-if="row.leftWheelchair">
            <v-chip
              color="blue"
              :variant="isSelected(row.row, 0) ? 'elevated' : 'outlined'"
              label
              style="width: 60px; cursor: pointer"
              class="ma-1 d-flex justify-center align-center"
            >
              <v-icon start icon="mdi-wheelchair-accessibility"></v-icon>
              {{ row.row }}0
            </v-chip>
          </div>
          <div v-for="seat in row.seats" :key="seat">
            <v-chip
              color="green"
              :variant="isSelected(row.row, seat) ? 'elevated' : 'outlined'"
              label
              style="width: 45px; cursor: pointer"
              class="ma-1 d-flex justify-center align-center"
            >
              {{ seatId(row.row, seat) }}
            </v-chip>
          </div>
          <div v-if="row.rightWheelchair">
            <v-chip
              color="blue"
              :variant="
                isSelected(row.row, row.seats.length + 1)
                  ? 'elevated'
                  : 'outlined'
              "
              label
              style="width: 60px; cursor: pointer"
              class="ma-1 d-flex justify-center align-center"
            >
              <v-icon start icon="mdi-wheelchair-accessibility"></v-icon>
              {{ row.row }}{{ row.seats.length + 1 }}
            </v-chip>
          </div>
        </div>
      </v-card-text>
      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          color="secondary"
          @click="emit('update:isOpen', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card v-else class="rounded-lg elevation-5">
    <v-card-title class="headline text-center">Front</v-card-title>
    <v-divider></v-divider>
    <v-card-text class="body-1">
      <div
        v-for="row in SEATS"
        :key="row.row"
        class="d-flex justify-center align-center"
      >
        <div v-if="row.leftWheelchair">
          <v-chip
            color="blue"
            :variant="isSelected(row.row, 0) ? 'elevated' : 'outlined'"
            label
            style="width: 60px; cursor: pointer"
            class="ma-1 d-flex justify-center align-center"
            @click="handleSeatClick(row.row, 0, true)"
          >
            <v-icon start icon="mdi-wheelchair-accessibility"></v-icon>
            {{ row.row }}0
          </v-chip>
        </div>
        <div v-for="seat in row.seats" :key="seat">
          <v-chip
            color="green"
            :variant="isSelected(row.row, seat) ? 'elevated' : 'outlined'"
            label
            style="width: 45px; cursor: pointer"
            class="ma-1 d-flex justify-center align-center"
            @click="handleSeatClick(row.row, seat, false)"
          >
            {{ seatId(row.row, seat) }}
          </v-chip>
        </div>
        <div v-if="row.rightWheelchair">
          <v-chip
            color="blue"
            :variant="
              isSelected(row.row, row.seats.length + 1)
                ? 'elevated'
                : 'outlined'
            "
            label
            style="width: 60px; cursor: pointer"
            class="ma-1 d-flex justify-center align-center"
            @click="handleSeatClick(row.row, row.seats.length + 1, true)"
          >
            <v-icon start icon="mdi-wheelchair-accessibility"></v-icon>
            {{ row.row }}{{ row.seats.length + 1 }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-title class="headline text-center">Back</v-card-title>
  </v-card>
</template>
