import jwt from "jsonwebtoken";
import { User } from "../models/user.mongoose.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("Not authorized & no token");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = User.findById(decoded.id).select("-password");

  next();
});
