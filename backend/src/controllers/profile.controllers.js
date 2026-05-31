import { User } from "../models/user.mongoose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, location, avatarIndex, tfaEnabled, emailDigest } =
    req.body;

  if (email) {
    const existingUser = await User.findOne({ email });
    if (
      existingUser &&
      existingUser._id.toString() !== req.user._id.toString()
    ) {
      throw new Error("Email already in use");
    }
  }

  const updates = {};
  if (name !== undefined && name !== "") updates.name = name;
  if (email !== undefined && email !== "") updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (location !== undefined) updates.location = location;
  if (avatarIndex !== undefined) updates.avatarIndex = avatarIndex;
  if (tfaEnabled !== undefined) updates.tfaEnabled = tfaEnabled;
  if (emailDigest !== undefined) updates.emailDigest = emailDigest;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
  });

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new Error("All fields are required");
  }

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

  res.status(200).json({ message: "Password changed successfully" });
});
