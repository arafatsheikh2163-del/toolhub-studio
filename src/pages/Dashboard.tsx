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
      <section className="relative overflow-hidden rounded-lg glass p-8 sm:p-12 border border-white/[0.10]">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent pointer-events-none" />

        <div className="relative flex flex-col gap-6">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
            <span className="inline-block h-px w-6 bg-foreground/40" /> Index № 001 — Welcome back
          </div>
          <h1 className="text-4xl sm:text-6xl font-medium tracking-[-0.04em] text-balance leading-[0.98]">
            A <em className="not-italic underline decoration-foreground/30 underline-offset-[6px] decoration-1">precision</em> toolkit<br className="hidden sm:block" /> for everything in the browser.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            {TOOLS.length} client-side tools for text, images, developers, PDFs and live web previews.
            Nothing ever leaves your device.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-4 border border-white/[0.10] bg-white/[0.06] rounded-md overflow-hidden">
            {[
              { icon: Zap,     k: "Tools", v: TOOLS.length },
              { icon: Shield,  k: "Privacy", v: "100%" },
              { icon: Sparkles, k: "Saved",   v: favorites.length },
              { icon: Sparkles, k: "Latency", v: "0ms" },
            ].map((s, i) => (
              <div key={i} className="bg-background px-4 py-4">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
                  <s.icon className="h-3 w-3 text-foreground" strokeWidth={1.75} /> {s.k}
                </div>
                <div className="text-2xl font-medium tabular-nums mt-1 tracking-tight">{s.v}</div>
              </div>
            ))}
          </div>

          {/* Search inside hero */}
          <div className="relative max-w-2xl">
            <div className="flex items-center h-12 rounded-md recess px-5 gap-3 focus-within:ring-1 focus-within:ring-white/40">
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
                "btn-pill !rounded-md !py-1.5 !px-4 text-xs transition-all",
                filter === f.key
                  ? "bg-foreground text-background"
                  : "btn-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
              {f.key !== "all" && f.key !== "favorites" && (
                <span className="ml-1 text-[10px] font-mono opacity-60">
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
    <div className="relative overflow-hidden rounded-lg border border-white/[0.12] bg-foreground text-background p-6 sm:p-7">
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="space-y-1.5 max-w-xl">
          <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-background/60">— Flagship / Multi-tab Viewer</div>
          <h2 className="text-2xl font-medium tracking-tight">Compare any sites side-by-side, live.</h2>
          <p className="text-sm text-background/70">Drop in URLs, switch grid layouts (1×1 → 4×4), drag to reorder, refresh individually.</p>
        </div>
        <a href="/tools/multi-tab" className="btn-pill !rounded-md shrink-0 bg-background text-foreground hover:bg-background/90 px-4 py-2 font-medium">Open Viewer →</a>
      </div>
    </div>
  );
}

function EmptyState({ query, filter }: { query: string; filter: string }) {
  return (
    <div className="rounded-lg glass p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-md bg-white/[0.04] border border-white/[0.10] grid place-items-center mb-3">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium">No tools found</div>
      <div className="text-xs text-muted-foreground mt-1">
        {filter === "favorites" ? "Star a tool from the dashboard to pin it here." : `Nothing matched "${query}". Try another keyword.`}
      </div>
    </div>
  );
}
