import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";
import { ArrowDownUp } from "lucide-react";

export default function Base64() {
  const [text, setText] = useState("Hello, ToolHub Ultra ✨");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  let output = "";
  let error: string | null = null;
  try {
    if (mode === "encode") {
      output = btoa(unescape(encodeURIComponent(text)));
    } else {
      output = decodeURIComponent(escape(atob(text.trim())));
    }
  } catch (e) {
    error = e instanceof Error ? e.message : "Conversion failed";
  }

  return (
    <ToolWorkspace toolId="base64" actions={
      <>
        <button onClick={() => setMode(m => m === "encode" ? "decode" : "encode")} className="btn-pill btn-secondary !py-1.5">
          <ArrowDownUp className="h-3.5 w-3.5" /> Swap
        </button>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={error ? "" : output} />
      </>
    }>
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setMode("encode")} className={`btn-pill !py-1.5 !px-4 text-xs ${mode === "encode" ? "btn-primary" : "btn-secondary"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`btn-pill !py-1.5 !px-4 text-xs ${mode === "decode" ? "btn-primary" : "btn-secondary"}`}>Decode</button>
        </div>
        <SplitPanel
          left={<>
            <PanelLabel>{mode === "encode" ? "Plain text" : "Base64"}</PanelLabel>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
          </>}
          right={<>
            <PanelLabel>{mode === "encode" ? "Base64" : "Plain text"}</PanelLabel>
            <pre className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto">
              {error ? <span className="text-destructive">{error}</span> : (output || <span className="text-muted-foreground/60">Output will appear here.</span>)}
            </pre>
          </>}
        />
      </div>
    </ToolWorkspace>
  );
}
