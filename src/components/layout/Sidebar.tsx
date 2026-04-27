import { NavLink, useLocation } from "react-router-dom";
import { Home, Type, Image as ImageIcon, Code2, FileText, LayoutGrid, ChevronLeft, Sparkles, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TOOLS, type ToolCategory } from "@/data/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const SECTIONS: Array<{ key: ToolCategory | "dashboard" | "favorites"; label: string; icon: LucideIcon; path?: string; }> = [
  { key: "dashboard", label: "Dashboard",   icon: Home,       path: "/" },
  { key: "text",      label: "Text Tools",  icon: Type },
  { key: "image",     label: "Image Tools", icon: ImageIcon },
  { key: "developer", label: "Developer",   icon: Code2 },
  { key: "pdf",       label: "PDF Tools",   icon: FileText },
];

export function Sidebar({ collapsed, onToggle }: Props) {
  const { pathname } = useLocation();
  const { favorites } = useFavorites();
  const favTools = TOOLS.filter(t => favorites.includes(t.id));

  return (
    <aside
      className={cn(
        "relative z-20 flex flex-col glass border-r border-white/[0.06] transition-[width] duration-300 ease-out-expo",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
      style={{ backdropFilter: "blur(28px) saturate(160%)" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06]">
        <div className="relative h-9 w-9 rounded-md bg-foreground text-background grid place-items-center">
          <span className="font-mono text-[13px] font-bold tracking-tighter">T/</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <div className="text-[13px] font-semibold text-foreground tracking-tight uppercase">ToolHub<span className="text-muted-foreground font-normal"> / Ultra</span></div>
            <div className="text-[10px] text-muted-foreground -mt-0.5 font-mono uppercase tracking-[0.18em]">v1.0 — Client-side</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        <div>
          {!collapsed && <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">— Workspace</div>}
          <ul className="space-y-0.5">
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const path = s.path ?? `/category/${s.key}`;
              const active = pathname === path || (s.path === "/" && pathname === "/");
              return (
                <li key={s.key}>
                  <NavLink
                    to={path}
                    end={path === "/"}
                    title={collapsed ? s.label : undefined}
                    className={({ isActive }) => cn(
                      "group relative flex items-center gap-3 rounded-md px-3 h-10 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors",
                      (isActive || active) && "sidebar-active"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.75} />
                    {!collapsed && <span className="truncate">{s.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Flagship */}
        <div>
          {!collapsed && <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">— Flagship</div>}
          <NavLink
            to="/tools/multi-tab"
            title={collapsed ? "Multi-tab Viewer" : undefined}
            className={({ isActive }) => cn(
              "group relative flex items-center gap-3 rounded-md px-3 h-11 text-sm transition-all",
              "border border-white/[0.10] bg-white/[0.03] text-foreground",
              "hover:border-white/25 hover:bg-white/[0.06]",
              isActive && "ring-1 ring-white/40"
            )}
          >
            <LayoutGrid className="h-4.5 w-4.5 shrink-0 text-foreground" strokeWidth={1.75} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-none">Multi-tab Viewer</div>
                <div className="text-[10.5px] text-muted-foreground mt-1">Compare sites live</div>
              </div>
            )}
            {!collapsed && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-foreground text-background font-semibold tracking-wider">NEW</span>}
          </NavLink>
        </div>

        {/* Favorites */}
        {favTools.length > 0 && (
          <div>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-1.5">
                — Favorites
              </div>
            )}
            <ul className="space-y-0.5">
              {favTools.map(t => {
                const Icon = t.icon;
                return (
                  <li key={t.id}>
                    <NavLink
                      to={t.path}
                      title={collapsed ? t.name : undefined}
                      className={({ isActive }) => cn(
                        "group flex items-center gap-3 rounded-md px-3 h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                        isActive && "sidebar-active"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                      {!collapsed && <span className="truncate">{t.name}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
