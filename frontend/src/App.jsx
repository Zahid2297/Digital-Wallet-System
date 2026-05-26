import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import LogoutModal from "./pages/LogoutModal";
import { AppStateProvider } from "./context/AppContext";

export default function App() {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutOpen(false);
    // Standard secure redirection back to login
    window.location.href = "/login";
  };

  return (
    <AppStateProvider>
      <BrowserRouter>
        {isLogoutOpen && (
          <LogoutModal
            onClose={() => setIsLogoutOpen(false)}
            onConfirm={handleLogoutConfirm}
          />
        )}

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={<Dashboard onLogoutClick={() => setIsLogoutOpen(true)} />}
          />
          <Route
            path="/wallet"
            element={<Wallet onLogoutClick={() => setIsLogoutOpen(true)} />}
          />
          <Route
            path="/transactions"
            element={
              <Transactions onLogoutClick={() => setIsLogoutOpen(true)} />
            }
          />
          <Route
            path="/profile"
            element={<Profile onLogoutClick={() => setIsLogoutOpen(true)} />}
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
