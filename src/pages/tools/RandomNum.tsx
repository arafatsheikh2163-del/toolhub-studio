import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput } from "@/components/tools/Field";
import { RefreshCw } from "lucide-react";

export default function RandomNum() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [unique, setUnique] = useState(false);
  const [out, setOut] = useState<number[]>([]);

  const gen = () => {
    const lo = Math.min(min,max), hi = Math.max(min,max);
    const range = hi - lo + 1;
    if (unique) {
      const set = new Set<number>();
      const limit = Math.min(count, range);
      while (set.size < limit) set.add(lo + Math.floor(Math.random()*range));
      setOut([...set]);
    } else {
      setOut(Array.from({length:count}, () => lo + Math.floor(Math.random()*range)));
    }
  };
  return (
    <ToolWorkspace toolId="random-num" actions={
      <button onClick={gen} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><RefreshCw className="h-3.5 w-3.5 relative z-10" /><span className="relative z-10">Generate</span></button>
    }>
      <div className="grid md:grid-cols-4 gap-3">
        <Field label="Min"><TextInput type="number" value={min} onChange={e=>setMin(+e.target.value)} /></Field>
        <Field label="Max"><TextInput type="number" value={max} onChange={e=>setMax(+e.target.value)} /></Field>
        <Field label="Count"><TextInput type="number" value={count} min={1} max={1000} onChange={e=>setCount(+e.target.value)} /></Field>
        <Field label="Unique">
          <button onClick={()=>setUnique(u=>!u)} className={"h-10 w-full rounded-md border text-sm "+(unique?"bg-foreground text-background":"border-white/10")}>{unique?"On":"Off"}</button>
        </Field>
      </div>
      <div className="mt-5 rounded-lg recess p-5 min-h-[120px] flex flex-wrap gap-2">
        {out.length === 0 ? <span className="text-sm text-muted-foreground">Click Generate.</span> :
          out.map((n,i)=>(<span key={i} className="px-3 py-1.5 rounded-md bg-white/[0.06] border border-white/[0.10] font-mono tabular-nums text-sm">{n}</span>))}
      </div>
      {out.length>0 && <div className="mt-3"><CopyButton text={out.join(", ")} /></div>}
    </ToolWorkspace>
  );
}
