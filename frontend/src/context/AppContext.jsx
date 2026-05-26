import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(undefined);

const DEFAULT_TRANSACTIONS = [
  {
    id: "#TXN-84291",
    date: "May 24, 2024",
    time: "10:45 AM",
    entity: "Apple Store",
    entityIcon: "shopping_bag",
    type: "Debit",
    amount: -1299.0,
    status: "Completed",
    method: "Visa •• 4242",
    methodIcon: "credit_card",
  },
  {
    id: "#TXN-84288",
    date: "May 23, 2024",
    time: "03:12 PM",
    entity: "Stripe Payout",
    entityIcon: "work",
    type: "Credit",
    amount: 4500.0,
    status: "Completed",
    method: "Bank Transfer",
    methodIcon: "account_balance",
  },
  {
    id: "#TXN-84281",
    date: "May 20, 2024",
    time: "12:15 PM",
    entity: "Amazon Delivery",
    entityIcon: "shopping_bag",
    type: "Debit",
    amount: -45.5,
    status: "Completed",
    method: "Mastercard •• 5678",
    methodIcon: "credit_card",
  },
  {
    id: "#TXN-84275",
    date: "May 18, 2024",
    time: "08:30 AM",
    entity: "Netflix Premium",
    entityIcon: "receipt_long",
    type: "Debit",
    amount: -15.99,
    status: "Completed",
    method: "Visa •• 4242",
    methodIcon: "credit_card",
  },
  {
    id: "#TXN-84260",
    date: "May 14, 2024",
    time: "04:10 PM",
    entity: "AWS Cloud Hosting",
    entityIcon: "cloud",
    type: "Debit",
    amount: -120.0,
    status: "Pending",
    method: "Visa •• 4242",
    methodIcon: "credit_card",
  },
  {
    id: "#TXN-84255",
    date: "May 11, 2024",
    time: "01:25 PM",
    entity: "Uber Ride",
    entityIcon: "local_taxi",
    type: "Debit",
    amount: -28.4,
    status: "Completed",
    method: "Visa •• 4242",
    methodIcon: "credit_card",
  },
  {
    id: "#TXN-84250",
    date: "May 08, 2024",
    time: "11:50 AM",
    entity: "Consulting Fee Refund",
    entityIcon: "sync_alt",
    type: "Credit",
    amount: 150.0,
    status: "Failed",
    method: "Visa •• 4242",
    methodIcon: "credit_card",
  },
];

const DEFAULT_PROFILE = {
  fullName: "Alex Rivers",
  email: "alex.rivers@example.com",
  phone: "+1 (555) 304-2212",
  location: "San Francisco, CA",
  avatarIndex: 1,
  tfaEnabled: true,
};

export function AppStateProvider({ children }) {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("nexuspay_balance");
    return saved ? parseFloat(saved) : 12450.8;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("nexuspay_transactions");
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("nexuspay_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem("nexuspay_balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("nexuspay_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("nexuspay_profile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (details) => {
    setProfile((prev) => ({ ...prev, ...details }));
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const generateTxnId = () => {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `#TXN-${num}`;
  };

  const depositFunds = (amount, method) => {
    const { date, time } = getFormattedDateTime();
    const methodIcon = method === "visa" ? "credit_card" : "account_balance";
    const methodName =
      method === "visa" ? "Visa Card •• 4242" : "Chase Bank •• 9801";

    const newTxn = {
      id: generateTxnId(),
      date,
      time,
      entity: `Deposit via ${method === "visa" ? "Visa" : "Chase"}`,
      entityIcon: "add",
      type: "Credit",
      amount: amount,
      status: "Completed",
      method: methodName,
      methodIcon,
    };

    setBalance((prev) => prev + amount);
    setTransactions((prev) => [newTxn, ...prev]);
  };

  const withdrawFunds = (amount) => {
    if (amount > balance) return false;

    const { date, time } = getFormattedDateTime();
    const newTxn = {
      id: generateTxnId(),
      date,
      time,
      entity: "Bank Withdrawal",
      entityIcon: "account_balance",
      type: "Debit",
      amount: -amount,
      status: "Completed",
      method: "Chase Bank •• 9801",
      methodIcon: "account_balance",
    };

    setBalance((prev) => prev - amount);
    setTransactions((prev) => [newTxn, ...prev]);
    return true;
  };

  const sendFunds = (recipient, amount) => {
    if (amount > balance) {
      return {
        success: false,
        error: "Insufficient funds to complete this transfer.",
      };
    }

    const { date, time } = getFormattedDateTime();
    const newTxn = {
      id: generateTxnId(),
      date,
      time,
      entity: `Sent to ${recipient}`,
      entityIcon: "send",
      type: "Debit",
      amount: -amount,
      status: "Completed",
      method: "Wallet Transfer",
      methodIcon: "credit_card",
    };

    setBalance((prev) => prev - amount);
    setTransactions((prev) => [newTxn, ...prev]);
    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        balance,
        transactions,
        profile,
        updateProfile,
        depositFunds,
        withdrawFunds,
        sendFunds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}
