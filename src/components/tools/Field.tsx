import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Field = forwardRef<HTMLLabelElement, { label: string; hint?: string; children: ReactNode; className?: string }>(
  ({ label, hint, children, className }, ref) => (
    <label ref={ref} className={cn("block space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground truncate">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground/80 truncate">{hint}</span>}
      </div>
      {children}
    </label>
  )
);
Field.displayName = "Field";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full h-10 rounded-lg bg-card border border-border px-3 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-colors font-mono text-foreground",
        props.className
      )}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg bg-card border border-border px-3 py-2.5 text-sm outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-colors font-mono text-foreground resize-none",
        props.className
      )}
    />
  );
}

export function Stat({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="rounded-lg surface-soft px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{k}</div>
      <div className="text-base font-semibold tabular-nums mt-0.5 text-foreground truncate">{v}</div>
    </div>
  );
}
