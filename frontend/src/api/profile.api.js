import api from "./axios.js";

export const getProfile = () =>
  api.get("/profile/").then((res) => res.data);

export const updateProfile = (data) =>
  api.put("/profile/update", data).then((res) => res.data);

export const changePassword = (data) =>
  api.put("/profile/changepassword", data).then((res) => res.data);
