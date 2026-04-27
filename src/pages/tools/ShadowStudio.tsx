import { useState } from "react";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { CopyButton } from "@/components/tools/CopyButton";
import { Field, TextInput } from "@/components/tools/Field";

interface L { x:number; y:number; blur:number; spread:number; color:string; inset:boolean; }

export default function ShadowStudio() {
  const [layers, setLayers] = useState<L[]>([{ x:0, y:8, blur:24, spread:-4, color:"#000000aa", inset:false }]);
  const css = layers.map(l => `${l.inset?"inset ":""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}`).join(",\n  ");
  return (
    <ToolWorkspace toolId="shadow-studio" actions={<CopyButton text={`box-shadow: ${css};`} label="Copy CSS" />}>
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <div className="space-y-3">
          {layers.map((l, i) => (
            <div key={i} className="rounded-md border border-white/10 bg-white/[0.03] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono">Layer {i+1}</div>
                <button onClick={()=>setLayers(L=>L.filter((_,j)=>j!==i))} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["x","y","blur","spread"] as const).map(k => (
                  <Field key={k} label={k}><TextInput type="number" value={l[k]} onChange={e=>setLayers(L=>L.map((x,j)=>j===i?{...x,[k]:+e.target.value}:x))} /></Field>
                ))}
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                <Field label="Color"><TextInput type="color" value={l.color.slice(0,7)} onChange={e=>setLayers(L=>L.map((x,j)=>j===i?{...x,color:e.target.value+"aa"}:x))} className="!h-10 !p-1" /></Field>
                <label className="flex items-center gap-2 px-3 py-2 text-xs rounded-md border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={l.inset} onChange={e=>setLayers(L=>L.map((x,j)=>j===i?{...x,inset:e.target.checked}:x))} className="accent-white" /> inset
                </label>
              </div>
            </div>
          ))}
          <button onClick={()=>setLayers(L=>[...L,{x:0,y:4,blur:12,spread:0,color:"#000000aa",inset:false}])} className="btn-3d-dark text-xs !px-3.5 !py-1.5"><span className="relative z-10">+ Add layer</span></button>
        </div>
        <div className="rounded-lg p-8 grid place-items-center bg-white/[0.04]">
          <div className="h-40 w-40 rounded-2xl bg-white" style={{ boxShadow: css }} />
        </div>
      </div>
      <pre className="mt-4 rounded-md bg-black/40 border border-white/10 p-3 text-xs font-mono whitespace-pre-wrap">box-shadow: {css};</pre>
    </ToolWorkspace>
  );
}
