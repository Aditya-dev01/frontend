import {
  Bell,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Topbar() {

  const { user } = useAuth();

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
            placeholder="Search screenings, documents..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-[#1677b8]"
          />

        </div>

      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-5">

        <button className="relative text-slate-500 hover:text-slate-800">

          <Bell size={19} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />

        </button>


        <div className="h-7 w-px bg-slate-200" />


        <div className="flex items-center gap-3">

          <div className="text-right">

            <p className="text-sm font-semibold text-slate-700">
              {user?.name || "User"}
            </p>

            <p className="text-[10px] uppercase tracking-wider text-slate-400">
              {user?.role || "Officer"}
            </p>

          </div>


          <div className="w-9 h-9 rounded-full bg-[#0b1f33] text-white flex items-center justify-center text-sm font-semibold">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>

        </div>

      </div>

    </header>
  );
}