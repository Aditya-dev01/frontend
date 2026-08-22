import { useState } from "react";

import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Bell,
  Monitor,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const {
    user,
    login,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const [name, setName] =
    useState(user?.name || "");

  const [email] =
    useState(user?.email || "");

  const [phone, setPhone] =
    useState(user?.phone || "");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [notifications, setNotifications] =
    useState(true);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  /*
   =========================================
   SAVE PROFILE
   =========================================
  */

  const saveProfile = () => {
    setError("");
    setMessage("");

    try {
      const updatedUser = {
        ...user,
        name: name.trim(),
        phone: phone.trim(),
      };

      /*
       * Update current login session
       */

      login(
        updatedUser,
        localStorage.getItem(
          "pramaanai_token"
        ) || ""
      );

      /*
       * If this is a registered user,
       * also update their stored account.
       */

      if (user?.role === "user") {
        const users =
          JSON.parse(
            localStorage.getItem(
              "pramaanai_users"
            )
          ) || [];

        const updatedUsers =
          users.map((registeredUser) => {

            if (
              registeredUser.id === user.id
            ) {
              return {
                ...registeredUser,
                name: name.trim(),
                phone: phone.trim(),
              };
            }

            return registeredUser;
          });

        localStorage.setItem(
          "pramaanai_users",
          JSON.stringify(updatedUsers)
        );
      }

      setMessage(
        "Profile information updated successfully."
      );

    } catch (err) {

      setError(
        "Unable to update profile."
      );

    }
  };

  /*
   =========================================
   CHANGE PASSWORD
   =========================================
  */

  const changePassword = () => {
    setError("");
    setMessage("");

    if (!currentPassword) {
      setError(
        "Enter your current password."
      );
      return;
    }

    if (!newPassword) {
      setError(
        "Enter a new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    /*
     * Only registered users can change their
     * demo password here.
     */

    if (user?.role !== "user") {
      setError(
        "Administrator and Officer passwords are managed by the system administrator."
      );
      return;
    }

    const users =
      JSON.parse(
        localStorage.getItem(
          "pramaanai_users"
        )
      ) || [];

    const userIndex =
      users.findIndex(
        (registeredUser) =>
          registeredUser.id === user.id
      );

    if (userIndex === -1) {
      setError(
        "User account could not be found."
      );
      return;
    }

    const storedUser =
      users[userIndex];

    if (
      storedUser.password !==
      currentPassword
    ) {
      setError(
        "Current password is incorrect."
      );
      return;
    }

    users[userIndex] = {
      ...storedUser,
      password: newPassword,
    };

    localStorage.setItem(
      "pramaanai_users",
      JSON.stringify(users)
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setMessage(
      "Password changed successfully."
    );
  };

  /*
   =========================================
   NOTIFICATIONS
   =========================================
  */

  const saveNotificationSettings = () => {
    localStorage.setItem(
      "pramaanai_notifications",
      JSON.stringify({
        notifications,
        emailNotifications,
      })
    );

    setMessage(
      "Notification preferences saved."
    );
  };

  /*
   =========================================
   THEME
   =========================================
  */

  const toggleTheme = () => {
    const newValue = !darkMode;

    setDarkMode(newValue);

    localStorage.setItem(
      "pramaanai_dark_mode",
      String(newValue)
    );

    /*
     * This is a prototype setting.
     * Your global CSS can later use this
     * preference to apply dark mode.
     */
  };

  /*
   =========================================
   LOGOUT
   =========================================
  */

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

        <div className="flex items-center gap-3">

          <Link
            to="/dashboard"
            className="text-slate-400 hover:text-slate-700"
          >
            <ArrowLeft size={19} />
          </Link>

          <div className="w-9 h-9 bg-[#1677b8] rounded-lg flex items-center justify-center text-white">

            <ShieldCheck size={20} />

          </div>

          <div>

            <h1 className="font-bold text-slate-800">
              PramaanAI
            </h1>

            <p className="text-[9px] tracking-widest text-slate-400">
              SYSTEM SETTINGS
            </p>

          </div>

        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500"
        >

          <LogOut size={17} />

          Logout

        </button>

      </header>


      {/* MAIN */}

      <main className="max-w-5xl mx-auto p-6 md:p-8">

        {/* TITLE */}

        <div className="mb-8">

          <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
            ACCOUNT CONFIGURATION
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            Settings
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Manage your PramaanAI account,
            security and preferences.
          </p>

        </div>


        {/* ALERT */}

        {message && (

          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex gap-3">

            <CheckCircle2
              size={20}
              className="text-emerald-600"
            />

            <p className="text-sm text-emerald-700">
              {message}
            </p>

          </div>

        )}

        {error && (

          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3">

            <AlertCircle
              size={20}
              className="text-red-500"
            />

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>

        )}


        <div className="space-y-6">


          {/* ====================================
              PROFILE
          ===================================== */}

          <section className="bg-white border border-slate-200 rounded-2xl">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                  <User
                    size={20}
                    className="text-[#1677b8]"
                  />

                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    Profile Information
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Update your personal information.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="grid md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    FULL NAME
                  </label>

                  <div className="mt-2 flex items-center border border-slate-300 rounded-lg h-11 px-3">

                    <User
                      size={17}
                      className="text-slate-400"
                    />

                    <input
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      className="w-full ml-3 outline-none text-sm"
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    EMAIL
                  </label>

                  <div className="mt-2 flex items-center border border-slate-200 bg-slate-50 rounded-lg h-11 px-3">

                    <Mail
                      size={17}
                      className="text-slate-400"
                    />

                    <input
                      value={email}
                      disabled
                      className="w-full ml-3 outline-none text-sm text-slate-500"
                    />

                  </div>

                </div>


                {/* PHONE */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    PHONE
                  </label>

                  <div className="mt-2 flex items-center border border-slate-300 rounded-lg h-11 px-3">

                    <Phone
                      size={17}
                      className="text-slate-400"
                    />

                    <input
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      className="w-full ml-3 outline-none text-sm"
                    />

                  </div>

                </div>


                {/* ROLE */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    ACCOUNT ROLE
                  </label>

                  <div className="mt-2 h-11 flex items-center px-3 bg-slate-50 border border-slate-200 rounded-lg">

                    <span className="text-sm font-medium text-slate-600 capitalize">
                      {user?.role}
                    </span>

                  </div>

                </div>

              </div>

              <button
                onClick={saveProfile}
                className="mt-6 h-10 px-5 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >

                <Save size={16} />

                Save Profile

              </button>

            </div>

          </section>


          {/* ====================================
              PASSWORD
          ===================================== */}

          <section className="bg-white border border-slate-200 rounded-2xl">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">

                  <LockKeyhole
                    size={20}
                    className="text-amber-600"
                  />

                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    Password & Security
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Manage your account password.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              {user?.role !== "user" && (

                <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">

                  Administrator and Security Officer
                  credentials are controlled by the
                  system configuration in this demo.

                </div>

              )}

              {/* CURRENT */}

              <div>

                <label className="text-xs font-semibold text-slate-600">
                  CURRENT PASSWORD
                </label>

                <div className="mt-2 flex items-center border border-slate-300 rounded-lg h-11 px-3">

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(
                        e.target.value
                      )
                    }
                    disabled={
                      user?.role !== "user"
                    }
                    className="w-full outline-none text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrentPassword(
                        !showCurrentPassword
                      )
                    }
                    className="text-slate-400"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              <div className="grid md:grid-cols-2 gap-5 mt-5">

                {/* NEW */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    NEW PASSWORD
                  </label>

                  <div className="mt-2 flex items-center border border-slate-300 rounded-lg h-11 px-3">

                    <input
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      disabled={
                        user?.role !== "user"
                      }
                      className="w-full outline-none text-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                      className="text-slate-400"
                    >
                      {showNewPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>

                  </div>

                </div>


                {/* CONFIRM */}

                <div>

                  <label className="text-xs font-semibold text-slate-600">
                    CONFIRM PASSWORD
                  </label>

                  <div className="mt-2 flex items-center border border-slate-300 rounded-lg h-11 px-3">

                    <input
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
                      disabled={
                        user?.role !== "user"
                      }
                      className="w-full outline-none text-sm"
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

              </div>


              {user?.role === "user" && (

                <button
                  onClick={changePassword}
                  className="mt-6 h-10 px-5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                >

                  <LockKeyhole size={16} />

                  Change Password

                </button>

              )}

            </div>

          </section>


          {/* ====================================
              NOTIFICATIONS
          ===================================== */}

          <section className="bg-white border border-slate-200 rounded-2xl">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">

                  <Bell
                    size={20}
                    className="text-purple-600"
                  />

                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    Notifications
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Control system notifications.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6 space-y-5">

              {/* SYSTEM */}

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-700">
                    System notifications
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Receive verification and security
                    alerts.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setNotifications(
                      !notifications
                    )
                  }
                  className={`w-11 h-6 rounded-full transition ${
                    notifications
                      ? "bg-[#1677b8]"
                      : "bg-slate-300"
                  }`}
                >

                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transition transform ${
                      notifications
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />

                </button>

              </div>


              {/* EMAIL */}

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-700">
                    Email notifications
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Receive important updates by email.
                  </p>

                </div>

                <button
                  onClick={() =>
                    setEmailNotifications(
                      !emailNotifications
                    )
                  }
                  className={`w-11 h-6 rounded-full transition ${
                    emailNotifications
                      ? "bg-[#1677b8]"
                      : "bg-slate-300"
                  }`}
                >

                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transition transform ${
                      emailNotifications
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />

                </button>

              </div>


              <button
                onClick={
                  saveNotificationSettings
                }
                className="h-10 px-5 bg-[#1677b8] hover:bg-[#12679f] text-white rounded-lg text-sm font-semibold flex items-center gap-2"
              >

                <Save size={16} />

                Save Preferences

              </button>

            </div>

          </section>


          {/* ====================================
              APPEARANCE
          ===================================== */}

          <section className="bg-white border border-slate-200 rounded-2xl">

            <div className="p-6 border-b border-slate-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">

                  <Monitor
                    size={20}
                    className="text-slate-600"
                  />

                </div>

                <div>

                  <h3 className="font-bold text-slate-800">
                    Appearance
                  </h3>

                  <p className="text-xs text-slate-400 mt-1">
                    Configure your console appearance.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-semibold text-slate-700">
                    Dark mode
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Use a darker interface for the
                    screening console.
                  </p>

                </div>

                <button
                  onClick={toggleTheme}
                  className={`w-11 h-6 rounded-full transition ${
                    darkMode
                      ? "bg-[#1677b8]"
                      : "bg-slate-300"
                  }`}
                >

                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow transition transform ${
                      darkMode
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />

                </button>

              </div>

            </div>

          </section>


          {/* ====================================
              ACCOUNT INFO
          ===================================== */}

          <section className="bg-white border border-slate-200 rounded-2xl p-6">

            <h3 className="font-bold text-slate-800">
              Account Information
            </h3>

            <div className="grid md:grid-cols-3 gap-5 mt-5">

              <div>

                <p className="text-[10px] font-bold text-slate-400">
                  USER ID
                </p>

                <p className="text-sm font-semibold text-slate-700 mt-1">
                  {user?.id}
                </p>

              </div>

              <div>

                <p className="text-[10px] font-bold text-slate-400">
                  ROLE
                </p>

                <p className="text-sm font-semibold text-slate-700 mt-1 capitalize">
                  {user?.role}
                </p>

              </div>

              <div>

                <p className="text-[10px] font-bold text-slate-400">
                  AUTHENTICATION
                </p>

                <p className="text-sm font-semibold text-emerald-600 mt-1">
                  Active Session
                </p>

              </div>

            </div>

          </section>


          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="w-full h-11 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
          >

            <LogOut size={17} />

            Sign out of PramaanAI

          </button>

        </div>

      </main>

    </div>
  );
}