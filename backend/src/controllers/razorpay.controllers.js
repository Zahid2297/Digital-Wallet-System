import crypto from "crypto";
import { User } from "../models/user.mongoose.js";
import { transaction } from "../models/transaction.mongoose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRazorpay, isRazorpayTestMode } from "../config/razorpay.js";

function toPaise(amountInRupees) {
  return Math.round(Number(amountInRupees) * 100);
}

function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expected === signature;
}

async function creditWalletForOrder({
  userId,
  orderId,
  paymentId,
  amountInRupees,
  description,
}) {
  const existing = await transaction.findOne({
    razorpayOrderId: orderId,
    status: "success",
  });

  if (existing) {
    const user = await User.findById(userId);
    return {
      alreadyProcessed: true,
      transaction: existing,
      newBalance: user.walletBalance,
    };
  }

  const pending = await transaction.findOne({
    razorpayOrderId: orderId,
    userId,
    status: "pending",
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { walletBalance: amountInRupees } },
    { new: true },
  );

  let txn;
  if (pending) {
    pending.status = "success";
    pending.razorpayPaymentId = paymentId;
    pending.amount = amountInRupees;
    pending.description =
      description || pending.description || "Razorpay wallet top-up";
    await pending.save();
    txn = pending;
  } else {
    txn = await transaction.create({
      userId,
      type: "credit",
      amount: amountInRupees,
      description: description || "Razorpay wallet top-up",
      status: "success",
      paymentGateway: "razorpay",
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });
  }

  return {
    alreadyProcessed: false,
    transaction: txn,
    newBalance: user.walletBalance,
  };
}

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;
  const amountNum = Number(amount);

  if (!amountNum || amountNum <= 0) {
    throw new Error("Valid amount (INR) is required");
  }

  const amountPaise = toPaise(amountNum);
  if (amountPaise < 100) {
    throw new Error("Minimum amount is ₹1.00");
  }

  const razorpay = getRazorpay();
  const receipt = `wallet_${req.user._id.toString().slice(-8)}_${Date.now()}`;

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
    notes: {
      userId: req.user._id.toString(),
      purpose: "wallet_topup",
    },
  });

  await transaction.create({
    userId: req.user._id,
    type: "credit",
    amount: amountNum,
    description: description || "Razorpay wallet top-up (pending)",
    status: "pending",
    paymentGateway: "razorpay",
    razorpayOrderId: order.id,
  });

  res.status(201).json({
    success: true,
    message: "Razorpay order created",
    keyId: process.env.RAZORPAY_KEY_ID,
    order: {
      id: order.id,
      amount: order.amount,
      amountInRupees: amountNum,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error(
      "razorpay_order_id, razorpay_payment_id and razorpay_signature are required",
    );
  }

  if (
    !verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    )
  ) {
    await transaction.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, userId: req.user._id },
      { status: "failed" },
    );
    throw new Error("Invalid payment signature");
  }

  const razorpay = getRazorpay();
  const payment = await razorpay.payments.fetch(razorpay_payment_id);

  if (payment.order_id !== razorpay_order_id) {
    throw new Error("Payment does not belong to this order");
  }

  if (!["captured", "authorized"].includes(payment.status)) {
    throw new Error(`Payment not successful. Status: ${payment.status}`);
  }

  const amountInRupees = payment.amount / 100;
  const result = await creditWalletForOrder({
    userId: req.user._id,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amountInRupees,
    description: "Razorpay wallet top-up",
  });

  res.status(200).json({
    success: true,
    message: result.alreadyProcessed
      ? "Payment already processed"
      : "Payment verified and wallet credited",
    newBalance: result.newBalance,
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
    amount: amountInRupees,
  });
});

export const testPay = asyncHandler(async (req, res) => {
  if (!isRazorpayTestMode()) {
    throw new Error("test-pay is only available with Razorpay test keys (rzp_test_*)");
  }

  const { orderId, card } = req.body;
  if (!orderId) {
    throw new Error("orderId is required");
  }

  const pending = await transaction.findOne({
    razorpayOrderId: orderId,
    userId: req.user._id,
  });

  if (!pending) {
    throw new Error("Order not found for this user");
  }

  if (pending.status === "success") {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Order already paid",
      newBalance: user.walletBalance,
      orderId,
    });
  }

  const razorpay = getRazorpay();
  const order = await razorpay.orders.fetch(orderId);

  const testCard = {
    number: card?.number || "5267318187975449",
    expiry_month: card?.expiry_month || "12",
    expiry_year: card?.expiry_year || "30",
    cvv: card?.cvv || "123",
    name: card?.name || req.user.name || "Test User",
  };

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const paymentRes = await fetch(
    "https://api.razorpay.com/v1/payments/create/json",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: order.amount,
        currency: order.currency || "INR",
        order_id: orderId,
        email: req.user.email,
        contact: (req.user.phone && req.user.phone.replace(/\D/g, "")) || "9999999999",
        method: "card",
        card: testCard,
      }),
    },
  );

  const paymentData = await paymentRes.json();

  if (!paymentRes.ok) {
    pending.status = "failed";
    await pending.save();
    throw new Error(
      paymentData?.error?.description ||
        paymentData?.error?.reason ||
        "Razorpay test payment failed",
    );
  }

  const paymentId = paymentData.razorpay_payment_id || paymentData.id;
  if (!paymentId) {
    throw new Error("Razorpay did not return a payment id");
  }

  const signature =
    paymentData.razorpay_signature ||
    crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

  if (!verifySignature(orderId, paymentId, signature)) {
    pending.status = "failed";
    await pending.save();
    throw new Error("Failed to verify test payment signature");
  }

  if (paymentData.status === "authorized") {
    await razorpay.payments.capture(paymentId, order.amount, order.currency);
  }

  const amountInRupees = order.amount / 100;
  const result = await creditWalletForOrder({
    userId: req.user._id,
    orderId,
    paymentId,
    amountInRupees,
    description: "Razorpay test top-up",
  });

  res.status(200).json({
    success: true,
    message: "Test payment successful — wallet credited",
    newBalance: result.newBalance,
    orderId,
    paymentId,
    amount: amountInRupees,
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  });
});

export const getOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const localTxn = await transaction.findOne({
    razorpayOrderId: orderId,
    userId: req.user._id,
  });

  if (!localTxn) {
    throw new Error("Order not found for this user");
  }

  const razorpay = getRazorpay();
  const order = await razorpay.orders.fetch(orderId);

  res.status(200).json({
    success: true,
    localStatus: localTxn.status,
    order: {
      id: order.id,
      amount: order.amount,
      amountInRupees: order.amount / 100,
      currency: order.currency,
      status: order.status,
      attempts: order.attempts,
    },
  });
});
