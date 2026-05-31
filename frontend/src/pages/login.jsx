import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.api.js";
import { useAppState } from "../context/AppContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loadUserData } = useAppState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginApi({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await loadUserData();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2463eb] items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2463eb] via-blue-600 to-indigo-900 opacity-90"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-12">
            <div className="flex items-center gap-3 text-white mb-6">
              <span className="material-symbols-outlined text-4xl">
                account_balance_wallet
              </span>
              <h1 className="text-3xl font-bold tracking-tight">NovaWallet</h1>
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              The future of digital assets is here.
            </h2>
            <p className="text-blue-100 text-lg">
              Manage your global transactions, crypto portfolio, and everyday
              spending with institutional-grade security and a seamless
              interface.
            </p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
              <div className="w-full h-64 bg-slate-200/20 rounded-lg overflow-hidden">
                <img
                  alt="Abstract digital asset visualization"
                  className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApgDUlA0yhhhYZNCdCtBSbdSHWM5JX18-Quoip6uNZDDvWR2QJG12YtVulHXIKokGFoOsLdj3J9T862FZaGdV8S9ZYAAttqXebA6eAXyUZ1btT98Xn0QrVgr50bXV2x898InE2Qn8IPgp1MuIlpiRMHh3FKEaNXbMSbxu_vKdNqMOYw5fVL2RBxuV7bkI2QNWAcfM84wLVqFqExoFrVnbua4KzGPJk3nC42Zqnilx6AJcxVeUeTqVOH43Lu5sXCIdF0Fef-1VL9CQ"
                />
              </div>
              <div className="mt-6 space-y-3">
                <div className="h-2 w-24 bg-white/40 rounded-full"></div>
                <div className="h-2 w-full bg-white/20 rounded-full"></div>
                <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 bg-white">
        <div className="max-w-[440px] w-full mx-auto">
          <header className="mb-10">
            <div className="lg:hidden flex items-center gap-2 text-[#2463eb] mb-8">
              <span className="material-symbols-outlined text-3xl">
                account_balance_wallet
              </span>
              <span className="text-xl font-bold text-[#2463eb]">
                NovaWallet
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome back
            </h2>
            <p className="text-slate-500">
              Please enter your details to sign in.
            </p>
          </header>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700"
              >
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzuhrTyZaSbUTs9JAwKJPvR0uauiKLkp0sDyVV91Sy2LrDv6Nqc2wdP929WHkDHgRPtSQevsotQ1l539zvmt0m3skSlHoRxorDja03_oZyYTqd-aueU8-I2OJpO8XaQEJ1-zzZZ7SAGwHjKvlxZPaVAjEZZ1EVkLED14XfszndmOuHDCajxerAr7dqFLpza9ayV0o4Ls6LhSZjkiPW8FMFvE7cdOD8QQxT0aDUBBJxSIUdsKpKpvdCK_LUldkIZgrt8JFIDh1BW60"
                />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">
                  terminal
                </span>
                GitHub
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-medium uppercase tracking-wider">
                Or with email
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-slate-700"
                htmlFor="email"
              >
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#2463eb] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463eb] focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  className="text-sm font-semibold text-slate-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-[#2463eb] hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#2463eb] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463eb] focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={formData.remember}
                onChange={(e) =>
                  setFormData({ ...formData, remember: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300"
                style={{ accentColor: "#2463eb" }}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm font-medium text-slate-600"
              >
                Keep me logged in for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 rounded-lg text-sm font-bold text-white bg-[#2463eb] hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in to Account"}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account yet?
              <a
                href="/register"
                className="font-bold text-[#2463eb] hover:underline ml-1"
              >
                Create an account
              </a>
            </p>
            <div className="mt-12 flex items-center justify-center gap-6 text-slate-400 text-xs font-medium">
              <a href="#" className="hover:text-slate-600 transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-slate-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
