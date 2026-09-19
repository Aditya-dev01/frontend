import { useState } from "react";

import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useAuth();

  // ===================================================
  // FORM STATE
  // ===================================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // ===================================================
  // SUBMIT
  // ===================================================

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // -------------------------------------------------
    // NAME VALIDATION
    // -------------------------------------------------

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    // -------------------------------------------------
    // EMAIL VALIDATION
    // -------------------------------------------------

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // -------------------------------------------------
    // PHONE VALIDATION
    // -------------------------------------------------

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    // -------------------------------------------------
    // ORGANIZATION VALIDATION
    // -------------------------------------------------

    if (!organization.trim()) {
      setError("Please enter your organisation name.");
      return;
    }

    // -------------------------------------------------
    // PASSWORD VALIDATION
    // -------------------------------------------------

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    // -------------------------------------------------
    // CONFIRM PASSWORD
    // -------------------------------------------------

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // IMPORTANT:
      // Flask /register expects:
      //
      // {
      //   oldUserData,
      //   newUserData,
      //   adminRegistration
      // }
      //
      // =================================================

      const result = await register({
        oldUserData: {},

        newUserData: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          organization: organization.trim(),
          password: password,
        },

        // All accounts created through this page
        // are admin registrations.
        adminRegistration: true,
      });

      console.log("Register result:", result);

      // -------------------------------------------------
      // REGISTRATION FAILED
      // -------------------------------------------------

      if (!result || !result.success) {
        setError(
          result?.msg ||
          result?.message ||
          "Unable to create account."
        );

        return;
      }

      // -------------------------------------------------
      // REGISTRATION SUCCESS
      // -------------------------------------------------

      setSuccess(
        result.msg ||
        result.message ||
        "Admin account created successfully."
      );

      // -------------------------------------------------
      // CLEAR FORM
      // -------------------------------------------------

      setName("");
      setEmail("");
      setPhone("");
      setOrganization("");
      setPassword("");
      setConfirmPassword("");

      // -------------------------------------------------
      // GO TO LOGIN
      // -------------------------------------------------

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to registration server."
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
              ADMIN REGISTRATION
            </p>

            <h2 className="text-4xl font-bold leading-tight">
              Create Your
              <br />
              Identity Profile
            </h2>

            <p className="mt-5 text-sm text-slate-400 leading-6 max-w-sm">
              Create your PramaanAI account and
              securely access the identity
              verification platform.
            </p>

          </div>

          <div className="text-xs text-slate-500">
            PRAMAANAI SECURE IDENTITY PLATFORM
          </div>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <div className="p-8 md:p-12">

          <div className="max-w-md mx-auto">

            {/* HEADER */}

            <div className="mb-7">

              <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
                NEW ADMIN ACCOUNT
              </p>

              <h2 className="text-3xl font-bold text-[#17212b] mt-2">
                Create account
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Create your secure PramaanAI administrator account.
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

            {/* SUCCESS */}

            {success && (
              <div className="mb-5 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-700 flex gap-2">

                <CheckCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>{success}</span>

              </div>
            )}

            {/* FORM */}

            <form
              onSubmit={submit}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  FULL NAME
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8] focus-within:ring-1 focus-within:ring-[#1677b8]/20 transition">

                  <User
                    size={17}
                    className="text-slate-400 shrink-0"
                  />

                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                    autoComplete="name"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  EMAIL ADDRESS
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8] focus-within:ring-1 focus-within:ring-[#1677b8]/20 transition">

                  <Mail
                    size={17}
                    className="text-slate-400 shrink-0"
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

              {/* PHONE */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  PHONE NUMBER
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8] focus-within:ring-1 focus-within:ring-[#1677b8]/20 transition">

                  <Phone
                    size={17}
                    className="text-slate-400 shrink-0"
                  />

                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                    autoComplete="tel"
                  />

                </div>

              </div>

              {/* ORGANIZATION */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  ORGANISATION NAME
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8] focus-within:ring-1 focus-within:ring-[#1677b8]/20 transition">

                  <ShieldCheck
                    size={17}
                    className="text-slate-400 shrink-0"
                  />

                  <input
                    required
                    type="text"
                    value={organization}
                    onChange={(e) =>
                      setOrganization(e.target.value)
                    }
                    placeholder="Enter your organisation name"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                    autoComplete="organization"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  PASSWORD
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8] focus-within:ring-1 focus-within:ring-[#1677b8]/20 transition">

                  <LockKeyhole
                    size={17}
                    className="text-slate-400 shrink-0"
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
                    placeholder="Minimum 6 characters"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  CONFIRM PASSWORD
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8] focus-within:ring-1 focus-within:ring-[#1677b8]/20 transition">

                  <LockKeyhole
                    size={17}
                    className="text-slate-400 shrink-0"
                  />

                  <input
                    required
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Confirm password"
                    className="w-full ml-3 outline-none text-sm text-slate-800"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
                      )
                    }
                    className="text-slate-400 hover:text-slate-600 transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >

                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <ArrowRight size={17} />
                )}

              </button>

            </form>

            {/* LOGIN */}

            <div className="text-center mt-6">

              <p className="text-sm text-slate-500">

                Already have an account?

                <Link
                  to="/login"
                  className="ml-1 font-semibold text-[#1677b8] hover:underline"
                >
                  Sign in
                </Link>

              </p>

            </div>

            {/* SECURITY */}

            <div className="mt-7 pt-5 border-t border-slate-200">

              <p className="text-[10px] font-bold text-slate-400 tracking-[1px]">
                SECURE REGISTRATION
              </p>

              <p className="mt-2 text-xs text-slate-500 leading-5">
                Your password is securely handled by
                the PramaanAI backend during account
                registration.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
