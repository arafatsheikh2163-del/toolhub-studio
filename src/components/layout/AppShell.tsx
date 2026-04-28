import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    const onResize = () => { if (window.innerWidth < 768) setCollapsed(true); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="relative flex-1 flex flex-col min-w-0">
        <Topbar onToggleSidebar={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto">
          <div className="px-5 sm:px-8 py-8 max-w-[1500px] mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
