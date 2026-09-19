import { useState } from "react";

import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Building2,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  UserPlus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function CreateUser() {
  const navigate = useNavigate();

  const { register, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");

  const [role, setRole] = useState("officer");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  // ===================================================
  // ADMIN ACCESS CHECK
  // ===================================================

  if (user?.role && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center max-w-md">

          <div className="w-14 h-14 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <AlertCircle size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Only administrators can create new user accounts.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-2.5 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md text-sm font-semibold"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Name
    if (!name.trim()) {
      setError("Please enter the user's full name.");
      return;
    }

    // Email
    if (!email.trim()) {
      setError("Please enter the user's email address.");
      return;
    }

    // Organisation
    if (!organisation.trim()) {
      setError("Please enter the organisation name.");
      return;
    }

    // Password
    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Admin creates the account.
       *
       * The selected role is sent to the backend.
       *
       * Current backend supports:
       * admin
       * officer
       */

      const result = await register({
        name,
        email,
        phone,
        organisation,
        password,
        role,
      });

      console.log("Create user result:", result);

      if (!result.success) {
        setError(
          result.message ||
            "Unable to create user account."
        );
        return;
      }

      setSuccess(
        result.message ||
          "User account created successfully."
      );

      // Clear form
      setName("");
      setEmail("");
      setPhone("");
      setOrganisation("");
      setRole("officer");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error(
        "Create user error:",
        error
      );

      setError(
        "Unable to connect to the registration server."
      );

    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-full bg-slate-50 p-6 md:p-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="mb-7">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-[#1677b8] rounded-lg flex items-center justify-center text-white">
              <UserPlus size={22} />
            </div>

            <div>
              <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
                ADMINISTRATION
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-[#17212b]">
                Create User Account
              </h1>
            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500 max-w-2xl">
            Create an account for an authorised officer or
            guard. Users created here can sign in through
            the normal PramaanAI login page.
          </p>

        </div>


        {/* FORM CARD */}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* CARD HEADER */}

          <div className="px-6 py-5 border-b border-slate-200">

            <h2 className="text-base font-bold text-slate-800">
              User Information
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Enter the details of the person you want to
              authorize on this organisation's account.
            </p>

          </div>


          <div className="p-6 md:p-8">

            {/* ERROR */}

            {error && (
              <div className="mb-6 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 flex gap-2">

                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>{error}</span>

              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="mb-6 p-3 rounded-lg border border-green-200 bg-green-50 text-sm text-green-700 flex gap-2">

                <CheckCircle
                  size={17}
                  className="mt-0.5 shrink-0"
                />

                <span>{success}</span>

              </div>
            )}


            <form
              onSubmit={submit}
              className="space-y-6"
            >

              {/* ROW 1 */}

              <div className="grid md:grid-cols-2 gap-5">

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
                      placeholder="Enter full name"
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
                      placeholder="Enter email address"
                      className="w-full ml-3 outline-none text-sm text-slate-800"
                      autoComplete="email"
                    />

                  </div>

                </div>

              </div>


              {/* ROW 2 */}

              <div className="grid md:grid-cols-2 gap-5">

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


                {/* ORGANISATION */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    ORGANISATION NAME
                  </label>

                  <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8] focus-within:ring-1 focus-within:ring-[#1677b8]/20 transition">

                    <Building2
                      size={17}
                      className="text-slate-400 shrink-0"
                    />

                    <input
                      required
                      type="text"
                      value={organisation}
                      onChange={(e) =>
                        setOrganisation(e.target.value)
                      }
                      placeholder="Enter organisation name"
                      className="w-full ml-3 outline-none text-sm text-slate-800"
                      autoComplete="organization"
                    />

                  </div>

                </div>

              </div>


              {/* ROW 3 */}

              <div className="grid md:grid-cols-2 gap-5">

                {/* ROLE */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    ACCOUNT ROLE
                  </label>

                  <div className="mt-2 relative">

                    <ShieldCheck
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <select
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value)
                      }
                      className="w-full h-11 pl-10 pr-3 border border-slate-300 rounded-md outline-none text-sm text-slate-800 bg-white focus:border-[#1677b8] focus:ring-1 focus:ring-[#1677b8]/20"
                    >

                      <option value="officer">
                        Officer / Guard
                      </option>

                    </select>

                  </div>

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Only administrators can create administrator accounts.
                  </p>

                </div>


                {/* EMPTY */}

                <div className="hidden md:block" />

              </div>


              {/* PASSWORD SECTION */}

              <div className="pt-4 border-t border-slate-200">

                <h3 className="text-sm font-bold text-slate-800">
                  Login Credentials
                </h3>

                <p className="text-xs text-slate-500 mt-1 mb-4">
                  These credentials will be used by the officer
                  to sign in through the normal login page.
                </p>


                <div className="grid md:grid-cols-2 gap-5">

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
                            (previous) =>
                              !previous
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
                            (previous) =>
                              !previous
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

                </div>

              </div>


              {/* BUTTONS */}

              <div className="pt-2 flex flex-col sm:flex-row gap-3">

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-11 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {loading
                    ? "Creating account..."
                    : "Create User Account"}

                  {!loading && (
                    <ArrowRight size={17} />
                  )}

                </button>


                <button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  className="h-11 px-6 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-md font-semibold text-sm transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>


        {/* SECURITY FOOTER */}

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">

          <p className="text-[10px] font-bold text-slate-400 tracking-[1px]">
            ADMIN CONTROLLED ACCOUNT CREATION
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Only authorised administrators should create
            accounts for officers and guards.
          </p>

        </div>

      </div>

    </div>
  );
}