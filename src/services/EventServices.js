import apiClient from "./services";
import fileClient from "./fileClient";

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
  uploadLogo(eventId, file) {
    const formData = new FormData();
    formData.append("logo", file);

    return fileClient.post(`events/${eventId}/logo`, formData);
  }
};
