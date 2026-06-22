import apiClient from "./services";

export default {
  getOrders() {
    return apiClient.get("orders");
  },
  getOrdersByUser(userId) {
    return apiClient.get(`orders?userId=${userId}`);
  },
  getOrder(id) {
    return apiClient.get("orders/" + id);
  },
  addOrder(eventId, slotId, order) {
    return apiClient.post(`events/${eventId}/slots/${slotId}/orders`, order);
  },
  cancelOrder(orderId) {
    return apiClient.put(`orders/${orderId}/cancel`);
  },
};