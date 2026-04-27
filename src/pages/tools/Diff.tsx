import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea } from "@/components/tools/Field";

function diff(a: string, b: string) {
  const la = a.split("\n"), lb = b.split("\n");
  const len = Math.max(la.length, lb.length);
  const rows: { a?: string; b?: string; same: boolean }[] = [];
  for (let i = 0; i < len; i++) rows.push({ a: la[i], b: lb[i], same: la[i] === lb[i] });
  return rows;
}

export default function Diff() {
  const [a, setA] = useState("Hello world\nThis is line two\nA shared line");
  const [b, setB] = useState("Hello there\nThis is line two\nA shared line\nNew line");
  const rows = useMemo(()=>diff(a,b),[a,b]);
  return (
    <ToolWorkspace toolId="diff">
      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <Field label="Original"><TextArea rows={8} value={a} onChange={e=>setA(e.target.value)} /></Field>
        <Field label="Modified"><TextArea rows={8} value={b} onChange={e=>setB(e.target.value)} /></Field>
      </div>
      <div className="rounded-md border border-white/10 overflow-hidden divide-y divide-white/5 font-mono text-xs">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-2 gap-px bg-white/[0.04]">
            <div className={"px-3 py-1.5 " + (!r.same && r.a !== undefined ? "bg-red-500/10 text-red-200" : "bg-black/30")}>
              <span className="text-muted-foreground mr-2">{i+1}</span>{r.a ?? <span className="text-muted-foreground">—</span>}
            </div>
            <div className={"px-3 py-1.5 " + (!r.same && r.b !== undefined ? "bg-emerald-500/10 text-emerald-200" : "bg-black/30")}>
              <span className="text-muted-foreground mr-2">{i+1}</span>{r.b ?? <span className="text-muted-foreground">—</span>}
            </div>
          </div>
        ))}
      </div>
    </ToolWorkspace>
  );
}
