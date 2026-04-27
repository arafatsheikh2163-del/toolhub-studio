import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { SplitPanel, PanelLabel } from "@/components/tools/SplitPanel";
import { CopyButton } from "@/components/tools/CopyButton";

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}

const SAMPLE = `/* Sample */
.card {
  padding: 16px 24px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: linear-gradient(135deg, #3B82F6, #A855F7);
}

.btn:hover { transform: translateY(-1px); }`;

export default function CssMinify() {
  const [text, setText] = useState(SAMPLE);
  const output = minifyCss(text);
  const saved = Math.max(0, text.length - output.length);
  const ratio = text.length ? Math.round((saved / text.length) * 100) : 0;

  return (
    <ToolWorkspace toolId="css-minify" actions={
      <>
        <button onClick={() => setText(SAMPLE)} className="btn-pill btn-secondary !py-1.5">Sample</button>
        <button onClick={() => setText("")} className="btn-pill btn-secondary !py-1.5">Reset</button>
        <CopyButton text={output} />
      </>
    }>
      <div className="space-y-4">
        <SplitPanel
          left={<>
            <PanelLabel hint={`${text.length} chars`}>Source CSS</PanelLabel>
            <textarea value={text} onChange={(e) => setText(e.target.value)} spellCheck={false}
              className="w-full h-[420px] recess rounded-2xl p-4 text-sm font-mono resize-y outline-none focus:ring-1 focus:ring-primary/50" />
          </>}
          right={<>
            <PanelLabel hint={`${output.length} chars · ${ratio}% smaller`}>Minified</PanelLabel>
            <pre className="w-full h-[420px] recess rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap break-words overflow-auto">{output || <span className="text-muted-foreground/60">Output will appear here.</span>}</pre>
          </>}
        />
      </div>
    </ToolWorkspace>
  );
}
