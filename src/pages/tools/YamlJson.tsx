import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea } from "@/components/tools/Field";

// Tiny YAML-ish parser/serializer for common shapes (objects, arrays, scalars).
function yamlToObj(yaml: string): any {
  // Handle flow style by JSON eval first
  try { return JSON.parse(yaml); } catch {}
  const lines = yaml.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith("#"));
  const root: any = {};
  const stack: { indent: number; obj: any }[] = [{ indent: -1, obj: root }];
  for (const line of lines) {
    const indent = line.match(/^ */)![0].length;
    const t = line.trim();
    while (stack.length > 1 && indent <= stack[stack.length-1].indent) stack.pop();
    const top = stack[stack.length-1].obj;
    if (t.startsWith("- ")) {
      if (!Array.isArray(top.__arr)) top.__arr = [];
      top.__arr.push(parseScalar(t.slice(2)));
    } else {
      const m = t.match(/^([^:]+):\s*(.*)$/);
      if (!m) continue;
      const [,k,v] = m;
      if (v === "" || v === "|") {
        const child: any = {};
        top[k] = child;
        stack.push({ indent, obj: child });
      } else {
        top[k] = parseScalar(v);
      }
    }
  }
  // Convert __arr placeholders
  const fix = (o: any): any => {
    if (Array.isArray(o)) return o.map(fix);
    if (o && typeof o === "object") {
      if (o.__arr) return o.__arr.map(fix);
      const r: any = {}; for (const k of Object.keys(o)) r[k] = fix(o[k]); return r;
    }
    return o;
  };
  return fix(root);
}
function parseScalar(s: string) {
  s = s.trim();
  if (s === "true") return true; if (s === "false") return false; if (s === "null"||s === "~") return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1,-1);
  return s;
}
function objToYaml(o: any, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (o === null) return "null";
  if (Array.isArray(o)) return o.map(v => `${pad}- ${typeof v==="object"&&v?objToYaml(v, indent+1).trimStart():JSON.stringify(v)}`).join("\n");
  if (typeof o === "object") return Object.entries(o).map(([k,v]) => {
    if (v && typeof v === "object") return `${pad}${k}:\n${objToYaml(v, indent+1)}`;
    return `${pad}${k}: ${typeof v === "string" && /[:#]/.test(v) ? JSON.stringify(v) : v}`;
  }).join("\n");
  return String(o);
}

export default function YamlJson() {
  const [mode, setMode] = useState<"y2j"|"j2y">("y2j");
  const [input, setInput] = useState("name: Alice\nage: 30\ntags:\n  - admin\n  - user");
  const out = useMemo(() => {
    try {
      if (mode==="y2j") return JSON.stringify(yamlToObj(input), null, 2);
      return objToYaml(JSON.parse(input));
    } catch (e:any) { return "// " + e.message; }
  }, [mode, input]);
  return (
    <ToolWorkspace toolId="yaml-json" actions={<CopyButton text={out} />}>
      <div className="flex gap-2 mb-3">
        <button onClick={()=>setMode("y2j")} className={"text-xs px-3 py-1.5 rounded-md border "+(mode==="y2j"?"bg-foreground text-background border-foreground":"border-white/10")}>YAML → JSON</button>
        <button onClick={()=>setMode("j2y")} className={"text-xs px-3 py-1.5 rounded-md border "+(mode==="j2y"?"bg-foreground text-background border-foreground":"border-white/10")}>JSON → YAML</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Input"><TextArea rows={16} value={input} onChange={e=>setInput(e.target.value)} /></Field>
        <Field label="Output"><TextArea rows={16} readOnly value={out} /></Field>
      </div>
    </ToolWorkspace>
  );
}
