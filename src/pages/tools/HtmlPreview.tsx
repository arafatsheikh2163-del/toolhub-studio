import { useEffect, useRef, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { useDebounced } from "@/hooks/useDebounced";
import { CopyButton } from "@/components/tools/CopyButton";

const SAMPLE = `<!doctype html>
<html>
<head>
  <style>
    body { font-family: system-ui; padding: 24px; background: #0a0a0a; color: #fafafa; }
    h1 { background: linear-gradient(135deg,#3B82F6,#A855F7,#22D3EE); -webkit-background-clip: text; color: transparent; }
    .card { padding: 16px; border: 1px solid #ffffff20; border-radius: 12px; }
  </style>
</head>
<body>
  <h1>Hello from ToolHub</h1>
  <div class="card">Edit on the left, see results live.</div>
</body>
</html>`;

export default function HtmlPreview() {
  const [text, setText] = useState(SAMPLE);
  const debounced = useDebounced(text, 220);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open(); doc.write(debounced); doc.close();
  }, [debounced]);

  return (
    <ToolWorkspace toolId="html-preview" actions={
      <>
        <button onClick={() => setText(SAMPLE)} className="btn-pill btn-secondary !py-1.5">Sample</button>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={text} />
      </>
    }>
      <SplitPanel
        left={<>
          <PanelLabel hint={`${text.length} chars`}>HTML</PanelLabel>
          <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false}
            className="w-full h-[480px] recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
        </>}
        right={<>
          <PanelLabel>Live preview</PanelLabel>
          <div className="h-[480px] rounded-2xl recess overflow-hidden">
            <iframe ref={iframeRef} title="HTML preview" sandbox="allow-same-origin" className="w-full h-full bg-white" />
          </div>
        </>}
      />
    </ToolWorkspace>
  );
}
