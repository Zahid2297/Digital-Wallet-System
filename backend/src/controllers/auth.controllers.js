import { User } from "../models/user.mongoose.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";

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
  const { password: _, ...userWithoutPassword } = user.toObject();
  res.status(201).json({
    message: "USer register successfully",
    user: userWithoutPassword,
  });
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //email and password fill kiya ye nhi
  if (!email || !password) {
    throw new Error("All fields are required");
  }

  //  user find krte time we need password so we use -> .select("+password")
  //    (because in schema password has select: false)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  //  Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  // Generate token
  const token = generateToken(user._id);

  // Respond
  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      walletBalance: user.walletBalance,
    },
  });
});
