import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Moon, Sun, Command, PanelLeft } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { cn } from "@/lib/utils";

export function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) && !["INPUT","TEXTAREA"].includes(document.activeElement?.tagName ?? "")) {
        e.preventDefault(); inputRef.current?.focus();
      }
      if (e.key === "Escape") { inputRef.current?.blur(); setOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = q.trim()
    ? TOOLS.filter(t => `${t.name} ${t.description} ${(t.keywords ?? []).join(" ")}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/85 backdrop-blur-xl border-b border-border flex items-center gap-3 px-5">
      <button onClick={onToggleSidebar} className="md:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-accent" aria-label="Menu">
        <PanelLeft className="h-4.5 w-4.5" />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-2xl">
        <div className={cn(
          "flex items-center h-10 rounded-xl surface-soft border px-4 gap-3 transition-all duration-250 ease-out-expo",
          open && "ring-2 ring-foreground/15 border-foreground/20 bg-card"
        )}>
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search tools, formats, actions…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/80"
          />
          <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded-md bg-card border border-border">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>

        {open && q.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-card rounded-xl p-1.5 shadow-lg border border-border animate-fade-in z-50">
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
                        className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left hover:bg-accent transition-colors"
                      >
                        <div className="h-8 w-8 grid place-items-center rounded-lg surface-soft border">
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

      <button
        onClick={() => { document.documentElement.classList.toggle("dark"); setDark(d => !d); }}
        className="h-9 w-9 grid place-items-center rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition-colors focus-ring"
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <button className="relative h-9 w-9 grid place-items-center rounded-lg hover:bg-accent text-foreground/80 hover:text-foreground transition-colors focus-ring" aria-label="Notifications">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-foreground" />
      </button>

      <button
        className="relative h-9 w-9 grid place-items-center rounded-full text-xs font-bold focus-ring bg-foreground text-background"
        title="Account"
      >
        TH
      </button>
    </header>
  );
}
