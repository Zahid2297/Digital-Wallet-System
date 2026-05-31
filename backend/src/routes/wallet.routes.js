import express from "express";
import {
  getBalance,
  getTransactions,
  getWalletStats,
  exportTransactions,
  addMoney,
  withdrawMoney,
} from "../controllers/wallet.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/balance", protect, getBalance);
router.get("/stats", protect, getWalletStats);
router.get("/transactions/export", protect, exportTransactions);
router.get("/transactions", protect, getTransactions);
router.post("/add", protect, addMoney);
router.post("/withdraw", protect, withdrawMoney);

export default router;
