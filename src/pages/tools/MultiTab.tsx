import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { RefreshCw, X, Plus, GripVertical, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Tab { id: string; url: string; key: number; }

const LAYOUTS = [
  { id: "1x1", label: "1×1", cols: 1, rows: 1, max: 1 },
  { id: "2x1", label: "2×1", cols: 2, rows: 1, max: 2 },
  { id: "2x2", label: "2×2", cols: 2, rows: 2, max: 4 },
  { id: "3x3", label: "3×3", cols: 3, rows: 3, max: 9 },
  { id: "4x4", label: "4×4", cols: 4, rows: 4, max: 16 },
] as const;

const SUGGESTIONS = [
  "https://lovable.dev",
  "https://vercel.com",
  "https://linear.app",
  "https://stripe.com",
];

let counter = 0;
const newTab = (url = ""): Tab => ({ id: `t-${++counter}`, url, key: 0 });

export default function MultiTab() {
  const [tabs, setTabs] = useState<Tab[]>(SUGGESTIONS.map(newTab));
  const [layout, setLayout] = useState<typeof LAYOUTS[number]>(LAYOUTS[2]);
  const [draftUrl, setDraftUrl] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const visibleTabs = tabs.slice(0, layout.max);

  const addTab = () => {
    const u = draftUrl.trim();
    if (!u) return;
    let url = u;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    setTabs(t => [...t, newTab(url)]);
    setDraftUrl("");
  };
  const removeTab = (id: string) => setTabs(t => t.filter(x => x.id !== id));
  const refreshTab = (id: string) => setTabs(t => t.map(x => x.id === id ? { ...x, key: x.key + 1 } : x));
  const refreshAll = () => { setTabs(t => t.map(x => ({ ...x, key: x.key + 1 }))); toast.success("Refreshed all frames"); };
  const updateUrl = (id: string, url: string) => setTabs(t => t.map(x => x.id === id ? { ...x, url } : x));

  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setTabs(t => {
      const a = t.findIndex(x => x.id === dragId);
      const b = t.findIndex(x => x.id === targetId);
      if (a < 0 || b < 0) return t;
      const next = [...t];
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setDragId(null);
  };

  return (
    <ToolWorkspace toolId="multi-tab" actions={
      <>
        <button onClick={refreshAll} className="btn-pill btn-secondary !py-1.5"><RefreshCw className="h-3.5 w-3.5" />Refresh all</button>
      </>
    }>
      <div className="space-y-5">
        {/* Add URL */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[260px] flex items-center h-10 rounded-full recess px-4 gap-3 focus-within:ring-1 focus-within:ring-primary/50">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <input
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addTab(); }}
              placeholder="Add a URL — e.g. example.com"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
            />
            <button onClick={addTab} className="btn-pill btn-primary !py-1 !px-3 text-xs">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {LAYOUTS.map(l => (
              <button key={l.id} onClick={() => setLayout(l)}
                className={`btn-pill !py-1.5 !px-3 text-xs ${layout.id === l.id ? "btn-primary" : "btn-secondary"}`}>{l.label}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {visibleTabs.length === 0 ? (
          <div className="rounded-2xl glass p-12 text-center">
            <div className="text-sm text-muted-foreground">Add URLs above to start comparing.</div>
          </div>
        ) : (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${layout.rows}, minmax(280px, 1fr))`,
            }}
          >
            {visibleTabs.map(tab => (
              <div
                key={tab.id}
                draggable
                onDragStart={() => setDragId(tab.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(tab.id)}
                className={cn(
                  "relative recess rounded-2xl overflow-hidden flex flex-col transition-all",
                  dragId === tab.id && "ring-1 ring-primary/50 opacity-70"
                )}
              >
                <div className="flex items-center gap-2 px-2.5 py-2 border-b border-white/[0.06] bg-black/40">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab shrink-0" />
                  <input
                    value={tab.url}
                    onChange={(e) => updateUrl(tab.id, e.target.value)}
                    onBlur={() => refreshTab(tab.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                    placeholder="https://…"
                    className="flex-1 bg-transparent outline-none text-xs font-mono text-foreground/90 placeholder:text-muted-foreground/60 min-w-0"
                  />
                  <button onClick={() => refreshTab(tab.id)} className="h-6 w-6 grid place-items-center rounded-md hover:bg-white/[0.06]" title="Refresh">
                    <RefreshCw className="h-3 w-3" />
                  </button>
                  <button onClick={() => removeTab(tab.id)} className="h-6 w-6 grid place-items-center rounded-md hover:bg-white/[0.06]" title="Remove">
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="relative flex-1 bg-white">
                  {tab.url ? (
                    <iframe
                      key={tab.key}
                      src={tab.url}
                      title={tab.url}
                      className="w-full h-full"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">Empty frame</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2 rounded-xl border border-warning/20 bg-warning/5 p-3 text-[11px] text-warning/90 font-mono">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Some sites (Google, GitHub, banks) block iframe embedding via X-Frame-Options or CSP. Those frames will appear blank.</span>
        </div>
      </div>
    </ToolWorkspace>
  );
}
