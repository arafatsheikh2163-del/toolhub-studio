import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { RefreshCw, X, Plus, GripVertical, AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      <motion.button whileTap={{ scale: 0.95 }} onClick={refreshAll} className="btn-3d-light text-xs !px-3.5 !py-2">
        <RefreshCw className="h-3.5 w-3.5" />Refresh all
      </motion.button>
    }>
      <div className="space-y-5">
        {/* Add URL */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[260px] flex items-center h-10 rounded-full surface-soft border border-border px-4 gap-3 focus-within:ring-2 focus-within:ring-foreground/15">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <input
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addTab(); }}
              placeholder="Add a URL — e.g. example.com"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
            />
            <button onClick={addTab} className="btn-3d text-xs !py-1.5 !px-3">Add</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {LAYOUTS.map(l => (
              <motion.button key={l.id} whileTap={{ scale: 0.92 }} onClick={() => setLayout(l)}
                className={cn("h-8 px-3 rounded-full text-xs font-medium transition-all",
                  layout.id === l.id ? "bg-foreground text-background" : "surface-soft text-foreground/70 hover:text-foreground")}>
                {l.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {visibleTabs.length === 0 ? (
          <div className="rounded-2xl surface-soft p-12 text-center">
            <div className="text-sm text-muted-foreground">Add URLs above to start comparing.</div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${layout.rows}, minmax(280px, 1fr))`,
            }}
          >
            <AnimatePresence>
              {visibleTabs.map(tab => (
                <motion.div
                  key={tab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 240, damping: 24 }}
                  draggable
                  onDragStart={() => setDragId(tab.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(tab.id)}
                  className={cn(
                    "relative bg-card rounded-2xl overflow-hidden flex flex-col border border-border shadow-sm transition-shadow hover:shadow-md",
                    dragId === tab.id && "ring-2 ring-foreground/30 opacity-70"
                  )}
                >
                  <div className="flex items-center gap-2 px-2.5 py-2 border-b border-border bg-surface-soft">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab shrink-0" />
                    <input
                      value={tab.url}
                      onChange={(e) => updateUrl(tab.id, e.target.value)}
                      onBlur={() => refreshTab(tab.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
                      placeholder="https://…"
                      className="flex-1 bg-transparent outline-none text-xs font-mono text-foreground/90 placeholder:text-muted-foreground/60 min-w-0"
                    />
                    <button onClick={() => refreshTab(tab.id)} className="h-6 w-6 grid place-items-center rounded-md hover:bg-foreground/5" title="Refresh">
                      <RefreshCw className="h-3 w-3" />
                    </button>
                    <button onClick={() => removeTab(tab.id)} className="h-6 w-6 grid place-items-center rounded-md hover:bg-foreground/5" title="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="relative flex-1 bg-white">
                    {tab.url ? <Frame url={tab.url} k={tab.key} /> : (
                      <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">Empty frame</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="flex items-start gap-2 rounded-xl border border-border surface-warm p-3 text-[11px] text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Some sites (Google, GitHub, banks) block iframe embedding. We auto-detect and offer a clear "Open in new tab" button for those.</span>
        </div>
      </div>
    </ToolWorkspace>
  );
}

function Frame({ url, k }: { url: string; k: number }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "blocked">("loading");
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setStatus("loading");
    // If onLoad never fires within 6s, assume blocked. Cross-origin iframes that
    // load successfully still trigger onLoad even if we can't read their content.
    const t = window.setTimeout(() => {
      setStatus(curr => curr === "loading" ? "blocked" : curr);
    }, 6000);
    return () => clearTimeout(t);
  }, [url, k]);

  return (
    <>
      <iframe
        key={k}
        ref={ref}
        src={url}
        title={url}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("blocked")}
        className="w-full h-full"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <AnimatePresence>
        {status === "loading" && (
          <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-sm pointer-events-none">
            <div className="h-6 w-6 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
          </motion.div>
        )}
        {status === "blocked" && (
          <motion.div key="b" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center bg-card p-6 text-center">
            <div className="space-y-3 max-w-xs">
              <div className="mx-auto h-12 w-12 rounded-2xl surface-warm grid place-items-center border border-border">
                <ShieldAlert className="h-5 w-5 text-foreground/70" />
              </div>
              <div className="text-sm font-semibold">This site blocks embedding</div>
              <div className="text-[11px] text-muted-foreground break-all">{new URL(url).hostname} sets X-Frame-Options or CSP, so it can't be shown in this frame.</div>
              <a href={url} target="_blank" rel="noreferrer" className="btn-3d text-xs !px-3.5 !py-2 inline-flex">
                <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
