import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../context/AppContext";

export default function Wallet({ onLogoutClick }) {
  const {
    balance,
    transactions,
    profile,
    depositFunds,
    withdrawFunds,
    sendFunds,
  } = useAppState();
  const [addAmount, setAddAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("visa"); // "visa" or "chase"
  const [checkoutMessage, setCheckoutMessage] = useState(null);

  // Send Money Modal State
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendMessage, setSendMessage] = useState("");

  const handleAddFunds = (e) => {
    e.preventDefault();
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      setCheckoutMessage({
        type: "error",
        text: "Please enter a valid amount greater than $0.",
      });
      return;
    }

    // Deposit globally
    depositFunds(amount, paymentMethod);
    setCheckoutMessage({
      type: "success",
      text: `Successfully added $${amount.toFixed(2)} to your balance via ${paymentMethod === "visa" ? "Visa •••• 4242" : "Chase •••• 9801"}!`,
    });
    setAddAmount("");
    setTimeout(() => setCheckoutMessage(null), 5000); // clear message
  };

  const handleSendMoneySubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount);
    if (!sendRecipient) {
      alert("Please enter a recipient name or email.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const result = sendFunds(sendRecipient, amount);
    if (result.success) {
      setSendMessage(
        `Successfully transferred $${amount.toFixed(2)} to ${sendRecipient}!`,
      );
      setSendRecipient("");
      setSendAmount("");
      setTimeout(() => {
        setSendMessage("");
        setIsSendOpen(false);
      }, 3000);
    } else {
      alert(result.error || "Insufficient funds to complete this transfer.");
    }
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link
            to="/transactions"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined">sync_alt</span>
            <span>Transactions</span>
          </Link>
          <Link
            to="/wallet"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-bold transition-colors"
          >
            <span className="material-symbols-outlined">account_balance</span>
            <span>Wallet</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
              account_balance
            </span>
            <h2>My Wallet</h2>
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
                  {profile.fullName}
                </p>
                <p className="text-xs text-slate-500">Premium Account</p>
              </div>
              <img
                className="w-9 h-9 rounded-full object-cover border border-slate-300"
                alt="User avatar"
                src={`https://i.pravatar.cc/150?u=alex${profile.avatarIndex}`}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg shadow-blue-600/20">
                <div className="relative z-10">
                  <p className="text-blue-100 font-medium">Available Balance</p>
                  <h1 className="text-5xl font-black mt-2 mb-8">
                    $
                    {balance.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </h1>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        const amount = prompt("Enter amount to withdraw:");
                        if (amount) {
                          const val = parseFloat(amount);
                          if (!isNaN(val) && val > 0) {
                            const success = withdrawFunds(val);
                            if (success) {
                              alert(
                                `Successfully withdrew $${val.toFixed(2)} to Chase Bank account!`,
                              );
                            } else {
                              alert(
                                "Insufficient balance to complete withdrawal.",
                              );
                            }
                          } else {
                            alert("Invalid withdrawal amount.");
                          }
                        }
                      }}
                      className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-50 transition-all cursor-pointer shadow-sm text-sm"
                    >
                      <span className="material-symbols-outlined text-lg">
                        account_balance
                      </span>{" "}
                      Withdraw Funds
                    </button>
                  </div>
                </div>
                <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[180px] text-blue-500/20 rotate-12 pointer-events-none select-none">
                  payments
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <button
                    onClick={() => setIsSendOpen(true)}
                    className="bg-white py-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                      send
                    </span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                      Send
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      alert(
                        "Simulation: Point camera at merchant QR code. Feature coming soon!",
                      )
                    }
                    className="bg-white py-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                      qr_code_scanner
                    </span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 font-medium">
                      Scan
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      alert(
                        "Scheduled utilities. Phone Bill ($45.20) automatically processes next week.",
                      )
                    }
                    className="bg-white py-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                      receipt_long
                    </span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 font-medium">
                      Bills
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      alert(
                        "Open external API or configure NexusPay cards and integrations.",
                      )
                    }
                    className="bg-white py-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center gap-2 hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-blue-600 group-hover:scale-110 transition-transform">
                      more_horiz
                    </span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 font-medium">
                      More
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800">
                    Recent Activity
                  </h3>
                  <Link
                    to="/transactions"
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    See all
                  </Link>
                </div>
                <div className="space-y-6">
                  {transactions.slice(0, 3).map((txn, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 ${
                            txn.type === "Credit"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          } rounded-full flex items-center justify-center shrink-0`}
                        >
                          <span className="material-symbols-outlined">
                            {txn.entityIcon || "payments"}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {txn.entity}
                          </p>
                          <p className="text-xs text-slate-500">
                            {txn.date}, {txn.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-bold ${
                          txn.type === "Credit"
                            ? "text-emerald-600"
                            : "text-slate-900"
                        }`}
                      >
                        {txn.amount > 0
                          ? `+$${txn.amount.toFixed(2)}`
                          : `-$${Math.abs(txn.amount).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">
                      No recent activity found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-blue-600">
                    account_balance_wallet
                  </span>
                  <h3 className="font-bold text-lg text-slate-800">
                    Add Funds
                  </h3>
                </div>

                {checkoutMessage && (
                  <div
                    className={`p-3 rounded-lg mb-4 text-xs font-semibold ${
                      checkoutMessage.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {checkoutMessage.text}
                  </div>
                )}

                <form onSubmit={handleAddFunds} className="space-y-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">
                      Enter Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-8 pr-4 font-bold text-lg outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="0.00"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-500 mb-2 block">
                      Payment Method
                    </label>
                    <div
                      onClick={() => setPaymentMethod("visa")}
                      className={`border-2 rounded-lg p-3 flex items-center justify-between mb-2 cursor-pointer transition-all ${
                        paymentMethod === "visa"
                          ? "border-blue-600 bg-blue-50/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-blue-600">
                          credit_card
                        </span>
                        <div className="text-left">
                          <p className="font-bold text-sm text-slate-800">
                            Visa Card •••• 4242
                          </p>
                          <p className="text-xs text-slate-500">Default</p>
                        </div>
                      </div>
                      <div
                        className={`h-4 w-4 border-4 rounded-full ${
                          paymentMethod === "visa"
                            ? "border-blue-600"
                            : "border-slate-300"
                        }`}
                      ></div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("chase")}
                      className={`border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-all ${
                        paymentMethod === "chase"
                          ? "border-blue-600 bg-blue-50/20 border-2"
                          : "border-slate-200 hover:border-slate-300 opacity-70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-600 animate-pulse">
                          account_balance
                        </span>
                        <div className="text-left">
                          <p className="font-bold text-sm text-slate-800 font-medium font-medium">
                            Chase Bank •••• 9801
                          </p>
                          <p className="text-xs text-slate-500">
                            Checking Account
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-4 w-4 border rounded-full ${
                          paymentMethod === "chase"
                            ? "border-blue-600 border-4"
                            : "border-slate-300"
                        }`}
                      ></div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Additional payment gateways can be configured securely in sandbox.",
                        )
                      }
                      className="text-blue-600 text-sm font-medium mt-3 cursor-pointer hover:underline text-left block"
                    >
                      + Add new payment method
                    </button>
                  </div>

                  <button
                    id="checkout-funds-submit"
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 hover:bg-blue-700 transition-all cursor-pointer shadow-sm text-sm"
                  >
                    Continue to Checkout{" "}
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </form>
              </div>

              <div className="bg-[#0f172a] rounded-xl p-6 text-white shadow-xl relative overflow-hidden aspect-[1.6] group hover:scale-[1.02] transition-transform duration-300 select-none">
                <div className="flex justify-between items-start mb-10">
                  <span className="material-symbols-outlined text-slate-300">
                    sim_card
                  </span>
                  <span className="font-black italic text-xl tracking-wider">
                    VISA
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Card Number
                  </p>
                  <p className="font-mono text-xl tracking-widest text-slate-100">
                    •••• •••• •••• 4242
                  </p>
                  <div className="flex justify-between pt-2">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase">
                        Card Holder
                      </p>
                      <p className="font-bold text-xs tracking-wide text-white uppercase">
                        ALEX RIVERS
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase">
                        Expires
                      </p>
                      <p className="font-bold text-xs tracking-wide text-white">
                        12/28
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500 rounded-full filter blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {isSendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border-slate-200 border animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-900">
                Send Money Instantly
              </h3>
              <button
                onClick={() => {
                  setIsSendOpen(false);
                  setSendMessage("");
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {sendMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg mb-4">
                {sendMessage}
              </div>
            )}

            <form onSubmit={handleSendMoneySubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  To (Email or Username)
                </label>
                <input
                  type="text"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={sendAmount}
                  step="0.01"
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Send Funds Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
