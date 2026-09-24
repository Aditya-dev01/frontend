import {
  Bell,
  Search,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    logout();
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-7">

      {/* SEARCH */}
      <div className="flex items-center w-[360px]">
        <div className="relative w-full">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search screenings, documents..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-[#1677b8] focus:outline-none"
          />

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATION */}
        <button
          type="button"
          className="relative text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Bell size={19} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* DIVIDER */}
        <div className="h-7 w-px bg-slate-200" />

        {/* PROFILE */}
        <div
          className="relative"
          onMouseEnter={() => setShowProfile(true)}
          onMouseLeave={() => setShowProfile(false)}
        >

          {/* PROFILE ICON */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#0b1f33] text-white flex items-center justify-center text-sm font-semibold hover:bg-[#123452] transition-colors"
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </button>

          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <div className="absolute right-0 top-9 w-60 pt-2 z-50">

              <div className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">

                {/* USER INFO */}
                <div className="px-4 py-3 border-b border-slate-100">

                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name || "User"}
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5 capitalize">
                    {user?.role || "Officer"}
                  </p>

                  {user?.email && (
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {user.email}
                    </p>
                  )}

                </div>

                {/* SIGN OUT */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} />

                  <span>Sign out</span>
                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}