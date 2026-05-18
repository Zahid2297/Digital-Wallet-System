import { User } from "../models/user.mongoose.js";
import { transaction } from "../models/transaction.mongoose.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// get the wallet balance
export const getBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    balance: user.walletBalance,
  });
});

// get the transaction history
export const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await transaction
    .find({ userId: req.user._id })
    .sort({ createdAt: -1 }); // naya first
  res.status(200).json({ transactions });
});

// (post) add money
export const addMoney = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    throw new Error("Valid amount is required");
  }

  // add to wallet balance
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { walletBalance: amount } }, // $inc adds to existing value
    { new: true }, // return updated user
  );

  // save transaction record
  await transaction.create({
    userId: req.user._id,
    type: "credit",
    amount,
    description: description || "Money added",
    status: "success",
  });

  res.status(200).json({
    message: "Money added successfully",
    newBalance: user.walletBalance,
  });
});

// (post) withdraw money
export const withdrawMoney = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    throw new Error("Valid amount is required");
  }

  const user = await User.findById(req.user._id);

  // check sufficient balance
  if (user.walletBalance < amount) {
    throw new Error("Insufficient balance");
  }

  // deduct from wallet
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { walletBalance: -amount } }, // negative = deduct
    { new: true },
  );

  // save transaction record
  await transaction.create({
    userId: req.user._id,
    type: "debit",
    amount,
    description: description || "Money withdrawn",
    status: "success",
  });

  res.status(200).json({
    message: "Money withdrawn successfully",
    newBalance: updatedUser.walletBalance,
  });
});
