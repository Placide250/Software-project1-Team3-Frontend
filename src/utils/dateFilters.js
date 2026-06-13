export function isFutureSlot(slot) {
  return new Date(slot.datetime) >= new Date();
}