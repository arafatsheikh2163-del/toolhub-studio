import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SplitPanel({ left, right, className }: { left: ReactNode; right: ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-4", className)}>
      <div className="min-w-0">{left}</div>
      <div className="min-w-0">{right}</div>
    </div>
  );
}

export function PanelLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between mb-2 px-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{children}</span>
      {hint && <span className="text-[11px] text-muted-foreground tabular-nums">{hint}</span>}
    </div>
  );
}
