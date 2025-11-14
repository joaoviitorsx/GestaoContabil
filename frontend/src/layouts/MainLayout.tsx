import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />

      <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <div
          className={`fixed top-0 right-0 z-40 bg-white shadow-sm transition-all duration-300 ease-in-out ${sidebarOpen ? "left-64" : "left-0"}`}>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </div>

        <div className="mt-[64px] flex-1 p-6 overflow-auto" style={{ backgroundColor: "#f0f0f0ff" }}>
          <main className="w-full h-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
