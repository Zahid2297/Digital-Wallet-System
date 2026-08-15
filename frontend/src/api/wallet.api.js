import api from "./axios.js";

export const getBalance = () =>
  api.get("/wallet/balance").then((res) => res.data);

export const getWalletStats = () =>
  api.get("/wallet/stats").then((res) => res.data);

export const getTransactions = (params = {}) =>
  api.get("/wallet/transactions", { params }).then((res) => res.data);

export const exportTransactions = (params = {}) =>
  api
    .get("/wallet/transactions/export", { params, responseType: "blob" })
    .then((res) => res.data);

export const addMoney = (amount, description) =>
  api.post("/wallet/add", { amount, description }).then((res) => res.data);

export const withdrawMoney = (amount, description) =>
  api
    .post("/wallet/withdraw", { amount, description })
    .then((res) => res.data);

export const createRazorpayOrder = (amount, description) =>
  api
    .post("/wallet/razorpay/create-order", { amount, description })
    .then((res) => res.data);

export const verifyRazorpayPayment = (payload) =>
  api.post("/wallet/razorpay/verify", payload).then((res) => res.data);
