import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../context/AppContext";

export default function Profile({ onLogoutClick }) {
  const { balance, profile, updateProfile, changePassword } = useAppState();

  // Navigation tabs state
  const [currentTab, setCurrentTab] = useState("Profile Information");

  // Form fields state - dynamically initialized from persistent context state!
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);

  // Settings state
  const [tfaEnabled, setTfaEnabled] = useState(profile.tfaEnabled);
  const [avatarIndex, setAvatarIndex] = useState(profile.avatarIndex);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setLocation(profile.location);
    setTfaEnabled(profile.tfaEnabled);
    setAvatarIndex(profile.avatarIndex);
  }, [profile]);

  const sidebarLinks = [
    { name: "Profile Information", icon: "person" },
    { name: "Account Settings", icon: "settings" },
    { name: "Security", icon: "shield" },
    { name: "Billing", icon: "payments" },
  ];

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        fullName,
        email,
        phone,
        location,
        tfaEnabled,
        avatarIndex,
      });
      setSuccessMsg("Successfully updated your profile settings!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async () => {
    const nextIndex = (avatarIndex % 5) + 1;
    setAvatarIndex(nextIndex);
    await updateProfile({
      fullName,
      email,
      phone,
      location,
      tfaEnabled,
      avatarIndex: nextIndex,
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f8] text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">
              account_balance_wallet
            </span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-800">
              NexusPay
            </h1>
            <p className="text-xs text-slate-500">Asset Management</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            to="/transactions"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">sync_alt</span>
            <span>Transactions</span>
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">account_balance</span>
            <span>Wallet</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-bold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">person</span>
            <span>Profile</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-left font-medium"
          >
            <span className="material-symbols-outlined text-red-500">
              logout
            </span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3 text-slate-900 text-lg font-bold leading-tight">
            <span className="material-symbols-outlined text-blue-600">
              person
            </span>
            <h2>Account Settings</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Balance
              </span>
              <span className="text-blue-600 font-bold">
                $
                {balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <button className="relative text-slate-500 hover:text-blue-600 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {fullName}
                </p>
                <p className="text-xs text-slate-500">Premium Account</p>
              </div>
              <img
                className="w-9 h-9 rounded-full object-cover border border-slate-300"
                alt="User avatar"
                src={`https://i.pravatar.cc/150?u=alex${avatarIndex}`}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0">
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => setCurrentTab(link.name)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                      currentTab === link.name
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {link.icon}
                    </span>
                    {link.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1 space-y-6">
              {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
                  <span className="material-symbols-outlined">
                    check_circle
                  </span>
                  {successMsg}
                </div>
              )}

              {currentTab === "Profile Information" && (
                <form
                  onSubmit={handleSaveProfile}
                  className="space-y-6 animate-fade-in"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-100">
                      <h3 className="font-bold text-lg text-slate-900">
                        Profile Information
                      </h3>
                      <p className="text-sm text-slate-500">
                        Manage your public profile information and registered
                        contact details.
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                          <img
                            src={`https://i.pravatar.cc/150?u=alex${avatarIndex}`}
                            alt="Avatar"
                            className="h-20 w-20 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={handleAvatarChange}
                            className="absolute bottom-0 right-0 h-7 w-7 bg-white hover:bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center shadow-sm text-slate-600 cursor-pointer"
                            title="Choose visual alternate avatar"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              photo_camera
                            </span>
                          </button>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={handleAvatarChange}
                            className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            Change Photo
                          </button>
                          <p className="text-xs text-slate-500 mt-2">
                            JPG, GIF or PNG. Max size 2MB.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-2">
                            Full name
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white focus:border-blue-600 transition-all font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-2">
                            Email address
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white focus:border-blue-600 transition-all font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-2">
                            Phone number
                          </label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white focus:border-blue-600 transition-all font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white focus:border-blue-600 transition-all font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 pb-4 border-b border-slate-100">
                      Preferences
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          Email Digest
                        </p>
                        <p className="text-xs text-slate-500">
                          Receive monthly asset balance details on your primary
                          inbox.
                        </p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 select-none">
                    <button
                      type="button"
                      onClick={() => {
                        setFullName("Alex Johnson");
                        setEmail("alex.johnson@example.com");
                        setPhone("+1 (555) 000-0000");
                        setLocation("San Francisco, CA");
                        alert("Form reset to original values.");
                      }}
                      className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-all cursor-pointer disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              {currentTab === "Account Settings" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 animate-fade-in">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                      Security and Access Control
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Configure advanced settings for authentication and
                      security preferences.
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 select-none">
                    <div>
                      <p className="font-bold text-slate-900">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Add an extra layer of security to your NexusPay
                        transactions.
                      </p>
                    </div>
                    <div
                      onClick={() => setTfaEnabled(!tfaEnabled)}
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
                        tfaEnabled ? "bg-blue-600" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                          tfaEnabled ? "right-1" : "left-1"
                        }`}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={async () => {
                        const currentPassword = prompt("Enter current password:");
                        if (!currentPassword) return;
                        const newPassword = prompt("Enter new password:");
                        if (!newPassword) return;
                        try {
                          await changePassword(currentPassword, newPassword);
                          alert("Password changed successfully.");
                        } catch (err) {
                          alert(err.message || "Failed to change password.");
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 cursor-pointer transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              )}

              {currentTab === "Security" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 animate-fade-in">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                      Session & Shield Ledger
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Overview of connected devices and active authorization
                      tokens.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center text-sm text-blue-800">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">
                          laptop_mac
                        </span>
                        <div>
                          <p className="font-bold">
                            Active MacBook Pro Session
                          </p>
                          <p className="text-xs opacity-80">
                            IP: 192.168.1.1 - Local Sandbox Mode
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full select-none">
                        Current
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-500">
                          smartphone
                        </span>
                        <div>
                          <p className="font-bold text-slate-700">
                            Google Pixel 8
                          </p>
                          <p className="text-xs text-slate-400">
                            Authenticated via Biometrics Authenticator API
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          alert("Simulation: Revoked OAuth access on device.")
                        }
                        className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === "Billing" && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 animate-fade-in">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                      Billing Cycle & Linked Contracts
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Configure plan fees and download invoices.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-extrabold text-sm text-slate-800">
                          Premium Asset tier
                        </p>
                        <p className="text-xs text-slate-500">
                          Next payment of $4.99 charged on June 24, 2026.
                        </p>
                      </div>
                      <span className="text-xs bg-blue-50 text-blue-700 font-bold border border-blue-100 px-3 py-1 rounded">
                        Active
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          alert(
                            "Invoices can be bulk downloaded in production builds of NexusPay.",
                          )
                        }
                        className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 cursor-pointer"
                      >
                        Download Invoices
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
