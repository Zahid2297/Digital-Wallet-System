import express from "express";
import {
  createOrder,
  verifyPayment,
  testPay,
  getOrderStatus,
} from "../controllers/razorpay.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.post("/test-pay", protect, testPay);
router.get("/order/:orderId", protect, getOrderStatus);

export default router;
