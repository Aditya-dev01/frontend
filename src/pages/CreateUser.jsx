import { useState } from "react";

import {
  UserPlus,
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "https://hackathon-backend-0eoj.onrender.com";

// --------------------------------------------------
// SHA-256 PASSWORD HASH
// Backend expects a SHA-256 hash
// --------------------------------------------------
const sha256 = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );

  return hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export default function CreateUser() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    organization: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // --------------------------------------------------
  // HANDLE CREATE USER
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // --------------------------------------------------
    // ADMIN CHECK
    // --------------------------------------------------
    if (user?.role?.toLowerCase() !== "admin") {
      setError("Only administrators can create users.");
      return;
    }

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.organization.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    // --------------------------------------------------
    // PHONE VALIDATION
    // --------------------------------------------------
    if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // --------------------------------------------------
    // EMAIL VALIDATION
    // --------------------------------------------------
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // --------------------------------------------------
    // PASSWORD VALIDATION
    // --------------------------------------------------
    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // --------------------------------------------------
      // GET ADMIN JWT TOKEN
      // --------------------------------------------------
      const token = localStorage.getItem("pramaanai_token");

      console.log("Token exists:", !!token);

      if (!token) {
        setError("Admin login token not found. Please login again.");
        return;
      }

      // --------------------------------------------------
      // CURRENT ADMIN DATA
      // --------------------------------------------------
      const oldUserData = {
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        organization:
          user?.organization ||
          user?.organizationName ||
          user?.organization_name ||
          "",
        role: "admin",
      };

      // --------------------------------------------------
      // HASH NEW USER PASSWORD
      // --------------------------------------------------
      const passwordHash = await sha256(formData.password);

      // --------------------------------------------------
      // NEW USER DATA
      // --------------------------------------------------
      const newUserData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        organization: formData.organization.trim(),
        password: passwordHash,
        role: "user",
      };

      // --------------------------------------------------
      // COMPLETE BACKEND PAYLOAD
      // Backend /register expects:
      //
      // {
      //   oldUserData,
      //   newUserData,
      //   adminRegistration
      // }
      // --------------------------------------------------
      const requestBody = {
        oldUserData,
        newUserData,
        adminRegistration: false,
      };

      console.log("REGISTER REQUEST:", requestBody);

      // --------------------------------------------------
      // SEND REQUEST
      // --------------------------------------------------
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(requestBody),
      });

      // --------------------------------------------------
      // READ RESPONSE SAFELY
      // --------------------------------------------------
      const responseText = await response.text();

      console.log("HTTP STATUS:", response.status);
      console.log("RAW BACKEND RESPONSE:", responseText);

      let result = {};

      try {
        result = responseText
          ? JSON.parse(responseText)
          : {};
      } catch (parseError) {
        console.error("JSON PARSE ERROR:", parseError);

        throw new Error(
          `Backend returned invalid JSON. HTTP ${response.status}.`
        );
      }

      console.log("PARSED BACKEND RESPONSE:", result);

      // --------------------------------------------------
      // BACKEND ERROR
      // --------------------------------------------------
      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.msg ||
            result?.error ||
            `Server error (${response.status})`
        );
      }

      // Some versions of your backend may return success
      // differently, so only reject explicit failure.
      if (result?.success === false) {
        throw new Error(
          result?.message ||
            result?.msg ||
            result?.error ||
            "Could not create user."
        );
      }

      // --------------------------------------------------
      // SUCCESS
      // --------------------------------------------------
      setMessage(
        result?.message ||
          result?.msg ||
          "User account created successfully."
      );

      // --------------------------------------------------
      // CLEAR FORM
      // --------------------------------------------------
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        organization: "",
      });
    } catch (err) {
      console.error("CREATE USER ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while creating the user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* PAGE HEADER */}
      <div className="mb-6 sm:mb-7">
        <p className="text-xs font-semibold tracking-wide text-slate-400">
          ADMINISTRATION / USER MANAGEMENT
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#17212b]">
          Create User
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new user account for your organization.
        </p>
      </div>

      {/* CARD */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {/* CARD HEADER */}
              <div className="border-b border-slate-100 px-4 py-5 sm:px-7 sm:py-6">
                <div className="flex items-center gap-3 sm:gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#1677b8]/10 text-[#1677b8] sm:h-12 sm:w-12">
                    <UserPlus size={23} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#0b1f33]">
                      New User Account
                    </h2>

                    <p className="text-sm text-slate-500">
                      Add a User / Officer to the system
                    </p>
                  </div>

                </div>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-4 sm:space-y-6 sm:p-7"
              >

                {/* NAME */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-[#1677b8] focus:ring-2 focus:ring-[#1677b8]/10"
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      inputMode="numeric"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-[#1677b8] focus:ring-2 focus:ring-[#1677b8]/10"
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-[#1677b8] focus:ring-2 focus:ring-[#1677b8]/10"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-[#1677b8] focus:ring-2 focus:ring-[#1677b8]/10"
                    />
                  </div>
                </div>

                {/* ORGANIZATION */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organization Name
                  </label>

                  <div className="relative">
                    <Building2
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Enter organization name"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg outline-none focus:border-[#1677b8] focus:ring-2 focus:ring-[#1677b8]/10"
                    />
                  </div>
                </div>

                {/* ROLE */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">

                    <ShieldCheck
                      size={19}
                      className="text-[#1677b8]"
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Account Type
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        User / Officer
                      </p>
                    </div>

                  </div>
                </div>

                {/* SUCCESS MESSAGE */}
                {message && (
                  <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                {/* ERROR MESSAGE */}
                {error && (
                  <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* BUTTONS */}
                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="w-full rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1677b8] px-6 py-3 text-sm font-medium text-white hover:bg-[#12669e] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <UserPlus size={17} />

                    {loading
                      ? "Creating User..."
                      : "Create User"}
                  </button>

                </div>

              </form>
      </div>
    </div>
  );
}
