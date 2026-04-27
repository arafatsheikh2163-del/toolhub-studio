import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        {hint && <span className="text-[10px] text-muted-foreground/70">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full h-10 rounded-md bg-black/40 border border-white/[0.10] px-3 text-sm outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors font-mono",
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
        "w-full rounded-md bg-black/40 border border-white/[0.10] px-3 py-2.5 text-sm outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors font-mono resize-none",
        props.className
      )}
    />
  );
}

export function Stat({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="rounded-md bg-white/[0.03] border border-white/[0.08] px-3 py-2">
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">{k}</div>
      <div className="text-base font-medium tabular-nums mt-0.5 text-foreground truncate">{v}</div>
    </div>
  );
}
