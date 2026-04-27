import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function JsonFormat() {
  const [text, setText] = useState(`{"name":"ToolHub","items":[1,2,3],"meta":{"ok":true}}`);
  const [indent, setIndent] = useState(2);

  const result = useMemo(() => {
    if (!text.trim()) return { ok: true as const, value: "" };
    try {
      const parsed = JSON.parse(text);
      return { ok: true as const, value: JSON.stringify(parsed, null, indent) };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Invalid JSON";
      const m = msg.match(/position (\d+)/);
      let line: number | null = null;
      if (m) {
        const pos = parseInt(m[1], 10);
        line = text.slice(0, pos).split("\n").length;
      }
      return { ok: false as const, error: msg, line };
    }
  }, [text, indent]);

  const minify = () => {
    try { setText(JSON.stringify(JSON.parse(text))); } catch { /* noop */ }
  };
  const beautify = () => {
    if (result.ok) setText(result.value);
  };

  return (
    <ToolWorkspace toolId="json-format" actions={
      <>
        <button onClick={minify} className="btn-pill btn-secondary !py-1.5">Minify</button>
        <button onClick={beautify} className="btn-pill btn-secondary !py-1.5">Beautify</button>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={result.ok ? result.value : ""} />
      </>
    }>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground mr-1">Indent</span>
          {[2, 4, 0].map(n => (
            <button key={n} onClick={() => setIndent(n)} className={`btn-pill !py-1 !px-3 text-xs ${indent === n ? "btn-primary" : "btn-secondary"}`}>
              {n === 0 ? "Tab" : `${n} sp`}
            </button>
          ))}
        </div>
        <SplitPanel
          left={<>
            <PanelLabel hint={`${text.length} chars`}>Input</PanelLabel>
            <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false}
              placeholder='{"hello":"world"}'
              className="w-full h-[420px] recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
          </>}
          right={<>
            <PanelLabel hint={result.ok ? `${(result.value || "").length} chars` : undefined}>Output</PanelLabel>
            <div className="relative h-[420px]">
              <pre className="w-full h-full recess rounded-2xl p-4 text-sm font-mono whitespace-pre overflow-auto">
                {result.ok
                  ? (result.value
                    ? <code>{result.value}</code>
                    : <span className="text-muted-foreground/60">Output will appear here.</span>)
                  : <span className="text-muted-foreground/60">Fix the error to see formatted JSON.</span>}
              </pre>
            </div>
          </>}
        />
        <div className={`rounded-xl px-4 py-3 text-sm flex items-start gap-3 border ${result.ok ? "border-success/20 bg-success/5 text-success" : "border-destructive/30 bg-destructive/5 text-destructive"}`}>
          {result.ok ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />}
          <div className="font-mono text-xs">
            {result.ok ? "Valid JSON" : `${result.error}${result.line ? ` (line ${result.line})` : ""}`}
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
