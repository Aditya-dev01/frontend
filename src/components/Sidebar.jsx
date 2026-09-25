import {
  LayoutDashboard,
  FileSearch,
  ShieldCheck,
  History,
  UserPlus,
  X,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {

  const { user } = useAuth();

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
          name: "Audit History",
          path: "/audit-history",
          icon: History,
        },
      ],
    },
  ];

  // Admin-only section
  if (user?.role?.toLowerCase() === "admin") {
    navigation.push({
      label: "Administration",
      items: [
        {
          name: "Create User",
          path: "/admin/create-user",
          icon: UserPlus,
        },
      ],
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-label="Main navigation"
        className={`fixed left-0 top-0 z-50 flex h-screen w-[245px] -translate-x-full flex-col bg-[#0b1f33] text-white shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : ""
        }`}
      >

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

        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="ml-auto rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>

      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">

        {navigation.map((section) => (
          <div
            key={section.label}
            className="mb-7"
          >

            {/* Section title */}
            <div className="px-3 mb-2 text-[10px] font-bold tracking-[1.4px] text-slate-500 uppercase">
              {section.label}
            </div>

            {/* Navigation items */}
            <div className="space-y-1">

              {section.items.map((item) => {

                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
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
      </aside>
    </>
  );
}
