import { useMemo, useState } from "react";
import { marked } from "marked";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea } from "@/components/tools/Field";

const SAMPLE = `# Hello World\n\nThis is **bold**, *italic*, and \`code\`.\n\n- One\n- Two\n- Three\n\n[Lovable](https://lovable.dev)\n\n\`\`\`js\nconsole.log("hi");\n\`\`\``;

export default function MdHtml() {
  const [md, setMd] = useState(SAMPLE);
  const html = useMemo(() => marked.parse(md, { async: false }) as string, [md]);
  return (
    <ToolWorkspace toolId="md-html" actions={<CopyButton text={html} label="Copy HTML" />}>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Markdown"><TextArea rows={20} value={md} onChange={e=>setMd(e.target.value)} /></Field>
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-1.5">Preview</div>
          <div className="rounded-md bg-black/40 border border-white/10 p-4 prose prose-invert prose-sm max-w-none h-[480px] overflow-auto" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </ToolWorkspace>
  );
}
