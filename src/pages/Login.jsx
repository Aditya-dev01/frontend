import { useState } from "react";

import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("officer");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ===================================================
  // SUBMIT LOGIN
  // ===================================================

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    if (!role) {
      setError(
        "Please select your account role."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await login(
        email,
        password,
        role
      );

      console.log(
        "Login result:",
        result
      );

      if (!result.success) {
        setError(
          result.message ||
            "Invalid login credentials."
        );
        return;
      }

      /*
       * JWT is already stored in localStorage
       * by AuthContext.
       */

      const loggedInUser =
        result.user;

      if (
        loggedInUser?.role === "admin" ||
        loggedInUser?.role === "officer"
      ) {
        navigate(
          loggedInUser.role === "admin"
            ? "/dashboard"
            : "/dashboard",
          {
            replace: true,
          }
        );
      } else {
        setError(
          "Your account does not have a valid application role."
        );
      }
    } catch (error) {
      console.error(
        "Login page error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-[#0b1f33] flex items-center justify-center p-5">

      <div className="w-full max-w-[1050px] bg-white rounded-xl overflow-hidden shadow-2xl grid lg:grid-cols-[45%_55%]">

        {/* =================================================
            BRAND PANEL
        ================================================= */}

        <div className="hidden lg:flex bg-[#0b1f33] text-white p-12 flex-col justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-[#1677b8] rounded-lg flex items-center justify-center">

                <ShieldCheck size={25} />

              </div>

              <div>

                <h1 className="font-bold text-lg">
                  PramaanAI
                </h1>

                <p className="text-[9px] tracking-[2px] text-slate-400">
                  IDENTITY INTELLIGENCE SYSTEM
                </p>

              </div>

            </div>
          </div>

          <div>

            <p className="text-xs text-[#3ba3dd] font-semibold tracking-[2px] mb-3">
              SECURE ACCESS
            </p>

            <h2 className="text-4xl font-bold leading-tight">
              Identity
              <br />
              Intelligence
            </h2>

            <p className="mt-5 text-sm text-slate-400 leading-6 max-w-sm">
              Securely access the PramaanAI
              identity verification platform.
            </p>

          </div>

          <div className="text-xs text-slate-500">
            PRAMAANAI SECURE IDENTITY PLATFORM
          </div>

        </div>

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <div className="p-8 md:p-12">

          <div className="max-w-md mx-auto">

            {/* HEADER */}

            <div className="mb-7">

              <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
                SECURE LOGIN
              </p>

              <h2 className="text-3xl font-bold text-[#17212b] mt-2">
                Sign in
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Access your PramaanAI account.
              </p>

            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 flex gap-2">

                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>

              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={submit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  EMAIL ADDRESS
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

                  <Mail
                    size={17}
                    className="text-slate-400"
                  />

                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                    autoComplete="email"
                  />

                </div>

              </div>

              {/* ROLE */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  ACCOUNT ROLE
                </label>

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  className="mt-2 w-full h-11 border border-slate-300 rounded-md px-3 text-sm outline-none focus:border-[#1677b8]"
                >

                  <option value="officer">
                    Security Officer
                  </option>

                  <option value="admin">
                    System Administrator
                  </option>

                </select>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  PASSWORD
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

                  <LockKeyhole
                    size={17}
                    className="text-slate-400"
                  />

                  <input
                    required
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    className="text-slate-400 hover:text-slate-600"
                  >

                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}

                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading
                  ? "Signing in..."
                  : "Sign in"}

                {!loading && (
                  <ArrowRight size={17} />
                )}

              </button>

            </form>

            {/* REGISTER */}

            <div className="text-center mt-6">

              <p className="text-sm text-slate-500">

                Don't have an account?

                <Link
                  to="/register"
                  className="ml-1 font-semibold text-[#1677b8] hover:underline"
                >
                  Create account
                </Link>

              </p>

            </div>

            {/* SECURITY */}

            <div className="mt-7 pt-5 border-t border-slate-200">

              <p className="text-[10px] font-bold text-slate-400 tracking-[1px]">
                SECURE AUTHENTICATION
              </p>

              <p className="mt-2 text-xs text-slate-500 leading-5">
                Your password is converted to a
                SHA-256 hash before it is sent to
                the PramaanAI authentication server.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
