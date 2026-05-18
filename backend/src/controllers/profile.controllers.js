import { User } from "../models/user.mongoose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

// GET profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ user });
});

// PUT update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Check if new email already exists for another user
  if (email) {
    const existingUser = await User.findOne({ email });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      throw new Error("Email already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true }, // return updated user
  );

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

// PUT change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new Error("All fields are required");
  }

  // Get user WITH password
  const user = await User.findById(req.user._id).select("+password");

  // Verify current password is correct
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  // Save new password
  await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

  res.status(200).json({ message: "Password changed successfully" });
});
