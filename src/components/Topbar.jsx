import {
  Bell,
  ShieldCheck,
  Search,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-[76px] bg-white border-b border-slate-200 flex items-center justify-between px-5 md:px-8">

      <div className="flex items-center gap-3">

        <div className="lg:hidden">
          <ShieldCheck
            className="text-[#1677b8]"
            size={24}
          />
        </div>

        <div className="hidden md:block">

          <p className="text-xs text-slate-400">
            SECURITY OPERATIONS
          </p>

          <p className="text-sm font-semibold text-[#17212b]">
            Identity Screening Control Center
          </p>

        </div>

      </div>

      <div className="flex items-center gap-5">

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">

          <span className="w-2 h-2 bg-green-500 rounded-full" />

          System Operational

        </div>

        <button className="text-slate-500 hover:text-[#1677b8]">
          <Search size={19} />
        </button>

        <button className="relative text-slate-500 hover:text-[#1677b8]">

          <Bell size={19} />

          <span className="absolute -right-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />

        </button>

      </div>

    </header>
  );
}