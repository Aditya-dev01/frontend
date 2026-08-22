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
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    login,
  } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      const newUser = register({
        name,
        email,
        phone,
        password,
      });

      /*
       * Automatically login the newly
       * registered user.
       */

      login(
        {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: "user",
          verificationStatus:
            "Not Verified",
        },
        `demo-user-${newUser.id}`
      );

      navigate("/user-dashboard");

    } catch (error) {

      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1f33] flex items-center justify-center p-5">

      <div className="w-full max-w-[1050px] bg-white rounded-xl overflow-hidden shadow-2xl grid lg:grid-cols-[45%_55%]">

        {/* BRAND */}

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
              USER REGISTRATION
            </p>

            <h2 className="text-4xl font-bold leading-tight">
              Create Your
              <br />
              Identity Profile
            </h2>

            <p className="mt-5 text-sm text-slate-400 leading-6 max-w-sm">
              Create your PramaanAI account and
              use our identity verification platform
              to securely check your documents.
            </p>

          </div>

          <div className="text-xs text-slate-500">
            PRAMAANAI SECURE IDENTITY PLATFORM
          </div>

        </div>

        {/* FORM */}

        <div className="p-8 md:p-12">

          <div className="max-w-md mx-auto">

            <div className="mb-7">

              <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
                NEW USER
              </p>

              <h2 className="text-3xl font-bold text-[#17212b] mt-2">
                Create account
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Register to verify your identity.
              </p>

            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={submit}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  FULL NAME
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

                  <User
                    size={17}
                    className="text-slate-400"
                  />

                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    className="w-full ml-3 outline-none text-sm"
                  />

                </div>

              </div>

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
                    className="w-full ml-3 outline-none text-sm"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  PHONE NUMBER
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

                  <Phone
                    size={17}
                    className="text-slate-400"
                  />

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="w-full ml-3 outline-none text-sm"
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
                    className="w-full ml-3 outline-none text-sm"
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

              {/* CONFIRM PASSWORD */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  CONFIRM PASSWORD
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-md h-11 px-3 focus-within:border-[#1677b8]">

                  <LockKeyhole
                    size={17}
                    className="text-slate-400"
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
                    className="w-full ml-3 outline-none text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="text-slate-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60"
              >

                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <ArrowRight size={17} />
                )}

              </button>

            </form>

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

          </div>

        </div>

      </div>

    </div>
  );
}