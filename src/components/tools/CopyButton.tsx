import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { copyToClipboard } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        const ok = await copyToClipboard(text);
        if (ok) {
          setDone(true);
          toast.success("Copied to clipboard");
          setTimeout(() => setDone(false), 1400);
        } else {
          toast.error("Copy failed");
        }
      }}
      disabled={!text}
      className={cn("btn-pill btn-secondary disabled:opacity-50 disabled:pointer-events-none", className)}
    >
      <span className="relative inline-block w-3.5 h-3.5">
        <Copy className={cn("absolute inset-0 h-3.5 w-3.5 transition-all duration-200", done ? "opacity-0 scale-50" : "opacity-100 scale-100")} />
        <Check className={cn("absolute inset-0 h-3.5 w-3.5 text-primary transition-all duration-200", done ? "opacity-100 scale-100" : "opacity-0 scale-50")} />
      </span>
      {done ? "Copied" : label}
    </button>
  );
}
