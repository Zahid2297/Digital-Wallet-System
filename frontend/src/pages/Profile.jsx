import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import UserAvatar from "../components/UserAvatar";
import { useAppState } from "../context/AppContext";

const TABS = [
  { id: "profile", label: "Profile Information", icon: "person" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "billing", label: "Billing", icon: "payments" },
];

export default function Profile({ onLogoutClick }) {
  const { profile, updateProfile, changePassword } = useAppState();
  const [currentTab, setCurrentTab] = useState("profile");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [tfaEnabled, setTfaEnabled] = useState(false);
  const [emailDigest, setEmailDigest] = useState(true);
  const [avatarIndex, setAvatarIndex] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setLocation(profile.location);
    setTfaEnabled(profile.tfaEnabled);
    setEmailDigest(profile.emailDigest ?? true);
    setAvatarIndex(profile.avatarIndex);
  }, [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    try {
      await updateProfile({
        fullName,
        email,
        phone,
        location,
        tfaEnabled,
        emailDigest,
        avatarIndex,
      });
      setSuccessMsg("Profile saved successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setLocation(profile.location);
    setTfaEnabled(profile.tfaEnabled);
    setEmailDigest(profile.emailDigest ?? true);
    setAvatarIndex(profile.avatarIndex);
    setErrorMsg("");
  };

  const handleAvatarChange = async () => {
    const next = (avatarIndex % 5) + 1;
    setAvatarIndex(next);
    await updateProfile({
      fullName,
      email,
      phone,
      location,
      tfaEnabled,
      emailDigest,
      avatarIndex: next,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    if (newPassword !== confirmPassword) {
      setPasswordMsg("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      return;
    }
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg(err.message || "Failed to change password.");
    }
  };

  const handleTfaToggle = async () => {
    const next = !tfaEnabled;
    setTfaEnabled(next);
    try {
      await updateProfile({
        fullName,
        email,
        phone,
        location,
        tfaEnabled: next,
        emailDigest,
        avatarIndex,
      });
    } catch (err) {
      setTfaEnabled(!next);
      setErrorMsg(err.message);
    }
  };

  const handleDigestToggle = async () => {
    const next = !emailDigest;
    setEmailDigest(next);
    try {
      await updateProfile({
        fullName,
        email,
        phone,
        location,
        tfaEnabled,
        emailDigest: next,
        avatarIndex,
      });
    } catch (err) {
      setEmailDigest(!next);
      setErrorMsg(err.message);
    }
  };

  return (
    <AppLayout title="Account Settings" titleIcon="person" onLogoutClick={onLogoutClick}>
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <nav className="w-full md:w-56 space-y-1 shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold ${
                  currentTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 space-y-4">
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold">
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            {currentTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <h3 className="font-bold text-lg mb-4">Profile Information</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <UserAvatar name={fullName} avatarIndex={avatarIndex} size="lg" />
                    <button
                      type="button"
                      onClick={handleAvatarChange}
                      className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50"
                    >
                      Cycle Avatar Color
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold block mb-2">Full name</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-2">Phone</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold block mb-2">Location</label>
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">Email Digest</p>
                      <p className="text-xs text-slate-500">Monthly balance summary emails.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDigestToggle}
                      className={`w-12 h-6 rounded-full relative ${emailDigest ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${emailDigest ? "right-1" : "left-1"}`}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={handleCancel} className="px-6 py-2.5 text-sm font-bold text-slate-600">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {currentTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
                    <div>
                      <p className="font-bold">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">Stored in your account settings.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTfaToggle}
                      className={`w-12 h-6 rounded-full relative ${tfaEnabled ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full ${tfaEnabled ? "right-1" : "left-1"}`}
                      />
                    </button>
                  </div>

                  <h4 className="font-bold mb-4">Change Password</h4>
                  {passwordMsg && (
                    <p className={`text-sm mb-4 font-medium ${passwordMsg.includes("success") ? "text-emerald-600" : "text-red-600"}`}>
                      {passwordMsg}
                    </p>
                  )}
                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      required
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg"
                      required
                    />
                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg">
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {currentTab === "billing" && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-blue-600 mb-4 block">payments</span>
                <h3 className="font-bold text-lg mb-2">Billing & Subscriptions</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
                  View your subscription, payment history, and invoices.
                </p>
                <Link
                  to="/profile/billing"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg"
                >
                  View Billing
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
