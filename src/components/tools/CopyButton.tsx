import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { copyToClipboard } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
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
      className={cn("btn-3d-light text-xs !px-3.5 !py-2 disabled:opacity-50 disabled:pointer-events-none", className)}
    >
      <span className="relative inline-block w-3.5 h-3.5">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span key="ok" initial={{ opacity: 0, scale: 0.4, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0)" }} exit={{ opacity: 0, scale: 0.4 }} transition={{ duration: 0.18 }} className="absolute inset-0">
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          ) : (
            <motion.span key="cp" initial={{ opacity: 0, scale: 0.4, filter: "blur(4px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0)" }} exit={{ opacity: 0, scale: 0.4 }} transition={{ duration: 0.18 }} className="absolute inset-0">
              <Copy className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span>{done ? "Copied" : label}</span>
    </motion.button>
  );
}
