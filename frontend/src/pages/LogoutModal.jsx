import React from "react";

export default function LogoutModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">logout</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Log Out</h3>
          <p className="text-sm text-slate-500 mb-6">
            Are you sure you want to log out of NexusPay? You will need to enter
            your credentials to log back in.
          </p>
          <div className="flex flex-col w-full gap-2">
            <button
              id="confirm-logout-btn"
              onClick={onConfirm}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Yes, Log Out
            </button>
            <button
              id="cancel-logout-btn"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
