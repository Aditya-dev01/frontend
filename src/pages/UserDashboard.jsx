import {
  ShieldCheck,
  UploadCloud,
  FileCheck2,
  UserCircle,
  LogOut,
  ArrowRight,
  Clock3,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}

      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 bg-[#1677b8] rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>

          <div>

            <h1 className="font-bold text-slate-800">
              PramaanAI
            </h1>

            <p className="text-[9px] tracking-widest text-slate-400">
              IDENTITY INTELLIGENCE
            </p>

          </div>

        </div>

        <div className="flex items-center gap-4">

          <div className="hidden sm:block text-right">

            <p className="text-sm font-semibold text-slate-700">
              {user?.name}
            </p>

            <p className="text-xs text-slate-400">
              Registered User
            </p>

          </div>

          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">

            <UserCircle
              size={21}
              className="text-[#1677b8]"
            />

          </div>

          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500"
          >
            <LogOut size={19} />
          </button>

        </div>

      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-8">

        {/* WELCOME */}

        <div className="mb-8">

          <p className="text-xs font-bold tracking-[1.5px] text-[#1677b8]">
            PERSONAL VERIFICATION CONSOLE
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            Welcome, {user?.name}
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Manage your identity verification from
            your personal PramaanAI account.
          </p>

        </div>

        {/* STATUS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-7">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">

                <Clock3
                  size={23}
                  className="text-amber-600"
                />

              </div>

              <div>

                <p className="text-xs text-slate-400 font-semibold">
                  IDENTITY STATUS
                </p>

                <h3 className="text-xl font-bold text-slate-800 mt-1">
                  {user?.verificationStatus ||
                    "Not Verified"}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Complete verification to check your
                  identity.
                </p>

              </div>

            </div>

            <Link
              to="/identity-check"
              className="inline-flex items-center justify-center gap-2 bg-[#1677b8] hover:bg-[#12679f] text-white px-5 h-11 rounded-lg text-sm font-semibold"
            >
              Check My Identity
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

        {/* CARDS */}

        <div className="grid md:grid-cols-3 gap-5">

          <Link
            to="/identity-check"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition"
          >

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

              <UploadCloud
                size={22}
                className="text-[#1677b8]"
              />

            </div>

            <h3 className="font-bold text-slate-800 mt-5">
              Verify Identity
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Upload an identity document and start
              the verification process.
            </p>

            <div className="mt-5 text-sm font-semibold text-[#1677b8] flex items-center gap-1">

              Start verification

              <ArrowRight size={15} />

            </div>

          </Link>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">

              <FileCheck2
                size={22}
                className="text-emerald-600"
              />

            </div>

            <h3 className="font-bold text-slate-800 mt-5">
              Verification Records
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Your previous verification records
              will appear here.
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6">

            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">

              <UserCircle
                size={22}
                className="text-slate-600"
              />

            </div>

            <h3 className="font-bold text-slate-800 mt-5">
              Account Information
            </h3>

            <div className="mt-4 space-y-3 text-sm">

              <div>
                <p className="text-xs text-slate-400">
                  USER ID
                </p>

                <p className="font-medium text-slate-700 mt-1">
                  {user?.id}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  EMAIL
                </p>

                <p className="font-medium text-slate-700 mt-1 break-all">
                  {user?.email}
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}