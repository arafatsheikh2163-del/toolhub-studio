import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
          <PageTransition />
        </main>
      </div>
    </div>
  );
}

function PageTransition() {
  const loc = useLocation();
  return (
    <div className="px-5 sm:px-8 py-8 max-w-[1500px] mx-auto w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={loc.pathname}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
