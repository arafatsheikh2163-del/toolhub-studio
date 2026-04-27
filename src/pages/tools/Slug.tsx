import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea } from "@/components/tools/Field";

function slugify(s: string, sep: string) {
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase()
    .replace(/[^a-z0-9\s-]/g,"").trim().replace(/[\s_-]+/g, sep).replace(new RegExp(`^${sep}+|${sep}+$`,"g"),"");
}

export default function Slug() {
  const [text, setText] = useState("Hello World — This is My Article!");
  const [sep, setSep] = useState("-");
  const out = useMemo(() => text.split("\n").map(l => slugify(l, sep)).join("\n"), [text, sep]);
  return (
    <ToolWorkspace toolId="slug" actions={<CopyButton text={out} />}>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Input"><TextArea rows={10} value={text} onChange={e=>setText(e.target.value)} /></Field>
        <Field label="Output"><TextArea rows={10} readOnly value={out} /></Field>
      </div>
      <div className="mt-4 flex gap-2">
        {["-","_","."].map(s=>(
          <button key={s} onClick={()=>setSep(s)} className={"text-xs px-3 py-1.5 rounded-md border "+(sep===s?"bg-foreground text-background border-foreground":"border-white/10")}>{s}</button>
        ))}
      </div>
    </ToolWorkspace>
  );
}
