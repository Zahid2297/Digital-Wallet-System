import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../context/AppContext";

export default function Dashboard({ onLogoutClick }) {
  const { balance, transactions, profile } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter transactions dynamically based on search
  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Dynamic calculations for cards
  const monthlyDeposits = transactions
    .filter((txn) => txn.type === "Credit" && txn.status === "Completed")
    .reduce((sum, txn) => sum + txn.amount, 0);

  const monthlyWithdrawals = transactions
    .filter((txn) => txn.type === "Debit" && txn.status === "Completed")
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-bold transition-colors"
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
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
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-72 border border-slate-200">
            <span className="material-symbols-outlined text-slate-400 text-sm">
              search
            </span>
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2"
              placeholder="Search transactions..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Welcome back, {profile.fullName.split(" ")[0]}!
              </h2>
              <p className="text-sm text-slate-500">
                Here's your asset manager updates for May 2026.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/wallet"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>{" "}
                Add Funds
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    trending_up
                  </span>{" "}
                  12.5%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Total Balance
              </p>
              <h3 className="text-2xl font-bold mt-1">
                $
                {balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <span className="material-symbols-outlined">south_west</span>
                </div>
                <span className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    trending_up
                  </span>{" "}
                  8.1%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Monthly Deposits
              </p>
              <h3 className="text-2xl font-bold mt-1">
                $
                {monthlyDeposits.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                  <span className="material-symbols-outlined">north_east</span>
                </div>
                <span className="text-rose-500 text-sm font-medium flex items-center gap-1 animate-pulse">
                  <span className="material-symbols-outlined text-xs">
                    trending_down
                  </span>{" "}
                  4.2%
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium">
                Monthly Withdrawals
              </p>
              <h3 className="text-2xl font-bold mt-1">
                $
                {monthlyWithdrawals.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800">Transaction Volume</h4>
                <select className="text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-blue-600 outline-none px-2 py-1 text-slate-600 cursor-pointer">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="flex items-end justify-between h-48 gap-2 px-2">
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-slate-100 rounded-t-md h-[40%] relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/40 h-full rounded-t-md hover:bg-blue-500 transition-colors"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    JAN
                  </span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-slate-100 rounded-t-md h-[65%] relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/40 h-full rounded-t-md hover:bg-blue-500 transition-colors"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    FEB
                  </span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-slate-100 rounded-t-md h-[85%] relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-600 h-full rounded-t-md"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    MAR
                  </span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-slate-100 rounded-t-md h-[55%] relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/40 h-full rounded-t-md hover:bg-blue-500 transition-colors"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    APR
                  </span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-slate-100 rounded-t-md h-[70%] relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/40 h-full rounded-t-md hover:bg-blue-500 transition-colors"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    MAY
                  </span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-2">
                  <div className="w-full bg-slate-100 rounded-t-md h-[95%] relative group">
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/60 h-full rounded-t-md hover:bg-blue-500 transition-colors"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono font-medium">
                    JUN
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-slate-800">Income vs Expenses</h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    <span className="text-xs text-slate-500">Income</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                    <span className="text-xs text-slate-500">Expenses</span>
                  </div>
                </div>
              </div>
              <div className="relative h-48 w-full flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 400 150">
                  <path
                    d="M0,120 Q50,30 100,80 T200,40 T300,90 T400,20"
                    fill="none"
                    stroke="#2463eb"
                    strokeWidth="3"
                  ></path>
                  <path
                    d="M0,140 Q50,110 100,130 T200,100 T300,120 T400,90"
                    fill="none"
                    stroke="#94a3b8"
                    strokeDasharray="4"
                    strokeWidth="2"
                  ></path>
                  <linearGradient id="grad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop
                      offset="0%"
                      style={{ stopColor: "#2463eb", stopOpacity: 0.1 }}
                    ></stop>
                    <stop
                      offset="100%"
                      style={{ stopColor: "#2463eb", stopOpacity: 0 }}
                    ></stop>
                  </linearGradient>
                  <path
                    d="M0,120 Q50,30 100,80 T200,40 T300,90 T400,20 L400,150 L0,150 Z"
                    fill="url(#grad)"
                  ></path>
                </svg>
              </div>
              <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold px-2">
                <span>WEEK 1</span>
                <span>WEEK 2</span>
                <span>WEEK 3</span>
                <span>WEEK 4</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-slate-800">Recent Transactions</h4>
              <Link
                to="/transactions"
                className="text-blue-600 text-sm font-semibold hover:underline cursor-pointer"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-slate-400"
                      >
                        No transactions found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((txn, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">
                          {txn.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600">
                              <span className="material-symbols-outlined text-sm">
                                {txn.entityIcon || "payments"}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none mb-1">
                                {txn.entity}
                              </p>
                              <p className="text-xs text-slate-500 leading-none">
                                {txn.date}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${txn.type === "Credit" ? "bg-emerald-500" : "bg-rose-500"}`}
                            ></span>
                            <span>{txn.type}</span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-semibold ${txn.type === "Credit" ? "text-emerald-600" : "text-slate-800"}`}
                        >
                          {txn.amount > 0
                            ? `+$${txn.amount.toFixed(2)}`
                            : `-$${Math.abs(txn.amount).toFixed(2)}`}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              txn.status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : txn.status === "Pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
