import {
  Bell,
  Search,
  LogOut,
  Menu,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ isMenuOpen, onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const handleSignOut = () => {
    logout();
    setShowProfile(false);
    navigate("/login");
  };

  return (
    <header className="h-[72px] bg-white border-b border-slate-200 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-7">

      {/* SEARCH */}
      <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-[360px]">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isMenuOpen}
          onClick={onMenuClick}
          className="shrink-0 rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <Menu size={22} />
        </button>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">


        {/* DIVIDER */}
        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

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
