import apiClient from "./services";

export default {
  getSlots() {
    return apiClient.get("slots");
  },
  getSlot(id) {
    return apiClient.get("slots/" + id);
  },
  getSlotByDate(date) {
    return apiClient.get("slots/day/" + date);
  },
  getSlotsByEvent(eventId) {
    return apiClient.get("events/" + eventId + "/slots");
  },
  addSlot(eventId, slot) {
    return apiClient.post("events/" + eventId + "/slots", slot);
  },
  addRecurringSlots(eventId, recurringData) {
    return apiClient.post(
      "events/" + eventId + "/slots/recurring",
      recurringData,
    );
  },
  updateSlot(id, slot) {
    return apiClient.put("slots/" + id, slot);
  },
  deleteSlot(id) {
    return apiClient.delete("slots/" + id);
  },
  deleteAllSlots() {
    return apiClient.delete("slots/");
  },
};
