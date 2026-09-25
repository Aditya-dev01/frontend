import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:ml-[245px]">

        <Topbar
          isMenuOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-7">

          <Outlet />

        </main>

      </div>

    </div>
  );
}
