import api from "./axios.js";

export const getBalance = () =>
  api.get("/wallet/balance").then((res) => res.data);

export const getTransactions = () =>
  api.get("/wallet/transactions").then((res) => res.data);

export const addMoney = (amount, description) =>
  api.post("/wallet/add", { amount, description }).then((res) => res.data);

export const withdrawMoney = (amount, description) =>
  api
    .post("/wallet/withdraw", { amount, description })
    .then((res) => res.data);
