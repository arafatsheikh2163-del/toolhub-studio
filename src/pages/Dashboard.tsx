import { useMemo, useState } from "react";
import { Search, Sparkles, Zap, Shield } from "lucide-react";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ key: ToolCategory | "all" | "favorites"; label: string }> = [
  { key: "all",       label: "All Tools" },
  { key: "favorites", label: "Favorites" },
  { key: "text",      label: "Text" },
  { key: "image",     label: "Image" },
  { key: "developer", label: "Developer" },
  { key: "pdf",       label: "PDF" },
  { key: "viewer",    label: "Viewer" },
];

export default function Dashboard() {
  const [filter, setFilter] = useState<typeof FILTERS[number]["key"]>("all");
  const [q, setQ] = useState("");
  const { favorites } = useFavorites();

  const tools = useMemo(() => {
    let list = TOOLS;
    if (filter === "favorites") list = list.filter(t => favorites.includes(t.id));
    else if (filter !== "all") list = list.filter(t => t.category === filter);
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(t => `${t.name} ${t.description} ${(t.keywords ?? []).join(" ")}`.toLowerCase().includes(needle));
    }
    return list;
  }, [filter, q, favorites]);

  const flagship = TOOLS.find(t => t.flagship);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass p-8 sm:p-10">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Welcome back
          </div>
          <h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-balance leading-[1.05]">
            Your <span className="text-gradient-brand">precision toolkit</span><br className="hidden sm:block" /> for everything in the browser.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl text-pretty">
            {TOOLS.length} client-side tools for text, images, developers, PDFs and live web previews.
            Nothing ever leaves your device.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
            {[
              { icon: Zap,     k: "Tools", v: TOOLS.length },
              { icon: Shield,  k: "Privacy", v: "100%" },
              { icon: Sparkles, k: "Saved",   v: favorites.length },
              { icon: Sparkles, k: "Latency", v: "0ms" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl glass-alt px-4 py-3">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                  <s.icon className="h-3 w-3 text-primary" /> {s.k}
                </div>
                <div className="text-xl font-medium tabular-nums mt-1">{s.v}</div>
              </div>
            ))}
          </div>

          {/* Search inside hero */}
          <div className="relative max-w-2xl">
            <div className="flex items-center h-12 rounded-full recess px-5 gap-3 focus-within:ring-1 focus-within:ring-primary/50">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter tools — try 'json', 'compress', 'viewer'…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/70"
              />
              {q && (
                <button onClick={() => setQ("")} className="text-[11px] text-muted-foreground hover:text-foreground">Clear</button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "btn-pill !py-1.5 !px-4 text-xs transition-all",
                filter === f.key
                  ? "bg-gradient-brand text-white shadow-glow-cyan"
                  : "btn-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              {f.key !== "all" && f.key !== "favorites" && (
                <span className="ml-1 text-[10px] font-mono opacity-70">
                  {TOOLS.filter(t => t.category === f.key).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Flagship banner */}
        {filter === "all" && flagship && !q && (
          <FlagshipPromo />
        )}

        {/* Tool grid */}
        {tools.length === 0 ? (
          <EmptyState query={q} filter={filter} />
        ) : (
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function FlagshipPromo() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-brand-soft p-6 sm:p-7">
      <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="space-y-1.5 max-w-xl">
          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-primary">Flagship · Multi-tab Viewer</div>
          <h2 className="text-xl font-medium tracking-tight">Compare any sites side-by-side, live.</h2>
          <p className="text-sm text-muted-foreground">Drop in URLs, switch grid layouts (1×1 → 4×4), drag to reorder, refresh individually.</p>
        </div>
        <a href="/tools/multi-tab" className="btn-pill btn-primary shrink-0">Open Viewer →</a>
      </div>
    </div>
  );
}

function EmptyState({ query, filter }: { query: string; filter: string }) {
  return (
    <div className="rounded-2xl glass p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] grid place-items-center mb-3">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium">No tools found</div>
      <div className="text-xs text-muted-foreground mt-1">
        {filter === "favorites" ? "Star a tool from the dashboard to pin it here." : `Nothing matched "${query}". Try another keyword.`}
      </div>
    </div>
  );
}
