import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { ACCENT_BG, getToolById } from "@/data/tools";
import { cn } from "@/lib/utils";
import { ToolGuide } from "./ToolGuide";

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
  const back = (loc.state as any)?.from || "/";

  if (!tool) return null;
  const Icon = tool.icon;
  const accent = tool.accent ?? "stone";
  const isInk = accent === "ink";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <Link to={back} className="btn-3d-icon focus-ring" aria-label="Back">
          <ChevronLeft className="h-4 w-4" />
        </Link>

        <motion.div
          initial={{ scale: 0.7, rotate: -8, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="h-14 w-14 rounded-2xl grid place-items-center shadow-sm border border-border shrink-0"
          style={{ background: ACCENT_BG[accent] }}
        >
          <Icon className={cn("h-6 w-6", isInk ? "text-white" : "text-foreground")} strokeWidth={1.6} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="min-w-0 flex-1"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance">{tool.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => toggle(toolId)}
            className={cn("btn-3d-light text-xs !px-3.5 !py-2", fav && "!text-foreground")}
            title={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star className={cn("h-3.5 w-3.5", fav && "fill-foreground")} />
            <span className="hidden sm:inline">{fav ? "Saved" : "Save"}</span>
          </motion.button>
          {actions}
        </div>
      </div>

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl bg-card border border-border p-5 sm:p-7 shadow-sm"
      >
        {children}
      </motion.div>

      <ToolGuide toolId={toolId} />
    </div>
  );
}
