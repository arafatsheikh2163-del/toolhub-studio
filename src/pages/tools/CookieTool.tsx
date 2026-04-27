import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea } from "@/components/tools/Field";

export default function CookieTool() {
  const [raw, setRaw] = useState("session=abc123; theme=dark; user_id=42; expires=Wed, 09 Jun 2026 10:18:14 GMT; Path=/; Secure; HttpOnly");
  const cookies = useMemo(() => raw.split(/;\s*/).filter(Boolean).map(p => {
    const i = p.indexOf("=");
    return i === -1 ? { name: p, value: "" } : { name: p.slice(0,i), value: decodeURIComponent(p.slice(i+1)) };
  }), [raw]);
  return (
    <ToolWorkspace toolId="cookie">
      <Field label="Cookie string"><TextArea rows={4} value={raw} onChange={e=>setRaw(e.target.value)} /></Field>
      <div className="mt-4 rounded-md border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.05] text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Value</th></tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cookies.map((c,i)=>(
              <tr key={i} className="hover:bg-white/[0.03]">
                <td className="px-3 py-2 font-mono text-xs">{c.name}</td>
                <td className="px-3 py-2 font-mono text-xs break-all">{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolWorkspace>
  );
}
