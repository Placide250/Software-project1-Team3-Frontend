import apiClient from "./services";

export default {
  getWaitlistByEventId(eventId) {
    return apiClient.get("waitlist/event/" + eventId);
  },

  getWaitlistByUserId(userId) {
    return apiClient.get("waitlist/user/" + userId);
  },

  addToWaitlist(waitlist) {
    return apiClient.post("waitlist", waitlist);
  },

  removeFromWaitlist(waitlistId) {
    return apiClient.delete("waitlist/" + waitlistId);
  },
};