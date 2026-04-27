import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import type { Tool } from "@/data/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const CAT_LABEL: Record<Tool["category"], string> = {
  text: "Text", image: "Image", developer: "Dev", pdf: "PDF", viewer: "Viewer",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(tool.id);

  return (
    <Link
      to={tool.path}
      className={cn(
        "group relative flex flex-col gap-4 p-5 rounded-2xl glass card-hover overflow-hidden",
        tool.flagship && "ring-1 ring-primary/30 bg-gradient-brand-soft"
      )}
    >
      {/* Decorative ambient sheen */}
      <div className="pointer-events-none absolute -top-20 -right-16 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] grid place-items-center group-hover:bg-gradient-brand group-hover:border-transparent transition-all duration-250 ease-out-expo">
          <Icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-1.5">
          {tool.flagship && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">FLAGSHIP</span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{CAT_LABEL[tool.category]}</span>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(tool.id); }}
            className="h-7 w-7 grid place-items-center rounded-full hover:bg-white/[0.06] transition-colors"
            aria-label={fav ? "Unfavorite" : "Favorite"}
            title={fav ? "Unfavorite" : "Favorite"}
          >
            <Star className={cn("h-3.5 w-3.5 transition-colors", fav ? "fill-primary text-primary" : "text-muted-foreground")} />
          </button>
        </div>
      </div>

      <div className="space-y-1 min-w-0">
        <h3 className="text-base font-medium tracking-tight text-foreground">{tool.name}</h3>
        <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{tool.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="btn-pill btn-secondary !py-1.5 !px-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-250 ease-out-expo">
          Open Tool
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
        <span className="text-[11px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">→</span>
      </div>
    </Link>
  );
}
