import { Navigate, Outlet } from "react-router-dom";
import { useAppState } from "../context/AppContext";
import { isAuthenticated } from "../utils/auth";

export default function ProtectedRoute() {
  const { loading } = useAppState();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f6f6f8] text-slate-600">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-4xl text-blue-600 animate-pulse">
            account_balance_wallet
          </span>
          <p className="text-sm font-semibold">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
