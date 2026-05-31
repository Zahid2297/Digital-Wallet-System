import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAppState } from "../context/AppContext";
import * as walletApi from "../api/wallet.api.js";
import { mapTransaction } from "../utils/mappers";
import { downloadBlob } from "../utils/auth";

export default function Transactions({ onLogoutClick }) {
  const { stats } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [daysFilter, setDaysFilter] = useState("30");
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const limit = 10;

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const data = await walletApi.getTransactions({
        page: currentPage,
        limit,
        type: typeFilter,
        status: statusFilter,
        days: daysFilter,
        search: searchQuery,
      });
      setTransactions((data.transactions || []).map(mapTransaction));
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } catch (err) {
      setTransactions([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, typeFilter, statusFilter, daysFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(fetchPage, searchQuery ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchPage, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter, statusFilter, daysFilter, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setTypeFilter("All");
    setDaysFilter("30");
    setCurrentPage(1);
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const blob = await walletApi.exportTransactions({
        type: typeFilter,
        status: statusFilter,
        days: daysFilter,
        search: searchQuery,
      });
      downloadBlob(blob, "transaction-ledger.csv");
    } catch (err) {
      alert(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  return (
    <AppLayout title="Ledger Transactions" titleIcon="sync_alt" onLogoutClick={onLogoutClick}>
      <div className="p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Transaction History</h1>
            <p className="text-slate-500 text-sm">Live data from your wallet ledger.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              disabled={exporting || total === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              {exporting ? "Exporting..." : "Export Ledger"}
            </button>
            <Link
              to="/wallet"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New Payment
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600/10"
                placeholder="Search by description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={daysFilter}
                onChange={(e) => setDaysFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
              >
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
                <option value="3650">All Time</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
              >
                <option value="All">All Types</option>
                <option value="Debit">Debit</option>
                <option value="Credit">Credit</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <button
                onClick={resetFilters}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-red-500"
                title="Reset filters"
              >
                <span className="material-symbols-outlined block">restart_alt</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <p className="px-6 py-12 text-center text-slate-400">Loading transactions...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Description</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Amount</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((item) => (
                        <tr key={item._id || item.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id}</td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{item.date}</div>
                            <div className="text-xs text-slate-400">{item.time}</div>
                          </td>
                          <td className="px-6 py-4 font-semibold">{item.entity}</td>
                          <td className="px-6 py-4">{item.type}</td>
                          <td className={`px-6 py-4 text-right font-bold ${item.type === "Credit" ? "text-emerald-600" : "text-slate-900"}`}>
                            {item.type === "Credit" ? `+$${Math.abs(item.amount).toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
                          </td>
                          <td className="px-6 py-4">{item.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50/50">
                <p className="text-sm text-slate-500">
                  Showing {start}–{end} of {total}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="h-8 w-8 rounded border border-slate-200 disabled:opacity-40 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <span className="text-xs font-bold px-2">
                    Page {currentPage} of {pages}
                  </span>
                  <button
                    disabled={currentPage >= pages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="h-8 w-8 rounded border border-slate-200 disabled:opacity-40 flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs font-extrabold text-slate-400 uppercase mb-2">Total Spending</p>
            <p className="text-2xl font-black">${stats.totalSpending.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs font-extrabold text-slate-400 uppercase mb-2">Total Income</p>
            <p className="text-2xl font-black">${stats.totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs font-extrabold text-slate-400 uppercase mb-2">Net Flow</p>
            <p className={`text-2xl font-black ${stats.netFlow >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {stats.netFlow >= 0 ? "+" : "-"}${Math.abs(stats.netFlow).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
