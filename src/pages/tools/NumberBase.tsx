import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput } from "@/components/tools/Field";

export default function NumberBase() {
  const [val, setVal] = useState("255");
  const [base, setBase] = useState(10);
  const n = parseInt(val, base);
  const ok = !isNaN(n);
  const rows = [
    { name: "Binary", b: 2 }, { name: "Octal", b: 8 }, { name: "Decimal", b: 10 }, { name: "Hex", b: 16 },
  ];
  return (
    <ToolWorkspace toolId="number-base">
      <div className="grid md:grid-cols-[280px_1fr] gap-5">
        <div className="space-y-3">
          <Field label="Input"><TextInput value={val} onChange={e=>setVal(e.target.value)} /></Field>
          <Field label="Input base">
            <select value={base} onChange={e=>setBase(+e.target.value)} className="w-full h-10 rounded-md bg-black/40 border border-white/10 px-3 text-sm font-mono">
              {rows.map(r=><option key={r.b} value={r.b}>{r.name} (base {r.b})</option>)}
            </select>
          </Field>
        </div>
        <div className="space-y-2">
          {rows.map(r => (
            <div key={r.b} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground w-24">{r.name}</div>
              <div className="flex-1 font-mono text-sm break-all">{ok ? n.toString(r.b).toUpperCase() : "—"}</div>
              {ok && <CopyButton text={n.toString(r.b).toUpperCase()} label="" />}
            </div>
          ))}
        </div>
      </div>
    </ToolWorkspace>
  );
}
