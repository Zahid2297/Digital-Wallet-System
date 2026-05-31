import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import LogoutModal from "./pages/LogoutModal";
import { AppStateProvider, useAppState } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

function AppRoutes() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { logout } = useAppState();
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutOpen(false);
    navigate("/login", { replace: true });
  };

  const withLogout = (Page) => <Page onLogoutClick={() => setIsLogoutOpen(true)} />;

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
