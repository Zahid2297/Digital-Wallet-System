import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as walletApi from "../api/wallet.api.js";
import * as profileApi from "../api/profile.api.js";
import {
  clearAuth,
  getStoredUser,
  loadPrefs,
  savePrefs,
  setStoredUser,
  isAuthenticated,
} from "../utils/auth.js";
import { mapTransaction, mapUserToProfile } from "../utils/mappers.js";

const AppContext = createContext(undefined);

export function AppStateProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    avatarIndex: 1,
    tfaEnabled: false,
  });
  const [loading, setLoading] = useState(isAuthenticated());
  const [error, setError] = useState(null);

  const refreshWallet = useCallback(async () => {
    const [balanceRes, txRes] = await Promise.all([
      walletApi.getBalance(),
      walletApi.getTransactions(),
    ]);
    setBalance(balanceRes.balance ?? 0);
    setTransactions((txRes.transactions || []).map(mapTransaction));
  }, []);

  const refreshProfile = useCallback(async () => {
    const { user } = await profileApi.getProfile();
    const prefs = loadPrefs(user._id);
    setProfile(mapUserToProfile(user, prefs));
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
    const user = getStoredUser();
    const name = details.fullName ?? profile.fullName;
    const email = details.email ?? profile.email;

    await profileApi.updateProfile({ name, email });

    if (user?._id) {
      savePrefs(user._id, {
        phone: details.phone ?? profile.phone,
        location: details.location ?? profile.location,
        avatarIndex: details.avatarIndex ?? profile.avatarIndex,
        tfaEnabled: details.tfaEnabled ?? profile.tfaEnabled,
      });
    }

    await refreshProfile();
  };

  const changePassword = async (currentPassword, newPassword) => {
    await profileApi.changePassword({ currentPassword, newPassword });
  };

  const depositFunds = async (amount, method) => {
    const methodLabel =
      method === "visa" ? "Visa Card •• 4242" : "Chase Bank •• 9801";
    try {
      await walletApi.addMoney(amount, `Deposit via ${methodLabel}`);
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
    setProfile({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      avatarIndex: 1,
      tfaEnabled: false,
    });
    setError(null);
    setLoading(false);
  };

  return (
    <AppContext.Provider
      value={{
        balance,
        transactions,
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
