const STATUS_MAP = {
  success: "Completed",
  pending: "Pending",
  failed: "Failed",
};

export function mapTransaction(txn) {
  const dateObj = txn.createdAt ? new Date(txn.createdAt) : new Date();
  const type = txn.type === "credit" ? "Credit" : "Debit";
  const amount =
    type === "Debit" ? -Math.abs(txn.amount) : Math.abs(txn.amount);

  return {
    id: txn._id
      ? `#TXN-${String(txn._id).slice(-6).toUpperCase()}`
      : "#TXN-000000",
    date: dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    entity: txn.description || (type === "Credit" ? "Deposit" : "Withdrawal"),
    entityIcon: type === "Credit" ? "add" : "payments",
    type,
    amount,
    status: STATUS_MAP[txn.status] || "Completed",
    method: "Wallet",
    methodIcon: "account_balance_wallet",
  };
}

export function mapUserToProfile(user, prefs = {}) {
  return {
    fullName: user.name || "",
    email: user.email || "",
    phone: prefs.phone || "",
    location: prefs.location || "",
    avatarIndex: prefs.avatarIndex ?? 1,
    tfaEnabled: prefs.tfaEnabled ?? false,
  };
}
