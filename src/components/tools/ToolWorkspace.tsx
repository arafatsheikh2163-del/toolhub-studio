import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { getToolById } from "@/data/tools";
import { cn } from "@/lib/utils";

interface Props {
  toolId: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function ToolWorkspace({ toolId, actions, children }: Props) {
  const tool = getToolById(toolId);
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(toolId);
  const loc = useLocation();
  const back = loc.state?.from || "/";

  if (!tool) return null;
  const Icon = tool.icon;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <Link
          to={back}
          className="btn-3d-icon"
          aria-label="Back"
        >
          <ChevronLeft className="h-4 w-4 relative z-10" />
        </Link>

        <div className="h-12 w-12 grid place-items-center icon-tile-3d-light">
          <Icon className="h-5 w-5 text-background relative z-10" strokeWidth={1.75} />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-medium tracking-tight text-balance text-gradient-soft">{tool.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{tool.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggle(toolId)}
            className={cn("btn-3d-dark text-xs !px-3.5 !py-1.5", fav && "!text-foreground")}
            title={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={cn("h-3.5 w-3.5 relative z-10", fav && "fill-foreground")} />
            <span className="hidden sm:inline relative z-10">{fav ? "Saved" : "Save"}</span>
          </button>
          {actions}
        </div>
      </div>

      {/* Body */}
      <div className="rounded-2xl glass p-1.5 shadow-elev-md">
        <div className="rounded-xl bg-black/30 border border-white/[0.04] p-5 sm:p-7">
          {children}
        </div>
      </div>
    </div>
  );
}
