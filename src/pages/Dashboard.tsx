import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { TOOLS, NEW_TOOLS, POPULAR_TOOLS, type ToolCategory } from "@/data/tools";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolsCarousel } from "@/components/tools/ToolsCarousel";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const FILTERS: Array<{ key: ToolCategory | "all" | "favorites"; label: string }> = [
  { key: "all",       label: "All" },
  { key: "favorites", label: "Pinned" },
  { key: "text",      label: "Text" },
  { key: "image",     label: "Image" },
  { key: "developer", label: "Developer" },
  { key: "pdf",       label: "PDF" },
  { key: "utility",   label: "Utilities" },
  { key: "converter", label: "Converters" },
  { key: "generator", label: "Generators" },
  { key: "security",  label: "Security" },
  { key: "creative",  label: "Studio" },
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

  const featured = useMemo(() => {
    // a curated set for the top carousel
    const ids = ["multi-tab","password-gen","pdf-merge","image-compress","qr-gen","webcam-capture","encrypt","color-picker","tts","gradient-gen","json-format","image-watermark"];
    return ids.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as typeof TOOLS;
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero — clean editorial */}
      <section className="space-y-5">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-balance leading-[1.05]">
          A quiet workspace for everyday tools.
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          {TOOLS.length} precision utilities — text, images, code, PDFs — all running locally in your browser.
        </p>

        {/* Search */}
        <div className="relative max-w-2xl">
          <div className="flex items-center h-12 rounded-xl bg-card border border-border px-4 gap-3 shadow-sm focus-within:ring-2 focus-within:ring-foreground/15">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search any tool — try 'pdf', 'json', 'compress'…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            {q && <button onClick={() => setQ("")} className="text-[11px] text-muted-foreground hover:text-foreground">Clear</button>}
          </div>
        </div>
      </section>

      {/* Featured carousel — ElevenLabs style */}
      {!q && <ToolsCarousel title="Featured tools" subtitle="Hand-picked workflows used most this week" tools={featured} />}

      {/* New row */}
      {!q && NEW_TOOLS.length > 0 && (
        <ToolsCarousel title="Recently added" subtitle="Fresh capabilities — try them out" tools={NEW_TOOLS} />
      )}

      {/* Popular row */}
      {!q && POPULAR_TOOLS.length > 0 && (
        <ToolsCarousel title="Most popular" tools={POPULAR_TOOLS} />
      )}

      {/* All tools section */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">All tools</h2>
            <p className="text-sm text-muted-foreground mt-1">{tools.length} of {TOOLS.length} — filter by category</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-8 px-3.5 rounded-full text-xs font-medium transition-all",
                filter === f.key
                  ? "bg-foreground text-background"
                  : "surface-soft text-foreground/70 hover:text-foreground hover:bg-accent"
              )}
            >
              {f.label}
              {f.key !== "all" && f.key !== "favorites" && (
                <span className="ml-1.5 text-[10px] opacity-60">{TOOLS.filter(t => t.category === f.key).length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Featured CTA */}
        {filter === "all" && !q && <FlagshipCard />}

        {/* Grid */}
        {tools.length === 0 ? (
          <EmptyState query={q} filter={filter} />
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map(t => <ToolCard key={t.id} tool={t} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function FlagshipCard() {
  return (
    <Link to="/tools/multi-tab" className="block card-featured rounded-2xl p-6 sm:p-7 group hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Flagship
          </div>
          <h3 className="text-2xl font-semibold tracking-tight">Multi-tab Viewer — compare any sites side-by-side.</h3>
          <p className="text-sm text-muted-foreground">Drop in URLs, switch grid layouts (1×1 → 4×4), refresh individually.</p>
        </div>
        <span className="btn-3d shrink-0 group-hover:-translate-y-1 transition-transform">Open Viewer →</span>
      </div>
    </Link>
  );
}

function EmptyState({ query, filter }: { query: string; filter: string }) {
  return (
    <div className="rounded-2xl surface-soft p-12 text-center">
      <div className="mx-auto h-12 w-12 rounded-xl bg-card border border-border grid place-items-center mb-3 shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-semibold">No tools found</div>
      <div className="text-xs text-muted-foreground mt-1">
        {filter === "favorites" ? "Star a tool to pin it here." : `Nothing matched "${query}".`}
      </div>
    </div>
  );
}
