import { NavLink, useLocation } from "react-router-dom";
import { Home, Type, Image as ImageIcon, Code2, FileText, LayoutGrid, ChevronLeft, Wrench, ArrowLeftRight, Sparkles, ShieldCheck, Palette, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TOOLS, type ToolCategory } from "@/data/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const SECTIONS: Array<{ key: ToolCategory | "dashboard"; label: string; icon: LucideIcon; path?: string; }> = [
  { key: "dashboard", label: "Home",         icon: Home,           path: "/" },
  { key: "text",      label: "Text",         icon: Type },
  { key: "image",     label: "Image",        icon: ImageIcon },
  { key: "developer", label: "Developer",    icon: Code2 },
  { key: "pdf",       label: "PDF",          icon: FileText },
  { key: "utility",   label: "Utilities",    icon: Wrench },
  { key: "converter", label: "Converters",   icon: ArrowLeftRight },
  { key: "generator", label: "Generators",   icon: Sparkles },
  { key: "security",  label: "Security",     icon: ShieldCheck },
  { key: "creative",  label: "Studio",       icon: Palette },
];

export function Sidebar({ collapsed, onToggle }: Props) {
  const { pathname } = useLocation();
  const { favorites } = useFavorites();
  const favTools = TOOLS.filter(t => favorites.includes(t.id));

  return (
    <aside
      className={cn(
        "relative z-20 flex flex-col bg-card border-r border-border transition-[width] duration-300 ease-out-expo",
        collapsed ? "w-[72px]" : "w-[248px]"
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="relative h-9 w-9 rounded-xl bg-foreground text-background grid place-items-center shrink-0">
          <span className="font-mono text-[13px] font-bold tracking-tighter">T/</span>
        </div>
        {!collapsed && (
          <div className="min-w-0 animate-fade-in">
            <div className="text-[14px] font-semibold tracking-tight">ToolHub</div>
            <div className="text-[10px] text-muted-foreground -mt-0.5 font-mono uppercase tracking-[0.18em]">Ultra · v1.0</div>
          </div>
        )}
      </div>

      {/* Workspace switcher (à la ElevenLabs) */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <button className="w-full flex items-center gap-2.5 h-11 px-2.5 rounded-lg surface-soft hover:bg-accent transition-colors">
            <div className="h-7 w-7 rounded-md bg-[#f97316] grid place-items-center text-white text-xs font-bold shrink-0">A</div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium truncate">Personal</div>
            </div>
            <ChevronLeft className="h-3.5 w-3.5 -rotate-90 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5">
        <ul className="space-y-0.5">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const path = s.path ?? `/category/${s.key}`;
            return (
              <li key={s.key}>
                <NavLink
                  to={path}
                  end={path === "/"}
                  title={collapsed ? s.label : undefined}
                  className={({ isActive }) => cn(
                    "group flex items-center gap-3 rounded-lg px-3 h-10 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-colors",
                    isActive && "sidebar-active"
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                  {!collapsed && <span className="truncate">{s.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Favorites */}
        {favTools.length > 0 && (
          <div>
            {!collapsed && <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Pinned</div>}
            <ul className="space-y-0.5">
              {favTools.slice(0, 8).map(t => {
                const Icon = t.icon;
                return (
                  <li key={t.id}>
                    <NavLink
                      to={t.path}
                      title={collapsed ? t.name : undefined}
                      className={({ isActive }) => cn(
                        "group flex items-center gap-3 rounded-lg px-3 h-9 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-colors",
                        isActive && "sidebar-active"
                      )}
                    >
                      <Icon className="h-[16px] w-[16px] shrink-0" strokeWidth={1.75} />
                      {!collapsed && <span className="truncate">{t.name}</span>}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>

      {/* Collapse */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
