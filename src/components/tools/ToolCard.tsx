import { Link } from "react-router-dom";
import { ArrowUpRight, Star } from "lucide-react";
import type { Tool } from "@/data/tools";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const CAT_LABEL: Record<Tool["category"], string> = {
  text: "Text", image: "Image", developer: "Dev", pdf: "PDF", viewer: "Viewer",
  utility: "Util", converter: "Conv", generator: "Gen", security: "Sec", creative: "Lab",
};

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(tool.id);

  return (
    <Link
      to={tool.path}
      className={cn(
        "group relative flex flex-col gap-4 p-5 card-3d overflow-hidden",
        tool.flagship && "ring-1 ring-white/30"
      )}
    >
      {/* Hairline corner accent */}
      <div className="pointer-events-none absolute top-0 right-0 h-px w-12 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="pointer-events-none absolute top-0 right-0 w-px h-12 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between">
        <div className={cn("h-12 w-12 grid place-items-center", tool.flagship ? "icon-tile-3d-light" : "icon-tile-3d")}>
          <Icon className={cn("h-5 w-5 relative z-10", tool.flagship ? "text-background" : "text-foreground drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]")} strokeWidth={1.75} />
        </div>
        <div className="flex items-center gap-1.5">
          {tool.flagship && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-foreground text-background font-semibold tracking-wider">FLAGSHIP</span>
          )}
          <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">/{CAT_LABEL[tool.category]}</span>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(tool.id); }}
            className="h-7 w-7 grid place-items-center rounded-md hover:bg-white/[0.06] transition-colors"
            aria-label={fav ? "Unfavorite" : "Favorite"}
            title={fav ? "Unfavorite" : "Favorite"}
          >
            <Star className={cn("h-3.5 w-3.5 transition-colors", fav ? "fill-foreground text-foreground" : "text-muted-foreground")} />
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
