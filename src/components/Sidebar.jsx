import {
  LayoutDashboard,
  ScanSearch,
  ShieldAlert,
  History,
  LogOut,
  ShieldCheck,
  FileSearch,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  {
    section: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    section: "SCREENING",
    items: [
      {
        name: "New Screening",
        path: "/screening/new",
        icon: ScanSearch,
      },
      {
        name: "Risk Analysis",
        path: "/risk-dashboard",
        icon: ShieldAlert,
      },
    ],
  },
  {
    section: "RECORDS",
    items: [
      {
        name: "Audit History",
        path: "/audit-history",
        icon: History,
      },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[260px] bg-[#0b1f33] text-white flex-col z-50">

      {/* Logo */}

      <div className="h-[76px] px-6 flex items-center border-b border-white/10">

        <div className="w-10 h-10 rounded-lg bg-[#1677b8] flex items-center justify-center">
          <ShieldCheck size={23} />
        </div>

        <div className="ml-3">

          <h1 className="font-bold tracking-wide">
            IDENTITYGUARD
          </h1>

          <p className="text-[10px] text-slate-400 tracking-[2px]">
            AI SECURITY SYSTEM
          </p>

        </div>

      </div>

      {/* Navigation */}

      <div className="flex-1 px-4 py-6 overflow-y-auto">

        {navigation.map((group) => (

          <div
            key={group.section}
            className="mb-7"
          >

            <p className="px-3 mb-2 text-[10px] font-bold tracking-[1.5px] text-slate-500">
              {group.section}
            </p>

            <div className="space-y-1">

              {group.items.map((item) => {

                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition ${
                        isActive
                          ? "bg-[#1677b8] text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >

                    <Icon size={18} />

                    <span>
                      {item.name}
                    </span>

                  </NavLink>
                );
              })}

            </div>

          </div>

        ))}

        {/* System */}

        <div>

          <p className="px-3 mb-2 text-[10px] font-bold tracking-[1.5px] text-slate-500">
            SYSTEM
          </p>

          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/5">
            <Settings size={18} />
            Settings
          </button>

        </div>

      </div>

      {/* User */}

      <div className="border-t border-white/10 p-4">

        <div className="flex items-center gap-3 mb-4">

          <div className="w-9 h-9 rounded-full bg-[#1677b8] flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || "O"}
          </div>

          <div className="min-w-0">

            <p className="text-sm font-medium truncate">
              {user?.name || "Security Officer"}
            </p>

            <p className="text-[11px] text-slate-500 capitalize">
              {user?.role || "Officer"}
            </p>

          </div>

        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-red-400"
        >
          <LogOut size={17} />
          Sign out
        </button>

      </div>

    </aside>
  );
}