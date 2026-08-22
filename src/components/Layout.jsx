import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f4f7fa]">

      <Sidebar />

      <div className="lg:ml-[260px]">

        <Topbar />

        <main className="p-5 md:p-7 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}