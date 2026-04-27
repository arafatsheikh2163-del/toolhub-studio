import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });

  // Auto-collapse on small screens
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden">
      {/* Ambient orbs */}
      <div className="ambient-orb animate-float-slow" style={{ width: 520, height: 520, top: -140, left: -120, background: "hsl(217 91% 60% / 0.55)" }} />
      <div className="ambient-orb animate-float-slow" style={{ width: 460, height: 460, bottom: -160, right: -100, background: "hsl(271 91% 65% / 0.45)", animationDelay: "-6s" }} />
      <div className="ambient-orb" style={{ width: 360, height: 360, top: "40%", left: "50%", background: "hsl(188 86% 53% / 0.25)", opacity: 0.35 }} />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div className="relative flex-1 flex flex-col min-w-0 z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="px-5 sm:px-8 py-8 max-w-[1500px] mx-auto w-full animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
