import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";
import { useDebounced } from "@/hooks/useDebounced";

export default function TextCounter() {
  const [text, setText] = useState("");
  const debounced = useDebounced(text, 80);

  const stats = useMemo(() => {
    const t = debounced;
    const chars = t.length;
    const charsNoSpace = t.replace(/\s/g, "").length;
    const words = (t.trim().match(/\b[\w'-]+\b/g) ?? []).length;
    const sentences = (t.match(/[^.!?]+[.!?]+/g) ?? []).length || (t.trim() ? 1 : 0);
    const paragraphs = t.split(/\n\s*\n/).filter(Boolean).length;
    const lines = t.split(/\r?\n/).length;
    const reading = Math.max(0, Math.ceil(words / 220));
    const speaking = Math.max(0, Math.ceil(words / 130));
    return { chars, charsNoSpace, words, sentences, paragraphs, lines, reading, speaking };
  }, [debounced]);

  const items = [
    { k: "Characters", v: stats.chars },
    { k: "No spaces",  v: stats.charsNoSpace },
    { k: "Words",      v: stats.words },
    { k: "Sentences",  v: stats.sentences },
    { k: "Paragraphs", v: stats.paragraphs },
    { k: "Lines",      v: stats.lines },
    { k: "Reading min",  v: stats.reading },
    { k: "Speaking min", v: stats.speaking },
  ];

  return (
    <ToolWorkspace toolId="text-counter" actions={
      <>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={text} />
      </>
    }>
      <div className="space-y-4">
        <div>
          <PanelLabel hint={`${stats.chars} chars`}>Input</PanelLabel>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing or paste text…"
            className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map(it => (
            <div key={it.k} className="rounded-xl glass-alt px-4 py-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground">{it.k}</div>
              <div className="text-2xl font-medium tabular-nums mt-1">{it.v}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolWorkspace>
  );
}
