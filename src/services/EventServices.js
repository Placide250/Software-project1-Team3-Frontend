import apiClient from "./services";

export default {
  getEvents() {
    return apiClient.get("events");
  },
  getEvent(id) {
    return apiClient.get("events/" + id);
  },
  addEvent(event) {
    return apiClient.post("events", event);
  },
  updateEvent(eventId, event) {
    return apiClient.put("events/" + eventId, event);
  },
  deleteEvent(eventId) {
    return apiClient.delete("events/" + eventId);
  },
};
