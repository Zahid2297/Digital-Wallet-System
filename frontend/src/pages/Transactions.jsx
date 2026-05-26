import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../context/AppContext";

export default function Transactions({ onLogoutClick }) {
  const { balance, transactions, profile } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Completed" | "Pending" | "Failed"
  const [typeFilter, setTypeFilter] = useState("All"); // "All" | "Debit" | "Credit"
  const [daysFilter, setDaysFilter] = useState("30"); // "30" | "90" | "365"
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side filtering of dynamic transactions list
  const filtered = transactions.filter((item) => {
    // Search query matching
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.method.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    const matchesType = typeFilter === "All" || item.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setTypeFilter("All");
    setDaysFilter("30");
    setCurrentPage(1);
  };

  const exportCSV = () => {
    alert(
      "Simulation: Your report transaction-ledger.csv has been prepared and fetched successfully.",
    );
  };

  // Dynamic calculations for dynamic trans statistics
  const spending = transactions
    .filter((t) => t.type === "Debit" && t.status === "Completed")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const income = transactions
    .filter((t) => t.type === "Credit" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const surplus = income - spending;

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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 text-blue-600 font-bold transition-colors"
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
          <div className="flex items-center gap-3 text-slate-900 text-lg font-bold leading-tight">
            <span className="material-symbols-outlined text-blue-600">
              sync_alt
            </span>
            <h2>Ledger Transactions</h2>
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

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Transaction History
              </h1>
              <p className="text-slate-500 text-sm">
                Monitor and export your financial activities across all linked
                bank accounts.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">
                  download
                </span>{" "}
                Export Ledger
              </button>
              <Link
                to="/wallet"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>{" "}
                New Payment
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 animate-fade-in">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-blue-600 focus:bg-white rounded-lg focus:ring-2 focus:ring-blue-600/10 outline-none text-sm transition-all"
                  placeholder="Search by ID, merchant name, or card details..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="relative">
                  <select
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(e.target.value)}
                    className="appearance-none flex items-center gap-2 pl-3 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 text-sm font-semibold border border-slate-200 rounded-lg outline-none cursor-pointer text-slate-700 text-left"
                  >
                    <option value="30">Date: Last 30 Days</option>
                    <option value="90">Date: Last 90 Days</option>
                    <option value="365">Date: Last Year</option>
                  </select>
                  <span className="pointer-events-none material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    expand_more
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="appearance-none flex items-center gap-2 pl-3 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 text-sm font-semibold border border-slate-200 rounded-lg outline-none cursor-pointer text-slate-700 text-left"
                  >
                    <option value="All">Type: All</option>
                    <option value="Debit">Debit Only</option>
                    <option value="Credit">Credit Only</option>
                  </select>
                  <span className="pointer-events-none material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    expand_more
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none flex items-center gap-2 pl-3 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100 text-sm font-semibold border border-slate-200 rounded-lg outline-none cursor-pointer text-slate-700 text-left"
                  >
                    <option value="All">Status: All</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <span className="pointer-events-none material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    expand_more
                  </span>
                </div>

                <button
                  onClick={resetFilters}
                  className="p-2.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  title="Reset Filter Settings"
                >
                  <span className="material-symbols-outlined block">
                    restart_alt
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Entity name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-12 text-center text-slate-400 font-medium"
                      >
                        No transactions found matching your current filter
                        choices.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-medium text-slate-500">
                            {item.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-800">
                            {item.date}
                          </div>
                          <div className="text-xs text-slate-400">
                            {item.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-sm text-slate-600">
                                {item.entityIcon}
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                              {item.entity}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.type === "Debit"
                                ? "bg-red-50 text-red-700 border border-red-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-sm font-extrabold ${
                              item.type === "Debit"
                                ? "text-slate-900"
                                : "text-emerald-600"
                            }`}
                          >
                            {item.type === "Debit"
                              ? `-$${Math.abs(item.amount).toFixed(2)}`
                              : `+$${Math.abs(item.amount).toFixed(2)}`}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === "Completed"
                                ? "bg-emerald-100 text-emerald-700"
                                : item.status === "Pending"
                                  ? "bg-amber-100 text-amber-700 animate-pulse"
                                  : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.status === "Completed"
                                  ? "bg-emerald-500"
                                  : item.status === "Pending"
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                              }`}
                            ></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="material-symbols-outlined text-slate-400 text-base">
                              {item.methodIcon}
                            </span>
                            {item.method}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              alert(
                                `Details for Transaction ${item.id}: Purchased at ${item.entity} on ${item.date} via ${item.method}.`,
                              )
                            }
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-600 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">
                              more_vert
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50/50 select-none">
              <div className="text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900">1</span> to{" "}
                <span className="font-bold text-slate-900">
                  {filtered.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {filtered.length}
                </span>{" "}
                results
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center h-8 w-8 rounded border border-slate-200 text-slate-400 cursor-not-allowed">
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded bg-blue-600 text-white text-xs font-bold shadow-sm">
                  1
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded border border-slate-200 text-xs font-medium hover:bg-white cursor-pointer hover:text-blue-600 transition-colors">
                  2
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="flex items-center justify-center h-8 w-8 rounded border border-slate-200 text-xs font-medium hover:bg-white cursor-pointer hover:text-blue-600 transition-colors">
                  9
                </button>
                <button className="flex items-center justify-center h-8 w-8 rounded border border-slate-200 text-slate-600 hover:bg-white cursor-pointer hover:text-blue-600 transition-colors">
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  This Month's Spending
                </span>
                <span className="material-symbols-outlined text-red-500 text-sm animate-bounce">
                  trending_up
                </span>
              </div>
              <div className="text-2xl font-black text-slate-800">
                $
                {spending.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                +12% from last month
              </div>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: "65%" }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Total Income
                </span>
                <span className="material-symbols-outlined text-emerald-500 text-sm">
                  trending_down
                </span>
              </div>
              <div className="text-2xl font-black text-slate-800">
                $
                {income.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium">
                -3% from last month
              </div>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "82%" }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  Net Flow Surplus
                </span>
                <span className="material-symbols-outlined text-blue-600 text-sm">
                  account_balance_wallet
                </span>
              </div>
              <div
                className={`text-2xl font-black ${surplus >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {surplus >= 0
                  ? `+$${surplus.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `-$${Math.abs(surplus).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
              <div className="mt-2 text-xs text-slate-500 font-medium font-medium">
                Net surplus has grown vs April
              </div>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
