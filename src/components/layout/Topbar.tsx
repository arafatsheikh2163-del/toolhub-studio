import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Sun, Moon, Command } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { cn } from "@/lib/utils";

export function Topbar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = q.trim()
    ? TOOLS.filter(t => {
        const hay = `${t.name} ${t.description} ${(t.keywords ?? []).join(" ")}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      }).slice(0, 6)
    : [];

  const toggleTheme = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-white/[0.06] flex items-center gap-3 px-5">
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <div className={cn(
          "flex items-center h-10 rounded-md recess px-4 gap-3 transition-all duration-250 ease-out-expo",
          open && "ring-1 ring-white/40 border-white/30"
        )}>
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder="Search tools…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded-sm bg-white/[0.04] border border-white/[0.10]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>

        {open && q.trim() && (
          <div className="absolute left-0 right-0 mt-2 glass-strong rounded-lg p-1.5 shadow-elev-lg animate-fade-in z-50">
            {results.length === 0 ? (
              <div className="text-xs text-muted-foreground px-3 py-3">No tools match "{q}"</div>
            ) : (
              <ul className="space-y-0.5">
                {results.map(t => {
                  const Icon = t.icon;
                  return (
                    <li key={t.id}>
                      <button
                        onMouseDown={(e) => { e.preventDefault(); navigate(t.path); setQ(""); setOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left hover:bg-white/[0.05] transition-colors"
                      >
                        <div className="h-8 w-8 grid place-items-center rounded-md bg-white/[0.04] border border-white/[0.10]">
                          <Icon className="h-4 w-4 text-foreground" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{t.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{t.description}</div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Right actions */}
      <button
        onClick={toggleTheme}
        className="relative h-9 w-9 grid place-items-center rounded-md glass-alt hover:bg-white/[0.08] transition-colors focus-ring"
        aria-label="Toggle theme"
        title="Theme"
      >
        {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </button>

      <button
        className="relative h-9 w-9 grid place-items-center rounded-md glass-alt hover:bg-white/[0.08] transition-colors focus-ring"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-foreground animate-glow-pulse" />
      </button>

      <button
        className="h-9 w-9 rounded-md bg-foreground text-background grid place-items-center text-xs font-mono font-bold focus-ring"
        title="Account"
        aria-label="Account"
      >
        TH
      </button>
    </header>
  );
}
