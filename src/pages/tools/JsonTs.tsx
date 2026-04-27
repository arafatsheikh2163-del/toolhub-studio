import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea } from "@/components/tools/Field";

function infer(value: any, name = "Root", out: string[] = [], seen = new Set<string>()): string {
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1).replace(/[^a-zA-Z0-9]/g,"");
  const typeOf = (v: any): string => {
    if (v === null) return "null";
    if (Array.isArray(v)) {
      if (v.length === 0) return "any[]";
      const types = Array.from(new Set(v.map(x => typeOf(x))));
      return types.length===1?`${types[0]}[]`:`(${types.join(" | ")})[]`;
    }
    if (typeof v === "object") {
      const ifname = cap(name);
      if (!seen.has(ifname)) {
        seen.add(ifname);
        const lines = Object.entries(v).map(([k,val]) => `  ${/^[a-zA-Z_$][\w$]*$/.test(k)?k:JSON.stringify(k)}: ${typeOf(val) === "object" ? cap(k) : (typeof val === "object" && val ? cap(k) : typeOf(val))};`);
        // re-walk to emit children interfaces
        for (const [k,val] of Object.entries(v)) if (val && typeof val === "object" && !Array.isArray(val)) infer(val, k, out, seen);
        for (const [k,val] of Object.entries(v)) if (Array.isArray(val) && val[0] && typeof val[0] === "object") infer(val[0], k, out, seen);
        out.push(`export interface ${ifname} {\n${lines.join("\n")}\n}`);
      }
      return ifname;
    }
    return typeof v;
  };
  typeOf(value);
  return out.join("\n\n");
}

export default function JsonTs() {
  const [json, setJson] = useState('{"name":"Ada","age":36,"tags":["admin","user"],"profile":{"city":"London"}}');
  const [name, setName] = useState("Root");
  const out = useMemo(() => {
    try { return infer(JSON.parse(json), name); }
    catch (e:any) { return "// " + e.message; }
  }, [json, name]);
  return (
    <ToolWorkspace toolId="json-ts" actions={<CopyButton text={out} />}>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-3">
          <Field label="Root interface name"><input value={name} onChange={e=>setName(e.target.value||"Root")} className="w-full h-10 rounded-md bg-black/40 border border-white/10 px-3 text-sm font-mono outline-none" /></Field>
          <Field label="JSON input"><TextArea rows={16} value={json} onChange={e=>setJson(e.target.value)} /></Field>
        </div>
        <Field label="TypeScript"><TextArea rows={20} readOnly value={out} /></Field>
      </div>
    </ToolWorkspace>
  );
}
