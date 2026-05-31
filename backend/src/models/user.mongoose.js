import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password required"],
      select: false,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    avatarIndex: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    tfaEnabled: {
      type: Boolean,
      default: false,
    },
    emailDigest: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
