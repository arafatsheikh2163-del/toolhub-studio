import { useMemo, useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput, Stat } from "@/components/tools/Field";
import { Plus, Trash2 } from "lucide-react";

interface Stop { id: string; color: string; pos: number; }

export default function GradientGen() {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { id: "1", color: "#292524", pos: 0 },
    { id: "2", color: "#777169", pos: 100 },
  ]);

  const css = useMemo(() => {
    const parts = [...stops].sort((a,b)=>a.pos-b.pos).map(s => `${s.color} ${s.pos}%`).join(", ");
    if (type === "linear") return `linear-gradient(${angle}deg, ${parts})`;
    if (type === "radial") return `radial-gradient(circle at center, ${parts})`;
    return `conic-gradient(from ${angle}deg at 50% 50%, ${parts})`;
  }, [type, angle, stops]);

  return (
    <ToolWorkspace toolId="gradient-gen" actions={<CopyButton text={`background: ${css};`} />}>
      <div className="rounded-2xl border h-72" style={{ background: css }} />

      <div className="grid sm:grid-cols-3 gap-4 mt-5">
        <Field label="Type">
          <select value={type} onChange={(e)=>setType(e.target.value as any)} className="w-full h-10 rounded-md surface-soft border px-3 text-sm">
            <option value="linear">Linear</option><option value="radial">Radial</option><option value="conic">Conic</option>
          </select>
        </Field>
        <Field label={`Angle · ${angle}°`}>
          <input type="range" min={0} max={360} value={angle} onChange={(e)=>setAngle(+e.target.value)} className="w-full" disabled={type==="radial"} />
        </Field>
        <div className="flex items-end">
          <button onClick={()=>setStops(s=>[...s, { id: crypto.randomUUID(), color: "#cccccc", pos: 50 }])} className="btn-3d-light text-xs !px-3"><Plus className="h-3.5 w-3.5" />Add stop</button>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {stops.map(s => (
          <div key={s.id} className="grid grid-cols-12 gap-2 items-center surface-soft rounded-lg p-2.5">
            <input type="color" value={s.color} onChange={(e)=>setStops(arr=>arr.map(x=>x.id===s.id?{...x,color:e.target.value}:x))} className="col-span-2 h-9 w-full rounded-md border cursor-pointer" />
            <TextInput value={s.color} onChange={(e)=>setStops(arr=>arr.map(x=>x.id===s.id?{...x,color:e.target.value}:x))} className="col-span-4" />
            <input type="range" min={0} max={100} value={s.pos} onChange={(e)=>setStops(arr=>arr.map(x=>x.id===s.id?{...x,pos:+e.target.value}:x))} className="col-span-5" />
            <button onClick={()=>setStops(arr=>arr.filter(x=>x.id!==s.id))} className="col-span-1 h-9 grid place-items-center rounded-md hover:bg-foreground/5"><Trash2 className="h-4 w-4 text-muted-foreground" /></button>
          </div>
        ))}
      </div>

      <div className="mt-5 surface-soft rounded-lg p-4">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">CSS</div>
        <pre className="text-xs font-mono break-all whitespace-pre-wrap">background: {css};</pre>
      </div>
    </ToolWorkspace>
  );
}
