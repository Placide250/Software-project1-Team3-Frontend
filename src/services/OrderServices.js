import apiClient from "./services";

export default {
  getOrders() {
    return apiClient.get("orders");
  },
  getOrder(id) {
    return apiClient.get("orders/" + id);
  },
  addOrder(eventId, slotId, order) {
    // /events/:eventId/slots/slotId/orders
    return apiClient.post(`events/${eventId}/slots/${slotId}/orders`, order);
  },
  deleteOrder(orderOd) {
    return apiClient.delete("orders/" + orderId);
  },
};
