import apiClient from "./services";

export default {
  getUser(userId) {
    return apiClient.get("users/" + userId);
  },

  addUser(user) {
    return apiClient.post("users", user);
  },
  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
  getUsers() {
    return apiClient.get("users");
  },
  updateUser(userId, user) {
    return apiClient.put("users/" + userId, user);
  },
  deleteUser(userId) {
    return apiClient.delete("users/" + userId);
  },
};
