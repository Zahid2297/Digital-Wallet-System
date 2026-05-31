import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerApi } from "../api/auth.api.js";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    const levels = [
      { label: "Weak", color: "#ef4444" },
      { label: "Fair", color: "#f97316" },
      { label: "Medium", color: "#2463eb" },
      { label: "Strong", color: "#22c55e" },
    ];
    return { score, ...levels[Math.min(score - 1, 3)] };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.terms) {
      setError("Please agree to the Terms of Service");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f6f8]">
      <div className="flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-6 py-4 md:px-10 lg:px-20 bg-white">
          <div className="flex items-center gap-2 text-[#2463eb]">
            <div className="w-8 h-8 bg-[#2463eb] rounded-lg flex items-center justify-center text-white">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                account_balance_wallet
              </span>
            </div>
            <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">
              FintechSaaS
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-500 text-sm">
              Already have an account?
            </span>
            <button
              onClick={() => navigate("/login")}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-xl h-10 px-5 border border-[#2463eb] text-[#2463eb] hover:bg-blue-50 text-sm font-bold transition-colors"
            >
              Log In
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[480px] space-y-8">
            <div className="space-y-2">
              <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">
                Join the future of finance
              </h1>
              <p className="text-slate-500 text-lg">
                Create your free account and start managing your wealth with
                AI-driven insights.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-slate-900 text-sm font-semibold">
                  Full Name
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ fontSize: "20px" }}
                  >
                    person
                  </span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2463eb] outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 text-sm font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ fontSize: "20px" }}
                  >
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2463eb] outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 text-sm font-semibold">
                  Password
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ fontSize: "20px" }}
                  >
                    lock
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2463eb] outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2463eb] transition-colors"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-1 h-1.5 w-full">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all"
                          style={{
                            backgroundColor:
                              i <= strength.score ? strength.color : "#e2e8f0",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "14px" }}
                      >
                        info
                      </span>
                      Strength:{" "}
                      <span
                        className="font-bold"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </span>
                      . Use symbols and numbers.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-900 text-sm font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    style={{ fontSize: "20px" }}
                  >
                    lock_reset
                  </span>
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#2463eb] outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 py-2">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={(e) =>
                      setFormData({ ...formData, terms: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-slate-300 cursor-pointer"
                    style={{ accentColor: "#2463eb" }}
                  />
                </div>
                <label
                  htmlFor="terms"
                  className="text-sm text-slate-600 leading-tight cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-[#2463eb] font-semibold hover:underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-[#2463eb] font-semibold hover:underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2463eb] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Account..." : "Create My Account"}
              </button>

            </form>

            <p className="text-center text-slate-500 text-sm">
              By clicking "Create My Account", you are joining the global
              network of savvy investors.
            </p>
          </div>
        </main>

        <footer className="p-8 text-center text-slate-400 text-xs border-t border-slate-200 mt-auto bg-white">
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <a href="#" className="hover:text-[#2463eb] transition-colors">
              Help Center
            </a>
            <a href="#" className="hover:text-[#2463eb] transition-colors">
              Security
            </a>
            <a href="#" className="hover:text-[#2463eb] transition-colors">
              Contact
            </a>
          </div>
          <p>© 2024 FintechSaaS Inc. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
