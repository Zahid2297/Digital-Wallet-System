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
    _id: txn._id,
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
    createdAt: txn.createdAt,
  };
}

export function mapUserToProfile(user) {
  return {
    fullName: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    avatarIndex: user.avatarIndex ?? 1,
    tfaEnabled: user.tfaEnabled ?? false,
    emailDigest: user.emailDigest ?? true,
  };
}

export function profileToApiPayload(profile) {
  return {
    name: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    avatarIndex: profile.avatarIndex,
    tfaEnabled: profile.tfaEnabled,
    emailDigest: profile.emailDigest,
  };
}

export function getInitials(name) {
  if (!name?.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
