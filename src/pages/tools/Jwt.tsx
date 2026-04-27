import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Field, TextArea } from "@/components/tools/Field";

function decode(part: string) {
  try {
    const pad = "=".repeat((4 - (part.length % 4)) % 4);
    const s = atob(part.replace(/-/g,"+").replace(/_/g,"/") + pad);
    return JSON.stringify(JSON.parse(s), null, 2);
  } catch (e:any) { return "// " + e.message; }
}
const SAMPLE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function Jwt() {
  const [token, setToken] = useState(SAMPLE);
  const parts = token.split(".");
  const header = useMemo(()=>parts[0]?decode(parts[0]):"",[token]);
  const payload = useMemo(()=>parts[1]?decode(parts[1]):"",[token]);
  return (
    <ToolWorkspace toolId="jwt">
      <Field label="JWT"><TextArea rows={5} value={token} onChange={e=>setToken(e.target.value.trim())} className="break-all" /></Field>
      <div className="grid md:grid-cols-2 gap-3 mt-4">
        <Field label="Header"><TextArea rows={10} readOnly value={header} /></Field>
        <Field label="Payload"><TextArea rows={10} readOnly value={payload} /></Field>
      </div>
      <div className="mt-3 text-[11px] text-muted-foreground">Signature: <span className="font-mono break-all">{parts[2] || "—"}</span></div>
    </ToolWorkspace>
  );
}
