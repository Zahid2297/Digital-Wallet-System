import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/profile.controllers.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/update", protect, updateProfile);
router.put("/changepassword", protect, changePassword);

export default router;
