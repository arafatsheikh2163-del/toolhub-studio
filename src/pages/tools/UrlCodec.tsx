import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";

export default function UrlCodec() {
  const [text, setText] = useState("https://example.com/?q=hello world&lang=en");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  let output = "", error: string | null = null;
  try {
    output = mode === "encode" ? encodeURIComponent(text) : decodeURIComponent(text);
  } catch (e) {
    error = e instanceof Error ? e.message : "Conversion failed";
  }

  return (
    <ToolWorkspace toolId="url-codec" actions={
      <>
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
            <PanelLabel>Input</PanelLabel>
            <textarea value={text} onChange={(e) => setText(e.target.value)}
              className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
          </>}
          right={<>
            <PanelLabel>Output</PanelLabel>
            <pre className="w-full h-72 recess rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto">
              {error ? <span className="text-destructive">{error}</span> : (output || <span className="text-muted-foreground/60">Output will appear here.</span>)}
            </pre>
          </>}
        />
      </div>
    </ToolWorkspace>
  );
}
