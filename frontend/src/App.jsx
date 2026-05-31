import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import LogoutModal from "./pages/LogoutModal";
import FeaturePlaceholder from "./pages/FeaturePlaceholder";
import { AppStateProvider, useAppState } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function AppRoutes() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { logout } = useAppState();
  const navigate = useNavigate();
  const openLogout = () => setIsLogoutOpen(true);
  const ph = (props) => <FeaturePlaceholder onLogoutClick={openLogout} {...props} />;

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutOpen(false);
    navigate("/login", { replace: true });
  };

  const withLogout = (Page) => <Page onLogoutClick={openLogout} />;

  return (
    <>
      {isLogoutOpen && (
        <LogoutModal
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={withLogout(Dashboard)} />
          <Route path="/wallet" element={withLogout(Wallet)} />
          <Route path="/transactions" element={withLogout(Transactions)} />
          <Route path="/profile" element={withLogout(Profile)} />

          <Route
            path="/wallet/scan"
            element={ph({
              title: "Scan to Pay",
              titleIcon: "qr_code_scanner",
              heading: "QR Code Scanner",
              description:
                "Point your camera at a merchant QR code to pay from your wallet balance.",
              icon: "qr_code_scanner",
            })}
          />
          <Route
            path="/wallet/bills"
            element={ph({
              title: "Bills",
              titleIcon: "receipt_long",
              heading: "Scheduled Bills",
              description:
                "Set up, schedule, and track recurring bill payments from your wallet.",
              icon: "receipt_long",
            })}
          />
          <Route
            path="/wallet/payment-methods"
            element={ph({
              title: "Payment Methods",
              titleIcon: "credit_card",
              heading: "Payment Methods",
              description:
                "Add and manage cards and bank accounts linked to your wallet.",
              icon: "credit_card",
              backTo: "/wallet",
            })}
          />
          <Route
            path="/wallet/more"
            element={ph({
              title: "More",
              titleIcon: "more_horiz",
              heading: "More Services",
              description:
                "Cards, rewards, referrals, and other wallet tools live here.",
              icon: "more_horiz",
            })}
          />
          <Route
            path="/profile/billing"
            element={ph({
              title: "Billing",
              titleIcon: "payments",
              heading: "Billing & Subscriptions",
              description:
                "View your plan, billing history, and download past invoices.",
              icon: "payments",
              backTo: "/profile",
              backLabel: "Back to Profile",
            })}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppStateProvider>
  );
}
