import {
  LayoutDashboard,
  FileSearch,
  ShieldCheck,
  AlertTriangle,
  History,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Sidebar() {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    {
      label: "Overview",
      items: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },

    {
      label: "Screening",
      items: [
        {
          name: "New Screening",
          path: "/screening/new",
          icon: FileSearch,
        },

        {
          name: "Risk Dashboard",
          path: "/risk-dashboard",
          icon: AlertTriangle,
        },

        {
          name: "Audit History",
          path: "/audit-history",
          icon: History,
        },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[245px] bg-[#0b1f33] text-white flex flex-col">

      {/* BRAND */}

      <div className="h-[72px] px-5 flex items-center border-b border-white/10">

        <div className="w-9 h-9 bg-[#1677b8] rounded-md flex items-center justify-center">

          <ShieldCheck size={20} />

        </div>

        <div className="ml-3">

          <div className="font-bold tracking-wide">
            PramaanAI
          </div>

          <div className="text-[9px] text-slate-400 tracking-[1.5px]">
            IDENTITY INTELLIGENCE
          </div>

        </div>

      </div>


      {/* NAVIGATION */}

      <nav className="flex-1 px-3 py-5 overflow-y-auto">

        {navigation.map((section) => (

          <div
            key={section.label}
            className="mb-7"
          >

            <div className="px-3 mb-2 text-[10px] font-bold tracking-[1.4px] text-slate-500 uppercase">

              {section.label}

            </div>

            <div className="space-y-1">

              {section.items.map((item) => {

                const Icon = item.icon;

                return (

                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `
                      flex items-center gap-3
                      px-3 py-2.5
                      rounded-md
                      text-sm
                      transition-colors
                      ${
                        isActive
                          ? "bg-[#1677b8] text-white"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }
                      `
                    }
                  >

                    <Icon size={17} />

                    <span>
                      {item.name}
                    </span>

                  </NavLink>

                );

              })}

            </div>

          </div>

        ))}

      </nav>


      {/* USER */}

      <div className="border-t border-white/10 p-4">

        <div className="flex items-center">

          <div className="w-9 h-9 rounded-full bg-[#1677b8] flex items-center justify-center text-sm font-semibold">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>

          <div className="ml-3 min-w-0">

            <p className="text-sm font-medium truncate">
              {user?.name || "User"}
            </p>

            <p className="text-[11px] text-slate-500 capitalize">
              {user?.role || "Officer"}
            </p>

          </div>

        </div>


        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs text-slate-400 hover:text-white hover:bg-white/5"
        >

          <LogOut size={15} />

          Sign out

        </button>

      </div>

    </aside>
  );
}