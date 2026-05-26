import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
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

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[#f6f6f8] px-2 text-slate-500">
                    Or register with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">
                    Google
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700">
                    Apple
                  </span>
                </button>
              </div>
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
