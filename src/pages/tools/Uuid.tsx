import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field } from "@/components/tools/Field";
import { RefreshCw } from "lucide-react";

export default function Uuid() {
  const [n, setN] = useState(8);
  const [list, setList] = useState<string[]>(() => Array.from({length:8}, () => crypto.randomUUID()));
  const gen = () => setList(Array.from({length:n}, () => crypto.randomUUID()));
  return (
    <ToolWorkspace toolId="uuid" actions={
      <button onClick={gen} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><RefreshCw className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Regenerate</span></button>
    }>
      <div className="space-y-4">
        <Field label={`Count: ${n}`}>
          <input type="range" min={1} max={50} value={n} onChange={e=>setN(+e.target.value)} className="w-full accent-white" />
        </Field>
        <div className="rounded-lg recess p-3 max-h-[420px] overflow-auto space-y-1">
          {list.map((u,i)=>(
            <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-white/[0.04] group">
              <span className="text-[11px] text-muted-foreground font-mono w-6 tabular-nums">{i+1}</span>
              <span className="flex-1 font-mono text-sm">{u}</span>
              <CopyButton text={u} label="" className="opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
        <CopyButton text={list.join("\n")} label="Copy all" />
      </div>
    </ToolWorkspace>
  );
}
