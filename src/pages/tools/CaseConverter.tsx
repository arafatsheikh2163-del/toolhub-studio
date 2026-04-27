import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";

type Mode = "upper" | "lower" | "title" | "sentence" | "camel" | "snake" | "kebab" | "alt";

const MODES: Array<{ id: Mode; label: string }> = [
  { id: "upper",    label: "UPPER CASE" },
  { id: "lower",    label: "lower case" },
  { id: "title",    label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel",    label: "camelCase" },
  { id: "snake",    label: "snake_case" },
  { id: "kebab",    label: "kebab-case" },
  { id: "alt",      label: "AlTeRnAtInG" },
];

function transform(input: string, mode: Mode): string {
  switch (mode) {
    case "upper": return input.toUpperCase();
    case "lower": return input.toLowerCase();
    case "title": return input.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    case "sentence": return input.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
    case "camel": {
      const parts = input.toLowerCase().match(/[a-z0-9]+/g) ?? [];
      return parts.map((p, i) => i === 0 ? p : p[0].toUpperCase() + p.slice(1)).join("");
    }
    case "snake": return (input.toLowerCase().match(/[a-z0-9]+/g) ?? []).join("_");
    case "kebab": return (input.toLowerCase().match(/[a-z0-9]+/g) ?? []).join("-");
    case "alt": return input.split("").map((c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase()).join("");
  }
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("title");
  const output = transform(text, mode);

  return (
    <ToolWorkspace toolId="case-converter" actions={
      <>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={output} />
      </>
    }>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} className={`btn-pill !py-1.5 !px-3 text-xs ${mode === m.id ? "btn-primary" : "btn-secondary"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <SplitPanel
          left={<>
            <PanelLabel>Input</PanelLabel>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste any text…"
              className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
          </>}
          right={<>
            <PanelLabel hint={`${output.length} chars`}>Output</PanelLabel>
            <pre className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto">{output || <span className="text-muted-foreground/60">Output will appear here.</span>}</pre>
          </>}
        />
      </div>
    </ToolWorkspace>
  );
}
