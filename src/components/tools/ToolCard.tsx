import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import { ACCENT_BG, type Tool } from "@/data/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  const Icon = tool.icon;
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(tool.id);
  const accent = tool.accent ?? "stone";
  const isInk = accent === "ink";

  return (
    <Link
      to={tool.path}
      className={cn(
        "group relative flex flex-col gap-4 p-5 card-soft overflow-hidden",
        compact && "p-4 gap-3"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn("h-14 w-14 rounded-2xl grid place-items-center shadow-sm border border-border shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-2deg]")}
          style={{ background: ACCENT_BG[accent] }}
        >
          <Icon className={cn("h-6 w-6", isInk ? "text-white" : "text-foreground")} strokeWidth={1.6} />
        </div>
        <div className="flex items-center gap-1">
          {tool.isNew && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-foreground text-background">NEW</span>}
          {tool.flagship && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-foreground text-background">FLAGSHIP</span>}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(tool.id); }}
            className="h-7 w-7 grid place-items-center rounded-md hover:bg-accent transition-colors"
            aria-label={fav ? "Unfavorite" : "Favorite"}
          >
            <Star className={cn("h-3.5 w-3.5 transition-colors", fav ? "fill-foreground text-foreground" : "text-muted-foreground")} />
          </button>
        </div>
      </div>

      <div className="space-y-1 min-w-0">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{tool.name}</h3>
        <p className="text-[13px] text-muted-foreground text-pretty line-clamp-2 leading-relaxed">{tool.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[11px] text-muted-foreground">Open →</span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </Link>
  );
}
