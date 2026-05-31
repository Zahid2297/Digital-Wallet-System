import { Link, useLocation } from "react-router-dom";
import { useAppState } from "../context/AppContext";
import UserAvatar from "./UserAvatar";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/transactions", label: "Transactions", icon: "sync_alt" },
  { to: "/wallet", label: "Wallet", icon: "account_balance" },
  { to: "/profile", label: "Profile", icon: "person" },
];

export default function AppLayout({ children, title, titleIcon, onLogoutClick }) {
  const { balance, profile } = useAppState();
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f6f8] text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-800">NexusPay</h1>
            <p className="text-xs text-slate-500">Asset Management</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={onLogoutClick}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-left font-medium"
          >
            <span className="material-symbols-outlined text-red-500">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          {title && (
            <div className="flex items-center gap-3 text-slate-900 text-lg font-bold leading-tight">
              {titleIcon && (
                <span className="material-symbols-outlined text-blue-600">{titleIcon}</span>
              )}
              <h2>{title}</h2>
            </div>
          )}
          <div className={`flex items-center gap-6 ${title ? "" : "ml-auto"}`}>
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
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{profile.fullName}</p>
                <p className="text-xs text-slate-500">{profile.email}</p>
              </div>
              <UserAvatar
                name={profile.fullName}
                avatarIndex={profile.avatarIndex}
                size="sm"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
