import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as walletApi from "../api/wallet.api.js";
import * as profileApi from "../api/profile.api.js";
import {
  clearAuth,
  getStoredUser,
  setStoredUser,
  isAuthenticated,
} from "../utils/auth.js";
import { mapTransaction, mapUserToProfile, profileToApiPayload } from "../utils/mappers.js";
import { openRazorpayCheckout } from "../utils/razorpay.js";

const AppContext = createContext(undefined);

const emptyStats = {
  monthlyDeposits: 0,
  monthlyWithdrawals: 0,
  totalIncome: 0,
  totalSpending: 0,
  netFlow: 0,
  volumeByMonth: [],
  incomeExpenseTrend: [],
};

export function AppStateProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(emptyStats);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    avatarIndex: 1,
    tfaEnabled: false,
    emailDigest: true,
  });
  const [loading, setLoading] = useState(isAuthenticated());
  const [error, setError] = useState(null);

  const refreshWallet = useCallback(async () => {
    const [balanceRes, statsRes, txRes] = await Promise.all([
      walletApi.getBalance(),
      walletApi.getWalletStats(),
      walletApi.getTransactions({ limit: 10, page: 1 }),
    ]);
    setBalance(balanceRes.balance ?? 0);
    setStats(statsRes);
    setTransactions((txRes.transactions || []).map(mapTransaction));
  }, []);

  const refreshProfile = useCallback(async () => {
    const { user } = await profileApi.getProfile();
    setProfile(mapUserToProfile(user));
    setStoredUser({
      _id: user._id,
      name: user.name,
      email: user.email,
      walletBalance: user.walletBalance,
    });
    return user;
  }, []);

  const loadUserData = useCallback(async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await Promise.all([refreshWallet(), refreshProfile()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [refreshWallet, refreshProfile]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const updateProfile = async (details) => {
    const payload = profileToApiPayload({ ...profile, ...details });
    await profileApi.updateProfile(payload);
    await refreshProfile();
  };

  const changePassword = async (currentPassword, newPassword) => {
    await profileApi.changePassword({ currentPassword, newPassword });
  };

  const depositFunds = async (amount, description = "Razorpay wallet top-up") => {
    try {
      const orderRes = await walletApi.createRazorpayOrder(amount, description);
      const payment = await openRazorpayCheckout({
        keyId: orderRes.keyId,
        order: orderRes.order,
        name: profile.fullName,
        email: profile.email,
        description,
      });

      await walletApi.verifyRazorpayPayment({
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        razorpay_signature: payment.razorpay_signature,
      });

      await refreshWallet();
      const user = getStoredUser();
      if (user) {
        const { balance: newBalance } = await walletApi.getBalance();
        setStoredUser({ ...user, walletBalance: newBalance });
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const withdrawFunds = async (amount, description = "Money withdrawn") => {
    try {
      await walletApi.withdrawMoney(amount, description);
      await refreshWallet();
      const user = getStoredUser();
      if (user) {
        const { balance: newBalance } = await walletApi.getBalance();
        setStoredUser({ ...user, walletBalance: newBalance });
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const sendFunds = async (recipient, amount) => {
    return withdrawFunds(amount, `Sent to ${recipient}`);
  };

  const logout = () => {
    clearAuth();
    setBalance(0);
    setTransactions([]);
    setStats(emptyStats);
    setProfile({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      avatarIndex: 1,
      tfaEnabled: false,
      emailDigest: true,
    });
    setError(null);
    setLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        balance,
        transactions,
        stats,
        profile,
        loading,
        error,
        loadUserData,
        updateProfile,
        changePassword,
        depositFunds,
        withdrawFunds,
        sendFunds,
        logout,
        refreshWallet,
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
