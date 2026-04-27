import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";

export default function Whitespace() {
  const [text, setText] = useState("");
  const [opts, setOpts] = useState({ trim: true, collapseSpaces: true, removeBlankLines: true, tabsToSpaces: true });

  const transform = (s: string) => {
    let out = s;
    if (opts.tabsToSpaces) out = out.replace(/\t/g, "  ");
    if (opts.collapseSpaces) out = out.replace(/[ \t]+/g, " ");
    if (opts.removeBlankLines) out = out.replace(/\n\s*\n+/g, "\n");
    if (opts.trim) out = out.split("\n").map(l => l.trim()).join("\n").trim();
    return out;
  };
  const output = transform(text);

  const Toggle = ({ k, label }: { k: keyof typeof opts; label: string }) => (
    <button
      onClick={() => setOpts(o => ({ ...o, [k]: !o[k] }))}
      className={`btn-pill !py-1.5 !px-3 text-xs ${opts[k] ? "btn-primary" : "btn-secondary"}`}>
      {label}
    </button>
  );

  return (
    <ToolWorkspace toolId="whitespace" actions={
      <>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={output} />
      </>
    }>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Toggle k="trim" label="Trim lines" />
          <Toggle k="collapseSpaces" label="Collapse spaces" />
          <Toggle k="removeBlankLines" label="Remove blank lines" />
          <Toggle k="tabsToSpaces" label="Tabs → spaces" />
        </div>
        <SplitPanel
          left={<>
            <PanelLabel hint={`${text.length} chars`}>Input</PanelLabel>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste messy text…"
              className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
          </>}
          right={<>
            <PanelLabel hint={`${output.length} chars · saved ${Math.max(0, text.length - output.length)}`}>Cleaned</PanelLabel>
            <pre className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto">{output || <span className="text-muted-foreground/60">Output will appear here.</span>}</pre>
          </>}
        />
      </div>
    </ToolWorkspace>
  );
}
