import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAppState } from "../context/AppContext";

const QUICK_ACTIONS = [
  { to: null, label: "Send", icon: "send", action: "send" },
  { to: "/wallet/scan", label: "Scan", icon: "qr_code_scanner" },
  { to: "/wallet/bills", label: "Bills", icon: "receipt_long" },
  { to: "/wallet/more", label: "More", icon: "more_horiz" },
];

export default function Wallet({ onLogoutClick }) {
  const { balance, transactions, profile, depositFunds, withdrawFunds, sendFunds } =
    useAppState();
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [withdrawMessage, setWithdrawMessage] = useState(null);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const cardName = (profile.fullName || "CARD HOLDER").toUpperCase();

  const handleAddFunds = async (e) => {
    e.preventDefault();
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount <= 0) {
      setCheckoutMessage({ type: "error", text: "Enter a valid amount greater than $0." });
      return;
    }
    setActionLoading(true);
    const result = await depositFunds(amount);
    setActionLoading(false);
    if (result.success) {
      setCheckoutMessage({
        type: "success",
        text: `$${amount.toFixed(2)} added to your wallet balance.`,
      });
      setAddAmount("");
      setTimeout(() => setCheckoutMessage(null), 5000);
    } else {
      setCheckoutMessage({ type: "error", text: result.error || "Deposit failed." });
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) {
      setWithdrawMessage({ type: "error", text: "Enter a valid withdrawal amount." });
      return;
    }
    setActionLoading(true);
    const result = await withdrawFunds(val, "Bank Withdrawal");
    setActionLoading(false);
    if (result.success) {
      setWithdrawMessage({ type: "success", text: `$${val.toFixed(2)} withdrawn successfully.` });
      setWithdrawAmount("");
      setTimeout(() => setWithdrawMessage(null), 5000);
    } else {
      setWithdrawMessage({ type: "error", text: result.error || "Withdrawal failed." });
    }
  };

  const handleSendMoneySubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(sendAmount);
    setSendError("");
    if (!sendRecipient.trim()) {
      setSendError("Enter a recipient name or email.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setSendError("Enter a valid amount.");
      return;
    }
    setActionLoading(true);
    const result = await sendFunds(sendRecipient.trim(), amount);
    setActionLoading(false);
    if (result.success) {
      setSendMessage(`Transferred $${amount.toFixed(2)} to ${sendRecipient}.`);
      setSendRecipient("");
      setSendAmount("");
      setTimeout(() => {
        setSendMessage("");
        setIsSendOpen(false);
      }, 2500);
    } else {
      setSendError(result.error || "Transfer failed.");
    }
  };

  return (
    <AppLayout title="My Wallet" titleIcon="account_balance" onLogoutClick={onLogoutClick}>
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
              <p className="text-blue-100 font-medium">Available Balance</p>
              <h1 className="text-5xl font-black mt-2 mb-6">
                ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
              <form onSubmit={handleWithdraw} className="flex flex-wrap gap-3 items-end max-w-md">
                <div className="flex-1 min-w-[140px]">
                  <label className="text-xs text-blue-100 block mb-1">Withdraw amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-slate-900 text-sm font-bold"
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-white text-blue-600 px-5 py-2 rounded-lg font-bold text-sm disabled:opacity-60"
                >
                  Withdraw
                </button>
              </form>
              {withdrawMessage && (
                <p className={`mt-3 text-xs font-semibold ${withdrawMessage.type === "success" ? "text-blue-100" : "text-red-200"}`}>
                  {withdrawMessage.text}
                </p>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-4 gap-4">
                {QUICK_ACTIONS.map((item) =>
                  item.action === "send" ? (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setIsSendOpen(true)}
                      className="bg-white py-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2 hover:border-blue-600 hover:text-blue-600"
                    >
                      <span className="material-symbols-outlined text-blue-600">{item.icon}</span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="bg-white py-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2 hover:border-blue-600 hover:text-blue-600"
                    >
                      <span className="material-symbols-outlined text-blue-600">{item.icon}</span>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Recent Activity</h3>
                <Link to="/transactions" className="text-blue-600 text-sm font-medium hover:underline">See all</Link>
              </div>
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No transactions yet.</p>
                ) : (
                  transactions.slice(0, 5).map((txn) => (
                    <div key={txn._id || txn.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm">{txn.entity}</p>
                        <p className="text-xs text-slate-500">{txn.date}, {txn.time}</p>
                      </div>
                      <span className={`font-bold text-sm ${txn.type === "Credit" ? "text-emerald-600" : "text-slate-900"}`}>
                        {txn.amount > 0 ? `+$${txn.amount.toFixed(2)}` : `-$${Math.abs(txn.amount).toFixed(2)}`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="font-bold text-lg mb-1">Add Funds</h3>
              <p className="text-xs text-slate-500 mb-4">Funds are added directly to your wallet balance.</p>
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
                  <label className="text-sm text-slate-500 mb-1 block">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={addAmount}
                      onChange={(e) => setAddAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3 pl-8 pr-4 font-bold"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  <Link to="/wallet/payment-methods" className="text-blue-600 hover:underline font-medium">
                    Manage payment methods
                  </Link>
                </p>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg disabled:opacity-60"
                >
                  {actionLoading ? "Processing..." : "Add to Wallet"}
                </button>
              </form>
            </div>

            <div className="bg-[#0f172a] rounded-xl p-6 text-white aspect-[1.6] relative overflow-hidden">
              <div className="flex justify-between mb-8">
                <span className="material-symbols-outlined text-slate-300">sim_card</span>
                <span className="font-black italic text-xl">WALLET</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase">Linked to account</p>
              <p className="font-mono text-lg mt-1">{profile.email || "—"}</p>
              <div className="flex justify-between mt-6">
                <div>
                  <p className="text-[8px] text-slate-400 uppercase">Holder</p>
                  <p className="font-bold text-xs uppercase">{cardName}</p>
                </div>
                <div>
                  <p className="text-[8px] text-slate-400 uppercase">Balance</p>
                  <p className="font-bold text-xs">${balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSendOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Send Money</h3>
              <button type="button" onClick={() => { setIsSendOpen(false); setSendError(""); setSendMessage(""); }}>
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            {sendMessage && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg mb-4">{sendMessage}</div>
            )}
            {sendError && (
              <div className="p-3 bg-red-50 text-red-800 text-xs font-semibold rounded-lg mb-4">{sendError}</div>
            )}
            <form onSubmit={handleSendMoneySubmit} className="space-y-4">
              <input
                type="text"
                value={sendRecipient}
                onChange={(e) => setSendRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Recipient email or name"
                required
              />
              <input
                type="number"
                step="0.01"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold"
                placeholder="Amount"
                required
              />
              <button type="submit" disabled={actionLoading} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg disabled:opacity-60">
                {actionLoading ? "Sending..." : "Send Funds"}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
