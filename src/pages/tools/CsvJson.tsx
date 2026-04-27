import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextArea } from "@/components/tools/Field";

function parseCsv(text: string) {
  const rows: string[][] = [];
  let cur: string[] = [], val = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i+1] === '"') { val += '"'; i++; }
      else if (c === '"') inQ = false;
      else val += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ',') { cur.push(val); val = ""; }
      else if (c === '\n') { cur.push(val); rows.push(cur); cur = []; val = ""; }
      else if (c !== '\r') val += c;
    }
  }
  if (val !== "" || cur.length) { cur.push(val); rows.push(cur); }
  return rows;
}
function toJson(rows: string[][]) {
  if (rows.length < 1) return [];
  const [head, ...rest] = rows;
  return rest.map(r => Object.fromEntries(head.map((h,i) => [h, r[i] ?? ""])));
}
function toCsv(arr: any[]) {
  if (!Array.isArray(arr) || !arr.length) return "";
  const keys = Array.from(new Set(arr.flatMap(o => Object.keys(o||{}))));
  const esc = (v: any) => { const s = v==null?"":String(v); return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s; };
  return [keys.join(","), ...arr.map(o => keys.map(k=>esc(o[k])).join(","))].join("\n");
}

export default function CsvJson() {
  const [mode, setMode] = useState<"csv2json"|"json2csv">("csv2json");
  const [input, setInput] = useState("name,age\nAlice,30\nBob,25");
  const out = useMemo(() => {
    try {
      if (mode==="csv2json") return JSON.stringify(toJson(parseCsv(input)), null, 2);
      return toCsv(JSON.parse(input));
    } catch (e:any) { return "// " + e.message; }
  }, [mode, input]);

  const swap = () => {
    setMode(m => m==="csv2json"?"json2csv":"csv2json");
    setInput(out);
  };
  return (
    <ToolWorkspace toolId="csv-json" actions={<CopyButton text={out} />}>
      <div className="flex gap-2 mb-3">
        <button onClick={()=>setMode("csv2json")} className={"text-xs px-3 py-1.5 rounded-md border "+(mode==="csv2json"?"bg-foreground text-background border-foreground":"border-white/10")}>CSV → JSON</button>
        <button onClick={()=>setMode("json2csv")} className={"text-xs px-3 py-1.5 rounded-md border "+(mode==="json2csv"?"bg-foreground text-background border-foreground":"border-white/10")}>JSON → CSV</button>
        <button onClick={swap} className="text-xs px-3 py-1.5 rounded-md border border-white/10 ml-auto">⇄ Swap</button>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Input"><TextArea rows={16} value={input} onChange={e=>setInput(e.target.value)} /></Field>
        <Field label="Output"><TextArea rows={16} readOnly value={out} /></Field>
      </div>
    </ToolWorkspace>
  );
}
