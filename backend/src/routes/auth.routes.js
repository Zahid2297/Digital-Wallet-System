import express from "express";
import { register } from "../controllers/auth.controllers.js";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.post("/register", register);

export default router;
