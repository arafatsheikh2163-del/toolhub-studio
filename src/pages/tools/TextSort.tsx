import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";

type Mode = "alpha" | "alpha-desc" | "natural" | "length" | "reverse" | "shuffle" | "dedupe";

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "alpha",     label: "A → Z" },
  { id: "alpha-desc",label: "Z → A" },
  { id: "natural",   label: "Numeric" },
  { id: "length",    label: "By length" },
  { id: "reverse",   label: "Reverse" },
  { id: "shuffle",   label: "Shuffle" },
  { id: "dedupe",    label: "Deduplicate" },
];

function process(text: string, mode: Mode): string {
  const lines = text.split(/\r?\n/);
  const cmp = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
  switch (mode) {
    case "alpha":      return [...lines].sort((a,b) => a.localeCompare(b)).join("\n");
    case "alpha-desc": return [...lines].sort((a,b) => b.localeCompare(a)).join("\n");
    case "natural":    return [...lines].sort(cmp.compare).join("\n");
    case "length":     return [...lines].sort((a,b) => a.length - b.length).join("\n");
    case "reverse":    return [...lines].reverse().join("\n");
    case "shuffle":    {
      const arr = [...lines];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.join("\n");
    }
    case "dedupe":     return Array.from(new Set(lines)).join("\n");
  }
}

export default function TextSort() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("alpha");
  const [tick, setTick] = useState(0);
  const output = process(text, mode);
  // shuffle requires re-derive on click; "tick" forces re-render
  void tick;

  return (
    <ToolWorkspace toolId="text-sort" actions={
      <>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={output} />
      </>
    }>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); setTick(t => t + 1); }}
              className={`btn-pill !py-1.5 !px-3 text-xs ${mode === m.id ? "btn-primary" : "btn-secondary"}`}>{m.label}</button>
          ))}
        </div>
        <SplitPanel
          left={<>
            <PanelLabel hint={`${text.split(/\r?\n/).length} lines`}>Input</PanelLabel>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="One item per line…"
              className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
          </>}
          right={<>
            <PanelLabel hint={`${output.split(/\r?\n/).length} lines`}>Sorted</PanelLabel>
            <pre className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto">{output || <span className="text-muted-foreground/60">Output will appear here.</span>}</pre>
          </>}
        />
      </div>
    </ToolWorkspace>
  );
}
