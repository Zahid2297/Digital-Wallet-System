import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAppState } from "../context/AppContext";

export default function Dashboard({ onLogoutClick }) {
  const { balance, transactions, stats, profile } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const maxTrend = Math.max(
    ...stats.incomeExpenseTrend.map((m) => Math.max(m.income, m.expenses)),
    1,
  );

  return (
    <AppLayout onLogoutClick={onLogoutClick}>
      <div className="p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-full sm:w-72 border border-slate-200 order-2 sm:order-1">
            <span className="material-symbols-outlined text-slate-400 text-sm">search</span>
            <input
              className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2"
              placeholder="Search recent transactions..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Welcome back, {profile.fullName.split(" ")[0] || "there"}!
            </h2>
            <p className="text-sm text-slate-500">Your wallet overview for {monthLabel}.</p>
          </div>
          <Link
            to="/wallet"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Funds
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 w-fit mb-4">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Total Balance</p>
            <h3 className="text-2xl font-bold mt-1">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 w-fit mb-4">
              <span className="material-symbols-outlined">south_west</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Deposits This Month</p>
            <h3 className="text-2xl font-bold mt-1">
              ${stats.monthlyDeposits.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600 w-fit mb-4">
              <span className="material-symbols-outlined">north_east</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Withdrawals This Month</p>
            <h3 className="text-2xl font-bold mt-1">
              ${stats.monthlyWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6">Transaction Volume (6 months)</h4>
            <div className="flex items-end justify-between h-48 gap-2 px-2">
              {stats.volumeByMonth.length === 0 ? (
                <p className="text-sm text-slate-400 w-full text-center self-center">No transaction data yet.</p>
              ) : (
                stats.volumeByMonth.map((month) => (
                  <div key={month.label} className="flex flex-col items-center flex-1 gap-2">
                    <div className="w-full bg-slate-100 rounded-t-md h-full relative flex items-end">
                      <div
                        className="w-full bg-blue-600 rounded-t-md transition-all"
                        style={{ height: `${month.heightPercent}%` }}
                        title={`$${month.volume.toFixed(2)}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">{month.label}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-6">Income vs Expenses (6 months)</h4>
            {stats.incomeExpenseTrend.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-16">No transaction data yet.</p>
            ) : (
              <div className="flex items-end justify-between h-48 gap-2">
                {stats.incomeExpenseTrend.map((month) => (
                  <div key={month.label} className="flex flex-col items-center flex-1 gap-1 h-full justify-end">
                    <div className="flex gap-0.5 items-end h-40 w-full justify-center">
                      <div
                        className="w-2 bg-blue-600 rounded-t-sm"
                        style={{ height: `${(month.income / maxTrend) * 100}%`, minHeight: month.income ? 4 : 0 }}
                        title={`Income $${month.income.toFixed(2)}`}
                      />
                      <div
                        className="w-2 bg-slate-300 rounded-t-sm"
                        style={{ height: `${(month.expenses / maxTrend) * 100}%`, minHeight: month.expenses ? 4 : 0 }}
                        title={`Expenses $${month.expenses.toFixed(2)}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{month.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">Recent Transactions</h4>
            <Link to="/transactions" className="text-blue-600 text-sm font-semibold hover:underline">
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
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      {transactions.length === 0
                        ? "No transactions yet. Add funds from your wallet."
                        : "No transactions match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((txn) => (
                    <tr key={txn._id || txn.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{txn.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{txn.entity}</p>
                        <p className="text-xs text-slate-500">{txn.date}</p>
                      </td>
                      <td className="px-6 py-4">{txn.type}</td>
                      <td className={`px-6 py-4 text-right font-semibold ${txn.type === "Credit" ? "text-emerald-600" : "text-slate-800"}`}>
                        {txn.amount > 0 ? `+$${txn.amount.toFixed(2)}` : `-$${Math.abs(txn.amount).toFixed(2)}`}
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
    </AppLayout>
  );
}
