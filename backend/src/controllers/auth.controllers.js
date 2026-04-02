import { User } from "../models/user.mongoose";
import bcrypt from "bcryptjs";
import { asyncHandle, asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //Validation - email, name aur password fill kiya hai ye nhi

  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  //already registered hai ye nhi check karna hai

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  //hash karna password

  const hashedPassword = await bcrypt.hash(password, 12);

  //create user
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    message: "USer register successfully",
    user,
  });
});
