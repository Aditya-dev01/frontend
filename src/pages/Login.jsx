import { useState } from "react";

import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Fingerprint,
  UserPlus,
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
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("officer");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const enteredEmail =
        email.trim().toLowerCase();

      /*
       =========================================
       ADMIN ACCOUNT
       =========================================
      */

      const adminAccount = {
        email: "admin@identityguard.ai",
        password: "admin123",

        user: {
          id: "ADM-001",
          name: "System Administrator",
          email: "admin@identityguard.ai",
          role: "admin",
        },

        token: "demo-admin-jwt",
      };

      /*
       =========================================
       SECURITY OFFICER ACCOUNT
       =========================================
      */

      const officerAccount = {
        email: "officer@identityguard.ai",
        password: "officer123",

        user: {
          id: "OFF-1042",
          name: "Security Officer",
          email: "officer@identityguard.ai",
          role: "officer",
        },

        token: "demo-officer-jwt",
      };

      /*
       =========================================
       ADMIN LOGIN
       =========================================
      */

      if (
        role === "admin" &&
        enteredEmail === adminAccount.email &&
        password === adminAccount.password
      ) {
        login(
          adminAccount.user,
          adminAccount.token
        );

        navigate("/dashboard");
        return;
      }

      /*
       =========================================
       OFFICER LOGIN
       =========================================
      */

      if (
        role === "officer" &&
        enteredEmail === officerAccount.email &&
        password === officerAccount.password
      ) {
        login(
          officerAccount.user,
          officerAccount.token
        );

        navigate("/dashboard");
        return;
      }

      /*
       =========================================
       REGISTERED USER LOGIN
       =========================================

       Registered users are stored by Register.jsx
       in:

       pramaanai_users
      */

      const registeredUsers =
        JSON.parse(
          localStorage.getItem(
            "pramaanai_users"
          )
        ) || [];

      const registeredUser =
        registeredUsers.find(
          (user) =>
            user.email.toLowerCase() ===
              enteredEmail &&
            user.password === password
        );

      if (registeredUser) {

        const loggedInUser = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          phone: registeredUser.phone || "",
          role: "user",

          verificationStatus:
            registeredUser.verificationStatus ||
            "Not Verified",
        };

        login(
          loggedInUser,
          `demo-user-${registeredUser.id}`
        );

        navigate("/user-dashboard");
        return;
      }

      /*
       =========================================
       LOGIN FAILED
       =========================================
      */

      setError(
        "Authentication failed. Please check your credentials."
      );

    } catch (error) {

      console.error(
        "Authentication error:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1f33] flex items-center justify-center p-5">

      <div className="w-full max-w-[1050px] bg-white rounded-xl overflow-hidden shadow-2xl grid lg:grid-cols-[45%_55%]">

        {/* ================================
            BRAND PANEL
        ================================= */}

        <div className="hidden lg:flex bg-[#0b1f33] text-white p-12 flex-col justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-[#1677b8] rounded-lg flex items-center justify-center">

                <ShieldCheck size={25} />

              </div>

              <div>

                <h1 className="font-bold tracking-wide text-lg">
                  PramaanAI
                </h1>

                <p className="text-[9px] tracking-[2px] text-slate-400">
                  IDENTITY INTELLIGENCE SYSTEM
                </p>

              </div>

            </div>

          </div>

          <div>

            <div className="mb-8">

              <Fingerprint
                size={70}
                strokeWidth={1}
                className="text-[#3ba3dd]"
              />

            </div>

            <p className="text-xs text-[#3ba3dd] font-semibold tracking-[2px] mb-3">
              SECURE ACCESS PORTAL
            </p>

            <h2 className="text-4xl font-bold leading-tight">
              Intelligent
              <br />
              Identity Screening
            </h2>

            <p className="mt-5 text-sm text-slate-400 leading-6 max-w-sm">
              AI-assisted verification of identity
              documents, biometric consistency and
              document integrity for secure screening
              operations.
            </p>

          </div>

          <div className="text-xs text-slate-500">
            AUTHORIZED PERSONNEL & REGISTERED USERS
          </div>

        </div>

        {/* ================================
            LOGIN PANEL
        ================================= */}

        <div className="p-8 md:p-12">

          <div className="max-w-md mx-auto">

            <div className="mb-8">

              <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
                SECURE AUTHENTICATION
              </p>

              <h2 className="text-3xl font-bold text-[#17212b] mt-2">
                Sign in
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Access your PramaanAI verification
                console.
              </p>

            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
                {error}
              </div>
            )}

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
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                  />

                </div>

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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter password"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* ROLE */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  ACCESS ROLE
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

                  <option value="user">
                    Registered User
                  </option>

                </select>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
              >

                {loading
                  ? "Authenticating..."
                  : "Sign in to console"}

                {!loading && (
                  <ArrowRight size={17} />
                )}

              </button>

            </form>

            {/* CREATE ACCOUNT */}

            <div className="mt-7">

              <div className="relative">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>

                <div className="relative flex justify-center">

                  <span className="bg-white px-3 text-[10px] font-semibold text-slate-400">
                    OR
                  </span>

                </div>

              </div>

              <Link
                to="/register"
                className="mt-5 w-full h-11 border border-slate-300 hover:border-[#1677b8] hover:bg-blue-50 text-slate-700 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition"
              >

                <UserPlus size={17} />

                Create a new account

              </Link>

            </div>

            {/* DEMO CREDENTIALS */}

            <div className="mt-8 pt-5 border-t border-slate-200">

              <p className="text-[10px] font-bold text-slate-400 tracking-[1px]">
                DEMO ENVIRONMENT
              </p>

              <div className="mt-3 text-xs text-slate-500 space-y-1">

                <p>
                  Officer:
                  <span className="ml-2 text-slate-700">
                    officer@identityguard.ai
                  </span>
                </p>

                <p>
                  Password:
                  <span className="ml-2 text-slate-700">
                    officer123
                  </span>
                </p>

                <p className="pt-2">
                  Administrator:
                  <span className="ml-2 text-slate-700">
                    admin@identityguard.ai
                  </span>
                </p>

                <p>
                  Password:
                  <span className="ml-2 text-slate-700">
                    admin123
                  </span>
                </p>

              </div>

            </div>

            <div className="flex items-center justify-center gap-2 mt-8 text-[10px] text-slate-400">

              <ShieldCheck size={13} />

              Protected PramaanAI authentication environment

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}