import { User } from "../models/user.mongoose.js";
import { transaction } from "../models/transaction.mongoose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { buildTransactionFilter } from "../utils/transactionFilters.js";

export const getBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    balance: user.walletBalance,
  });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter = buildTransactionFilter(req.user._id, req.query);

  const [transactions, total] = await Promise.all([
    transaction
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    transaction.countDocuments(filter),
  ]);

  res.status(200).json({
    transactions,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
  });
});

export const getWalletStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const all = await transaction.find({ userId }).sort({ createdAt: -1 });
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const thisMonth = all.filter((t) => new Date(t.createdAt) >= monthStart);
  const sumByType = (list, type) =>
    list
      .filter((t) => t.type === type && t.status === "success")
      .reduce((sum, t) => sum + t.amount, 0);

  const monthlyDeposits = sumByType(thisMonth, "credit");
  const monthlyWithdrawals = sumByType(thisMonth, "debit");
  const totalIncome = sumByType(all, "credit");
  const totalSpending = sumByType(all, "debit");

  const volumeByMonth = [];
  const incomeExpenseTrend = [];

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const monthTxns = all.filter((t) => {
      const created = new Date(t.createdAt);
      return created >= start && created <= end;
    });

    const income = sumByType(monthTxns, "credit");
    const expenses = sumByType(monthTxns, "debit");
    const volume = monthTxns.reduce((sum, t) => sum + t.amount, 0);
    const maxRef = Math.max(income + expenses, 1);

    volumeByMonth.push({
      label: start.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      volume,
      heightPercent: Math.round((volume / maxRef) * 100) || 8,
    });

    incomeExpenseTrend.push({
      label: start.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
      income,
      expenses,
    });
  }

  const maxVolume = Math.max(...volumeByMonth.map((m) => m.volume), 1);
  volumeByMonth.forEach((m) => {
    m.heightPercent = Math.max(8, Math.round((m.volume / maxVolume) * 100));
  });

  res.status(200).json({
    monthlyDeposits,
    monthlyWithdrawals,
    totalIncome,
    totalSpending,
    netFlow: totalIncome - totalSpending,
    volumeByMonth,
    incomeExpenseTrend,
  });
});

export const exportTransactions = asyncHandler(async (req, res) => {
  const filter = buildTransactionFilter(req.user._id, req.query);
  const rows = await transaction.find(filter).sort({ createdAt: -1 });

  const header = "Date,Time,Type,Amount,Description,Status\n";
  const body = rows
    .map((t) => {
      const d = new Date(t.createdAt);
      const date = d.toISOString().split("T")[0];
      const time = d.toTimeString().split(" ")[0];
      const desc = (t.description || "").replace(/"/g, '""');
      return `${date},${time},${t.type},${t.amount},"${desc}",${t.status}`;
    })
    .join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="transaction-ledger.csv"',
  );
  res.status(200).send(header + body);
});

export const addMoney = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    throw new Error("Valid amount is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { walletBalance: amount } },
    { new: true },
  );

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

export const withdrawMoney = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  if (!amount || amount <= 0) {
    throw new Error("Valid amount is required");
  }

  const user = await User.findById(req.user._id);

  if (user.walletBalance < amount) {
    throw new Error("Insufficient balance");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $inc: { walletBalance: -amount } },
    { new: true },
  );

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
