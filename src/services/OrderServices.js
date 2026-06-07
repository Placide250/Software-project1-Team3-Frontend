import apiClient from "./services";

export default {
  getOrders() {
    return apiClient.get("orders");
  },
  getOrdersByEmail(email) {
    return apiClient.get("orders/email", { params: { email } });
  },
  getOrdersByCurrentUser() {
    return apiClient.get("orders/user/current");
  },
  getOrdersByUser(userId) {
    return apiClient.get("orders/user/" + userId);
  },
  getOrder(id) {
    return apiClient.get("orders/" + id);
  },
  addOrder(eventId, slotId, order) {
    return apiClient.post(`events/${eventId}/slots/${slotId}/orders`, order);
  },
  deleteOrder(orderId) {
    return apiClient.delete("orders/" + orderId);
  },
  deleteAllOrders() {
    return apiClient.delete("orders");
  },
};
