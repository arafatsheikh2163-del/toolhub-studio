import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, Search, Lightbulb, Languages } from "lucide-react";
import { LANGUAGES, getGuide, type LangCode } from "@/data/toolGuides";
import { cn } from "@/lib/utils";

const KEY = "toolhub.guideLang";

function useLang(): [LangCode, (l: LangCode) => void] {
  const [lang, setLang] = useState<LangCode>(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem(KEY) as LangCode | null;
    if (saved && LANGUAGES.some(l => l.code === saved)) return saved;
    const nav = navigator.language?.slice(0, 2);
    const match = LANGUAGES.find(l => l.code === nav);
    return (match?.code as LangCode) ?? "en";
  });
  useEffect(() => { localStorage.setItem(KEY, lang); }, [lang]);
  return [lang, setLang];
}

export function ToolGuide({ toolId }: { toolId: string }) {
  const [lang, setLang] = useLang();
  const guide = getGuide(toolId, lang);
  const meta = LANGUAGES.find(l => l.code === lang)!;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm"
      dir={meta.rtl ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg surface-soft border border-border grid place-items-center">
            <BookOpen className="h-4 w-4 text-foreground/70" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">How it works</div>
            <div className="text-[11px] text-muted-foreground">Step-by-step guide</div>
          </div>
        </div>
        <LangPicker lang={lang} onChange={setLang} />
      </div>

      <ol className="space-y-2.5">
        {guide.steps.map((s, i) => (
          <motion.li
            key={`${lang}-${i}`}
            initial={{ opacity: 0, x: meta.rtl ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="flex gap-3 items-start"
          >
            <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-foreground text-background text-[11px] font-semibold grid place-items-center tabular-nums">{i + 1}</span>
            <span className="text-sm text-foreground/85 leading-relaxed">{s}</span>
          </motion.li>
        ))}
      </ol>

      {guide.tips && guide.tips.length > 0 && (
        <div className="mt-5 rounded-xl surface-warm border border-border p-3.5 flex gap-2.5 items-start">
          <Lightbulb className="h-4 w-4 mt-0.5 text-foreground/70 shrink-0" />
          <ul className="text-xs text-foreground/75 space-y-1 leading-relaxed">
            {guide.tips.map((t, i) => <li key={i}>· {t}</li>)}
          </ul>
        </div>
      )}
    </motion.section>
  );
}

function LangPicker({ lang, onChange }: { lang: LangCode; onChange: (l: LangCode) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const meta = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return LANGUAGES;
    return LANGUAGES.filter(l => `${l.label} ${l.native} ${l.code}`.toLowerCase().includes(n));
  }, [q]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-3d-light text-xs !px-3 !py-2 inline-flex items-center gap-2"
      >
        <Languages className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{meta.native}</span>
        <span className="sm:hidden uppercase">{meta.code}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-64 rounded-xl bg-card border border-border shadow-lg z-20 overflow-hidden"
          >
            <div className="p-2 border-b border-border flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search language…"
                className="flex-1 bg-transparent outline-none text-xs placeholder:text-muted-foreground"
              />
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {filtered.map(l => (
                <button
                  key={l.code}
                  onClick={() => { onChange(l.code as LangCode); setOpen(false); setQ(""); }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-2 hover:bg-foreground/5 transition-colors",
                    l.code === lang && "bg-foreground/5 font-semibold"
                  )}
                >
                  <span>{l.native}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{l.code}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-center text-xs text-muted-foreground">No matches</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
