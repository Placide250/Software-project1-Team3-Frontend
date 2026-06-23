import apiClient from "./services";

export default {
  getWaitlistBySlotId(slotId) {
    return apiClient.get("waitlist/slot/" + slotId);
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